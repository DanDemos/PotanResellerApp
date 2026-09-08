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
import { GiftCardCodesProductInfo } from '@/screens/gift-card-list/modals/GiftCardCodesModal';

function isPubgCategory(giftCard: GiftCard): boolean {
  return giftCard.category?.name?.trim().toUpperCase() === 'PUBG';
}

function normalizeGiftCardCodes(
  purchaseResult: PurchaseGiftCardResponse,
): string[] {
  if (Array.isArray(purchaseResult.sku_codes) && purchaseResult.sku_codes.length > 0) {
    return purchaseResult.sku_codes
      .map(code => String(code).trim())
      .filter(code => code.length > 0);
  }

  if (Array.isArray(purchaseResult.purchases)) {
    return purchaseResult.purchases
      .map(purchase => purchase.sku?.code?.trim() ?? '')
      .filter(code => code.length > 0);
  }

  return [];
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
    if (typeof parsed.error === 'string' && parsed.error.trim().length > 0) {
      return parsed.error.trim();
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

function getRtkErrorStatus(err: unknown): number | undefined {
  if (err && typeof err === 'object' && 'status' in err) {
    const status = (err as { status?: unknown }).status;
    return typeof status === 'number' ? status : undefined;
  }
  return undefined;
}

function getRedeemErrorToast(
  errOrPayload: unknown,
): { text1: string; text2: string } {
  const data =
    getRtkErrorData(errOrPayload) ??
    (errOrPayload && typeof errOrPayload === 'object' && 'success' in errOrPayload
      ? (errOrPayload as RedeemKokosResponse)
      : undefined);
  const status = getRtkErrorStatus(errOrPayload) ?? data?.data?.status;
  const text2 = getRedeemErrorMessage(data);

  if (status === 402) {
    return {
      text1: 'Auto Redeem Unavailable',
      text2: 'Service subscription expired. Please contact admin.',
    };
  }

  return {
    text1: 'Auto Redeem Failed',
    text2,
  };
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
  const [giftCardCodesProductInfo, setGiftCardCodesProductInfo] =
    useState<GiftCardCodesProductInfo | null>(null);
  const [pendingCodesProductInfo, setPendingCodesProductInfo] =
    useState<GiftCardCodesProductInfo | null>(null);
  const [isTopUpErrorModalVisible, setIsTopUpErrorModalVisible] = useState(false);
  const [topUpErrorTitle, setTopUpErrorTitle] = useState('Auto Redeem Failed');
  const [topUpErrorMessage, setTopUpErrorMessage] = useState('');
  const [pendingCodesAfterError, setPendingCodesAfterError] = useState<string[]>([]);

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
        'Auto Redeem',
        'Would you like to auto redeem to your PUBG account?',
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
    setGiftCardCodesProductInfo(null);
  }, []);

  const showGiftCardCodesModal = useCallback(
    (codes: string[], productInfo?: GiftCardCodesProductInfo | null) => {
      if (codes.length === 0) {
        return;
      }
      setPurchasedGiftCardCodes(codes);
      setGiftCardCodesProductInfo(productInfo ?? null);
      setIsGiftCardCodesModalVisible(true);
    },
    [],
  );

  const showTopUpErrorModal = useCallback(
    (
      title: string,
      message: string,
      codes: string[],
      productInfo?: GiftCardCodesProductInfo | null,
    ) => {
      setTopUpErrorTitle(title);
      setTopUpErrorMessage(message);
      setPendingCodesAfterError(codes);
      setPendingCodesProductInfo(productInfo ?? null);
      setIsTopUpErrorModalVisible(true);
    },
    [],
  );

  const handleTopUpErrorViewCodes = useCallback(() => {
    const codes = pendingCodesAfterError;
    const productInfo = pendingCodesProductInfo;
    setIsTopUpErrorModalVisible(false);
    setTopUpErrorTitle('Auto Redeem Failed');
    setTopUpErrorMessage('');
    setPendingCodesAfterError([]);
    setPendingCodesProductInfo(null);
    showGiftCardCodesModal(codes, productInfo);
  }, [pendingCodesAfterError, pendingCodesProductInfo, showGiftCardCodesModal]);

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
    async (
      code: string,
      accountId: string,
    ): Promise<{ ok: true } | { ok: false; text1: string; text2: string }> => {
      try {
        const redeemResult = await interactor
          .redeemKokos({
            pubg_id: accountId,
            gift_card_code: code,
          })
          .unwrap();

        if (redeemResult.success === false || redeemResult.error === true) {
          const toast = getRedeemErrorToast(redeemResult);
          return { ok: false, text1: toast.text1, text2: toast.text2 };
        }

        const successMessage = redeemResult.message
          ? parseKokosMessage(redeemResult.message)
          : 'Your PUBG account has been topped up.';

        Toast.show({
          type: 'success',
          text1: 'Auto Redeem Successful',
          text2: successMessage,
        });
        return { ok: true };
      } catch (err: unknown) {
        const toast = getRedeemErrorToast(err);
        return { ok: false, text1: toast.text1, text2: toast.text2 };
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
      const giftCardCodes = normalizeGiftCardCodes(purchaseResult);
      const productInfo: GiftCardCodesProductInfo = {
        productName: selectedGiftCard.name,
        categoryName: selectedGiftCard.category?.name,
      };

      interactor.balanceRefetch();
      interactor.coinsRefetch();
      closeBuyModal();

      if (accountIdForTopUp) {
        if (giftCardCodes.length === 0) {
          Toast.show({
            type: 'error',
            text1: 'Purchase Successful',
            text2: 'Purchase completed, but no gift card code was returned for auto redeem.',
          });
          return;
        }

        let lastError: { text1: string; text2: string } | null = null;
        for (const code of giftCardCodes) {
          const redeemResult = await redeemGiftCard(code, accountIdForTopUp);
          if (!redeemResult.ok) {
            lastError = {
              text1: redeemResult.text1,
              text2: redeemResult.text2,
            };
          }
        }

        if (lastError) {
          Toast.show({
            type: 'error',
            text1: lastError.text1,
            text2: lastError.text2,
          });
          showTopUpErrorModal(
            lastError.text1,
            lastError.text2,
            giftCardCodes,
            productInfo,
          );
        }
        return;
      }

      showGiftCardCodesModal(giftCardCodes, productInfo);

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
    showTopUpErrorModal,
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
      giftCardCodesProductInfo,
      closeGiftCardCodesModal,
      isTopUpErrorModalVisible,
      topUpErrorTitle,
      topUpErrorMessage,
      handleTopUpErrorViewCodes,
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
      giftCardCodesProductInfo,
      closeGiftCardCodesModal,
      isTopUpErrorModalVisible,
      topUpErrorTitle,
      topUpErrorMessage,
      handleTopUpErrorViewCodes,
    ],
  );
}
