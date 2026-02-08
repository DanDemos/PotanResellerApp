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
  handleRefillMMK: () => void;
  requestRefillIsLoading: boolean;
  handleLoanRequest: () => void;
  requestLoanIsLoading: boolean;
  handleOpenRepayModal: () => void;
  handleTopUpCoins: () => void;
  handleConvertCoins: () => void;
  convertCoinsIsLoading: boolean;
}

export const WalletProfileComponent: React.FC<WalletProfileComponentProps> = ({
  user,
  navigation,
  handleRefillMMK,
  requestRefillIsLoading,
  handleLoanRequest,
  requestLoanIsLoading,
  handleOpenRepayModal,
  handleTopUpCoins,
  handleConvertCoins,
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
              viewBox="0 0 160 320"
              preserveAspectRatio="none"
            >
              <Path
                d="M 16,0 L 144,0 C 152.8,0 160,7.2 160,16 L 160,130 C 160,145 148,145 148,160 C 148,175 160,175 160,190 L 160,304 C 160,312.8 152.8,320 144,320 L 16,320 C 7.2,320 0,312.8 0,304 L 0,16 C 0,7.2 7.2,0 16,0 Z"
                fill="#ffffff"
                stroke="#eeeeee"
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
            <TouchableOpacity
              style={[
                styles.walletActionButton,
                styles.topupButton,
                styles.compactActionButton,
              ]}
              onPress={handleRefillMMK}
              disabled={requestRefillIsLoading}
            >
              <MaterialIcons name="add" size={18} color="#fff" />
              <Text style={styles.topupButtonText}>Refill</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.walletActionButton,
                styles.loanButton,
                styles.compactActionButton,
              ]}
              onPress={handleLoanRequest}
              disabled={requestLoanIsLoading}
            >
              <MaterialIcons
                name="account-balance-wallet"
                size={18}
                color="#666"
              />
              <Text style={styles.loanButtonText}>Loan</Text>
            </TouchableOpacity>

            {Number(user.money_debt || 0) > 0 && (
              <TouchableOpacity
                style={[
                  styles.walletActionButton,
                  styles.historyButton,
                  styles.compactActionButton,
                ]}
                onPress={handleOpenRepayModal}
              >
                <MaterialIcons
                  name="payments"
                  size={18}
                  color={colors.primary}
                />
                <Text
                  style={[styles.historyButtonText, { color: colors.primary }]}
                >
                  Repay
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.walletActionButton,
                styles.historyButton,
                styles.compactActionButton,
              ]}
              onPress={() => navigation.navigate('MoneyHistory')}
            >
              <MaterialIcons name="history" size={18} color="#666" />
              <Text style={styles.historyButtonText}>History</Text>
            </TouchableOpacity>
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
            onPress={handleConvertCoins}
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
              viewBox="0 0 160 320"
              preserveAspectRatio="none"
            >
              <Path
                d="M 16,0 L 144,0 C 152.8,0 160,7.2 160,16 L 160,304 C 160,312.8 152.8,320 144,320 L 16,320 C 7.2,320 0,312.8 0,304 L 0,190 C 0,175 12,175 12,160 C 12,145 0,145 0,130 L 0,16 C 0,7.2 7.2,0 16,0 Z"
                fill="#ffffff"
                stroke="#eeeeee"
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
            <TouchableOpacity
              style={[
                styles.walletActionButton,
                styles.coinTopupButton,
                styles.compactActionButton,
              ]}
              onPress={handleTopUpCoins}
              disabled={requestRefillIsLoading}
            >
              <MaterialIcons name="add" size={18} color={colors.white} />
              <Text style={styles.topupButtonText}>Refill</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.walletActionButton,
                styles.historyButton,
                styles.compactActionButton,
              ]}
              onPress={() => navigation.navigate('CoinHistory')}
            >
              <MaterialIcons name="history" size={18} color="#666" />
              <Text style={styles.historyButtonText}>History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
