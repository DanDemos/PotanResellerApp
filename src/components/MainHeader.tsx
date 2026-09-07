import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { colors } from '@/global/theme/colors';
import { styles as appStyles } from '@/App.styles';
import { styles } from './MainHeader.styles';
import { NotificationListModal } from './NotificationListModal';

type MainHeaderProps = {
  title: string;
  onMenuPress: () => void;
  presenter: any;
};

export function MainHeader({
  title,
  onMenuPress,
  presenter,
}: MainHeaderProps): React.ReactNode {
  // Local visibility so open/close doesn't re-render the screen FlatList.
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onMenuPress}>
        <MaterialIcons name="menu" size={26} color={colors.text} />
      </TouchableOpacity>
      <Text style={appStyles.headerTitle}>{title}</Text>
      <View style={appStyles.headerActions}>
        <TouchableOpacity
          onPress={() => setShowNotifications(true)}
          style={appStyles.iconButton}
        >
          <View>
            <MaterialIcons
              name="notifications"
              size={26}
              color={colors.primary}
            />
            {presenter.notiData && presenter.notiData.unread > 0 && (
              <View style={appStyles.notificationBadge}>
                <Text style={appStyles.badgeText}>
                  {presenter.notiData.unread > 99
                    ? '99+'
                    : presenter.notiData.unread}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={presenter.navigateToProfile}
          style={appStyles.iconButton}
        >
          <MaterialIcons name="person" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <NotificationListModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
        presenter={presenter}
      />
    </View>
  );
}
