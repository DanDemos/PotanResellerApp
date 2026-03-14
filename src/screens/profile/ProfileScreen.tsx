import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { colors } from '@/global/theme/colors';
import { styles } from './ProfileScreen.styles';
import { WalletProfileComponent } from './components/WalletProfileComponent';
import { RepaymentModal } from './modals/RepaymentModal';
import { CoinTransactionModal } from './modals/CoinTransactionModal';
import { ChangePasswordModal } from './modals/ChangePasswordModal';
import { RefillModal } from './modals/RefillModal';
import { LoanRequestModal } from './modals/LoanRequestModal';

// VIPER Imports
import { useProfileInteractor } from '@/features/profile/ProfileInteractor';
import { ProfileRouter } from '@/features/profile/ProfileRouter';
import { useProfilePresenter } from '@/features/profile/ProfilePresentor';

export function ProfileScreen(): React.ReactNode {
  const navigation = useNavigation<any>();

  // VIPER Initialization
  const interactor = useProfileInteractor();
  const router = useMemo(() => new ProfileRouter(navigation), [navigation]);
  const presenter = useProfilePresenter(interactor, router);

  const { userRefetch } = interactor;

  useFocusEffect(
    useCallback(() => {
      userRefetch();
    }, [userRefetch]),
  );

  if (presenter.isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (presenter.error || !presenter.user) {
    const errorMsg =
      (presenter.error as any)?.data?.message ||
      (presenter.error as any)?.message ||
      'Failed to load profile';
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  const user = presenter.user;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={presenter.isFetching}
            onRefresh={presenter.onRefresh}
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
                <MaterialIcons name="star" size={16} color={colors.textDark} />
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
          openRefillModal={presenter.openRefillModal}
          requestRefillIsLoading={presenter.refillLoading}
          openLoanModal={presenter.openLoanModal}
          requestLoanIsLoading={presenter.loanLoading}
          openRepayModal={presenter.openRepayModal}
          openCoinTopUpModal={presenter.handleTopUpCoins}
          openCoinConvertModal={presenter.handleConvertCoinsAction}
          convertCoinsIsLoading={presenter.convertLoading}
        />

        {/* Other Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Settings</Text>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.7}
            onPress={presenter.openPasswordModal}
          >
            <MaterialIcons name="lock" size={24} color={colors.primary} />
            <Text style={styles.actionButtonText}>Change Password</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.7}
            onPress={presenter.navigateToSupport}
          >
            <MaterialIcons name="help" size={24} color={colors.primary} />
            <Text style={styles.actionButtonText}>Help & Support</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Refill Modal */}
      <RefillModal
        visible={presenter.refillModalVisible}
        setVisible={presenter.setRefillModalVisible}
        isLoading={presenter.refillLoading}
        isSuccess={presenter.refillSuccess}
        onSubmit={presenter.confirmRefill}
      />

      {/* Coin Transaction Modal */}
      <CoinTransactionModal
        visible={presenter.coinModalVisible}
        setVisible={presenter.setCoinModalVisible}
        coinMode={presenter.coinMode}
        coinRateData={presenter.coinRateData}
        handleConfirm={presenter.confirmCoinTransaction}
        isLoading={presenter.convertLoading || presenter.refillLoading}
        isSuccess={presenter.convertSuccess || presenter.refillSuccess}
      />

      {/* Repayment Modal */}
      <RepaymentModal
        visible={presenter.repayModalVisible}
        setVisible={presenter.setRepayModalVisible}
        isLoading={presenter.repayLoading}
        isSuccess={presenter.repaySuccess}
        onSubmit={presenter.confirmRepayment}
        user={user}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        visible={presenter.passwordModalVisible}
        setVisible={presenter.setPasswordModalVisible}
      />

      {/* Loan Request Modal */}
      <LoanRequestModal
        visible={presenter.loanModalVisible}
        setVisible={presenter.setLoanModalVisible}
        isLoading={presenter.loanLoading}
        isSuccess={presenter.loanSuccess}
        onSubmit={presenter.confirmLoan}
      />
    </SafeAreaView>
  );
}
