// src/Services/AuthTypes.ts

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
  