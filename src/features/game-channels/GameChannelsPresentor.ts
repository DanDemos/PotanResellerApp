
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameChannelsInteractor } from './GameChannelsInteractor';
import { useGameChannelsRouter } from './GameChannelsRouter';
import { NotificationItem } from '@/api/actions/user/userAPIDataTypes';

export function useGameChannelsPresentor(navigation: any) {
  const [notiPage, setNotiPage] = useState(1);
  const [channelsPage, setChannelsPage] = useState(1);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [allChannels, setAllChannels] = useState<any[]>([]);

  const interactor = useGameChannelsInteractor(notiPage, channelsPage);
  const router = useGameChannelsRouter(navigation);

  const {
    notiData,
    notiIsFetching,
    notiRefetch,
    markAsRead,
    markAllAsRead,
    channelsRefetch,
    channelsData,
  } = interactor;

  // Sync channels list
  useEffect(() => {
    if (channelsData?.data) {
      if (channelsPage === 1) {
        setAllChannels(channelsData.data);
      } else {
        setAllChannels(prev => {
          const existingIds = new Set(prev.map(c => c.id));
          const newChannels = channelsData.data.filter(c => !existingIds.has(c.id));
          return [...prev, ...newChannels];
        });
      }
    }
  }, [channelsData, channelsPage]);

  // Transform channels for display
  const processedChannels = useMemo(() => {
    return allChannels.map(gameItem => ({
      ...gameItem,
      displayTitle: `${gameItem.name.charAt(0).toUpperCase() + gameItem.name.slice(1)} - ${gameItem.region.name}`,
      game: {
        id: gameItem.id,
        uuid: gameItem.uuid,
        name: gameItem.name,
      },
      last_message: null,
    }));
  }, [allChannels]);

  useEffect(() => {
    if (notiData?.items) {
      if (notiPage === 1) {
        setNotifications(notiData.items);
      } else {
        setNotifications(prev => {
          const existingIds = new Set(prev.map((n: NotificationItem) => n.id));
          const newNotis = notiData.items!.filter(
            (n: NotificationItem) => !existingIds.has(n.id),
          );
          return [...prev, ...newNotis];
        });
      }
    }
  }, [notiData, notiPage]);

  const handleLoadMoreNoti = useCallback(() => {
    if (
      !notiIsFetching &&
      notiData &&
      notiData.last_page &&
      notiPage < notiData.last_page
    ) {
      setNotiPage(prev => prev + 1);
    }
  }, [notiIsFetching, notiData, notiPage]);

  const handleRefreshNoti = useCallback(() => {
    setNotiPage(1);
    notiRefetch();
  }, [notiRefetch]);

  useEffect(() => {
    if (showNotifications) {
      handleRefreshNoti();
    }
  }, [showNotifications, handleRefreshNoti]);

  const handleNotificationClick = useCallback(
    async (item: NotificationItem) => {
      if (!item.read_at) {
        try {
          await markAsRead({ id: item.id }).unwrap();
        } catch (err) {
          console.error('Failed to mark notification as read:', err);
        }
      }
    },
    [markAsRead],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  }, [markAllAsRead]);

  const handleLoadMoreChannels = useCallback(() => {
    if (
      !interactor.channelsIsFetching &&
      channelsData &&
      channelsData.last_page &&
      channelsPage < channelsData.last_page
    ) {
      setChannelsPage(prev => prev + 1);
    }
  }, [interactor.channelsIsFetching, channelsData, channelsPage]);

  const handleMainRefresh = useCallback(() => {
    setChannelsPage(1);
    channelsRefetch();
    setNotiPage(1);
    notiRefetch();
  }, [channelsRefetch, notiRefetch]);

  return useMemo(
    () => ({
      ...interactor,
      ...router,
      showNotifications,
      setShowNotifications,
      notifications,
      notiPage,
      channelsPage,
      handleLoadMoreNoti,
      handleRefreshNoti,
      handleNotificationClick,
      handleMarkAllAsRead,
      handleMainRefresh,
      handleLoadMoreChannels,
      processedChannels,
    }),
    [
      interactor,
      router,
      showNotifications,
      notifications,
      notiPage,
      channelsPage,
      handleLoadMoreNoti,
      handleRefreshNoti,
      handleNotificationClick,
      handleMarkAllAsRead,
      handleMainRefresh,
      handleLoadMoreChannels,
      processedChannels,
    ],
  );
}
