/**
 * Centralized Environment Configuration
 * Manages all environment variables and application settings
 */

export const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  
  // Authentication
  JWT_EXPIRY_HOURS: parseInt(import.meta.env.VITE_JWT_EXPIRY_HOURS || '24'),
  SESSION_TIMEOUT_MINUTES: parseInt(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES || '30'),
  
  // File Upload
  MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '5242880'), // 5MB
  ALLOWED_FILE_TYPES: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(','),
  
  // Application Settings
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Recipe Book',
  PAGINATION_SIZE: parseInt(import.meta.env.VITE_PAGINATION_SIZE || '12'),
  DEBOUNCE_DELAY: parseInt(import.meta.env.VITE_DEBOUNCE_DELAY || '300'),
  
  // Environment Detection
  NODE_ENV: import.meta.env.VITE_NODE_ENV || import.meta.env.NODE_ENV || 'development',
  ENABLE_LOGGING: import.meta.env.VITE_ENABLE_LOGGING === 'true',
  MOCK_API: import.meta.env.VITE_MOCK_API === 'true',
  
  // External Services
  ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID,
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
} as const;

// Environment helpers
export const isDevelopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';
export const isTesting = config.NODE_ENV === 'test';

// Validation helpers
export const validateConfig = () => {
  const errors: string[] = [];
  
  if (!config.API_BASE_URL) {
    errors.push('API_BASE_URL is required');
  }
  
  if (!config.BACKEND_URL) {
    errors.push('BACKEND_URL is required');
  }
  
  if (config.MAX_FILE_SIZE < 1024) {
    errors.push('MAX_FILE_SIZE must be at least 1KB');
  }
  
  if (config.PAGINATION_SIZE < 1) {
    errors.push('PAGINATION_SIZE must be at least 1');
  }
  
  if (errors.length > 0) {
    console.error('Configuration validation failed:', errors);
    throw new Error(`Invalid configuration: ${errors.join(', ')}`);
  }
  
  console.log('✅ Configuration validated successfully');
};

// File size formatter
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// API URL builder
export const buildApiUrl = (endpoint: string): string => {
  return `${config.API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
};

// Development logging
export const log = {
  debug: (...args: unknown[]) => {
    if (config.ENABLE_LOGGING && isDevelopment) {
      console.log('🐛 [DEBUG]', ...args);
    }
  },
  info: (...args: unknown[]) => {
    if (config.ENABLE_LOGGING) {
      console.info('ℹ️ [INFO]', ...args);
    }
  },
  warn: (...args: unknown[]) => {
    console.warn('⚠️ [WARN]', ...args);
  },
  error: (...args: unknown[]) => {
    console.error('🚨 [ERROR]', ...args);
  }
};

// Initialize configuration validation on import
if (isDevelopment) {
  validateConfig();
  log.info('Environment configuration loaded:', {
    NODE_ENV: config.NODE_ENV,
    API_BASE_URL: config.API_BASE_URL,
    MAX_FILE_SIZE: formatFileSize(config.MAX_FILE_SIZE),
    PAGINATION_SIZE: config.PAGINATION_SIZE,
  });
}