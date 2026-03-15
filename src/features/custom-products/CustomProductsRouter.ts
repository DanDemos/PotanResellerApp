
import { useMemo } from 'react';

export function useCustomProductsRouter(navigation: any) {
  return useMemo(
    () => ({
      navigateToProductList: (categoryId: number, categoryName: string) => {
        navigation.navigate('CustomProductList', { categoryId, categoryName });
      },
      openDrawer: () => {
        if (navigation.openDrawer) {
          navigation.openDrawer();
        }
      },
    }),
    [navigation],
  );
}
