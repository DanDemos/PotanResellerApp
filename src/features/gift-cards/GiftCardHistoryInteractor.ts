import { useMemo } from 'react';
import { useGetGiftCardHistoryQuery } from '@/api/actions/gift-card/giftCardApi';

export function useGiftCardHistoryInteractor(page?: number, perPage?: number) {
  const {
    data: historyData,
    isLoading: historyIsLoading,
    isFetching: historyIsFetching,
    error: historyError,
    refetch: historyRefetch,
  } = useGetGiftCardHistoryQuery({ page, per_page: perPage });

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
