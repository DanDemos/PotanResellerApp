import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { styles } from '../ProfileScreen.styles';

interface CoinTransactionModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  coinMode: 'topup' | 'convert';
  coinRateData: any;
  handleConfirm: (mode: 'topup' | 'convert', amount: string) => Promise<any>;
  isLoading: boolean;
  isSuccess: boolean;
}

export const CoinTransactionModal: React.FC<CoinTransactionModalProps> = ({
  visible,
  setVisible,
  coinMode,
  coinRateData,
  handleConfirm,
  isLoading,
  isSuccess,
}) => {
  const [coinAmount, setCoinAmount] = useState('');

  // Clear inputs on success or when closed
  useEffect(() => {
    if (isSuccess || !visible) {
      setCoinAmount('');
      if (isSuccess) {
        setVisible(false);
      }
    }
  }, [isSuccess, visible, setVisible]);

  const onConfirm = async () => {
    if (!coinAmount || isNaN(Number(coinAmount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid numeric amount.');
      return;
    }
    try {
      await handleConfirm(coinMode, coinAmount);
    } catch (error) {
      // Error is handled by Toast in the hook
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {coinMode === 'topup' ? 'Top Up Coins' : 'Convert MMK into Coins'}
            </Text>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {coinMode === 'topup' ? 'Coins to Buy' : 'Amount of Coins'}
            </Text>
            <TextInput
              style={styles.amountInput}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={coinAmount}
              onChangeText={setCoinAmount}
              autoFocus
            />
          </View>

          <View style={styles.exchangeInfo}>
            <Text style={styles.rateText}>
              Rate: 1 Coin = {coinRateData?.coin_to_money_rate || '...'} MMK
            </Text>
            <Text style={styles.resultText}>
              {coinMode === 'topup' ? 'Estimated Cost: ' : 'Total Cost: '}
              {coinAmount && coinRateData?.coin_to_money_rate
                ? (
                    Number(coinAmount) * coinRateData.coin_to_money_rate
                  ).toLocaleString()
                : '0'}{' '}
              MMK
            </Text>
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
                <Text style={styles.confirmButtonText}>
                  {coinMode === 'topup' ? 'Request Coins' : 'Convert'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
