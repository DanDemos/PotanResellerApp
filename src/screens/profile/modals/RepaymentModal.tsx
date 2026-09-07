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
import { User } from '@/api/actions/user/userAPIDataTypes';
import { useRepaymentPresenter } from '@/features/profile/modals/Repayment/RepaymentPresenter';
import { colors } from '@/global/theme/colors';
import { PaymentProofPicker } from '@/components/common/PaymentProofPicker/PaymentProofPicker';
import { useKeyboardModalLift } from './useKeyboardModalLift';
import { getAmountInputImeProps } from './amountInputIme';

type RepaymentModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  isLoading: boolean;
  isSuccess: boolean;
  onSubmit: (amount: string, note: string, photo: any) => Promise<any>;
  user: User;
};

export function RepaymentModal({
  visible,
  setVisible,
  isLoading,
  isSuccess,
  onSubmit,
  user,
}: RepaymentModalProps): React.ReactNode {
  const {
    repayAmount,
    setRepayAmount,
    repayNote,
    setRepayNote,
    repayPhoto,
    pickRepaymentImage,
    onConfirm,
    handleClose,
  } = useRepaymentPresenter(visible, setVisible, isSuccess, onSubmit);
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
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={handleClose}
    >
      <View
        style={[styles.modalOverlay, overlayKeyboardStyle]}
        onLayout={onOverlayLayout}
      >
        <View style={[styles.modalContent, modalKeyboardStyle]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Repay Loan</Text>
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
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount to Repay (MMK)</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Enter amount"
                value={repayAmount}
                onChangeText={setRepayAmount}
                {...getAmountInputImeProps({
                  action: 'next',
                  onAction: () => noteInputRef.current?.focus(),
                })}
              />
              <Text style={[styles.debtText, { marginTop: 4 }]}>
                Current Debt:{' '}
                {parseFloat((user.money_debt || 0).toString()).toLocaleString()}{' '}
                MMK
              </Text>
            </View>

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
                value={repayNote}
                onChangeText={setRepayNote}
              />
            </View>

            <PaymentProofPicker
              photo={repayPhoto}
              onPress={pickRepaymentImage}
            />

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
                  <Text style={styles.confirmButtonText}>Submit Repayment</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
