
import { useMemo } from 'react';

export function useGameChannelsRouter(navigation: any) {
  return useMemo(
    () => ({
      openDrawer: () => navigation.openDrawer(),
      navigateToChat: (channelUuid: string, gameName: string) =>
        navigation.navigate('Chat', { channelUuid, gameName }),
      navigateToProfile: () => navigation.navigate('Profile'),
    }),
    [navigation],
  );
}
