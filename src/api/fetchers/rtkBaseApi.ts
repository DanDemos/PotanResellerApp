import { BACKEND_API_URL } from '@env';
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/redux/store';
import { logout } from '@/redux/slices/authSlice';

console.log(BACKEND_API_URL, "BACKEND_API_URL")

const rawBaseQuery = fetchBaseQuery({
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
});

function getErrorMessage(error: FetchBaseQueryError): string | undefined {
  const { data } = error;
  if (typeof data === 'object' && data !== null && 'message' in data) {
    const message = (data as { message: unknown }).message;
    return typeof message === 'string' ? message : undefined;
  }
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as { message?: unknown };
      return typeof parsed.message === 'string' ? parsed.message : undefined;
    } catch {
      return data;
    }
  }
  return undefined;
}

function isUnauthenticatedError(error: FetchBaseQueryError): boolean {
  if (error.status === 401) {
    return true;
  }
  return getErrorMessage(error) === 'Unauthenticated.';
}

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && isUnauthenticatedError(result.error)) {
    const token = (api.getState() as RootState).auth.token;
    if (token) {
      api.dispatch(logout());
      api.dispatch(rtkBaseApi.util.resetApiState());
    }
  }

  return result;
};

export const rtkBaseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Wallet', 'Profile', 'Notifications', 'Channels', 'Messages', 'ChatHistory'],
  endpoints: () => ({}),
});
