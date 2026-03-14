
import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { MoneyHistoryGroupedItem } from '@/api/actions/wallet/walletAPIDataTypes';
import { styles } from './MoneyHistoryScreen.styles';
import { colors } from '@/global/theme/colors';
import { formatHistoryDate } from '@/global/utils/dateUtils';
import { useMoneyHistoryPresentor } from '@/features/history/MoneyHistory/MoneyHistoryPresentor';

export function MoneyHistoryScreen({ navigation }: any): React.ReactNode {
  const presenter = useMoneyHistoryPresentor(navigation);

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
                  presenter.interval === item && styles.filterButtonActive,
                ]}
                onPress={() => presenter.handleIntervalChange(item)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    presenter.interval === item && styles.filterButtonTextActive,
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

      {presenter.moneyHistoryIsLoading && presenter.currentPage === 1 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : presenter.moneyHistoryError && presenter.historyItems.length === 0 ? (
        <View style={styles.center}>
          <MaterialIcons name="error-outline" size={60} color="#EF4444" />
          <Text style={styles.errorText}>
            {(presenter.moneyHistoryError as any)?.data?.message ||
              (presenter.moneyHistoryError as any)?.message ||
              'Failed to load history'}
          </Text>
          <TouchableOpacity
            style={[
              styles.retryButton,
              presenter.moneyHistoryIsFetching && { opacity: 0.7 },
            ]}
            onPress={presenter.onRefresh}
            disabled={presenter.moneyHistoryIsFetching}
          >
            {presenter.moneyHistoryIsFetching ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.retryButtonText}>Try Again</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={presenter.historyItems}
          keyExtractor={item => item.bucket}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onRefresh={presenter.onRefresh}
          refreshing={presenter.moneyHistoryIsFetching && presenter.currentPage === 1}
          onEndReached={presenter.loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            presenter.moneyHistoryIsFetching && presenter.currentPage > 1 ? (
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
