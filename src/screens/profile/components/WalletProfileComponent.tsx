import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { colors } from '@/global/theme/colors';
import { styles } from '../ProfileScreen.styles';
import { User } from '@/api/actions/user/userAPIDataTypes';
import { useWalletProfilePresenter } from '@/features/profile/components/WalletProfilePresenter';

interface WalletProfileComponentProps {
  user: User;
  navigation: any;
  openRefillModal: () => void;
  requestRefillIsLoading: boolean;
  openLoanModal: () => void;
  requestLoanIsLoading: boolean;
  openRepayModal: () => void;
  openCoinTopUpModal: () => void;
  openCoinConvertModal: () => void;
  convertCoinsIsLoading: boolean;
}

export function WalletProfileComponent({
  user,
  navigation,
  openRefillModal,
  requestRefillIsLoading,
  openLoanModal,
  requestLoanIsLoading,
  openRepayModal,
  openCoinTopUpModal,
}: WalletProfileComponentProps): React.ReactNode {
  const {
    formattedBalance,
    formattedDebt,
    navigateToMoneyHistory,
    navigateToPendingLoans,
    navigateToRepayHistory,
    navigateToCoinHistory,
  } = useWalletProfilePresenter(user, navigation);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Wallet</Text>

      <View style={styles.walletsContainer}>
        {/* MMK Wallet Card */}
        <View style={styles.compactBalanceCard}>
          <View style={[styles.walletHeader, styles.compactWalletHeader]}>
            <View style={[styles.walletIcon, styles.compactWalletIcon]}>
              <Text style={[styles.currencyText, { fontSize: 16 }]}>Ks</Text>
            </View>
            <View style={styles.walletTitleContainer}>
              <Text style={styles.walletTitle}>Balance (MMK)</Text>
              <Text style={[styles.walletAmount, styles.compactWalletAmount]}>
                {formattedBalance}
              </Text>
              {Number(user.money_debt || 0) > 0 && (
                <Text style={[styles.debtText, { fontSize: 10 }]}>
                  Debt: {formattedDebt}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.compactWalletActions}>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.walletActionButton,
                  styles.topupButton,
                  styles.compactActionButton,
                ]}
                onPress={openRefillModal}
                disabled={requestRefillIsLoading}
              >
                <MaterialIcons name="add" size={18} color={colors.white} />
                <Text style={styles.topupButtonText}>Refill</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.historyIconBtn}
                onPress={navigateToMoneyHistory}
              >
                <MaterialIcons name="history" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.walletActionButton,
                  styles.loanButton,
                  styles.compactActionButton,
                ]}
                onPress={openLoanModal}
                disabled={requestLoanIsLoading}
              >
                <MaterialIcons
                  name="account-balance-wallet"
                  size={18}
                  color="#666"
                />
                <Text style={styles.loanButtonText}>Loan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.historyIconBtn}
                onPress={navigateToPendingLoans}
              >
                <MaterialIcons name="history" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {Number(user.money_debt || 0) > 0 && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[
                    styles.walletActionButton,
                    styles.historyButton,
                    styles.compactActionButton,
                  ]}
                  onPress={openRepayModal}
                >
                  <MaterialIcons
                    name="payments"
                    size={18}
                    color={colors.primary}
                  />
                  <Text
                    style={[
                      styles.historyButtonText,
                      { color: colors.primary },
                    ]}
                  >
                    Repay
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.historyIconBtn}
                  onPress={navigateToRepayHistory}
                >
                  <MaterialIcons name="history" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Coin Wallet Card */}
        <View style={styles.compactBalanceCard}>
          <View style={[styles.walletHeader, styles.compactWalletHeader]}>
            <View
              style={[
                styles.walletIcon,
                styles.coinIcon,
                styles.compactWalletIcon,
              ]}
            >
              <MaterialIcons
                name="monetization-on"
                size={20}
                color={colors.white}
              />
            </View>
            <View style={styles.walletTitleContainer}>
              <Text style={styles.walletTitle}>Smile Coins</Text>
              <Text
                style={[
                  styles.walletAmount,
                  styles.coinAmount,
                  styles.compactWalletAmount,
                ]}
              >
                {user.coins ?? 0}
              </Text>
            </View>
          </View>

          <View style={styles.compactWalletActions}>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.walletActionButton,
                  styles.coinTopupButton,
                  styles.compactActionButton,
                ]}
                onPress={openCoinTopUpModal}
                disabled={requestRefillIsLoading}
              >
                <MaterialIcons name="add" size={18} color={colors.white} />
                <Text style={styles.topupButtonText}>Refill</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.historyIconBtn}
                onPress={navigateToCoinHistory}
              >
                <MaterialIcons name="history" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
