/**
 * Centralized Error Handler
 * Uses error classes for structured error handling
 */

import { notify } from '../Utiles/notif';
import { log } from '../config/environment';
import { tokenManager } from '../utils/tokenManager';
import { AppError, AuthenticationError, ErrorSeverity } from './AppError';
import { ErrorFactory } from './ErrorFactory';

export class ErrorHandler {
  private static errorCounts: Map<string, number> = new Map();
  private static lastErrorTime: Map<string, number> = new Map();
  private static readonly MAX_SAME_ERRORS = 3;
  private static readonly ERROR_RESET_TIME = 30000; // 30 seconds

  /**
   * Handle any error and convert to AppError
   */
  static handle(error: unknown, context?: Record<string, unknown>): AppError {
    const appError = ErrorFactory.fromUnknown(error, context);
    
    this.processError(appError);
    return appError;
  }

  /**
   * Handle API/Network errors specifically
   */
  static handleApiError(error: unknown, showNotification: boolean = true): AppError {
    const appError = ErrorFactory.fromUnknown(error, { source: 'api' });
    
    this.processError(appError, showNotification);
    return appError;
  }

  /**
   * Handle JavaScript errors
   */
  static handleJavaScriptError(error: Error, errorInfo?: unknown): AppError {
    const appError = ErrorFactory.fromJavaScriptError(error, { errorInfo });
    
    this.processError(appError);
    return appError;
  }

  /**
   * Handle validation errors
   */
  static handleValidationError(fieldErrors: Record<string, string>): AppError {
    const appError = ErrorFactory.fromValidation(fieldErrors);
    
    this.processError(appError);
    return appError;
  }

  /**
   * Process error (log, notify, handle auth, etc.)
   */
  private static processError(error: AppError, showNotification: boolean = true): void {
    // Handle authentication errors
    if (error instanceof AuthenticationError) {
      this.handleAuthError();
      return; // Don't show notification for auth errors
    }

    // Log error if needed
    if (error.shouldBeLogged()) {
      this.logError(error);
    }

    // Show user notification if needed and not rate-limited
    if (showNotification && this.shouldShowNotification(error)) {
      this.showNotification(error);
    }
  }

  /**
   * Handle authentication errors
   */
  private static handleAuthError(): void {
    log.warn('Authentication error - cleaning up session');
    tokenManager.removeToken();
    
    // Redirect to login if not already there
    if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
      log.info('Redirecting to login page');
      window.location.href = '/login';
    }
  }

  /**
   * Log error with appropriate level
   */
  private static logError(error: AppError): void {
    const logData = {
      ...error.toJSON(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        log.error(`[CRITICAL] ${error.name}:`, logData);
        break;
      case ErrorSeverity.HIGH:
        log.error(`[HIGH] ${error.name}:`, logData);
        break;
      case ErrorSeverity.MEDIUM:
        log.warn(`[MEDIUM] ${error.name}:`, logData);
        break;
      case ErrorSeverity.LOW:
        log.info(`[LOW] ${error.name}:`, logData);
        break;
    }
  }

  /**
   * Check if we should show notification (rate limiting)
   */
  private static shouldShowNotification(error: AppError): boolean {
    const errorKey = `${error.code}-${error.getUserMessage()}`;
    const now = Date.now();
    
    // Check if we should reset error count
    const lastTime = this.lastErrorTime.get(errorKey) || 0;
    if (now - lastTime > this.ERROR_RESET_TIME) {
      this.errorCounts.set(errorKey, 0);
    }
    
    // Get current count
    const count = this.errorCounts.get(errorKey) || 0;
    
    // Update counts
    this.errorCounts.set(errorKey, count + 1);
    this.lastErrorTime.set(errorKey, now);
    
    // Don't show if too many of the same error
    return count < this.MAX_SAME_ERRORS;
  }

  /**
   * Show appropriate notification
   */
  private static showNotification(error: AppError): void {
    const message = error.getUserMessage();
    
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        notify.error(message);
        break;
      case ErrorSeverity.MEDIUM:
        notify.error(message);
        break;
      case ErrorSeverity.LOW:
        notify.warn(message);
        break;
    }
  }

  /**
   * Clear error rate limiting (useful for testing)
   */
  static clearErrorCounts(): void {
    this.errorCounts.clear();
    this.lastErrorTime.clear();
  }

  /**
   * Handle global unhandled promise rejections
   */
  static handleUnhandledRejection(event: PromiseRejectionEvent): void {
    log.error('Unhandled promise rejection:', event.reason);
    
    // Prevent default browser behavior
    event.preventDefault();
    
    // Handle the error appropriately
    const appError = this.handle(event.reason, { source: 'unhandledRejection' });
    
    // Don't show notification if it's an auth error (already handled)
    if (!(appError instanceof AuthenticationError)) {
      this.showNotification(appError);
    }
  }

  /**
   * Handle global uncaught errors
   */
  static handleUncaughtError(event: ErrorEvent): void {
    log.error('Uncaught error:', event.error);
    
    const error = event.error || new Error(event.message);
    const appError = this.handleJavaScriptError(error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
    
    this.showNotification(appError);
  }

  /**
   * Create error boundary error handler
   */
  static createErrorBoundaryHandler() {
    return (error: Error, errorInfo: unknown) => {
      return this.handleJavaScriptError(error, errorInfo);
    };
  }

  /**
   * Create async error handler for promises
   */
  static createAsyncHandler<T>(
    operation: () => Promise<T>,
    context?: Record<string, unknown>
  ): Promise<T> {
    return operation().catch((error) => {
      const appError = this.handle(error, context);
      throw appError;
    });
  }

  /**
   * Validate file with error handling
   */
  static validateFile(
    file: File, 
    maxSize: number, 
    allowedTypes: string[]
  ): void {
    const error = ErrorFactory.validateFile(file, maxSize, allowedTypes);
    if (error) {
      this.processError(error);
      throw error;
    }
  }
}

// Set up global error handlers
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', ErrorHandler.handleUnhandledRejection);
  window.addEventListener('error', ErrorHandler.handleUncaughtError);
}

// Export singleton instance
export const errorHandler = ErrorHandler;