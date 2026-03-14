import { rtkBaseApi } from '@/api/fetchers/rtkBaseApi';
import { ENDPOINTS } from '@/api/endpoints';
import { 
  LoginRequest, 
  LoginResponse, 
  LogoutRequest, 
  LogoutResponse, 
  ChangePasswordRequest, 
  ChangePasswordResponse 
} from '@/api/actions/auth/authAPIDataTypes';

export const authApi = rtkBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<LogoutResponse, LogoutRequest>({
      query: () => ({
        url: ENDPOINTS.AUTH.LOGOUT,
        method: 'POST',
      }),
    }),
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: ENDPOINTS.AUTH.CHANGE_PASSWORD,
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { 
  useLoginMutation, 
  useLogoutMutation, 
  useChangePasswordMutation 
} = authApi;

