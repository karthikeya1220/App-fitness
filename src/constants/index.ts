// App Configuration
export const APP_CONFIG = {
  NAME: 'Fitness Community',
  VERSION: '1.0.0',
  BUNDLE_ID: 'com.fitness.community',
  AUTHOR: 'Fitness Team',
  DESCRIPTION: 'A social fitness app to connect and track your fitness journey',
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://localhost:3000/api' : 'https://your-production-api.com/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME_MODE: 'theme_mode',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  LAST_SYNC: 'last_sync',
} as const;

// Screen Names
export const SCREENS = {
  SPLASH: 'Splash',
  AUTH: 'Auth',
  PROFILE_SETUP: 'ProfileSetup',
  MAIN: 'Main',
  DASHBOARD: 'Dashboard',
  EXPLORE_GROUPS: 'ExploreGroups',
  GROUP: 'Group',
  CREATE_POST: 'CreatePost',
  NOTIFICATIONS: 'Notifications',
  MESSAGING: 'Messaging',
  USER_PROFILE: 'UserProfile',
  SETTINGS: 'Settings',
  STATISTICS: 'Statistics',
  ADMIN_PANEL: 'AdminPanel',
} as const;

// Navigation Stacks
export const STACKS = {
  AUTH: 'AuthStack',
  MAIN: 'MainStack',
  SETTINGS: 'SettingsStack',
} as const;

// Tab Names
export const TABS = {
  DASHBOARD: 'Dashboard',
  EXPLORE: 'Explore',
  STATISTICS: 'Statistics',
  MESSAGES: 'Messages',
  PROFILE: 'Profile',
} as const;

// Theme Colors
export const COLORS = {
  PRIMARY: '#262135',
  PRIMARY_LIGHT: '#3D3651',
  PRIMARY_DARK: '#1A1827',
  SECONDARY: '#FFC9E9',
  ACCENT: '#F6F3BA',
  SURFACE_LIGHT: '#D6EBEB',
  
  // Status Colors
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
  
  // Text Colors
  TEXT_PRIMARY: '#1F2937',
  TEXT_SECONDARY: '#6B7280',
  TEXT_MUTED: '#9CA3AF',
  TEXT_WHITE: '#FFFFFF',
  
  // Background Colors
  BACKGROUND_LIGHT: '#F8FAFC',
  BACKGROUND_DARK: '#111827',
  SURFACE_LIGHT_BG: '#FFFFFF',
  SURFACE_DARK_BG: '#1F2937',
  
  // Border Colors
  BORDER_LIGHT: '#E5E7EB',
  BORDER_DARK: '#374151',
  
  // Gradient Colors
  GRADIENT_START: '#262135',
  GRADIENT_END: '#3D3651',
} as const;

// Typography
export const FONTS = {
  REGULAR: 'MontserratAlternates-Regular',
  MEDIUM: 'MontserratAlternates-Medium',
  BOLD: 'MontserratAlternates-Bold',
} as const;

export const FONT_SIZES = {
  XS: 10,
  SM: 12,
  BASE: 14,
  LG: 16,
  XL: 18,
  '2XL': 20,
  '3XL': 24,
  '4XL': 28,
  '5XL': 32,
  '6XL': 36,
} as const;

// Spacing
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  '2XL': 24,
  '3XL': 32,
  '4XL': 40,
  '5XL': 48,
  '6XL': 64,
} as const;

// Border Radius
export const RADIUS = {
  NONE: 0,
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  '2XL': 20,
  '3XL': 24,
  FULL: 9999,
} as const;

// Animation Durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
  SLOWER: 500,
} as const;

// Device Breakpoints
export const BREAKPOINTS = {
  SMALL: 350,
  MEDIUM: 768,
  LARGE: 1024,
  XLARGE: 1280,
} as const;

// Fitness Categories
export const FITNESS_CATEGORIES = [
  { id: 'all', label: 'All', icon: 'view-grid' },
  { id: 'fitness', label: 'Fitness', icon: 'dumbbell' },
  { id: 'running', label: 'Running', icon: 'run' },
  { id: 'yoga', label: 'Yoga', icon: 'yoga' },
  { id: 'weightlifting', label: 'Weights', icon: 'weight-lifter' },
  { id: 'cycling', label: 'Cycling', icon: 'bike' },
  { id: 'swimming', label: 'Swimming', icon: 'swim' },
  { id: 'crossfit', label: 'CrossFit', icon: 'arm-flex' },
  { id: 'pilates', label: 'Pilates', icon: 'meditation' },
  { id: 'martial-arts', label: 'Martial Arts', icon: 'karate' },
] as const;

