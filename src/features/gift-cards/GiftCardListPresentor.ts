import { useState, useMemo, useCallback } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { useGiftCardListInteractor } from './GiftCardListInteractor';
import { useGiftCardListRouter } from './GiftCardListRouter';
import {
  GiftCard,
  KokosActivationError,
  PurchaseGiftCardResponse,
  RedeemKokosResponse,
} from '@/api/actions/gift-card/giftCardAPIDataTypes';

function isPubgCategory(giftCard: GiftCard): boolean {
  return giftCard.category?.name?.trim().toUpperCase() === 'PUBG';
}

function normalizeGiftCardCodes(
  skuCode: PurchaseGiftCardResponse['sku_code'],
): string[] {
  if (!skuCode) {
    return [];
  }

  if (Array.isArray(skuCode)) {
    return skuCode.map(code => String(code)).filter(code => code.trim().length > 0);
  }

  const singleCode = String(skuCode).trim();
  return singleCode ? [singleCode] : [];
}

function parseKokosMessage(rawMessage: string | undefined): string {
  if (!rawMessage) {
    return 'Something went wrong while topping up.';
  }

  try {
    const parsed = JSON.parse(rawMessage) as KokosActivationError;
    if (parsed.errorMessage) {
      return parsed.errorMessage;
    }
    if (parsed.errorCode) {
      return parsed.errorCode.replace(/_/g, ' ');
    }
  } catch {
    // message is a plain string
  }

  return rawMessage;
}

function getRedeemErrorMessage(
  payload: RedeemKokosResponse | { message?: string } | undefined,
): string {
  if (!payload) {
    return 'Something went wrong while topping up.';
  }

  const nestedMessage =
    'data' in payload && payload.data && typeof payload.data === 'object'
      ? payload.data.message
      : undefined;

  return parseKokosMessage(nestedMessage || payload.message);
}

function getRtkErrorData(err: unknown): RedeemKokosResponse | undefined {
  if (err && typeof err === 'object' && 'data' in err) {
    return (err as { data?: RedeemKokosResponse }).data;
  }
  return undefined;
}

