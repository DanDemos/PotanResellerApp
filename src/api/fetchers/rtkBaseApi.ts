import { BACKEND_API_URL } from '@env';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/redux/store';

console.log(BACKEND_API_URL, "BACKEND_API_URL")
export const rtkBaseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      if (!headers.has('Accept')) {
        headers.set('Accept', 'application/json');
      }
      return headers;
    },
  }),
  tagTypes: ['Wallet', 'Profile', 'Notifications', 'Channels', 'Messages', 'ChatHistory'],
  endpoints: () => ({}),
});