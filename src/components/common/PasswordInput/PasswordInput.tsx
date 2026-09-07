import React, { useState, forwardRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { styles } from './PasswordInput.styles';
import { colors } from '@/global/theme/colors';

type PasswordInputProps = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
};

export const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  function PasswordInput(
    { label, error, containerStyle, ...textInputProps },
    ref,
  ): React.ReactNode {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <View style={[styles.inputContainer, containerStyle]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View style={styles.passwordContainer}>
          <TextInput
            ref={ref}
            style={styles.passwordInput}
            placeholderTextColor={colors.textSecondary}
            {...textInputProps}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  },
);
