import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from "react-native"
import { Ionicons } from "@react-native-vector-icons/ionicons"
import GameIcon1 from "../assets/game1.png"

const GAMES = [
  {
    id: "1",
    name: "Mobile Legends",
    icon: GameIcon1,
    image: "ML",
    unread: 3,
  },
  {
    id: "2",
    name: "League of Legends",
    icon: GameIcon1,
    image: "LOL",
    unread: 0,
  },
  {
    id: "3",
    name: "Genshin Impact",
    icon: GameIcon1,
    image: "GI",
    unread: 5,
  },
  {
    id: "4",
    name: "Coin2Us",
    icon: GameIcon1,
    image: "C2U",
    unread: 1,
  },
  {
    id: "5",
    name: "Identity V",
    icon: GameIcon1,
    image: "IDV",
    unread: 0,
  },
]

export default function GameChannelsScreen({ navigation }: any) {
  const renderGameChannel = ({ item }: any) => (
    <TouchableOpacity
      style={styles.gameChannel}
      onPress={() => navigation.navigate("Chat", { gameId: item.id, gameName: item.name })}
      activeOpacity={0.7}
    >
      <View style={styles.gameIconContainer}>
        <Text style={styles.gameIconText}>{item.image}</Text>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
      <View style={styles.gameInfo}>
        <Text style={styles.gameName}>{item.name}</Text>
        <Text style={styles.lastMessage}>Tap to chat...</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#ccc" />
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Game Channels</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={28} color="#00a6f4" />
        </TouchableOpacity>
      </View>

      {/* Games List */}
      <FlatList
        data={GAMES}
        keyExtractor={(item) => item.id}
        renderItem={renderGameChannel}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  listContent: {
    paddingVertical: 8,
  },
  gameChannel: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  gameIconContainer: {
    position: "relative",
    marginRight: 12,
  },
  gameIconText: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#00a6f4",
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    textAlignVertical: "center",
  },
  unreadBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ff4444",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  unreadText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  gameInfo: {
    flex: 1,
    marginLeft: 8,
  },
  gameName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: "#999",
  },
})
