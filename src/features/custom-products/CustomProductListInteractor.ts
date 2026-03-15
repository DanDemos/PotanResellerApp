import { useMemo } from 'react';
import { useGetCustomProductListQuery, usePurchaseCustomProductMutation } from '@/api/actions/custom-product/customProductApi';
import { useGetWalletBalanceQuery, useGetCoinsDataQuery } from '@/api/actions/wallet/walletApi';

export function useCustomProductListInteractor(categoryId: number, page?: number, perPage?: number) {
  const [purchaseProduct, { isLoading: purchaseIsLoading }] = usePurchaseCustomProductMutation();

  const {
    data: productsData,
    isLoading: productsIsLoading,
    isFetching: productsIsFetching,
    error: productsError,
    refetch: productsRefetch,
  } = useGetCustomProductListQuery({ category_id: categoryId, page, per_page: perPage });

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
      productsData,
      productsIsLoading,
      productsIsFetching,
      productsError,
      productsRefetch,
      balanceData,
      balanceIsLoading,
      balanceRefetch,
      coinsData,
      coinsIsLoading,
      coinsRefetch,
      purchaseProduct,
      purchaseIsLoading,
    }),
    [
      productsData,
      productsIsLoading,
      productsIsFetching,
      productsError,
      productsRefetch,
      balanceData,
      balanceIsLoading,
      balanceRefetch,
      coinsData,
      coinsIsLoading,
      coinsRefetch,
      purchaseProduct,
      purchaseIsLoading,
    ],
  );
}
