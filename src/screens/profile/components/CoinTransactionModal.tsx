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

interface CoinTransactionModalProps {
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
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<any>(null);

  // Clear inputs on success or when closed
  useEffect(() => {
    if (isSuccess || !visible) {
      setCoinAmount('');
      setNote('');
      setPhoto(null);
      if (isSuccess) {
        setVisible(false);
      }
    }
  }, [isSuccess, visible, setVisible]);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      setPhoto(result.assets[0]);
    }
  };

  const onConfirm = async () => {
    if (!coinAmount || isNaN(Number(coinAmount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid numeric amount.');
      return;
    }

    if (coinMode === 'topup' && !photo) {
      Alert.alert(
        'Photo Required',
        'Please select a photo of your payment receipt.',
      );
      return;
    }

    try {
      await handleConfirm(coinMode, coinAmount, note, photo);
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

          <ScrollView showsVerticalScrollIndicator={false}>
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
              />
            </View>

            {coinMode === 'topup' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Note (Optional)</Text>
                  <TextInput
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

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Payment Proof (Photo)</Text>
                  <TouchableOpacity
                    style={[
                      styles.photoPicker,
                      photo && {
                        backgroundColor: '#fff',
                        borderStyle: 'solid',
                      },
                    ]}
                    onPress={pickImage}
                  >
                    {photo ? (
                      <Image
                        source={{ uri: photo.uri }}
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
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
