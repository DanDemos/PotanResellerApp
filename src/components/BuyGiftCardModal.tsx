import React from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { styles } from './BuyGiftCardModal.styles';
import { colors } from '@/global/theme/colors';

interface BuyGiftCardModalProps {
  presenter: any;
}

export function BuyGiftCardModal({ presenter }: BuyGiftCardModalProps): React.ReactNode {
  const [step, setStep] = React.useState<1 | 2>(1);

  React.useEffect(() => {
    if (presenter.isBuyModalVisible) {
      setStep(1);
    }
  }, [presenter.isBuyModalVisible]);

  if (!presenter.selectedGiftCard) return null;

  const item = presenter.selectedGiftCard;
  const price = parseFloat(String(item.price || '0'));
  const totalPrice = price * presenter.purchaseQuantity;
  const maxQuantity = item.available_quantity ?? item.quantity ?? 999;

  const handleDecrease = () => {
    if (presenter.purchaseQuantity > 1) {
      presenter.setPurchaseQuantity(presenter.purchaseQuantity - 1);
    }
  };

  const handleIncrease = () => {
    if (presenter.purchaseQuantity < maxQuantity) {
      presenter.setPurchaseQuantity(presenter.purchaseQuantity + 1);
    }
  };

  return (
    <Modal
      visible={presenter.isBuyModalVisible}
      transparent
      animationType="fade"
      onRequestClose={presenter.closeBuyModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {step === 1 ? 'Select Quantity' : 'Confirm Purchase'}
          </Text>
          <Text style={styles.modalSubtitle} numberOfLines={2}>
            {item.name}
          </Text>

          {step === 1 ? (
            <>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={[styles.quantityButton, presenter.purchaseQuantity <= 1 && styles.quantityButtonDisabled]}
                  onPress={handleDecrease}
                  disabled={presenter.purchaseQuantity <= 1 || presenter.purchaseIsLoading}
                >
                  <MaterialIcons name="remove" size={24} color={colors.textDark} />
                </TouchableOpacity>

                <Text style={styles.quantityText}>{presenter.purchaseQuantity}</Text>

                <TouchableOpacity
                  style={[styles.quantityButton, presenter.purchaseQuantity >= maxQuantity && styles.quantityButtonDisabled]}
                  onPress={handleIncrease}
                  disabled={presenter.purchaseQuantity >= maxQuantity || presenter.purchaseIsLoading}
                >
                  <MaterialIcons name="add" size={24} color={colors.textDark} />
                </TouchableOpacity>
              </View>
              
              <Text style={[styles.stockInfo, presenter.purchaseQuantity >= maxQuantity && styles.stockInfoWarning]}>
                {presenter.purchaseQuantity >= maxQuantity 
                  ? `Maximum available stock reached (${maxQuantity})`
                  : `${maxQuantity} available in stock`}
              </Text>

              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={presenter.closeBuyModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => setStep(2)}
                >
                  <Text style={styles.confirmButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.receiptContainer}>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Item</Text>
                  <Text style={styles.receiptValue} numberOfLines={1}>{item.name}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Price</Text>
                  <Text style={styles.receiptValue}>{price.toLocaleString()} MMK</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Quantity</Text>
                  <Text style={styles.receiptValue}>x{presenter.purchaseQuantity}</Text>
                </View>

                <View style={[styles.divider, styles.dividerThick]} />

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptTotalLabel}>Total</Text>
                  <Text style={styles.receiptTotalValue}>
                    {totalPrice.toLocaleString()} MMK
                  </Text>
                </View>
              </View>

              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setStep(1)}
                  disabled={presenter.purchaseIsLoading}
                >
                  <Text style={styles.cancelButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.confirmButton, presenter.purchaseIsLoading && styles.confirmButtonDisabled]}
                  onPress={presenter.handleBuy}
                  disabled={presenter.purchaseIsLoading}
                >
                  {presenter.purchaseIsLoading ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <Text style={styles.confirmButtonText}>Confirm Buy</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
