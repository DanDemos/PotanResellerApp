import { useEffect, useCallback, useMemo } from 'react';
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
      reset: requestRefillReset,
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
      reset: requestLoanReset,
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
      reset: convertCoinsReset,
    },
  ] = useConvertMoneyToCoinMutation();

  const { data: coinRateData, refetch: coinRateRefetch } = useGetCoinsRateQuery();

  const [
    repayLoan,
    {
      isLoading: repayLoanIsLoading,
      isSuccess: repayLoanIsSuccess,
      isError: repayLoanIsError,
      data: repayLoanData,
      error: repayLoanError,
      reset: repayLoanReset,
    },
  ] = useRepayLoanMutation();

  // Effects for Toasts
  useEffect(() => {
    if (requestRefillIsSuccess && requestRefillData?.data?.request) {
      const { auto_approved, request } = requestRefillData.data;
      const { wallet_type, money_amount, coins_amount, status } = request;
      const amountLabel =
        wallet_type === 'money'
          ? `${money_amount || 0} MMK`
          : `${coins_amount ?? money_amount ?? 0} coins`;
      const isPending = !auto_approved || status === 'pending';
      const isMoney = wallet_type === 'money';

      Toast.show({
        type: 'success',
        text1: isPending
          ? 'Refill Request Sent'
          : isMoney
            ? 'Refill Success'
            : 'Request Sent',
        text2: isPending
          ? `Your request for ${amountLabel} is pending admin approval.`
          : isMoney
            ? `${amountLabel} has been added to your balance.`
            : `Request to top up ${amountLabel} has been sent.`,
      });
      userRefetch();
      if (onSuccess) onSuccess();
      requestRefillReset();
    }
  }, [
    requestRefillIsSuccess,
    requestRefillData,
    userRefetch,
    onSuccess,
    requestRefillReset,
  ]);

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
      requestRefillReset();
    }
  }, [requestRefillIsError, requestRefillError, requestRefillReset]);

  useEffect(() => {
    if (requestLoanIsSuccess && requestLoanData) {
      Toast.show({
        type: 'success',
        text1: 'Loan Request Sent',
        text2: 'Your request is being processed.',
      });
      userRefetch();
      if (onSuccess) onSuccess();
      requestLoanReset();
    }
  }, [
    requestLoanIsSuccess,
    requestLoanData,
    userRefetch,
    onSuccess,
    requestLoanReset,
  ]);

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
      requestLoanReset();
    }
  }, [requestLoanIsError, requestLoanError, requestLoanReset]);

  useEffect(() => {
    if (convertCoinsIsSuccess && convertCoinsData) {
      Toast.show({
        type: 'success',
        text1: 'Exchange Success',
        text2: 'Coins have been exchanged for balance.',
      });
      userRefetch();
      if (onSuccess) onSuccess();
      convertCoinsReset();
    }
  }, [
    convertCoinsIsSuccess,
    convertCoinsData,
    userRefetch,
    onSuccess,
    convertCoinsReset,
  ]);

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
      convertCoinsReset();
    }
  }, [convertCoinsIsError, convertCoinsError, convertCoinsReset]);

  useEffect(() => {
    if (repayLoanIsSuccess && repayLoanData) {
      Toast.show({
        type: 'success',
        text1: 'Repayment Request Sent',
        text2: 'Your repayment request is awaiting approval.',
      });
      userRefetch();
      if (onSuccess) onSuccess();
      repayLoanReset();
    }
  }, [
    repayLoanIsSuccess,
    repayLoanData,
    userRefetch,
    onSuccess,
    repayLoanReset,
  ]);

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
      repayLoanReset();
    }
  }, [repayLoanIsError, repayLoanError, repayLoanReset]);

  // Handler Functions
  const handleConfirmRefill = useCallback(async (
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
  }, [userId, requestRefill]);

  const handleConfirmLoan = useCallback(async (amount: string, note: string) => {
    if (typeof userId !== 'number') return;
    return requestLoan({
      borrower_user_id: userId.toString(),
      amount: amount,
      note: note || 'Loan request from Mobile',
    }).unwrap();
  }, [userId, requestLoan]);

  const handleConfirmCoinTransaction = useCallback(async (
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
  }, [handleConfirmRefill, convertMoneyToCoin]);

  const handleConfirmRepayment = useCallback(async (
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
  }, [repayLoan]);

  return useMemo(() => ({
    // Data
    coinRateData,
    coinRateRefetch,
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
    handleConfirmLoan,
    handleConfirmCoinTransaction,
    handleConfirmRepayment,
  }), [
    coinRateData,
    coinRateRefetch,
    requestRefillIsLoading,
    requestLoanIsLoading,
    convertCoinsIsLoading,
    repayLoanIsLoading,
    requestRefillIsSuccess,
    requestLoanIsSuccess,
    convertCoinsIsSuccess,
    repayLoanIsSuccess,
    handleConfirmRefill,
    handleConfirmLoan,
    handleConfirmCoinTransaction,
    handleConfirmRepayment,
  ]);
}
