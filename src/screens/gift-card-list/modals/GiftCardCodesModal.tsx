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

export type GiftCardCodesProductInfo = {
  productName?: string | null;
  categoryName?: string | null;
};

type GiftCardCodesModalProps = {
  presenter: {
    isGiftCardCodesModalVisible: boolean;
    purchasedGiftCardCodes: string[];
    giftCardCodesProductInfo?: GiftCardCodesProductInfo | null;
    closeGiftCardCodesModal: () => void;
  };
};

export function GiftCardCodesModal({
  presenter,
}: GiftCardCodesModalProps): React.ReactNode {
  const codes = presenter.purchasedGiftCardCodes;
  const productName = presenter.giftCardCodesProductInfo?.productName?.trim() || '';
  const categoryName =
    presenter.giftCardCodesProductInfo?.categoryName?.trim() || '';
  const isSingleCode = codes.length === 1;
  const showCopyAll = codes.length > 1;

  const title =
    productName || (isSingleCode ? 'Redeem Code' : 'Redeem Codes');

  let subtitle: string;
  if (productName || categoryName) {
    subtitle = isSingleCode
      ? 'Redeem code'
      : `${codes.length} redeem codes`;
  } else {
    subtitle = isSingleCode
      ? 'Here is your redeem code.'
      : `You received ${codes.length} redeem codes.`;
  }

  const copyCode = useCallback((code: string) => {
    Clipboard.setString(code);
    Toast.show({
      type: 'success',
      text1: 'Copied',
      text2: 'Redeem code copied to clipboard.',
    });
  }, []);

  const copyAllCodes = useCallback(() => {
    Clipboard.setString(codes.join('\n'));
    Toast.show({
      type: 'success',
      text1: 'Copied',
      text2: `All ${codes.length} codes copied to clipboard.`,
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
          <View style={styles.modalHeader}>
            <View style={styles.titleBlock}>
              {categoryName ? (
                <Text style={styles.categoryLabel} numberOfLines={1}>
                  {categoryName}
                </Text>
              ) : null}
              <Text style={styles.modalTitle} numberOfLines={2}>
                {title}
              </Text>
            </View>
            <TouchableOpacity
              onPress={presenter.closeGiftCardCodesModal}
              style={styles.headerCloseButton}
              accessibilityLabel="Close"
            >
              <MaterialIcons name="close" size={24} color={colors.muted} />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalSubtitle}>{subtitle}</Text>

          <FlatList
            style={styles.codesList}
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
                  accessibilityLabel="Copy code"
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
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
