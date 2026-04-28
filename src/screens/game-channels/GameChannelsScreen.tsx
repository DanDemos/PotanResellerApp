import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { colors } from '@/global/theme/colors';
import { styles } from './GameChannelsScreen.styles';
import { useGameChannelsPresentor } from '@/features/game-channels/GameChannelsPresentor';
import { NotificationListModal } from '@/components/NotificationListModal';
import { MainHeader } from '@/components/MainHeader';

export function GameChannelsScreen({ navigation }: any): React.ReactNode {
  const gameChannelsPresenter = useGameChannelsPresentor(navigation);

  function renderChannelItem({ item }: { item: any }) {
    return (
      <TouchableOpacity
        style={styles.channelItem}
        onPress={() =>
          gameChannelsPresenter.navigateToChat(
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
                  ? new Date(item.last_message.created_at).toLocaleTimeString(
                      [],
                      { hour: '2-digit', minute: '2-digit' },
                    )
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
    );
  }
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <MainHeader 
        title="Games" 
        onMenuPress={gameChannelsPresenter.openDrawer} 
        presenter={gameChannelsPresenter} 
      />

      <NotificationListModal presenter={gameChannelsPresenter} />

      {/* Channel List */}
      {gameChannelsPresenter.channelsIsLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : gameChannelsPresenter.channelsError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {(gameChannelsPresenter.channelsError as any)?.data?.message ||
              (gameChannelsPresenter.channelsError as any)?.message ||
              'Failed to load channels.'}
          </Text>
          <TouchableOpacity
            onPress={() => gameChannelsPresenter.channelsRefetch()}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={gameChannelsPresenter.processedChannels || []}
          keyExtractor={(item: any, index) => `${item.id}-${index}`}
          renderItem={renderChannelItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onRefresh={() => {
            gameChannelsPresenter.handleMainRefresh();
          }}
          refreshing={
            gameChannelsPresenter.channelsIsFetching &&
            gameChannelsPresenter.channelsPage === 1
          }
          onEndReached={gameChannelsPresenter.handleLoadMoreChannels}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            gameChannelsPresenter.channelsIsFetching &&
            gameChannelsPresenter.channelsPage > 1 ? (
              <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}
