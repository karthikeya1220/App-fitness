import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  TextInput,
  Button,
  Card,
  Avatar,
  Chip,
  SegmentedButtons,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../contexts/AuthContext";
import { useSocialData } from "../contexts/SocialDataContext";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList, WorkoutData, Exercise } from "../types";

type CreatePostScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CreatePost"
>;
type CreatePostScreenRouteProp = RouteProp<RootStackParamList, "CreatePost">;

interface Props {
  navigation: CreatePostScreenNavigationProp;
  route: CreatePostScreenRouteProp;
}

const CreatePostScreen: React.FC<Props> = ({ navigation, route }) => {
  const { groupId } = route.params || {};
  const [postType, setPostType] = useState<"text" | "workout">("text");
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState<"public" | "friends" | "group">(
    groupId ? "group" : "public",
  );
  const [workoutData, setWorkoutData] = useState<WorkoutData | null>(null);
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const { user } = useAuth();
  const { createPost } = useSocialData();
  const { theme } = useTheme();
  const { success, error } = useToast();

  const pickImages = async (): Promise<void> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need camera roll permissions to add photos.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
      selectionLimit: 4,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...newImages].slice(0, 4));
    }
  };

  const removeImage = (index: number): void => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addWorkoutData = (): void => {
    const mockWorkout: WorkoutData = {
      type: "Strength Training",
      duration: 45,
      calories: 320,
      exercises: [
        { name: "Bench Press", sets: 3, reps: 12, weight: 80 },
        { name: "Squats", sets: 3, reps: 15, weight: 100 },
        { name: "Deadlifts", sets: 3, reps: 10, weight: 120 },
      ],
    };
    setWorkoutData(mockWorkout);
    setPostType("workout");
  };

  const removeWorkoutData = (): void => {
    setWorkoutData(null);
    setPostType("text");
  };

  const handlePost = async (): Promise<void> => {
    if (!content.trim() && images.length === 0 && !workoutData) {
      error("Empty Post", "Please add some content to your post");
      return;
    }

    setIsPosting(true);
    try {
      await createPost({
        userId: user?.id || "1",
        username: user?.username || "user",
        userAvatar: user?.avatar || "",
        content: content.trim(),
        images,
        hashtags: extractHashtags(content),
        mentions: extractMentions(content),
        groupId,
        workoutData,
        privacy,
      });

      success("Posted", "Your post has been shared!");
      navigation.goBack();
    } catch (err) {
      error("Post Failed", "Failed to create post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const extractHashtags = (text: string): string[] => {
    const hashtags = text.match(/#[a-zA-Z0-9_]+/g);
    return hashtags ? hashtags.map((tag) => tag.slice(1)) : [];
  };

  const extractMentions = (text: string): string[] => {
    const mentions = text.match(/@[a-zA-Z0-9_]+/g);
    return mentions ? mentions.map((mention) => mention.slice(1)) : [];
  };

  const WorkoutCard: React.FC = () => {
    if (!workoutData) return null;

    return (
      <Card
        style={[
          styles.workoutCard,
          { backgroundColor: theme.colors.accent + "20" },
        ]}
      >
        <Card.Content>
          <View style={styles.workoutHeader}>
            <View style={styles.workoutInfo}>
              <Icon name="dumbbell" size={20} color={theme.colors.accent} />
              <Text
                style={[styles.workoutType, { color: theme.colors.accent }]}
              >
                {workoutData.type}
              </Text>
            </View>
            <TouchableOpacity onPress={removeWorkoutData}>
              <Icon name="close" size={20} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.workoutStats}>
            <View style={styles.workoutStat}>
              <Text
                style={[styles.workoutStatValue, { color: theme.colors.text }]}
              >
                {workoutData.duration}
              </Text>
              <Text
                style={[
                  styles.workoutStatLabel,
                  { color: theme.colors.textMuted },
                ]}
              >
                minutes
              </Text>
            </View>
            <View style={styles.workoutStat}>
              <Text
                style={[styles.workoutStatValue, { color: theme.colors.text }]}
              >
                {workoutData.calories}
              </Text>
              <Text
                style={[
                  styles.workoutStatLabel,
                  { color: theme.colors.textMuted },
                ]}
              >
                calories
              </Text>
            </View>
            <View style={styles.workoutStat}>
              <Text
                style={[styles.workoutStatValue, { color: theme.colors.text }]}
              >
                {workoutData.exercises.length}
              </Text>
              <Text
                style={[
                  styles.workoutStatLabel,
                  { color: theme.colors.textMuted },
                ]}
              >
                exercises
              </Text>
            </View>
          </View>

          <Text
            style={[styles.exercisesTitle, { color: theme.colors.textMuted }]}
          >
            Exercises:
          </Text>
          {workoutData.exercises.map((exercise, index) => (
            <Text
              key={index}
              style={[styles.exerciseItem, { color: theme.colors.text }]}
            >
              • {exercise.name} - {exercise.sets}x{exercise.reps}
              {exercise.weight && ` @ ${exercise.weight}kg`}
            </Text>
          ))}
        </Card.Content>
      </Card>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Create Post
        </Text>
        <Button
          mode="contained"
          onPress={handlePost}
          loading={isPosting}
          disabled={isPosting}
          style={[styles.postButton, { backgroundColor: theme.colors.accent }]}
          labelStyle={{ color: theme.colors.primary }}
        >
          Post
        </Button>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userSection}>
          <Avatar.Image
            size={40}
            source={{ uri: user?.avatar }}
            style={styles.userAvatar}
          />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {user?.displayName}
            </Text>
            <SegmentedButtons
              value={privacy}
              onValueChange={(value) =>
                setPrivacy(value as "public" | "friends" | "group")
              }
              buttons={[
                {
                  value: "public",
                  label: "Public",
                  icon: "earth",
                  disabled: !!groupId,
                },
                {
                  value: "friends",
                  label: "Friends",
                  icon: "account-group",
                  disabled: !!groupId,
                },
                ...(groupId
                  ? [
                      {
                        value: "group" as const,
                        label: "Group",
                        icon: "account-multiple",
                      },
                    ]
                  : []),
              ]}
              style={styles.privacyButtons}
            />
          </View>
        </View>

        {/* Content Input */}
        <TextInput
          multiline
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          style={styles.contentInput}
          theme={{ colors: { background: "transparent" } }}
          contentStyle={[styles.inputContent, { color: theme.colors.text }]}
          placeholderTextColor={theme.colors.textMuted}
        />

        {/* Workout Data */}
        <WorkoutCard />

        {/* Images */}
        {images.length > 0 && (
          <View style={styles.imagesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: image }} style={styles.postImage} />
                  <TouchableOpacity
                    style={[
                      styles.removeImageButton,
                      { backgroundColor: theme.colors.error },
                    ]}
                    onPress={() => removeImage(index)}
                  >
                    <Icon name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.surface },
            ]}
            onPress={pickImages}
          >
            <Icon name="camera" size={20} color={theme.colors.text} />
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              Photos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.surface },
            ]}
            onPress={addWorkoutData}
          >
            <Icon name="dumbbell" size={20} color={theme.colors.text} />
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              Workout
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Icon name="map-marker" size={20} color={theme.colors.text} />
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              Location
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Icon name="emoticon" size={20} color={theme.colors.text} />
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              Feeling
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hashtag Suggestions */}
        <View style={styles.suggestionsContainer}>
          <Text
            style={[styles.suggestionsTitle, { color: theme.colors.textMuted }]}
          >
            Suggested hashtags:
          </Text>
          <View style={styles.hashtagsContainer}>
            {["fitness", "workout", "healthy", "motivation", "gym"].map(
              (hashtag) => (
                <Chip
                  key={hashtag}
                  onPress={() => setContent(content + ` #${hashtag}`)}
                  style={[
                    styles.hashtag,
                    { backgroundColor: theme.colors.accent + "20" },
                  ]}
                  textStyle={{ color: theme.colors.accent }}
                >
                  #{hashtag}
                </Chip>
              ),
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  postButton: {
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userSection: {
    flexDirection: "row",
    paddingVertical: 16,
  },
  userAvatar: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: "MontserratAlternates-Bold",
    marginBottom: 8,
  },
  privacyButtons: {
    alignSelf: "flex-start",
  },
  contentInput: {
    backgroundColor: "transparent",
    marginBottom: 16,
    minHeight: 100,
  },
  inputContent: {
    fontSize: 16,
    lineHeight: 22,
  },
  workoutCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  workoutInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  workoutType: {
    fontSize: 16,
    fontFamily: "MontserratAlternates-Bold",
  },
  workoutStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  workoutStat: {
    alignItems: "center",
  },
  workoutStatValue: {
    fontSize: 18,
    fontFamily: "MontserratAlternates-Bold",
  },
  workoutStatLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  exercisesTitle: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Medium",
    marginBottom: 8,
  },
  exerciseItem: {
    fontSize: 12,
    marginBottom: 4,
    lineHeight: 16,
  },
  imagesContainer: {
    marginBottom: 16,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 12,
  },
  postImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Medium",
  },
  suggestionsContainer: {
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Medium",
    marginBottom: 8,
  },
  hashtagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  hashtag: {
    height: 32,
  },
});

export default CreatePostScreen;
