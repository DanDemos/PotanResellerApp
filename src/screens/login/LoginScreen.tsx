import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  Keyboard,
  Platform,
  type KeyboardEvent,
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
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const passwordInputRef = useRef<TextInput>(null);
  const onSignIn = presenter.handleSubmit(presenter.onSubmit);

  useEffect(() => {
    function handleKeyboardShow(event: KeyboardEvent) {
      setKeyboardHeight(event.endCoordinates.height);
    }

    function handleKeyboardHide() {
      setKeyboardHeight(0);
    }

    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      handleKeyboardShow,
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      handleKeyboardHide,
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const isKeyboardVisible = keyboardHeight > 0;

  return (
    <SafeAreaView
      style={[
        styles.container,
        isKeyboardVisible && { paddingBottom: keyboardHeight },
      ]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          isKeyboardVisible && styles.scrollContentKeyboardOpen,
        ]}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
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
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                />
              )}
            />
            {presenter.formState.errors.phone && (
              <Text style={styles.errorText}>
                {String(presenter.formState.errors.phone.message)}
              </Text>
            )}
          </View>

          <Controller
            control={presenter.control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <PasswordInput
                ref={passwordInputRef}
                label="Password"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                error={presenter.formState.errors.password?.message?.toString()}
                returnKeyType="go"
                onSubmitEditing={onSignIn}
                enablesReturnKeyAutomatically
              />
            )}
          />

          <TouchableOpacity
            style={[
              styles.button,
              presenter.loginIsLoading ? { opacity: 0.7 } : {},
            ]}
            onPress={onSignIn}
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
      </ScrollView>
    </SafeAreaView>
  );
}
