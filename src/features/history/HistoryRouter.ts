
import { useMemo } from 'react';

export function useHistoryRouter(navigation: any) {
  return useMemo(
    () => ({
      goBack: () => navigation.goBack(),
    }),
    [navigation],
  );
}
