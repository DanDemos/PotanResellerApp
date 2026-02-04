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
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useDispatch } from 'react-redux';
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
  const dispatch = useDispatch();
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
    if (requestRefillIsSuccess && requestRefillData) {
      const { wallet_type, money_amount } = requestRefillData.data.request;
      Toast.show({
        type: 'success',
        text1: wallet_type === 'money' ? 'Refill Success' : 'Request Sent',
        text2:
          wallet_type === 'money'
            ? `${money_amount} MMK has been added to your balance.`
            : `Request to top up ${money_amount} coins has been sent.`,
      });
    }
  }, [requestRefillIsSuccess, requestRefillData]);

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
    }
  }, [requestLoanIsSuccess, requestLoanData]);

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
                note: 'Refill from Profile Dashboard',
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
              note: 'Loan request from Profile Dashboard',
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
          note: 'Coin Top Up from Profile Dashboard',
        });
      }
    } else {
      convertCoins({
        coins: Number(coinAmount),
        note: 'Coin exchange from Profile Dashboard',
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
    formData.append(
      'note',
      repayNote || 'Loan repayment from Profile Dashboard',
    );

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
          <Text style={styles.sectionTitle}>Wallet</Text>

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
                style={[styles.walletActionButton, styles.loanButton]}
                onPress={handleLoanRequest}
                disabled={requestLoanIsLoading}
              >
                {requestLoanIsLoading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <>
                    <MaterialIcons
                      name="account-balance-wallet"
                      size={20}
                      color="#666"
                    />
                    <Text style={styles.loanButtonText}>Loan</Text>
                  </>
                )}
              </TouchableOpacity>
              {user.money_debt > 0 && (
                <TouchableOpacity
                  style={[styles.walletActionButton, styles.historyButton]}
                  onPress={handleOpenRepayModal}
                >
                  <MaterialIcons
                    name="payments"
                    size={20}
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
                style={[styles.walletActionButton, styles.topupButton]}
                onPress={handleRefillMMK}
                disabled={requestRefillIsLoading}
              >
                {requestRefillIsLoading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
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
                style={[styles.walletActionButton, styles.loanButton]}
                onPress={handleConvertCoins}
                disabled={convertCoinsIsLoading}
              >
                {convertCoinsIsLoading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <>
                    <MaterialIcons name="swap-horiz" size={20} color="#666" />
                    <Text style={styles.loanButtonText}>Convert</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.walletActionButton, styles.coinTopupButton]}
                activeOpacity={0.7}
                onPress={handleTopUpCoins}
                disabled={requestRefillIsLoading}
              >
                <MaterialIcons name="add" size={20} color="#fff" />
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
                {coinMode === 'topup' ? 'Top Up Coins' : 'Convert to Balance'}
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
                {coinMode === 'topup' ? 'Coins to Buy' : 'Coins to Exchange'}
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
                Exchange Rate: 1 Coin ={' '}
                {coinRateData?.coin_to_money_rate || '...'} MMK
              </Text>
              <Text style={styles.resultText}>
                {coinMode === 'topup' ? 'Total Cost: ' : 'You Receive: '}
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
                <Text style={styles.confirmButtonText}>
                  {coinMode === 'topup' ? 'Confirm Order' : 'Exchange Now'}
                </Text>
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
                  {parseFloat(user.money_debt.toString()).toLocaleString()} MMK
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
