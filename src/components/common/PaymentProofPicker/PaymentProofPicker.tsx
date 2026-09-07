import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {
  launchImageLibrary,
  type Asset,
} from 'react-native-image-picker';
import { colors } from '@/global/theme/colors';
import { styles } from './PaymentProofPicker.styles';

export type PaymentProofPhoto = Asset | null;

type PaymentProofPickerProps = {
  photo: PaymentProofPhoto;
  onPhotoSelected: (photo: Asset) => void;
  label?: string;
  placeholderText?: string;
};

export function PaymentProofPicker({
  photo,
  onPhotoSelected,
  label = 'Payment Proof (Photo)',
  placeholderText = 'Select Receipt Photo',
}: PaymentProofPickerProps): React.ReactNode {
  async function handlePickPhoto() {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0 && result.assets[0]) {
      onPhotoSelected(result.assets[0]);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.photoPicker, photo ? styles.photoPickerSelected : null]}
        onPress={handlePickPhoto}
      >
        {photo?.uri ? (
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
