import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";

const { width, height } = Dimensions.get("window");

type StatisticsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Statistics"
>;

interface Props {
  navigation: StatisticsScreenNavigationProp;
}

const StatisticsScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<"day" | "week" | "month">("week");
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/* Background blur effects */}
      <View style={[styles.blurCircle, styles.blurCircle1]} />
      <View style={[styles.blurCircle, styles.blurCircle2]} />
      <View style={[styles.blurCircle, styles.blurCircle3]} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "2-digit",
                year: "numeric",
              })}
            </Text>
            <Text style={styles.titleText}>Your Statistics</Text>
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.weeklyAverageLabel}>Weekly Average</Text>
            <Text style={styles.weeklyAverageValue}>284 CAL</Text>
            <View style={styles.trendIconContainer}>
              <Icon name="trending-up" size={20} color="#262135" />
            </View>
          </View>
        </View>

        {/* Tab selector */}
        <View style={styles.tabSelector}>
          {(["day", "week", "month"] as const).map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setActiveTab(period)}
              style={[
                styles.tabButton,
                activeTab === period && styles.tabButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === period && styles.tabButtonTextActive,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Chart Section */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Calories Burned</Text>
              <Text style={styles.chartSubtitle}>1,842 cal this week</Text>
            </View>
            <View style={styles.chartTrend}>
              <Icon name="flame" size={20} color="#EF4444" />
              <Text style={styles.chartTrendText}>+12% vs last week</Text>
            </View>
          </View>

          {/* Chart bars */}
          <View style={styles.chartBars}>
            {[180, 220, 280, 320, 380, 280, 320].map((height, index) => (
              <View key={index} style={styles.chartBarContainer}>
                <View
                  style={[
                    styles.chartBar,
                    {
                      height: `${(height / 400) * 100}%`,
                      backgroundColor:
                        index === 4 ? "#262135" : "rgba(38, 33, 53, 0.3)",
                    },
                  ]}
                />
              </View>
            ))}
          </View>

          {/* Chart labels */}
          <View style={styles.chartLabels}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day, index) => (
                <Text
                  key={day}
                  style={[
                    styles.chartLabel,
                    index === 4 && styles.chartLabelActive,
                  ]}
                >
                  {day}
                </Text>
              ),
            )}
          </View>
        </View>

        {/* Enhanced Stats Cards */}
        <View style={styles.statsGrid}>
          {/* Workouts Card */}
          <View style={[styles.statCard, styles.workoutsCard]}>
            <View style={styles.statCardHeader}>
              <View style={styles.statIconContainer}>
                <Icon name="dumbbell" size={24} color="#D6EBEB" />
              </View>
              <View style={styles.statCardInfo}>
                <Text style={styles.statCardLabel}>Workouts</Text>
                <Text style={styles.statCardValue}>12 this week</Text>
              </View>
            </View>

            {/* Mini chart */}
            <View style={styles.miniChart}>
              {[40, 60, 45, 70, 85, 65, 75].map((height, i) => (
                <View
                  key={i}
                  style={[
                    styles.miniChartBar,
                    {
                      height: `${height}%`,
                      backgroundColor: "#D6EBEB",
                    },
                  ]}
                />
              ))}
            </View>

            <View style={styles.statCardFooter}>
              <Text style={styles.statCardProgress}>85% of goal</Text>
              <View style={styles.statCardTrend}>
                <Icon name="trending-up" size={12} color="#22C55E" />
                <Text style={styles.statCardTrendText}>+8%</Text>
              </View>
            </View>
          </View>

          {/* Distance Card */}
          <View style={[styles.statCard, styles.distanceCard]}>
            <View style={styles.statCardHeader}>
              <View style={styles.statIconContainer}>
                <Icon name="run" size={24} color="#FFC9E9" />
              </View>
              <View style={styles.statCardInfo}>
                <Text style={styles.statCardLabel}>Distance</Text>
                <Text style={styles.statCardValue}>24.5 km</Text>
              </View>
            </View>

            {/* Mini chart - different style */}
            <View style={styles.miniChart}>
              {[25, 35, 45, 40, 55, 48].map((height, i) => (
                <View
                  key={i}
                  style={[
                    styles.miniChartBarWide,
                    {
                      height: `${height}%`,
                      backgroundColor: "rgba(255, 201, 233, 0.8)",
                    },
                  ]}
                />
              ))}
            </View>

            <View style={styles.statCardFooter}>
              <Text style={styles.statCardProgress}>Goal: 30 km</Text>
              <View style={styles.statCardTrend}>
                <Icon name="trending-up" size={12} color="#22C55E" />
                <Text style={styles.statCardTrendText}>+15%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Additional Stats Grid */}
        <View style={styles.additionalStatsGrid}>
          {[
            {
              label: "Streak",
              value: "7",
              unit: "days",
              icon: "flame",
              color: "#EF4444",
            },
            {
              label: "Best",
              value: "450",
              unit: "cal",
              icon: "trophy",
              color: "#F6F3BA",
            },
            {
              label: "Avg",
              value: "38",
              unit: "min",
              icon: "clock",
              color: "#D6EBEB",
            },
            {
              label: "Total",
              value: "2.1k",
              unit: "cal",
              icon: "chart-bar",
              color: "#FFC9E9",
            },
          ].map((stat, index) => (
            <View key={index} style={styles.additionalStatCard}>
              <Icon name={stat.icon} size={16} color={stat.color} />
              <Text style={styles.additionalStatValue}>{stat.value}</Text>
              <Text style={[styles.additionalStatUnit, { color: stat.color }]}>
                {stat.unit}
              </Text>
              <Text style={styles.additionalStatLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#262135",
  },
  blurCircle: {
    position: "absolute",
    borderRadius: 200,
  },
  blurCircle1: {
    width: 300,
    height: 300,
    top: -100,
    left: -100,
    backgroundColor: "rgba(255, 201, 233, 0.15)",
  },
  blurCircle2: {
    width: 250,
    height: 250,
    top: height * 0.3,
    right: -80,
    backgroundColor: "rgba(246, 243, 186, 0.1)",
  },
  blurCircle3: {
    width: 300,
    height: 300,
    bottom: -120,
    left: width * 0.2,
    backgroundColor: "rgba(214, 235, 235, 0.12)",
  },
  content: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  headerLeft: {
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Medium",
    color: "rgba(255, 255, 255, 0.6)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  titleText: {
    fontSize: 32,
    fontFamily: "MontserratAlternates-Bold",
    color: "#FFFFFF",
    lineHeight: 38,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  weeklyAverageLabel: {
    fontSize: 12,
    fontFamily: "MontserratAlternates-Medium",
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 4,
  },
  weeklyAverageValue: {
    fontSize: 20,
    fontFamily: "MontserratAlternates-Bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  trendIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFC9E9",
    alignItems: "center",
    justifyContent: "center",
  },
  tabSelector: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 24,
    padding: 4,
    marginHorizontal: 24,
    marginBottom: 32,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#F6F3BA",
  },
  tabButtonText: {
    fontSize: 16,
    fontFamily: "MontserratAlternates-Medium",
    color: "rgba(255, 255, 255, 0.7)",
  },
  tabButtonTextActive: {
    color: "#262135",
    fontFamily: "MontserratAlternates-Bold",
  },
  chartCard: {
    backgroundColor: "#F6F3BA",
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 32,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 20,
    fontFamily: "MontserratAlternates-Medium",
    color: "#262135",
  },
  chartSubtitle: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Regular",
    color: "rgba(38, 33, 53, 0.7)",
    marginTop: 4,
  },
  chartTrend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chartTrendText: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Medium",
    color: "#262135",
  },
  chartBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 120,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  chartBar: {
    width: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    minHeight: 8,
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  chartLabel: {
    fontSize: 12,
    fontFamily: "MontserratAlternates-Regular",
    color: "#262135",
    opacity: 0.7,
  },
  chartLabelActive: {
    fontFamily: "MontserratAlternates-Bold",
    opacity: 1,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
  },
  workoutsCard: {
    backgroundColor: "rgba(214, 235, 235, 0.2)",
  },
  distanceCard: {
    backgroundColor: "rgba(255, 201, 233, 0.15)",
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
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  statCardInfo: {
    flex: 1,
  },
  statCardLabel: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Medium",
    color: "rgba(255, 255, 255, 0.7)",
  },
  statCardValue: {
    fontSize: 18,
    fontFamily: "MontserratAlternates-Bold",
    color: "#FFFFFF",
    marginTop: 2,
  },
  miniChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
    height: 40,
    marginBottom: 12,
  },
  miniChartBar: {
    width: 8,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    minHeight: 4,
  },
  miniChartBarWide: {
    width: 12,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    minHeight: 6,
  },
  statCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statCardProgress: {
    fontSize: 14,
    fontFamily: "MontserratAlternates-Medium",
    color: "#FFFFFF",
  },
  statCardTrend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statCardTrendText: {
    fontSize: 12,
    fontFamily: "MontserratAlternates-Medium",
    color: "#22C55E",
  },
  additionalStatsGrid: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  additionalStatCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  additionalStatValue: {
    fontSize: 18,
    fontFamily: "MontserratAlternates-Bold",
    color: "#FFFFFF",
    marginTop: 8,
    marginBottom: 2,
  },
  additionalStatUnit: {
    fontSize: 10,
    fontFamily: "MontserratAlternates-Medium",
    marginBottom: 4,
  },
  additionalStatLabel: {
    fontSize: 10,
    fontFamily: "MontserratAlternates-Medium",
    color: "rgba(255, 255, 255, 0.6)",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default StatisticsScreen;
