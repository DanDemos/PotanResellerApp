import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useGetAdminBankInfosQuery } from '@/api/actions/wallet/walletApi';
import { getImageUrl } from '@/global/utils/imageUtils';
import { styles } from './AdminBankInfoList.styles';
import { colors } from '@/global/theme/colors';

export function AdminBankInfoList(): React.ReactNode {
  const { data: bankInfos, isLoading, isError } = useGetAdminBankInfosQuery();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (isError || !bankInfos) {
    return null;
  }

  const activeBanks = bankInfos.filter(bank => bank.is_active);

  if (activeBanks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Transfer To</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No bank accounts available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transfer To</Text>
      {activeBanks.map(bank => (
        <View key={bank.id} style={styles.bankCard}>
          {bank.image_path ? (
            <Image
              source={{ uri: getImageUrl(bank.image_path) || '' }}
              style={styles.bankImage}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.bankImage,
                { alignItems: 'center', justifyContent: 'center' },
              ]}
            >
              <MaterialIcons
                name="account-balance"
                size={24}
                color={colors.muted}
              />
            </View>
          )}
          <View style={styles.bankInfo}>
            <Text style={styles.bankName}>{bank.bank_name}</Text>
            <Text style={styles.accountNumber}>{bank.account_number}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
