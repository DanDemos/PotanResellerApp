import { BACKEND_API_URL } from '@env';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/redux/store';
import {
  GetChannelsRequest,
  GetChannelsResponse,
  GetChannelMessagesRequest,
  GetChannelMessagesResponse,
  MarkMessageAsReadRequest,
  MarkMessageAsReadResponse
} from '@/api/actions/gameChannel/gameChannelAPIDataTypes';

export const gameChannelApi = createApi({
  reducerPath: 'gameChannelApi',
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
  endpoints: (builder) => ({
    getChannels: builder.query<GetChannelsResponse, GetChannelsRequest>({
      query: () => ({
        url: '/chat/channels',
        method: 'GET',
      }),
    }),
    getChannelMessages: builder.query<GetChannelMessagesResponse, GetChannelMessagesRequest>({
      query: (channelUuid) => ({
        url: `/chat/channels/${channelUuid}`,
        method: 'GET',
      }),
    }),
    markMessageAsRead: builder.mutation<MarkMessageAsReadResponse, MarkMessageAsReadRequest>({
      query: (messageId) => ({
        url: `/chat/messages/${messageId}/read`,
        method: 'PATCH',
      }),
    }),
  }),
});

export const {
  useGetChannelsQuery,
  useGetChannelMessagesQuery,
  useMarkMessageAsReadMutation
} = gameChannelApi;
