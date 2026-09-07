import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { PasswordInput } from '@/components/common/PasswordInput/PasswordInput';
import { styles } from '../ProfileScreen.styles';
import { useChangePasswordPresenter } from '@/features/auth/change-password/ChangePasswordPresenter';
import { colors } from '@/global/theme/colors';
import { useKeyboardModalLift } from './useKeyboardModalLift';

type ChangePasswordModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export function ChangePasswordModal({
  visible,
  setVisible,
}: ChangePasswordModalProps): React.ReactNode {
  const presenter = useChangePasswordPresenter(visible, setVisible);
  const newPasswordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
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
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={presenter.handleClose}
    >
      <View
        style={[styles.modalOverlay, overlayKeyboardStyle]}
        onLayout={onOverlayLayout}
      >
        <View style={[styles.modalContent, modalKeyboardStyle]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TouchableOpacity
              onPress={presenter.handleClose}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            style={isKeyboardVisible ? styles.modalBodyScroll : undefined}
            bounces={false}
          >
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
