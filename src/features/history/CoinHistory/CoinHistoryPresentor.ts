
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCoinHistoryInteractor } from './CoinHistoryInteractor';
import { useHistoryRouter } from '../HistoryRouter';
import { CoinHistoryItem } from '@/api/actions/wallet/walletAPIDataTypes';

export function useCoinHistoryPresentor(navigation: any) {
  const [historyItems, setHistoryItems] = useState<CoinHistoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [interval, setInterval] = useState<'daily' | 'weekly' | 'monthly'>(
    'daily',
  );

  const interactor = useCoinHistoryInteractor(interval, currentPage);
  const router = useHistoryRouter(navigation);

  const {
    coinHistoryData,
    coinHistoryIsFetching,
    coinHistoryIsLoading,
    coinHistoryError,
    coinHistoryRefetch,
  } = interactor;

  // Handle data updates and infinite scroll merging
  useEffect(() => {
    if (coinHistoryData?.data?.data) {
      const newData = coinHistoryData.data.data;
      if (currentPage === 1) {
        setHistoryItems(newData);
      } else {
        setHistoryItems(prev => {
          const existingBuckets = new Set(prev.map(item => item.bucket));
          const newItems = newData.filter(
            item => !existingBuckets.has(item.bucket),
          );
          return [...prev, ...newItems];
        });
      }
    }
  }, [coinHistoryData, currentPage]);

  const onRefresh = useCallback(() => {
    setCurrentPage(1);
    coinHistoryRefetch();
  }, [coinHistoryRefetch]);

  const loadMore = useCallback(() => {
    if (
      !coinHistoryIsFetching &&
      coinHistoryData?.data &&
      coinHistoryData.data.last_page &&
      currentPage < coinHistoryData.data.last_page
    ) {
      setCurrentPage(prev => prev + 1);
    }
  }, [coinHistoryIsFetching, coinHistoryData, currentPage]);

  const handleIntervalChange = useCallback(
    (newInterval: 'daily' | 'weekly' | 'monthly') => {
      if (newInterval === interval) {
        coinHistoryRefetch();
      } else {
        setInterval(newInterval);
        setCurrentPage(1);
        setHistoryItems([]);
      }
    },
    [interval, coinHistoryRefetch],
  );

  return useMemo(
    () => ({
      historyItems,
      interval,
      coinHistoryIsFetching,
      coinHistoryIsLoading,
      coinHistoryError,
      onRefresh,
      loadMore,
      handleIntervalChange,
      currentPage,
      lastPage: coinHistoryData?.data?.last_page || 1,
      ...router,
    }),
    [
      historyItems,
      interval,
      coinHistoryIsFetching,
      coinHistoryIsLoading,
      coinHistoryError,
      onRefresh,
      loadMore,
      handleIntervalChange,
      currentPage,
      coinHistoryData,
      router,
    ],
  );
}
