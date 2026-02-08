import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { colors } from '@/theme/colors';
import { styles } from './ProfileScreen.styles';
import { useUserOperations } from '@/hooks/useUserOperations';
import { useWalletOperations } from '@/hooks/useWalletOperations';
import { WalletProfileComponent } from './components/WalletProfileComponent';
import { RepaymentModal } from './components/RepaymentModal';
import { CoinTransactionModal } from './components/CoinTransactionModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';

export function ProfileScreen(): React.ReactNode {
  const navigation = useNavigation<any>();
  // UI Visibility States
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [coinModalVisible, setCoinModalVisible] = useState(false);
  const [repayModalVisible, setRepayModalVisible] = useState(false);

  // Success callbacks to close modals
  const handlePasswordChangeSuccess = useCallback(() => {
    setPasswordModalVisible(false);
  }, []);

  const handleWalletOperationSuccess = useCallback(() => {
    setCoinModalVisible(false);
    setRepayModalVisible(false);
  }, []);

  const {
    userData,
    userIsLoading,
    userIsFetching,
    userError,
    userRefetch,
    changePasswordIsLoading,
    changePasswordIsSuccess,
    onRefresh,
    handleChangePassword,
  } = useUserOperations({
    onPasswordChangeSuccess: handlePasswordChangeSuccess,
  });

  const {
    coinRateData,
    requestRefillIsLoading,
    requestLoanIsLoading,
    convertCoinsIsLoading,
    repayLoanIsLoading,
    convertCoinsIsSuccess,
    requestRefillIsSuccess,
    repayLoanIsSuccess,
    handleRefillMMK,
    handleLoanRequest,
    handleConfirmCoinTransaction,
    handleConfirmRepayment,
  } = useWalletOperations({
    userId: userData?.user?.id,
    userRefetch,
    onSuccess: handleWalletOperationSuccess,
  });

  // Modal specific visibility toggles
  const [coinMode, setCoinMode] = useState<'topup' | 'convert'>('topup');

  const handleTopUpCoins = useCallback(() => {
    setCoinMode('topup');
    setCoinModalVisible(true);
  }, []);

  const handleConvertCoinsAction = useCallback(() => {
    setCoinMode('convert');
    setCoinModalVisible(true);
  }, []);

  const handleOpenRepayModal = useCallback(() => {
    setRepayModalVisible(true);
  }, []);

  const handleOpenPasswordModal = useCallback(() => {
    setPasswordModalVisible(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      userRefetch();
    }, [userRefetch]),
  );

  if (userIsLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (userError || !userData || !userData.user) {
    const errorMsg =
      (userError as any)?.data?.message ||
      (userError as any)?.message ||
      'Failed to load profile';
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{errorMsg}</Text>
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
            refreshing={userIsFetching}
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
            {(user.type === 'vip' || user.type === 'buyer') && (
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

        {/* Wallet Section */}
        <WalletProfileComponent
          user={user}
          navigation={navigation}
          handleRefillMMK={handleRefillMMK}
          requestRefillIsLoading={requestRefillIsLoading}
          handleLoanRequest={handleLoanRequest}
          requestLoanIsLoading={requestLoanIsLoading}
          handleOpenRepayModal={handleOpenRepayModal}
          handleTopUpCoins={handleTopUpCoins}
          handleConvertCoins={handleConvertCoinsAction}
          convertCoinsIsLoading={convertCoinsIsLoading}
        />

        {/* Other Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Settings</Text>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.7}
            onPress={handleOpenPasswordModal}
          >
            <MaterialIcons name="lock" size={24} color={colors.primary} />
            <Text style={styles.actionButtonText}>Change Password</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Support')}
          >
            <MaterialIcons name="help" size={24} color={colors.primary} />
            <Text style={styles.actionButtonText}>Help & Support</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Coin Transaction Modal */}
      <CoinTransactionModal
        visible={coinModalVisible}
        setVisible={setCoinModalVisible}
        coinMode={coinMode}
        coinRateData={coinRateData}
        handleConfirm={handleConfirmCoinTransaction}
        isLoading={convertCoinsIsLoading || requestRefillIsLoading}
        isSuccess={convertCoinsIsSuccess || requestRefillIsSuccess}
      />

      {/* Repayment Modal */}
      <RepaymentModal
        visible={repayModalVisible}
        setVisible={setRepayModalVisible}
        isLoading={repayLoanIsLoading}
        isSuccess={repayLoanIsSuccess}
        onSubmit={handleConfirmRepayment}
        user={user}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        visible={passwordModalVisible}
        setVisible={setPasswordModalVisible}
        isLoading={changePasswordIsLoading}
        isSuccess={changePasswordIsSuccess}
        onSubmit={handleChangePassword}
      />
    </SafeAreaView>
  );
}