// Workout Types
export const WORKOUT_TYPES = [
  { id: 'cardio', label: 'Cardio', icon: 'heart', color: '#EF4444' },
  { id: 'strength', label: 'Strength', icon: 'dumbbell', color: '#3B82F6' },
  { id: 'flexibility', label: 'Flexibility', icon: 'yoga', color: '#10B981' },
  { id: 'endurance', label: 'Endurance', icon: 'run', color: '#F59E0B' },
  { id: 'balance', label: 'Balance', icon: 'meditation', color: '#8B5CF6' },
  { id: 'sports', label: 'Sports', icon: 'basketball', color: '#F97316' },
] as const;

// Fitness Goals
export const FITNESS_GOALS = [
  { id: 'weight-loss', label: 'Weight Loss', icon: 'scale-bathroom' },
  { id: 'muscle-gain', label: 'Muscle Gain', icon: 'arm-flex' },
  { id: 'endurance', label: 'Build Endurance', icon: 'run' },
  { id: 'strength', label: 'Increase Strength', icon: 'dumbbell' },
  { id: 'flexibility', label: 'Improve Flexibility', icon: 'yoga' },
  { id: 'general-fitness', label: 'General Fitness', icon: 'heart' },
  { id: 'sport-specific', label: 'Sport Specific', icon: 'basketball' },
  { id: 'rehabilitation', label: 'Rehabilitation', icon: 'medical-bag' },
] as const;

// Activity Levels
export const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { id: 'lightly-active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  { id: 'moderately-active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  { id: 'very-active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
  { id: 'extremely-active', label: 'Extremely Active', description: 'Very hard exercise, physical job' },
] as const;

// Measurement Units
export const UNITS = {
  WEIGHT: {
    KG: 'kg',
    LB: 'lb',
  },
  HEIGHT: {
    CM: 'cm',
    FT_IN: 'ft/in',
  },
  DISTANCE: {
    KM: 'km',
    MI: 'mi',
  },
  PACE: {
    MIN_KM: 'min/km',
    MIN_MI: 'min/mi',
  },
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  GROUP_INVITE: 'group_invite',
  WORKOUT_REMINDER: 'workout_reminder',
  ACHIEVEMENT: 'achievement',
  MESSAGE: 'message',
  SYSTEM: 'system',
} as const;

// Post Types
export const POST_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  WORKOUT: 'workout',
  ACHIEVEMENT: 'achievement',
  CHECK_IN: 'check_in',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network connection failed. Please check your internet connection.',
  AUTH_REQUIRED: 'Authentication required. Please log in again.',
  PERMISSION_DENIED: 'Permission denied. You don\'t have access to this resource.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_FAILED: 'Validation failed. Please check your input.',
  UNKNOWN: 'An unexpected error occurred. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Welcome back!',
  LOGOUT: 'You have been logged out successfully.',
  REGISTER: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  POST_CREATED: 'Post shared successfully!',
  GROUP_JOINED: 'You have joined the group!',
  SETTINGS_SAVED: 'Settings saved successfully!',
} as const;

// Regex Patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
} as const;

// Social Media Links
export const SOCIAL_LINKS = {
  WEBSITE: 'https://your-website.com',
  PRIVACY_POLICY: 'https://your-website.com/privacy',
  TERMS_OF_SERVICE: 'https://your-website.com/terms',
  SUPPORT: 'https://your-website.com/support',
  INSTAGRAM: 'https://instagram.com/your-app',
  TWITTER: 'https://twitter.com/your-app',
  FACEBOOK: 'https://facebook.com/your-app',
} as const;

// Feature Flags
export const FEATURES = {
  DARK_MODE: true,
  BIOMETRIC_AUTH: true,
  PUSH_NOTIFICATIONS: true,
  SOCIAL_LOGIN: true,
  IN_APP_PURCHASES: false,
  ANALYTICS: true,
  CRASH_REPORTING: true,
  A_B_TESTING: false,
} as const;
