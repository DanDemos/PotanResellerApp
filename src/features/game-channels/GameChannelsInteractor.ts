
import { useMemo } from 'react';
import { useGetChannelsQuery } from '@/api/actions/gameChannel/gameChannelApi';
import {
  useGetNotificationListQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from '@/api/actions/user/userApi';

export function useGameChannelsInteractor(notiPage: number, channelsPage: number) {
  const {
    data: channelsData,
    isLoading: channelsIsLoading,
    isFetching: channelsIsFetching,
    error: channelsError,
    refetch: channelsRefetch,
  } = useGetChannelsQuery({ page: channelsPage, per_page: 10 });

  const {
    data: notiData,
    isLoading: notiIsLoading,
    isFetching: notiIsFetching,
    refetch: notiRefetch,
  } = useGetNotificationListQuery({ page: notiPage, per_page: 15 });

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  return useMemo(
    () => ({
      channelsData,
      channelsIsLoading,
      channelsIsFetching,
      channelsError,
      channelsRefetch,
      notiData,
      notiIsLoading,
      notiIsFetching,
      notiRefetch,
      markAsRead,
      markAllAsRead,
    }),
    [
      channelsData,
      channelsIsLoading,
      channelsIsFetching,
      channelsError,
      channelsRefetch,
      notiData,
      notiIsLoading,
      notiIsFetching,
      notiRefetch,
      markAsRead,
      markAllAsRead,
    ],
  );
}
