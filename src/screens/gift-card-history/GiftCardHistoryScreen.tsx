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
import { styles } from './GiftCardHistoryScreen.styles';
import { useGiftCardHistoryPresentor } from '@/features/gift-cards/GiftCardHistoryPresentor';
import { PurchaseHistoryItem } from '@/api/actions/gift-card/giftCardAPIDataTypes';
import { getImageUrl } from '@/global/utils/imageUtils';

export function GiftCardHistoryScreen({ navigation }: any): React.ReactNode {
  const presenter = useGiftCardHistoryPresentor(navigation);

  function renderHistoryItem({ item }: { item: PurchaseHistoryItem }) {
    const customProduct = item?.custom_product;
    const status = item.status.toLowerCase();

    console.log(item, 'itemitem');
    return (
      <View style={styles.historyCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: getImageUrl(customProduct?.image_path) || '' }}
            style={styles.giftCardImage}
            resizeMode="cover"
          />
          <View style={styles.giftCardInfo}>
            <Text style={styles.giftCardName} numberOfLines={1}>
              {customProduct?.name}
            </Text>
            <Text style={styles.dateText}>
              {new Date(item.created_at).toLocaleDateString([], {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={styles.priceText}>
                {customProduct?.price
                  ? parseFloat(customProduct.price.toString()).toLocaleString()
                  : '0'}{' '}
                MMK
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  status === 'approved'
                    ? styles.approvedBadge
                    : status === 'rejected'
                    ? styles.rejectedBadge
                    : styles.pendingBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    status === 'approved'
                      ? styles.approvedText
                      : status === 'rejected'
                      ? styles.rejectedText
                      : styles.pendingText,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {status === 'rejected' && item.reject_reason && (
          <View style={styles.rejectReasonContainer}>
            <Text style={styles.rejectReasonText}>
              Reason: {item.reject_reason}
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.header}>
        <TouchableOpacity onPress={presenter.goBack}>
          <MaterialIcons name="arrow-back" size={26} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Purchase History</Text>
      </View>

      {presenter.historyIsLoading && presenter.page === 1 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : presenter.historyError ? (
        <View style={styles.center}>
          <MaterialIcons name="error-outline" size={60} color="#ef4444" />
          <Text style={styles.errorText}>
            {(presenter.historyError as any)?.data?.message ||
              'Failed to load history.'}
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
          data={presenter.historyData?.data || []}
          keyExtractor={item => item.id.toString()}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.listContent}
          onRefresh={presenter.handleRefresh}
          refreshing={presenter.historyIsFetching && presenter.page === 1}
          onEndReached={presenter.handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            presenter.historyIsFetching && presenter.page > 1 ? (
              <View style={styles.footer}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <MaterialIcons name="history" size={80} color="#e2e8f0" />
              <Text style={styles.emptyText}>No purchase history found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
