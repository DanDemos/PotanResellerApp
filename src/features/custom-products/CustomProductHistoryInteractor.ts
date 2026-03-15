
import { useMemo } from 'react';
import { useGetPurchaseProductHistoryQuery } from '@/api/actions/custom-product/customProductApi';

export function useCustomProductHistoryInteractor(page?: number, perPage?: number) {
  const {
    data: historyData,
    isLoading: historyIsLoading,
    isFetching: historyIsFetching,
    error: historyError,
    refetch: historyRefetch,
  } = useGetPurchaseProductHistoryQuery({ page, per_page: perPage });

  return useMemo(
    () => ({
      historyData,
      historyIsLoading,
      historyIsFetching,
      historyError,
      historyRefetch,
    }),
    [
      historyData,
      historyIsLoading,
      historyIsFetching,
      historyError,
      historyRefetch,
    ],
  );
}
