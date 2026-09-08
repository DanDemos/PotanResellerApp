import { useState, useMemo, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { useGiftCardHistoryInteractor } from './GiftCardHistoryInteractor';
import { useGiftCardHistoryRouter } from './GiftCardHistoryRouter';
import { PurchaseHistoryItem } from '@/api/actions/gift-card/giftCardAPIDataTypes';
import { GiftCardCodesProductInfo } from '@/screens/gift-card-list/modals/GiftCardCodesModal';

export function useGiftCardHistoryPresentor(navigation: any) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [isGiftCardCodesModalVisible, setIsGiftCardCodesModalVisible] =
    useState(false);
  const [purchasedGiftCardCodes, setPurchasedGiftCardCodes] = useState<
    string[]
  >([]);
  const [giftCardCodesProductInfo, setGiftCardCodesProductInfo] =
    useState<GiftCardCodesProductInfo | null>(null);

  const interactor = useGiftCardHistoryInteractor(page, perPage);
  const router = useGiftCardHistoryRouter(navigation);

  const handleRefresh = useCallback(() => {
    setPage(1);
    interactor.historyRefetch();
  }, [interactor]);

  const handleLoadMore = useCallback(() => {
    if (
      !interactor.historyIsFetching &&
      interactor.historyData &&
      interactor.historyData.last_page &&
      page < interactor.historyData.last_page
    ) {
      setPage(prev => prev + 1);
    }
  }, [interactor, page]);

  const showGiftCardCodesModal = useCallback(
    (codes: string[], productInfo?: GiftCardCodesProductInfo | null) => {
      if (codes.length === 0) {
        return;
      }
      setPurchasedGiftCardCodes(codes);
      setGiftCardCodesProductInfo(productInfo ?? null);
      setIsGiftCardCodesModalVisible(true);
    },
    [],
  );

  const closeGiftCardCodesModal = useCallback(() => {
    setIsGiftCardCodesModalVisible(false);
    setPurchasedGiftCardCodes([]);
    setGiftCardCodesProductInfo(null);
  }, []);

  const handleHistoryItemPress = useCallback(
    (item: PurchaseHistoryItem) => {
      const code = item.sku?.code?.trim();
      if (!code) {
        Toast.show({
          type: 'error',
          text1: 'No Gift Card Code',
          text2: 'This purchase does not have a gift card code yet.',
        });
        return;
      }

      showGiftCardCodesModal([code], {
        productName: item.custom_product?.name,
        categoryName: item.custom_product?.category?.name,
      });
    },
    [showGiftCardCodesModal],
  );

  return useMemo(
    () => ({
      ...interactor,
      ...router,
      page,
      handleRefresh,
      handleLoadMore,
      handleHistoryItemPress,
      isGiftCardCodesModalVisible,
      purchasedGiftCardCodes,
      giftCardCodesProductInfo,
      closeGiftCardCodesModal,
    }),
    [
      interactor,
      router,
      page,
      handleRefresh,
      handleLoadMore,
      handleHistoryItemPress,
      isGiftCardCodesModalVisible,
      purchasedGiftCardCodes,
      giftCardCodesProductInfo,
      closeGiftCardCodesModal,
    ],
  );
}
