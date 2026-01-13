import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, TouchableOpacity } from "react-native"
import { Ionicons } from "@react-native-vector-icons/ionicons"

const USER_DATA = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+95 9 123 456 789",
  coins: 1250,
  mmk: 1875000,
}

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{USER_DATA.name}</Text>
            <Text style={styles.email}>{USER_DATA.email}</Text>
          </View>
        </View>

        {/* Contact Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="call" size={24} color="#00a6f4" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{USER_DATA.phone}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="mail" size={24} color="#00a6f4" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{USER_DATA.email}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Balance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Balance</Text>

          <View style={styles.balanceCard}>
            <View style={styles.balanceItem}>
              <View style={styles.coinIcon}>
                <Ionicons name="star" size={24} color="#ffd700" />
              </View>
              <View>
                <Text style={styles.balanceLabel}>Coins</Text>
                <Text style={styles.balanceAmount}>{USER_DATA.coins}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.balanceItem}>
              <View style={styles.currencyIcon}>
                <Text style={styles.currencyText}>K</Text>
              </View>
              <View>
                <Text style={styles.balanceLabel}>Myanmar Kyat (MMK)</Text>
                <Text style={styles.balanceAmount}>{USER_DATA.mmk.toLocaleString()} MMK</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="card" size={24} color="#00a6f4" />
            <Text style={styles.actionButtonText}>Add Funds</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="settings" size={24} color="#00a6f4" />
            <Text style={styles.actionButtonText}>Account Settings</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="help-circle" size={24} color="#00a6f4" />
            <Text style={styles.actionButtonText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingVertical: 12,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#00a6f4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  balanceCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: "#00a6f4",
  },
  balanceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  coinIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff9e6",
    justifyContent: "center",
    alignItems: "center",
  },
  currencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e6f3ff",
    justifyContent: "center",
    alignItems: "center",
  },
  currencyText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#00a6f4",
  },
  balanceLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 8,
    gap: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 14,
    backgroundColor: "#ff4444",
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
})
