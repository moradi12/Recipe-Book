import { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { RootState, AppDispatch } from '../Pages/Redux/store';
import { login as loginAction, logout as logoutAction, AuthState } from '../Pages/Redux/slices/unifiedAuthSlice';
import { loginUser, registerUser, ILoginRequest, IRegisterRequest } from '../Utiles/authService';
import { notify } from '../Utiles/notif';

type DecodedJwt = {
  id: number;
  userName: string;
  userType: string;
  exp: number;
};

export interface AuthHookReturn {
  // Auth state
  auth: AuthState;
  isAuthenticated: boolean;
  userInfo: DecodedJwt | null;
  
  // Auth operations
  login: (credentials: ILoginRequest) => Promise<boolean>;
  register: (data: IRegisterRequest) => Promise<boolean>;
  logout: () => void;
  
  // Auth checks
  requireAuth: (redirectTo?: string) => boolean;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
  isEditor: boolean;
  
  // Loading states
  loginLoading: boolean;
  registerLoading: boolean;
}

export function useAuth(): AuthHookReturn {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Direct API calls with manual loading state since authService functions don't return AxiosResponse
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  // Initialize auth state from stored JWT on app start
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = sessionStorage.getItem('jwt');
      
      if (storedToken && !auth.isLogged) {
        try {
          const decoded = jwtDecode<DecodedJwt>(storedToken);
          
          // Check if token is not expired
          if (decoded.exp * 1000 > Date.now()) {
            const userState: AuthState = {
              email: '', // We don't have email in JWT, will be filled later
              name: decoded.userName,
              id: decoded.id,
              token: storedToken,
              userType: decoded.userType,
              isLogged: true,
            };
            
            dispatch(loginAction(userState));
          } else {
            sessionStorage.removeItem('jwt');
          }
        } catch (error) {
          console.error('Invalid stored token:', error);
          sessionStorage.removeItem('jwt');
        }
      }
    };

    initializeAuth();
  }, []); // Remove auth.isLogged dependency to prevent infinite loop

  // Get user info from token
  const getUserInfo = useCallback((): DecodedJwt | null => {
    if (!auth.token) return null;
    
    try {
      const decoded = jwtDecode<DecodedJwt>(auth.token);
      
      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        dispatch(logoutAction());
        sessionStorage.removeItem('jwt');
        return null;
      }
      
      return decoded;
    } catch (error) {
      console.error('Invalid token:', error);
      dispatch(logoutAction());
      sessionStorage.removeItem('jwt');
      return null;
    }
  }, [auth.token, dispatch]);

  // Login function
  const login = useCallback(async (credentials: ILoginRequest): Promise<boolean> => {
    try {
      setLoginLoading(true);
      const response = await loginUser(credentials);
      
      if (response) {
        const userState: AuthState = {
          email: response.email,
          name: response.username,
          id: response.id,
          token: response.token,
          userType: response.userType,
          isLogged: true,
        };
        
        dispatch(loginAction(userState));
        sessionStorage.setItem('jwt', response.token);
        notify.success('Login successful!');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
      notify.error(message);
      return false;
    } finally {
      setLoginLoading(false);
    }
  }, [dispatch]);

  // Register function
  const register = useCallback(async (data: IRegisterRequest): Promise<boolean> => {
    try {
      setRegisterLoading(true);
      
      // Call the auth service directly (it already returns data, not AxiosResponse)
      const response = await registerUser(data);
      
      if (response) {
        const userState: AuthState = {
          email: response.email,
          name: response.username,
          id: response.id,
          token: response.token,
          userType: response.userType,
          isLogged: true,
        };
        
        dispatch(loginAction(userState));
        sessionStorage.setItem('jwt', response.token);
        notify.success('Registration successful!');
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      notify.error(message);
      return false;
    } finally {
      setRegisterLoading(false);
    }
  }, [dispatch]);

  // Logout function
  const logout = useCallback(() => {
    dispatch(logoutAction());
    sessionStorage.removeItem('jwt');
    navigate('/login');
    notify.success('Logged out successfully');
  }, [dispatch, navigate]);

  // Check if user needs to be authenticated
  const requireAuth = useCallback((redirectTo: string = '/login'): boolean => {
    // First check if we have a stored token that might not be in Redux yet
    const storedToken = sessionStorage.getItem('jwt');
    
    if (!auth.isLogged && !storedToken) {
      notify.error('You must be logged in to access this page');
      navigate(redirectTo);
      return false;
    }

    if (!auth.isLogged && storedToken) {
      // Token exists but Redux state not updated yet - let initialization handle it
      return true; // Allow for now, initialization will handle invalid tokens
    }

    if (auth.token) {
      const userInfo = getUserInfo();
      if (!userInfo) {
        notify.error('Your session has expired. Please log in again.');
        navigate(redirectTo);
        return false;
      }
    }

    return true;
  }, [auth.isLogged, auth.token, getUserInfo, navigate]);

  // Check if user has specific role
  const hasRole = useCallback((role: string): boolean => {
    return auth.userType === role;
  }, [auth.userType]);

  return {
    // Auth state
    auth,
    isAuthenticated: auth.isLogged && !!auth.token,
    userInfo: getUserInfo(),
    
    // Auth operations
    login,
    register,
    logout,
    
    // Auth checks
    requireAuth,
    hasRole,
    isAdmin: hasRole('ADMIN'),
    isEditor: hasRole('EDITOR'),
    
    // Loading states
    loginLoading,
    registerLoading,
  };
}