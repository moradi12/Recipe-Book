/**
 * Custom Application Error Classes
 * Provides structured error handling with specific error types
 */

export enum ErrorCode {
  // Network & API Errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // Authentication Errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Validation Errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  REQUIRED_FIELD = 'REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Resource Errors
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  
  // File Errors
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  
  // Business Logic Errors
  RECIPE_NOT_FOUND = 'RECIPE_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  FAVORITE_EXISTS = 'FAVORITE_EXISTS',
  
  // System Errors
  SERVER_ERROR = 'SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Base Application Error Class
 */
export abstract class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly severity: ErrorSeverity;
  public readonly timestamp: Date;
  public readonly userMessage: string;
  public readonly context?: Record<string, unknown>;
  public readonly canRetry: boolean;
  public readonly shouldLog: boolean;

  constructor(
    message: string,
    code: ErrorCode,
    userMessage: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: Record<string, unknown>,
    canRetry: boolean = false,
    shouldLog: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.severity = severity;
    this.userMessage = userMessage;
    this.timestamp = new Date();
    this.context = context;
    this.canRetry = canRetry;
    this.shouldLog = shouldLog;

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * Convert error to JSON for logging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      userMessage: this.userMessage,
      code: this.code,
      severity: this.severity,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      canRetry: this.canRetry,
      stack: this.stack,
    };
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    return this.userMessage;
  }

  /**
   * Check if error can be retried
   */
  isRetryable(): boolean {
    return this.canRetry;
  }

  /**
   * Check if error should be logged
   */
  shouldBeLogged(): boolean {
    return this.shouldLog;
  }
}

/**
 * Network and API Errors
 */
export class NetworkError extends AppError {
  constructor(message: string = 'Network connection failed', context?: Record<string, unknown>) {
    super(
      message,
      ErrorCode.NETWORK_ERROR,
      'Unable to connect to the server. Please check your internet connection.',
      ErrorSeverity.HIGH,
      context,
      true // Can retry
    );
  }
}

export class ApiError extends AppError {
  public readonly status: number;
  public readonly endpoint?: string;

  constructor(
    message: string,
    status: number,
    userMessage?: string,
    endpoint?: string,
    context?: Record<string, unknown>
  ) {
    const defaultUserMessage = ApiError.getDefaultUserMessage(status);
    
    super(
      message,
      ErrorCode.API_ERROR,
      userMessage || defaultUserMessage,
      ApiError.getSeverityByStatus(status),
      { ...context, status, endpoint },
      status >= 500, // Server errors can be retried
      true
    );
    
    this.status = status;
    this.endpoint = endpoint;
  }

  private static getDefaultUserMessage(status: number): string {
    switch (status) {
      case 400: return 'Please check your input and try again';
      case 401: return 'Please log in to continue';
      case 403: return 'You don\'t have permission to perform this action';
      case 404: return 'The requested item was not found';
      case 409: return 'This item already exists or conflicts with existing data';
      case 422: return 'Please check your input';
      case 429: return 'Too many requests. Please wait a moment and try again';
      case 500: return 'A server error occurred. Please try again later';
      case 502: return 'Service is temporarily unavailable';
      case 503: return 'Service is under maintenance. Please try again later';
      default: return 'Something went wrong. Please try again';
    }
  }

  private static getSeverityByStatus(status: number): ErrorSeverity {
    if (status >= 500) return ErrorSeverity.HIGH;
    if (status >= 400) return ErrorSeverity.MEDIUM;
    return ErrorSeverity.LOW;
  }
}

/**
 * Authentication Errors
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', context?: Record<string, unknown>) {
    super(
      message,
      ErrorCode.UNAUTHORIZED,
      'Please log in to continue',
      ErrorSeverity.MEDIUM,
      context,
      false
    );
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied', context?: Record<string, unknown>) {
    super(
      message,
      ErrorCode.FORBIDDEN,
      'You don\'t have permission to perform this action',
      ErrorSeverity.MEDIUM,
      context,
      false
    );
  }
}

/**
 * Validation Errors
 */
export class ValidationError extends AppError {
  public readonly fieldErrors: Record<string, string>;

