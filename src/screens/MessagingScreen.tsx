import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { TextInput, Avatar, Card, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../contexts/AuthContext";
import { useSocialData } from "../contexts/SocialDataContext";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList, Message, Chat, User } from "../types";

type MessagingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Messaging"
>;
type MessagingScreenRouteProp = RouteProp<RootStackParamList, "Messaging">;

interface Props {
  navigation: MessagingScreenNavigationProp;
  route: MessagingScreenRouteProp;
}

const MessagingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { chatId } = route.params || {};
  const [view, setView] = useState<"chats" | "messages">(
    chatId ? "messages" : "chats",
  );
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(
    chatId,
  );
  const [newMessage, setNewMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const flatListRef = useRef<FlatList>(null);
  const { user } = useAuth();
  const { messages, users, chats } = useSocialData();
  const { theme } = useTheme();
  const { success } = useToast();

  // Mock data for demonstration
  const mockChats: Chat[] = [
    {
      id: "1",
      type: "direct",
      participants: ["1", "2"],
      lastMessage: {
        id: "msg_1",
        senderId: "2",
        content: "Hey! How was your workout today?",
        timestamp: "2024-01-15T10:30:00Z",
        isRead: false,
        type: "text",
      },
      unreadCount: 2,
      isActive: true,
    },
    {
      id: "2",
      type: "group",
      participants: ["1", "3", "4", "5"],
      lastMessage: {
        id: "msg_2",
        senderId: "3",
        content: "Great session everyone! Same time tomorrow?",
        timestamp: "2024-01-15T09:15:00Z",
        isRead: true,
        type: "text",
      },
      unreadCount: 0,
      isActive: true,
      groupInfo: {
        name: "Morning Runners",
        avatar:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center",
        description: "Daily morning running group",
      },
    },
  ];

  const mockMessages: Message[] = [
    {
      id: "1",
      senderId: "2",
      receiverId: "1",
      content: "Hey! How was your workout today?",
      timestamp: "2024-01-15T10:30:00Z",
      isRead: false,
      type: "text",
    },
    {
      id: "2",
      senderId: "1",
      receiverId: "2",
      content: "It was amazing! Hit a new PR on bench press 💪",
      timestamp: "2024-01-15T10:32:00Z",
      isRead: true,
      type: "text",
    },
    {
      id: "3",
      senderId: "2",
      receiverId: "1",
      content: "That's awesome! What was your previous best?",
      timestamp: "2024-01-15T10:33:00Z",
      isRead: false,
      type: "text",
    },
  ];

  const currentChat = mockChats.find((chat) => chat.id === currentChatId);
  const chatMessages = currentChatId
    ? mockMessages.filter(
        (msg) =>
          (msg.senderId === user?.id || msg.receiverId === user?.id) &&
          (msg.senderId === currentChatId || msg.receiverId === currentChatId),
      )
    : [];

  const getOtherParticipant = (chat: Chat): User | undefined => {
    if (chat.type === "group") return undefined;
    const otherUserId = chat.participants.find((id) => id !== user?.id);
    return users.find((u) => u.id === otherUserId);
  };

  const sendMessage = async (): Promise<void> => {
    if (!newMessage.trim() || !currentChatId) return;

    try {
      // Simulate sending message
      success("Sent", "Message sent successfully");
      setNewMessage("");
      // In a real app, you would call an API here
    } catch (error) {
      Alert.alert("Error", "Failed to send message");
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const messageTime = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return messageTime.toLocaleDateString();
    }
  };

  const ChatItem: React.FC<{ chat: Chat }> = ({ chat }) => {
    const otherUser = getOtherParticipant(chat);
    const displayName =
      chat.type === "group"
        ? chat.groupInfo?.name
        : otherUser?.displayName || "Unknown";
    const displayAvatar =
      chat.type === "group" ? chat.groupInfo?.avatar : otherUser?.avatar;

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => {
          setCurrentChatId(chat.id);
          setView("messages");
        }}
      >
        <Avatar.Image size={50} source={{ uri: displayAvatar }} />
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text
              style={[
                styles.chatName,
                {
                  color: theme.colors.text,
                  fontWeight: chat.unreadCount > 0 ? "bold" : "normal",
                },
              ]}
              numberOfLines={1}
            >
              {displayName}
            </Text>
            <Text style={[styles.chatTime, { color: theme.colors.textMuted }]}>
              {formatTimestamp(chat.lastMessage.timestamp)}
            </Text>
          </View>
          <View style={styles.chatFooter}>
            <Text
              style={[
                styles.lastMessage,
                {
                  color: theme.colors.textMuted,
                  fontWeight: chat.unreadCount > 0 ? "bold" : "normal",
                },
              ]}
              numberOfLines={1}
            >
              {chat.lastMessage.content}
            </Text>
            {chat.unreadCount > 0 && (
              <View
                style={[
                  styles.unreadBadge,
                  { backgroundColor: theme.colors.accent },
                ]}
              >
                <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const MessageBubble: React.FC<{
    message: Message;
    isCurrentUser: boolean;
  }> = ({ message, isCurrentUser }) => (
    <View
      style={[
        styles.messageBubble,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
      ]}
    >
      <View
        style={[
          styles.messageContent,
          {
            backgroundColor: isCurrentUser
              ? theme.colors.accent
              : theme.colors.surface,
          },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            {
              color: isCurrentUser ? theme.colors.primary : theme.colors.text,
            },
          ]}
        >
          {message.content}
        </Text>
      </View>
      <Text
        style={[
          styles.messageTime,
          {
            color: theme.colors.textMuted,
            textAlign: isCurrentUser ? "right" : "left",
          },
        ]}
      >
        {formatTimestamp(message.timestamp)}
      </Text>
    </View>
  );

  if (view === "messages" && currentChatId) {
    const otherUser = getOtherParticipant(currentChat!);
    const displayName =
      currentChat?.type === "group"
        ? currentChat.groupInfo?.name
        : otherUser?.displayName || "Unknown";

    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Messages Header */}
        <View style={styles.messagesHeader}>
          <TouchableOpacity onPress={() => setView("chats")}>
            <Icon name="arrow-left" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerUserInfo}
            onPress={() => {
              if (currentChat?.type === "direct" && otherUser) {
                navigation.navigate("UserProfile", { userId: otherUser.id });
              }
            }}
          >
            <Avatar.Image
              size={35}
              source={{
                uri:
                  currentChat?.type === "group"
                    ? currentChat.groupInfo?.avatar
                    : otherUser?.avatar,
              }}
            />
            <Text style={[styles.headerUserName, { color: theme.colors.text }]}>
              {displayName}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="phone" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isCurrentUser={item.senderId === user?.id}
            />
          )}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Message Input */}
        <View style={styles.messageInputContainer}>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            style={[
              styles.messageInput,
              { backgroundColor: theme.colors.surface },
            ]}
            multiline
            right={
              <TextInput.Icon
                icon="send"
                onPress={sendMessage}
                disabled={!newMessage.trim()}
                iconColor={
                  newMessage.trim()
                    ? theme.colors.accent
                    : theme.colors.textMuted
                }
              />
            }
          />
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Chats Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Messages
        </Text>
        <TouchableOpacity>
          <Icon name="plus" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search conversations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[
            styles.searchInput,
            { backgroundColor: theme.colors.surface },
          ]}
          left={<TextInput.Icon icon="magnify" />}
        />
      </View>

      {/* Chats List */}
      <FlatList
        data={mockChats.filter((chat) => {
          if (!searchQuery) return true;
          const otherUser = getOtherParticipant(chat);
          const displayName =
            chat.type === "group"
              ? chat.groupInfo?.name
              : otherUser?.displayName || "";
          return displayName.toLowerCase().includes(searchQuery.toLowerCase());
        })}
        renderItem={({ item }) => <ChatItem chat={item} />}
        keyExtractor={(item) => item.id}
        style={styles.chatsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon
              name="message-outline"
              size={64}
              color={theme.colors.textMuted}
            />
            <Text
              style={[styles.emptyStateTitle, { color: theme.colors.text }]}
            >
              No conversations
            </Text>
            <Text
              style={[
                styles.emptyStateSubtitle,
                { color: theme.colors.textMuted },
              ]}
            >
              Start chatting with your fitness buddies!
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "MontserratAlternates-Bold",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    borderRadius: 25,
  },
  chatsList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontFamily: "MontserratAlternates-Medium",
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  unreadCount: {
    color: "white",
    fontSize: 10,
    fontFamily: "MontserratAlternates-Bold",
  },
  messagesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 16,
    gap: 8,
  },
  headerUserName: {
    fontSize: 16,
    fontFamily: "MontserratAlternates-Bold",
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageBubble: {
    marginBottom: 12,
    maxWidth: "80%",
  },
  currentUserBubble: {
    alignSelf: "flex-end",
  },
  otherUserBubble: {
    alignSelf: "flex-start",
  },
  messageContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    marginHorizontal: 16,
  },
  messageInputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  messageInput: {
    borderRadius: 25,
    maxHeight: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: "MontserratAlternates-Bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default MessagingScreen;
