import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme as usePaperTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { RootStackParamList, TabParamList } from "../types";

// Import screens
import SplashScreen from "../screens/SplashScreen";
import AuthScreen from "../screens/AuthScreen";
import ProfileSetupScreen from "../screens/ProfileSetupScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ExploreGroupsScreen from "../screens/ExploreGroupsScreen";
import GroupScreen from "../screens/GroupScreen";
import CreatePostScreen from "../screens/CreatePostScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import MessagingScreen from "../screens/MessagingScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AdminPanelScreen from "../screens/AdminPanelScreen";
import StatisticsScreen from "../screens/StatisticsScreen";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const MainTabNavigator: React.FC = () => {
  const theme = usePaperTheme();
  const { unreadCount } = useSelector((state: RootState) => state.notifications);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case "Dashboard":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Explore":
              iconName = focused ? "magnify" : "magnify";
              break;
            case "Statistics":
              iconName = focused ? "chart-line" : "chart-line-variant";
              break;
            case "Messages":
              iconName = focused ? "message" : "message-outline";
              break;
            case "Profile":
              iconName = focused ? "account" : "account-outline";
              break;
            default:
              iconName = "help";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "MontserratAlternates-Medium",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Explore" component={ExploreGroupsScreen} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
      <Tab.Screen 
        name="Messages" 
        component={MessagingScreen}
        options={{
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />
      <Tab.Screen name="Profile" component={UserProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const { isAuthenticated, hasCompletedSetup } = useSelector((state: RootState) => state.auth);
  const theme = usePaperTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
        </>
      ) : !hasCompletedSetup ? (
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="Group" component={GroupScreen} />
          <Stack.Screen name="CreatePost" component={CreatePostScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Messaging" component={MessagingScreen} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} />
          <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
