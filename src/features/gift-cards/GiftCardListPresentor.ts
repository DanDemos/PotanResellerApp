import { useState, useMemo, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { useGiftCardListInteractor } from './GiftCardListInteractor';
import { useGiftCardListRouter } from './GiftCardListRouter';
import { GiftCard } from '@/api/actions/gift-card/giftCardAPIDataTypes';

export function useGiftCardListPresentor(navigation: any, categoryId: number) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);

  const interactor = useGiftCardListInteractor(categoryId, page, perPage);
  const router = useGiftCardListRouter(navigation);

  const handleRefresh = useCallback(() => {
    setPage(1);
    interactor.giftCardsRefetch();
    interactor.balanceRefetch();
    interactor.coinsRefetch();
  }, [interactor]);

  const openBuyModal = useCallback((giftCard: GiftCard) => {
    setSelectedGiftCard(giftCard);
    setPurchaseQuantity(1);
    setIsBuyModalVisible(true);
  }, []);

  const closeBuyModal = useCallback(() => {
    setIsBuyModalVisible(false);
    setSelectedGiftCard(null);
  }, []);

  const handleBuy = useCallback(async () => {
    if (!selectedGiftCard) return;
    try {
      await interactor.purchaseGiftCard({ 
        custom_product_id: selectedGiftCard.id,
        quantity: purchaseQuantity
      }).unwrap();

      Toast.show({
        type: 'success',
        text1: 'Purchase Successful',
        text2: 'Your order has been placed successfully.',
      });

      // Optionally refetch balance after purchase
      interactor.balanceRefetch();
      interactor.coinsRefetch();
      closeBuyModal();

    } catch (err: any) {
      console.error('Purchase failed:', err);
      Toast.show({
        type: 'error',
        text1: 'Purchase Failed',
        text2: err?.data?.message || 'Something went wrong while purchasing.',
      });

      // Fail-safe: refetch the gift card list to get the latest quantities in case of stock changes
      interactor.giftCardsRefetch();
      
      // Close the modal so the user can see the updated stock and try again
      closeBuyModal();
    }
  }, [interactor, selectedGiftCard, purchaseQuantity, closeBuyModal]);

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
      selectedGiftCard,
      purchaseQuantity,
      setPurchaseQuantity,
      isBuyModalVisible,
      openBuyModal,
      closeBuyModal,
    }),
    [interactor, router, page, handleRefresh, handleLoadMore, handleBuy, selectedGiftCard, purchaseQuantity, isBuyModalVisible, openBuyModal, closeBuyModal],
  );
}
