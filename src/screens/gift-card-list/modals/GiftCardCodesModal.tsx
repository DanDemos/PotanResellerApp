import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Toast from 'react-native-toast-message';
import { styles } from './GiftCardCodesModal.styles';
import { colors } from '@/global/theme/colors';

type GiftCardCodesModalProps = {
  presenter: {
    isGiftCardCodesModalVisible: boolean;
    purchasedGiftCardCodes: string[];
    closeGiftCardCodesModal: () => void;
  };
};

export function GiftCardCodesModal({
  presenter,
}: GiftCardCodesModalProps): React.ReactNode {
  const codes = presenter.purchasedGiftCardCodes;
  const isSingleCode = codes.length === 1;
  const showCopyAll = codes.length > 1;

  const copyCode = useCallback((code: string) => {
    Clipboard.setString(code);
    Toast.show({
      type: 'success',
      text1: 'Copied',
      text2: 'Gift card code copied to clipboard.',
    });
  }, []);

  const copyAllCodes = useCallback(() => {
    Clipboard.setString(codes.join('\n'));
    Toast.show({
      type: 'success',
      text1: 'Copied',
      text2: `All ${codes.length} gift card codes copied to clipboard.`,
    });
  }, [codes]);

  return (
    <Modal
      visible={presenter.isGiftCardCodesModalVisible}
      transparent
      animationType="fade"
      onRequestClose={presenter.closeGiftCardCodesModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {isSingleCode ? 'Gift Card Code' : 'Gift Card Codes'}
          </Text>
          <Text style={styles.modalSubtitle}>
            {isSingleCode
              ? 'Here is your gift card code.'
              : `You received ${codes.length} gift card codes.`}
          </Text>

          <FlatList
            data={codes}
            keyExtractor={(item, index) => `${item}-${index}`}
            contentContainerStyle={styles.listContent}
            renderItem={({ item, index }) => (
              <View style={styles.codeRow}>
                <View style={styles.codeInfo}>
                  {!isSingleCode ? (
                    <Text style={styles.codeIndex}>Code {index + 1}</Text>
                  ) : null}
                  <Text style={styles.codeText} selectable>
                    {item}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.copyIconButton}
                  onPress={() => copyCode(item)}
                  accessibilityLabel="Copy gift card code"
                >
                  <MaterialIcons
                    name="content-copy"
                    size={18}
                    color={colors.textDark}
                  />
                </TouchableOpacity>
              </View>
            )}
          />

          <View style={styles.footerActions}>
            {showCopyAll ? (
              <TouchableOpacity
                style={styles.copyAllButton}
                onPress={copyAllCodes}
              >
                <MaterialIcons
                  name="content-copy"
                  size={18}
                  color={colors.textDark}
                />
                <Text style={styles.copyAllButtonText}>Copy All</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={presenter.closeGiftCardCodesModal}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
