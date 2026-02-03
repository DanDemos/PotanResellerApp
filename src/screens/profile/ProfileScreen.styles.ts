import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

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
    backgroundColor: '#FFD700',
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
    paddingVertical: 12,
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
    backgroundColor: '#e6f3ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinIcon: {
    backgroundColor: '#fff9e6',
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
    color: colors.primary,
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
  topupButton: {
    backgroundColor: colors.primary,
  },
  topupButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  coinAmount: {
    color: '#FFA500', // Gold/Orange for coins
  },
  coinTopupButton: {
    backgroundColor: '#FFA500',
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
});
