import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  email: string;
  name: string;
  id: number;
  token: string;
  userType: string;
  isLogged: boolean;
}

const initialState: AuthState = {
  email: "",
  name: "guest", 
  id: 0,
  token: "",
  userType: "",
  isLogged: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState>) => {
      return { ...action.payload };
    },
    logout: () => {
      return { ...initialState };
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    updateUserDetails: (state, action: PayloadAction<Partial<AuthState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { login, logout, updateToken, updateUserDetails } = authSlice.actions;
export default authSlice.reducer;