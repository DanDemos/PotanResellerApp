import {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';

/**
 * Chat-screen keyboard padding that tracks the IME animation frame-by-frame.
 * Full-screen only — do not use for modals (`useKeyboardModalLift` instead).
 */
export function useChatKeyboardPadding() {
  const keyboard = useAnimatedKeyboard({
    isStatusBarTranslucentAndroid: true,
    isNavigationBarTranslucentAndroid: true,
  });

  return useAnimatedStyle(() => ({
    paddingBottom: keyboard.height.value,
  }));
}
