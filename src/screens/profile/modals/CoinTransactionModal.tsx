import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { styles } from '../ProfileScreen.styles';
import { useCoinTransactionPresenter } from '@/features/profile/modals/CoinTransaction/CoinTransactionPresenter';
import { colors } from '@/global/theme/colors';
import { AdminBankInfoList } from '@/components/AdminBankInfoList';
import { PaymentProofPicker } from '@/components/common/PaymentProofPicker/PaymentProofPicker';
import { useKeyboardModalLift } from './useKeyboardModalLift';
import { getAmountInputImeProps } from './amountInputIme';

type CoinTransactionModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  coinMode: 'topup' | 'convert';
  coinRateData: any;
  handleConfirm: (
    mode: 'topup' | 'convert',
    amount: string,
    note: string,
    photo: any,
  ) => Promise<any>;
  isLoading: boolean;
  isSuccess: boolean;
};

export function CoinTransactionModal({
  visible,
  setVisible,
  coinMode,
  coinRateData,
  handleConfirm,
  isLoading,
  isSuccess,
}: CoinTransactionModalProps): React.ReactNode {
  const {
    coinAmount,
    setCoinAmount,
    note,
    setNote,
    photo,
    pickImage,
    onConfirm,
    handleClose,
  } = useCoinTransactionPresenter(
    visible,
    setVisible,
    coinMode,
    isSuccess,
    handleConfirm,
  );
  const noteInputRef = useRef<TextInput>(null);
  const {
    isKeyboardVisible,
    overlayKeyboardStyle,
    modalKeyboardStyle,
    onOverlayLayout,
  } = useKeyboardModalLift(visible);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={handleClose}
    >
      <View
        style={[styles.modalOverlay, overlayKeyboardStyle]}
        onLayout={onOverlayLayout}
      >
        <View style={[styles.modalContent, modalKeyboardStyle]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {coinMode === 'topup' ? 'Top Up Coins' : 'Convert MMK into Coins'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            style={isKeyboardVisible ? styles.modalBodyScroll : undefined}
            bounces={false}
          >
            {coinMode === 'topup' && <AdminBankInfoList />}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {coinMode === 'topup' ? 'Coins to Buy' : 'Amount of Coins'}
              </Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Enter amount"
                value={coinAmount}
                onChangeText={setCoinAmount}
                {...getAmountInputImeProps({
                  action: coinMode === 'topup' ? 'next' : 'go',
                  onAction: () => {
                    if (coinMode === 'topup') {
                      noteInputRef.current?.focus();
                      return;
                    }
                    onConfirm();
                  },
                })}
              />
            </View>

            {coinMode === 'topup' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Note (Optional)</Text>
                  <TextInput
                    ref={noteInputRef}
                    style={[
                      styles.amountInput,
                      { height: 80, textAlignVertical: 'top' },
                    ]}
                    placeholder="Reference or note"
                    multiline
                    value={note}
                    onChangeText={setNote}
                  />
                </View>

                <PaymentProofPicker photo={photo} onPress={pickImage} />
              </>
            )}

            <View style={styles.exchangeInfo}>
              <Text style={styles.rateText}>
                Rate: 1 Coin = {coinRateData?.coin_to_money_rate || '...'} MMK
              </Text>
              {coinMode !== 'topup' && (
                <Text style={styles.resultText}>
                  {'You will use up: '}
                  {coinAmount && coinRateData?.coin_to_money_rate
                    ? (
                        Number(coinAmount) * coinRateData.coin_to_money_rate
                      ).toLocaleString()
                    : '0'}{' '}
                  MMK
                </Text>
              )}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    {coinMode === 'topup' ? 'Request Coins' : 'Convert'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
