import { StyleSheet } from 'react-native';
import { colors } from '@/global/theme/colors';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stockInfo: {
    fontSize: 12,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 20,
  },
  stockInfoWarning: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  quantityButton: {
    backgroundColor: '#f1f5f9',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    marginHorizontal: 24,
  },
  
  // --- Modern Receipt Styles for Step 2 ---
  receiptContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerThick: {
    height: 2,
    backgroundColor: '#cbd5e1',
    marginVertical: 4,
  },
  receiptLabel: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: '500',
    flex: 1,
  },
  receiptValue: {
    fontSize: 14,
    color: colors.textDark,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  receiptTotalLabel: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: 'bold',
  },
  receiptTotalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    marginLeft: 8,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.7,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
