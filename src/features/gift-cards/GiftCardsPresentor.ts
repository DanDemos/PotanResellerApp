import { useState, useMemo } from 'react';
import { useGiftCardsInteractor } from './GiftCardsInteractor';
import { useGiftCardsRouter } from './GiftCardsRouter';

export function useGiftCardsPresentor(navigation?: any) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const interactor = useGiftCardsInteractor(page, perPage);
  const router = useGiftCardsRouter(navigation);

  return useMemo(
    () => ({
      ...interactor,
      ...router,
      page,
      setPage,
      perPage,
      setPerPage,
    }),
    [
      interactor,
      router,
      page,
      perPage,
    ],
  );
}
