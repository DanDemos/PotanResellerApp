
import { useState, useCallback, useEffect } from 'react';
import { ProfileInteractor } from './ProfileInteractor';
import { ProfileRouter } from './ProfileRouter';

export function useProfilePresenter(
  interactor: ProfileInteractor,
  router: ProfileRouter
) {
  // Modal Visibility States
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [coinModalVisible, setCoinModalVisible] = useState(false);
  const [repayModalVisible, setRepayModalVisible] = useState(false);
  const [refillModalVisible, setRefillModalVisible] = useState(false);
  const [loanModalVisible, setLoanModalVisible] = useState(false);
  const [coinMode, setCoinMode] = useState<'topup' | 'convert'>('topup');

  // UI Toggles
  const handleTopUpCoins = useCallback(() => {
    interactor.coinRateRefetch();
    setCoinMode('topup');
    setCoinModalVisible(true);
  }, [interactor]);

  const handleConvertCoinsAction = useCallback(() => {
    setCoinMode('convert');
    setCoinModalVisible(true);
  }, []);

  const openRepayModal = useCallback(() => setRepayModalVisible(true), []);
  const openLoanModal = useCallback(() => setLoanModalVisible(true), []);
  const openRefillModal = useCallback(() => setRefillModalVisible(true), []);
  const openPasswordModal = useCallback(() => setPasswordModalVisible(true), []);

  const navigateToSupport = () => router.navigateToSupport();

  return {
    // States
    passwordModalVisible,
    setPasswordModalVisible,
    coinModalVisible,
    setCoinModalVisible,
    repayModalVisible,
    setRepayModalVisible,
    refillModalVisible,
    setRefillModalVisible,
    loanModalVisible,
    setLoanModalVisible,
    coinMode,

    // Interactor Data & Methods
    user: interactor.userData?.user,
    isLoading: interactor.userIsLoading,
    isFetching: interactor.userIsFetching,
    error: interactor.userError,
    onRefresh: interactor.onRefresh,

    // Wallet Actions
    coinRateData: interactor.coinRateData,
    refillLoading: interactor.requestRefillIsLoading,
    refillSuccess: interactor.requestRefillIsSuccess,
    loanLoading: interactor.requestLoanIsLoading,
    loanSuccess: interactor.requestLoanIsSuccess,
    convertLoading: interactor.convertCoinsIsLoading,
    convertSuccess: interactor.convertCoinsIsSuccess,
    repayLoading: interactor.repayLoanIsLoading,
    repaySuccess: interactor.repayLoanIsSuccess,

    confirmRefill: interactor.handleConfirmRefill,
    confirmLoan: interactor.handleConfirmLoan,
    confirmCoinTransaction: interactor.handleConfirmCoinTransaction,
    confirmRepayment: interactor.handleConfirmRepayment,

    // UI Toggles
    handleTopUpCoins,
    handleConvertCoinsAction,
    openRepayModal,
    openLoanModal,
    openRefillModal,
    openPasswordModal,
    
    // Navigation
    navigateToSupport,
  };
}
