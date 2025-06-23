import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme as usePaperTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useAuth } from "../contexts/AuthContext";
import { useSocialData } from "../contexts/SocialDataContext";

// Import screens
import SplashScreen from "../screens/SplashScreen";
import AuthScreen from "../screens/AuthScreen";
import ProfileSetupScreen from "../screens/ProfileSetupScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ExploreGroupsScreen from "../screens/ExploreGroupsScreen";
import GroupScreen from "../screens/GroupScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import MessagingScreen from "../screens/MessagingScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import StatisticsScreen from "../screens/StatisticsScreen";
import AdminPanelScreen from "../screens/AdminPanelScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const theme = usePaperTheme();
  const { unreadNotifications } = useSocialData();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Dashboard":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Explore":
              iconName = focused ? "magnify" : "magnify";
              break;
            case "Statistics":
              iconName = focused ? "chart-line" : "chart-line-stacked";
              break;
            case "Notifications":
              iconName = focused ? "bell" : "bell-outline";
              break;
            case "Profile":
              iconName = focused ? "account" : "account-outline";
              break;
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
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarBadge:
            unreadNotifications?.length > 0 ? unreadNotifications.length : null,
        }}
      />
      <Tab.Screen name="Profile" component={UserProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, hasCompletedSetup } = useAuth();
  const theme = usePaperTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
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
          <Stack.Screen name="Messages" component={MessagingScreen} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
