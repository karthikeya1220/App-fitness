import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  Users,
  Activity,
} from "lucide-react";
import { Notification, getUserById } from "@/lib/mockData";
import { formatDistanceToNow } from "date-fns";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (notificationId: string) => void;
  onAction?: (notificationId: string, action: string) => void;
}

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onAction,
}: NotificationItemProps) => {
  const fromUser = getUserById(notification.fromUserId);

  if (!fromUser) return null;

  const getIcon = () => {
    switch (notification.type) {
      case "like":
        return <Heart className="w-5 h-5 text-red-400" />;
      case "comment":
        return <MessageCircle className="w-5 h-5 text-app-teal" />;
      case "follow":
        return <UserPlus className="w-5 h-5 text-app-pink" />;
      case "mention":
        return <AtSign className="w-5 h-5 text-app-yellow" />;
      case "group_join":
        return <Users className="w-5 h-5 text-app-teal" />;
      case "group_activity":
        return <Activity className="w-5 h-5 text-white/60" />;
      default:
        return <Activity className="w-5 h-5 text-white/60" />;
    }
  };

  const getActionText = () => {
    switch (notification.type) {
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "follow":
        return "started following you";
      case "mention":
        return "mentioned you in a post";
      case "group_join":
        return "joined your group";
      case "group_activity":
        return "new activity in your group";
      default:
        return "interacted with your content";
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
        notification.isRead
          ? "bg-white/5"
          : "bg-app-yellow/10 border border-app-yellow/20"
      }`}
    >
      {/* Avatar */}
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarImage src={fromUser.avatar} alt={fromUser.name} />
        <AvatarFallback className="bg-app-pink text-app-primary">
          {fromUser.name.charAt(0)}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-white text-sm">
              <span className="font-semibold">{fromUser.name}</span>{" "}
              <span className="text-white/70">{getActionText()}</span>
            </p>
            <p className="text-white/50 text-xs mt-1">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>

          {/* Action Icon */}
          <div className="flex-shrink-0">{getIcon()}</div>
        </div>

        {/* Action Buttons for certain notification types */}
        {(notification.type === "follow" ||
          notification.type === "group_join") && (
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              className="bg-app-yellow text-app-primary hover:bg-app-yellow/90 px-4 py-1 h-8 text-xs"
              onClick={() => onAction?.(notification.id, "accept")}
            >
              {notification.type === "follow" ? "Follow Back" : "View Group"}
            </Button>
            {notification.type === "group_join" && (
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-white/70 hover:bg-white/10 px-4 py-1 h-8 text-xs"
                onClick={() => onAction?.(notification.id, "view")}
              >
                View Request
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="w-2 h-2 bg-app-yellow rounded-full flex-shrink-0 mt-2" />
      )}
    </div>
  );
};

export default NotificationItem;
