import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Lock, Globe, TrendingUp } from "lucide-react";
import { Group } from "@/lib/mockData";
import { Link } from "react-router-dom";

interface GroupCardProps {
  group: Group;
  onJoin?: (groupId: string) => void;
  isJoined?: boolean;
  showJoinButton?: boolean;
}

const GroupCard = ({
  group,
  onJoin,
  isJoined = false,
  showJoinButton = true,
}: GroupCardProps) => {
  return (
    <Link to={`/group/${group.id}`}>
      <Card className="bg-white/5 dark:bg-white/5 light:bg-app-surface border-white/10 dark:border-white/10 light:border-app-border-theme text-white dark:text-white light:text-app-text backdrop-blur-sm overflow-hidden hover:bg-white/8 dark:hover:bg-white/8 light:hover:bg-app-surface-hover hover:border-white/20 dark:hover:border-white/20 light:hover:border-app-border-theme transition-all duration-300 rounded-2xl md:rounded-3xl group cursor-pointer">
        {/* Cover Image */}
        <div className="aspect-video relative overflow-hidden">
          <img
            src={group.coverImage}
            alt={group.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Overlay badges */}
          <div className="absolute top-3 md:top-4 left-3 md:left-4 right-3 md:right-4 flex items-center justify-between">
            {/* Category badge */}
            <Badge className="bg-app-yellow text-app-primary font-semibold px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm rounded-full">
              {group.category}
            </Badge>

            {/* Privacy indicator */}
            <Badge
              variant={group.isPrivate ? "destructive" : "secondary"}
              className={`flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm rounded-full ${
                group.isPrivate
                  ? "bg-red-500/80 text-white border border-red-400/50"
                  : "bg-green-500/80 text-white border border-green-400/50"
              }`}
            >
              {group.isPrivate ? (
                <Lock className="w-3 h-3 md:w-4 md:h-4" />
              ) : (
                <Globe className="w-3 h-3 md:w-4 md:h-4" />
              )}
              <span className="hidden sm:inline">
                {group.isPrivate ? "Private" : "Public"}
              </span>
            </Badge>
          </div>

          {/* Member count overlay */}
          <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4">
            <div className="flex items-center gap-1 md:gap-2 bg-black/50 backdrop-blur-sm rounded-full px-2 md:px-3 py-1 md:py-1.5">
              <Users className="w-3 h-3 md:w-4 md:h-4 text-white" />
              <span className="text-white text-xs md:text-sm font-medium">
                {group.memberCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Trending indicator for popular groups */}
          {group.memberCount > 1000 && (
            <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4">
              <div className="flex items-center gap-1 bg-app-yellow/90 backdrop-blur-sm rounded-full px-2 md:px-3 py-1 md:py-1.5">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-app-primary" />
                <span className="text-app-primary text-xs md:text-sm font-bold">
                  Hot
                </span>
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-4 md:p-6">
          {/* Group Info */}
          <div className="mb-4 md:mb-5">
            <h3 className="font-bold text-lg md:text-xl mb-2 md:mb-3 line-clamp-1 group-hover:text-app-yellow transition-colors">
              {group.name}
            </h3>
            <p className="text-white/70 dark:text-white/70 light:text-app-text-muted-theme text-sm md:text-base leading-relaxed line-clamp-2">
              {group.description}
            </p>
          </div>

          {/* Location and Stats */}
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5 text-sm md:text-base text-white/60 dark:text-white/60 light:text-app-text-muted-theme">
            {group.location && (
              <div className="flex items-center gap-1 md:gap-2">
                <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                <span className="truncate">{group.location}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {group.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
              {group.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs md:text-sm bg-white/10 dark:bg-white/10 light:bg-app-surface border-white/20 dark:border-white/20 light:border-app-border-theme text-white/80 dark:text-white/80 light:text-app-text-muted-theme hover:bg-white/20 dark:hover:bg-white/20 light:hover:bg-app-surface-hover transition-colors rounded-full px-2 md:px-3 py-1"
                >
                  #{tag}
                </Badge>
              ))}
              {group.tags.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs md:text-sm bg-white/10 dark:bg-white/10 light:bg-app-surface border-white/20 dark:border-white/20 light:border-app-border-theme text-white/60 dark:text-white/60 light:text-app-text-muted-theme rounded-full px-2 md:px-3 py-1"
                >
                  +{group.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Join Button */}
          {showJoinButton && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                onJoin?.(group.id);
              }}
              disabled={isJoined}
              className={`w-full h-11 md:h-12 rounded-xl md:rounded-2xl font-semibold text-sm md:text-base transition-all duration-300 touch-target ${
                isJoined
                  ? "bg-app-teal text-app-primary hover:bg-app-teal/90 shadow-lg"
                  : group.isPrivate
                    ? "bg-app-pink text-app-primary hover:bg-app-pink/90 hover:shadow-xl hover:shadow-app-pink/25"
                    : "bg-app-yellow text-app-primary hover:bg-app-yellow/90 hover:shadow-xl hover:shadow-app-yellow/25"
              }`}
            >
              {isJoined
                ? "✓ Joined"
                : group.isPrivate
                  ? "Request to Join"
                  : "Join Group"}
            </Button>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default GroupCard;
