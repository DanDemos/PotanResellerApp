import React, { useCallback } from 'react';
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
import { useGetPendingLoansQuery } from '@/api/actions/wallet/walletApi';
import { PendingLoan } from '@/api/actions/wallet/walletAPIDataTypes';
import { styles } from './PendingLoansScreen.styles';
import { colors } from '@/theme/colors';
import { formatFullDate } from '@/utils/dateUtils';

export function PendingLoansScreen(): React.ReactNode {
  const {
    data: loansData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetPendingLoansQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  function renderItem({ item }: { item: PendingLoan }) {
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.date}>{formatFullDate(item.created_at)}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
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
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="error-outline" size={60} color="#EF4444" />
        <Text style={styles.errorText}>
          {(error as any)?.data?.message || 'Failed to load pending loans'}
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
        data={loansData?.data || []}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons
              name="account-balance-wallet"
              size={80}
              color="#E2E8F0"
            />
            <Text style={styles.emptyText}>No pending loans found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
