
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameChannelsInteractor } from './GameChannelsInteractor';
import { useGameChannelsRouter } from './GameChannelsRouter';
import { NotificationItem } from '@/api/actions/user/userAPIDataTypes';

export function useGameChannelsPresentor(navigation: any) {
  const [notiPage, setNotiPage] = useState(1);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const interactor = useGameChannelsInteractor(notiPage);
  const router = useGameChannelsRouter(navigation);

  const {
    notiData,
    notiIsFetching,
    notiRefetch,
    markAsRead,
    markAllAsRead,
    channelsRefetch,
  } = interactor;


  // Sync notifications list
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

  const handleMainRefresh = useCallback(() => {
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
      handleLoadMoreNoti,
      handleRefreshNoti,
      handleNotificationClick,
      handleMarkAllAsRead,
      handleMainRefresh,
    }),
    [
      interactor,
      router,
      showNotifications,
      notifications,
      notiPage,
      handleLoadMoreNoti,
      handleRefreshNoti,
      handleNotificationClick,
      handleMarkAllAsRead,
      handleMainRefresh,
    ],
  );
}
