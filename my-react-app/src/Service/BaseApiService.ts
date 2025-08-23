import { AxiosResponse, AxiosRequestConfig } from 'axios';
import ApiClient from '../services/apiClient';
import { config } from '../config/environment';
import { ErrorHandler } from '../errors/ErrorHandler';

export class BaseApiService {
  protected baseUrl: string;
  protected client = ApiClient.getInstance();

  constructor(baseUrl: string, _useAuth: boolean = true) { // eslint-disable-line @typescript-eslint/no-unused-vars
    // Convert relative URLs to absolute using environment config
    this.baseUrl = baseUrl.startsWith('http') 
      ? baseUrl 
      : `${config.API_BASE_URL}${baseUrl.startsWith('/') ? baseUrl : '/' + baseUrl}`;
  }

  // Updated methods to use centralized ApiClient instance (not static methods)
  // Using getInstance() directly to get full AxiosResponse objects
  protected async get<T>(endpoint: string, requestConfig?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return this.client.get<T>(this.buildUrl(endpoint), requestConfig);
    } catch (error) {
      throw ErrorHandler.handleApiError(error);
    }
  }

  protected async post<T>(endpoint: string, data?: unknown, requestConfig?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return this.client.post<T>(this.buildUrl(endpoint), data, requestConfig);
    } catch (error) {
      throw ErrorHandler.handleApiError(error);
    }
  }

  protected async put<T>(endpoint: string, data?: unknown, requestConfig?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return this.client.put<T>(this.buildUrl(endpoint), data, requestConfig);
    } catch (error) {
      throw ErrorHandler.handleApiError(error);
    }
  }

  protected async delete<T>(endpoint: string, requestConfig?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return this.client.delete<T>(this.buildUrl(endpoint), requestConfig);
    } catch (error) {
      throw ErrorHandler.handleApiError(error);
    }
  }

  protected buildUrl(endpoint: string, params?: Record<string, unknown>): string {
    // Handle absolute URLs
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    
    // Build relative URL from baseUrl
    let url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Add query parameters if provided
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