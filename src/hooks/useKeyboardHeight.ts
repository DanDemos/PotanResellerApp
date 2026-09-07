import { useEffect, useState } from 'react';
import { Keyboard, Platform, type KeyboardEvent } from 'react-native';

type UseKeyboardHeightOptions = {
  enabled?: boolean;
};

type UseKeyboardHeightResult = {
  keyboardHeight: number;
  keyboardTop: number;
  isKeyboardVisible: boolean;
};

/**
 * Metrics-only keyboard listener for full screens and other non-modal layouts.
 * Callers own their UI (padding, KeyboardAvoidingView, scroll tweaks, etc.).
 * Do not use this for modal overlay lift — use `useKeyboardModalLift` instead.
 */
export function useKeyboardHeight(
  options: UseKeyboardHeightOptions = {},
): UseKeyboardHeightResult {
  const { enabled = true } = options;
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardTop, setKeyboardTop] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setKeyboardHeight(0);
      setKeyboardTop(0);
      return;
    }

    function handleKeyboardShow(event: KeyboardEvent) {
      setKeyboardHeight(event.endCoordinates.height);
      setKeyboardTop(event.endCoordinates.screenY);
    }

    function handleKeyboardHide() {
      setKeyboardHeight(0);
      setKeyboardTop(0);
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
  }, [enabled]);

  return {
    keyboardHeight,
    keyboardTop,
    isKeyboardVisible: keyboardHeight > 0,
  };
}
