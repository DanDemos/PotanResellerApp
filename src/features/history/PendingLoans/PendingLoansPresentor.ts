
import { useCallback, useMemo } from 'react';
import { usePendingLoansInteractor } from './PendingLoansInteractor';
import { useHistoryRouter } from '../HistoryRouter';

export function usePendingLoansPresentor(navigation: any) {
  const interactor = usePendingLoansInteractor();
  const router = useHistoryRouter(navigation);

  const { refetch } = interactor;

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return useMemo(
    () => ({
      ...interactor,
      ...router,
      onRefresh,
    }),
    [interactor, router, onRefresh],
  );
}
