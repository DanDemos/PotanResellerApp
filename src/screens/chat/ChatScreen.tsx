'use client';

import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { colors } from '@/theme/colors';
import { styles } from './ChatScreen.styles';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  useGetChannelMessagesQuery,
  useMarkMessageAsReadMutation,
} from '@/api/actions/gameChannel/gameChannelApi';
import { Message } from '@/api/actions/gameChannel/gameChannelAPIDataTypes';
import { ActivityIndicator } from 'react-native';

export function ChatScreen(): React.ReactNode {
  const route = useRoute<any>();
  const { channelUuid, gameName } = route.params || {};
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  const {
    data: messagesData,
    isLoading: messagesIsLoading,
    error: messagesError,
    refetch: messagesRefetch,
  } = useGetChannelMessagesQuery(channelUuid, {
    skip: !channelUuid,
    refetchOnMountOrArgChange: true,
  });

  const [markAsRead] = useMarkMessageAsReadMutation();

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const messages = messagesData?.messages?.data || [];

  // Mark messages as read when they arrive
  useEffect(() => {
    if (messages.length > 0 && currentUserId) {
      messages.forEach(msg => {
        if (!msg.read_at && msg.sender_id !== currentUserId) {
          markAsRead(msg.id);
        }
      });
    }
  }, [messages, currentUserId, markAsRead]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    // TODO: Implement send message API
    console.log('Sending message:', inputText);
    setInputText('');
  };

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender_id === currentUserId;
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
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {/* Messages List */}
        {messagesIsLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : messagesError ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>
              {(messagesError as any)?.data?.message ||
                (messagesError as any)?.message ||
                'Failed to load messages'}
            </Text>
            <TouchableOpacity
              onPress={() => messagesRefetch()}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id.toString()}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesContent}
            scrollEnabled={true}
            onRefresh={messagesRefetch}
            refreshing={messagesIsLoading}
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
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
          </View>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            activeOpacity={0.7}
          >
            <MaterialIcons name="send" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
