import { StyleSheet } from 'react-native';
import { colors } from '@/global/theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    paddingBottom: 80, // Space for FAB
  },
  channelItem: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'flex-start', // Align items to top to handle multiline messages
    height: 76, // Fixed height for consistency or 'auto'
  },
  avatarContainer: {
    marginRight: 12,
    justifyContent: 'center',
    paddingTop: 2,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.backgroundLight, // Neutral background for fallback
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.primary, // Game List blue text
    fontSize: 18,
    fontWeight: 'bold',
  },
  channelContent: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    paddingBottom: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '75%',
  },
  channelName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginRight: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIcon: {
    transform: [{ rotate: '45deg' }], // Stylistic choice
    marginRight: 4,
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageText: {
    fontSize: 15,
    color: colors.textSecondary,
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  separator: {
    height: StyleSheet.hairlineWidth, // ~0.5 on high density screens
    backgroundColor: colors.borderLight,
    marginLeft: 76, // Inset to align with text
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  loadingFooter: {
    padding: 12,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4444',
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
  sectionHeader: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
});
