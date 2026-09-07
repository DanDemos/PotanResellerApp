import type { TextInputProps } from 'react-native';

type AmountImeAction = 'next' | 'go';

type AmountInputImeOptions = {
  action: AmountImeAction;
  onAction: () => void;
};

/**
 * IME props for amount fields. Always keeps the numeric keyboard.
 * Next/Go works on iOS; Android's numeric checkmark may still only dismiss
 * (platform IME limitation — do not swap to a text keyboard to work around it).
 */
export function getAmountInputImeProps({
  action,
  onAction,
}: AmountInputImeOptions): Pick<
  TextInputProps,
  | 'keyboardType'
  | 'returnKeyType'
  | 'blurOnSubmit'
  | 'submitBehavior'
  | 'onSubmitEditing'
> {
  const isNext = action === 'next';

  return {
    keyboardType: 'numeric',
    returnKeyType: action,
    blurOnSubmit: !isNext,
    submitBehavior: isNext ? 'submit' : 'blurAndSubmit',
    onSubmitEditing: onAction,
  };
}
