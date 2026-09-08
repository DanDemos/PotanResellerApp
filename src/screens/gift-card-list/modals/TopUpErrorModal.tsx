import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { styles } from './TopUpErrorModal.styles';
import { colors } from '@/global/theme/colors';

type TopUpErrorModalProps = {
  presenter: {
    isTopUpErrorModalVisible: boolean;
    topUpErrorTitle: string;
    topUpErrorMessage: string;
    handleTopUpErrorViewCodes: () => void;
  };
};

export function TopUpErrorModal({
  presenter,
}: TopUpErrorModalProps): React.ReactNode {
  return (
    <Modal
      visible={presenter.isTopUpErrorModalVisible}
      transparent
      animationType="fade"
      onRequestClose={presenter.handleTopUpErrorViewCodes}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="error-outline" size={36} color={colors.error} />
          </View>
          <Text style={styles.modalTitle}>{presenter.topUpErrorTitle}</Text>
          <Text style={styles.modalMessage}>{presenter.topUpErrorMessage}</Text>
          <TouchableOpacity
            style={styles.viewCodesButton}
            onPress={presenter.handleTopUpErrorViewCodes}
          >
            <Text style={styles.viewCodesButtonText}>View Gift Card Codes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
