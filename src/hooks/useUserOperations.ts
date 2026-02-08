import { useEffect, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { useGetUserDataQuery } from '@/api/actions/user/userApi';
import { useChangePasswordMutation } from '@/api/actions/auth/authApi';
import { ChangePasswordRequest } from '@/api/actions/auth/authAPIDataTypes';

interface UseUserOperationsProps {
  onPasswordChangeSuccess?: () => void;
}

export function useUserOperations({ onPasswordChangeSuccess }: UseUserOperationsProps = {}) {
  const {
    data: userData,
    isLoading: userIsLoading,
    isFetching: userIsFetching,
    error: userError,
    refetch: userRefetch,
  } = useGetUserDataQuery(undefined, { refetchOnMountOrArgChange: true });

  const [
    changePassword,
    {
      isLoading: changePasswordIsLoading,
      isSuccess: changePasswordIsSuccess,
      isError: changePasswordIsError,
      error: changePasswordError,
    },
  ] = useChangePasswordMutation();

  // Effects for Toasts
  useEffect(() => {
    if (changePasswordIsSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password changed successfully',
      });
      if (onPasswordChangeSuccess) {
        onPasswordChangeSuccess();
      }
    }
  }, [changePasswordIsSuccess, onPasswordChangeSuccess]);

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

  const onRefresh = useCallback(() => {
    userRefetch();
  }, [userRefetch]);

  const handleChangePassword = async (data: ChangePasswordRequest) => {
    return changePassword(data).unwrap();
  };

  return {
    // Data
    userData,
    userIsLoading,
    userIsFetching,
    userError,
    userRefetch,
    // Loading State
    changePasswordIsLoading,
    changePasswordIsSuccess,
    // Handlers
    onRefresh,
    handleChangePassword,
  };
}
