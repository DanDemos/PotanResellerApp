import { rtkBaseApi } from '@/api/fetchers/rtkBaseApi';
import { ENDPOINTS } from '@/api/endpoints';
import {
  GetChannelsRequest,
  GetChannelsResponse,
  GetChannelMessagesRequest,
  GetChannelMessagesResponse,
  MarkMessageAsReadRequest,
  MarkMessageAsReadResponse,
  SendChatMessageRequest,
  SendChatMessageResponse,
} from '@/api/actions/gameChannel/gameChannelAPIDataTypes';

export const gameChannelApi = rtkBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChannels: builder.query<GetChannelsResponse, GetChannelsRequest>({
      query: (arg) => ({
        url: ENDPOINTS.GAME_CHANNEL.GET_CHANNELS,
        method: 'GET',
        params: arg,
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
    sendChatMessage: builder.mutation<SendChatMessageResponse, SendChatMessageRequest>({
      query: (arg) => {
        const { game_id, ...rest } = arg;
        return {
          url: ENDPOINTS.GAME_CHANNEL.SEND_CHAT_MESSAGE(String(game_id)),
          method: 'POST',
          body: rest,
        };
      },
      invalidatesTags: ['Messages'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetChannelsQuery,
  useGetChannelMessagesQuery,
  useMarkMessageAsReadMutation,
  useSendChatMessageMutation,
} = gameChannelApi;

