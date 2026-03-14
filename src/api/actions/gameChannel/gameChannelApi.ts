import { rtkBaseApi } from '@/api/fetchers/rtkBaseApi';
import { ENDPOINTS } from '@/api/endpoints';
import {
  GetChannelsRequest,
  GetChannelsResponse,
  GetChannelMessagesRequest,
  GetChannelMessagesResponse,
  MarkMessageAsReadRequest,
  MarkMessageAsReadResponse
} from '@/api/actions/gameChannel/gameChannelAPIDataTypes';

export const gameChannelApi = rtkBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChannels: builder.query<GetChannelsResponse, GetChannelsRequest>({
      query: () => ({
        url: ENDPOINTS.GAME_CHANNEL.GET_CHANNELS,
        method: 'GET',
      }),
      providesTags: ['Channels'],
    }),
    getChannelMessages: builder.query<GetChannelMessagesResponse, GetChannelMessagesRequest>({
      query: (channelUuid) => ({
        url: ENDPOINTS.GAME_CHANNEL.GET_CHANNEL_MESSAGES(channelUuid),
        method: 'GET',
      }),
      providesTags: ['Messages'],
    }),
    markMessageAsRead: builder.mutation<MarkMessageAsReadResponse, MarkMessageAsReadRequest>({
      query: (messageId) => ({
        url: ENDPOINTS.GAME_CHANNEL.MARK_MESSAGE_READ(messageId),
        method: 'PATCH',
      }),
      invalidatesTags: ['Messages'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetChannelsQuery,
  useGetChannelMessagesQuery,
  useMarkMessageAsReadMutation
} = gameChannelApi;

