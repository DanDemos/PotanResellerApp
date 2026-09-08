import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { colors } from '@/global/theme/colors';
import { styles } from './GameChannelsScreen.styles';
import { useGameChannelsPresentor } from '@/features/game-channels/GameChannelsPresentor';
import { MainHeader } from '@/components/MainHeader';
import { formatHistoryDateTime } from '@/global/utils/dateUtils';

type GameChannelsBodyProps = {
  channels: any[];
  channelsIsLoading: boolean;
  channelsError: unknown;
  channelsIsFetching: boolean;
  channelsPage: number;
  onRetry: () => void;
  onRefresh: () => void;
  onLoadMore: () => void;
  onOpenChat: (uuid: string, title: string, regionId?: number) => void;
};

const GameChannelsBody = memo(function GameChannelsBody({
  channels,
  channelsIsLoading,
  channelsError,
  channelsIsFetching,
  channelsPage,
  onRetry,
  onRefresh,
  onLoadMore,
  onOpenChat,
}: GameChannelsBodyProps): React.ReactNode {
  const renderChannelItem = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        style={styles.channelItem}
        onPress={() =>
          onOpenChat(
            item.uuid,
            (item as any).displayTitle,
            (item as any).region?.id,
          )
        }
        activeOpacity={0.6}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {(item as any).displayTitle.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.channelContent}>
          <View style={styles.topRow}>
            <View style={styles.nameContainer}>
              <Text style={styles.channelName} numberOfLines={1}>
                {(item as any).displayTitle}
              </Text>
            </View>

            <View style={styles.metaContainer}>
              {item.isPinned && (
                <MaterialIcons
                  name="push-pin"
                  size={12}
                  color={colors.icon}
                  style={styles.pinIcon}
                />
              )}
              <Text style={styles.timeText}>
                {item.last_message
                  ? formatHistoryDateTime(item.last_message.created_at)
                  : ''}
              </Text>
            </View>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.messageText} numberOfLines={2}>
              {item.last_message?.body || 'No messages yet'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [onOpenChat],
  );

  if (channelsIsLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (channelsError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {(channelsError as any)?.data?.message ||
            (channelsError as any)?.message ||
            'Failed to load channels.'}
        </Text>
        <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={channels}
      keyExtractor={(item: any, index) => `${item.id}-${index}`}
      renderItem={renderChannelItem}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      onRefresh={onRefresh}
      refreshing={channelsIsFetching && channelsPage === 1}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        channelsIsFetching ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons
              name="sports-esports"
              size={64}
              color={colors.icon || '#9ca3af'}
            />
            <Text style={styles.emptyTitle}>No Games Available</Text>
            <Text style={styles.emptySubtitle}>
              There are currently no active game channels. Pull down to refresh
              or check back later.
            </Text>
          </View>
        )
      }
      ListFooterComponent={
        channelsIsFetching && channelsPage > 1 ? (
          <View style={styles.loadingFooter}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : null
      }
    />
  );
});

export function GameChannelsScreen({ navigation }: any): React.ReactNode {
  const gameChannelsPresenter = useGameChannelsPresentor(navigation);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <MainHeader
        title="Games"
        onMenuPress={gameChannelsPresenter.openDrawer}
        presenter={gameChannelsPresenter}
      />

      <GameChannelsBody
        channels={gameChannelsPresenter.processedChannels || []}
        channelsIsLoading={gameChannelsPresenter.channelsIsLoading}
        channelsError={gameChannelsPresenter.channelsError}
        channelsIsFetching={gameChannelsPresenter.channelsIsFetching}
        channelsPage={gameChannelsPresenter.channelsPage}
        onRetry={gameChannelsPresenter.channelsRefetch}
        onRefresh={gameChannelsPresenter.handleMainRefresh}
        onLoadMore={gameChannelsPresenter.handleLoadMoreChannels}
        onOpenChat={gameChannelsPresenter.navigateToChat}
      />
    </SafeAreaView>
  );
}
