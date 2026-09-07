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
import { useRefillPresenter } from '@/features/profile/modals/Refill/RefillPresenter';
import { colors } from '@/global/theme/colors';
import { AdminBankInfoList } from '@/components/AdminBankInfoList';
import { PaymentProofPicker } from '@/components/common/PaymentProofPicker/PaymentProofPicker';
import { useKeyboardModalLift } from './useKeyboardModalLift';
import { getAmountInputImeProps } from './amountInputIme';

type RefillModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  isLoading: boolean;
  isSuccess: boolean;
  onSubmit: (amount: string, note: string, photo: any) => Promise<any>;
};

export function RefillModal({
  visible,
  setVisible,
  isLoading,
  isSuccess,
  onSubmit,
}: RefillModalProps): React.ReactNode {
  const {
    amount,
    setAmount,
    note,
    setNote,
    photo,
    handlePhotoSelected,
    onConfirm,
    handleClose,
  } = useRefillPresenter(visible, setVisible, isSuccess, onSubmit);
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
            <Text style={styles.modalTitle}>Refill MMK</Text>
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
            <AdminBankInfoList />

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount to Refill (MMK)</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Enter amount"
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
                placeholder="Reference or note"
                multiline
                value={note}
                onChangeText={setNote}
              />
            </View>

            <PaymentProofPicker
              photo={photo}
              onPhotoSelected={handlePhotoSelected}
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
                  <Text style={styles.confirmButtonText}>Submit Refill</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
