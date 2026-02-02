import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetCoinHistoryQuery } from '@/api/actions/wallet/walletApi';
import { CoinHistoryItem } from '@/api/actions/wallet/walletAPIDataTypes';
import { styles } from './CoinHistoryScreen.styles';
import { colors } from '@/theme/colors';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

export default function CoinHistoryScreen() {
  const userID = useSelector((state: RootState) => state.auth.user?.id);

  const { data, isLoading, error } = useGetCoinHistoryQuery(
    {
      interval: 'daily',
      userId: userID?.toString() || '',
    },
    {
      skip: !userID,
    },
  );

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
        <Text style={styles.errorText}>Failed to load history</Text>
      </View>
    );
  }

  const historyData = data?.data?.data || [];

  const renderItem = ({ item }: { item: CoinHistoryItem }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.date}>{item.bucket}</Text>
        <Text style={styles.amount}>{item.net_amount} Coins</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Transactions:</Text>
        <Text style={styles.count}>{item.tx_count}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <FlatList
        data={historyData}
        keyExtractor={item => item.bucket}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No coin history found.</Text>
        }
      />
    </SafeAreaView>
  );
}
