import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { Post, Group, User, Notification } from '../types';
import ApiService from '../services/api';
import { handleApiError } from '../utils/errors';

// Query Keys
export const queryKeys = {
  posts: ['posts'] as const,
  post: (id: string) => ['posts', id] as const,
  groups: ['groups'] as const,
  group: (id: string) => ['groups', id] as const,
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  notifications: ['notifications'] as const,
  profile: ['profile'] as const,
};

// Posts Hooks
export const usePosts = (page = 1) => {
  return useQuery({
    queryKey: [...queryKeys.posts, page],
    queryFn: () => ApiService.getPosts(page),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postData: Partial<Post>) => ApiService.createPost(postData),
    onSuccess: (newPost) => {
      // Add the new post to the beginning of the posts list
      queryClient.setQueryData(queryKeys.posts, (oldData: any) => {
        if (!oldData) return { posts: [newPost], hasMore: true };
        return {
          ...oldData,
          posts: [newPost, ...oldData.posts],
        };
      });
      
      // Invalidate posts to ensure fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
    },
    onError: (error) => {
      const appError = handleApiError(error);
      throw appError;
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postId: string) => ApiService.likePost(postId),
    onMutate: async (postId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.posts });
      
      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(queryKeys.posts);
      
      // Optimistically update the post
      queryClient.setQueryData(queryKeys.posts, (oldData: any) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          posts: oldData.posts.map((post: Post) =>
            post.id === postId
              ? {
                  ...post,
                  isLiked: !post.isLiked,
                  likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                }
              : post
          ),
        };
      });
      
      return { previousPosts };
    },
    onError: (err, postId, context) => {
      // If the mutation fails, revert the optimistic update
      if (context?.previousPosts) {
        queryClient.setQueryData(queryKeys.posts, context.previousPosts);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
    },
  });
};

// Groups Hooks
export const useGroups = (category?: string) => {
  return useQuery({
    queryKey: [...queryKeys.groups, category],
    queryFn: () => ApiService.getGroups(category),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useJoinGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (groupId: string) => ApiService.joinGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups });
    },
  });
};

// User Hooks
export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => ApiService.getProfile(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: Partial<User>) => ApiService.updateProfile(updates),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKeys.profile, updatedUser);
    },
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.user(userId),
    queryFn: () => ApiService.getUserById(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Notifications Hooks
export const useNotifications = () => {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: () => ApiService.getNotifications(),
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: string) => ApiService.markNotificationAsRead(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications });
      
      const previousNotifications = queryClient.getQueryData(queryKeys.notifications);
      
      queryClient.setQueryData(queryKeys.notifications, (oldData: Notification[]) => {
        if (!oldData) return oldData;
        return oldData.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        );
      });
      
      return { previousNotifications };
    },
    onError: (err, notificationId, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(queryKeys.notifications, context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
};
