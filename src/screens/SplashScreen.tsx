import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "react-native-paper";
import { useTheme } from "../contexts/ThemeContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";

const { width, height } = Dimensions.get("window");

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Splash"
>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <LinearGradient
      colors={["#262135", "#3B2F4A", "#262135"]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#262135" />

      {/* Background decorative elements */}
      <View style={styles.backgroundElements}>
        <View
          style={[
            styles.circle,
            styles.circle1,
            { backgroundColor: "rgba(255, 201, 233, 0.15)" },
          ]}
        />
        <View
          style={[
            styles.circle,
            styles.circle2,
            { backgroundColor: "rgba(246, 243, 186, 0.1)" },
          ]}
        />
        <View
          style={[
            styles.circle,
            styles.circle3,
            { backgroundColor: "rgba(214, 235, 235, 0.12)" },
          ]}
        />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* App Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: "rgba(246, 243, 186, 0.2)" },
          ]}
        >
          <Icon name="dumbbell" size={80} color="#F6F3BA" />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: "#FFFFFF" }]}>
          Start your{"\n"}
          <Text style={{ color: "#F6F3BA" }}>Fitness Journey</Text>
        </Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: "rgba(255, 255, 255, 0.7)" }]}>
          Join a community of fitness enthusiasts. Share your progress, find
          workout partners, and achieve your goals together.
        </Text>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {[
            "Connect with fitness communities",
            "Track your progress and achievements",
            "Find workout partners near you",
            "Share your fitness journey",
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View
                style={[styles.featureDot, { backgroundColor: "#F6F3BA" }]}
              />
              <Text
                style={[
                  styles.featureText,
                  { color: "rgba(255, 255, 255, 0.7)" },
                ]}
              >
                {feature}
              </Text>
            </View>
          ))}
        </View>

        {/* Get Started Button */}
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Auth")}
          style={[styles.getStartedButton, { backgroundColor: "#F6F3BA" }]}
          labelStyle={[styles.buttonLabel, { color: "#262135" }]}
          contentStyle={styles.buttonContent}
        >
          Get Started
        </Button>

        {/* Bottom indicators */}
        <View style={styles.indicators}>
          <View
            style={[
              styles.indicator,
              { backgroundColor: "rgba(255, 255, 255, 0.3)" },
            ]}
          />
          <View
            style={[
              styles.indicator,
              { backgroundColor: "rgba(255, 255, 255, 0.3)" },
            ]}
          />
          <View
            style={[styles.indicatorActive, { backgroundColor: "#F6F3BA" }]}
          />
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundElements: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  circle: {
    position: "absolute",
    borderRadius: 200,
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    left: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: -50,
    right: -50,
  },
  circle3: {
    width: 150,
    height: 150,
    top: "40%",
    right: -75,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 40,
    padding: 20,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: 42,
    fontFamily: "MontserratAlternates-Bold",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 50,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
    maxWidth: 320,
  },
  featuresContainer: {
    alignSelf: "stretch",
    marginBottom: 50,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  getStartedButton: {
    marginBottom: 30,
    borderRadius: 25,
    elevation: 0,
  },
  buttonContent: {
    paddingHorizontal: 40,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: "MontserratAlternates-Bold",
  },
  indicators: {
    flexDirection: "row",
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  indicatorActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
  },
});

export default SplashScreen;
