
import { useMemo } from 'react';
import {
  useGetChannelMessagesQuery,
  useMarkMessageAsReadMutation,
  useSendChatMessageMutation,
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

  const [markAsRead] = useMarkMessageAsReadMutation();
  const [sendChatMessage, { isLoading: sendIsLoading }] = useSendChatMessageMutation();

  return useMemo(() => ({
    messagesData,
    messagesIsLoading,
    messagesError,
    messagesRefetch,
    markAsRead,
    sendChatMessage,
    sendIsLoading,
  }), [
    messagesData,
    messagesIsLoading,
    messagesError,
    messagesRefetch,
    markAsRead,
    sendChatMessage,
    sendIsLoading,
  ]);
}

export type ChatInteractor = ReturnType<typeof useChatInteractor>;
