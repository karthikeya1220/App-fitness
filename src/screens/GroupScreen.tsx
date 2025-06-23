import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import {
  Card,
  Avatar,
  Button,
  FAB,
  Chip,
  SegmentedButtons,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../contexts/ThemeContext";
import { useSocialData } from "../contexts/SocialDataContext";
import { useToast } from "../contexts/ToastContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList, Group, Post, User } from "../types";

type GroupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Group"
>;
type GroupScreenRouteProp = RouteProp<RootStackParamList, "Group">;

interface Props {
  navigation: GroupScreenNavigationProp;
  route: GroupScreenRouteProp;
}

const GroupScreen: React.FC<Props> = ({ navigation, route }) => {
  const { groupId } = route.params;
  const [activeTab, setActiveTab] = useState<string>("feed");
  const [isJoined, setIsJoined] = useState<boolean>(false);

  const { theme } = useTheme();
  const { groups, posts, users, likePost, sharePost, joinGroup } =
    useSocialData();
  const { success } = useToast();

  const group = groups.find((g) => g.id === groupId);
  const groupPosts = posts.filter((p) => p.groupId === groupId);
  const groupMembers = users.slice(0, 20); // Mock group members

  const handleJoinGroup = (): void => {
    setIsJoined(!isJoined);
    if (!isJoined) {
      joinGroup(groupId, "1");
      success("Joined", `You joined ${group?.name}!`);
    } else {
      success("Left", `You left ${group?.name}`);
    }
  };

  const handleLikePost = (postId: string): void => {
    likePost(postId);
  };

  const handleSharePost = (postId: string): void => {
    sharePost(postId);
    success("Shared", "Post shared successfully");
  };

  if (!group) {
    return (
      <View style={styles.errorContainer}>
        <Text>Group not found</Text>
      </View>
    );
  }

  const PostCard: React.FC<{ post: Post }> = ({ post }) => (
    <Card style={[styles.postCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.postHeader}>
          <Avatar.Image size={40} source={{ uri: post.userAvatar }} />
          <View style={styles.postUserInfo}>
            <Text style={[styles.postUsername, { color: theme.colors.text }]}>
              {post.username}
            </Text>
            <Text
              style={[styles.postTimestamp, { color: theme.colors.textMuted }]}
            >
              {new Date(post.timestamp).toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity>
            <Icon name="dots-vertical" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.postContent, { color: theme.colors.text }]}>
          {post.content}
        </Text>

        {post.images && post.images.length > 0 && (
          <Image source={{ uri: post.images[0] }} style={styles.postImage} />
        )}

        <View style={styles.postActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLikePost(post.id)}
          >
            <Icon
              name={post.isLiked ? "heart" : "heart-outline"}
              size={20}
              color={post.isLiked ? "#E91E63" : theme.colors.text}
            />
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              {post.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="comment-outline" size={20} color={theme.colors.text} />
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              {post.comments}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSharePost(post.id)}
          >
            <Icon name="share-outline" size={20} color={theme.colors.text} />
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              {post.shares}
            </Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  const MemberCard: React.FC<{ user: User }> = ({ user }) => (
    <TouchableOpacity
      style={styles.memberCard}
      onPress={() => navigation.navigate("UserProfile", { userId: user.id })}
    >
      <Avatar.Image size={50} source={{ uri: user.avatar }} />
      <Text
        style={[styles.memberName, { color: theme.colors.text }]}
        numberOfLines={1}
      >
        {user.displayName}
      </Text>
      <Text
        style={[styles.memberUsername, { color: theme.colors.textMuted }]}
        numberOfLines={1}
      >
        @{user.username}
      </Text>
    </TouchableOpacity>
  );

  const renderTabContent = (): React.ReactNode => {
    switch (activeTab) {
      case "feed":
        return (
          <FlatList
            data={groupPosts}
            renderItem={({ item }) => <PostCard post={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Icon
                  name="post-outline"
                  size={64}
                  color={theme.colors.textMuted}
                />
                <Text
                  style={[styles.emptyStateTitle, { color: theme.colors.text }]}
                >
                  No posts yet
                </Text>
                <Text
                  style={[
                    styles.emptyStateSubtitle,
                    { color: theme.colors.textMuted },
                  ]}
                >
                  Be the first to share something!
                </Text>
              </View>
            }
          />
        );

      case "members":
        return (
          <View>
            <View style={styles.membersHeader}>
              <Text style={[styles.membersCount, { color: theme.colors.text }]}>
                {group.memberCount} members
              </Text>
              <TouchableOpacity>
                <Icon name="magnify" size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={groupMembers}
              renderItem={({ item }) => <MemberCard user={item} />}
              keyExtractor={(item) => item.id}
              numColumns={3}
              columnWrapperStyle={styles.membersRow}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );

      case "info":
        return (
          <ScrollView style={styles.infoContent}>
            <Card
              style={[
                styles.infoCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Card.Content>
                <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
                  About
                </Text>
                <Text
                  style={[
                    styles.infoDescription,
                    { color: theme.colors.textMuted },
                  ]}
                >
                  {group.description}
                </Text>
              </Card.Content>
            </Card>

            <Card
              style={[
                styles.infoCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Card.Content>
                <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
                  Tags
                </Text>
                <View style={styles.tagsContainer}>
                  {group.tags.map((tag) => (
                    <Chip
                      key={tag}
                      style={[
                        styles.tag,
                        { backgroundColor: theme.colors.accent + "20" },
                      ]}
                      textStyle={[
                        styles.tagText,
                        { color: theme.colors.accent },
                      ]}
                    >
                      {tag}
                    </Chip>
                  ))}
                </View>
              </Card.Content>
            </Card>

            <Card
              style={[
                styles.infoCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Card.Content>
                <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
                  Rules
                </Text>
                {group.rules?.map((rule, index) => (
                  <View key={index} style={styles.ruleItem}>
                    <Text
                      style={[
                        styles.ruleNumber,
                        { color: theme.colors.accent },
                      ]}
                    >
                      {index + 1}.
                    </Text>
                    <Text
                      style={[styles.ruleText, { color: theme.colors.text }]}
                    >
                      {rule}
                    </Text>
                  </View>
                )) || (
                  <Text
                    style={[
                      styles.noRulesText,
                      { color: theme.colors.textMuted },
                    ]}
                  >
                    No specific rules set for this group.
                  </Text>
                )}
              </Card.Content>
            </Card>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.background]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="dots-vertical" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.groupHeader}>
          <Avatar.Image
            size={80}
            source={{ uri: group.image }}
            style={styles.groupImage}
          />
          <View style={styles.groupInfo}>
            <View style={styles.groupTitleRow}>
              <Text style={[styles.groupName, { color: theme.colors.text }]}>
                {group.name}
              </Text>
              {group.isPrivate && (
                <Icon name="lock" size={16} color={theme.colors.textMuted} />
              )}
            </View>
            <Text
              style={[styles.groupCategory, { color: theme.colors.textMuted }]}
            >
              {group.category} • {group.memberCount} members
            </Text>
            <Text
              style={[
                styles.groupDescription,
                { color: theme.colors.textMuted },
              ]}
              numberOfLines={2}
            >
              {group.description}
            </Text>
          </View>
        </View>

        <View style={styles.groupActions}>
          <Button
            mode={isJoined ? "outlined" : "contained"}
            onPress={handleJoinGroup}
            style={[
              styles.joinButton,
              {
                backgroundColor: isJoined ? "transparent" : theme.colors.accent,
                borderColor: theme.colors.accent,
              },
            ]}
            labelStyle={{
              color: isJoined ? theme.colors.accent : theme.colors.primary,
            }}
          >
            {isJoined ? "Joined" : group.isPrivate ? "Request" : "Join"}
          </Button>
          <Button
            mode="outlined"
            onPress={() =>
              navigation.navigate("Messaging", { chatId: group.id })
            }
            style={[styles.chatButton, { borderColor: theme.colors.accent }]}
            labelStyle={{ color: theme.colors.accent }}
          >
            Chat
          </Button>
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <SegmentedButtons
        value={activeTab}
        onValueChange={setActiveTab}
        buttons={[
          {
            value: "feed",
            label: "Feed",
            icon: "post-outline",
          },
          {
            value: "members",
            label: "Members",
            icon: "account-group",
          },
          {
            value: "info",
            label: "Info",
            icon: "information",
          },
        ]}
        style={styles.segmentedButtons}
      />

      {/* Content */}
      <View style={styles.content}>{renderTabContent()}</View>

      {/* Floating Action Button */}
      {isJoined && (
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.accent }]}
          onPress={() =>
            navigation.navigate("CreatePost", { groupId: group.id })
          }
          color={theme.colors.primary}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  groupHeader: {
    flexDirection: "row",
    marginBottom: 20,
  },
  groupImage: {
    marginRight: 16,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  groupInfo: {
    flex: 1,
  },
  groupTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  groupName: {
    fontSize: 20,
    fontFamily: "MontserratAlternates-Bold",
    flex: 1,
  },
  groupCategory: {
    fontSize: 14,
    marginBottom: 8,
  },
  groupDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  groupActions: {
    flexDirection: "row",
    gap: 12,
  },
  joinButton: {
    flex: 2,
    borderRadius: 20,
    borderWidth: 1,
  },
  chatButton: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
  },
  segmentedButtons: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  postCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  postUserInfo: {
    flex: 1,
    marginLeft: 12,
  },
  postUsername: {
    fontSize: 16,
    fontFamily: "MontserratAlternates-Bold",
  },
  postTimestamp: {
    fontSize: 12,
    marginTop: 2,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 12,
  },
  membersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  membersCount: {
    fontSize: 18,
    fontFamily: "MontserratAlternates-Bold",
  },
  membersRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  memberCard: {
    width: "30%",
    alignItems: "center",
    padding: 12,
  },
  memberName: {
    fontSize: 12,
    fontFamily: "MontserratAlternates-Medium",
    marginTop: 8,
    textAlign: "center",
  },
  memberUsername: {
    fontSize: 10,
    marginTop: 2,
    textAlign: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: "MontserratAlternates-Bold",
    marginBottom: 12,
  },
  infoDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    height: 28,
  },
  tagText: {
    fontSize: 12,
  },
  ruleItem: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  ruleNumber: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Bold",
    marginRight: 8,
    minWidth: 20,
  },
  ruleText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  noRulesText: {
    fontSize: 14,
    fontStyle: "italic",
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 20,
  },
});

export default GroupScreen;
