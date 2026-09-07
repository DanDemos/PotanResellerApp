import { useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Keyboard,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { colors } from '@/global/theme/colors';
import { styles } from './ChatScreen.styles';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  Message,
  MessageProduct,
} from '@/api/actions/gameChannel/gameChannelAPIDataTypes';
import Sound from 'react-native-sound';
import { useChatKeyboardPadding } from './useChatKeyboardPadding';

// Enable playback in silence mode
Sound.setCategory('Playback');

const soundAsset = Image.resolveAssetSource(
  require('../../assets/noti-sound.wav'),
);
const notiSound = new Sound(soundAsset.uri, '', error => {
  if (error) {
    console.log('failed to load the sound', error);
  }
});

// VIPER Imports
import { useChatInteractor } from '@/features/chat/ChatInteractor';
import { ChatRouter } from '@/features/chat/ChatRouter';
import {
  formatCoinAmount,
  isProductListPayload,
  useChatPresentor,
} from '@/features/chat/ChatPresentor';

export function ChatScreen(): React.ReactNode {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { channelUuid, regionId } = route.params || {};
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const keyboardPaddingStyle = useChatKeyboardPadding();

  // VIPER Initialization
  const interactor = useChatInteractor(channelUuid);
  const router = useMemo(() => new ChatRouter(navigation), [navigation]);
  const presenter = useChatPresentor(
    interactor,
    router,
    currentUserId,
    regionId,
  );

  const flatListRef = useRef<FlatList>(null);

  // View-specific UI side effect: Scroll to end on new messages
  useEffect(() => {
    if (presenter.messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [presenter.messages]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);
    });

    return () => {
      showSubscription.remove();
    };
  }, []);

  function renderProductList(
    products: MessageProduct[],
  ): React.ReactElement {
    return (
      <View style={styles.productListBubble}>
        <View style={styles.productListHeader}>
          <View style={styles.productListHeaderLeft}>
            <MaterialIcons
              name="receipt-long"
              size={18}
              color={colors.primary}
            />
            <Text style={styles.productListHeaderTitle}>Product list</Text>
          </View>
          <View style={styles.productListCountBadge}>
            <Text style={styles.productListCountText}>{products.length}</Text>
          </View>
        </View>

        {products.map((product, index) => {
          const label = index + 1;
          const isLast = index === products.length - 1;
          const coins = formatCoinAmount(product.cost_price);

          return (
            <View
              key={`${product.id}-${label}`}
              style={[styles.productRow, isLast && styles.productRowLast]}
            >
              <View style={styles.productLabelBadge}>
                <Text style={styles.productLabelText}>{label}</Text>
              </View>
              <View style={styles.productRowContent}>
                <Text style={styles.productNameText}>
                  {`(${label}) ${product.product_name}: `}
                  <Text style={styles.productPriceInline}>{coins} coins</Text>
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  function renderMessage({
    item,
  }: {
    item: Message;
  }): React.ReactElement {
    const isUser = item.kind === 'user';
    const productList =
      isProductListPayload(item.parsed_payload) &&
      item.parsed_payload.products.length > 0
        ? item.parsed_payload.products
        : null;

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.supportMessageContainer,
        ]}
      >
        {productList ? (
          renderProductList(productList)
        ) : (
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
        )}
        <Text style={styles.timestamp}>
          {new Date(item.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <Animated.View style={[styles.flex, keyboardPaddingStyle]}>
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
            style={[
              styles.sendButton,
              presenter.sendIsLoading && { opacity: 0.6 },
            ]}
            onPress={() => {
              notiSound.stop(() => {
                notiSound.play(success => {
                  if (!success) {
                    console.log(
                      'Sound playback failed due to audio decoding errors',
                    );
                  }
                });
              });
              presenter.handleSendMessage();
            }}
            activeOpacity={0.7}
            disabled={
              presenter.sendIsLoading || presenter.inputText.trim() === ''
            }
          >
            {presenter.sendIsLoading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <MaterialIcons name="send" size={20} color={colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
