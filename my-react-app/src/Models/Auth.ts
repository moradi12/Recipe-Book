export interface LoginResponse {
    message: string;
    user: {
      id: number;
      username: string;
      email: string;
      userType: string;
      favorites?: number[];
    };
  }
  
  export interface RegisterResponse {
    message: string;
    user: {
      id: number;
      username: string;
      email: string;
      userType: string;
      favorites?: number[];
    };
  }
  