// src/api/AuthService.ts

import axiosJWT from "./axiosJWT";

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

const API_BASE_URL = "http://localhost:8080/api/auth";

export async function loginUser(loginData: ILoginRequest): Promise<IAuthResponse> {
  const response = await axiosJWT.post<IAuthResponse>(`${API_BASE_URL}/login`, loginData);
  return response.data; // axios auto-parses JSON
}

export async function registerUser(registerData: IRegisterRequest): Promise<IAuthResponse> {
  const response = await axiosJWT.post<IAuthResponse>(`${API_BASE_URL}/register`, registerData);
  return response.data;
}
