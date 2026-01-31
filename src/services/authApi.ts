import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type LoginRequest = { phone: string; password: string };
type LoginResponse = { token: string; user?: any };

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://example.com/api' }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
