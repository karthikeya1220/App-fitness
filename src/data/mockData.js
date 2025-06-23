export const mockData = {
  users: [
    {
      id: "1",
      name: "Youssef Labidi",
      username: "youssef_fit",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bio: "Fitness enthusiast | HIIT trainer | Helping others achieve their goals 💪",
      location: "San Francisco, CA",
      joinedGroups: ["1", "2", "3"],
      followers: 342,
      following: 189,
      isVerified: true,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      username: "sarah_strong",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b137?w=150&h=150&fit=crop&crop=face",
      bio: "CrossFit athlete | Nutrition coach",
      location: "Los Angeles, CA",
      joinedGroups: ["1", "4"],
      followers: 567,
      following: 234,
      isVerified: true,
    },
    {
      id: "3",
      name: "Mike Chen",
      username: "mike_runner",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      bio: "Marathon runner | Outdoor enthusiast",
      location: "Seattle, WA",
      joinedGroups: ["2", "5"],
      followers: 234,
      following: 156,
    },
    {
      id: "4",
      name: "Emily Davis",
      username: "emily_yoga",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      bio: "Yoga instructor | Mindfulness advocate",
      location: "Portland, OR",
      joinedGroups: ["3", "6"],
      followers: 789,
      following: 345,
    },
  ],

  groups: [
    {
      id: "1",
      name: "HIIT Warriors",
      description:
        "High-intensity interval training community for all fitness levels. Join us for daily challenges and motivation!",
      category: "HIIT",
      memberCount: 1247,
      coverImage:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
      isPrivate: false,
      tags: ["hiit", "cardio", "strength", "motivation"],
      admins: ["1", "2"],
      location: "Global",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Running Club SF",
      description:
        "San Francisco running community. Weekly group runs, marathon training, and fun races!",
      category: "Running",
      memberCount: 856,
      coverImage:
        "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=400&fit=crop",
      isPrivate: false,
      tags: ["running", "marathon", "community", "sf"],
      admins: ["3"],
      location: "San Francisco, CA",
      createdAt: "2024-02-01",
    },
    {
      id: "3",
      name: "Yoga & Mindfulness",
      description:
        "A peaceful community for yoga practitioners and those seeking mindfulness in their fitness journey.",
      category: "Yoga",
      memberCount: 2103,
      coverImage:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop",
      isPrivate: false,
      tags: ["yoga", "mindfulness", "meditation", "wellness"],
      admins: ["4"],
      location: "Global",
      createdAt: "2024-01-10",
    },
  ],

  posts: [
    {
      id: "1",
      authorId: "1",
      groupId: "1",
      content:
        "Just completed a killer HIIT session! 🔥 Remember, it's not about being perfect, it's about being consistent. Who's joining me for tomorrow's 6 AM session? #HIITWarriors #NoExcuses",
      images: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      ],
      likes: 47,
      comments: 12,
      shares: 8,
      isLiked: false,
      createdAt: "2024-03-15T08:30:00Z",
      hashtags: ["HIITWarriors", "NoExcuses"],
      mentions: [],
    },
    {
      id: "2",
      authorId: "2",
      groupId: "1",
      content:
        "New workout plan dropping next week! 💪 It's going to focus on functional movements that translate to real-life strength. Can't wait to see everyone crush it! @youssef_fit what do you think?",
      likes: 23,
      comments: 7,
      shares: 3,
      isLiked: true,
      createdAt: "2024-03-14T15:45:00Z",
      hashtags: [],
      mentions: ["youssef_fit"],
    },
    {
      id: "3",
      authorId: "3",
      groupId: "2",
      content:
        "Perfect morning for a run in Golden Gate Park! 🌅 The weather is amazing and the trails are calling. Anyone up for a 10K loop this Saturday? #RunningClubSF #GoldenGate",
      images: [
        "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop",
      ],
      likes: 34,
      comments: 15,
      shares: 5,
      isLiked: false,
      createdAt: "2024-03-14T07:15:00Z",
      hashtags: ["RunningClubSF", "GoldenGate"],
      mentions: [],
    },
  ],

  notifications: [
    {
      id: "1",
      type: "like",
      fromUserId: "2",
      targetId: "1",
      content: "Sarah Johnson liked your post",
      isRead: false,
      createdAt: "2024-03-15T09:30:00Z",
    },
    {
      id: "2",
      type: "comment",
      fromUserId: "3",
      targetId: "1",
      content: "Mike Chen commented on your post",
      isRead: false,
      createdAt: "2024-03-15T08:45:00Z",
    },
    {
      id: "3",
      type: "mention",
      fromUserId: "2",
      targetId: "2",
      content: "Sarah Johnson mentioned you in a post",
      isRead: true,
      createdAt: "2024-03-14T15:45:00Z",
    },
  ],

  messages: [
    {
      id: "1",
      fromUserId: "2",
      toUserId: "1",
      content:
        "Hey! Great session today. Want to plan something for next week?",
      isRead: false,
      createdAt: "2024-03-15T10:30:00Z",
    },
    {
      id: "2",
      fromUserId: "1",
      toUserId: "2",
      content:
        "Absolutely! I was thinking of organizing a outdoor bootcamp. What do you think?",
      isRead: true,
      createdAt: "2024-03-15T10:35:00Z",
    },
  ],
};

export const getUserById = (id) =>
  mockData.users.find((user) => user.id === id);
export const getGroupById = (id) =>
  mockData.groups.find((group) => group.id === id);
