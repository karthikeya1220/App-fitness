import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Zap,
  Award,
  Users,
  Clock,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

interface StatItem {
  id: string;
  label: string;
  value: string | number;
  subValue?: string;
  progress?: number;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  target?: number;
}

const QuickStatsWidget = () => {
  const [activeTime, setActiveTime] = useState<"today" | "week" | "month">(
    "today",
  );

  const stats: StatItem[] = [
    {
      id: "workouts",
      label: "Workouts",
      value: activeTime === "today" ? 1 : activeTime === "week" ? 5 : 18,
      subValue:
        activeTime === "today"
          ? "Today"
          : activeTime === "week"
            ? "This Week"
            : "This Month",
      progress: activeTime === "today" ? 33 : activeTime === "week" ? 71 : 85,
      trend: "up",
      trendValue: "+12%",
      icon: Zap,
      color: "#F59E0B",
      target: activeTime === "today" ? 3 : activeTime === "week" ? 7 : 22,
    },
    {
      id: "streak",
      label: "Streak",
      value: 5,
      subValue: "Days",
      progress: 83,
      trend: "up",
      trendValue: "+2",
      icon: Target,
      color: "#EF4444",
      target: 6,
    },
    {
      id: "calories",
      label: "Calories",
      value: activeTime === "today" ? 320 : activeTime === "week" ? 2240 : 8960,
      subValue: "Burned",
      progress: activeTime === "today" ? 64 : activeTime === "week" ? 78 : 89,
      trend: "up",
      trendValue: "+5%",
      icon: TrendingUp,
      color: "#10B981",
      target:
        activeTime === "today" ? 500 : activeTime === "week" ? 2800 : 10000,
    },
    {
      id: "groups",
      label: "Groups",
      value: 3,
      subValue: "Active",
      progress: 60,
      trend: "stable",
      icon: Users,
      color: "#8B5CF6",
      target: 5,
    },
  ];

  const weeklyProgress = [
    { day: "Mon", value: 85 },
    { day: "Tue", value: 92 },
    { day: "Wed", value: 78 },
    { day: "Thu", value: 95 },
    { day: "Fri", value: 88 },
    { day: "Sat", value: 70 },
    { day: "Sun", value: 45 },
  ];

  return (
    <Card className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Quick Stats
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your fitness progress overview
            </p>
          </div>
          <Link to="/statistics">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View All
            </Button>
          </Link>
        </div>

        {/* Time Period Selector */}
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-6">
          {[
            { id: "today", label: "Today" },
            { id: "week", label: "Week" },
            { id: "month", label: "Month" },
          ].map((period) => (
            <Button
              key={period.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTime(period.id as any)}
              className={`flex-1 rounded-lg text-sm transition-all ${
                activeTime === period.id
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {period.label}
            </Button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.id}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <IconComponent
                      className="w-4 h-4"
                      style={{ color: stat.color }}
                    />
                  </div>
                  {stat.trend && (
                    <div
                      className={`flex items-center text-xs ${
                        stat.trend === "up"
                          ? "text-green-600 dark:text-green-400"
                          : stat.trend === "down"
                            ? "text-red-600 dark:text-red-400"
                            : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : stat.trend === "down" ? (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      ) : null}
                      {stat.trendValue}
                    </div>
                  )}
                </div>

                <div className="mb-2">
                  <div className="text-xl font-bold text-slate-900 dark:text-white">
                    {typeof stat.value === "number"
                      ? stat.value.toLocaleString()
                      : stat.value}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {stat.subValue}
                  </div>
                </div>

                {stat.progress && (
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: stat.color,
                        width: `${stat.progress}%`,
                      }}
                    />
                  </div>
                )}

                {stat.target && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Goal: {stat.target}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Weekly Activity Chart */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
            This Week's Activity
          </h4>
          <div className="flex items-end gap-2 h-20">
            {weeklyProgress.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-app-yellow to-app-teal rounded-t opacity-80 transition-all duration-300 hover:opacity-100"
                  style={{ height: `${day.value}%` }}
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                Weekly Goal Progress
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                4 of 7 days completed
              </p>
            </div>
            <ProgressRing
              progress={75}
              size={50}
              strokeWidth={4}
              showPercentage={false}
              color="#F6F3BA"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStatsWidget;
