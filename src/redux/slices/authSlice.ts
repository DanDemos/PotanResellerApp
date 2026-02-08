import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginResponse } from '@/api/actions/auth/authAPIDataTypes';
import type { RootState } from '../store';

type AuthState = {
  user: LoginResponse['user'] | null;
  token: string | null;
};

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user, token } }: PayloadAction<{ user: AuthState['user']; token: string }>
    ) => {
      state.user = user;
      state.token = token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const authReducer = authSlice.reducer;


