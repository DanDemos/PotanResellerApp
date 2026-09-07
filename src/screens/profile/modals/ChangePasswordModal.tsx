import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Keyboard,
  Platform,
  Dimensions,
  TextInput,
  type KeyboardEvent,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PasswordInput } from '@/components/common/PasswordInput/PasswordInput';
import { styles } from '../ProfileScreen.styles';
import { useChangePasswordPresenter } from '@/features/auth/change-password/ChangePasswordPresenter';
import { colors } from '@/global/theme/colors';

type ChangePasswordModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export function ChangePasswordModal({
  visible,
  setVisible,
}: ChangePasswordModalProps): React.ReactNode {
  const insets = useSafeAreaInsets();
  const presenter = useChangePasswordPresenter(visible, setVisible);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const newPasswordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

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
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={presenter.handleClose}
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
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity
                onPress={presenter.handleClose}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <PasswordInput
              label="Current Password"
              placeholder="Enter current password"
              value={presenter.currentPassword}
              onChangeText={presenter.setCurrentPassword}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => newPasswordInputRef.current?.focus()}
            />

            <PasswordInput
              ref={newPasswordInputRef}
              label="New Password"
              placeholder="Enter new password"
              value={presenter.newPassword}
              onChangeText={presenter.setNewPassword}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
            />

            <PasswordInput
              ref={confirmPasswordInputRef}
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={presenter.confirmPassword}
              onChangeText={presenter.setConfirmPassword}
              returnKeyType="go"
              onSubmitEditing={presenter.handleConfirm}
              enablesReturnKeyAutomatically
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={presenter.handleConfirm}
                disabled={presenter.changePasswordIsLoading}
              >
                {presenter.changePasswordIsLoading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.confirmButtonText}>Update Password</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={presenter.handleClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
