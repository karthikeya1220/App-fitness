import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import {
  Card,
  Avatar,
  Button,
  Chip,
  SegmentedButtons,
  TextInput,
  Menu,
  Divider,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../contexts/AuthContext";
import { useSocialData } from "../contexts/SocialDataContext";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  RootStackParamList,
  Post,
  User,
  Group,
  ReportedContent,
  AdminAction,
} from "../types";

type AdminPanelScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AdminPanel"
>;

interface Props {
  navigation: AdminPanelScreenNavigationProp;
}

const AdminPanelScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<
    "posts" | "users" | "groups" | "reports"
  >("posts");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  const { user } = useAuth();
  const { posts, users, groups } = useSocialData();
  const { theme } = useTheme();
  const { success, error } = useToast();

  // Mock reported content for demonstration
  const mockReports: ReportedContent[] = [
    {
      id: "1",
      type: "post",
      targetId: "post_1",
      reportedBy: "user_2",
      reason: "Inappropriate content",
      description: "Contains offensive language",
      timestamp: "2024-01-15T10:00:00Z",
      status: "pending",
    },
    {
      id: "2",
      type: "user",
      targetId: "user_3",
      reportedBy: "user_4",
      reason: "Harassment",
      description: "Sending unwanted messages",
      timestamp: "2024-01-14T15:30:00Z",
      status: "reviewed",
      reviewedBy: "admin_1",
      reviewNote: "Warning issued to user",
    },
  ];

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
    success("Refreshed", "Admin data updated");
  };

  const handleAdminAction = (
    action: AdminAction["type"],
    targetId: string,
    targetType: AdminAction["targetType"],
    reason?: string,
  ): void => {
    Alert.alert(
      "Confirm Action",
      `Are you sure you want to ${action.replace("_", " ")} this ${targetType}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style:
            action.includes("remove") || action.includes("ban")
              ? "destructive"
              : "default",
          onPress: () => {
            // Simulate admin action
            success(
              "Action Completed",
              `${action.replace("_", " ")} successful`,
            );
            setMenuVisible(null);
          },
        },
      ],
    );
  };

  const AdminPostCard: React.FC<{ post: Post }> = ({ post }) => (
    <Card style={[styles.adminCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.adminCardHeader}>
          <View style={styles.adminCardInfo}>
            <Avatar.Image size={32} source={{ uri: post.userAvatar }} />
            <View style={styles.adminCardUserInfo}>
              <Text
                style={[styles.adminCardUsername, { color: theme.colors.text }]}
              >
                {post.username}
              </Text>
              <Text
                style={[
                  styles.adminCardTimestamp,
                  { color: theme.colors.textMuted },
                ]}
              >
                {new Date(post.timestamp).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <Menu
            visible={menuVisible === post.id}
            onDismiss={() => setMenuVisible(null)}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(post.id)}>
                <Icon
                  name="dots-vertical"
                  size={20}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            }
          >
            <Menu.Item
              leadingIcon="pin"
              onPress={() => handleAdminAction("pin_post", post.id, "post")}
              title="Pin Post"
            />
            <Menu.Item
              leadingIcon="eye-off"
              onPress={() => handleAdminAction("remove_post", post.id, "post")}
              title="Remove Post"
            />
            <Divider />
            <Menu.Item
              leadingIcon="account-cancel"
              onPress={() =>
                handleAdminAction("warn_user", post.userId, "user")
              }
              title="Warn User"
            />
          </Menu>
        </View>

        <Text style={[styles.adminCardContent, { color: theme.colors.text }]}>
          {post.content}
        </Text>

        <View style={styles.adminCardStats}>
          <Chip
            icon="heart"
            style={[
              styles.statChip,
              { backgroundColor: theme.colors.accent + "20" },
            ]}
            textStyle={{ color: theme.colors.accent }}
          >
            {post.likes} likes
          </Chip>
          <Chip
            icon="comment"
            style={[
              styles.statChip,
              { backgroundColor: theme.colors.secondary + "20" },
            ]}
            textStyle={{ color: theme.colors.secondary }}
          >
            {post.comments} comments
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  const AdminUserCard: React.FC<{ user: User }> = ({ user }) => (
    <Card style={[styles.adminCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.adminCardHeader}>
          <View style={styles.adminCardInfo}>
            <Avatar.Image size={40} source={{ uri: user.avatar }} />
            <View style={styles.adminCardUserInfo}>
              <Text
                style={[styles.adminCardUsername, { color: theme.colors.text }]}
              >
                {user.displayName}
              </Text>
              <Text
                style={[
                  styles.adminCardTimestamp,
                  { color: theme.colors.textMuted },
                ]}
              >
                @{user.username}
              </Text>
              <Text
                style={[
                  styles.adminCardTimestamp,
                  { color: theme.colors.textMuted },
                ]}
              >
                Joined {new Date(user.joinDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <Menu
            visible={menuVisible === user.id}
            onDismiss={() => setMenuVisible(null)}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(user.id)}>
                <Icon
                  name="dots-vertical"
                  size={20}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            }
          >
            <Menu.Item
              leadingIcon="message-alert"
              onPress={() => handleAdminAction("warn_user", user.id, "user")}
              title="Send Warning"
            />
            <Menu.Item
              leadingIcon="account-cancel"
              onPress={() => handleAdminAction("ban_user", user.id, "user")}
              title="Ban User"
            />
          </Menu>
        </View>

        <View style={styles.adminCardStats}>
          <Chip
            icon="post"
            style={[
              styles.statChip,
              { backgroundColor: theme.colors.accent + "20" },
            ]}
            textStyle={{ color: theme.colors.accent }}
          >
            {user.posts} posts
          </Chip>
          <Chip
            icon="account-group"
            style={[
              styles.statChip,
              { backgroundColor: theme.colors.secondary + "20" },
            ]}
            textStyle={{ color: theme.colors.secondary }}
          >
            {user.followers} followers
          </Chip>
          {user.isVerified && (
            <Chip
              icon="check-decagram"
              style={[
                styles.statChip,
                { backgroundColor: theme.colors.success + "20" },
              ]}
              textStyle={{ color: theme.colors.success }}
            >
              Verified
            </Chip>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  const AdminGroupCard: React.FC<{ group: Group }> = ({ group }) => (
    <Card style={[styles.adminCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.adminCardHeader}>
          <View style={styles.adminCardInfo}>
            <Avatar.Image size={40} source={{ uri: group.image }} />
            <View style={styles.adminCardUserInfo}>
              <Text
                style={[styles.adminCardUsername, { color: theme.colors.text }]}
              >
                {group.name}
              </Text>
              <Text
                style={[
                  styles.adminCardTimestamp,
                  { color: theme.colors.textMuted },
                ]}
              >
                {group.category} • {group.memberCount} members
              </Text>
              <Text
                style={[
                  styles.adminCardTimestamp,
                  { color: theme.colors.textMuted },
                ]}
              >
                Created {new Date(group.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <Menu
            visible={menuVisible === group.id}
            onDismiss={() => setMenuVisible(null)}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(group.id)}>
                <Icon
                  name="dots-vertical"
                  size={20}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            }
          >
            <Menu.Item
              leadingIcon="check"
              onPress={() =>
                handleAdminAction("approve_group", group.id, "group")
              }
              title="Approve Group"
            />
            <Menu.Item
              leadingIcon="delete"
              onPress={() =>
                handleAdminAction("remove_group", group.id, "group")
              }
              title="Remove Group"
            />
          </Menu>
        </View>

        <Text
          style={[styles.adminCardContent, { color: theme.colors.text }]}
          numberOfLines={2}
        >
          {group.description}
        </Text>

        <View style={styles.adminCardStats}>
          {group.isPrivate && (
            <Chip
              icon="lock"
              style={[
                styles.statChip,
                { backgroundColor: theme.colors.warning + "20" },
              ]}
              textStyle={{ color: theme.colors.warning }}
            >
              Private
            </Chip>
          )}
          <Chip
            icon="tag"
            style={[
              styles.statChip,
              { backgroundColor: theme.colors.accent + "20" },
            ]}
            textStyle={{ color: theme.colors.accent }}
          >
            {group.tags.length} tags
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  const ReportCard: React.FC<{ report: ReportedContent }> = ({ report }) => (
    <Card style={[styles.adminCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.reportHeader}>
          <View style={styles.reportInfo}>
            <Text style={[styles.reportType, { color: theme.colors.text }]}>
              {report.type.toUpperCase()} REPORT
            </Text>
            <Text
              style={[styles.reportReason, { color: theme.colors.textMuted }]}
            >
              {report.reason}
            </Text>
          </View>
          <Chip
            style={[
              styles.statusChip,
              {
                backgroundColor:
                  report.status === "pending"
                    ? theme.colors.warning + "20"
                    : report.status === "resolved"
                      ? theme.colors.success + "20"
                      : theme.colors.info + "20",
              },
            ]}
            textStyle={{
              color:
                report.status === "pending"
                  ? theme.colors.warning
                  : report.status === "resolved"
                    ? theme.colors.success
                    : theme.colors.info,
            }}
          >
            {report.status}
          </Chip>
        </View>

        <Text style={[styles.reportDescription, { color: theme.colors.text }]}>
          {report.description}
        </Text>

        <Text
          style={[styles.reportTimestamp, { color: theme.colors.textMuted }]}
        >
          Reported {new Date(report.timestamp).toLocaleDateString()}
        </Text>

        {report.status === "pending" && (
          <View style={styles.reportActions}>
            <Button
              mode="contained"
              onPress={() => success("Resolved", "Report marked as resolved")}
              style={[
                styles.reportActionButton,
                { backgroundColor: theme.colors.success },
              ]}
              labelStyle={{ color: "white" }}
            >
              Resolve
            </Button>
            <Button
              mode="outlined"
              onPress={() => success("Dismissed", "Report dismissed")}
              style={[
                styles.reportActionButton,
                { borderColor: theme.colors.textMuted },
              ]}
              labelStyle={{ color: theme.colors.textMuted }}
            >
              Dismiss
            </Button>
          </View>
        )}

        {report.reviewNote && (
          <View style={styles.reviewNote}>
            <Text
              style={[
                styles.reviewNoteTitle,
                { color: theme.colors.textMuted },
              ]}
            >
              Review Note:
            </Text>
            <Text style={[styles.reviewNoteText, { color: theme.colors.text }]}>
              {report.reviewNote}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderTabContent = (): React.ReactNode => {
    const filteredData = (() => {
      switch (activeTab) {
        case "posts":
          return posts.filter(
            (post) =>
              post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
              post.username.toLowerCase().includes(searchQuery.toLowerCase()),
          );
        case "users":
          return users.filter(
            (user) =>
              user.displayName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              user.username.toLowerCase().includes(searchQuery.toLowerCase()),
          );
        case "groups":
          return groups.filter(
            (group) =>
              group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              group.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
          );
        case "reports":
          return mockReports.filter(
            (report) =>
              report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
              report.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
          );
        default:
          return [];
      }
    })();

    const renderItem = ({ item }: { item: any }) => {
      switch (activeTab) {
        case "posts":
          return <AdminPostCard post={item} />;
        case "users":
          return <AdminUserCard user={item} />;
        case "groups":
          return <AdminGroupCard group={item} />;
        case "reports":
          return <ReportCard report={item} />;
        default:
          return null;
      }
    };

    return (
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon
              name={
                activeTab === "posts"
                  ? "post-outline"
                  : activeTab === "users"
                    ? "account-outline"
                    : activeTab === "groups"
                      ? "account-group-outline"
                      : "alert-outline"
              }
              size={64}
              color={theme.colors.textMuted}
            />
            <Text
              style={[styles.emptyStateTitle, { color: theme.colors.text }]}
            >
              No {activeTab} found
            </Text>
            <Text
              style={[
                styles.emptyStateSubtitle,
                { color: theme.colors.textMuted },
              ]}
            >
              {searchQuery
                ? "Try adjusting your search"
                : `No ${activeTab} to moderate`}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    );
  };

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
          Admin Panel
        </Text>
        <TouchableOpacity>
          <Icon name="shield-account" size={24} color={theme.colors.accent} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[
            styles.searchInput,
            { backgroundColor: theme.colors.surface },
          ]}
          left={<TextInput.Icon icon="magnify" />}
          right={
            searchQuery ? (
              <TextInput.Icon icon="close" onPress={() => setSearchQuery("")} />
            ) : undefined
          }
        />
      </View>

      {/* Tab Navigation */}
      <SegmentedButtons
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "posts" | "users" | "groups" | "reports")
        }
        buttons={[
          {
            value: "posts",
            label: "Posts",
            icon: "post",
          },
          {
            value: "users",
            label: "Users",
            icon: "account",
          },
          {
            value: "groups",
            label: "Groups",
            icon: "account-group",
          },
          {
            value: "reports",
            label: "Reports",
            icon: "alert",
          },
        ]}
        style={styles.segmentedButtons}
      />

      {/* Content */}
      <View style={styles.content}>{renderTabContent()}</View>
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
  segmentedButtons: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  adminCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  adminCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  adminCardInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  adminCardUserInfo: {
    marginLeft: 12,
    flex: 1,
  },
  adminCardUsername: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Bold",
    marginBottom: 2,
  },
  adminCardTimestamp: {
    fontSize: 11,
    marginBottom: 1,
  },
  adminCardContent: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  adminCardStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  statChip: {
    height: 24,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reportInfo: {
    flex: 1,
  },
  reportType: {
    fontSize: 12,
    fontFamily: "MontserratAlternates-Bold",
    marginBottom: 2,
  },
  reportReason: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Medium",
  },
  statusChip: {
    height: 24,
  },
  reportDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  reportTimestamp: {
    fontSize: 11,
    marginBottom: 12,
  },
  reportActions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  reportActionButton: {
    flex: 1,
    borderRadius: 20,
  },
  reviewNote: {
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 8,
    borderRadius: 8,
  },
  reviewNoteTitle: {
    fontSize: 11,
    fontFamily: "MontserratAlternates-Bold",
    marginBottom: 2,
  },
  reviewNoteText: {
    fontSize: 12,
    lineHeight: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
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

export default AdminPanelScreen;
