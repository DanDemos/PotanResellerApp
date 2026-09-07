import { colors } from '@/global/theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: colors.textDark,
  },
  eyeIcon: {
    padding: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 6,
  },
});
