import { StyleSheet } from 'react-native';
import { colors } from '@/global/theme/colors';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    width: 300,
    maxHeight: 400,
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 8,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdownHeader: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.backgroundLight,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  markAllReadText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  notificationItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    flex: 1,
    marginRight: 8,
  },
  notificationTime: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  notificationBody: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  copyHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  copyHintText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    position: 'absolute',
    top: 12,
    right: 12,
  },
  listEmpty: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  loadingFooter: {
    padding: 12,
    alignItems: 'center',
  },
});
