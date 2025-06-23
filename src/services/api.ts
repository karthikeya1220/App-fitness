import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Post, Group, Notification, Message } from '../types';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth Methods
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: Partial<User>): Promise<{ user: User; token: string }> {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<void> {
    return this.makeRequest('/auth/logout', {
      method: 'POST',
    });
  }

  // User Methods
  async getProfile(): Promise<User> {
    return this.makeRequest('/users/profile');
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    return this.makeRequest('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async getUserById(userId: string): Promise<User> {
    return this.makeRequest(`/users/${userId}`);
  }

  // Posts Methods
  async getPosts(page = 1, limit = 20): Promise<{ posts: Post[]; hasMore: boolean }> {
    return this.makeRequest(`/posts?page=${page}&limit=${limit}`);
  }

  async createPost(postData: Partial<Post>): Promise<Post> {
    return this.makeRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async likePost(postId: string): Promise<void> {
    return this.makeRequest(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async sharePost(postId: string): Promise<void> {
    return this.makeRequest(`/posts/${postId}/share`, {
      method: 'POST',
    });
  }

  // Groups Methods
  async getGroups(category?: string): Promise<Group[]> {
    const params = category ? `?category=${category}` : '';
    return this.makeRequest(`/groups${params}`);
  }

  async joinGroup(groupId: string): Promise<void> {
    return this.makeRequest(`/groups/${groupId}/join`, {
      method: 'POST',
    });
  }

  async leaveGroup(groupId: string): Promise<void> {
    return this.makeRequest(`/groups/${groupId}/leave`, {
      method: 'DELETE',
    });
  }

  // Notifications Methods
  async getNotifications(): Promise<Notification[]> {
    return this.makeRequest('/notifications');
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    return this.makeRequest(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  // Messages Methods
  async getMessages(chatId: string): Promise<Message[]> {
    return this.makeRequest(`/chats/${chatId}/messages`);
  }

  async sendMessage(chatId: string, content: string): Promise<Message> {
    return this.makeRequest(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Upload Methods
  async uploadImage(uri: string, type: 'avatar' | 'post' | 'group'): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', {
      uri,
      type: 'image/jpeg',
      name: `${type}_${Date.now()}.jpg`,
    } as any);

    const token = await this.getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/upload/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return await response.json();
  }
}

export default new ApiService();
