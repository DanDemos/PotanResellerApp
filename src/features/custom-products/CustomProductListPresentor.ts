
import { useState, useMemo, useCallback } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { useCustomProductListInteractor } from './CustomProductListInteractor';
import { useCustomProductListRouter } from './CustomProductListRouter';

export function useCustomProductListPresentor(navigation: any, categoryId: number) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const interactor = useCustomProductListInteractor(categoryId, page, perPage);
  const router = useCustomProductListRouter(navigation);

  const handleRefresh = useCallback(() => {
    setPage(1);
    interactor.productsRefetch();
    interactor.balanceRefetch();
    interactor.coinsRefetch();
  }, [interactor]);

  const handleBuy = useCallback(async (productId: number) => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.didCancel || !result.assets || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      const formData = new FormData();
      formData.append('custom_product_id', productId.toString());
      formData.append('image', {
        uri: asset.uri,
        type: asset.type,
        name: asset.fileName || `product_${productId}.jpg`,
      } as any);

      await interactor.purchaseProduct(formData as any).unwrap();
      
      Toast.show({
        type: 'success',
        text1: 'Purchase Successful',
        text2: 'Your order has been placed successfully.',
      });
      
      // Optionally refetch balance after purchase
      interactor.balanceRefetch();
      interactor.coinsRefetch();

    } catch (err: any) {
      console.error('Purchase failed:', err);
      Toast.show({
        type: 'error',
        text1: 'Purchase Failed',
        text2: err?.data?.message || 'Something went wrong while purchasing.',
      });
    }
  }, [interactor]);

  const handleLoadMore = useCallback(() => {
    if (
      !interactor.productsIsFetching &&
      interactor.productsData &&
      interactor.productsData.last_page &&
      page < interactor.productsData.last_page
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
    }),
    [interactor, router, page, handleRefresh, handleLoadMore, handleBuy],
  );
}
