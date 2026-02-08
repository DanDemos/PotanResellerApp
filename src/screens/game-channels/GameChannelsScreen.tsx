import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ImageSourcePropType,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import GameIcon1 from '@/assets/game1.png';
import { colors } from '@/theme/colors';
import { styles } from './GameChannelsScreen.styles';
import { useGetChannelsQuery } from '@/api/actions/gameChannel/gameChannelApi';
import { Channel } from '@/api/actions/gameChannel/gameChannelAPIDataTypes';

export function GameChannelsScreen({ navigation }: any): React.ReactNode {
  const {
    data: channelsData,
    isLoading: channelsIsLoading,
    error: channelsError,
    refetch: channelsRefetch,
  } = useGetChannelsQuery(undefined);

  function renderChannelItem({ item }: { item: Channel }) {
    return (
      <TouchableOpacity
        style={styles.channelItem}
        onPress={() =>
          navigation.navigate('Chat', {
            channelUuid: item.uuid,
            gameName: item.game.name,
          })
        }
        activeOpacity={0.6}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.game.name.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.channelContent}>
          {/* Top Row: Name and Time */}
          <View style={styles.topRow}>
            <View style={styles.nameContainer}>
              <Text style={styles.channelName} numberOfLines={1}>
                {item.game.name}
              </Text>
            </View>

            <View style={styles.metaContainer}>
              {item.isPinned && (
                <MaterialIcons
                  name="push-pin"
                  size={12}
                  color={colors.icon}
                  style={styles.pinIcon}
                />
              )}
              <Text style={styles.timeText}>
                {item.last_message
                  ? new Date(item.last_message.created_at).toLocaleTimeString(
                      [],
                      { hour: '2-digit', minute: '2-digit' },
                    )
                  : ''}
              </Text>
            </View>
          </View>

          {/* Bottom Row: Last Message and Badge */}
          <View style={styles.bottomRow}>
            <Text style={styles.messageText} numberOfLines={2}>
              {item.last_message?.body || 'No messages yet'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <MaterialIcons name="menu" size={26} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Game List</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <MaterialIcons name="person" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Channel List */}
      {channelsIsLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : channelsError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {(channelsError as any)?.data?.message ||
              (channelsError as any)?.message ||
              'Failed to load channels.'}
          </Text>
          <TouchableOpacity
            onPress={() => channelsRefetch()}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={channelsData?.data || []}
          keyExtractor={item => item.id.toString()}
          renderItem={renderChannelItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onRefresh={channelsRefetch}
          refreshing={channelsIsLoading}
        />
      )}
    </SafeAreaView>
  );
}
