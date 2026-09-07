import { useState, useMemo, useCallback } from 'react';
import { useGiftCardsInteractor } from './GiftCardsInteractor';
import { useGiftCardsRouter } from './GiftCardsRouter';

export function useGiftCardsPresentor(navigation?: any) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const interactor = useGiftCardsInteractor(page, perPage);
  const router = useGiftCardsRouter(navigation);


  const {
    categoriesRefetch,
  } = interactor;
  
  const handleMainRefresh = useCallback(() => {
    setPage(1);
    categoriesRefetch();
  }, [categoriesRefetch]);

  return useMemo(
    () => ({
      ...interactor,
      ...router,
      page,
      setPage,
      perPage,
      setPerPage,
      handleMainRefresh,
    }),
    [
      interactor,
      router,
      page,
      perPage,
      handleMainRefresh,
    ],
  );
}
