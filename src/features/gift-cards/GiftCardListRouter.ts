import { useMemo } from 'react';

export function useGiftCardListRouter(navigation: any) {
  return useMemo(
    () => ({
      goBack: () => navigation.goBack(),
      navigateToGiftCardDetail: (giftCardId: number) => {
        // navigation.navigate('GiftCardDetail', { giftCardId });
      },
    }),
    [navigation],
  );
}
