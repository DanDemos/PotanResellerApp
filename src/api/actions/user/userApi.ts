import { BACKEND_API_URL } from '@env';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/redux/store';
import {
  GetUserRequest,
  GetUserResponse,
  GetNotificationListRequest,
  GetNotificationListResponse,
  MarkNotificationAsReadRequest,
  MarkNotificationAsReadResponse,
  MarkAllNotificationsAsReadRequest,
  MarkAllNotificationsAsReadResponse,
} from '@/api/actions/user/userAPIDataTypes';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Notifications'],
  endpoints: (builder) => ({
    getUserData: builder.query<GetUserResponse, GetUserRequest>({
      query: () => ({
        url: '/me',
        method: 'GET',
      }),
    }),
    getNotificationList: builder.query<
      GetNotificationListResponse,
      GetNotificationListRequest
    >({
      query: (params) => ({
        url: '/notifications',
        method: 'GET',
        params,
      }),
      providesTags: ['Notifications'],
    }),
    markNotificationAsRead: builder.mutation<
      MarkNotificationAsReadResponse,
      MarkNotificationAsReadRequest
    >({
      query: ({ id }) => ({
        url: `/notifications/${id}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['Notifications'],
    }),
    markAllNotificationsAsRead: builder.mutation<
      MarkAllNotificationsAsReadResponse,
      MarkAllNotificationsAsReadRequest
    >({
      query: () => ({
        url: '/notifications/read-all',
        method: 'POST',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetUserDataQuery,
  useGetNotificationListQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = userApi;
