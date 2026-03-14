
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useGetCoinHistoryQuery } from '@/api/actions/wallet/walletApi';

export function useCoinHistoryInteractor(
  interval: 'daily' | 'weekly' | 'monthly',
  currentPage: number,
) {
  const userID = useSelector((state: RootState) => state.auth.user?.id);

  const {
    data: coinHistoryData,
    isFetching: coinHistoryIsFetching,
    isLoading: coinHistoryIsLoading,
    error: coinHistoryError,
    refetch: coinHistoryRefetch,
  } = useGetCoinHistoryQuery(
    {
      interval,
      userId: userID?.toString() || '',
      page: currentPage,
    },
    {
      skip: !userID,
      refetchOnMountOrArgChange: true,
    },
  );

  return useMemo(
    () => ({
      coinHistoryData,
      coinHistoryIsFetching,
      coinHistoryIsLoading,
      coinHistoryError,
      coinHistoryRefetch,
    }),
    [
      coinHistoryData,
      coinHistoryIsFetching,
      coinHistoryIsLoading,
      coinHistoryError,
      coinHistoryRefetch,
    ],
  );
}
