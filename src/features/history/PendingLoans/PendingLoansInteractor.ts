
import { useMemo } from 'react';
import { useGetPendingLoansQuery } from '@/api/actions/wallet/walletApi';

export function usePendingLoansInteractor() {
  const {
    data: loansData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetPendingLoansQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  return useMemo(
    () => ({
      loansData,
      isLoading,
      isFetching,
      error,
      refetch,
    }),
    [loansData, isLoading, isFetching, error, refetch],
  );
}
