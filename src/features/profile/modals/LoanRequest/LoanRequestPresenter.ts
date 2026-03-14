
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';

export function useLoanRequestPresenter(
  visible: boolean,
  setVisible: (visible: boolean) => void,
  isSuccess: boolean,
  onSubmit: (amount: string, note: string) => Promise<any>
) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  // Clear inputs on success or when closed
  useEffect(() => {
    if (isSuccess || !visible) {
      setAmount('');
      setNote('');
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

    try {
      await onSubmit(amount, note);
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
    onConfirm,
    handleClose,
  };
}
