import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post, Group, User } from '../../types';
import ApiService from '../../services/api';
import { handleApiError } from '../../utils/errors';

interface SocialState {
  posts: Post[];
  groups: Group[];
  users: User[];
  loading: boolean;
  error: string | null;
  hasMorePosts: boolean;
  currentPage: number;
}

const initialState: SocialState = {
  posts: [],
  groups: [],
  users: [],
  loading: false,
  error: null,
  hasMorePosts: true,
  currentPage: 1,
};

// Async thunks
export const fetchPosts = createAsyncThunk(
  'social/fetchPosts',
  async ({ page = 1, refresh = false }: { page?: number; refresh?: boolean }, { rejectWithValue }) => {
    try {
      const response = await ApiService.getPosts(page, 20);
      return { ...response, page, refresh };
    } catch (error) {
      const appError = handleApiError(error);
      return rejectWithValue(appError.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'social/createPost',
  async (postData: Partial<Post>, { rejectWithValue }) => {
    try {
      const post = await ApiService.createPost(postData);
      return post;
    } catch (error) {
      const appError = handleApiError(error);
      return rejectWithValue(appError.message);
    }
  }
);

export const likePost = createAsyncThunk(
  'social/likePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await ApiService.likePost(postId);
      return postId;
    } catch (error) {
      const appError = handleApiError(error);
      return rejectWithValue(appError.message);
    }
  }
);

export const fetchGroups = createAsyncThunk(
  'social/fetchGroups',
  async (category?: string, { rejectWithValue }) => {
    try {
      const groups = await ApiService.getGroups(category);
      return groups;
    } catch (error) {
      const appError = handleApiError(error);
      return rejectWithValue(appError.message);
    }
  }
);

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetPosts: (state) => {
      state.posts = [];
      state.currentPage = 1;
      state.hasMorePosts = true;
    },
    updatePostLocally: (state, action: PayloadAction<{ postId: string; updates: Partial<Post> }>) => {
      const { postId, updates } = action.payload;
      const postIndex = state.posts.findIndex(post => post.id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex] = { ...state.posts[postIndex], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        const { posts, hasMore, page, refresh } = action.payload;
        
        if (refresh || page === 1) {
          state.posts = posts;
        } else {
          state.posts = [...state.posts, ...posts];
        }
        
        state.hasMorePosts = hasMore;
        state.currentPage = page;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Post
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        const postIndex = state.posts.findIndex(post => post.id === action.payload);
        if (postIndex !== -1) {
          state.posts[postIndex].isLiked = !state.posts[postIndex].isLiked;
          state.posts[postIndex].likes += state.posts[postIndex].isLiked ? 1 : -1;
        }
      })
      // Fetch Groups
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
      });
  },
});

export const { clearError, resetPosts, updatePostLocally } = socialSlice.actions;
export default socialSlice;
