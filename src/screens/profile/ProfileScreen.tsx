import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { useGetUserDataQuery } from '@/api/actions/user/userApi';
import { colors } from '@/theme/colors';
import { styles } from './ProfileScreen.styles';

export default function ProfileScreen() {
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useGetUserDataQuery(undefined, { refetchOnMountOrArgChange: true });
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const isLoading = isUserLoading;
  const error = userError;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !userData || !userData.user) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Failed to load profile</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userData.user.name
                ? userData.user.name.charAt(0).toUpperCase()
                : 'U'}
            </Text>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{userData.user.name}</Text>
            <Text style={styles.email}>
              {userData.user.email ?? 'No email'}
            </Text>
            {userData.user.type === 'buyer' && (
              <View style={styles.vipBadge}>
                <MaterialIcons name="star" size={16} color="#000" />
                <Text style={styles.vipText}>VIP MEMBER</Text>
              </View>
            )}
          </View>
        </View>

        {/* Contact Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialIcons name="call" size={24} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{userData.user.phone}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialIcons name="mail" size={24} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>
                  {userData.user.email ?? 'No email'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Balance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Balance</Text>

          <View style={styles.balanceCard}>
            <TouchableOpacity
              style={styles.balanceItem}
              onPress={() => navigation.navigate('CoinHistory')}
            >
              <View style={styles.coinIcon}>
                <MaterialIcons
                  name="monetization-on"
                  size={24}
                  color="#ffd700"
                />
              </View>
              <View>
                <Text style={styles.balanceLabel}>Coins</Text>
                <Text style={styles.balanceAmount}>
                  {userData.user.coins ?? 0}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.balanceItem}
              onPress={() => navigation.navigate('MoneyHistory')}
            >
              <View style={styles.currencyIcon}>
                <Text style={styles.currencyText}>K</Text>
              </View>
              <View>
                <Text style={styles.balanceLabel}>Myanmar Kyat (MMK)</Text>
                <Text style={styles.balanceAmount}>
                  {userData.user.money_balance
                    ? parseFloat(userData.user.money_balance).toLocaleString()
                    : 0}{' '}
                  MMK
                </Text>
                {userData.user.money_debt > 0 && (
                  <Text style={styles.debtText}>
                    Debt:{' '}
                    {parseFloat(
                      userData.user.money_debt.toString(),
                    ).toLocaleString()}{' '}
                    MMK
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <MaterialIcons
              name="credit-card"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.actionButtonText}>Add Funds</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <MaterialIcons name="settings" size={24} color={colors.primary} />
            <Text style={styles.actionButtonText}>Account Settings</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <MaterialIcons name="help" size={24} color={colors.primary} />
            <Text style={styles.actionButtonText}>Help & Support</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
