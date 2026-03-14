
import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { RepayRequest } from '@/api/actions/wallet/walletAPIDataTypes';
import { styles } from './RepayHistoryScreen.styles';
import { colors } from '@/global/theme/colors';
import { formatFullDate } from '@/global/utils/dateUtils';
import { useRepayHistoryPresentor } from '@/features/history/RepayHistory/RepayHistoryPresentor';

export function RepayHistoryScreen({ navigation }: any): React.ReactNode {
  const presenter = useRepayHistoryPresentor(navigation);

  function renderItem({ item }: { item: RepayRequest }) {
    const statusColors = presenter.getStatusColor(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.date}>{formatFullDate(item.created_at)}</Text>
          <View
            style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}
          >
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.amount}>
          {parseFloat(item.amount).toLocaleString()} MMK
        </Text>

        {item.note ? (
          <View style={styles.noteContainer}>
            <Text style={styles.noteLabel}>Note</Text>
            <Text style={styles.noteText}>{item.note}</Text>
          </View>
        ) : null}

        {item.reject_reason ? (
          <View
            style={[
              styles.noteContainer,
              { backgroundColor: '#FEE2E2', marginTop: 12 },
            ]}
          >
            <Text style={[styles.noteLabel, { color: '#991B1B' }]}>
              Reject Reason
            </Text>
            <Text style={[styles.noteText, { color: '#991B1B' }]}>
              {item.reject_reason}
            </Text>
          </View>
        ) : null}

        {item.photo_path ? (
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: item.photo_path }}
              style={styles.photo}
              resizeMode="cover"
            />
          </View>
        ) : null}
      </View>
    );
  }

  if (presenter.isLoading && presenter.currentPage === 1) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (presenter.error && presenter.historyItems.length === 0) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="error-outline" size={60} color="#EF4444" />
        <Text style={styles.errorText}>
          {(presenter.error as any)?.data?.message || 'Failed to load repayment history'}
        </Text>
        <TouchableOpacity
          style={{ marginTop: 20, padding: 10 }}
          onPress={presenter.onRefresh}
        >
          <Text style={{ color: colors.primary, fontWeight: '700' }}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <FlatList
        data={presenter.historyItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onRefresh={presenter.onRefresh}
        refreshing={presenter.isFetching && presenter.currentPage === 1}
        onEndReached={presenter.loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          presenter.isFetching && presenter.currentPage > 1 ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="history" size={80} color="#E2E8F0" />
            <Text style={styles.emptyText}>No repayment history found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
