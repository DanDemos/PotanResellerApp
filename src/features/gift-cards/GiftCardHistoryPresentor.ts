import { useState, useMemo, useCallback } from 'react';
import { useGiftCardHistoryInteractor } from './GiftCardHistoryInteractor';
import { useGiftCardHistoryRouter } from './GiftCardHistoryRouter';

export function useGiftCardHistoryPresentor(navigation: any) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const interactor = useGiftCardHistoryInteractor(page, perPage);
  const router = useGiftCardHistoryRouter(navigation);

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
