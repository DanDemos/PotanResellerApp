
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import Logo from '@/assets/logo.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller } from 'react-hook-form';
import { PasswordInput } from '@/components/common/PasswordInput/PasswordInput';
import { styles } from './LoginScreen.styles';
import { colors } from '@/global/theme/colors';
import { useLoginPresenter } from '@/features/auth/login/LoginPresenter';

export function LoginScreen({ navigation }: any): React.ReactNode {
  const presenter = useLoginPresenter(navigation);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.card}>
        <Image source={Logo} style={styles.logo} />
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <Controller
            control={presenter.control}
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
          {presenter.formState.errors.phone && (
            <Text style={{ color: colors.error, marginTop: 6 }}>
              {String(presenter.formState.errors.phone.message)}
            </Text>
          )}
        </View>

        <Controller
          control={presenter.control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={value}
              onChangeText={onChange}
              error={presenter.formState.errors.password?.message?.toString()}
            />
          )}
        />

        <TouchableOpacity
          style={[styles.button, presenter.loginIsLoading ? { opacity: 0.7 } : {}]}
          onPress={presenter.handleSubmit(presenter.onSubmit)}
          disabled={presenter.loginIsLoading}
        >
          <Text style={styles.buttonText}>
            {presenter.loginIsLoading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              'Sign In'
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
