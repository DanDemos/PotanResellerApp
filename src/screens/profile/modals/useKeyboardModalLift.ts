import { useState } from 'react';
import {
  Dimensions,
  Platform,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
import { useKeyboardHeight } from '@/hooks/useKeyboardHeight';

const OVERLAY_PADDING = 20;

type KeyboardModalLift = {
  isKeyboardVisible: boolean;
  overlayKeyboardStyle: ViewStyle | undefined;
  modalKeyboardStyle: ViewStyle | undefined;
  onOverlayLayout: (event: LayoutChangeEvent) => void;
};

/**
 * Modal-only keyboard lift. Full screens (Chat, Login) should use their own
 * keyboard hooks instead of this.
 *
 * Android sizes from the measured overlay height so we only pad the keyboard
 * overlap that still covers the dialog — never taller than space above the IME.
 *
 * When the keyboard is open we set a definite `height` (not only `maxHeight`).
 * Sticky-header modals put `flex: 1` on the body ScrollView; a maxHeight-only
 * parent collapses that flex child to 0 and leaves only the title/close row.
 */
export function useKeyboardModalLift(visible: boolean): KeyboardModalLift {
  const { keyboardHeight, keyboardTop, isKeyboardVisible } = useKeyboardHeight({
    enabled: visible,
  });
  const [overlayHeight, setOverlayHeight] = useState(0);

  function onOverlayLayout(event: LayoutChangeEvent) {
    const nextHeight = event.nativeEvent.layout.height;
    setOverlayHeight(previous => (previous === nextHeight ? previous : nextHeight));
  }

  if (!isKeyboardVisible) {
    return {
      isKeyboardVisible: false,
      overlayKeyboardStyle: undefined,
      modalKeyboardStyle: undefined,
      onOverlayLayout,
    };
  }

  function modalBodyStyle(availableHeight: number): ViewStyle {
    return {
      height: availableHeight,
      maxHeight: availableHeight,
      overflow: 'hidden',
    };
  }

  if (Platform.OS === 'android') {
    const screenHeight = Dimensions.get('screen').height;
    const measuredOverlay =
      overlayHeight > 0 ? overlayHeight : Dimensions.get('window').height;
    // Dialog may already be resized above the IME; only pad leftover overlap.
    const alreadyShrunk = Math.max(0, screenHeight - measuredOverlay);
    const bottomPad = Math.max(0, keyboardHeight - alreadyShrunk);
    const availableHeight = Math.max(
      200,
      measuredOverlay - bottomPad - OVERLAY_PADDING * 2,
    );

    return {
      isKeyboardVisible: true,
      overlayKeyboardStyle: {
        paddingBottom: bottomPad,
        justifyContent: 'flex-end',
      },
      modalKeyboardStyle: modalBodyStyle(availableHeight),
      onOverlayLayout,
    };
  }

  const modalHeight = Math.max(keyboardTop - OVERLAY_PADDING * 2, 200);

  return {
    isKeyboardVisible: true,
    overlayKeyboardStyle: {
      paddingBottom: keyboardHeight,
      justifyContent: 'flex-end',
    },
    modalKeyboardStyle: modalBodyStyle(modalHeight),
    onOverlayLayout,
  };
}
