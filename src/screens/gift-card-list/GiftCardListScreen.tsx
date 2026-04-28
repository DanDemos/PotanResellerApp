import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { colors } from '@/global/theme/colors';
import { styles } from './GiftCardListScreen.styles';
import { useGiftCardListPresentor } from '@/features/gift-cards/GiftCardListPresentor';
import { GiftCard } from '@/api/actions/gift-card/giftCardAPIDataTypes';
import { getImageUrl } from '@/global/utils/imageUtils';

export function GiftCardListScreen({
  navigation,
  route,
}: any): React.ReactNode {
  const { categoryId, categoryName } = route.params;
  const presenter = useGiftCardListPresentor(navigation, categoryId);

  function renderGiftCardItem({ item }: { item: GiftCard }) {
    return (
      <TouchableOpacity
        style={styles.giftCardCard}
        onPress={() => presenter.navigateToGiftCardDetail(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          {item.image_path ? (
            <Image
              source={{ uri: getImageUrl(item.image_path) || '' }}
              style={styles.giftCardImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.center}>
              <MaterialIcons name="image" size={40} color={colors.muted} />
            </View>
          )}
        </View>
        <View style={styles.giftCardInfo}>
          <View style={styles.namePriceRow}>
            <Text style={styles.giftCardName} numberOfLines={2}>
              {item.name || 'Gift Card Name'}
            </Text>
            <View style={styles.priceContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.priceText}>
                  {item.price ? parseFloat(item.price).toLocaleString() : '0'}
                </Text>
                <Text style={styles.currencyText}>MMK</Text>
              </View>
            </View>
          </View>

          <View style={styles.buyButtonContainer}>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => presenter.handleBuy(item.id)}
              disabled={presenter.purchaseIsLoading}
            >
              {presenter.purchaseIsLoading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.buyButtonText}>Buy</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.header}>
        <TouchableOpacity onPress={presenter.goBack}>
          <MaterialIcons name="arrow-back" size={26} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName || 'Gift Cards'}</Text>
        <View style={styles.walletContainer}>
          <View style={styles.walletItem}>
            <Text style={styles.walletValue}>
              {presenter.balanceData
                ? parseFloat(
                    presenter.balanceData.money_balance,
                  ).toLocaleString()
                : '0'}
            </Text>
            <Text style={styles.walletLabel}>MMK</Text>
          </View>
          <View style={[styles.walletItem, { backgroundColor: '#fff7ed' }]}>
            <MaterialIcons
              name="monetization-on"
              size={14}
              color={colors.coinColor}
            />
            <Text style={[styles.walletValue, { marginLeft: 2 }]}>
              {presenter.coinsData?.coins ?? 0}
            </Text>
          </View>
        </View>
      </View>

      {presenter.giftCardsIsLoading && presenter.page === 1 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : presenter.giftCardsError ? (
        <View style={styles.center}>
          <MaterialIcons name="error-outline" size={60} color="#ef4444" />
          <Text style={styles.errorText}>
            {(presenter.giftCardsError as any)?.data?.message ||
              'Failed to load gift cards.'}
          </Text>
          <TouchableOpacity
            onPress={presenter.handleRefresh}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={presenter.giftCardsData?.data || []}
          keyExtractor={item => item.id.toString()}
          renderItem={renderGiftCardItem}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          onRefresh={presenter.handleRefresh}
          refreshing={presenter.giftCardsIsFetching && presenter.page === 1}
          onEndReached={presenter.handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            presenter.giftCardsIsFetching && presenter.page > 1 ? (
              <View style={styles.footer}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <MaterialIcons name="shopping-bag" size={80} color="#e2e8f0" />
              <Text style={styles.emptyText}>
                No gift cards found in this category.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
