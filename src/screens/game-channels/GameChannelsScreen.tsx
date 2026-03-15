import React from 'react';
import {
  View,
  Text,
  FlatList,
  SectionList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { colors } from '@/global/theme/colors';
import { styles } from './GameChannelsScreen.styles';
import { Channel } from '@/api/actions/gameChannel/gameChannelAPIDataTypes';
import { Category } from '@/api/actions/custom-product/customProductAPIDataTypes';
import { NotificationItem } from '@/api/actions/user/userAPIDataTypes';
import { useGameChannelsPresentor } from '@/features/game-channels/GameChannelsPresentor';
import { useCustomProductsPresentor } from '@/features/custom-products/CustomProductsPresentor';
import { getImageUrl } from '@/global/utils/imageUtils';

export function GameChannelsScreen({ navigation }: any): React.ReactNode {
  const gameChannelsPresenter = useGameChannelsPresentor(navigation);
  const customProductsPresenter = useCustomProductsPresentor(navigation);

  function renderChannelItem({ item }: { item: Channel }) {
    return (
      <TouchableOpacity
        style={styles.channelItem}
        onPress={() =>
          gameChannelsPresenter.navigateToChat(item.uuid, item.game.name)
        }
        activeOpacity={0.6}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.game.name.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.channelContent}>
          <View style={styles.topRow}>
            <View style={styles.nameContainer}>
              <Text style={styles.channelName} numberOfLines={1}>
                {item.game.name}
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
  function renderCategoryItem({ item }: { item: Category }) {
    return (
      <TouchableOpacity
        style={styles.channelItem}
        onPress={() => {
          customProductsPresenter.navigateToProductList(item.id, item.name);
        }}
        activeOpacity={0.6}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            {item.image_path ? (
              <Image
                source={{ uri: getImageUrl(item.image_path) || '' }}
                style={{ width: '100%', height: '100%', borderRadius: 25 }}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.avatarText}>
                {item.name.substring(0, 2).toUpperCase()}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.channelContent}>
          <View style={styles.topRow}>
            <View style={styles.nameContainer}>
              <Text style={styles.channelName} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.messageText} numberOfLines={2}>
              Category
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function renderNotificationItem({ item }: { item: NotificationItem }) {
    return (
      <TouchableOpacity
        style={styles.notificationItem}
        onPress={() => gameChannelsPresenter.handleNotificationClick(item)}
        activeOpacity={0.7}
      >
        {!item.read_at && <View style={styles.unreadDot} />}
        <View style={styles.notificationContent}>
          <View style={styles.notificationTop}>
            <Text style={styles.notificationTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.notificationTime}>
              {new Date(item.created_at).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
          <Text style={styles.notificationBody} numberOfLines={2}>
            {item.message}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={gameChannelsPresenter.openDrawer}>
          <MaterialIcons name="menu" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Game List</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => gameChannelsPresenter.setShowNotifications(true)}
            style={styles.iconButton}
          >
            <View>
              <MaterialIcons
                name="notifications"
                size={26}
                color={colors.primary}
              />
              {gameChannelsPresenter.notiData &&
                gameChannelsPresenter.notiData.unread > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>
                      {gameChannelsPresenter.notiData.unread > 9
                        ? '9+'
                        : gameChannelsPresenter.notiData.unread}
                    </Text>
                  </View>
                )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={gameChannelsPresenter.navigateToProfile}
            style={styles.iconButton}
          >
            <MaterialIcons name="person" size={26} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification Dropdown Modal */}
      <Modal
        visible={gameChannelsPresenter.showNotifications}
        transparent
        animationType="fade"
        onRequestClose={() => gameChannelsPresenter.setShowNotifications(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => gameChannelsPresenter.setShowNotifications(false)}
        >
          <View style={styles.dropdownContainer}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Notifications</Text>
              {gameChannelsPresenter.notiData &&
                gameChannelsPresenter.notiData.unread > 0 && (
                  <TouchableOpacity
                    onPress={gameChannelsPresenter.handleMarkAllAsRead}
                  >
                    <Text style={styles.markAllReadText}>Mark all as read</Text>
                  </TouchableOpacity>
                )}
            </View>
            <FlatList
              data={gameChannelsPresenter.notifications}
              keyExtractor={item => item.id.toString()}
              renderItem={renderNotificationItem}
              onEndReached={gameChannelsPresenter.handleLoadMoreNoti}
              onEndReachedThreshold={0.5}
              onRefresh={gameChannelsPresenter.handleRefreshNoti}
              refreshing={
                gameChannelsPresenter.notiIsFetching &&
                gameChannelsPresenter.notiPage === 1
              }
              ListFooterComponent={
                gameChannelsPresenter.notiIsFetching &&
                gameChannelsPresenter.notiPage > 1 ? (
                  <View style={styles.loadingFooter}>
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                ) : null
              }
              ListEmptyComponent={
                !gameChannelsPresenter.notiIsLoading ? (
                  <View style={styles.listEmpty}>
                    <MaterialIcons
                      name="notifications-none"
                      size={48}
                      color="#cbd5e1"
                    />
                    <Text style={styles.emptyText}>No notifications yet</Text>
                  </View>
                ) : (
                  <View style={styles.listEmpty}>
                    <ActivityIndicator color={colors.primary} />
                  </View>
                )
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>

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
        <SectionList
          sections={[
            {
              title: 'Game Channels',
              data: gameChannelsPresenter.channelsData?.data || [],
              type: 'channel',
            },
            {
              title: 'Categories',
              data: customProductsPresenter.categoriesData?.data || [],
              type: 'category',
            },
          ]}
          keyExtractor={(item: any, index) => `${item.id}-${index}`}
          renderItem={({ item, section }: { item: any; section: any }) => {
            if (section.type === 'category') {
              return renderCategoryItem({ item });
            }
            return renderChannelItem({ item });
          }}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{title}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onRefresh={() => {
            gameChannelsPresenter.handleMainRefresh();
            customProductsPresenter.categoriesRefetch();
          }}
          refreshing={
            gameChannelsPresenter.channelsIsLoading ||
            customProductsPresenter.categoriesIsLoading
          }
        />
      )}
    </SafeAreaView>
  );
}
