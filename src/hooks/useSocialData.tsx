import { useState, useEffect } from "react";
import {
  mockGroups,
  mockPosts,
  mockNotifications,
  mockMessages,
  Group,
  Post,
  Notification,
  Message,
  getTrendingPosts,
  getUnreadNotifications,
  getPostsByGroupId,
  getUserGroups,
} from "@/lib/mockData";

export const useSocialData = () => {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  // Group operations
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

  const joinGroup = (groupId: string, userId: string): boolean => {
    const group = groups.find((g) => g.id === groupId);
    if (group && !group.isPrivate) {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId ? { ...g, memberCount: g.memberCount + 1 } : g,
        ),
      );
      return true;
    }
    return false;
  };

  const leaveGroup = (groupId: string, userId: string): boolean => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, memberCount: Math.max(0, g.memberCount - 1) }
          : g,
      ),
    );
    return true;
  };

  // Post operations
  const createPost = (
    postData: Omit<
      Post,
      "id" | "createdAt" | "likes" | "comments" | "shares" | "isLiked"
    >,
  ): Post => {
    const newPost: Post = {
      ...postData,
      id: `post_${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
    };

    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  const likePost = (postId: string): void => {
    setPosts((prev) =>
      prev.map((post) =>
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
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, shares: post.shares + 1 } : post,
      ),
    );
  };

  // Notification operations
  const markNotificationAsRead = (notificationId: string): void => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  const markAllNotificationsAsRead = (): void => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    );
  };

  // Message operations
  const sendMessage = (
    fromUserId: string,
    toUserId: string,
    content: string,
  ): Message => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      fromUserId,
      toUserId,
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const markMessageAsRead = (messageId: string): void => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId ? { ...message, isRead: true } : message,
      ),
    );
  };

  // Computed values
  const trendingPosts = getTrendingPosts();
  const unreadNotifications = getUnreadNotifications();
  const unreadMessagesCount = messages.filter((msg) => !msg.isRead).length;

  return {
    // Data
    groups,
    posts,
    notifications,
    messages,

    // Computed
    trendingPosts,
    unreadNotifications,
    unreadMessagesCount,

    // Group operations
    searchGroups,
    joinGroup,
    leaveGroup,
    getPostsByGroupId,
    getUserGroups,

    // Post operations
    createPost,
    likePost,
    sharePost,

    // Notification operations
    markNotificationAsRead,
    markAllNotificationsAsRead,

    // Message operations
    sendMessage,
    markMessageAsRead,
  };
};
