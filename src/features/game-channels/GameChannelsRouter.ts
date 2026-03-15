
import { useMemo } from 'react';

export function useGameChannelsRouter(navigation: any) {
  return useMemo(
    () => ({
      openDrawer: () => navigation.openDrawer(),
      navigateToChat: (channelUuid: string, gameName: string, regionId?: number) =>
        navigation.navigate('Chat', { channelUuid, gameName, regionId }),
      navigateToProfile: () => navigation.navigate('Profile'),
    }),
    [navigation],
  );
}
