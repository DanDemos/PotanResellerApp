
import { useState, useMemo, useEffect } from 'react';
import { Message } from '@/api/actions/gameChannel/gameChannelAPIDataTypes';
import { ChatInteractor } from './ChatInteractor';
import { ChatRouter } from './ChatRouter';

export function useChatPresentor(
  interactor: ChatInteractor,
  router: ChatRouter,
  currentUserId: number | undefined
) {
  const [inputText, setInputText] = useState('');

  const messages = useMemo(
    () => interactor.messagesData?.messages?.data || [], 
    [interactor.messagesData]
  );

  // Mark messages as read when they arrive
  useEffect(() => {
    if (messages.length > 0 && currentUserId) {
      messages.forEach((msg: Message) => {
        if (!msg.read_at && msg.sender_id !== currentUserId) {
          interactor.markAsRead(msg.id);
        }
      });
    }
  }, [messages, currentUserId, interactor]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    // TODO: Implement send message API through interactor
    console.log('Sending message:', inputText);
    setInputText('');
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
    refetch: interactor.messagesRefetch,
  };
}
