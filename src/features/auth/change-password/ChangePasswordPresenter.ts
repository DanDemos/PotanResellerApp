
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useChangePasswordInteractor } from './ChangePasswordInteractor';
import { useChangePasswordRouter } from './ChangePasswordRouter';

export function useChangePasswordPresenter(
  visible: boolean,
  setVisible: (visible: boolean) => void,
) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const interactor = useChangePasswordInteractor();
  const router = useChangePasswordRouter();

  const {
    handleChangePassword,
    changePasswordIsLoading,
    changePasswordIsSuccess,
  } = interactor;

  // Reset state on success or close
  useEffect(() => {
    if (changePasswordIsSuccess || !visible) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (changePasswordIsSuccess) {
        setVisible(false);
      }
    }
  }, [changePasswordIsSuccess, visible, setVisible]);

  const handleConfirm = useCallback(async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    try {
      await handleChangePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
    } catch (error) {
      // Error is handled by Toast in the interactor
    }
  }, [currentPassword, newPassword, confirmPassword, handleChangePassword]);

  const handleClose = useCallback(() => setVisible(false), [setVisible]);

  return useMemo(
    () => ({
      currentPassword,
      setCurrentPassword,
      newPassword,
      setNewPassword,
      confirmPassword,
      setConfirmPassword,
      handleConfirm,
      handleClose,
      changePasswordIsLoading,
      ...router,
    }),
    [
      currentPassword,
      newPassword,
      confirmPassword,
      handleConfirm,
      handleClose,
      changePasswordIsLoading,
      router,
    ],
  );
}
