import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import { Searchbar, Card, Avatar, Button, Chip, FAB } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../contexts/ThemeContext";
import { useSocialData } from "../contexts/SocialDataContext";
import { useToast } from "../contexts/ToastContext";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TabParamList, RootStackParamList, Group } from "../types";

type ExploreGroupsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "Explore">,
  StackNavigationProp<RootStackParamList>
>;

type ExploreGroupsScreenRouteProp = RouteProp<
  RootStackParamList,
  "ExploreGroups"
>;

interface Props {
  navigation: ExploreGroupsScreenNavigationProp;
  route: ExploreGroupsScreenRouteProp;
}

const ExploreGroupsScreen: React.FC<Props> = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());

  const { theme, themeStyles } = useTheme();
  const { groups, searchGroups, joinGroup } = useSocialData();
  const { success } = useToast();

  const categories = [
    { id: "all", label: "All", icon: "view-grid" },
    { id: "fitness", label: "Fitness", icon: "dumbbell" },
    { id: "running", label: "Running", icon: "run" },
    { id: "yoga", label: "Yoga", icon: "yoga" },
    { id: "weightlifting", label: "Weights", icon: "weight-lifter" },
    { id: "cycling", label: "Cycling", icon: "bike" },
    { id: "swimming", label: "Swimming", icon: "swim" },
  ];

  useEffect(() => {
    if (route.params?.category) {
      setSelectedCategory(route.params.category);
    }
  }, [route.params]);

  const filteredGroups = searchQuery
    ? searchGroups(
        searchQuery,
        selectedCategory !== "all" ? selectedCategory : undefined,
      )
    : groups.filter(
        (group) =>
          selectedCategory === "all" || group.category === selectedCategory,
      );

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
    success("Refreshed", "Groups updated successfully");
  };

  const handleJoinGroup = (groupId: string): void => {
    const wasJoined = joinedGroups.has(groupId);
    const newJoinedGroups = new Set(joinedGroups);

    if (wasJoined) {
      newJoinedGroups.delete(groupId);
      success("Left", "You left the group");
    } else {
      newJoinedGroups.add(groupId);
      joinGroup(groupId, "1"); // Using current user ID
      success("Joined", "You joined the group!");
    }

    setJoinedGroups(newJoinedGroups);
  };

  const GroupCard: React.FC<{ group: Group }> = ({ group }) => {
    const isJoined = joinedGroups.has(group.id);

    return (
      <Card
        style={[styles.groupCard, { backgroundColor: theme.colors.surface }]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Group", { groupId: group.id })}
        >
          <Card.Content>
            <View style={styles.groupHeader}>
              <Avatar.Image
                size={60}
                source={{ uri: group.image }}
                style={styles.groupImage}
              />
              <View style={styles.groupInfo}>
                <View style={styles.groupTitleRow}>
                  <Text
                    style={[styles.groupName, { color: theme.colors.text }]}
                    numberOfLines={1}
                  >
                    {group.name}
                  </Text>
                  {group.isPrivate && (
                    <Icon
                      name="lock"
                      size={16}
                      color={theme.colors.textMuted}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.groupDescription,
                    { color: theme.colors.textMuted },
                  ]}
                  numberOfLines={2}
                >
                  {group.description}
                </Text>
                <View style={styles.groupMeta}>
                  <View style={styles.metaItem}>
                    <Icon
                      name="account-group"
                      size={14}
                      color={theme.colors.textMuted}
                    />
                    <Text
                      style={[
                        styles.metaText,
                        { color: theme.colors.textMuted },
                      ]}
                    >
                      {group.memberCount} members
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Icon name="tag" size={14} color={theme.colors.textMuted} />
                    <Text
                      style={[
                        styles.metaText,
                        { color: theme.colors.textMuted },
                      ]}
                    >
                      {group.category}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Tags */}
            <View style={styles.tagsContainer}>
              {group.tags.slice(0, 3).map((tag) => (
                <Chip
                  key={tag}
                  style={[
                    styles.tag,
                    { backgroundColor: theme.colors.accent + "20" },
                  ]}
                  textStyle={[styles.tagText, { color: theme.colors.accent }]}
                >
                  {tag}
                </Chip>
              ))}
              {group.tags.length > 3 && (
                <Text
                  style={[
                    styles.moreTagsText,
                    { color: theme.colors.textMuted },
                  ]}
                >
                  +{group.tags.length - 3} more
                </Text>
              )}
            </View>

            {/* Next Event */}
            {group.nextEvent && (
              <View
                style={[
                  styles.eventBanner,
                  { backgroundColor: theme.colors.secondary + "20" },
                ]}
              >
                <Icon
                  name="calendar"
                  size={16}
                  color={theme.colors.secondary}
                />
                <Text
                  style={[styles.eventText, { color: theme.colors.secondary }]}
                >
                  Next event: {group.nextEvent.title}
                </Text>
              </View>
            )}

            {/* Action Button */}
            <Button
              mode={isJoined ? "outlined" : "contained"}
              onPress={() => handleJoinGroup(group.id)}
              style={[
                styles.joinButton,
                isJoined
                  ? {
                      backgroundColor: "transparent",
                      borderColor: theme.colors.accent,
                      borderWidth: 2,
                    }
                  : {
                      backgroundColor: theme.colors.accent,
                      shadowColor: theme.colors.accent,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 3,
                    },
              ]}
              labelStyle={[
                styles.joinButtonLabel,
                {
                  color: isJoined ? theme.colors.accent : theme.colors.primary,
                  fontWeight: "600",
                },
              ]}
              contentStyle={styles.joinButtonContent}
            >
              {isJoined
                ? "✓ Joined"
                : group.isPrivate
                  ? "Request to Join"
                  : "Join Group"}
            </Button>
          </Card.Content>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Explore Groups
        </Text>
        <Text
          style={[styles.headerSubtitle, { color: theme.colors.textMuted }]}
        >
          Find your fitness community
        </Text>
      </View>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search groups..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
        iconColor={theme.colors.text}
        inputStyle={{ color: theme.colors.text }}
      />

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
            style={[
              styles.categoryChip,
              {
                backgroundColor:
                  selectedCategory === category.id
                    ? theme.colors.accent
                    : theme.colors.surface,
                borderColor:
                  selectedCategory === category.id
                    ? theme.colors.accent
                    : theme.colors.borderMedium,
                borderWidth: selectedCategory === category.id ? 2 : 1,
                shadowColor:
                  selectedCategory === category.id
                    ? theme.colors.accent
                    : "transparent",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: selectedCategory === category.id ? 0.3 : 0,
                shadowRadius: 2,
                elevation: selectedCategory === category.id ? 2 : 0,
              },
            ]}
          >
            <Icon
              name={category.icon}
              size={18}
              color={
                selectedCategory === category.id
                  ? theme.colors.primary
                  : theme.colors.text
              }
            />
            <Text
              style={[
                styles.categoryLabel,
                {
                  color:
                    selectedCategory === category.id
                      ? theme.colors.primary
                      : theme.colors.text,
                },
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsCount, { color: theme.colors.text }]}>
          {filteredGroups.length} groups found
        </Text>
        <TouchableOpacity>
          <Icon name="tune" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Groups List */}
      <FlatList
        data={filteredGroups}
        renderItem={({ item }) => <GroupCard group={item} />}
        keyExtractor={(item) => item.id}
        style={styles.groupsList}
        contentContainerStyle={styles.groupsListContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon
              name="account-group-outline"
              size={64}
              color={theme.colors.textMuted}
            />
            <Text
              style={[styles.emptyStateTitle, { color: theme.colors.text }]}
            >
              No groups found
            </Text>
            <Text
              style={[
                styles.emptyStateSubtitle,
                { color: theme.colors.textMuted },
              ]}
            >
              Try adjusting your search or category filter
            </Text>
          </View>
        }
      />

      {/* Create Group FAB */}
      <FAB
        icon="plus"
        label="Create Group"
        style={[
          styles.fab,
          {
            backgroundColor: theme.colors.accent,
            shadowColor: theme.colors.accent,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          },
        ]}
        onPress={() => {
          // Navigate to create group screen
          success("Coming Soon", "Group creation feature coming soon!");
        }}
        color={theme.colors.primary}
        customSize={64}
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "MontserratAlternates-Bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    elevation: 2,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    minHeight: 44,
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Medium",
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 16,
    fontFamily: "MontserratAlternates-Medium",
  },
  groupsList: {
    flex: 1,
  },
  groupsListContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  groupCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  groupHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  groupImage: {
    marginRight: 12,
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
    fontSize: 16,
    fontFamily: "MontserratAlternates-Bold",
    flex: 1,
  },
  groupDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  groupMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
    alignItems: "center",
  },
  tag: {
    height: 24,
  },
  tagText: {
    fontSize: 11,
  },
  moreTagsText: {
    fontSize: 11,
    fontStyle: "italic",
  },
  eventBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  eventText: {
    fontSize: 12,
    fontFamily: "MontserratAlternates-Medium",
  },
  joinButton: {
    borderRadius: 24,
    marginTop: 4,
  },
  joinButtonContent: {
    height: 44,
    paddingHorizontal: 16,
  },
  joinButtonLabel: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Bold",
    letterSpacing: 0.5,
  },
  emptyState: {
    flex: 1,
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
    paddingHorizontal: 40,
  },
  fab: {
    position: "absolute",
    margin: 20,
    right: 0,
    bottom: 24,
    borderRadius: 32,
  },
});

export default ExploreGroupsScreen;