export function useGiftCardListPresentor(navigation: any, categoryId: number) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);
  const [isPubgIdModalVisible, setIsPubgIdModalVisible] = useState(false);
  const [pubgId, setPubgId] = useState('');
  const [pendingPubgId, setPendingPubgId] = useState<string | null>(null);
  const [isGiftCardCodesModalVisible, setIsGiftCardCodesModalVisible] = useState(false);
  const [purchasedGiftCardCodes, setPurchasedGiftCardCodes] = useState<string[]>([]);

  const interactor = useGiftCardListInteractor(categoryId, page, perPage);
  const router = useGiftCardListRouter(navigation);

  const handleRefresh = useCallback(() => {
    setPage(1);
    interactor.giftCardsRefetch();
    interactor.balanceRefetch();
    interactor.coinsRefetch();
  }, [interactor]);

  const showBuyModal = useCallback((giftCard: GiftCard) => {
    setSelectedGiftCard(giftCard);
    setPurchaseQuantity(1);
    setIsBuyModalVisible(true);
  }, []);

  const openBuyModal = useCallback(
    (giftCard: GiftCard) => {
      const availableStock =
        giftCard.available_quantity ?? giftCard.quantity ?? 0;

      if (availableStock <= 0) {
        Toast.show({
          type: 'error',
          text1: 'Out of Stock',
          text2: 'This product is currently unavailable.',
        });
        return;
      }

      setPendingPubgId(null);
      setPubgId('');

      if (!isPubgCategory(giftCard)) {
        showBuyModal(giftCard);
        return;
      }

      Alert.alert(
        'Auto Top Up',
        'Would you like to auto top up to your PUBG account?',
        [
          {
            text: 'Yes',
            onPress: () => {
              setSelectedGiftCard(giftCard);
              setIsPubgIdModalVisible(true);
            },
          },
          {
            text: 'No',
            onPress: () => showBuyModal(giftCard),
          },
        ],
      );
    },
    [showBuyModal],
  );

  const closeBuyModal = useCallback(() => {
    setIsBuyModalVisible(false);
    setSelectedGiftCard(null);
    setPendingPubgId(null);
    setPubgId('');
  }, []);

  const closePubgIdModal = useCallback(() => {
    setIsPubgIdModalVisible(false);
    setPubgId('');
    setSelectedGiftCard(null);
    setPendingPubgId(null);
  }, []);

  const closeGiftCardCodesModal = useCallback(() => {
    setIsGiftCardCodesModalVisible(false);
    setPurchasedGiftCardCodes([]);
  }, []);

  const showGiftCardCodesModal = useCallback((codes: string[]) => {
    if (codes.length === 0) {
      return;
    }
    setPurchasedGiftCardCodes(codes);
    setIsGiftCardCodesModalVisible(true);
  }, []);

  const handlePubgIdSubmit = useCallback(() => {
    const trimmedPubgId = pubgId.trim();
    if (!trimmedPubgId) {
      Toast.show({
        type: 'error',
        text1: 'PUBG ID Required',
        text2: 'Please enter your PUBG ID to continue.',
      });
      return;
    }

    if (!selectedGiftCard) return;

    setPendingPubgId(trimmedPubgId);
    setIsPubgIdModalVisible(false);
    setPurchaseQuantity(1);
    setIsBuyModalVisible(true);
  }, [pubgId, selectedGiftCard]);

  const redeemGiftCard = useCallback(
    async (code: string, accountId: string) => {
      try {
        const redeemResult = await interactor
          .redeemKokos({
            pubg_id: accountId,
            gift_card_code: code,
          })
          .unwrap();

        if (redeemResult.success === false || redeemResult.error === true) {
          Toast.show({
            type: 'error',
            text1: 'Top Up Failed',
            text2: getRedeemErrorMessage(redeemResult),
          });
          return;
        }

        const successMessage = redeemResult.message
          ? parseKokosMessage(redeemResult.message)
          : 'Your PUBG account has been topped up.';

        Toast.show({
          type: 'success',
          text1: 'Top Up Successful',
          text2: successMessage,
        });
      } catch (err: unknown) {
        Toast.show({
          type: 'error',
          text1: 'Top Up Failed',
          text2: getRedeemErrorMessage(getRtkErrorData(err)),
        });
      }
    },
    [interactor],
  );

  const handleBuy = useCallback(async () => {
    if (!selectedGiftCard) return;
    try {
      const purchaseResult = await interactor
        .purchaseGiftCard({
          custom_product_id: selectedGiftCard.id,
          quantity: purchaseQuantity,
        })
        .unwrap();

      const accountIdForTopUp = pendingPubgId;
      const giftCardCodes = normalizeGiftCardCodes(purchaseResult.sku_code);

      interactor.balanceRefetch();
      interactor.coinsRefetch();
      closeBuyModal();

      showGiftCardCodesModal(giftCardCodes);

      if (accountIdForTopUp) {
        if (giftCardCodes.length === 0) {
          Toast.show({
            type: 'error',
            text1: 'Purchase Successful',
            text2: 'Purchase completed, but no gift card code was returned for top up.',
          });
          return;
        }

        for (const code of giftCardCodes) {
          await redeemGiftCard(code, accountIdForTopUp);
        }
        return;
      }

      if (giftCardCodes.length === 0) {
        Toast.show({
          type: 'success',
          text1: 'Purchase Successful',
          text2: 'Your order has been placed successfully.',
        });
      }
    } catch (err: unknown) {
      console.error('Purchase failed:', err);
      const errorMessage =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message
          : undefined;

      Toast.show({
        type: 'error',
        text1: 'Purchase Failed',
        text2: errorMessage || 'Something went wrong while purchasing.',
      });

      interactor.giftCardsRefetch();
      closeBuyModal();
    }
  }, [
    interactor,
    selectedGiftCard,
    purchaseQuantity,
    closeBuyModal,
    pendingPubgId,
    redeemGiftCard,
    showGiftCardCodesModal,
  ]);

  const handleLoadMore = useCallback(() => {
    if (
      !interactor.giftCardsIsFetching &&
      interactor.giftCardsData &&
      interactor.giftCardsData.last_page &&
      page < interactor.giftCardsData.last_page
    ) {
      setPage(prev => prev + 1);
    }
  }, [interactor, page]);

  return useMemo(
    () => ({
      ...interactor,
      ...router,
      page,
      handleRefresh,
      handleLoadMore,
      handleBuy,
      selectedGiftCard,
      purchaseQuantity,
      setPurchaseQuantity,
      isBuyModalVisible,
      openBuyModal,
      closeBuyModal,
      isPubgIdModalVisible,
      pubgId,
      setPubgId,
      handlePubgIdSubmit,
      closePubgIdModal,
      isGiftCardCodesModalVisible,
      purchasedGiftCardCodes,
      closeGiftCardCodesModal,
    }),
    [
      interactor,
      router,
      page,
      handleRefresh,
      handleLoadMore,
      handleBuy,
      selectedGiftCard,
      purchaseQuantity,
      isBuyModalVisible,
      openBuyModal,
      closeBuyModal,
      isPubgIdModalVisible,
      pubgId,
      handlePubgIdSubmit,
      closePubgIdModal,
      isGiftCardCodesModalVisible,
      purchasedGiftCardCodes,
      closeGiftCardCodesModal,
    ],
  );
}
