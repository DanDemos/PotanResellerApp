import { StyleSheet, Platform } from 'react-native';
import { colors } from '@/global/theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  messageContainer: {
    marginVertical: 6,
    flexDirection: 'column',
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  supportMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    // Subtle shadow for bubbles
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4, // Style choice for message tail
  },
  supportBubble: {
    backgroundColor: colors.white, // Clean white like ProfileScreen background
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: colors.white,
  },
  supportMessageText: {
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    marginHorizontal: 8,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 0, // Reduced from 4 to minimize internal vertical gap
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    width: '100%',
    fontSize: 15,
    color: colors.text,
    paddingVertical: 10,
    minHeight: 40, // Starts as a single line height
    maxHeight: 140, // Capacity for approx 5-6 lines
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 12, // Matching input wrapper radius
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    // Subtle shadow
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
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
  emptyText: {
    color: colors.textLight,
    fontSize: 16,
  },
  productListBubble: {
    width: '92%',
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  productListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  productListHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 1,
    marginRight: 8,
  },
  productListHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
    marginLeft: 6,
  },
  productListCountBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 28,
    alignItems: 'center',
    flexShrink: 0,
  },
  productListCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  productRowLast: {
    borderBottomWidth: 0,
  },
  productLabelBadge: {
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    minWidth: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  productLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  productRowContent: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  productNameText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 20,
  },
  productPriceInline: {
    fontWeight: '700',
    color: colors.coinColor,
  },
});
