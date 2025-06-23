import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import {
  Avatar,
  Button,
  Card,
  Chip,
  SegmentedButtons,
  ProgressBar,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../contexts/AuthContext";
import { useSocialData } from "../contexts/SocialDataContext";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList, User, Post, Achievement } from "../types";

const { width } = Dimensions.get("window");

type UserProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UserProfile"
>;
type UserProfileScreenRouteProp = RouteProp<RootStackParamList, "UserProfile">;

interface Props {
  navigation: UserProfileScreenNavigationProp;
  route: UserProfileScreenRouteProp;
}

const UserProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userId } = route.params;
  const [activeTab, setActiveTab] = useState<
    "posts" | "stats" | "achievements"
  >("posts");
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const { user: currentUser } = useAuth();
  const { users, posts } = useSocialData();
  const { theme } = useTheme();
  const { success } = useToast();

  const profileUser = users.find((u) => u.id === userId) || currentUser;
  const userPosts = posts.filter((p) => p.userId === userId);
  const isOwnProfile = userId === currentUser?.id;

  const mockAchievements: Achievement[] = [
    {
      id: "1",
      title: "First Workout",
      description: "Complete your first workout",
      icon: "dumbbell",
      unlockedAt: "2024-01-01T00:00:00Z",
      category: "workout",
    },
    {
      id: "2",
      title: "Week Warrior",
      description: "Complete 7 days in a row",
      icon: "fire",
      unlockedAt: "2024-01-08T00:00:00Z",
      category: "streak",
    },
    {
      id: "3",
      title: "Social Butterfly",
      description: "Make 10 posts",
      icon: "butterfly",
      unlockedAt: "2024-01-15T00:00:00Z",
      category: "social",
    },
  ];

  const handleFollow = (): void => {
    setIsFollowing(!isFollowing);
    success(
      isFollowing ? "Unfollowed" : "Following",
      `You ${isFollowing ? "unfollowed" : "are now following"} ${
        profileUser?.displayName
      }`,
    );
  };

  const handleMessage = (): void => {
    navigation.navigate("Messaging", { chatId: userId });
  };

  const StatCard: React.FC<{ title: string; value: string; icon: string }> = ({
    title,
    value,
    icon,
  }) => (
    <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content style={styles.statContent}>
        <Icon name={icon} size={24} color={theme.colors.accent} />
        <Text style={[styles.statValue, { color: theme.colors.text }]}>
          {value}
        </Text>
        <Text style={[styles.statTitle, { color: theme.colors.textMuted }]}>
          {title}
        </Text>
      </Card.Content>
    </Card>
  );

  const EnhancedStatCard: React.FC<{
    title: string;
    value: string;
    unit: string;
    icon: string;
    color: string;
    backgroundColor: string;
  }> = ({ title, value, unit, icon, color, backgroundColor }) => (
    <View style={[styles.enhancedStatCard, { backgroundColor }]}>
      <View
        style={[styles.enhancedStatIcon, { backgroundColor: color + "30" }]}
      >
        <Icon name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.enhancedStatValue, { color: theme.colors.text }]}>
        {value}
      </Text>
      <Text style={[styles.enhancedStatUnit, { color: color }]}>{unit}</Text>
      <Text
        style={[styles.enhancedStatTitle, { color: theme.colors.textMuted }]}
      >
        {title}
      </Text>
    </View>
  );

  const AchievementCard: React.FC<{ achievement: Achievement }> = ({
    achievement,
  }) => (
    <Card
      style={[
        styles.achievementCard,
        { backgroundColor: theme.colors.surface },
      ]}
    >
      <Card.Content style={styles.achievementContent}>
        <View
          style={[
            styles.achievementIcon,
            { backgroundColor: theme.colors.accent + "20" },
          ]}
        >
          <Icon name={achievement.icon} size={24} color={theme.colors.accent} />
        </View>
        <View style={styles.achievementInfo}>
          <Text style={[styles.achievementTitle, { color: theme.colors.text }]}>
            {achievement.title}
          </Text>
          <Text
            style={[
              styles.achievementDescription,
              { color: theme.colors.textMuted },
            ]}
          >
            {achievement.description}
          </Text>
          <Text
            style={[styles.achievementDate, { color: theme.colors.textMuted }]}
          >
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  const PostCard: React.FC<{ post: Post }> = ({ post }) => (
    <Card style={[styles.postCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Text style={[styles.postContent, { color: theme.colors.text }]}>
          {post.content}
        </Text>
        <View style={styles.postMeta}>
          <Text
            style={[styles.postTimestamp, { color: theme.colors.textMuted }]}
          >
            {new Date(post.timestamp).toLocaleDateString()}
          </Text>
          <View style={styles.postStats}>
            <View style={styles.postStat}>
              <Icon name="heart" size={14} color="#E91E63" />
              <Text
                style={[styles.postStatText, { color: theme.colors.textMuted }]}
              >
                {post.likes}
              </Text>
            </View>
            <View style={styles.postStat}>
              <Icon name="comment" size={14} color={theme.colors.textMuted} />
              <Text
                style={[styles.postStatText, { color: theme.colors.textMuted }]}
              >
                {post.comments}
              </Text>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderTabContent = (): React.ReactNode => {
    switch (activeTab) {
      case "posts":
        return (
          <FlatList
            data={userPosts}
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
                  {isOwnProfile
                    ? "Share your first workout!"
                    : "This user hasn't posted yet"}
                </Text>
              </View>
            }
          />
        );

      case "stats":
        return (
          <ScrollView
            style={styles.statsContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Stats */}
            <View style={styles.headerStats}>
              <View style={styles.headerStatsLeft}>
                <Text
                  style={[
                    styles.headerStatsDate,
                    { color: theme.colors.textMuted },
                  ]}
                >
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </Text>
                <Text
                  style={[
                    styles.headerStatsTitle,
                    { color: theme.colors.text },
                  ]}
                >
                  Your Statistics
                </Text>
              </View>
              <View style={styles.headerStatsRight}>
                <Text
                  style={[
                    styles.weeklyAverageLabel,
                    { color: theme.colors.textMuted },
                  ]}
                >
                  Weekly Average
                </Text>
                <Text
                  style={[
                    styles.weeklyAverageValue,
                    { color: theme.colors.text },
                  ]}
                >
                  {Math.round((profileUser?.stats.totalCalories || 0) / 7)} CAL
                </Text>
                <View
                  style={[
                    styles.trendIcon,
                    { backgroundColor: theme.colors.secondary },
                  ]}
                >
                  <Icon
                    name="trending-up"
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
              </View>
            </View>

            {/* Time Period Selector */}
            <View
              style={[
                styles.timePeriodSelector,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            >
              {["Day", "Week", "Month"].map((period, index) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.timePeriodButton,
                    index === 1 && { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.timePeriodText,
                      {
                        color:
                          index === 1
                            ? theme.colors.onPrimary
                            : theme.colors.textMuted,
                      },
                    ]}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Main Chart Card */}
            <View
              style={[
                styles.chartCard,
                { backgroundColor: theme.colors.accent },
              ]}
            >
              <View style={styles.chartHeader}>
                <View>
                  <Text
                    style={[styles.chartTitle, { color: theme.colors.primary }]}
                  >
                    Calories
                  </Text>
                  <Text
                    style={[
                      styles.chartSubtitle,
                      { color: theme.colors.primary },
                    ]}
                  >
                    {profileUser?.stats.totalCalories || 0} cal
                  </Text>
                </View>
              </View>

              {/* Chart Bars */}
              <View style={styles.chartBars}>
                {[25, 40, 55, 45, 70, 35, 50].map((height, index) => (
                  <View key={index} style={styles.chartBarContainer}>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: `${height}%`,
                          backgroundColor:
                            index === 4
                              ? theme.colors.primary
                              : theme.colors.primary + "30",
                        },
                      ]}
                    />
                  </View>
                ))}
              </View>

              {/* Chart Labels */}
              <View style={styles.chartLabels}>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day, index) => (
                    <Text
                      key={day}
                      style={[
                        styles.chartLabel,
                        {
                          color: theme.colors.primary,
                          opacity: index === 4 ? 1 : 0.7,
                          fontFamily:
                            index === 4
                              ? "MontserratAlternates-Bold"
                              : "MontserratAlternates-Regular",
                        },
                      ]}
                    >
                      {day}
                    </Text>
                  ),
                )}
              </View>
            </View>

            {/* Enhanced Stats Grid */}
            <View style={styles.enhancedStatsGrid}>
              {/* Primary Stats Cards */}
              <View
                style={[
                  styles.primaryStatCard,
                  { backgroundColor: theme.colors.teal },
                ]}
              >
                <View style={styles.statCardHeader}>
                  <View
                    style={[
                      styles.statIconContainer,
                      { backgroundColor: theme.colors.surface },
                    ]}
                  >
                    <Icon
                      name="dumbbell"
                      size={24}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View style={styles.statCardInfo}>
                    <Text
                      style={[
                        styles.statCardLabel,
                        { color: theme.colors.primary },
                      ]}
                    >
                      Workouts
                    </Text>
                    <Text
                      style={[
                        styles.statCardValue,
                        { color: theme.colors.primary },
                      ]}
                    >
                      {profileUser?.stats.totalWorkouts || 0} total
                    </Text>
                  </View>
                </View>

                {/* Mini chart */}
                <View style={styles.miniChart}>
                  {[30, 20, 25, 35, 40, 25, 45, 30, 20, 35, 50, 35, 30, 40].map(
                    (height, i) => (
                      <View
                        key={i}
                        style={[
                          styles.miniChartBar,
                          {
                            height: `${height}%`,
                            backgroundColor: theme.colors.primary,
                          },
                        ]}
                      />
                    ),
                  )}
                </View>

                <Text
                  style={[
                    styles.statCardProgress,
                    { color: theme.colors.primary },
                  ]}
                >
                  {Math.round(
                    ((profileUser?.stats.weeklyProgress || 0) /
                      (profileUser?.stats.weeklyGoal || 5)) *
                      100,
                  )}
                  %
                </Text>
              </View>

              <View
                style={[
                  styles.primaryStatCard,
                  { backgroundColor: theme.colors.borderMedium },
                ]}
              >
                <View style={styles.statCardHeader}>
                  <View
                    style={[
                      styles.statIconContainer,
                      { backgroundColor: theme.colors.surface },
                    ]}
                  >
                    <Icon name="water" size={24} color={theme.colors.info} />
                  </View>
                  <View style={styles.statCardInfo}>
                    <Text
                      style={[
                        styles.statCardLabel,
                        { color: theme.colors.primary },
                      ]}
                    >
                      Distance
                    </Text>
                    <Text
                      style={[
                        styles.statCardValue,
                        { color: theme.colors.primary },
                      ]}
                    >
                      {profileUser?.stats.totalDistance || 0} km
                    </Text>
                  </View>
                </View>

                {/* Mini chart */}
                <View style={styles.miniChart}>
                  {[20, 15, 30, 30, 45, 55].map((height, i) => (
                    <View
                      key={i}
                      style={[
                        styles.miniChartBarWide,
                        {
                          height: `${height}%`,
                          backgroundColor: theme.colors.textMuted,
                        },
                      ]}
                    />
                  ))}
                </View>

                <Text
                  style={[
                    styles.statCardProgress,
                    { color: theme.colors.primary },
                  ]}
                >
                  {Math.round(
                    ((profileUser?.stats.totalDistance || 0) / 10) * 100,
                  )}
                  %
                </Text>
              </View>
            </View>

            {/* Secondary Stats Grid */}
            <View style={styles.secondaryStatsGrid}>
              <EnhancedStatCard
                title="Current Streak"
                value={String(profileUser?.stats.currentStreak || 0)}
                unit="days"
                icon="fire"
                color={theme.colors.warning}
                backgroundColor={theme.colors.warning + "20"}
              />
              <EnhancedStatCard
                title="Longest Streak"
                value={String(profileUser?.stats.longestStreak || 0)}
                unit="days"
                icon="trophy"
                color={theme.colors.accent}
                backgroundColor={theme.colors.accent + "20"}
              />
              <EnhancedStatCard
                title="Total Calories"
                value={String(profileUser?.stats.totalCalories || 0)}
                unit="cal"
                icon="lightning-bolt"
                color={theme.colors.error}
                backgroundColor={theme.colors.error + "20"}
              />
              <EnhancedStatCard
                title="Best Month"
                value="Jan"
                unit="2024"
                icon="calendar"
                color={theme.colors.success}
                backgroundColor={theme.colors.success + "20"}
              />
            </View>
          </ScrollView>
        );

      case "achievements":
        return (
          <FlatList
            data={mockAchievements}
            renderItem={({ item }) => <AchievementCard achievement={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Icon
                  name="trophy-outline"
                  size={64}
                  color={theme.colors.textMuted}
                />
                <Text
                  style={[styles.emptyStateTitle, { color: theme.colors.text }]}
                >
                  No achievements yet
                </Text>
                <Text
                  style={[
                    styles.emptyStateSubtitle,
                    { color: theme.colors.textMuted },
                  ]}
                >
                  Complete workouts to unlock achievements!
                </Text>
              </View>
            }
          />
        );

      default:
        return null;
    }
  };

  if (!profileUser) {
    return (
      <View style={styles.errorContainer}>
        <Text>User not found</Text>
      </View>
    );
  }

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
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {isOwnProfile ? "My Profile" : profileUser.displayName}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (isOwnProfile) {
                navigation.navigate("Settings");
              } else {
                // Share profile or more options
              }
            }}
          >
            <Icon
              name={isOwnProfile ? "cog" : "share"}
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Avatar.Image
            size={80}
            source={{ uri: profileUser.avatar }}
            style={styles.profileAvatar}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.colors.text }]}>
              {profileUser.displayName}
            </Text>
            <Text
              style={[
                styles.profileUsername,
                { color: theme.colors.textMuted },
              ]}
            >
              @{profileUser.username}
            </Text>
            {profileUser.bio && (
              <Text
                style={[styles.profileBio, { color: theme.colors.textMuted }]}
              >
                {profileUser.bio}
              </Text>
            )}
            {profileUser.location && (
              <View style={styles.locationContainer}>
                <Icon
                  name="map-marker"
                  size={14}
                  color={theme.colors.textMuted}
                />
                <Text
                  style={[
                    styles.locationText,
                    { color: theme.colors.textMuted },
                  ]}
                >
                  {profileUser.location}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {profileUser.posts}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
              Posts
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {profileUser.followers}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
              Followers
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {profileUser.following}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
              Following
            </Text>
          </View>
        </View>

        {/* Goals and Interests */}
        <View style={styles.tagsContainer}>
          {profileUser.fitnessGoals?.map((goal) => (
            <Chip
              key={goal}
              style={[
                styles.goalChip,
                { backgroundColor: theme.colors.accent + "20" },
              ]}
              textStyle={{ color: theme.colors.accent }}
            >
              {goal}
            </Chip>
          ))}
        </View>

        {/* Action Buttons */}
        {!isOwnProfile && (
          <View style={styles.actionButtons}>
            <Button
              mode={isFollowing ? "outlined" : "contained"}
              onPress={handleFollow}
              style={[
                styles.followButton,
                {
                  backgroundColor: isFollowing
                    ? "transparent"
                    : theme.colors.accent,
                  borderColor: theme.colors.accent,
                },
              ]}
              labelStyle={{
                color: isFollowing ? theme.colors.accent : theme.colors.primary,
              }}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
            <Button
              mode="outlined"
              onPress={handleMessage}
              style={[
                styles.messageButton,
                { borderColor: theme.colors.accent },
              ]}
              labelStyle={{ color: theme.colors.accent }}
            >
              Message
            </Button>
          </View>
        )}
      </LinearGradient>

      {/* Tab Navigation */}
      <SegmentedButtons
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "posts" | "stats" | "achievements")
        }
        buttons={[
          {
            value: "posts",
            label: "Posts",
            icon: "post-outline",
          },
          {
            value: "stats",
            label: "Stats",
            icon: "chart-line",
          },
          {
            value: "achievements",
            label: "Achievements",
            icon: "trophy",
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
  headerTitle: {
    fontSize: 18,
    fontFamily: "MontserratAlternates-Bold",
  },
  profileSection: {
    flexDirection: "row",
    marginBottom: 20,
  },
  profileAvatar: {
    marginRight: 16,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: "MontserratAlternates-Bold",
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 14,
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontFamily: "MontserratAlternates-Bold",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  goalChip: {
    height: 28,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  followButton: {
    flex: 2,
    borderRadius: 20,
    borderWidth: 1,
  },
  messageButton: {
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
  statsContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  headerStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  headerStatsLeft: {
    flex: 1,
  },
  headerStatsDate: {
    fontSize: 12,
    fontFamily: "MontserratAlternates-Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  headerStatsTitle: {
    fontSize: 28,
    fontFamily: "MontserratAlternates-Bold",
    lineHeight: 32,
  },
  headerStatsRight: {
    alignItems: "flex-end",
  },
  weeklyAverageLabel: {
    fontSize: 10,
    fontFamily: "MontserratAlternates-Medium",
    marginBottom: 2,
  },
  weeklyAverageValue: {
    fontSize: 18,
    fontFamily: "MontserratAlternates-Bold",
    marginBottom: 8,
  },
  trendIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  timePeriodSelector: {
    flexDirection: "row",
    borderRadius: 24,
    padding: 4,
    marginBottom: 24,
  },
  timePeriodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  timePeriodText: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Medium",
  },
  chartCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: "MontserratAlternates-Medium",
  },
  chartSubtitle: {
    fontSize: 12,
    fontFamily: "MontserratAlternates-Regular",
    marginTop: 2,
  },
  chartBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 120,
    marginBottom: 12,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  chartBar: {
    width: 4,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    minHeight: 8,
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chartLabel: {
    fontSize: 10,
    fontFamily: "MontserratAlternates-Regular",
  },
  enhancedStatsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  primaryStatCard: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
  },
  statCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  statCardInfo: {
    flex: 1,
  },
  statCardLabel: {
    fontSize: 12,
    fontFamily: "MontserratAlternates-Medium",
  },
  statCardValue: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Bold",
    marginTop: 2,
  },
  miniChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 1,
    height: 32,
    marginBottom: 8,
  },
  miniChartBar: {
    width: 2,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    minHeight: 4,
  },
  miniChartBarWide: {
    width: 8,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    minHeight: 6,
  },
  statCardProgress: {
    fontSize: 12,
    fontFamily: "MontserratAlternates-Medium",
  },
  secondaryStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  enhancedStatCard: {
    width: (width - 60) / 2,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  enhancedStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  enhancedStatValue: {
    fontSize: 24,
    fontFamily: "MontserratAlternates-Bold",
    marginBottom: 2,
  },
  enhancedStatUnit: {
    fontSize: 12,
    fontFamily: "MontserratAlternates-Medium",
    marginBottom: 4,
  },
  enhancedStatTitle: {
    fontSize: 11,
    fontFamily: "MontserratAlternates-Medium",
    textAlign: "center",
  },
  progressCard: {
    marginBottom: 20,
    borderRadius: 16,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 16,
    fontFamily: "MontserratAlternates-Bold",
    marginBottom: 12,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
  },
  progressPercentage: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Bold",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  statCard: {
    width: (width - 60) / 2,
    borderRadius: 12,
    elevation: 2,
  },
  statContent: {
    alignItems: "center",
    paddingVertical: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: "MontserratAlternates-Bold",
    marginVertical: 4,
  },
  statTitle: {
    fontSize: 12,
    textAlign: "center",
  },
  achievementCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  achievementContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: "MontserratAlternates-Bold",
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    marginBottom: 2,
  },
  achievementDate: {
    fontSize: 10,
  },
  postCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  postMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postTimestamp: {
    fontSize: 12,
  },
  postStats: {
    flexDirection: "row",
    gap: 12,
  },
  postStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  postStatText: {
    fontSize: 12,
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

export default UserProfileScreen;
