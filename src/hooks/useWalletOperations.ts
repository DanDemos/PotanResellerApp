import { useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  useRequestRefillMutation,
  useRequestLoanMutation,
  useConvertMoneyToCoinMutation,
  useGetCoinsRateQuery,
  useRepayLoanMutation,
} from '@/api/actions/wallet/walletApi';

interface UseWalletOperationsProps {
  userId?: number;
  userRefetch: () => void;
  onSuccess?: () => void;
}

export function useWalletOperations({
  userId,
  userRefetch,
  onSuccess,
}: UseWalletOperationsProps) {
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
    convertMoneyToCoin,
    {
      isLoading: convertCoinsIsLoading,
      isSuccess: convertCoinsIsSuccess,
      isError: convertCoinsIsError,
      data: convertCoinsData,
      error: convertCoinsError,
    },
  ] = useConvertMoneyToCoinMutation();

  const { data: coinRateData } = useGetCoinsRateQuery();

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

  // Effects for Toasts
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
            : `Request to top up ${coins_amount ?? money_amount ?? 0} coins has been sent.`,
      });
      userRefetch();
      if (onSuccess) onSuccess();
    }
  }, [requestRefillIsSuccess, requestRefillData, userRefetch, onSuccess]);

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
      if (onSuccess) onSuccess();
    }
  }, [requestLoanIsSuccess, requestLoanData, userRefetch, onSuccess]);

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
      if (onSuccess) onSuccess();
    }
  }, [convertCoinsIsSuccess, convertCoinsData, userRefetch, onSuccess]);

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
      userRefetch();
      if (onSuccess) onSuccess();
    }
  }, [repayLoanIsSuccess, repayLoanData, userRefetch, onSuccess]);

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

  // Handler Functions
  const handleConfirmRefill = async (
    amount: string,
    note: string,
    photo: any,
    walletType: 'money' | 'coins' = 'money',
  ) => {
    if (typeof userId !== 'number') return;

    const formData = new FormData();
    formData.append('wallet_type', walletType);
    formData.append('target_user_id', userId.toString());
    if (walletType === 'money') {
      formData.append('money_amount', amount);
    } else {
      formData.append('coins_amount', amount);
    }
    formData.append('note', note || `Refill ${walletType} from Mobile`);

    if (photo) {
      const photoData = {
        uri: photo.uri,
        type:
          photo.type === 'image/jpg'
            ? 'image/jpeg'
            : photo.type || 'image/jpeg',
        name: photo.fileName || 'refill.jpg',
      };
      formData.append('photo', photoData as any);
    }

    return requestRefill(formData).unwrap();
  };

  const handleLoanRequest = useCallback(
    () => {
      if (typeof userId !== 'number') return;

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
                borrower_user_id: userId.toString(),
                amount: amount,
                note: 'Loan request from Mobile',
              });
            },
          },
        ],
        'plain-text',
      );
    },
    [userId, requestLoan],
  );

  const handleConfirmCoinTransaction = async (
    mode: 'topup' | 'convert',
    amount: string,
    note: string = '',
    photo: any = null,
  ) => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid numeric amount.');
      return;
    }

    if (mode === 'topup') {
      return handleConfirmRefill(amount, note, photo, 'coins');
    } else {
      return convertMoneyToCoin({
        amount: Number(amount),
      }).unwrap();
    }
  };

  const handleConfirmRepayment = async (
    amount: string,
    note: string,
    photo: any,
  ) => {
    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('note', note || 'Loan repayment from Mobile');

    const photoData = {
      uri: photo.uri,
      type:
        photo.type === 'image/jpg' ? 'image/jpeg' : photo.type || 'image/jpeg',
      name: photo.fileName || 'repayment.jpg',
    };

    formData.append('photo', photoData as any);

    return repayLoan(formData).unwrap();
  };

  return {
    // Data
    coinRateData,
    // Loading States
    requestRefillIsLoading,
    requestLoanIsLoading,
    convertCoinsIsLoading,
    repayLoanIsLoading,
    requestRefillIsSuccess,
    requestLoanIsSuccess,
    convertCoinsIsSuccess,
    repayLoanIsSuccess,
    // Handlers
    handleConfirmRefill,
    handleLoanRequest,
    handleConfirmCoinTransaction,
    handleConfirmRepayment,
  };
}
