import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { styles } from '../ProfileScreen.styles';
import { User } from '@/api/actions/user/userAPIDataTypes';
import { useRepaymentPresenter } from '@/features/profile/modals/Repayment/RepaymentPresenter';
import { colors } from '@/global/theme/colors';

interface RepaymentModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  isLoading: boolean;
  isSuccess: boolean;
  onSubmit: (amount: string, note: string, photo: any) => Promise<any>;
  user: User;
}

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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Repay Loan</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
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
                {parseFloat((user.money_debt || 0).toString()).toLocaleString()}{' '}
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
                    backgroundColor: colors.white,
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
