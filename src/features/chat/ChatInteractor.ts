
import { useMemo } from 'react';
import { 
  useGetChannelMessagesQuery, 
  useMarkMessageAsReadMutation 
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

  const [markAsRead] = useMarkMessageAsReadMutation();

  return useMemo(() => ({
    messagesData,
    messagesIsLoading,
    messagesError,
    messagesRefetch,
    markAsRead,
  }), [messagesData, messagesIsLoading, messagesError, messagesRefetch, markAsRead]);
}

export type ChatInteractor = ReturnType<typeof useChatInteractor>;
