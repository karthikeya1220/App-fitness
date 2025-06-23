import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  MapPin,
  Bookmark,
} from "lucide-react";
import { Post, getUserById } from "@/lib/mockData";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  showGroupName?: boolean;
}

const PostCard = ({
  post,
  onLike,
  onComment,
  onShare,
  showGroupName = false,
}: PostCardProps) => {
  const author = getUserById(post.authorId);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!author) return null;

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount((prev) => (newLikedState ? prev + 1 : prev - 1));
    onLike?.(post.id);
  };

  const formatContent = (content: string) => {
    // Replace hashtags with styled spans
    let formattedContent = content.replace(
      /#(\w+)/g,
      '<span class="text-app-teal font-semibold hover:text-app-teal/80 cursor-pointer transition-colors">#$1</span>',
    );

    // Replace mentions with styled spans
    formattedContent = formattedContent.replace(
      /@(\w+)/g,
      '<span class="text-app-pink font-semibold hover:text-app-pink/80 cursor-pointer transition-colors">@$1</span>',
    );

    return formattedContent;
  };

  return (
    <Card className="bg-white/5 dark:bg-white/5 light:bg-app-surface border-white/10 dark:border-white/10 light:border-app-border-theme text-white dark:text-white light:text-app-text backdrop-blur-sm hover:bg-white/8 dark:hover:bg-white/8 light:hover:bg-app-surface-hover transition-all duration-300 rounded-2xl md:rounded-3xl overflow-hidden">
      <CardContent className="p-4 md:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 md:mb-5">
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            <Avatar className="w-10 h-10 md:w-12 md:h-12 ring-2 ring-white/10 touch-target">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback className="bg-app-pink text-app-primary">
                {author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 md:gap-3 mb-1">
                <span className="font-semibold text-sm md:text-base truncate">
                  {author.name}
                </span>
                {author.isVerified && (
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-app-yellow rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-app-primary rounded-full" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-white/60 dark:text-white/60 light:text-app-text-muted-theme">
                <span className="truncate">@{author.username}</span>
                <span>•</span>
                <span className="whitespace-nowrap">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                {author.location && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <div className="hidden sm:flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{author.location}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white/60 dark:text-white/60 light:text-app-text-muted-theme hover:text-white dark:hover:text-white light:hover:text-app-text hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-app-surface-hover w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 touch-target"
          >
            <MoreHorizontal className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="mb-4 md:mb-5">
          <p
            className="text-white/90 dark:text-white/90 light:text-app-text leading-relaxed text-sm md:text-base"
            dangerouslySetInnerHTML={{
              __html: formatContent(post.content),
            }}
          />
        </div>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="mb-4 md:mb-5">
            <div className="grid grid-cols-1 gap-2 md:gap-3">
              {post.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-video rounded-xl md:rounded-2xl overflow-hidden bg-white/10 hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                >
                  <img
                    src={image}
                    alt={`Post image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-white/10 dark:border-white/10 light:border-app-border-theme">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Like */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center gap-2 md:gap-3 px-0 hover:bg-transparent transition-all duration-300 touch-target ${
                isLiked
                  ? "text-red-400 hover:text-red-300"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <div className="relative">
                <Heart
                  className={`w-5 h-5 md:w-6 md:h-6 transition-all duration-300 ${
                    isLiked
                      ? "fill-current scale-110"
                      : "hover:scale-110 active:scale-95"
                  }`}
                />
                {isLiked && (
                  <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75 scale-75"></div>
                )}
              </div>
              <span className="text-sm md:text-base font-medium">
                {likesCount}
              </span>
            </Button>

            {/* Comment */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment?.(post.id)}
              className="flex items-center gap-2 md:gap-3 px-0 text-white/60 dark:text-white/60 light:text-app-text-muted-theme hover:text-white dark:hover:text-white light:hover:text-app-text hover:bg-transparent transition-all duration-300 touch-target"
            >
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6 hover:scale-110 active:scale-95 transition-transform" />
              <span className="text-sm md:text-base font-medium">
                {post.comments}
              </span>
            </Button>

            {/* Share */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(post.id)}
              className="flex items-center gap-2 md:gap-3 px-0 text-white/60 hover:text-white hover:bg-transparent transition-all duration-300 touch-target"
            >
              <Share2 className="w-5 h-5 md:w-6 md:h-6 hover:scale-110 active:scale-95 transition-transform" />
              <span className="text-sm md:text-base font-medium">
                {post.shares}
              </span>
            </Button>
          </div>

          {/* Bookmark */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`px-0 hover:bg-transparent transition-all duration-300 touch-target ${
              isBookmarked
                ? "text-app-yellow hover:text-app-yellow/80"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Bookmark
              className={`w-5 h-5 md:w-6 md:h-6 hover:scale-110 active:scale-95 transition-all duration-300 ${
                isBookmarked ? "fill-current" : ""
              }`}
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
