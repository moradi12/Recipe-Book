/**
 * Centralized API Client
 * Replaces multiple axios configurations with single, standardized client
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config, log } from '../config/environment';
import { tokenManager } from '../utils/tokenManager';
import { ErrorHandler } from '../errors/ErrorHandler';


export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
}

class ApiClient {
  private static instance: AxiosInstance;
  
  static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: config.API_BASE_URL,
        timeout: 15000, // 15 seconds
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      this.setupInterceptors();
      log.info('API Client initialized with base URL:', config.API_BASE_URL);
    }
    return this.instance;
  }
  
  private static setupInterceptors() {
    // Request interceptor - Add auth token and logging
    this.instance.interceptors.request.use(
      (config) => {
        // Add authentication token
        const authHeader = tokenManager.getAuthHeader();
        if (authHeader) {
          config.headers.Authorization = authHeader;
        }
        
        // Log requests in development
        log.debug(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          data: config.data,
          params: config.params,
        });
        
        return config;
      },
      (error) => {
        log.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );
    
    // Response interceptor - Handle responses and errors
    this.instance.interceptors.response.use(
      (response) => {
        // Handle token refresh if server sends new token
        const newToken = response.headers.authorization?.split(' ')[1];
        if (newToken) {
          log.info('Token refreshed by server');
          tokenManager.setToken(newToken);
        }
        
        // Log successful responses in development
        log.debug(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
        
        return response;
      },
      (error: AxiosError) => {
        // Use new error handling system
        const appError = ErrorHandler.handleApiError(error, false); // Don't show notification as services will handle it
        return Promise.reject(appError);
      }
    );
  }
  
  // Convenience methods for common request patterns
  static async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.getInstance().get<T>(url, config);
    return response.data;
  }
  
  static async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.getInstance().post<T>(url, data, config);
    return response.data;
  }
  
  static async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.getInstance().put<T>(url, data, config);
    return response.data;
  }
  
  static async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.getInstance().delete<T>(url, config);
    return response.data;
  }
  
  static async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.getInstance().patch<T>(url, data, config);
    return response.data;
  }
  
  // File upload helper
  static async uploadFile<T = unknown>(
    url: string, 
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await this.getInstance().post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    
    return response.data;
  }
}

export default ApiClient;