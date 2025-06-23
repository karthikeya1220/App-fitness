import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Card,
  Switch,
  Button,
  Avatar,
  List,
  RadioButton,
  Divider,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, AppSettings } from "../types";

type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Settings"
>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout, updateProfile } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const { success, error } = useToast();

  const [settings, setSettings] = useState<AppSettings>({
    notifications: {
      pushEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
      likes: true,
      comments: true,
      follows: true,
      groupInvites: true,
      workoutReminders: true,
    },
    privacy: {
      profileVisibility: "public",
      activityVisibility: "public",
      allowGroupInvites: true,
      allowDirectMessages: true,
    },
    preferences: {
      language: "en",
      units: "metric",
      autoplayVideos: true,
      dataSaver: false,
    },
  });

  const handleLogout = (): void => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              success("Logged out", "See you next time!");
            } catch (err) {
              error("Error", "Failed to logout");
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleDeleteAccount = (): void => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Implement account deletion
            error("Not Available", "Account deletion is not available yet");
          },
        },
      ],
      { cancelable: true },
    );
  };

  const updateSetting = (
    category: keyof AppSettings,
    key: string,
    value: any,
  ): void => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    success("Updated", "Settings saved successfully");
  };

  const SettingsSection: React.FC<{
    title: string;
    children: React.ReactNode;
  }> = ({ title, children }) => (
    <Card
      style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}
    >
      <Card.Content>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        {children}
      </Card.Content>
    </Card>
  );

  const SettingsItem: React.FC<{
    title: string;
    subtitle?: string;
    icon: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
  }> = ({ title, subtitle, icon, onPress, rightElement }) => (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <Icon name={icon} size={24} color={theme.colors.text} />
      <View style={styles.settingsItemContent}>
        <Text style={[styles.settingsItemTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              styles.settingsItemSubtitle,
              { color: theme.colors.textMuted },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement || (
        <Icon name="chevron-right" size={20} color={theme.colors.textMuted} />
      )}
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
          Settings
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <SettingsSection title="Profile">
          <TouchableOpacity
            style={styles.profileSection}
            onPress={() =>
              navigation.navigate("UserProfile", { userId: user?.id || "1" })
            }
          >
            <Avatar.Image
              size={60}
              source={{ uri: user?.avatar }}
              style={styles.profileAvatar}
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.colors.text }]}>
                {user?.displayName}
              </Text>
              <Text
                style={[styles.profileEmail, { color: theme.colors.textMuted }]}
              >
                {user?.email}
              </Text>
              <Text
                style={[styles.profileEdit, { color: theme.colors.accent }]}
              >
                Edit Profile
              </Text>
            </View>
            <Icon
              name="chevron-right"
              size={20}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection title="Appearance">
          <SettingsItem
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            icon="theme-light-dark"
            rightElement={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                color={theme.colors.accent}
              />
            }
          />
          <SettingsItem
            title="Language"
            subtitle="English"
            icon="translate"
            onPress={() =>
              error("Coming Soon", "Language settings coming soon")
            }
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications">
          <SettingsItem
            title="Push Notifications"
            subtitle="Receive notifications on your device"
            icon="bell"
            rightElement={
              <Switch
                value={settings.notifications.pushEnabled}
                onValueChange={(value) =>
                  updateSetting("notifications", "pushEnabled", value)
                }
                color={theme.colors.accent}
              />
            }
          />
          <SettingsItem
            title="Sound"
            subtitle="Play sounds for notifications"
            icon="volume-high"
            rightElement={
              <Switch
                value={settings.notifications.soundEnabled}
                onValueChange={(value) =>
                  updateSetting("notifications", "soundEnabled", value)
                }
                color={theme.colors.accent}
              />
            }
          />
          <SettingsItem
            title="Likes & Comments"
            subtitle="When someone likes or comments on your posts"
            icon="heart"
            rightElement={
              <Switch
                value={settings.notifications.likes}
                onValueChange={(value) =>
                  updateSetting("notifications", "likes", value)
                }
                color={theme.colors.accent}
              />
            }
          />
          <SettingsItem
            title="Workout Reminders"
            subtitle="Daily workout reminder notifications"
            icon="dumbbell"
            rightElement={
              <Switch
                value={settings.notifications.workoutReminders}
                onValueChange={(value) =>
                  updateSetting("notifications", "workoutReminders", value)
                }
                color={theme.colors.accent}
              />
            }
          />
        </SettingsSection>

        {/* Privacy */}
        <SettingsSection title="Privacy & Security">
          <SettingsItem
            title="Profile Visibility"
            subtitle={`Currently ${settings.privacy.profileVisibility}`}
            icon="account"
            onPress={() => error("Coming Soon", "Privacy settings coming soon")}
          />
          <SettingsItem
            title="Activity Visibility"
            subtitle="Who can see your workout activities"
            icon="eye"
            onPress={() => error("Coming Soon", "Privacy settings coming soon")}
          />
          <SettingsItem
            title="Allow Group Invites"
            subtitle="Let others invite you to groups"
            icon="account-group"
            rightElement={
              <Switch
                value={settings.privacy.allowGroupInvites}
                onValueChange={(value) =>
                  updateSetting("privacy", "allowGroupInvites", value)
                }
                color={theme.colors.accent}
              />
            }
          />
          <SettingsItem
            title="Direct Messages"
            subtitle="Allow others to message you directly"
            icon="message"
            rightElement={
              <Switch
                value={settings.privacy.allowDirectMessages}
                onValueChange={(value) =>
                  updateSetting("privacy", "allowDirectMessages", value)
                }
                color={theme.colors.accent}
              />
            }
          />
        </SettingsSection>

        {/* Preferences */}
        <SettingsSection title="Preferences">
          <SettingsItem
            title="Units"
            subtitle={`${settings.preferences.units === "metric" ? "Metric (kg, km)" : "Imperial (lb, mi)"}`}
            icon="ruler"
            onPress={() =>
              updateSetting(
                "preferences",
                "units",
                settings.preferences.units === "metric" ? "imperial" : "metric",
              )
            }
          />
          <SettingsItem
            title="Autoplay Videos"
            subtitle="Automatically play videos in feed"
            icon="play"
            rightElement={
              <Switch
                value={settings.preferences.autoplayVideos}
                onValueChange={(value) =>
                  updateSetting("preferences", "autoplayVideos", value)
                }
                color={theme.colors.accent}
              />
            }
          />
          <SettingsItem
            title="Data Saver"
            subtitle="Reduce data usage"
            icon="cloud-download"
            rightElement={
              <Switch
                value={settings.preferences.dataSaver}
                onValueChange={(value) =>
                  updateSetting("preferences", "dataSaver", value)
                }
                color={theme.colors.accent}
              />
            }
          />
        </SettingsSection>

        {/* Support */}
        <SettingsSection title="Support & Info">
          <SettingsItem
            title="Help Center"
            subtitle="Get help and support"
            icon="help-circle"
            onPress={() => error("Coming Soon", "Help center coming soon")}
          />
          <SettingsItem
            title="Contact Support"
            subtitle="Get in touch with our team"
            icon="email"
            onPress={() => error("Coming Soon", "Contact support coming soon")}
          />
          <SettingsItem
            title="Terms of Service"
            subtitle="Read our terms and conditions"
            icon="file-document"
            onPress={() => error("Coming Soon", "Terms of service coming soon")}
          />
          <SettingsItem
            title="Privacy Policy"
            subtitle="How we handle your data"
            icon="shield-account"
            onPress={() => error("Coming Soon", "Privacy policy coming soon")}
          />
          <SettingsItem
            title="About"
            subtitle="App version and information"
            icon="information"
            onPress={() => success("Version", "Fitness Community v1.0.0")}
          />
        </SettingsSection>

        {/* Account Actions */}
        <SettingsSection title="Account">
          <SettingsItem
            title="Export Data"
            subtitle="Download your account data"
            icon="download"
            onPress={() => error("Coming Soon", "Data export coming soon")}
          />
          <SettingsItem
            title="Logout"
            subtitle="Sign out of your account"
            icon="logout"
            onPress={handleLogout}
          />
          <SettingsItem
            title="Delete Account"
            subtitle="Permanently delete your account"
            icon="delete"
            onPress={handleDeleteAccount}
            rightElement={
              <Icon name="alert" size={20} color={theme.colors.error} />
            }
          />
        </SettingsSection>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionCard: {
    marginBottom: 20,
    borderRadius: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "MontserratAlternates-Bold",
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  profileAvatar: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontFamily: "MontserratAlternates-Bold",
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    marginBottom: 4,
  },
  profileEdit: {
    fontSize: 12,
    fontFamily: "MontserratAlternates-Medium",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  settingsItemContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingsItemTitle: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Medium",
    marginBottom: 2,
  },
  settingsItemSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default SettingsScreen;
