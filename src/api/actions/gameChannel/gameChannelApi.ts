import { rtkBaseApi } from '@/api/fetchers/rtkBaseApi';
import { ENDPOINTS } from '@/api/endpoints';
import {
  GetChannelsRequest,
  GetChannelsResponse,
  GetChannelMessagesRequest,
  GetChannelMessagesResponse,
  MarkMessageAsReadRequest,
  MarkMessageAsReadResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  GetChatHistoryRequest,
  GetChatHistoryResponse,
  SendChatMessageRequest,
  SendChatMessageResponse,
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

    getChatHistory: builder.query<GetChatHistoryResponse, GetChatHistoryRequest>({
      query: (arg) => ({
        url: ENDPOINTS.GAME_CHANNEL.GET_CHAT_HISTORY,
        method: 'GET',
        params: arg,
      }),
      providesTags: ['ChatHistory'],
    }),
    sendChatMessage: builder.mutation<SendChatMessageResponse, SendChatMessageRequest>({
      query: ({ channelUuid, body }) => ({
        url: ENDPOINTS.GAME_CHANNEL.SEND_CHAT_MESSAGE(channelUuid),
        method: 'POST',
        body: { body },
      }),
      invalidatesTags: ['Messages'],
    }),
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (orderData) => ({
        url: ENDPOINTS.GAME_CHANNEL.CREATE_ORDER,
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['ChatHistory'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetChannelsQuery,
  useGetChannelMessagesQuery,
  useMarkMessageAsReadMutation,
  useGetChatHistoryQuery,
  useSendChatMessageMutation,
  useCreateOrderMutation,
} = gameChannelApi;

