import { StyleSheet } from 'react-native';
import { colors } from '@/global/theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    paddingBottom: 20,
  },
  channelItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  channelContent: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameContainer: {
    flex: 1,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderLight,
    marginLeft: 82,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.error || '#ef4444',
    fontSize: 16,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },

});
