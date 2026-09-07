import { useState, useEffect, useCallback, useMemo } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import { useGameChannelsInteractor } from './GameChannelsInteractor';
import { useGameChannelsRouter } from './GameChannelsRouter';
import {
  CustomProductPurchaseSuccessMeta,
  NotificationItem,
  NotificationMeta,
} from '@/api/actions/user/userAPIDataTypes';

function getNotificationMeta(item: NotificationItem): NotificationMeta | undefined {
  return item.meta ?? item.data?.meta;
}

function isCustomProductPurchaseSuccessMeta(
  meta: NotificationMeta | undefined,
): meta is CustomProductPurchaseSuccessMeta {
  return (
    meta?.kind === 'custom_product_purchase_success' &&
    typeof (meta as CustomProductPurchaseSuccessMeta).sku_code === 'string' &&
    (meta as CustomProductPurchaseSuccessMeta).sku_code.trim().length > 0
  );
}

export function useGameChannelsPresentor(navigation: any) {
  const [notiPage, setNotiPage] = useState(1);
  const [channelsPage, setChannelsPage] = useState(1);
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
      const filteredData = channelsData.data.filter(
        c => c.name?.toLowerCase() !== 'sign error',
      );
      if (channelsPage === 1) {
        setAllChannels(filteredData);
      } else {
        setAllChannels(prev => {
          const existingIds = new Set(prev.map(c => c.id));
          const newChannels = filteredData.filter(c => !existingIds.has(c.id));
          return [...prev, ...newChannels];
        });
      }
    }
  }, [channelsData, channelsPage]);

  // Transform channels for display
  const processedChannels = useMemo(() => {
    return allChannels.map(gameItem => {
      const chatChannels = Array.isArray(gameItem.chat_channels)
        ? gameItem.chat_channels
        : [];

      const latestChannel = [...chatChannels].sort((a, b) => {
        const aTime = new Date(a.last_message?.created_at || a.updated_at || 0).getTime();
        const bTime = new Date(b.last_message?.created_at || b.updated_at || 0).getTime();
        return bTime - aTime;
      })[0];

      return {
        ...gameItem,
        displayTitle: `${gameItem.name.charAt(0).toUpperCase() + gameItem.name.slice(1)} - ${gameItem.region.name}`,
        game: {
          id: gameItem.id,
          uuid: gameItem.uuid,
          name: gameItem.name,
        },
        last_message: latestChannel?.last_message ?? null,
      };
    });
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

  const handleNotificationClick = useCallback(
    async (item: NotificationItem) => {
      const meta = getNotificationMeta(item);

      if (isCustomProductPurchaseSuccessMeta(meta)) {
        Clipboard.setString(meta.sku_code.trim());
        Toast.show({
          type: 'success',
          text1: 'Code Copied',
          text2: meta.sku_code.trim(),
        });
      }

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

  return {
    ...interactor,
    ...router,
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
    isCustomProductPurchaseSuccessMeta,
    getNotificationMeta,
  };
}
