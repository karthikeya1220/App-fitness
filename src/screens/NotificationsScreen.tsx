import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Avatar, Button, SegmentedButtons } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../contexts/ThemeContext";
import { useSocialData } from "../contexts/SocialDataContext";
import { useToast } from "../contexts/ToastContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, Notification } from "../types";

type NotificationsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Notifications"
>;

interface Props {
  navigation: NotificationsScreenNavigationProp;
}

const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { theme } = useTheme();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } =
    useSocialData();
  const { success } = useToast();

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
    success("Refreshed", "Notifications updated");
  };

  const handleMarkAllAsRead = (): void => {
    markAllNotificationsAsRead();
    success("Done", "All notifications marked as read");
  };

  const handleNotificationPress = (notification: Notification): void => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case "like":
      case "comment":
        if (notification.postId) {
          // Navigate to post detail (not implemented in this example)
        }
        break;
      case "follow":
        if (notification.actionUserId) {
          navigation.navigate("UserProfile", {
            userId: notification.actionUserId,
          });
        }
        break;
      case "group_invite":
      case "group_request":
        if (notification.groupId) {
          navigation.navigate("Group", { groupId: notification.groupId });
        }
        break;
      default:
        break;
    }
  };

  const getNotificationIcon = (type: Notification["type"]): string => {
    switch (type) {
      case "like":
        return "heart";
      case "comment":
        return "comment";
      case "follow":
        return "account-plus";
      case "group_invite":
        return "account-group";
      case "group_request":
        return "email";
      case "mention":
        return "at";
      case "achievement":
        return "trophy";
      case "workout_reminder":
        return "dumbbell";
      default:
        return "bell";
    }
  };

  const getNotificationColor = (type: Notification["type"]): string => {
    switch (type) {
      case "like":
        return "#E91E63";
      case "comment":
        return theme.colors.info;
      case "follow":
        return theme.colors.success;
      case "group_invite":
      case "group_request":
        return theme.colors.accent;
      case "mention":
        return theme.colors.secondary;
      case "achievement":
        return "#FFD700";
      case "workout_reminder":
        return theme.colors.warning;
      default:
        return theme.colors.text;
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - notificationTime.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - notificationTime.getTime()) / (1000 * 60),
      );
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const NotificationItem: React.FC<{ notification: Notification }> = ({
    notification,
  }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        {
          backgroundColor: notification.isRead
            ? theme.colors.surface
            : theme.colors.accent + "10",
        },
      ]}
      onPress={() => handleNotificationPress(notification)}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationLeft}>
          {notification.actionUserAvatar ? (
            <Avatar.Image
              size={40}
              source={{ uri: notification.actionUserAvatar }}
              style={styles.notificationAvatar}
            />
          ) : (
            <View
              style={[
                styles.notificationIconContainer,
                {
                  backgroundColor:
                    getNotificationColor(notification.type) + "20",
                },
              ]}
            >
              <Icon
                name={getNotificationIcon(notification.type)}
                size={20}
                color={getNotificationColor(notification.type)}
              />
            </View>
          )}
        </View>

        <View style={styles.notificationInfo}>
          <Text
            style={[
              styles.notificationTitle,
              {
                color: theme.colors.text,
                fontWeight: notification.isRead ? "normal" : "bold",
              },
            ]}
          >
            {notification.title}
          </Text>
          <Text
            style={[
              styles.notificationMessage,
              { color: theme.colors.textMuted },
            ]}
          >
            {notification.message}
          </Text>
          <Text
            style={[styles.notificationTime, { color: theme.colors.textMuted }]}
          >
            {formatTimestamp(notification.timestamp)}
          </Text>
        </View>

        <View style={styles.notificationRight}>
          {!notification.isRead && (
            <View
              style={[
                styles.unreadDot,
                { backgroundColor: theme.colors.accent },
              ]}
            />
          )}
          <TouchableOpacity style={styles.moreButton}>
            <Icon name="dots-vertical" size={16} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Notifications
        </Text>
        <TouchableOpacity onPress={handleMarkAllAsRead}>
          <Text style={[styles.markAllRead, { color: theme.colors.accent }]}>
            Mark all read
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter */}
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={filter}
          onValueChange={(value) => setFilter(value as "all" | "unread")}
          buttons={[
            {
              value: "all",
              label: "All",
              icon: "bell",
            },
            {
              value: "unread",
              label: "Unread",
              icon: "bell-badge",
            },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        keyExtractor={(item) => item.id}
        style={styles.notificationsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon
              name={filter === "unread" ? "bell-check" : "bell-outline"}
              size={64}
              color={theme.colors.textMuted}
            />
            <Text
              style={[styles.emptyStateTitle, { color: theme.colors.text }]}
            >
              {filter === "unread" ? "All caught up!" : "No notifications"}
            </Text>
            <Text
              style={[
                styles.emptyStateSubtitle,
                { color: theme.colors.textMuted },
              ]}
            >
              {filter === "unread"
                ? "You have no unread notifications"
                : "You'll see notifications here when you get them"}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
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
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "MontserratAlternates-Bold",
  },
  markAllRead: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Medium",
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  segmentedButtons: {
    backgroundColor: "transparent",
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  notificationLeft: {
    marginRight: 12,
  },
  notificationAvatar: {
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.1)",
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Medium",
    marginBottom: 4,
    lineHeight: 18,
  },
  notificationMessage: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 11,
  },
  notificationRight: {
    alignItems: "center",
    gap: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  moreButton: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: "MontserratAlternates-Bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default NotificationsScreen;
