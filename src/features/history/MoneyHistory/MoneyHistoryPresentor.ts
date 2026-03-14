
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useMoneyHistoryInteractor } from './MoneyHistoryInteractor';
import { useHistoryRouter } from '../HistoryRouter';
import { MoneyHistoryGroupedItem } from '@/api/actions/wallet/walletAPIDataTypes';

export function useMoneyHistoryPresentor(navigation: any) {
  const [historyItems, setHistoryItems] = useState<MoneyHistoryGroupedItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [interval, setInterval] = useState<'daily' | 'weekly' | 'monthly'>(
    'daily',
  );

  const interactor = useMoneyHistoryInteractor(interval, currentPage);
  const router = useHistoryRouter(navigation);

  const {
    moneyHistoryData,
    moneyHistoryIsFetching,
    moneyHistoryIsLoading,
    moneyHistoryError,
    moneyHistoryRefetch,
  } = interactor;

  useEffect(() => {
    if (moneyHistoryData?.data?.data) {
      const newData = moneyHistoryData.data.data;
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
  }, [moneyHistoryData, currentPage]);

  const onRefresh = useCallback(() => {
    setCurrentPage(1);
    moneyHistoryRefetch();
  }, [moneyHistoryRefetch]);

  const loadMore = useCallback(() => {
    if (
      !moneyHistoryIsFetching &&
      moneyHistoryData?.data &&
      currentPage < moneyHistoryData.data.last_page
    ) {
      setCurrentPage(prev => prev + 1);
    }
  }, [moneyHistoryIsFetching, moneyHistoryData, currentPage]);

  const handleIntervalChange = useCallback(
    (newInterval: 'daily' | 'weekly' | 'monthly') => {
      if (newInterval === interval) {
        moneyHistoryRefetch();
      } else {
        setInterval(newInterval);
        setCurrentPage(1);
        setHistoryItems([]);
      }
    },
    [interval, moneyHistoryRefetch],
  );

  return useMemo(
    () => ({
      historyItems,
      interval,
      moneyHistoryIsFetching,
      moneyHistoryIsLoading,
      moneyHistoryError,
      onRefresh,
      loadMore,
      handleIntervalChange,
      currentPage,
      lastPage: moneyHistoryData?.data?.last_page || 1,
      ...router,
    }),
    [
      historyItems,
      interval,
      moneyHistoryIsFetching,
      moneyHistoryIsLoading,
      moneyHistoryError,
      onRefresh,
      loadMore,
      handleIntervalChange,
      currentPage,
      moneyHistoryData,
      router,
    ],
  );
}
