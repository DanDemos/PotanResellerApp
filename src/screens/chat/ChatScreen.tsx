import { useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { colors } from '@/global/theme/colors';
import { styles } from './ChatScreen.styles';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Message } from '@/api/actions/gameChannel/gameChannelAPIDataTypes';

// VIPER Imports
import { useChatInteractor } from '@/features/chat/ChatInteractor';
import { ChatRouter } from '@/features/chat/ChatRouter';
import { useChatPresentor } from '@/features/chat/ChatPresentor';

export function ChatScreen(): React.ReactNode {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { channelUuid, regionId } = route.params || {};
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  // VIPER Initialization
  const interactor = useChatInteractor(channelUuid);
  const router = useMemo(() => new ChatRouter(navigation), [navigation]);
  const presenter = useChatPresentor(interactor, router, currentUserId, regionId);

  const flatListRef = useRef<FlatList>(null);

  // View-specific UI side effect: Scroll to end on new messages
  useEffect(() => {
    if (presenter.messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [presenter.messages]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.kind === 'user';
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.supportMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.supportBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.supportMessageText,
            ]}
          >
            {item.body}
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {new Date(item.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {/* Messages List */}
        {presenter.isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : presenter.error ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>
              {(presenter.error as any)?.data?.message ||
                (presenter.error as any)?.message ||
                'Failed to load messages'}
            </Text>
            <TouchableOpacity
              onPress={() => presenter.refetch()}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={presenter.messages}
            keyExtractor={item => item.id.toString()}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesContent}
            scrollEnabled={true}
            onRefresh={presenter.refetch}
            refreshing={presenter.isLoading}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.emptyText}>No messages yet</Text>
              </View>
            }
          />
        )}

        {/* Input Area */}
        <View style={styles.inputArea}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor={colors.textLight}
              value={presenter.inputText}
              onChangeText={presenter.setInputText}
              multiline
            />
          </View>
          <TouchableOpacity
            style={[styles.sendButton, presenter.sendIsLoading && { opacity: 0.6 }]}
            onPress={presenter.handleSendMessage}
            activeOpacity={0.7}
            disabled={presenter.sendIsLoading || presenter.inputText.trim() === ''}
          >
            {presenter.sendIsLoading ? (
               <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <MaterialIcons name="send" size={20} color={colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