  constructor(
    fieldErrors: Record<string, string>,
    message: string = 'Validation failed',
    context?: Record<string, unknown>
  ) {
    const userMessage = Object.keys(fieldErrors).length > 1
      ? 'Please fix the highlighted fields'
      : Object.values(fieldErrors)[0] || 'Please check your input';

    super(
      message,
      ErrorCode.VALIDATION_ERROR,
      userMessage,
      ErrorSeverity.LOW,
      { ...context, fieldErrors },
      false,
      false // Don't log validation errors
    );

    this.fieldErrors = fieldErrors;
  }

  getFieldError(field: string): string | undefined {
    return this.fieldErrors[field];
  }

  hasFieldError(field: string): boolean {
    return field in this.fieldErrors;
  }
}

/**
 * File Upload Errors
 */
export class FileError extends AppError {
  public readonly file?: File;

  constructor(
    message: string,
    code: ErrorCode,
    userMessage: string,
    file?: File,
    context?: Record<string, unknown>
  ) {
    super(
      message,
      code,
      userMessage,
      ErrorSeverity.LOW,
      { ...context, fileName: file?.name, fileSize: file?.size },
      false,
      false
    );
    this.file = file;
  }
}

export class FileTooLargeError extends FileError {
  constructor(file: File, maxSize: number) {
    const maxSizeMB = Math.round(maxSize / 1024 / 1024);
    const fileSizeMB = Math.round(file.size / 1024 / 1024);
    
    super(
      `File ${file.name} is too large (${fileSizeMB}MB)`,
      ErrorCode.FILE_TOO_LARGE,
      `File is too large. Maximum size is ${maxSizeMB}MB`,
      file,
      { maxSize, fileSize: file.size }
    );
  }
}

export class InvalidFileTypeError extends FileError {
  constructor(file: File, allowedTypes: string[]) {
    super(
      `Invalid file type: ${file.type}`,
      ErrorCode.INVALID_FILE_TYPE,
      `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      file,
      { allowedTypes, fileType: file.type }
    );
  }
}

/**
 * Business Logic Errors
 */
export class RecipeNotFoundError extends AppError {
  constructor(recipeId: number | string) {
    super(
      `Recipe with ID ${recipeId} not found`,
      ErrorCode.RECIPE_NOT_FOUND,
      'Recipe not found',
      ErrorSeverity.LOW,
      { recipeId },
      false
    );
  }
}

export class UserNotFoundError extends AppError {
  constructor(identifier: string) {
    super(
      `User not found: ${identifier}`,
      ErrorCode.USER_NOT_FOUND,
      'User not found',
      ErrorSeverity.LOW,
      { identifier },
      false
    );
  }
}

export class FavoriteExistsError extends AppError {
  constructor(recipeId: number) {
    super(
      `Recipe ${recipeId} is already in favorites`,
      ErrorCode.FAVORITE_EXISTS,
      'Recipe is already in your favorites',
      ErrorSeverity.LOW,
      { recipeId },
      false,
      false
    );
  }
}

/**
 * System Errors
 */
export class ServerError extends AppError {
  constructor(message: string = 'Internal server error', context?: Record<string, unknown>) {
    super(
      message,
      ErrorCode.SERVER_ERROR,
      'A server error occurred. Please try again later',
      ErrorSeverity.CRITICAL,
      context,
      true
    );
  }
}

export class TimeoutError extends AppError {
  constructor(timeout: number = 0, context?: Record<string, unknown>) {
    super(
      `Request timed out after ${timeout}ms`,
      ErrorCode.TIMEOUT_ERROR,
      'The request took too long. Please try again',
      ErrorSeverity.MEDIUM,
      { ...context, timeout },
      true
    );
  }
}

/**
 * Unknown/Generic Error
 */
export class UnknownError extends AppError {
  constructor(originalError: Error, context?: Record<string, unknown>) {
    super(
      originalError.message || 'An unknown error occurred',
      ErrorCode.UNKNOWN_ERROR,
      'Something unexpected happened. Please try again',
      ErrorSeverity.HIGH,
      { ...context, originalError: originalError.name },
      false
    );
  }
}