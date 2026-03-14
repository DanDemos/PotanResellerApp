
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRepayHistoryInteractor } from './RepayHistoryInteractor';
import { useHistoryRouter } from '../HistoryRouter';
import { RepayRequest } from '@/api/actions/wallet/walletAPIDataTypes';

export function useRepayHistoryPresentor(navigation: any) {
  const [historyItems, setHistoryItems] = useState<RepayRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const interactor = useRepayHistoryInteractor(currentPage);
  const router = useHistoryRouter(navigation);

  const { repayData, isFetching, refetch } = interactor;

  useEffect(() => {
    if (repayData?.data) {
      const newData = repayData.data;
      if (currentPage === 1) {
        setHistoryItems(newData);
      } else {
        setHistoryItems(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const filteredNewData = newData.filter(
            item => !existingIds.has(item.id),
          );
          return [...prev, ...filteredNewData];
        });
      }
    }
  }, [repayData, currentPage]);

  const onRefresh = useCallback(() => {
    setCurrentPage(1);
    refetch();
  }, [refetch]);

  const loadMore = useCallback(() => {
    if (!isFetching && repayData && currentPage < repayData.last_page) {
      setCurrentPage(prev => prev + 1);
    }
  }, [isFetching, repayData, currentPage]);

  const getStatusColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return { bg: '#DCFCE7', text: '#166534' };
      case 'rejected':
      case 'failed':
        return { bg: '#FEE2E2', text: '#991B1B' };
      default:
        return { bg: '#FEF3C7', text: '#D97706' };
    }
  }, []);

  return useMemo(
    () => ({
      ...interactor,
      ...router,
      historyItems,
      currentPage,
      onRefresh,
      loadMore,
      getStatusColor,
    }),
    [interactor, router, historyItems, currentPage, onRefresh, loadMore, getStatusColor],
  );
}
