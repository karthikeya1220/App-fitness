import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Card, Avatar, Button, FAB, Searchbar, Chip } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../contexts/AuthContext";
import { useSocialData } from "../contexts/SocialDataContext";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TabParamList, RootStackParamList, Post, Group } from "../types";

const { width } = Dimensions.get("window");

type DashboardScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "Dashboard">,
  StackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<"feed" | "trending">("feed");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { user } = useAuth();
  const {
    posts,
    groups,
    notifications,
    unreadNotifications,
    likePost,
    sharePost,
    getTrendingPosts,
  } = useSocialData();
  const { theme } = useTheme();
  const { success } = useToast();

  const displayPosts = activeTab === "trending" ? getTrendingPosts() : posts;
  const suggestedGroups = groups.slice(0, 5);

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
    success("Refreshed", "Feed updated successfully");
  };

  const handleLikePost = (postId: string): void => {
    likePost(postId);
  };

  const handleSharePost = (postId: string): void => {
    sharePost(postId);
    success("Shared", "Post shared successfully");
  };

  const StatsCard: React.FC = () => (
    <Card
      style={[
        styles.statsCard,
        { backgroundColor: "rgba(255, 255, 255, 0.05)" },
      ]}
    >
      <Card.Content>
        <View style={styles.statsHeader}>
          <Text style={[styles.statsTitle, { color: "#FFFFFF" }]}>
            Your Progress
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("UserProfile", { userId: "1" })}
          >
            <Text style={[styles.viewMore, { color: "#F6F3BA" }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#F6F3BA" }]}>
              {user?.stats.totalWorkouts || 0}
            </Text>
            <Text
              style={[styles.statLabel, { color: "rgba(255, 255, 255, 0.6)" }]}
            >
              Workouts
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#FFC9E9" }]}>
              {user?.stats.currentStreak || 0}
            </Text>
            <Text
              style={[styles.statLabel, { color: "rgba(255, 255, 255, 0.6)" }]}
            >
              Day Streak
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#D6EBEB" }]}>
              {user?.stats.totalCalories || 0}
            </Text>
            <Text
              style={[styles.statLabel, { color: "rgba(255, 255, 255, 0.6)" }]}
            >
              Calories
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const SuggestedGroupsCard: React.FC = () => (
    <Card
      style={[styles.groupsCard, { backgroundColor: theme.colors.surface }]}
    >
      <Card.Content>
        <View style={styles.groupsHeader}>
          <Text style={[styles.groupsTitle, { color: theme.colors.text }]}>
            Suggested Groups
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Explore", { category: "all" })}
          >
            <Text style={[styles.viewMore, { color: theme.colors.accent }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.groupsScroll}
        >
          {suggestedGroups.map((group) => (
            <TouchableOpacity
              key={group.id}
              style={styles.groupItem}
              onPress={() =>
                navigation.navigate("Group", { groupId: group.id })
              }
            >
              <Avatar.Image
                size={60}
                source={{ uri: group.image }}
                style={styles.groupAvatar}
              />
              <Text
                style={[styles.groupName, { color: theme.colors.text }]}
                numberOfLines={2}
              >
                {group.name}
              </Text>
              <Text
                style={[styles.groupMembers, { color: theme.colors.textMuted }]}
              >
                {group.memberCount} members
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Card.Content>
    </Card>
  );

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

        {post.workoutData && (
          <View
            style={[
              styles.workoutBadge,
              { backgroundColor: theme.colors.accent + "20" },
            ]}
          >
            <Icon name="dumbbell" size={16} color={theme.colors.accent} />
            <Text style={[styles.workoutText, { color: theme.colors.accent }]}>
              {post.workoutData.type} - {post.workoutData.duration}min
            </Text>
          </View>
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

          <TouchableOpacity style={styles.actionButton}>
            <Icon
              name={post.isBookmarked ? "bookmark" : "bookmark-outline"}
              size={20}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: "#262135" }]}>
      {/* Header */}
      <LinearGradient colors={["#262135", "#3B2F4A"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Avatar.Image
              size={40}
              source={{ uri: user?.avatar }}
              style={styles.userAvatar}
            />
            <View>
              <Text
                style={[styles.greeting, { color: "rgba(255, 255, 255, 0.7)" }]}
              >
                Good morning,
              </Text>
              <Text style={[styles.userName, { color: "#FFFFFF" }]}>
                {user?.displayName}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}
          >
            <View style={styles.notificationIcon}>
              <Icon name="bell-outline" size={24} color="#FFFFFF" />
              {unreadNotifications.length > 0 && (
                <View
                  style={[
                    styles.notificationBadge,
                    { backgroundColor: "#EF4444" },
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {unreadNotifications.length}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <Searchbar
          placeholder="Search posts, groups, users..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[
            styles.searchBar,
            { backgroundColor: "rgba(255, 255, 255, 0.1)" },
          ]}
          iconColor="#FFFFFF"
          inputStyle={{ color: "#FFFFFF" }}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
        />
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Card */}
        <StatsCard />

        {/* Suggested Groups */}
        <SuggestedGroupsCard />

        {/* Feed Tabs */}
        <View style={styles.feedTabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "feed" && {
                borderBottomColor: theme.colors.accent,
              },
            ]}
            onPress={() => setActiveTab("feed")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === "feed"
                      ? theme.colors.accent
                      : theme.colors.textMuted,
                },
              ]}
            >
              Following
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "trending" && {
                borderBottomColor: theme.colors.accent,
              },
            ]}
            onPress={() => setActiveTab("trending")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === "trending"
                      ? theme.colors.accent
                      : theme.colors.textMuted,
                },
              ]}
            >
              Trending
            </Text>
          </TouchableOpacity>
        </View>

        {/* Posts Feed */}
        {displayPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: "#F6F3BA" }]}
        onPress={() => navigation.navigate("CreatePost")}
        color="#262135"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userAvatar: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  greeting: {
    fontSize: 14,
    opacity: 0.8,
  },
  userName: {
    fontSize: 18,
    fontFamily: "MontserratAlternates-Bold",
  },
  notificationIcon: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontFamily: "MontserratAlternates-Bold",
  },
  searchBar: {
    marginTop: 10,
    borderRadius: 25,
    elevation: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsCard: {
    marginTop: 20,
    borderRadius: 16,
    elevation: 2,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontFamily: "MontserratAlternates-Bold",
  },
  viewMore: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Medium",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontFamily: "MontserratAlternates-Bold",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  groupsCard: {
    marginTop: 20,
    borderRadius: 16,
    elevation: 2,
  },
  groupsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  groupsTitle: {
    fontSize: 18,
    fontFamily: "MontserratAlternates-Bold",
  },
  groupsScroll: {
    marginHorizontal: -10,
  },
  groupItem: {
    width: 100,
    alignItems: "center",
    marginHorizontal: 10,
  },
  groupAvatar: {
    marginBottom: 8,
  },
  groupName: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 4,
    fontFamily: "MontserratAlternates-Medium",
  },
  groupMembers: {
    fontSize: 10,
    textAlign: "center",
  },
  feedTabs: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    fontFamily: "MontserratAlternates-Medium",
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
  workoutBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
    gap: 4,
  },
  workoutText: {
    fontSize: 12,
    fontFamily: "MontserratAlternates-Medium",
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 20,
  },
});

export default DashboardScreen;
