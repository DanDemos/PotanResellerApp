
import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/schemas/authSchemas';
import { setCredentials } from '@/redux/slices/authSlice';
import Toast from 'react-native-toast-message';
import { useLoginInteractor } from './LoginInteractor';
import { useLoginRouter } from './LoginRouter';

export function useLoginPresenter(navigation: any) {
  const dispatch = useDispatch();
  const interactor = useLoginInteractor();
  const router = useLoginRouter(navigation);

  const { control, handleSubmit, formState } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '', password: '' },
  });

  const {
    login,
    loginIsLoading,
    loginIsSuccess,
    loginIsError,
    loginData,
    loginError,
  } = interactor;

  useEffect(() => {
    if (loginIsSuccess && loginData) {
      dispatch(
        setCredentials({ user: loginData.user, token: loginData.token }),
      );
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Redirecting to home...',
        visibilityTime: 2000,
      });
    }
  }, [loginIsSuccess, loginData, dispatch]);

  useEffect(() => {
    if (loginIsError && loginError) {
      const err = loginError as any;
      const message =
        typeof err?.message === 'string'
          ? err.message
          : err?.data?.message || 'Invalid phone or password';
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: message,
      });
    }
  }, [loginIsError, loginError]);

  const onSubmit = useCallback(
    (formData: LoginFormData) => {
      login({
        phone: formData.phone,
        password: formData.password,
      });
    },
    [login],
  );

  return useMemo(
    () => ({
      control,
      handleSubmit,
      formState,
      loginIsLoading,
      onSubmit,
      ...router,
    }),
    [control, handleSubmit, formState, loginIsLoading, onSubmit, router],
  );
}
