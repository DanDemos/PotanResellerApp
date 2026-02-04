import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useSelector } from 'react-redux';
import { useGetCoinHistoryQuery } from '@/api/actions/wallet/walletApi';
import { CoinHistoryItem } from '@/api/actions/wallet/walletAPIDataTypes';
import { styles } from './CoinHistoryScreen.styles';
import { colors } from '@/theme/colors';
import { RootState } from '@/redux/store';
import { formatHistoryDate } from '@/utils/dateUtils';

export default function CoinHistoryScreen() {
  const userID = useSelector((state: RootState) => state.auth.user?.id);
  const [historyItems, setHistoryItems] = useState<CoinHistoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [interval, setInterval] = useState<'daily' | 'weekly' | 'monthly'>(
    'daily',
  );

  const {
    data: coinHistoryData,
    isFetching: coinHistoryIsFetching,
    isLoading: coinHistoryIsLoading,
    error: coinHistoryError,
    refetch: coinHistoryRefetch,
  } = useGetCoinHistoryQuery(
    {
      interval,
      userId: userID?.toString() || '',
      page: currentPage,
    },
    {
      skip: !userID,
      refetchOnMountOrArgChange: true,
    },
  );

  // Handle data updates and infinite scroll merging
  useEffect(() => {
    if (coinHistoryData?.data?.data) {
      const newData = coinHistoryData.data.data;
      if (currentPage === 1) {
        setHistoryItems(newData);
      } else {
        setHistoryItems(prev => {
          const existingBuckets = new Set(prev.map(item => item.bucket));
          const newItems = newData.filter(
            item => !existingBuckets.has(item.bucket),
          );
          return [...prev, ...newItems];
        });
      }
    }
  }, [coinHistoryData, currentPage]);

  const onRefresh = useCallback(() => {
    setCurrentPage(1);
    coinHistoryRefetch();
  }, [coinHistoryRefetch]);

  function loadMore() {
    if (
      !coinHistoryIsFetching &&
      coinHistoryData?.data &&
      coinHistoryData.data.last_page &&
      currentPage < coinHistoryData.data.last_page
    ) {
      setCurrentPage(prev => prev + 1);
    }
  }

  function handleIntervalChange(newInterval: 'daily' | 'weekly' | 'monthly') {
    if (newInterval === interval) {
      coinHistoryRefetch();
    } else {
      setInterval(newInterval);
      setCurrentPage(1);
      setHistoryItems([]);
    }
  }

  function renderItem({ item }: { item: CoinHistoryItem }) {
    const isPositive = parseFloat(item.net_amount) >= 0;
    const isPending = item.first_balance_before === item.last_balance_after;

    return (
      <View style={styles.card}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={styles.date}>{formatHistoryDate(item.bucket)}</Text>
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
            {parseFloat(item.net_amount).toLocaleString()} Coins
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Before</Text>
            <Text style={styles.statValue}>
              {item.first_balance_before.toLocaleString()}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>After</Text>
            <Text style={styles.statValue}>
              {item.last_balance_after.toLocaleString()}
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

      {coinHistoryIsLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : coinHistoryError ? (
        <View style={styles.center}>
          <MaterialIcons name="error-outline" size={60} color="#EF4444" />
          <Text style={styles.errorText}>
            {(coinHistoryError as any)?.data?.message ||
              (coinHistoryError as any)?.message ||
              'Failed to load history'}
          </Text>
          <TouchableOpacity
            style={[
              styles.retryButton,
              coinHistoryIsFetching && { opacity: 0.7 },
            ]}
            onPress={onRefresh}
            disabled={coinHistoryIsFetching}
          >
            {coinHistoryIsFetching ? (
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
          refreshing={coinHistoryIsFetching && currentPage === 1}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            coinHistoryIsFetching && currentPage > 1 ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="history" size={80} color="#E2E8F0" />
              <Text style={styles.emptyText}>No coin records found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
