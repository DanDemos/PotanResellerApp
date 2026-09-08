import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameChannelsInteractor } from './GameChannelsInteractor';
import { useGameChannelsRouter } from './GameChannelsRouter';
import {
  CustomProductPurchaseSuccessMeta,
  NotificationItem,
  NotificationMeta,
} from '@/api/actions/user/userAPIDataTypes';
import { parseUtcToLocalDate } from '@/global/utils/dateUtils';

function getNotificationMeta(item: NotificationItem): NotificationMeta | undefined {
  return item.meta ?? item.data?.meta;
}

function isCustomProductPurchaseSuccessMeta(
  meta: NotificationMeta | undefined,
): meta is CustomProductPurchaseSuccessMeta {
  return meta?.kind === 'custom_product_purchase_success';
}

/**
 * Codes may intentionally end with "," (admin-entered).
 * Multiple codes are joined with ", ", which can look like double commas.
 */
function splitJoinedGiftCardCodes(raw: string): string[] {
  return raw
    .split(', ')
    .map(code => code.trim())
    .filter(code => code.length > 0);
}

function parseCodesFromMessage(message: string | undefined): string[] {
  if (!message) {
    return [];
  }

  const match = message.match(/Code:\s*(.+)$/i);
  if (!match?.[1]) {
    return [];
  }

  return splitJoinedGiftCardCodes(match[1].trim());
}

function getPurchaseSuccessCodes(item: NotificationItem): string[] {
  const meta = getNotificationMeta(item);
  if (!isCustomProductPurchaseSuccessMeta(meta)) {
    return [];
  }

  if (Array.isArray(meta.sku_codes) && meta.sku_codes.length > 0) {
    return meta.sku_codes
      .map(code => String(code).trim())
      .filter(code => code.length > 0);
  }

  if (typeof meta.sku_code === 'string' && meta.sku_code.trim().length > 0) {
    return splitJoinedGiftCardCodes(meta.sku_code.trim());
  }

  return parseCodesFromMessage(item.message || item.data?.message);
}

export function useGameChannelsPresentor(navigation: any) {
  const [notiPage, setNotiPage] = useState(1);
  const [channelsPage, setChannelsPage] = useState(1);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [allChannels, setAllChannels] = useState<any[]>([]);
  const [isGiftCardCodesModalVisible, setIsGiftCardCodesModalVisible] =
    useState(false);
  const [purchasedGiftCardCodes, setPurchasedGiftCardCodes] = useState<
    string[]
  >([]);

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

  // Keep accumulated pages for infinite scroll
  useEffect(() => {
    if (!channelsData?.data) {
      return;
    }

    const filteredData = channelsData.data.filter(
      c => c.name?.toLowerCase() !== 'sign error',
    );

    if (channelsPage === 1) {
      setAllChannels(filteredData);
      return;
    }

    setAllChannels(prev => {
      const existingIds = new Set(prev.map(c => c.id));
      const newChannels = filteredData.filter(c => !existingIds.has(c.id));
      return [...prev, ...newChannels];
    });
  }, [channelsData, channelsPage]);

  // Derive display list synchronously from API data on page 1 to avoid empty-state flash
  // while waiting for the allChannels sync effect.
  const processedChannels = useMemo(() => {
    const pageChannels = channelsData?.data
      ? channelsData.data.filter(c => c.name?.toLowerCase() !== 'sign error')
      : null;

    const source =
      channelsPage === 1 && pageChannels ? pageChannels : allChannels;

    return source.map(gameItem => {
      const chatChannels = Array.isArray(gameItem.chat_channels)
        ? gameItem.chat_channels
        : [];

      const latestChannel = [...chatChannels].sort((a, b) => {
        const aTime =
          parseUtcToLocalDate(
            a.last_message?.created_at || a.updated_at || 0,
          )?.getTime() ?? 0;
        const bTime =
          parseUtcToLocalDate(
            b.last_message?.created_at || b.updated_at || 0,
          )?.getTime() ?? 0;
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
  }, [allChannels, channelsData, channelsPage]);

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

  const showGiftCardCodesModal = useCallback((codes: string[]) => {
    if (codes.length === 0) {
      return;
    }
    setPurchasedGiftCardCodes(codes);
    setIsGiftCardCodesModalVisible(true);
  }, []);

  const closeGiftCardCodesModal = useCallback(() => {
    setIsGiftCardCodesModalVisible(false);
    setPurchasedGiftCardCodes([]);
  }, []);

  const handleNotificationClick = useCallback(
    async (item: NotificationItem) => {
      const codes = getPurchaseSuccessCodes(item);
      if (codes.length > 0) {
        showGiftCardCodesModal(codes);
      }

      if (!item.read_at) {
        try {
          await markAsRead({ id: item.id }).unwrap();
        } catch (err) {
          console.error('Failed to mark notification as read:', err);
        }
      }
    },
    [markAsRead, showGiftCardCodesModal],
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
    getPurchaseSuccessCodes,
    isGiftCardCodesModalVisible,
    purchasedGiftCardCodes,
    closeGiftCardCodesModal,
    showGiftCardCodesModal,
  };
}
