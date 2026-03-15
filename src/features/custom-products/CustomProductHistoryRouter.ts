
import { useMemo } from 'react';

export function useCustomProductHistoryRouter(navigation: any) {
  return useMemo(
    () => ({
      goBack: () => {
        navigation.goBack();
      },
      navigateToProductDetail: (productId: number) => {
        // navigation.navigate('ProductDetail', { productId });
      },
    }),
    [navigation],
  );
}
