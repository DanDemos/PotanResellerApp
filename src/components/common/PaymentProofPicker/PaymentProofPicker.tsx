import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { colors } from '@/global/theme/colors';
import { styles } from './PaymentProofPicker.styles';

export type PaymentProofPhoto = {
  uri: string;
} | null;

type PaymentProofPickerProps = {
  photo: PaymentProofPhoto;
  onPress: () => void;
  label?: string;
  placeholderText?: string;
};

export function PaymentProofPicker({
  photo,
  onPress,
  label = 'Payment Proof (Photo)',
  placeholderText = 'Select Receipt Photo',
}: PaymentProofPickerProps): React.ReactNode {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.photoPicker, photo ? styles.photoPickerSelected : null]}
        onPress={onPress}
      >
        {photo ? (
          <Image
            source={{ uri: photo.uri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        ) : (
          <>
            <MaterialIcons
              name="add-a-photo"
              size={32}
              color={colors.textSecondary}
            />
            <Text style={styles.placeholderText}>{placeholderText}</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
