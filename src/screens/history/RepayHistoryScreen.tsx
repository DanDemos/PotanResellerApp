import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useGetRepayRequestsQuery } from '@/api/actions/wallet/walletApi';
import { RepayRequest } from '@/api/actions/wallet/walletAPIDataTypes';
import { styles } from './RepayHistoryScreen.styles';
import { colors } from '@/theme/colors';
import { formatFullDate } from '@/utils/dateUtils';

export function RepayHistoryScreen(): React.ReactNode {
  const [historyItems, setHistoryItems] = useState<RepayRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: repayData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetRepayRequestsQuery(
    {
      page: currentPage,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  useEffect(() => {
    if (repayData?.data) {
      const newData = repayData.data;
      if (currentPage === 1) {
        setHistoryItems(newData);
      } else {
        setHistoryItems(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const filteredNewData = newData.filter(
            item => !existingIds.has(item.id),
          );
          return [...prev, ...filteredNewData];
        });
      }
    }
  }, [repayData, currentPage]);

  const onRefresh = useCallback(() => {
    setCurrentPage(1);
    refetch();
  }, [refetch]);

  function loadMore() {
    if (!isFetching && repayData && currentPage < repayData.last_page) {
      setCurrentPage(prev => prev + 1);
    }
  }

  function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case 'approved':
        return { bg: '#DCFCE7', text: '#166534' };
      case 'rejected':
      case 'failed':
        return { bg: '#FEE2E2', text: '#991B1B' };
      default:
        return { bg: '#FEF3C7', text: '#D97706' };
    }
  }

  function renderItem({ item }: { item: RepayRequest }) {
    const statusColors = getStatusColor(item.status);

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

  if (isLoading && currentPage === 1) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error && historyItems.length === 0) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="error-outline" size={60} color="#EF4444" />
        <Text style={styles.errorText}>
          {(error as any)?.data?.message || 'Failed to load repayment history'}
        </Text>
        <TouchableOpacity
          style={{ marginTop: 20, padding: 10 }}
          onPress={onRefresh}
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
        data={historyItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onRefresh={onRefresh}
        refreshing={isFetching && currentPage === 1}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetching && currentPage > 1 ? (
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
