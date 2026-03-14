
import { useLoginMutation } from '@/api/actions/auth/authApi';
import { useMemo } from 'react';

export function useLoginInteractor() {
  const [
    login,
    {
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
      isError: loginIsError,
      data: loginData,
      error: loginError,
    },
  ] = useLoginMutation();

  return useMemo(
    () => ({
      login,
      loginIsLoading,
      loginIsSuccess,
      loginIsError,
      loginData,
      loginError,
    }),
    [login, loginIsLoading, loginIsSuccess, loginIsError, loginData, loginError],
  );
}
