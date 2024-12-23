// Services/BaseService.ts

import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';
import { getToken } from '../Utiles/authService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export class BaseService {
  protected axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor to add the Authorization header to every request
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          // Ensure headers exist and assert the type
          if (!config.headers) {
            config.headers = {} as AxiosRequestHeaders;
          }
          // Set the Authorization header
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
}
