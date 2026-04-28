import { useMemo } from 'react';
import { useGetGiftCardListQuery, usePurchaseGiftCardMutation } from '@/api/actions/gift-card/giftCardApi';
import { useGetWalletBalanceQuery, useGetCoinsDataQuery } from '@/api/actions/wallet/walletApi';

export function useGiftCardListInteractor(categoryId: number, page?: number, perPage?: number) {
  const [purchaseGiftCard, { isLoading: purchaseIsLoading }] = usePurchaseGiftCardMutation();

  const {
    data: giftCardsData,
    isLoading: giftCardsIsLoading,
    isFetching: giftCardsIsFetching,
    error: giftCardsError,
    refetch: giftCardsRefetch,
  } = useGetGiftCardListQuery({ category_id: categoryId, page, per_page: perPage });

  const {
    data: balanceData,
    isLoading: balanceIsLoading,
    refetch: balanceRefetch,
  } = useGetWalletBalanceQuery();

  const {
    data: coinsData,
    isLoading: coinsIsLoading,
    refetch: coinsRefetch,
  } = useGetCoinsDataQuery();

  return useMemo(
    () => ({
      giftCardsData,
      giftCardsIsLoading,
      giftCardsIsFetching,
      giftCardsError,
      giftCardsRefetch,
      balanceData,
      balanceIsLoading,
      balanceRefetch,
      coinsData,
      coinsIsLoading,
      coinsRefetch,
      purchaseGiftCard,
      purchaseIsLoading,
    }),
    [
      giftCardsData,
      giftCardsIsLoading,
      giftCardsIsFetching,
      giftCardsError,
      giftCardsRefetch,
      balanceData,
      balanceIsLoading,
      balanceRefetch,
      coinsData,
      coinsIsLoading,
      coinsRefetch,
      purchaseGiftCard,
      purchaseIsLoading,
    ],
  );
}
