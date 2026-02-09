import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { styles } from '../ProfileScreen.styles';

interface LoanRequestModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  isLoading: boolean;
  isSuccess: boolean;
  onSubmit: (amount: string, note: string) => Promise<any>;
}

export const LoanRequestModal: React.FC<LoanRequestModalProps> = ({
  visible,
  setVisible,
  isLoading,
  isSuccess,
  onSubmit,
}) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  // Clear inputs on success or when closed
  useEffect(() => {
    if (isSuccess || !visible) {
      setAmount('');
      setNote('');
      if (isSuccess) {
        setVisible(false);
      }
    }
  }, [isSuccess, visible, setVisible]);

  const onConfirm = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid numeric amount.');
      return;
    }

    try {
      await onSubmit(amount, note);
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
            <Text style={styles.modalTitle}>Request Loan</Text>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Enter Amount (MMK)</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Enter loan amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Note (Optional)</Text>
              <TextInput
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
                  <Text style={styles.confirmButtonText}>Submit Request</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
