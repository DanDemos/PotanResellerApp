
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export function useRepaymentPresenter(
  visible: boolean,
  setVisible: (visible: boolean) => void,
  isSuccess: boolean,
  onSubmit: (amount: string, note: string, photo: any) => Promise<any>
) {
  const [repayAmount, setRepayAmount] = useState('');
  const [repayNote, setRepayNote] = useState('');
  const [repayPhoto, setRepayPhoto] = useState<any>(null);

  // Clear inputs on success or when closed
  useEffect(() => {
    if (isSuccess || !visible) {
      setRepayAmount('');
      setRepayNote('');
      setRepayPhoto(null);
      if (isSuccess) {
        setVisible(false);
      }
    }
  }, [isSuccess, visible, setVisible]);

  const pickRepaymentImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      setRepayPhoto(result.assets[0]);
    }
  };

  const onConfirm = async () => {
    if (!repayAmount || isNaN(Number(repayAmount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid numeric amount.');
      return;
    }

    if (!repayPhoto) {
      Alert.alert(
        'Photo Required',
        'Please select a photo of your payment receipt.',
      );
      return;
    }

    try {
      await onSubmit(repayAmount, repayNote, repayPhoto);
    } catch (error) {
      // Error handled by Toast
    }
  };

  const handleClose = () => setVisible(false);

  return {
    repayAmount,
    setRepayAmount,
    repayNote,
    setRepayNote,
    repayPhoto,
    pickRepaymentImage,
    onConfirm,
    handleClose,
  };
}
