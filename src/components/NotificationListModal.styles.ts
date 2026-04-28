import { StyleSheet } from 'react-native';
import { colors } from '@/global/theme/colors';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 110,
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
    borderColor: '#f0f0f0',
  },
  dropdownHeader: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8fafc',
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  markAllReadText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  notificationItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
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
    color: '#334155',
    flex: 1,
    marginRight: 8,
  },
  notificationTime: {
    fontSize: 11,
    color: '#94a3b8',
  },
  notificationBody: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
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
    color: '#94a3b8',
    marginTop: 8,
  },
  loadingFooter: {
    padding: 12,
    alignItems: 'center',
  },
});
