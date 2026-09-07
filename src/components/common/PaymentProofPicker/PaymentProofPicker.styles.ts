import { StyleSheet } from 'react-native';
import { colors } from '@/global/theme/colors';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  photoPickerSelected: {
    backgroundColor: colors.white,
    borderStyle: 'solid',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  placeholderText: {
    color: colors.textSecondary,
    marginTop: 8,
  },
});
