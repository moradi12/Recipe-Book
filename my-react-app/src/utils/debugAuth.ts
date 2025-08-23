/**
 * Debug Authentication Helper
 * Temporary utility to debug authentication issues
 */

import { tokenManager } from './tokenManager';
import { config } from '../config/environment';

export const debugAuth = {
  /**
   * Check current authentication status
   */
  checkAuthStatus() {
    console.group('🔐 Authentication Debug');
    
    const token = tokenManager.getToken();
    console.log('Token exists:', !!token);
    
    if (token) {
      console.log('Token (first 50 chars):', token.substring(0, 50) + '...');
      
      const isValid = tokenManager.isValid();
      console.log('Token is valid:', isValid);
      
      const userInfo = tokenManager.getUserInfo();
      console.log('User info:', userInfo);
      
      const authHeader = tokenManager.getAuthHeader();
      console.log('Auth header:', authHeader ? authHeader.substring(0, 60) + '...' : 'null');
      
      if (!isValid) {
        const expiration = tokenManager.getTokenExpiration();
        console.log('Token expiration:', expiration);
        console.log('Current time:', new Date());
      }
    } else {
      console.log('No token found in storage');
      
      // Check for tokens in old locations
      const oldJwt = sessionStorage.getItem('jwt');
      const oldToken = localStorage.getItem('token');
      console.log('Old JWT token exists:', !!oldJwt);
      console.log('Old token exists:', !!oldToken);
    }
    
    console.groupEnd();
  },

  /**
   * Test API call with current authentication
   */
  async testApiCall() {
    console.group('🌐 API Call Test');
    
    try {
      const response = await fetch(`${config.API_BASE_URL}/favorites`, {
        method: 'GET',
        headers: {
          'Authorization': tokenManager.getAuthHeader() || '',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
      } else {
        const data = await response.json();
        console.log('Success response:', data);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
    
    console.groupEnd();
  }
};

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugAuth;
}