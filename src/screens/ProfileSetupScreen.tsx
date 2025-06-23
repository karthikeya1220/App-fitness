import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import {
  TextInput,
  Button,
  Card,
  Chip,
  useTheme as usePaperTheme,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { useTheme } from "../contexts/ThemeContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";

type ProfileSetupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ProfileSetup"
>;

interface Props {
  navigation: ProfileSetupScreenNavigationProp;
}

interface ProfileData {
  avatar: string | null;
  username: string;
  bio: string;
  location: string;
  goals: string[];
  interests: string[];
}

interface GoalOption {
  id: string;
  label: string;
  icon: string;
}

const ProfileSetupScreen: React.FC<Props> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [profileData, setProfileData] = useState<ProfileData>({
    avatar: null,
    username: "",
    bio: "",
    location: "",
    goals: [],
    interests: [],
  });

  const { completeSetup } = useAuth();
  const { success, error } = useToast();
  const { theme } = useTheme();
  const paperTheme = usePaperTheme();

  const steps = ["Profile", "Goals", "Interests", "Complete"];

  const goalOptions: GoalOption[] = [
    { id: "weight_loss", label: "Lose Weight", icon: "scale-bathroom" },
    { id: "muscle_gain", label: "Build Muscle", icon: "dumbbell" },
    { id: "endurance", label: "Improve Endurance", icon: "heart-pulse" },
    { id: "strength", label: "Increase Strength", icon: "weight-lifter" },
    { id: "flexibility", label: "Improve Flexibility", icon: "yoga" },
    { id: "general_fitness", label: "General Fitness", icon: "run" },
  ];

  const interestOptions: string[] = [
    "HIIT",
    "Weight Training",
    "Running",
    "Yoga",
    "CrossFit",
    "Swimming",
    "Cycling",
    "Boxing",
    "Pilates",
    "Dancing",
    "Rock Climbing",
    "Outdoor Activities",
  ];

  const pickImage = async (): Promise<void> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need camera roll permissions to set your profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileData({ ...profileData, avatar: result.assets[0].uri });
    }
  };

  const toggleGoal = (goalId: string): void => {
    const updatedGoals = profileData.goals.includes(goalId)
      ? profileData.goals.filter((g) => g !== goalId)
      : [...profileData.goals, goalId];
    setProfileData({ ...profileData, goals: updatedGoals });
  };

  const toggleInterest = (interest: string): void => {
    const updatedInterests = profileData.interests.includes(interest)
      ? profileData.interests.filter((i) => i !== interest)
      : [...profileData.interests, interest];
    setProfileData({ ...profileData, interests: updatedInterests });
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0:
        return profileData.username.length >= 3;
      case 1:
        return profileData.goals.length > 0;
      case 2:
        return profileData.interests.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = async (): Promise<void> => {
    if (currentStep === steps.length - 1) {
      try {
        await completeSetup(profileData);
        success("Welcome!", "Your profile has been set up successfully!");
      } catch (err) {
        error("Setup Failed", "Please try again");
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const renderStepContent = (): React.ReactNode => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            {/* Profile Picture */}
            <TouchableOpacity
              onPress={pickImage}
              style={styles.avatarContainer}
            >
              {profileData.avatar ? (
                <Image
                  source={{ uri: profileData.avatar }}
                  style={styles.avatar}
                />
              ) : (
                <View
                  style={[
                    styles.avatarPlaceholder,
                    { backgroundColor: theme.colors.surface },
                  ]}
                >
                  <Icon
                    name="camera"
                    size={40}
                    color={theme.colors.textMuted}
                  />
                </View>
              )}
              <View
                style={[
                  styles.cameraButton,
                  { backgroundColor: theme.colors.accent },
                ]}
              >
                <Icon name="camera" size={16} color={theme.colors.primary} />
              </View>
            </TouchableOpacity>

            <TextInput
              label="Username"
              value={profileData.username}
              onChangeText={(text: string) =>
                setProfileData({ ...profileData, username: text })
              }
              style={styles.input}
              theme={paperTheme}
            />

            <TextInput
              label="Bio (Optional)"
              value={profileData.bio}
              onChangeText={(text: string) =>
                setProfileData({ ...profileData, bio: text })
              }
              multiline
              numberOfLines={3}
              style={styles.input}
              theme={paperTheme}
            />

            <TextInput
              label="Location (Optional)"
              value={profileData.location}
              onChangeText={(text: string) =>
                setProfileData({ ...profileData, location: text })
              }
              style={styles.input}
              theme={paperTheme}
            />
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <Text
              style={[
                styles.stepDescription,
                { color: theme.colors.textMuted },
              ]}
            >
              Select your fitness goals to get personalized recommendations
            </Text>
            <View style={styles.optionsGrid}>
              {goalOptions.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  onPress={() => toggleGoal(goal.id)}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: profileData.goals.includes(goal.id)
                        ? theme.colors.accent
                        : theme.colors.surface,
                      borderColor: profileData.goals.includes(goal.id)
                        ? theme.colors.accent
                        : theme.colors.border,
                    },
                  ]}
                >
                  <Icon
                    name={goal.icon}
                    size={32}
                    color={
                      profileData.goals.includes(goal.id)
                        ? theme.colors.primary
                        : theme.colors.text
                    }
                  />
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        color: profileData.goals.includes(goal.id)
                          ? theme.colors.primary
                          : theme.colors.text,
                      },
                    ]}
                  >
                    {goal.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text
              style={[
                styles.stepDescription,
                { color: theme.colors.textMuted },
              ]}
            >
              Choose activities you enjoy or want to try
            </Text>
            <View style={styles.chipsContainer}>
              {interestOptions.map((interest) => (
                <Chip
                  key={interest}
                  selected={profileData.interests.includes(interest)}
                  onPress={() => toggleInterest(interest)}
                  style={[
                    styles.interestChip,
                    {
                      backgroundColor: profileData.interests.includes(interest)
                        ? theme.colors.accent
                        : theme.colors.surface,
                    },
                  ]}
                  textStyle={{
                    color: profileData.interests.includes(interest)
                      ? theme.colors.primary
                      : theme.colors.text,
                  }}
                >
                  {interest}
                </Chip>
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Icon name="check-circle" size={80} color={theme.colors.accent} />
            <Text style={[styles.completeTitle, { color: theme.colors.text }]}>
              You're All Set!
            </Text>
            <Text
              style={[
                styles.completeDescription,
                { color: theme.colors.textMuted },
              ]}
            >
              Welcome to the fitness community! You've selected{" "}
              {profileData.goals.length} goals and{" "}
              {profileData.interests.length} interests.
            </Text>

            <View style={styles.summaryCards}>
              <Card
                style={[
                  styles.summaryCard,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <Card.Content style={styles.summaryCardContent}>
                  <Text
                    style={[styles.summaryTitle, { color: theme.colors.text }]}
                  >
                    Goals
                  </Text>
                  <Text
                    style={[
                      styles.summaryValue,
                      { color: theme.colors.accent },
                    ]}
                  >
                    {profileData.goals.length}
                  </Text>
                </Card.Content>
              </Card>

              <Card
                style={[
                  styles.summaryCard,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <Card.Content style={styles.summaryCardContent}>
                  <Text
                    style={[styles.summaryTitle, { color: theme.colors.text }]}
                  >
                    Interests
                  </Text>
                  <Text
                    style={[
                      styles.summaryValue,
                      { color: theme.colors.secondary },
                    ]}
                  >
                    {profileData.interests.length}
                  </Text>
                </Card.Content>
              </Card>
            </View>
          </View>
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
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {steps[currentStep]} Setup
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              {
                backgroundColor:
                  index <= currentStep
                    ? theme.colors.accent
                    : theme.colors.border,
                width: index <= currentStep ? 32 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
          {currentStep === 0 && "Set up your profile"}
          {currentStep === 1 && "What are your goals?"}
          {currentStep === 2 && "What interests you?"}
          {currentStep === 3 && "You're all set!"}
        </Text>

        {renderStepContent()}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <Button
          mode="contained"
          onPress={handleNext}
          disabled={!canProceed()}
          style={[styles.nextButton, { backgroundColor: theme.colors.accent }]}
          labelStyle={[styles.buttonLabel, { color: theme.colors.primary }]}
        >
          {currentStep === steps.length - 1 ? "Enter Community" : "Continue"}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "MontserratAlternates-Bold",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: "MontserratAlternates-Bold",
    textAlign: "center",
    marginBottom: 30,
  },
  stepContent: {
    alignItems: "center",
  },
  stepDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
  },
  optionCard: {
    width: "45%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
  },
  optionLabel: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Medium",
    textAlign: "center",
    marginTop: 8,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  interestChip: {
    marginBottom: 8,
  },
  completeTitle: {
    fontSize: 24,
    fontFamily: "MontserratAlternates-Bold",
    textAlign: "center",
    marginVertical: 20,
  },
  completeDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  summaryCards: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
  },
  summaryCardContent: {
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Medium",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontFamily: "MontserratAlternates-Bold",
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  nextButton: {
    borderRadius: 25,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: "MontserratAlternates-Bold",
  },
});

export default ProfileSetupScreen;
