
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export function useRefillPresenter(
  visible: boolean,
  setVisible: (visible: boolean) => void,
  isSuccess: boolean,
  onSubmit: (amount: string, note: string, photo: any) => Promise<any>
) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<any>(null);

  // Clear inputs on success or when closed
  useEffect(() => {
    if (isSuccess || !visible) {
      setAmount('');
      setNote('');
      setPhoto(null);
      if (isSuccess) {
        setVisible(false);
      }
    }
  }, [isSuccess, visible, setVisible]);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      setPhoto(result.assets[0]);
    }
  };

  const onConfirm = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid numeric amount.');
      return;
    }

    if (!photo) {
      Alert.alert(
        'Photo Required',
        'Please select a photo of your payment receipt.',
      );
      return;
    }

    try {
      await onSubmit(amount, note, photo);
    } catch (error) {
      // Error handled by Toast
    }
  };

  const handleClose = () => setVisible(false);

  return {
    amount,
    setAmount,
    note,
    setNote,
    photo,
    pickImage,
    onConfirm,
    handleClose,
  };
}
