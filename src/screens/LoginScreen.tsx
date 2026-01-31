import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '@/services/authApi';

interface LoginScreenProps {
  onLogin: () => void;
}

const schema = z.object({
  phone: z
    .string()
    .min(7, 'Phone number is too short')
    .regex(/^\+?\d+$/, 'Phone must contain only digits and optional leading +'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { control, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { phone: '', password: '' },
  });

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data: FormData) => {
    try {
      await login({ phone: data.phone, password: data.password }).unwrap();
      onLogin();
    } catch (err: any) {
      const message = err?.data?.message || 'Invalid phone or password';
      Alert.alert('Login failed', message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
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
            <Text style={{ color: 'red', marginTop: 6 }}>{String(formState.errors.phone.message)}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                value={value}
                onChangeText={onChange}
                secureTextEntry
              />
            )}
          />
          {formState.errors.password && (
            <Text style={{ color: 'red', marginTop: 6 }}>{String(formState.errors.password.message)}</Text>
          )}
        </View>

        <TouchableOpacity style={[styles.button, isLoading ? { opacity: 0.7 } : {}]} onPress={handleSubmit(onSubmit)} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Signing In...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Forgot your password?</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6', // Light grey background
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff', // White
    padding: 32,
    width: '100%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937', // Dark grey
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280', // Medium grey
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151', // Dark grey
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db', // Light grey border
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f9fafb', // Very light grey
    color: '#1f2937', // Dark grey text
  },
  button: {
    backgroundColor: '#0ea5e9', // Sky-500 blue
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#0ea5e9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  buttonText: {
    color: '#ffffff', // White
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280', // Medium grey
    textAlign: 'center',
  },
});

export default LoginScreen;