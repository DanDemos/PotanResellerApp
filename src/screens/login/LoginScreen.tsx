import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Logo from '@/assets/logo.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/schemas/authSchemas';
import { useLoginMutation } from '@/api/actions/auth/authApi';
import { PasswordInput } from '@/components/common/PasswordInput/PasswordInput';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';
import { styles } from './LoginScreen.styles';
import { colors } from '@/theme/colors';

export function LoginScreen(): React.ReactNode {
  const dispatch = useDispatch();
  const { control, handleSubmit, formState } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '', password: '' },
  });

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

  const onSubmit = (formData: LoginFormData) => {
    login({
      phone: formData.phone,
      password: formData.password,
    });
  };
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.card}>
        <Image source={Logo} style={styles.logo} />
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#9ca3af"
                value={value}
                onChangeText={onChange}
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
            )}
          />
          {formState.errors.phone && (
            <Text style={{ color: 'red', marginTop: 6 }}>
              {String(formState.errors.phone.message)}
            </Text>
          )}
        </View>

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={value}
              onChangeText={onChange}
              error={formState.errors.password?.message?.toString()}
            />
          )}
        />

        <TouchableOpacity
          style={[styles.button, loginIsLoading ? { opacity: 0.7 } : {}]}
          onPress={handleSubmit(onSubmit)}
          disabled={loginIsLoading}
        >
          <Text style={styles.buttonText}>
            <Text style={styles.buttonText}>
              {loginIsLoading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                'Sign In'
              )}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
