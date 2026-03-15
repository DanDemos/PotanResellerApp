
import { useMemo } from 'react';
import { useGetCategoryListQuery } from '@/api/actions/custom-product/customProductApi';

export function useCustomProductsInteractor(page?: number, perPage?: number) {
  const {
    data: categoriesData,
    isLoading: categoriesIsLoading,
    error: categoriesError,
    refetch: categoriesRefetch,
  } = useGetCategoryListQuery({ page, per_page: perPage });

  return useMemo(
    () => ({
      categoriesData,
      categoriesIsLoading,
      categoriesError,
      categoriesRefetch,
    }),
    [
      categoriesData,
      categoriesIsLoading,
      categoriesError,
      categoriesRefetch,
    ],
  );
}
