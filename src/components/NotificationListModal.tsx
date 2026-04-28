import React from 'react';
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

interface NotificationListModalProps {
  presenter: any;
}

export function NotificationListModal({ presenter }: NotificationListModalProps): React.ReactNode {
  function renderNotificationItem({ item }: { item: any }) {
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
            keyExtractor={(item) => item.id.toString()}
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
                  <MaterialIcons name="notifications-none" size={48} color="#cbd5e1" />
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
