import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  TextInput,
  Button,
  Card,
  Checkbox,
  useTheme as usePaperTheme,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { useTheme } from "../contexts/ThemeContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, User } from "../types";

const { width } = Dimensions.get("window");

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, "Auth">;

interface Props {
  navigation: AuthScreenNavigationProp;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const AuthScreen: React.FC<Props> = ({ navigation }) => {
  const [mode, setMode] = useState<"welcome" | "login" | "signup" | "goals">(
    "welcome",
  );
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const { success, error } = useToast();
  const { theme } = useTheme();
  const paperTheme = usePaperTheme();

  const goals: Goal[] = [
    {
      id: "muscle",
      title: "Build Muscle",
      description: "I want to gain muscle mass and increase strength",
      icon: "dumbbell",
    },
    {
      id: "cardio",
      title: "Improve Cardio",
      description: "I want to improve my cardiovascular endurance",
      icon: "heart-pulse",
    },
    {
      id: "weight",
      title: "Lose Weight",
      description: "I want to lose weight and burn fat",
      icon: "scale-bathroom",
    },
  ];

  const handleAuth = async (): Promise<void> => {
    if (mode === "signup" && !termsAccepted) {
      error("Terms Required", "Please accept the terms and conditions");
      return;
    }

    if (mode === "signup" && formData.password !== formData.confirmPassword) {
      error("Password Mismatch", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const userData: User = {
        id: "1",
        username:
          mode === "signup" ? formData.firstName.toLowerCase() : "demo_user",
        email: formData.email,
        displayName:
          mode === "signup"
            ? `${formData.firstName} ${formData.lastName}`
            : "Demo User",
        avatar: `https://ui-avatars.com/api/?name=${
          mode === "signup"
            ? `${formData.firstName} ${formData.lastName}`
            : "Demo User"
        }&background=random`,
        bio: "",
        location: "",
        joinDate: new Date().toISOString(),
        isVerified: false,
        followers: 0,
        following: 0,
        posts: 0,
        fitnessGoals: selectedGoal ? [selectedGoal] : [],
        interests: [],
        level: "Beginner",
        achievements: [],
        stats: {
          totalWorkouts: 0,
          totalDistance: 0,
          totalCalories: 0,
          weeklyGoal: 3,
          weeklyProgress: 0,
          currentStreak: 0,
          longestStreak: 0,
        },
      };

      await login(userData, "mock-token");
      success("Welcome!", "Authentication successful");
    } catch (err) {
      error("Authentication Failed", "Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleGoalSelection = async (): Promise<void> => {
    if (!selectedGoal) {
      error("Goal Required", "Please select a fitness goal");
      return;
    }

    try {
      // This would typically save the goal to the user profile
      navigation.navigate("ProfileSetup");
    } catch (err) {
      error("Error", "Failed to save goal");
    }
  };

  if (mode === "welcome") {
    return (
      <LinearGradient colors={["#262135", "#3B2F4A"]} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.welcomeContainer}>
            <Icon name="dumbbell" size={80} color="#F6F3BA" />

            <Text style={[styles.welcomeTitle, { color: "#FFFFFF" }]}>
              Welcome to Fitness Community
            </Text>

            <Text
              style={[
                styles.welcomeSubtitle,
                { color: "rgba(255, 255, 255, 0.7)" },
              ]}
            >
              Join thousands of fitness enthusiasts on their journey to better
              health
            </Text>

            <View style={styles.authButtons}>
              <Button
                mode="contained"
                onPress={() => setMode("signup")}
                style={[styles.primaryButton, { backgroundColor: "#F6F3BA" }]}
                labelStyle={[styles.buttonLabel, { color: "#262135" }]}
              >
                Create Account
              </Button>

              <Button
                mode="outlined"
                onPress={() => setMode("login")}
                style={[styles.secondaryButton, { borderColor: "#F6F3BA" }]}
                labelStyle={[styles.buttonLabel, { color: "#F6F3BA" }]}
              >
                Login
              </Button>
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: "#4285F4" }]}
              >
                <Icon name="google" size={24} color="white" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: "#000000" }]}
              >
                <Icon name="apple" size={24} color="white" />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  if (mode === "goals") {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setMode("signup")}>
              <Icon name="arrow-left" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              What's your goal?
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <Text
            style={[styles.goalsSubtitle, { color: theme.colors.textMuted }]}
          >
            This will help us create a personalized experience for you
          </Text>

          <View style={styles.goalsContainer}>
            {goals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                onPress={() => setSelectedGoal(goal.id)}
                style={[
                  styles.goalCard,
                  {
                    backgroundColor:
                      selectedGoal === goal.id
                        ? theme.colors.accent
                        : theme.colors.surface,
                    borderColor:
                      selectedGoal === goal.id
                        ? theme.colors.accent
                        : theme.colors.border,
                  },
                ]}
              >
                <Icon
                  name={goal.icon}
                  size={40}
                  color={
                    selectedGoal === goal.id
                      ? theme.colors.primary
                      : theme.colors.text
                  }
                />
                <Text
                  style={[
                    styles.goalTitle,
                    {
                      color:
                        selectedGoal === goal.id
                          ? theme.colors.primary
                          : theme.colors.text,
                    },
                  ]}
                >
                  {goal.title}
                </Text>
                <Text
                  style={[
                    styles.goalDescription,
                    {
                      color:
                        selectedGoal === goal.id
                          ? theme.colors.primary
                          : theme.colors.textMuted,
                    },
                  ]}
                >
                  {goal.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button
            mode="contained"
            onPress={handleGoalSelection}
            disabled={!selectedGoal}
            style={[
              styles.confirmButton,
              { backgroundColor: theme.colors.accent },
            ]}
            labelStyle={[styles.buttonLabel, { color: theme.colors.primary }]}
          >
            Continue
          </Button>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: "#262135" }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMode("welcome")}>
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: "#FFFFFF" }]}>
            {mode === "signup" ? "Create Account" : "Welcome Back"}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <Card
          style={[
            styles.formCard,
            { backgroundColor: "rgba(255, 255, 255, 0.05)" },
          ]}
        >
          <Card.Content>
            {mode === "signup" && (
              <View style={styles.nameRow}>
                <TextInput
                  label="First Name"
                  value={formData.firstName}
                  onChangeText={(text: string) =>
                    setFormData({ ...formData, firstName: text })
                  }
                  style={styles.halfInput}
                  theme={paperTheme}
                />
                <TextInput
                  label="Last Name"
                  value={formData.lastName}
                  onChangeText={(text: string) =>
                    setFormData({ ...formData, lastName: text })
                  }
                  style={styles.halfInput}
                  theme={paperTheme}
                />
              </View>
            )}

            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(text: string) =>
                setFormData({ ...formData, email: text })
              }
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              theme={paperTheme}
            />

            <TextInput
              label="Password"
              value={formData.password}
              onChangeText={(text: string) =>
                setFormData({ ...formData, password: text })
              }
              secureTextEntry={secureTextEntry}
              right={
                <TextInput.Icon
                  icon={secureTextEntry ? "eye" : "eye-off"}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                />
              }
              style={styles.input}
              theme={paperTheme}
            />

            {mode === "signup" && (
              <TextInput
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(text: string) =>
                  setFormData({ ...formData, confirmPassword: text })
                }
                secureTextEntry={secureTextEntry}
                style={styles.input}
                theme={paperTheme}
              />
            )}

            {mode === "signup" && (
              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={termsAccepted ? "checked" : "unchecked"}
                  onPress={() => setTermsAccepted(!termsAccepted)}
                  color={theme.colors.accent}
                />
                <Text
                  style={[styles.checkboxText, { color: theme.colors.text }]}
                >
                  I accept the{" "}
                  <Text style={{ color: theme.colors.accent }}>
                    Terms & Conditions
                  </Text>
                </Text>
              </View>
            )}

            <Button
              mode="contained"
              onPress={() => setMode("goals")}
              loading={loading}
              style={[
                styles.authButton,
                { backgroundColor: theme.colors.accent },
              ]}
              labelStyle={[styles.buttonLabel, { color: theme.colors.primary }]}
            >
              {mode === "signup" ? "Create Account" : "Login"}
            </Button>

            <TouchableOpacity
              onPress={() => setMode(mode === "signup" ? "login" : "signup")}
              style={styles.switchMode}
            >
              <Text
                style={[
                  styles.switchModeText,
                  { color: theme.colors.textMuted },
                ]}
              >
                {mode === "signup"
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <Text style={{ color: theme.colors.accent }}>
                  {mode === "signup" ? "Login" : "Sign Up"}
                </Text>
              </Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 28,
    fontFamily: "MontserratAlternates-Bold",
    textAlign: "center",
    marginVertical: 20,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  authButtons: {
    width: "100%",
    gap: 12,
    marginBottom: 30,
  },
  primaryButton: {
    borderRadius: 25,
  },
  secondaryButton: {
    borderRadius: 25,
    borderWidth: 2,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 25,
    gap: 8,
  },
  socialButtonText: {
    color: "white",
    fontFamily: "MontserratAlternates-Medium",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "MontserratAlternates-Bold",
  },
  formCard: {
    borderRadius: 20,
    elevation: 4,
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxText: {
    marginLeft: 8,
    flex: 1,
  },
  authButton: {
    borderRadius: 25,
    marginBottom: 20,
  },
  switchMode: {
    alignItems: "center",
  },
  switchModeText: {
    fontSize: 14,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: "MontserratAlternates-Bold",
  },
  goalsSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  goalsContainer: {
    gap: 16,
    marginBottom: 40,
  },
  goalCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
  },
  goalTitle: {
    fontSize: 18,
    fontFamily: "MontserratAlternates-Bold",
    marginTop: 12,
    marginBottom: 8,
  },
  goalDescription: {
    fontSize: 14,
    textAlign: "center",
  },
  confirmButton: {
    borderRadius: 25,
  },
});

export default AuthScreen;
