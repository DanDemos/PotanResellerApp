import { useMemo } from 'react';
import { useGetCategoryListQuery } from '@/api/actions/gift-card/giftCardApi';

export function useGiftCardsInteractor(page?: number, perPage?: number) {
  const {
    data: categoriesData,
    isLoading: categoriesIsLoading,
    isFetching: categoriesIsFetching,
    error: categoriesError,
    refetch: categoriesRefetch,
  } = useGetCategoryListQuery({ page, per_page: perPage });

  return useMemo(
    () => ({
      categoriesData,
      categoriesIsLoading,
      categoriesIsFetching,
      categoriesError,
      categoriesRefetch,
    }),
    [
      categoriesData,
      categoriesIsLoading,
      categoriesIsFetching,
      categoriesError,
      categoriesRefetch,
    ],
  );
}
