// Services/authService.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { LoginResponse } from '../Models/Auth';
import { UserType } from '../Models/UserType';

const TOKEN_KEY = 'jwtToken';

// Set your backend base URL here
const BASE_URL = 'http://localhost:8080';

/**
 * Logs in the user and stores the JWT token in local storage.
 * @param usernameOrEmail - Username or email address of the user.
 * @param password - Password of the user.
 * @returns A Promise that resolves with the JWT token.
 * @throws Error if the login fails or the token is missing.
 */
export async function login(usernameOrEmail: string, password: string): Promise<string> {
  try {
    const response = await axios.post<LoginResponse>(`${BASE_URL}/api/users/login`, null, {
      params: { usernameOrEmail, password },
    });

    if (response.status !== 200) {
      throw new Error(response.statusText || 'Login failed');
    }

    const token = response.headers['authorization']?.replace('Bearer ', '');
    if (!token) {
      throw new Error('No token returned from server');
    }

    setToken(token);
    return token;
  } catch (error: unknown) {
    const message =
      axios.isAxiosError(error) && error.response?.data
        ? error.response.data
        : 'An unexpected error occurred during login.';
    throw new Error(message);
  }
}

/**
 * Registers a new user.
 * @param username - Desired username for the new user.
 * @param email - Email address for the new user.
 * @param password - Password for the new user.
 * @throws Error if the registration fails.
 */
export async function register(username: string, email: string, password: string): Promise<void> {
  try {
    const response = await axios.post(`${BASE_URL}/api/users/register`, null, {
      params: { username, email, password },
    });

    if (response.status !== 201) {
      const errorText = typeof response.data === 'string' ? response.data : 'Registration failed';
      throw new Error(errorText);
    }
  } catch (error: unknown) {
    const message =
      axios.isAxiosError(error) && error.response?.data
        ? error.response.data
        : 'An unexpected error occurred during registration.';
    throw new Error(message);
  }
}

/**
 * Checks if a user is authenticated by verifying the presence of a JWT token.
 * @returns True if authenticated, otherwise false.
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * Logs out the user by removing the JWT token from local storage.
 */
export function logout(): void {
  removeToken();
}

/**
 * Retrieves the stored JWT token.
 * @returns The JWT token or null if not found.
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Stores the JWT token in local storage.
 * @param token - The JWT token to store.
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Removes the JWT token from local storage.
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// src/Utiles/authService.ts
/**
 * Decodes the JWT token to retrieve the user type.
 * @returns The user type if found in the token, otherwise null.
 */
export function getUserType(): UserType | null {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const decoded: { userType: UserType } = jwtDecode(token);
    return decoded.userType || null;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}


