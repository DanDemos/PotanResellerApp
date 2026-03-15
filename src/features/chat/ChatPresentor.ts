
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
      const orderMatch = text.match(/^([a-zA-Z0-9]+)-(\d+)$/);

      if (orderMatch && regionId != null) {
        await interactor.createOrder({
          region_id: regionId,
          product: orderMatch[1],
          product_id: parseInt(orderMatch[2], 10),
        }).unwrap();
      } else {
        await interactor.sendChatMessage({
          channelUuid: interactor.messagesData.channel.uuid,
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
    isLoading: interactor.messagesIsLoading || interactor.historyLoading,
    error: interactor.messagesError || interactor.historyError,
    refetch: () => {
      interactor.messagesRefetch();
      interactor.historyRefetch();
    },
    history: interactor.historyData?.messages?.data || [],
    sendIsLoading: interactor.sendIsLoading || interactor.createOrderIsLoading,
  };
}
