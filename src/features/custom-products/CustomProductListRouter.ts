
import { useMemo } from 'react';

export function useCustomProductListRouter(navigation: any) {
  return useMemo(
    () => ({
      goBack: () => navigation.goBack(),
      navigateToProductDetail: (productId: number) => {
        // navigation.navigate('CustomProductDetail', { productId });
      },
    }),
    [navigation],
  );
}
