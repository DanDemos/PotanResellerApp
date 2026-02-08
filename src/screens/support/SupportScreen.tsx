import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '@/theme/colors';
import { styles } from './SupportScreen.styles';

export function SupportScreen(): React.ReactNode {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://potanshop.com/contact' }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      />
    </View>
  );
}
