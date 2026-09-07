import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import type { Asset } from 'react-native-image-picker';

export function useRefillPresenter(
  visible: boolean,
  setVisible: (visible: boolean) => void,
  isSuccess: boolean,
  onSubmit: (amount: string, note: string, photo: any) => Promise<any>,
) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<Asset | null>(null);

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

  function handlePhotoSelected(nextPhoto: Asset) {
    setPhoto(nextPhoto);
  }

  return {
    amount,
    setAmount,
    note,
    setNote,
    photo,
    handlePhotoSelected,
    onConfirm,
    handleClose,
  };
}
