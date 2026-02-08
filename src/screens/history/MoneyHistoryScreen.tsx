import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useGetMoneyHistoryGroupedQuery } from '@/api/actions/wallet/walletApi';
import { MoneyHistoryGroupedItem } from '@/api/actions/wallet/walletAPIDataTypes';
import { styles } from './MoneyHistoryScreen.styles';
import { colors } from '@/theme/colors';
import { formatHistoryDate } from '@/utils/dateUtils';

export function MoneyHistoryScreen(): React.ReactNode {
  const [historyItems, setHistoryItems] = useState<MoneyHistoryGroupedItem[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [interval, setInterval] = useState<'daily' | 'weekly' | 'monthly'>(
    'daily',
  );

  const {
    data: moneyHistoryData,
    isFetching: moneyHistoryIsFetching,
    isLoading: moneyHistoryIsLoading,
    error: moneyHistoryError,
    refetch: moneyHistoryRefetch,
  } = useGetMoneyHistoryGroupedQuery(
    {
      interval,
      page: currentPage,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  // Handle data updates and infinite scroll merging
  useEffect(() => {
    if (moneyHistoryData?.data?.data) {
      const newData = moneyHistoryData.data.data;
      if (currentPage === 1) {
        setHistoryItems(newData);
      } else {
        // Only append if it's actually new data for a new page
        setHistoryItems(prev => {
          // Prevent duplicates by checking buckets
          const existingBuckets = new Set(prev.map(item => item.bucket));
          const newItems = newData.filter(
            item => !existingBuckets.has(item.bucket),
          );
          return [...prev, ...newItems];
        });
      }
    }
  }, [moneyHistoryData, currentPage]);

  const onRefresh = useCallback(() => {
    setCurrentPage(1);
    moneyHistoryRefetch();
  }, [moneyHistoryRefetch]);

  function loadMore() {
    if (
      !moneyHistoryIsFetching &&
      moneyHistoryData?.data &&
      currentPage < moneyHistoryData.data.last_page
    ) {
      setCurrentPage(prev => prev + 1);
    }
  }

  function handleIntervalChange(newInterval: 'daily' | 'weekly' | 'monthly') {
    if (newInterval === interval) {
      moneyHistoryRefetch();
    } else {
      setInterval(newInterval);
      setCurrentPage(1);
      setHistoryItems([]);
    }
  }

  function renderItem({ item }: { item: MoneyHistoryGroupedItem }) {
    const isPositive = parseFloat(item.net_amount) >= 0;
    const isPending =
      parseFloat(item.first_balance_before) ===
      parseFloat(item.last_balance_after);

    return (
      <View style={styles.card}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={styles.type}>{formatHistoryDate(item.bucket)}</Text>
          {isPending && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>PENDING</Text>
            </View>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.statLabel}>Net Change</Text>
          <Text
            style={[
              styles.amount,
              styles.netAmount,
              { color: isPositive ? '#22C55E' : '#EF4444' },
            ]}
          >
            {isPositive ? '+' : ''}
            {parseFloat(item.net_amount).toLocaleString()} MMK
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Before</Text>
            <Text style={styles.statValue}>
              {parseFloat(item.first_balance_before).toLocaleString()}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>After</Text>
            <Text style={styles.statValue}>
              {parseFloat(item.last_balance_after).toLocaleString()}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Count</Text>
            <Text style={styles.statValue}>{item.tx_count}</Text>
          </View>
        </View>

        {isPending && (
          <View style={styles.pendingInfoContainer}>
            <Text style={styles.pendingInfoText}>
              Awaiting admin approval. Balance will update once approved.
            </Text>
          </View>
        )}
      </View>
    );
  }

  function renderFilterBar() {
    return (
      <View style={styles.filterBar}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Show</Text>
          <View style={styles.intervalButtons}>
            {(['daily', 'weekly', 'monthly'] as const).map(item => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.filterButton,
                  interval === item && styles.filterButtonActive,
                ]}
                onPress={() => handleIntervalChange(item)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    interval === item && styles.filterButtonTextActive,
                  ]}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {renderFilterBar()}

      {moneyHistoryIsLoading && currentPage === 1 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : moneyHistoryError && historyItems.length === 0 ? (
        <View style={styles.center}>
          <MaterialIcons name="error-outline" size={60} color="#EF4444" />
          <Text style={styles.errorText}>
            {(moneyHistoryError as any)?.data?.message ||
              (moneyHistoryError as any)?.message ||
              'Failed to load history'}
          </Text>
          <TouchableOpacity
            style={[
              styles.retryButton,
              moneyHistoryIsFetching && { opacity: 0.7 },
            ]}
            onPress={onRefresh}
            disabled={moneyHistoryIsFetching}
          >
            {moneyHistoryIsFetching ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.retryButtonText}>Try Again</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={historyItems}
          keyExtractor={item => item.bucket}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onRefresh={onRefresh}
          refreshing={moneyHistoryIsFetching && currentPage === 1}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            moneyHistoryIsFetching && currentPage > 1 ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="history" size={80} color="#E2E8F0" />
              <Text style={styles.emptyText}>No history records found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
