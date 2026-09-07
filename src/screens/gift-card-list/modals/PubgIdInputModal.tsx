import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { styles } from './PubgIdInputModal.styles';
import { colors } from '@/global/theme/colors';

type PubgIdInputModalProps = {
  presenter: {
    isPubgIdModalVisible: boolean;
    pubgId: string;
    setPubgId: (value: string) => void;
    handlePubgIdSubmit: () => void;
    closePubgIdModal: () => void;
  };
};

export function PubgIdInputModal({
  presenter,
}: PubgIdInputModalProps): React.ReactNode {
  return (
    <Modal
      visible={presenter.isPubgIdModalVisible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={presenter.closePubgIdModal}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>PUBG Account</Text>
          <Text style={styles.modalSubtitle}>
            Enter your PUBG ID to auto top up after purchase.
          </Text>

          <Text style={styles.inputLabel}>PUBG ID</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your PUBG ID"
            placeholderTextColor={colors.muted}
            value={presenter.pubgId}
            onChangeText={presenter.setPubgId}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            returnKeyType="go"
            enablesReturnKeyAutomatically
            onSubmitEditing={presenter.handlePubgIdSubmit}
          />

          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={presenter.handlePubgIdSubmit}
            >
              <Text style={styles.confirmButtonText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={presenter.closePubgIdModal}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
