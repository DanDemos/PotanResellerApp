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
import { useLoanRequestPresenter } from '@/features/profile/modals/LoanRequest/LoanRequestPresenter';
import { colors } from '@/global/theme/colors';
import { useKeyboardModalLift } from './useKeyboardModalLift';
import { getAmountInputImeProps } from './amountInputIme';

type LoanRequestModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  isLoading: boolean;
  isSuccess: boolean;
  onSubmit: (amount: string, note: string) => Promise<any>;
};

export function LoanRequestModal({
  visible,
  setVisible,
  isLoading,
  isSuccess,
  onSubmit,
}: LoanRequestModalProps): React.ReactNode {
  const { amount, setAmount, note, setNote, onConfirm, handleClose } =
    useLoanRequestPresenter(visible, setVisible, isSuccess, onSubmit);
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
            <Text style={styles.modalTitle}>Request Loan</Text>
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
              <Text style={styles.inputLabel}>Enter Amount (MMK)</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Enter loan amount"
                value={amount}
                onChangeText={setAmount}
                {...getAmountInputImeProps({
                  action: 'next',
                  onAction: () => noteInputRef.current?.focus(),
                })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Note (Optional)</Text>
              <TextInput
                ref={noteInputRef}
                style={[
                  styles.amountInput,
                  { height: 80, textAlignVertical: 'top' },
                ]}
                placeholder="Why do you need this loan?"
                multiline
                value={note}
                onChangeText={setNote}
              />
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
                  <Text style={styles.confirmButtonText}>Submit Request</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
