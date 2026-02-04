import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/theme/colors';

const { width: screenWidth } = Dimensions.get('window');
const gap = 12;
const paddingHorizontal = 16;
const cardWidth = (screenWidth - (paddingHorizontal * 2) - gap) / 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingVertical: 0,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.coinColor,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  vipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
    marginLeft: 4,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    paddingTop: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  balanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    // Android Shadow
    elevation: 3,
  },
  walletsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  compactBalanceCard: {
    width: cardWidth,
    padding: 16,
    marginBottom: 0,
    minHeight: 320,
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  floatingConversionButton: {
    position: 'absolute',
    left: cardWidth - 14,
    top: '50%',
    transform: [{ translateY: -20 }],
    zIndex: 20, // Higher than notch
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.coinColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  floatingConversionLoadingButton: {
    position: 'absolute',
    left: cardWidth - 14,
    top: '50%',
    transform: [{ translateY: -20 }],
    zIndex: 20, // Higher than notch
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },

  compactWalletHeader: {
    marginBottom: 12,
    gap: 10,
    height: 80, // Fix header height for alignment
  },
  compactWalletIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  compactWalletAmount: {
    fontSize: 20,
    marginTop: 0,
  },
  compactWalletActions: {
    flex: 1,
    flexDirection: 'column',
    gap: 8,
    marginTop: 12,
    justifyContent: 'flex-end', // Align buttons to bottom
  },
  compactActionButton: {
    flex: 0,
    paddingVertical: 10,
    height: 44, // Consistent button height
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  walletIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinIcon: {
    backgroundColor: colors.coinColor,
  },
  walletTitleContainer: {
    flex: 1,
  },
  walletTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  walletAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2,
  },
  currencyText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#e6f3ff',
  },
  debtText: {
    fontSize: 12,
    color: '#FF5252',
    fontWeight: '600',
    marginTop: 4,
  },
  walletActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  walletActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  historyButton: {
    backgroundColor: '#f5f5f5',
  },
  historyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  loanButton: {
    backgroundColor: '#f5f5f5',
  },
  loanButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  topupButton: {
    backgroundColor: colors.primary,
  },
  topupButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  coinAmount: {
    color: colors.coinColor, // Gold/Orange for coins
  },
  coinTopupButton: {
    backgroundColor: colors.coinColor,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 8,
    gap: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  closeButton: {
    padding: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  exchangeInfo: {
    backgroundColor: '#F0F9FF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  rateText: {
    fontSize: 13,
    color: '#0369A1',
    fontWeight: '600',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0284C7',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
  },
  cancelButtonText: {
    color: '#64748B',
    fontWeight: '700',
    fontSize: 15,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  photoPicker: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
});
