
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { PasswordInput } from '@/components/common/PasswordInput/PasswordInput';
import { styles } from '../ProfileScreen.styles';
import { useChangePasswordPresenter } from '@/features/auth/change-password/ChangePasswordPresenter';
import { colors } from '@/global/theme/colors';

interface ChangePasswordModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export function ChangePasswordModal({
  visible,
  setVisible,
}: ChangePasswordModalProps): React.ReactNode {
  const presenter = useChangePasswordPresenter(visible, setVisible);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={presenter.handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TouchableOpacity
              onPress={presenter.handleClose}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <PasswordInput
              label="Current Password"
              placeholder="Enter current password"
              value={presenter.currentPassword}
              onChangeText={presenter.setCurrentPassword}
            />

            <PasswordInput
              label="New Password"
              placeholder="Enter new password"
              value={presenter.newPassword}
              onChangeText={presenter.setNewPassword}
            />

            <PasswordInput
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={presenter.confirmPassword}
              onChangeText={presenter.setConfirmPassword}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={presenter.handleClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
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
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
