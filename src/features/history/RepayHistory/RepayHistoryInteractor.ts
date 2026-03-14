
import { useMemo } from 'react';
import { useGetRepayRequestsQuery } from '@/api/actions/wallet/walletApi';

export function useRepayHistoryInteractor(currentPage: number) {
  const {
    data: repayData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetRepayRequestsQuery(
    {
      page: currentPage,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  return useMemo(
    () => ({
      repayData,
      isLoading,
      isFetching,
      error,
      refetch,
    }),
    [repayData, isLoading, isFetching, error, refetch],
  );
}
