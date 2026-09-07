import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { colors } from '@/global/theme/colors';
import { styles } from './GiftCardScreen.styles';
import { Category } from '@/api/actions/gift-card/giftCardAPIDataTypes';
import { useGiftCardsPresentor } from '@/features/gift-cards/GiftCardsPresentor';
import { getImageUrl } from '@/global/utils/imageUtils';
import { useGameChannelsPresentor } from '@/features/game-channels/GameChannelsPresentor';
import { MainHeader } from '@/components/MainHeader';

type GiftCardBodyProps = {
  categories: Category[];
  categoriesIsLoading: boolean;
  categoriesError: unknown;
  categoriesIsFetching: boolean;
  page: number;
  onRetry: () => void;
  onRefresh: () => void;
  onOpenCategory: (id: number, name: string) => void;
};

const GiftCardBody = memo(function GiftCardBody({
  categories,
  categoriesIsLoading,
  categoriesError,
  categoriesIsFetching,
  page,
  onRetry,
  onRefresh,
  onOpenCategory,
}: GiftCardBodyProps): React.ReactNode {
  const renderCategoryItem = useCallback(
    ({ item }: { item: Category }) => (
      <TouchableOpacity
        style={styles.channelItem}
        onPress={() => onOpenCategory(item.id, item.name)}
        activeOpacity={0.6}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            {item.image_path ? (
              <Image
                source={{ uri: getImageUrl(item.image_path) || '' }}
                style={{ width: '100%', height: '100%', borderRadius: 25 }}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.avatarText}>
                {item.name.substring(0, 2).toUpperCase()}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.channelContent}>
          <View style={styles.topRow}>
            <View style={styles.nameContainer}>
              <Text style={styles.channelName} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [onOpenCategory],
  );

  if (categoriesIsLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (categoriesError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load categories.</Text>
        <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={categories}
      keyExtractor={item => item.id.toString()}
      renderItem={renderCategoryItem}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      onRefresh={onRefresh}
      refreshing={categoriesIsFetching && page === 1}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <MaterialIcons name="card-giftcard" size={64} color={colors.muted} />
          <Text style={styles.emptyText}>There is no gift card.</Text>
        </View>
      }
    />
  );
});

export function GiftCardScreen({ navigation }: any): React.ReactNode {
  const giftCardsPresenter = useGiftCardsPresentor(navigation);
  const gameChannelsPresenter = useGameChannelsPresentor(navigation);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <MainHeader
        title="Gift Cards"
        onMenuPress={() => navigation.openDrawer()}
        presenter={gameChannelsPresenter}
      />

      <GiftCardBody
        categories={giftCardsPresenter.categoriesData?.data || []}
        categoriesIsLoading={giftCardsPresenter.categoriesIsLoading}
        categoriesError={giftCardsPresenter.categoriesError}
        categoriesIsFetching={giftCardsPresenter.categoriesIsFetching}
        page={giftCardsPresenter.page}
        onRetry={giftCardsPresenter.categoriesRefetch}
        onRefresh={giftCardsPresenter.handleMainRefresh}
        onOpenCategory={giftCardsPresenter.navigateToProductList}
      />
    </SafeAreaView>
  );
}
