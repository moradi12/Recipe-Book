/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the component tree and displays fallback UI
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorHandler } from '../errors/ErrorHandler';
import { log } from '../config/environment';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  eventId?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Handle the error using our centralized error handler
    const appError = ErrorHandler.handleJavaScriptError(error, errorInfo);
    
    this.setState({ 
      error, 
      errorInfo,
      eventId: `error_${Date.now()}`,
    });

    // Call optional onError callback
    this.props.onError?.(error, errorInfo);

    // Log additional context
    log.error('Error Boundary caught error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      eventId: appError.code,
    });
  }

  componentDidUpdate(prevProps: Props) {
    const { resetOnPropsChange } = this.props;
    const { hasError } = this.state;
    
    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      eventId: undefined,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="error-boundary">
          <div className="error-boundary__container">
            <div className="error-boundary__icon">
              <svg 
                width="64" 
                height="64" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="#ef4444" strokeWidth="2"/>
                <dot cx="12" cy="16" r="1" fill="#ef4444"/>
              </svg>
            </div>
            
            <h2 className="error-boundary__title">Oops! Something went wrong</h2>
            
            <p className="error-boundary__message">
              We're sorry, but something unexpected happened. This error has been logged 
              and we'll look into it.
            </p>

            <div className="error-boundary__details">
              {this.state.error && (
                <details className="error-boundary__error-details">
                  <summary>Technical details (for developers)</summary>
                  <pre className="error-boundary__error-message">
                    {this.state.error.message}
                  </pre>
                  {this.state.error.stack && (
                    <pre className="error-boundary__stack-trace">
                      {this.state.error.stack}
                    </pre>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <pre className="error-boundary__component-stack">
                      Component Stack:{this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </details>
              )}
            </div>

            <div className="error-boundary__actions">
              <button 
                onClick={this.handleRetry}
                className="error-boundary__button error-boundary__button--primary"
              >
                Try Again
              </button>
              
              <button 
                onClick={this.handleReload}
                className="error-boundary__button error-boundary__button--secondary"
              >
                Reload Page
              </button>
              
              <button 
                onClick={this.handleGoHome}
                className="error-boundary__button error-boundary__button--secondary"
              >
                Go Home
              </button>
            </div>

            {this.state.eventId && (
              <p className="error-boundary__event-id">
                Error ID: {this.state.eventId}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;