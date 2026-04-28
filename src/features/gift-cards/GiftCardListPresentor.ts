
import { useState, useMemo, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { useGiftCardListInteractor } from './GiftCardListInteractor';
import { useGiftCardListRouter } from './GiftCardListRouter';

export function useGiftCardListPresentor(navigation: any, categoryId: number) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const interactor = useGiftCardListInteractor(categoryId, page, perPage);
  const router = useGiftCardListRouter(navigation);

  const handleRefresh = useCallback(() => {
    setPage(1);
    interactor.giftCardsRefetch();
    interactor.balanceRefetch();
    interactor.coinsRefetch();
  }, [interactor]);

  const handleBuy = useCallback(async (giftCardId: number) => {
    try {
      await interactor.purchaseGiftCard({ custom_product_id: giftCardId }).unwrap();

      Toast.show({
        type: 'success',
        text1: 'Purchase Successful',
        text2: 'Your order has been placed successfully.',
      });

      // Optionally refetch balance after purchase
      interactor.balanceRefetch();
      interactor.coinsRefetch();

    } catch (err: any) {
      console.error('Purchase failed:', err);
      Toast.show({
        type: 'error',
        text1: 'Purchase Failed',
        text2: err?.data?.message || 'Something went wrong while purchasing.',
      });
    }
  }, [interactor]);

  const handleLoadMore = useCallback(() => {
    if (
      !interactor.giftCardsIsFetching &&
      interactor.giftCardsData &&
      interactor.giftCardsData.last_page &&
      page < interactor.giftCardsData.last_page
    ) {
      setPage(prev => prev + 1);
    }
  }, [interactor, page]);

  return useMemo(
    () => ({
      ...interactor,
      ...router,
      page,
      handleRefresh,
      handleLoadMore,
      handleBuy,
    }),
    [interactor, router, page, handleRefresh, handleLoadMore, handleBuy],
  );
}
