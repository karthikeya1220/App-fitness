export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string;
  bio: string;
  location: string;
  joinDate: string;
  isVerified: boolean;
  followers: number;
  following: number;
  posts: number;
  fitnessGoals: string[];
  interests: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  achievements: Achievement[];
  stats: UserStats;
  joinedGroups?: string[];
}

export interface UserStats {
  totalWorkouts: number;
  totalDistance: number;
  totalCalories: number;
  weeklyGoal: number;
  weeklyProgress: number;
  currentStreak: number;
  longestStreak: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: "workout" | "social" | "streak" | "distance" | "calories";
}

export interface Group {
  id: string;
  name: string;
  description: string;
  image: string;
  memberCount: number;
  category: string;
  isPrivate: boolean;
  createdAt: string;
  createdBy: string;
  tags: string[];
  location?: string;
  nextEvent?: Event;
  admins: string[];
  moderators: string[];
  rules: string[];
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  images: string[];
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  hashtags: string[];
  mentions: string[];
  groupId?: string;
  workoutData?: WorkoutData;
  location?: string;
  privacy: "public" | "friends" | "group";
}

export interface WorkoutData {
  type: string;
  duration: number;
  calories: number;
  exercises: Exercise[];
  distance?: number;
  avgHeartRate?: number;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
}

export interface Notification {
  id: string;
  type:
    | "like"
    | "comment"
    | "follow"
    | "group_invite"
    | "group_request"
    | "mention"
    | "achievement"
    | "workout_reminder";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUserId?: string;
  actionUserAvatar?: string;
  actionUserName?: string;
  postId?: string;
  groupId?: string;
  data?: any;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId?: string;
  groupId?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: "text" | "image" | "workout" | "location" | "group_invite";
  attachments?: MessageAttachment[];
  replyTo?: string;
}

export interface MessageAttachment {
  type: "image" | "video" | "workout" | "location";
  url: string;
  thumbnail?: string;
  metadata?: any;
}

export interface Chat {
  id: string;
  type: "direct" | "group";
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  isActive: boolean;
  groupInfo?: {
    name: string;
    avatar: string;
    description: string;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  groupId: string;
  createdBy: string;
  attendees: string[];
  maxAttendees?: number;
  isPublic: boolean;
  tags: string[];
}

export interface Theme {
  mode: "light" | "dark";
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  ProfileSetup: undefined;
  Main: undefined;
  Dashboard: undefined;
  ExploreGroups: { category?: string };
  Group: { groupId: string };
  CreatePost: { groupId?: string };
  Notifications: undefined;
  Messaging: { chatId?: string };
  UserProfile: { userId: string };
  Settings: undefined;
  Statistics: undefined;
  AdminPanel: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Explore: undefined;
  Statistics: undefined;
  Messages: undefined;
  Profile: undefined;
};

// Context Types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  displayName: string;
  fitnessGoals: string[];
  interests: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
}

export interface SocialDataContextType {
  posts: Post[];
  groups: Group[];
  notifications: Notification[];
  chats: Chat[];
  isLoading: boolean;
  error: string | null;
  refreshPosts: () => Promise<void>;
  refreshGroups: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  refreshChats: () => Promise<void>;
  createPost: (postData: Partial<Post>) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  sendMessage: (chatId: string, content: string) => Promise<void>;
}

export interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (mode: "light" | "dark") => void;
}

export interface ToastContextType {
  showToast: (
    message: string,
    type?: "success" | "error" | "warning" | "info",
  ) => void;
  hideToast: () => void;
}

// Component Props Types
export interface PostCardProps {
  post: Post;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onBookmark: () => void;
}

export interface GroupCardProps {
  group: Group;
  onJoin: () => void;
  onLeave: () => void;
  isJoined: boolean;
}

export interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
  onMarkAsRead: () => void;
}

export interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar: boolean;
}

// Settings Types
export interface AppSettings {
  notifications: {
    pushEnabled: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    likes: boolean;
    comments: boolean;
    follows: boolean;
    groupInvites: boolean;
    workoutReminders: boolean;
  };
  privacy: {
    profileVisibility: "public" | "friends" | "private";
    activityVisibility: "public" | "friends" | "private";
    allowGroupInvites: boolean;
    allowDirectMessages: boolean;
  };
  preferences: {
    language: string;
    units: "metric" | "imperial";
    autoplayVideos: boolean;
    dataSaver: boolean;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Admin Types
export interface AdminAction {
  id: string;
  type:
    | "approve_post"
    | "remove_post"
    | "pin_post"
    | "ban_user"
    | "warn_user"
    | "approve_group"
    | "remove_group";
  targetId: string;
  targetType: "post" | "user" | "group";
  adminId: string;
  reason?: string;
  timestamp: string;
}

export interface ReportedContent {
  id: string;
  type: "post" | "user" | "group" | "comment";
  targetId: string;
  reportedBy: string;
  reason: string;
  description: string;
  timestamp: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  reviewedBy?: string;
  reviewNote?: string;
}
