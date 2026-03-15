
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
import { styles } from './CustomProductHistoryScreen.styles';
import { useCustomProductHistoryPresentor } from '@/features/custom-products/CustomProductHistoryPresentor';
import { PurchaseHistoryItem } from '@/api/actions/custom-product/customProductAPIDataTypes';
import { getImageUrl } from '@/global/utils/imageUtils';

export function CustomProductHistoryScreen({ navigation }: any): React.ReactNode {
  const presenter = useCustomProductHistoryPresentor(navigation);

  function renderHistoryItem({ item }: { item: PurchaseHistoryItem }) {
    const product = item.custom_product;
    const status = item.status.toLowerCase();

    return (
      <View style={styles.historyCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: getImageUrl(product.image_path) || '' }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={1}>
              {product.name}
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.priceText}>
                {product.price ? parseFloat(product.price).toLocaleString() : '0'} MMK
              </Text>
              
              <View style={[
                styles.statusBadge,
                status === 'approved' ? styles.approvedBadge : 
                status === 'rejected' ? styles.rejectedBadge : styles.pendingBadge
              ]}>
                <Text style={[
                  styles.statusText,
                  status === 'approved' ? styles.approvedText : 
                  status === 'rejected' ? styles.rejectedText : styles.pendingText
                ]}>
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
            {(presenter.historyError as any)?.data?.message || 'Failed to load history.'}
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
