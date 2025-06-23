import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  UserPlus,
  Trophy,
  Zap,
  Target,
  TrendingUp,
  Clock,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { mockUsers } from "@/lib/mockData";

interface Activity {
  id: string;
  type:
    | "workout_completed"
    | "goal_achieved"
    | "friend_joined"
    | "milestone_reached"
    | "group_activity"
    | "challenge_completed";
  userId: string;
  content: string;
  metadata?: {
    workoutType?: string;
    duration?: number;
    calories?: number;
    goal?: string;
    achievement?: string;
    groupName?: string;
  };
  timestamp: string;
  isNew?: boolean;
}

const ActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Mock activity data
  const mockActivities: Activity[] = [
    {
      id: "1",
      type: "workout_completed",
      userId: "2",
      content: "Completed a 45-minute HIIT session",
      metadata: {
        workoutType: "HIIT",
        duration: 45,
        calories: 380,
      },
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      isNew: true,
    },
    {
      id: "2",
      type: "goal_achieved",
      userId: "3",
      content: "Reached weekly running goal",
      metadata: {
        goal: "Run 25km this week",
      },
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      type: "milestone_reached",
      userId: "1",
      content: "Reached 100-day fitness streak!",
      metadata: {
        achievement: "100-day streak",
      },
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      type: "friend_joined",
      userId: "4",
      content: "Joined the fitness community",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "5",
      type: "group_activity",
      userId: "2",
      content: "Created a new workout challenge",
      metadata: {
        groupName: "HIIT Warriors",
      },
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
  ];

  useEffect(() => {
    setActivities(mockActivities);

    // Simulate real-time updates
    if (isLive) {
      const interval = setInterval(() => {
        const newActivity: Activity = {
          id: `new_${Date.now()}`,
          type: "workout_completed",
          userId: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
          content: `Completed a ${
            ["HIIT", "Yoga", "Running", "Strength"][
              Math.floor(Math.random() * 4)
            ]
          } session`,
          metadata: {
            duration: Math.floor(Math.random() * 60) + 20,
            calories: Math.floor(Math.random() * 400) + 200,
          },
          timestamp: new Date().toISOString(),
          isNew: true,
        };

        setActivities((prev) => [newActivity, ...prev.slice(0, 9)]);

        // Remove "new" flag after 5 seconds
        setTimeout(() => {
          setActivities((prev) =>
            prev.map((activity) =>
              activity.id === newActivity.id
                ? { ...activity, isNew: false }
                : activity,
            ),
          );
        }, 5000);
      }, 30000); // New activity every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isLive]);

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "workout_completed":
        return <Zap className="w-4 h-4 text-yellow-500" />;
      case "goal_achieved":
        return <Target className="w-4 h-4 text-green-500" />;
      case "milestone_reached":
        return <Trophy className="w-4 h-4 text-orange-500" />;
      case "friend_joined":
        return <UserPlus className="w-4 h-4 text-blue-500" />;
      case "group_activity":
        return <TrendingUp className="w-4 h-4 text-purple-500" />;
      default:
        return <Heart className="w-4 h-4 text-pink-500" />;
    }
  };

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "workout_completed":
        return "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "goal_achieved":
        return "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "milestone_reached":
        return "bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
      case "friend_joined":
        return "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      case "group_activity":
        return "bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800";
      default:
        return "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <Card className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-2xl">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Live Activity Feed
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Real-time updates from your community
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isLive ? "bg-green-500 animate-pulse" : "bg-slate-400"
              }`}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              {isLive ? "Live" : "Paused"}
            </Button>
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.map((activity) => {
            const user = mockUsers.find((u) => u.id === activity.userId);
            if (!user) return null;

            return (
              <div
                key={activity.id}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 ${
                  activity.isNew
                    ? "scale-105 shadow-lg " + getActivityColor(activity.type)
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                }`}
              >
                {/* User Avatar */}
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-app-pink text-app-primary">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">
                        {user.name}
                      </span>
                      {getActivityIcon(activity.type)}
                      {activity.isNew && (
                        <Badge className="bg-green-500 text-white text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                    {activity.content}
                  </p>

                  {/* Metadata */}
                  {activity.metadata && (
                    <div className="flex flex-wrap gap-2">
                      {activity.metadata.duration && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-white dark:bg-slate-800"
                        >
                          {activity.metadata.duration}min
                        </Badge>
                      )}
                      {activity.metadata.calories && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-white dark:bg-slate-800"
                        >
                          {activity.metadata.calories} cal
                        </Badge>
                      )}
                      {activity.metadata.workoutType && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-white dark:bg-slate-800"
                        >
                          {activity.metadata.workoutType}
                        </Badge>
                      )}
                      {activity.metadata.groupName && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-white dark:bg-slate-800"
                        >
                          {activity.metadata.groupName}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex-shrink-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            className="border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            View All Activity
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
