
import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/global/theme/colors';

const { width } = Dimensions.get('window');
const columnWidth = (width - 48) / 2;

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
  productCard: {
    width: columnWidth,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: columnWidth,
    backgroundColor: '#f1f5f9',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 12,
  },
  namePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
    flex: 1,
    marginRight: 8,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  currencyText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 1,
  },
  buyButtonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  buyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24, // Wider for centered look
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    minWidth: '80%', // Make it nice and wide
    alignItems: 'center',
  },
  buyButtonText: {
    color: colors.white,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    // paddingRight: 10,
    // paddingLeft: 10,
  },
  footer: {
    // ...
    paddingVertical: 20,
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
  walletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  walletValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
  },
  walletLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 2,
    marginTop: 2,
  },
});
