import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { useGetUserDataQuery } from '@/api/actions/user/userApi';
import { useRefillMoneyMutation } from '@/api/actions/wallet/walletApi';
import { colors } from '@/theme/colors';
import { styles } from './ProfileScreen.styles';

export default function ProfileScreen() {
  const {
    data: userData,
    isLoading: isUserLoading,
    isFetching: isUserFetching,
    error: userError,
    refetch,
  } = useGetUserDataQuery(undefined, { refetchOnMountOrArgChange: true });
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [refillMoney, { isLoading: isRefilling }] = useRefillMoneyMutation();

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleRefillMMK = useCallback(() => {
    if (!userData?.user) {
      return;
    }

    Alert.prompt(
      'Refill MMK',
      'Enter the amount you wish to refill (MMK)',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Refill',
          onPress: async (amount: string | undefined) => {
            if (!amount || isNaN(Number(amount))) {
              Alert.alert(
                'Invalid Amount',
                'Please enter a valid numeric amount.',
              );
              return;
            }
            try {
              if (userData?.user) {
                await refillMoney({
                  user_id: userData.user.id.toString(),
                  amount: amount,
                  note: 'Refill from Profile Dashboard',
                }).unwrap();
                Toast.show({
                  type: 'success',
                  text1: 'Refill Success',
                  text2: `${amount} MMK has been added to your balance.`,
                });
              }
            } catch (err) {
              Toast.show({
                type: 'error',
                text1: 'Refill Failed',
                text2: 'Could not process the refill. Please try again.',
              });
            }
          },
        },
      ],
      'plain-text',
    );
  }, [userData, refillMoney]);

  const isLoading = isUserLoading;
  const error = userError;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !userData || !userData.user) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Failed to load profile</Text>
      </View>
    );
  }

  const user = userData.user;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isUserFetching}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email ?? 'No email'}</Text>
            {user.type === 'buyer' && (
              <View style={styles.vipBadge}>
                <MaterialIcons name="star" size={16} color="#000" />
                <Text style={styles.vipText}>VIP MEMBER</Text>
              </View>
            )}
          </View>
        </View>

        {/* Contact Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialIcons name="call" size={24} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialIcons name="mail" size={24} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email ?? 'No email'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Wallet Dashboard Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wallet Dashboard</Text>

          {/* MMK Wallet Card */}
          <View style={styles.balanceCard}>
            <View style={styles.walletHeader}>
              <View style={styles.walletIcon}>
                <Text style={styles.currencyText}>K</Text>
              </View>
              <View style={styles.walletTitleContainer}>
                <Text style={styles.walletTitle}>Myanmar Kyat (MMK)</Text>
                <Text style={styles.walletAmount}>
                  {user.money_balance
                    ? parseFloat(user.money_balance).toLocaleString()
                    : 0}{' '}
                </Text>
                {user.money_debt > 0 && (
                  <Text style={styles.debtText}>
                    Debt:{' '}
                    {parseFloat(user.money_debt.toString()).toLocaleString()}{' '}
                    MMK
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.walletActions}>
              <TouchableOpacity
                style={[styles.walletActionButton, styles.historyButton]}
                onPress={() => navigation.navigate('MoneyHistory')}
              >
                <MaterialIcons name="history" size={20} color="#666" />
                <Text style={styles.historyButtonText}>History</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.walletActionButton, styles.topupButton]}
                onPress={handleRefillMMK}
                disabled={isRefilling}
              >
                {isRefilling ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <MaterialIcons name="add" size={20} color="#fff" />
                    <Text style={styles.topupButtonText}>Refill</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Coin Wallet Card */}
          <View style={styles.balanceCard}>
            <View style={styles.walletHeader}>
              <View style={[styles.walletIcon, styles.coinIcon]}>
                <MaterialIcons
                  name="monetization-on"
                  size={32}
                  color="#ffd700"
                />
              </View>
              <View style={styles.walletTitleContainer}>
                <Text style={styles.walletTitle}>Total Coins</Text>
                <Text style={[styles.walletAmount, styles.coinAmount]}>
                  {user.coins ?? 0}
                </Text>
              </View>
            </View>

            <View style={styles.walletActions}>
              <TouchableOpacity
                style={[styles.walletActionButton, styles.historyButton]}
                onPress={() => navigation.navigate('CoinHistory')}
              >
                <MaterialIcons name="history" size={20} color="#666" />
                <Text style={styles.historyButtonText}>History</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.walletActionButton, styles.coinTopupButton]}
                activeOpacity={0.7}
              >
                <MaterialIcons name="shopping-cart" size={20} color="#fff" />
                <Text style={styles.topupButtonText}>Top Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Other Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Settings</Text>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <MaterialIcons name="settings" size={24} color={colors.primary} />
            <Text style={styles.actionButtonText}>Account Settings</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <MaterialIcons name="help" size={24} color={colors.primary} />
            <Text style={styles.actionButtonText}>Help & Support</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
