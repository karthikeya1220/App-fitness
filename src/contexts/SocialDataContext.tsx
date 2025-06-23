import React, { createContext, useContext, useState, ReactNode } from "react";
import { mockData } from "../data/mockData";
import { Group, Post, Notification, Message, User } from "../types";

interface SocialDataContextType {
  groups: Group[];
  posts: Post[];
  notifications: Notification[];
  messages: Message[];
  users: User[];
  unreadNotifications: Notification[];
  unreadMessages: Message[];
  likePost: (postId: string) => void;
  sharePost: (postId: string) => void;
  joinGroup: (groupId: string, userId: string) => boolean;
  createPost: (postData: Partial<Post>) => Post;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  searchGroups: (query: string, category?: string) => Group[];
  getTrendingPosts: () => Post[];
  getUserGroups: (userId: string) => Group[];
}

const SocialDataContext = createContext<SocialDataContextType | undefined>(
  undefined,
);

interface SocialDataProviderProps {
  children: ReactNode;
}

export const SocialDataProvider: React.FC<SocialDataProviderProps> = ({
  children,
}) => {
  const [groups, setGroups] = useState<Group[]>(mockData.groups);
  const [posts, setPosts] = useState<Post[]>(mockData.posts);
  const [notifications, setNotifications] = useState<Notification[]>(
    mockData.notifications,
  );
  const [messages, setMessages] = useState<Message[]>(mockData.messages);
  const [users] = useState<User[]>(mockData.users);

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const unreadMessages = messages.filter((m) => !m.isRead);

  const likePost = (postId: string): void => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  };

  const sharePost = (postId: string): void => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, shares: post.shares + 1 } : post,
      ),
    );
  };

  const joinGroup = (groupId: string, userId: string): boolean => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? { ...group, memberCount: group.memberCount + 1 }
          : group,
      ),
    );
    return true;
  };

  const createPost = (postData: Partial<Post>): Post => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: postData.userId || "1",
      username: postData.username || "Unknown",
      userAvatar: postData.userAvatar || "",
      content: postData.content || "",
      images: postData.images || [],
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      hashtags: postData.hashtags || [],
      mentions: postData.mentions || [],
      groupId: postData.groupId,
      workoutData: postData.workoutData,
      location: postData.location,
      privacy: postData.privacy || "public",
    };
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    return newPost;
  };

  const markNotificationAsRead = (notificationId: string): void => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  const markAllNotificationsAsRead = (): void => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    );
  };

  const searchGroups = (query: string, category?: string): Group[] => {
    return groups.filter((group) => {
      const matchesQuery =
        group.name.toLowerCase().includes(query.toLowerCase()) ||
        group.description.toLowerCase().includes(query.toLowerCase()) ||
        group.tags.some((tag) =>
          tag.toLowerCase().includes(query.toLowerCase()),
        );

      const matchesCategory = !category || group.category === category;

      return matchesQuery && matchesCategory;
    });
  };

  const getTrendingPosts = (): Post[] => {
    return posts.sort(
      (a, b) =>
        b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares),
    );
  };

  const getUserGroups = (userId: string): Group[] => {
    const user = users.find((u) => u.id === userId);
    if (!user) return [];
    // Note: This assumes the User type has a joinedGroups property
    // We'll need to add this to the User interface
    const userGroups = (user as any).joinedGroups || [];
    return groups.filter((group) => userGroups.includes(group.id));
  };

  const value: SocialDataContextType = {
    groups,
    posts,
    notifications,
    messages,
    users,
    unreadNotifications,
    unreadMessages,
    likePost,
    sharePost,
    joinGroup,
    createPost,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    searchGroups,
    getTrendingPosts,
    getUserGroups,
  };

  return (
    <SocialDataContext.Provider value={value}>
      {children}
    </SocialDataContext.Provider>
  );
};

export const useSocialData = (): SocialDataContextType => {
  const context = useContext(SocialDataContext);
  if (!context) {
    throw new Error("useSocialData must be used within SocialDataProvider");
  }
  return context;
};
