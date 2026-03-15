
import { useMemo } from 'react';
import {
  useGetChannelMessagesQuery,
  useMarkMessageAsReadMutation,
  useGetChatHistoryQuery,
  useSendChatMessageMutation,
  useCreateOrderMutation
} from '@/api/actions/gameChannel/gameChannelApi';

export function useChatInteractor(channelUuid: string) {
  const {
    data: messagesData,
    isLoading: messagesIsLoading,
    error: messagesError,
    refetch: messagesRefetch,
  } = useGetChannelMessagesQuery(channelUuid, {
    skip: !channelUuid,
    refetchOnMountOrArgChange: true,
  });

  const gameId = messagesData?.channel?.game_id;

  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
    refetch: historyRefetch,
  } = useGetChatHistoryQuery(
    { game_id: Number(gameId) },
    { skip: !gameId }
  );


  const [markAsRead] = useMarkMessageAsReadMutation();
  const [sendChatMessage, { isLoading: sendIsLoading }] = useSendChatMessageMutation();
  const [createOrder, { isLoading: createOrderIsLoading }] = useCreateOrderMutation();

  return useMemo(() => ({
    messagesData,
    messagesIsLoading,
    messagesError,
    messagesRefetch,
    historyData,
    historyLoading,
    historyError,
    historyRefetch,
    markAsRead,
    sendChatMessage,
    sendIsLoading,
    createOrder,
    createOrderIsLoading,
  }), [
    messagesData,
    messagesIsLoading,
    messagesError,
    messagesRefetch,
    historyData,
    historyLoading,
    historyError,
    historyRefetch,
    markAsRead,
    sendChatMessage,
    sendIsLoading,
    createOrder,
    createOrderIsLoading,
  ]);
}

export type ChatInteractor = ReturnType<typeof useChatInteractor>;
