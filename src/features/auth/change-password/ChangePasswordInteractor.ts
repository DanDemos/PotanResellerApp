
import { useChangePasswordMutation } from '@/api/actions/auth/authApi';
import { ChangePasswordRequest } from '@/api/actions/auth/authAPIDataTypes';
import { useCallback, useMemo, useEffect } from 'react';
import Toast from 'react-native-toast-message';

export function useChangePasswordInteractor() {
  const [
    changePassword,
    {
      isLoading: changePasswordIsLoading,
      isSuccess: changePasswordIsSuccess,
      isError: changePasswordIsError,
      error: changePasswordError,
    },
  ] = useChangePasswordMutation();

  useEffect(() => {
    if (changePasswordIsSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password changed successfully',
      });
    }
  }, [changePasswordIsSuccess]);

  useEffect(() => {
    if (changePasswordIsError && changePasswordError) {
      const err = changePasswordError as any;
      const message =
        typeof err?.message === 'string'
          ? err.message
          : err?.data?.message || 'Failed to change password';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    }
  }, [changePasswordIsError, changePasswordError]);

  const handleChangePassword = useCallback(
    async (data: ChangePasswordRequest) => {
      return changePassword(data).unwrap();
    },
    [changePassword],
  );

  return useMemo(
    () => ({
      handleChangePassword,
      changePasswordIsLoading,
      changePasswordIsSuccess,
    }),
    [handleChangePassword, changePasswordIsLoading, changePasswordIsSuccess],
  );
}
