import { useMemo } from 'react';

export function useGiftCardHistoryRouter(navigation: any) {
  return useMemo(
    () => ({
      goBack: () => {
        navigation.goBack();
      },
      navigateToGiftCardDetail: (giftCardId: number) => {
        // navigation.navigate('GiftCardDetail', { giftCardId });
      },
    }),
    [navigation],
  );
}
