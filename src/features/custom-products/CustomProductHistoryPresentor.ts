
import { useState, useMemo, useCallback } from 'react';
import { useCustomProductHistoryInteractor } from './CustomProductHistoryInteractor';
import { useCustomProductHistoryRouter } from './CustomProductHistoryRouter';

export function useCustomProductHistoryPresentor(navigation: any) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const interactor = useCustomProductHistoryInteractor(page, perPage);
  const router = useCustomProductHistoryRouter(navigation);

  const handleRefresh = useCallback(() => {
    setPage(1);
    interactor.historyRefetch();
  }, [interactor]);

  const handleLoadMore = useCallback(() => {
    if (
      !interactor.historyIsFetching &&
      interactor.historyData &&
      interactor.historyData.last_page &&
      page < interactor.historyData.last_page
    ) {
      setPage(prev => prev + 1);
    }
  }, [interactor, page]);

  return useMemo(
    () => ({
      ...interactor,
      ...router,
      page,
      handleRefresh,
      handleLoadMore,
    }),
    [interactor, router, page, handleRefresh, handleLoadMore],
  );
}
