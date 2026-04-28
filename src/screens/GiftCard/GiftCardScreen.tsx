import React from 'react';
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
import { NotificationListModal } from '@/components/NotificationListModal';
import { MainHeader } from '@/components/MainHeader';

export function GiftCardScreen({ navigation }: any): React.ReactNode {
  const giftCardsPresenter = useGiftCardsPresentor(navigation);
  const gameChannelsPresenter = useGameChannelsPresentor(navigation);

  function renderCategoryItem({ item }: { item: Category }) {
    return (
      <TouchableOpacity
        style={styles.channelItem}
        onPress={() => {
          giftCardsPresenter.navigateToProductList(item.id, item.name);
        }}
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
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <MainHeader 
        title="Gift Cards" 
        onMenuPress={() => navigation.openDrawer()} 
        presenter={gameChannelsPresenter} 
      />

      <NotificationListModal presenter={gameChannelsPresenter} />

      {/* Category List */}
      {giftCardsPresenter.categoriesIsLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : giftCardsPresenter.categoriesError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load categories.</Text>
          <TouchableOpacity
            onPress={() => giftCardsPresenter.categoriesRefetch()}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={giftCardsPresenter.categoriesData?.data || []}
          keyExtractor={item => item.id.toString()}
          renderItem={renderCategoryItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onRefresh={() => giftCardsPresenter.categoriesRefetch()}
          refreshing={giftCardsPresenter.categoriesIsLoading}
        />
      )}
    </SafeAreaView>
  );
}
