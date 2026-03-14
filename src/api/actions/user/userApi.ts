import { rtkBaseApi } from '@/api/fetchers/rtkBaseApi';
import { ENDPOINTS } from '@/api/endpoints';
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

export const userApi = rtkBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserData: builder.query<GetUserResponse, GetUserRequest>({
      query: () => ({
        url: ENDPOINTS.USER.GET_ME,
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
    getNotificationList: builder.query<
      GetNotificationListResponse,
      GetNotificationListRequest
    >({
      query: (params) => ({
        url: ENDPOINTS.USER.NOTIFICATIONS,
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
        url: ENDPOINTS.USER.MARK_NOTIFICATION_READ(id),
        method: 'POST',
      }),
      invalidatesTags: ['Notifications'],
    }),
    markAllNotificationsAsRead: builder.mutation<
      MarkAllNotificationsAsReadResponse,
      MarkAllNotificationsAsReadRequest
    >({
      query: () => ({
        url: ENDPOINTS.USER.MARK_ALL_NOTIFICATIONS_READ,
        method: 'POST',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserDataQuery,
  useGetNotificationListQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = userApi;

