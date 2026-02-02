import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetMoneyHistoryQuery } from '@/api/actions/wallet/walletApi';
import { MoneyHistoryItem } from '@/api/actions/wallet/walletAPIDataTypes';
import { styles } from './MoneyHistoryScreen.styles';
import { colors } from '@/theme/colors';

export default function MoneyHistoryScreen() {
  const { data, isLoading, error } = useGetMoneyHistoryQuery({});

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

  const historyData = data?.data || [];

  const renderItem = ({ item }: { item: MoneyHistoryItem }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.type}>{item.type}</Text>
        <Text style={styles.amount}>{item.amount} MMK</Text>
      </View>
      <Text style={styles.id}>ID: {item.id}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <FlatList
        data={historyData}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No transactions found.</Text>
        }
      />
    </SafeAreaView>
  );
}
