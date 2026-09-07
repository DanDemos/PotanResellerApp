import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
  Keyboard,
  Platform,
  Dimensions,
  type KeyboardEvent,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../ProfileScreen.styles';
import { useRefillPresenter } from '@/features/profile/modals/Refill/RefillPresenter';
import { colors } from '@/global/theme/colors';
import { AdminBankInfoList } from '@/components/AdminBankInfoList';

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
  const insets = useSafeAreaInsets();
  const {
    amount,
    setAmount,
    note,
    setNote,
    photo,
    pickImage,
    onConfirm,
    handleClose,
  } = useRefillPresenter(visible, setVisible, isSuccess, onSubmit);

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!visible) {
      setKeyboardHeight(0);
      return;
    }

    function handleKeyboardShow(event: KeyboardEvent) {
      setKeyboardHeight(event.endCoordinates.height);
    }

    function handleKeyboardHide() {
      setKeyboardHeight(0);
    }

    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      handleKeyboardShow,
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      handleKeyboardHide,
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [visible]);

  const isKeyboardVisible = keyboardHeight > 0;
  const modalMaxHeight = isKeyboardVisible
    ? Dimensions.get('window').height - keyboardHeight - insets.top - 24
    : undefined;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={handleClose}
    >
      <View
        style={[
          styles.modalOverlay,
          isKeyboardVisible && { paddingBottom: keyboardHeight },
        ]}
      >
        <View
          style={[
            styles.modalContent,
            modalMaxHeight != null && {
              maxHeight: modalMaxHeight,
              overflow: 'hidden',
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            style={isKeyboardVisible ? styles.modalBodyScroll : undefined}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Refill MMK</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount to Refill (MMK)</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Enter amount"
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
                placeholder="Reference or note"
                multiline
                value={note}
                onChangeText={setNote}
              />
            </View>

            <AdminBankInfoList />

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Payment Proof (Photo)</Text>
              <TouchableOpacity
                style={[
                  styles.photoPicker,
                  photo && {
                    backgroundColor: colors.white,
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
