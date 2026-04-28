import { useMemo } from 'react';

export function useGiftCardsRouter(navigation: any) {
  return useMemo(
    () => ({
      navigateToProductList: (categoryId: number, categoryName: string) => {
        navigation.navigate('GiftCardList', { categoryId, categoryName });
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
