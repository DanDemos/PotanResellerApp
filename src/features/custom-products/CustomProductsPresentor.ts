import { useState, useMemo } from 'react';
import { useCustomProductsInteractor } from './CustomProductsInteractor';
import { useCustomProductsRouter } from './CustomProductsRouter';

export function useCustomProductsPresentor(navigation?: any) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const interactor = useCustomProductsInteractor(page, perPage);
  const router = useCustomProductsRouter(navigation);

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
