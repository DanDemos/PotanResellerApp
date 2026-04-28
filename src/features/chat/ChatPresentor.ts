
import { useState, useMemo, useEffect } from 'react';
import { Alert } from 'react-native';
import { Message } from '@/api/actions/gameChannel/gameChannelAPIDataTypes';
import { ChatInteractor } from './ChatInteractor';
import { ChatRouter } from './ChatRouter';

export function useChatPresentor(
  interactor: ChatInteractor,
  router: ChatRouter,
  currentUserId: number | undefined,
  regionId?: number
) {
  const [inputText, setInputText] = useState('');

  const messages = useMemo(
    () => interactor.messagesData?.messages?.data || [],
    [interactor.messagesData]
  );

  // Mark messages as read when they arrive
  useEffect(() => {
    if (messages.length > 0) {
      messages.forEach((msg: Message) => {
        if (!msg.read_at && msg.kind !== 'user') {
          interactor.markAsRead(msg.id);
        }
      });
    }
  }, [messages, interactor]);

  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (text === '' || !interactor.messagesData?.channel?.uuid) return;

    try {
      // Logic for parsing codes like "2116374221-7255-212" or "7255*212"
      // Split by any sequence of non-digit characters
      const parts = text.split(/[^\d]+/).filter(Boolean);

      const isPurchaseFormat = parts.length >= 2 && parts.length <= 3 && /[^\d\s]/.test(text);

      if (isPurchaseFormat) {
        const item: any = {
          user_code: parts[0], // Using the first part as user_code/account id
          product_id: parts.length === 3 ? parts[2] : parts[1],
          server_id: parts.length === 3 ? parts[1] : null,
        };

        await interactor.sendChatMessage({
          game_id: interactor.messagesData.channel.game_id,
          items: [item],
          body: text,
        }).unwrap();
      } else {
        await interactor.sendChatMessage({
          game_id: interactor.messagesData.channel.game_id,
          body: text,
        }).unwrap();
      }
      setInputText('');
    } catch (err: any) {
      console.error('Failed to create order or send message:', err);

      const errorMessage =
        err?.data?.error || err?.data?.message || err?.error || err?.message || 'Unknown error occurred';

      let strippedMessage = 'An error occurred';
      if (typeof errorMessage === 'string') {
        strippedMessage = errorMessage
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
          .replace(/<[^>]*>?/gm, '') // Remove all HTML tags
          .replace(/&[a-z]+;/gi, ' ') // Remove encoded chars like &nbsp;
          .replace(/\s+/g, ' ') // Reduce multi-whitespaces
          .trim();
      }

      Alert.alert('Notice', strippedMessage);
    }
  };

  const handleBack = () => {
    router.goBack();
  };

  return {
    messages,
    inputText,
    setInputText,
    handleSendMessage,
    handleBack,
    isLoading: interactor.messagesIsLoading,
    error: interactor.messagesError,
    refetch: () => {
      interactor.messagesRefetch();
    },
    sendIsLoading: interactor.sendIsLoading,
  };
}
