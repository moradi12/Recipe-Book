import { AxiosResponse } from 'axios';
import { BaseApiService } from '../Service/BaseApiService';

export interface ILoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface IRegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface IAuthResponse {
  id: number;
  username: string;
  email: string;
  userType: string;
  token: string;
}

class AuthService extends BaseApiService {
  private static instance: AuthService;

  private constructor() {
    // Auth service doesn't need automatic auth headers
    super('http://localhost:8080/api', false);
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // ===========================
  // LOGIN USER
  // ===========================
  public async loginUser(loginData: ILoginRequest): Promise<AxiosResponse<IAuthResponse>> {
    return this.post<IAuthResponse>('/auth/login', loginData);
  }

  // ===========================
  // REGISTER USER
  // ===========================
  public async registerUser(registerData: IRegisterRequest): Promise<AxiosResponse<IAuthResponse>> {
    return this.post<IAuthResponse>('/auth/register', registerData);
  }

  // ===========================
  // CHECK USERNAME AVAILABILITY
  // ===========================
  public async checkUsernameAvailability(username: string): Promise<AxiosResponse<{ available: boolean }>> {
    return this.get<{ available: boolean }>(`/auth/check-username?username=${encodeURIComponent(username)}`);
  }

  // ===========================
  // CHECK EMAIL AVAILABILITY
  // ===========================
  public async checkEmailAvailability(email: string): Promise<AxiosResponse<{ available: boolean }>> {
    return this.get<{ available: boolean }>(`/auth/check-email?email=${encodeURIComponent(email)}`);
  }
}

const authServiceInstance = AuthService.getInstance();

// ===========================
// LEGACY FUNCTION EXPORTS (for backward compatibility)
// ===========================
export async function loginUser(loginData: ILoginRequest): Promise<IAuthResponse> {
  const response = await authServiceInstance.loginUser(loginData);
  return response.data;
}

export async function registerUser(registerData: IRegisterRequest): Promise<IAuthResponse> {
  const response = await authServiceInstance.registerUser(registerData);
  return response.data;
}

export async function checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
  const response = await authServiceInstance.checkUsernameAvailability(username);
  return response.data;
}

export async function checkEmailAvailability(email: string): Promise<{ available: boolean }> {
  const response = await authServiceInstance.checkEmailAvailability(email);
  return response.data;
}

export default authServiceInstance;
export { AuthService };
