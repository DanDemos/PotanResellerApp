
import { StyleSheet } from 'react-native';
import { colors } from '@/global/theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginLeft: 16,
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  historyCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    flexDirection: 'column',
    alignItems: 'stretch',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  giftCardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  giftCardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  giftCardName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  pendingBadge: {
    backgroundColor: '#fef3c7',
  },
  pendingText: {
    color: '#d97706',
  },
  approvedBadge: {
    backgroundColor: '#dcfce7',
  },
  approvedText: {
    color: '#16a34a',
  },
  rejectedBadge: {
    backgroundColor: '#fee2e2',
  },
  rejectedText: {
    color: '#dc2626',
  },
  rejectReasonContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff1f2',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f43f5e',
    width: '100%',
  },
  rejectReasonText: {
    fontSize: 13,
    color: '#e11d48',
    lineHeight: 18,
    fontWeight: '500',
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginHorizontal: 32,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '700',
  },
});
