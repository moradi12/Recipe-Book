import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { tokenManager } from '../utils/tokenManager';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
}

export class BaseApiService {
  protected axiosInstance: AxiosInstance;
  protected baseUrl: string;

  constructor(baseUrl: string, useAuth: boolean = true) {
    this.baseUrl = baseUrl;
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    if (useAuth) {
      this.setupAuthInterceptors();
    }
  }

  private setupAuthInterceptors(): void {
    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Use centralized token manager
        const authHeader = tokenManager.getAuthHeader();
        if (authHeader) {
          config.headers.Authorization = authHeader;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token updates and errors
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Handle token refresh if server sends new token
        const newToken = response.headers.authorization?.split(' ')[1];
        if (newToken) {
          tokenManager.setToken(newToken);
          
          // Update Redux store if available (avoid circular dependency)
          try {
            const { recipeSystem } = require('../Pages/Redux/store');
            const { updateTokenAction } = require('../Pages/Redux/slices/unifiedAuthSlice');
            recipeSystem.dispatch(updateTokenAction(newToken));
          } catch (error) {
            console.warn('Could not update Redux store with new token:', error);
          }
        }
        return response;
      },
      (error) => {
        // Handle authentication errors
        if (error.response?.status === 401) {
          console.log('Authentication failed, cleaning up token...');
          tokenManager.removeToken();
          
          // Redirect to login if not already there
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  protected async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(endpoint, config);
  }

  protected async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(endpoint, data, config);
  }

  protected async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(endpoint, data, config);
  }

  protected async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(endpoint, config);
  }

  protected buildUrl(path: string, params?: Record<string, any>): string {
    let url = path;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    return url;
  }
}