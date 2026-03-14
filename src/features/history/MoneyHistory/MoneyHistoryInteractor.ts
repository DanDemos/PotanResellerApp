
import { useMemo } from 'react';
import { useGetMoneyHistoryGroupedQuery } from '@/api/actions/wallet/walletApi';

export function useMoneyHistoryInteractor(
  interval: 'daily' | 'weekly' | 'monthly',
  currentPage: number,
) {
  const {
    data: moneyHistoryData,
    isFetching: moneyHistoryIsFetching,
    isLoading: moneyHistoryIsLoading,
    error: moneyHistoryError,
    refetch: moneyHistoryRefetch,
  } = useGetMoneyHistoryGroupedQuery(
    {
      interval,
      page: currentPage,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  return useMemo(
    () => ({
      moneyHistoryData,
      moneyHistoryIsFetching,
      moneyHistoryIsLoading,
      moneyHistoryError,
      moneyHistoryRefetch,
    }),
    [
      moneyHistoryData,
      moneyHistoryIsFetching,
      moneyHistoryIsLoading,
      moneyHistoryError,
      moneyHistoryRefetch,
    ],
  );
}
