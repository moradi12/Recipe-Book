/**
 * Error Factory
 * Creates appropriate error instances from different sources
 */

import { AxiosError } from 'axios';
import {
  AppError,
  ApiError,
  NetworkError,
  TimeoutError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  UnknownError,
  ErrorCode,
} from './AppError';

export class ErrorFactory {
  /**
   * Create error from Axios error
   */
  static fromAxiosError(error: AxiosError): AppError {
    // Network or connection errors
    if (!error.response) {
      if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
        return new NetworkError(error.message, {
          code: error.code,
          config: {
            url: error.config?.url,
            method: error.config?.method,
          },
        });
      }

      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        const timeout = error.config?.timeout || 0;
        return new TimeoutError(timeout, {
          code: error.code,
          url: error.config?.url,
          method: error.config?.method,
        });
      }

      return new NetworkError(error.message, {
        code: error.code,
        config: {
          url: error.config?.url,
          method: error.config?.method,
        },
      });
    }

    // HTTP response errors
    const status = error.response.status;
    const endpoint = error.config?.url;
    const responseData = error.response.data;

    // Extract message from response
    const message = responseData?.message || error.message;
    const userMessage = responseData?.userMessage;

    switch (status) {
      case 401:
        return new AuthenticationError(message, {
          endpoint,
          responseData,
        });

      case 403:
        return new AuthorizationError(message, {
          endpoint,
          responseData,
        });

      case 422:
        // Validation errors
        if (responseData?.errors && typeof responseData.errors === 'object') {
          return new ValidationError(responseData.errors, message, {
            endpoint,
            responseData,
          });
        }
        break;
    }

    return new ApiError(message, status, userMessage, endpoint, {
      responseData,
      requestData: error.config?.data,
    });
  }

  /**
   * Create error from JavaScript Error
   */
  static fromJavaScriptError(error: Error, context?: Record<string, unknown>): AppError {
    // Handle specific error types
    if (error.name === 'TypeError' || error.name === 'ReferenceError') {
      return new UnknownError(error, {
        ...context,
        errorType: 'JavaScript',
        severity: 'high',
      });
    }

    return new UnknownError(error, {
      ...context,
      errorType: 'JavaScript',
    });
  }

  /**
   * Create error from validation object
   */
  static fromValidation(
    fieldErrors: Record<string, string>,
    message: string = 'Validation failed'
  ): ValidationError {
    return new ValidationError(fieldErrors, message);
  }

  /**
   * Create error from unknown source
   */
  static fromUnknown(error: unknown, context?: Record<string, unknown>): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return this.fromJavaScriptError(error, context);
    }

    if (typeof error === 'string') {
      return new UnknownError(new Error(error), context);
    }

    // Handle axios-like errors
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      'config' in error
    ) {
      return this.fromAxiosError(error as AxiosError);
    }

    return new UnknownError(new Error('An unknown error occurred'), {
      ...context,
      originalError: error,
    });
  }

  /**
   * Create file validation errors
   */
  static validateFile(
    file: File,
    maxSize: number,
    allowedTypes: string[]
  ): AppError | null {
    // Check file size
    if (file.size > maxSize) {
      const { FileTooLargeError } = require('./AppError');
      return new FileTooLargeError(file, maxSize);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      const { InvalidFileTypeError } = require('./AppError');
      return new InvalidFileTypeError(file, allowedTypes);
    }

    return null;
  }

  /**
   * Create business logic errors
   */
  static recipeNotFound(recipeId: number | string): AppError {
    const { RecipeNotFoundError } = require('./AppError');
    return new RecipeNotFoundError(recipeId);
  }

  static userNotFound(identifier: string): AppError {
    const { UserNotFoundError } = require('./AppError');
    return new UserNotFoundError(identifier);
  }

  static favoriteExists(recipeId: number): AppError {
    const { FavoriteExistsError } = require('./AppError');
    return new FavoriteExistsError(recipeId);
  }
}