
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
import { Channel } from '@/api/actions/gameChannel/gameChannelAPIDataTypes';
import { NotificationItem } from '@/api/actions/user/userAPIDataTypes';
import { useGameChannelsPresentor } from '@/features/game-channels/GameChannelsPresentor';

export function GameChannelsScreen({ navigation }: any): React.ReactNode {
  const presenter = useGameChannelsPresentor(navigation);

  function renderChannelItem({ item }: { item: Channel }) {
    return (
      <TouchableOpacity
        style={styles.channelItem}
        onPress={() => presenter.navigateToChat(item.uuid, item.game.name)}
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

  function renderNotificationItem({ item }: { item: NotificationItem }) {
    return (
      <TouchableOpacity
        style={styles.notificationItem}
        onPress={() => presenter.handleNotificationClick(item)}
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
        <TouchableOpacity onPress={presenter.openDrawer}>
          <MaterialIcons name="menu" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Game List</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => presenter.setShowNotifications(true)}
            style={styles.iconButton}
          >
            <View>
              <MaterialIcons
                name="notifications"
                size={26}
                color={colors.primary}
              />
              {presenter.notiData && presenter.notiData.unread > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>
                    {presenter.notiData.unread > 9
                      ? '9+'
                      : presenter.notiData.unread}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={presenter.navigateToProfile}
            style={styles.iconButton}
          >
            <MaterialIcons name="person" size={26} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification Dropdown Modal */}
      <Modal
        visible={presenter.showNotifications}
        transparent
        animationType="fade"
        onRequestClose={() => presenter.setShowNotifications(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => presenter.setShowNotifications(false)}
        >
          <View style={styles.dropdownContainer}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Notifications</Text>
              {presenter.notiData && presenter.notiData.unread > 0 && (
                <TouchableOpacity onPress={presenter.handleMarkAllAsRead}>
                  <Text style={styles.markAllReadText}>Mark all as read</Text>
                </TouchableOpacity>
              )}
            </View>
            <FlatList
              data={presenter.notifications}
              keyExtractor={item => item.id.toString()}
              renderItem={renderNotificationItem}
              onEndReached={presenter.handleLoadMoreNoti}
              onEndReachedThreshold={0.5}
              onRefresh={presenter.handleRefreshNoti}
              refreshing={presenter.notiIsFetching && presenter.notiPage === 1}
              ListFooterComponent={
                presenter.notiIsFetching && presenter.notiPage > 1 ? (
                  <View style={styles.loadingFooter}>
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                ) : null
              }
              ListEmptyComponent={
                !presenter.notiIsLoading ? (
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
      {presenter.channelsIsLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : presenter.channelsError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {(presenter.channelsError as any)?.data?.message ||
              (presenter.channelsError as any)?.message ||
              'Failed to load channels.'}
          </Text>
          <TouchableOpacity
            onPress={() => presenter.channelsRefetch()}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={presenter.channelsData?.data || []}
          keyExtractor={item => item.id.toString()}
          renderItem={renderChannelItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onRefresh={presenter.handleMainRefresh}
          refreshing={presenter.channelsIsLoading}
        />
      )}
    </SafeAreaView>
  );
}
