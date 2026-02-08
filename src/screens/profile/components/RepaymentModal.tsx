import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { launchImageLibrary } from 'react-native-image-picker';
import { styles } from '../ProfileScreen.styles';
import { User } from '@/api/actions/user/userAPIDataTypes';

interface RepaymentModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  isLoading: boolean;
  isSuccess: boolean;
  onSubmit: (amount: string, note: string, photo: any) => Promise<any>;
  user: User;
}

export const RepaymentModal: React.FC<RepaymentModalProps> = ({
  visible,
  setVisible,
  isLoading,
  isSuccess,
  onSubmit,
  user,
}) => {
  const [repayAmount, setRepayAmount] = useState('');
  const [repayNote, setRepayNote] = useState('');
  const [repayPhoto, setRepayPhoto] = useState<any>(null);

  // Clear inputs on success or when closed
  useEffect(() => {
    if (isSuccess || !visible) {
      setRepayAmount('');
      setRepayNote('');
      setRepayPhoto(null);
      if (isSuccess) {
        setVisible(false);
      }
    }
  }, [isSuccess, visible, setVisible]);

  const pickRepaymentImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      setRepayPhoto(result.assets[0]);
    }
  };

  const onConfirm = async () => {
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

    try {
      await onSubmit(repayAmount, repayNote, repayPhoto);
    } catch (error) {
      // Error is handled by Toast in the hook
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Repay Loan</Text>
            <TouchableOpacity
              onPress={() => setVisible(false)}
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
                onPress={() => setVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
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
};
