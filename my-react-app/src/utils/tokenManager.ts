/**
 * Centralized JWT Token Management
 * Replaces multiple token storage locations with single source of truth
 */

const TOKEN_KEY = 'app_token';

export interface TokenPayload {
  sub: string; // user email
  userId: number;
  userType: string;
  exp: number; // expiration timestamp
  iat: number; // issued at timestamp
}

export class TokenManager {
  /**
   * Store JWT token securely
   * Cleans up old storage locations
   */
  static setToken(token: string): void {
    try {
      // Store in sessionStorage (more secure than localStorage)
      sessionStorage.setItem(TOKEN_KEY, token);
      
      // Clean up old storage locations to prevent confusion
      localStorage.removeItem('token');
      sessionStorage.removeItem('jwt');
      
      console.log('Token stored successfully');
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  }

  /**
   * Retrieve JWT token
   */
  static getToken(): string | null {
    try {
      // First try new location
      let token = sessionStorage.getItem(TOKEN_KEY);
      
      // Fallback to old locations for migration
      if (!token) {
        token = sessionStorage.getItem('jwt') || localStorage.getItem('token');
        
        // If found in old location, migrate to new location
        if (token) {
          this.setToken(token);
        }
      }
      
      return token;
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  }

  /**
   * Remove JWT token and cleanup
   */
  static removeToken(): void {
    try {
      // Remove from all possible locations
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem('jwt');
      localStorage.removeItem('token');
      
      console.log('Token removed successfully');
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  }

  /**
   * Check if current token is valid (not expired)
   */
  static isValid(): boolean {
    const token = this.getToken();
    
    if (!token) {
      return false;
    }

    try {
      const payload = this.decodeToken(token);
      
      if (!payload || !payload.exp) {
        return false;
      }

      // Check if token is expired (with 1 minute buffer)
      const now = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp < (now + 60);
      
      if (isExpired) {
        console.log('Token is expired, removing...');
        this.removeToken();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Invalid token format:', error);
      this.removeToken();
      return false;
    }
  }

  /**
   * Decode JWT token payload
   */
  static decodeToken(token: string): TokenPayload | null {
    try {
      const parts = token.split('.');
      
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const payload = JSON.parse(atob(parts[1]));
      return payload as TokenPayload;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  /**
   * Get user information from token
   */
  static getUserInfo(): {
    userId: number;
    email: string;
    userType: string;
  } | null {
    const token = this.getToken();
    
    if (!token || !this.isValid()) {
      return null;
    }

    try {
      const payload = this.decodeToken(token);
      
      if (!payload) {
        return null;
      }

      return {
        userId: payload.userId,
        email: payload.sub,
        userType: payload.userType,
      };
    } catch (error) {
      console.error('Failed to get user info from token:', error);
      return null;
    }
  }

  /**
   * Get token expiration time
   */
  static getTokenExpiration(): Date | null {
    const token = this.getToken();
    
    if (!token) {
      return null;
    }

    try {
      const payload = this.decodeToken(token);
      
      if (!payload || !payload.exp) {
        return null;
      }

      return new Date(payload.exp * 1000);
    } catch (error) {
      console.error('Failed to get token expiration:', error);
      return null;
    }
  }

  /**
   * Check if user is admin
   */
  static isAdmin(): boolean {
    const userInfo = this.getUserInfo();
    return userInfo?.userType?.toLowerCase() === 'admin';
  }

  /**
   * Get authorization header value
   */
  static getAuthHeader(): string | null {
    const token = this.getToken();
    
    if (!token || !this.isValid()) {
      return null;
    }

    return `Bearer ${token}`;
  }
}

// Export singleton instance for convenience
export const tokenManager = TokenManager;