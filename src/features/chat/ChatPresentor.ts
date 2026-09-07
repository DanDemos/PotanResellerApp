import { useState, useMemo, useEffect } from 'react';
import { Alert } from 'react-native';
import {
  Message,
  MessageProduct,
  ProductListPayload,
} from '@/api/actions/gameChannel/gameChannelAPIDataTypes';
import { ChatInteractor } from './ChatInteractor';
import { ChatRouter } from './ChatRouter';

export function isProductListPayload(
  payload: Message['parsed_payload'],
): payload is ProductListPayload {
  return payload?.type === 'product_list' && Array.isArray(payload.products);
}

export function formatCoinAmount(costPrice: string): string {
  const coins = Math.round(parseFloat(costPrice || '0') * 100);
  return Number.isFinite(coins) ? coins.toLocaleString('en-US') : '0';
}

function buildProductLabelMap(messages: Message[]): Map<string, string> {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const payload = messages[index].parsed_payload;
    if (!isProductListPayload(payload) || payload.products.length === 0) {
      continue;
    }

    const map = new Map<string, string>();
    payload.products.forEach((product: MessageProduct, productIndex: number) => {
      map.set(String(productIndex + 1), String(product.product_id));
    });
    return map;
  }

  return new Map();
}

export function useChatPresentor(
  interactor: ChatInteractor,
  router: ChatRouter,
  currentUserId: number | undefined,
  regionId?: number,
) {
  const [inputText, setInputText] = useState('');

  const messages = useMemo(
    () => interactor.messagesData?.messages?.data || [],
    [interactor.messagesData],
  );

  const productLabelMap = useMemo(
    () => buildProductLabelMap(messages),
    [messages],
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

      const isPurchaseFormat =
        parts.length >= 2 && parts.length <= 3 && /[^\d\s]/.test(text);

      if (isPurchaseFormat) {
        const labelOrProductId = parts.length === 3 ? parts[2] : parts[1];
        const resolvedProductId =
          productLabelMap.get(String(labelOrProductId)) || labelOrProductId;

        const item = {
          user_code: parts[0],
          product_id: resolvedProductId,
          server_id: parts.length === 3 ? parts[1] : null,
        };

        await interactor
          .sendChatMessage({
            game_id: interactor.messagesData.channel.game_id,
            items: [item],
            body: text,
          })
          .unwrap();
      } else {
        await interactor
          .sendChatMessage({
            game_id: interactor.messagesData.channel.game_id,
            body: text,
          })
          .unwrap();
      }
      setInputText('');
    } catch (err: unknown) {
      console.error('Failed to create order or send message:', err);

      const errorMessage =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { error?: string; message?: string }; error?: string; message?: string })
              .data?.error ||
            (err as { data?: { message?: string } }).data?.message ||
            (err as { error?: string }).error ||
            (err as { message?: string }).message
          : undefined;

      let strippedMessage = 'An error occurred';
      if (typeof errorMessage === 'string') {
        strippedMessage = errorMessage
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<[^>]*>?/gm, '')
          .replace(/&[a-z]+;/gi, ' ')
          .replace(/\s+/g, ' ')
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
