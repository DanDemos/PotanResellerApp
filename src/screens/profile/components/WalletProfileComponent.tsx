import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { colors } from '@/theme/colors';
import { styles } from '../ProfileScreen.styles';
import { User } from '@/api/actions/user/userAPIDataTypes';

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

export const WalletProfileComponent: React.FC<WalletProfileComponentProps> = ({
  user,
  navigation,
  openRefillModal,
  requestRefillIsLoading,
  openLoanModal,
  requestLoanIsLoading,
  openRepayModal,
  openCoinTopUpModal,
  openCoinConvertModal,
  convertCoinsIsLoading,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Wallet</Text>

      <View style={styles.walletsContainer}>
        {/* MMK Wallet Card */}
        <View style={styles.compactBalanceCard}>
          <View style={StyleSheet.absoluteFill}>
            <Svg
              width="100%"
              height="100%"
              viewBox="0 0 160 280"
              preserveAspectRatio="none"
            >
              <Path
                d="M 16,0 L 144,0 C 152.8,0 160,7.2 160,16 L 160,110 C 160,125 148,125 148,140 C 148,155 160,155 160,170 L 160,264 C 160,272.8 152.8,280 144,280 L 16,280 C 7.2,280 0,272.8 0,264 L 0,16 C 0,7.2 7.2,0 16,0 Z"
                fill="#ffffff"
                stroke="#e0e0e0"
                strokeWidth="1"
              />
            </Svg>
          </View>
          <View style={[styles.walletHeader, styles.compactWalletHeader]}>
            <View style={[styles.walletIcon, styles.compactWalletIcon]}>
              <Text style={[styles.currencyText, { fontSize: 16 }]}>Ks</Text>
            </View>
            <View style={styles.walletTitleContainer}>
              <Text style={styles.walletTitle}>Balance (MMK)</Text>
              <Text style={[styles.walletAmount, styles.compactWalletAmount]}>
                {user.money_balance
                  ? Math.floor(
                      parseFloat(user.money_balance) || 0,
                    ).toLocaleString()
                  : 0}
              </Text>
              {Number(user.money_debt || 0) > 0 && (
                <Text style={[styles.debtText, { fontSize: 10 }]}>
                  Debt: {Math.floor(Number(user.money_debt)).toLocaleString()}
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
                <MaterialIcons name="add" size={18} color="#fff" />
                <Text style={styles.topupButtonText}>Refill</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.historyIconBtn}
                onPress={() => navigation.navigate('MoneyHistory')}
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
                onPress={() => navigation.navigate('PendingLoans')}
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
                  onPress={() => navigation.navigate('RepayHistory')}
                >
                  <MaterialIcons name="history" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Floating Conversion Arrow */}
        {convertCoinsIsLoading ? (
          <View style={styles.floatingConversionLoadingButton}>
            <ActivityIndicator size="small" color={colors.white} />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.floatingConversionButton}
            activeOpacity={0.8}
            onPress={openCoinConvertModal}
            disabled={convertCoinsIsLoading}
          >
            <MaterialIcons
              name="trending-flat"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}

        {/* Coin Wallet Card */}
        <View style={styles.compactBalanceCard}>
          <View style={StyleSheet.absoluteFill}>
            <Svg
              width="100%"
              height="100%"
              viewBox="0 0 160 280"
              preserveAspectRatio="none"
            >
              <Path
                d="M 16,0 L 144,0 C 152.8,0 160,7.2 160,16 L 160,264 C 160,272.8 152.8,280 144,280 L 16,280 C 7.2,280 0,272.8 0,264 L 0,170 C 0,155 12,155 12,140 C 12,125 0,125 0,110 L 0,16 C 0,7.2 7.2,0 16,0 Z"
                fill="#ffffff"
                stroke="#e0e0e0"
                strokeWidth="1"
              />
            </Svg>
          </View>
          <View style={[styles.walletHeader, styles.compactWalletHeader]}>
            <View
              style={[
                styles.walletIcon,
                styles.coinIcon,
                styles.compactWalletIcon,
              ]}
            >
              <MaterialIcons name="monetization-on" size={20} color="#fff9e6" />
            </View>
            <View style={styles.walletTitleContainer}>
              <Text style={styles.walletTitle}>Coins</Text>
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
                onPress={() => navigation.navigate('CoinHistory')}
              >
                <MaterialIcons name="history" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
