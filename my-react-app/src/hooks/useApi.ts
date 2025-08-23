import { useState, useCallback } from 'react';
import { AxiosResponse } from 'axios';
import { notify } from '../Utiles/notif';
import { AppError } from '../errors/AppError';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface ApiHookReturn<T> extends ApiState<T> {
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Generic hook for API calls with loading, error states, and notifications
 */
export function useApi<T = unknown>(
  apiFunction: (...args: unknown[]) => Promise<AxiosResponse<T>>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    showSuccessNotification?: boolean;
    showErrorNotification?: boolean;
    successMessage?: string;
    errorMessage?: string;
  } = {}
): ApiHookReturn<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const {
    onSuccess,
    onError,
    showSuccessNotification = false,
    showErrorNotification = true,
    successMessage = 'Operation completed successfully',
    errorMessage = 'An error occurred',
  } = options;

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiFunction(...args);
        const data = response.data;

        setState({ data, loading: false, error: null });

        if (showSuccessNotification) {
          notify.success(successMessage);
        }

        if (onSuccess) {
          onSuccess(data);
        }

        return data;
      } catch (error) {
        const errorMsg = error instanceof AppError 
          ? error.getUserMessage() 
          : errorMessage;
        
        setState(prev => ({ ...prev, loading: false, error: errorMsg }));

        if (showErrorNotification) {
          notify.error(errorMsg);
        }

        if (onError) {
          onError(errorMsg);
        }

        return null;
      }
    },
    [apiFunction, onSuccess, onError, showSuccessNotification, showErrorNotification, successMessage, errorMessage]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}