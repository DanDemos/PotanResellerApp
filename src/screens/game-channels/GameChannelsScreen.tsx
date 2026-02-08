import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ImageSourcePropType,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import GameIcon1 from '@/assets/game1.png';
import { colors } from '@/theme/colors';
import { styles } from './GameChannelsScreen.styles';
import { useGetChannelsQuery } from '@/api/actions/gameChannel/gameChannelApi';
import { Channel } from '@/api/actions/gameChannel/gameChannelAPIDataTypes';
import {
  useGetNotificationListQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from '@/api/actions/user/userApi';
import { NotificationItem } from '@/api/actions/user/userAPIDataTypes';

export function GameChannelsScreen({ navigation }: any): React.ReactNode {
  const {
    data: channelsData,
    isLoading: channelsIsLoading,
    error: channelsError,
    refetch: channelsRefetch,
  } = useGetChannelsQuery(undefined);

  // Notification States
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notiPage, setNotiPage] = useState(1);

  const {
    data: notiData,
    isLoading: notiIsLoading,
    isFetching: notiIsFetching,
    refetch: notiRefetch,
  } = useGetNotificationListQuery(
    { page: notiPage, per_page: 15 },
    { skip: !showNotifications && notifications.length === 0 },
  );

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  useEffect(() => {
    if (notiData?.items) {
      if (notiPage === 1) {
        setNotifications(notiData.items);
      } else {
        setNotifications(prev => {
          const existingIds = new Set(prev.map((n: NotificationItem) => n.id));
          const newNotis = notiData.items!.filter(
            (n: NotificationItem) => !existingIds.has(n.id),
          );
          return [...prev, ...newNotis];
        });
      }
    }
  }, [notiData, notiPage]);

  const handleLoadMoreNoti = useCallback(() => {
    if (
      !notiIsFetching &&
      notiData &&
      notiData.last_page &&
      notiPage < notiData.last_page
    ) {
      setNotiPage(prev => prev + 1);
    }
  }, [notiIsFetching, notiData, notiPage]);

  const handleRefreshNoti = useCallback(() => {
    setNotiPage(1);
    notiRefetch();
  }, [notiRefetch]);

  const handleNotificationClick = async (item: NotificationItem) => {
    if (!item.read_at) {
      try {
        await markAsRead({ id: item.id }).unwrap();
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
      }
    }
    // Optionally handle navigation based on notification type/meta here
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  function renderChannelItem({ item }: { item: Channel }) {
    return (
      <TouchableOpacity
        style={styles.channelItem}
        onPress={() =>
          navigation.navigate('Chat', {
            channelUuid: item.uuid,
            gameName: item.game.name,
          })
        }
        activeOpacity={0.6}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.game.name.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.channelContent}>
          {/* Top Row: Name and Time */}
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

          {/* Bottom Row: Last Message and Badge */}
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
        onPress={() => handleNotificationClick(item)}
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
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <MaterialIcons name="menu" size={26} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Game List</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setShowNotifications(true)}
            style={styles.iconButton}
          >
            <View>
              <MaterialIcons
                name="notifications"
                size={26}
                color={colors.primary}
              />
              {notiData && notiData.unread > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>
                    {notiData.unread > 9 ? '9+' : notiData.unread}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.iconButton}
          >
            <MaterialIcons name="person" size={26} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification Dropdown Modal */}
      <Modal
        visible={showNotifications}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNotifications(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowNotifications(false)}
        >
          <View style={styles.dropdownContainer}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Notifications</Text>
              {notiData && notiData.unread > 0 && (
                <TouchableOpacity onPress={handleMarkAllAsRead}>
                  <Text style={styles.markAllReadText}>Mark all as read</Text>
                </TouchableOpacity>
              )}
            </View>
            <FlatList
              data={notifications}
              keyExtractor={item => item.id.toString()}
              renderItem={renderNotificationItem}
              onEndReached={handleLoadMoreNoti}
              onEndReachedThreshold={0.5}
              onRefresh={handleRefreshNoti}
              refreshing={notiIsFetching && notiPage === 1}
              ListFooterComponent={
                notiIsFetching && notiPage > 1 ? (
                  <View style={styles.loadingFooter}>
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                ) : null
              }
              ListEmptyComponent={
                !notiIsLoading ? (
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
      {channelsIsLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : channelsError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {(channelsError as any)?.data?.message ||
              (channelsError as any)?.message ||
              'Failed to load channels.'}
          </Text>
          <TouchableOpacity
            onPress={() => channelsRefetch()}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={channelsData?.data || []}
          keyExtractor={item => item.id.toString()}
          renderItem={renderChannelItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onRefresh={channelsRefetch}
          refreshing={channelsIsLoading}
        />
      )}
    </SafeAreaView>
  );
}
