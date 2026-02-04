import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  Image,
  StyleSheet,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Toast from 'react-native-toast-message';
import { useGetUserDataQuery } from '@/api/actions/user/userApi';
import {
  useRequestRefillMutation,
  useRequestLoanMutation,
  useConvertCoinsMutation,
  useGetCoinsRateQuery,
  useRepayLoanMutation,
} from '@/api/actions/wallet/walletApi';
import { colors } from '@/theme/colors';
import { styles } from './ProfileScreen.styles';

export default function ProfileScreen() {
  const {
    data: userData,
    isLoading: userIsLoading,
    isFetching: userIsFetching,
    error: userError,
    refetch: userRefetch,
  } = useGetUserDataQuery(undefined, { refetchOnMountOrArgChange: true });
  const navigation = useNavigation<any>();
  const [
    requestRefill,
    {
      isLoading: requestRefillIsLoading,
      isSuccess: requestRefillIsSuccess,
      isError: requestRefillIsError,
      data: requestRefillData,
      error: requestRefillError,
    },
  ] = useRequestRefillMutation();
  const [
    requestLoan,
    {
      isLoading: requestLoanIsLoading,
      isSuccess: requestLoanIsSuccess,
      isError: requestLoanIsError,
      data: requestLoanData,
      error: requestLoanError,
    },
  ] = useRequestLoanMutation();
  const [
    convertCoins,
    {
      isLoading: convertCoinsIsLoading,
      isSuccess: convertCoinsIsSuccess,
      isError: convertCoinsIsError,
      data: convertCoinsData,
      error: convertCoinsError,
    },
  ] = useConvertCoinsMutation();
  const { data: coinRateData } = useGetCoinsRateQuery();

  // Coin Modal State
  const [coinModalVisible, setCoinModalVisible] = React.useState(false);
  const [coinMode, setCoinMode] = React.useState<'topup' | 'convert'>('topup');
  const [coinAmount, setCoinAmount] = React.useState('');

  // Repayment Modal State
  const [repayModalVisible, setRepayModalVisible] = React.useState(false);
  const [repayAmount, setRepayAmount] = React.useState('');
  const [repayNote, setRepayNote] = React.useState('');
  const [repayPhoto, setRepayPhoto] = React.useState<any>(null);

  const [
    repayLoan,
    {
      isLoading: repayLoanIsLoading,
      isSuccess: repayLoanIsSuccess,
      isError: repayLoanIsError,
      data: repayLoanData,
      error: repayLoanError,
    },
  ] = useRepayLoanMutation();

  useFocusEffect(
    useCallback(() => {
      userRefetch();
    }, [userRefetch]),
  );

  useEffect(() => {
    if (requestRefillIsSuccess && requestRefillData?.data?.request) {
      const { wallet_type, money_amount, coins_amount } =
        requestRefillData.data.request;
      Toast.show({
        type: 'success',
        text1: wallet_type === 'money' ? 'Refill Success' : 'Request Sent',
        text2:
          wallet_type === 'money'
            ? `${money_amount || 0} MMK has been added to your balance.`
            : `Request to top up ${
                coins_amount ?? money_amount ?? 0
              } coins has been sent.`,
      });
      userRefetch();
    }
  }, [requestRefillIsSuccess, requestRefillData, userRefetch]);

  useEffect(() => {
    if (requestRefillIsError && requestRefillError) {
      const err = requestRefillError as any;
      const message =
        typeof err?.message === 'string'
          ? err.message
          : err?.data?.message || 'Operation failed. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    }
  }, [requestRefillIsError, requestRefillError]);

  useEffect(() => {
    if (requestLoanIsSuccess && requestLoanData) {
      Toast.show({
        type: 'success',
        text1: 'Loan Request Sent',
        text2: 'Your request is being processed.',
      });
      userRefetch();
    }
  }, [requestLoanIsSuccess, requestLoanData, userRefetch]);

  useEffect(() => {
    if (requestLoanIsError && requestLoanError) {
      const err = requestLoanError as any;
      const message =
        typeof err?.message === 'string'
          ? err.message
          : err?.data?.message || 'Loan request failed. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    }
  }, [requestLoanIsError, requestLoanError]);

  useEffect(() => {
    if (convertCoinsIsSuccess && convertCoinsData) {
      Toast.show({
        type: 'success',
        text1: 'Exchange Success',
        text2: 'Coins have been exchanged for balance.',
      });
      userRefetch();
    }
  }, [convertCoinsIsSuccess, convertCoinsData, userRefetch]);

  useEffect(() => {
    if (convertCoinsIsError && convertCoinsError) {
      const err = convertCoinsError as any;
      const message =
        typeof err?.message === 'string'
          ? err.message
          : err?.data?.message || 'Exchange failed. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    }
  }, [convertCoinsIsError, convertCoinsError]);

  useEffect(() => {
    if (repayLoanIsSuccess && repayLoanData) {
      Toast.show({
        type: 'success',
        text1: 'Repayment Request Sent',
        text2: 'Your repayment request is awaiting approval.',
      });
      setRepayModalVisible(false);
      userRefetch();
    }
  }, [repayLoanIsSuccess, repayLoanData, userRefetch]);

  useEffect(() => {
    if (repayLoanIsError && repayLoanError) {
      const err = repayLoanError as any;
      const message =
        typeof err?.message === 'string'
          ? err.message
          : err?.data?.message || 'Repayment failed. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    }
  }, [repayLoanIsError, repayLoanError]);

  const onRefresh = useCallback(() => {
    userRefetch();
  }, [userRefetch]);

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
            if (userData?.user) {
              requestRefill({
                target_user_id: userData.user.id,
                money_amount: amount,
                wallet_type: 'money',
                note: 'Refill from Mobile',
              });
            }
          },
        },
      ],
      'plain-text',
    );
  }, [userData, requestRefill]);

  const handleTopUpCoins = useCallback(() => {
    setCoinMode('topup');
    setCoinAmount('');
    setCoinModalVisible(true);
  }, []);

  const handleLoanRequest = useCallback(() => {
    if (!userData?.user) {
      return;
    }

    Alert.prompt(
      'Loan Request',
      'Enter the amount you wish to borrow (MMK)',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request',
          onPress: async (amount: string | undefined) => {
            if (!amount || isNaN(Number(amount))) {
              Alert.alert(
                'Invalid Amount',
                'Please enter a valid numeric amount.',
              );
              return;
            }
            requestLoan({
              borrower_user_id: userData.user.id.toString(),
              amount: amount,
              note: 'Loan request from Mobile',
            });
          },
        },
      ],
      'plain-text',
    );
  }, [userData, requestLoan]);

  const handleConvertCoins = useCallback(() => {
    setCoinMode('convert');
    setCoinAmount('');
    setCoinModalVisible(true);
  }, []);

  const handleConfirmCoinTransaction = async () => {
    if (!coinAmount || isNaN(Number(coinAmount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid numeric amount.');
      return;
    }

    if (coinMode === 'topup') {
      if (userData?.user) {
        requestRefill({
          target_user_id: userData.user.id,
          coins_amount: coinAmount,
          wallet_type: 'coins',
          note: 'Coin Top Up from Mobile',
        });
      }
    } else {
      convertCoins({
        coins: Number(coinAmount),
        note: 'Coin exchange from Mobile',
      });
    }
    setCoinModalVisible(false);
  };

  const handleOpenRepayModal = useCallback(() => {
    setRepayAmount('');
    setRepayNote('');
    setRepayPhoto(null);
    setRepayModalVisible(true);
  }, []);

  const pickRepaymentImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      setRepayPhoto(result.assets[0]);
    }
  };

  const handleConfirmRepayment = async () => {
    if (!repayAmount || isNaN(Number(repayAmount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid numeric amount.');
      return;
    }

    if (!repayPhoto) {
      Alert.alert(
        'Photo Required',
        'Please select a photo of your payment receipt.',
      );
      return;
    }

    const formData = new FormData();
    formData.append('amount', repayAmount);
    formData.append('note', repayNote || 'Loan repayment from Mobile');

    // Construct file object for FormData
    const photoFile = {
      uri: repayPhoto.uri,
      type: repayPhoto.type || 'image/jpeg',
      name: repayPhoto.fileName || `repayment_${Date.now()}.jpg`,
    };

    formData.append('photo', photoFile as any);

    repayLoan(formData);
  };

  const isLoading = userIsLoading;
  const error = userError;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !userData || !userData.user) {
    const errorMsg =
      (error as any)?.data?.message ||
      (error as any)?.message ||
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
                  <Text style={[styles.currencyText, { fontSize: 16 }]}>
                    Ks
                  </Text>
                </View>
                <View style={styles.walletTitleContainer}>
                  <Text style={styles.walletTitle}>Balance (MMK)</Text>
                  <Text
                    style={[styles.walletAmount, styles.compactWalletAmount]}
                  >
                    {user.money_balance
                      ? Math.floor(
                          parseFloat(user.money_balance) || 0,
                        ).toLocaleString()
                      : 0}
                  </Text>
                  {Number(user.money_debt || 0) > 0 && (
                    <Text style={[styles.debtText, { fontSize: 10 }]}>
                      Debt:{' '}
                      {Math.floor(Number(user.money_debt)).toLocaleString()}
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
                      style={[
                        styles.historyButtonText,
                        { color: colors.primary },
                      ]}
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
                  <MaterialIcons
                    name="monetization-on"
                    size={20}
                    color="#fff9e6"
                  />
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

        {/* Other Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Settings</Text>

          {/* <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <MaterialIcons name="settings" size={24} color={colors.primary} />
            <Text style={styles.actionButtonText}>Account Settings</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <MaterialIcons name="help" size={24} color={colors.primary} />
            <Text style={styles.actionButtonText}>Help & Support</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Coin Transaction Modal */}
      <Modal
        visible={coinModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCoinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {coinMode === 'topup'
                  ? 'Top Up Coins'
                  : 'Convert MMK into Coins'}
              </Text>
              <TouchableOpacity
                onPress={() => setCoinModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {coinMode === 'topup' ? 'Coins to Buy' : 'Amount of Coins'}
              </Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={coinAmount}
                onChangeText={setCoinAmount}
                autoFocus
              />
            </View>

            <View style={styles.exchangeInfo}>
              <Text style={styles.rateText}>
                Rate: 1 Coin = {coinRateData?.coin_to_money_rate || '...'} MMK
              </Text>
              <Text style={styles.resultText}>
                {coinMode === 'topup' ? 'Estimated Cost: ' : 'Total Cost: '}
                {coinAmount && coinRateData?.coin_to_money_rate
                  ? (
                      Number(coinAmount) * coinRateData.coin_to_money_rate
                    ).toLocaleString()
                  : '0'}{' '}
                MMK
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setCoinModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmCoinTransaction}
              >
                {convertCoinsIsLoading || requestRefillIsLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    {coinMode === 'topup' ? 'Request Coins' : 'Convert'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Repayment Modal */}
      <Modal
        visible={repayModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRepayModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Repay Loan</Text>
              <TouchableOpacity
                onPress={() => setRepayModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Amount to Repay (MMK)</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                  value={repayAmount}
                  onChangeText={setRepayAmount}
                />
                <Text style={[styles.debtText, { marginTop: 4 }]}>
                  Current Debt:{' '}
                  {parseFloat(
                    (user.money_debt || 0).toString(),
                  ).toLocaleString()}{' '}
                  MMK
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Note (Optional)</Text>
                <TextInput
                  style={[
                    styles.amountInput,
                    { height: 80, textAlignVertical: 'top' },
                  ]}
                  placeholder="Reference or note"
                  multiline
                  value={repayNote}
                  onChangeText={setRepayNote}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Payment Proof (Photo)</Text>
                <TouchableOpacity
                  style={[
                    styles.photoPicker,
                    repayPhoto && {
                      backgroundColor: '#fff',
                      borderStyle: 'solid',
                    },
                  ]}
                  onPress={pickRepaymentImage}
                >
                  {repayPhoto ? (
                    <Image
                      source={{ uri: repayPhoto.uri }}
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <>
                      <MaterialIcons
                        name="add-a-photo"
                        size={32}
                        color="#94A3B8"
                      />
                      <Text style={{ color: '#94A3B8', marginTop: 8 }}>
                        Select Receipt Photo
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setRepayModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleConfirmRepayment}
                  disabled={repayLoanIsLoading}
                >
                  {repayLoanIsLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.confirmButtonText}>
                      Submit Repayment
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
