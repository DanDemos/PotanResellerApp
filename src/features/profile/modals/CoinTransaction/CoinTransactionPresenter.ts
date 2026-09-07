import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import type { Asset } from 'react-native-image-picker';

export function useCoinTransactionPresenter(
  visible: boolean,
  setVisible: (visible: boolean) => void,
  coinMode: 'topup' | 'convert',
  isSuccess: boolean,
  handleConfirm: (
    mode: 'topup' | 'convert',
    amount: string,
    note: string,
    photo: any,
  ) => Promise<any>,
) {
  const [coinAmount, setCoinAmount] = useState('');
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<Asset | null>(null);

  // Clear inputs on success or when closed
  useEffect(() => {
    if (isSuccess || !visible) {
      setCoinAmount('');
      setNote('');
      setPhoto(null);
      if (isSuccess) {
        setVisible(false);
      }
    }
  }, [isSuccess, visible, setVisible]);

  const onConfirm = async () => {
    if (!coinAmount || isNaN(Number(coinAmount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid numeric amount.');
      return;
    }

    if (coinMode === 'topup' && !photo) {
      Alert.alert(
        'Photo Required',
        'Please select a photo of your payment receipt.',
      );
      return;
    }

    try {
      await handleConfirm(coinMode, coinAmount, note, photo);
    } catch (error) {
      // Error handled by Toast
    }
  };

  const handleClose = () => setVisible(false);

  function handlePhotoSelected(nextPhoto: Asset) {
    setPhoto(nextPhoto);
  }

  return {
    coinAmount,
    setCoinAmount,
    note,
    setNote,
    photo,
    handlePhotoSelected,
    onConfirm,
    handleClose,
  };
}
