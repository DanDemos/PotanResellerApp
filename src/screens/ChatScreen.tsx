"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native"
import { Ionicons } from "@react-native-vector-icons/ionicons"

const MOCK_MESSAGES = [
  {
    id: "1",
    sender: "You",
    message: "Hi, do you have any Mobile Legends diamonds in stock?",
    timestamp: "10:30 AM",
    isUser: true,
  },
  {
    id: "2",
    sender: "Support",
    message: "Yes! We have 56 diamonds for $0.89 and 112 diamonds for $1.77",
    timestamp: "10:31 AM",
    isUser: false,
  },
  {
    id: "3",
    sender: "You",
    message: "Great! I need 10 packages of 112 diamonds",
    timestamp: "10:32 AM",
    isUser: true,
  },
  {
    id: "4",
    sender: "Support",
    message: "Perfect! That will be $17.70. I will process that for you now.",
    timestamp: "10:33 AM",
    isUser: false,
  },
  {
    id: "5",
    sender: "You",
    message: "Awesome, thanks!",
    timestamp: "10:34 AM",
    isUser: true,
  },
]

export default function ChatScreen() {
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [inputText, setInputText] = useState("")
  const flatListRef = useRef<FlatList>(null)

  const handleSendMessage = () => {
    if (inputText.trim() === "") return

    const newMessage = {
      id: (messages.length + 1).toString(),
      sender: "You",
      message: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isUser: true,
    }

    setMessages([...messages, newMessage])
    setInputText("")
  }

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }, [messages])

  const renderMessage = ({ item }: any) => (
    <View style={[styles.messageContainer, item.isUser ? styles.userMessageContainer : styles.supportMessageContainer]}>
      <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.supportBubble]}>
        <Text style={[styles.messageText, item.isUser ? styles.userMessageText : styles.supportMessageText]}>
          {item.message}
        </Text>
      </View>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesContent}
          scrollEnabled={true}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              multiline
              // maxHeight={100}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage} activeOpacity={0.7}>
              <Ionicons name="send" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  flex: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  messageContainer: {
    marginVertical: 6,
    flexDirection: "column",
  },
  userMessageContainer: {
    alignItems: "flex-end",
  },
  supportMessageContainer: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: "#00a6f4",
  },
  supportBubble: {
    backgroundColor: "#e8e8e8",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: "#ffffff",
  },
  supportMessageText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    marginHorizontal: 8,
  },
  inputContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f0f0f0",
    borderRadius: 24,
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    paddingVertical: 10,
    paddingHorizontal: 4,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#00a6f4",
    justifyContent: "center",
    alignItems: "center",
  },
})
