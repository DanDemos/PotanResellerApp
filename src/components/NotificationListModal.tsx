import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { colors } from '@/global/theme/colors';
import { styles } from './NotificationListModal.styles';
import { NotificationItem } from '@/api/actions/user/userAPIDataTypes';

type NotificationListModalProps = {
  visible: boolean;
  onClose: () => void;
  presenter: {
    notiData?: { unread: number } | null;
    handleMarkAllAsRead: () => void;
    notifications: NotificationItem[];
    handleNotificationClick: (item: NotificationItem) => void;
    handleLoadMoreNoti: () => void;
    handleRefreshNoti: () => void;
    notiIsFetching: boolean;
    notiPage: number;
    notiIsLoading: boolean;
    getNotificationMeta: (item: NotificationItem) =>
      | { kind?: string }
      | undefined;
    isCustomProductPurchaseSuccessMeta: (
      meta: { kind?: string } | undefined,
    ) => boolean;
  };
};

export function NotificationListModal({
  visible,
  onClose,
  presenter,
}: NotificationListModalProps): React.ReactNode {
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleRefreshNotiRef = useRef(presenter.handleRefreshNoti);
  handleRefreshNotiRef.current = presenter.handleRefreshNoti;

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  function handleClose() {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
    onClose();
  }

  function handleModalShow() {
    // Defer refresh so the modal paints before the list refetch work starts.
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    refreshTimeoutRef.current = setTimeout(() => {
      refreshTimeoutRef.current = null;
      handleRefreshNotiRef.current();
    }, 0);
  }

  function renderNotificationItem({
    item,
  }: {
    item: NotificationItem;
  }): React.ReactElement {
    const meta = presenter.getNotificationMeta(item);
    const canCopySkuCode = presenter.isCustomProductPurchaseSuccessMeta(meta);

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
          {canCopySkuCode ? (
            <View style={styles.copyHintRow}>
              <MaterialIcons
                name="content-copy"
                size={14}
                color={colors.primary}
              />
              <Text style={styles.copyHintText}>Tap to copy code</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onShow={handleModalShow}
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <View
          style={styles.dropdownContainer}
          onStartShouldSetResponder={() => true}
        >
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
                    color={colors.muted}
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
  );
}
