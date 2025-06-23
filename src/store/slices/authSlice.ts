import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import ApiService from '../../services/api';
import { handleApiError } from '../../utils/errors';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedSetup: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  hasCompletedSetup: false,
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await ApiService.login(email, password);
      return response;
    } catch (error) {
      const appError = handleApiError(error);
      return rejectWithValue(appError.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await ApiService.register(userData);
      return response;
    } catch (error) {
      const appError = handleApiError(error);
      return rejectWithValue(appError.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updates: Partial<User>, { rejectWithValue }) => {
    try {
      const user = await ApiService.updateProfile(updates);
      return user;
    } catch (error) {
      const appError = handleApiError(error);
      return rejectWithValue(appError.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.hasCompletedSetup = false;
      state.error = null;
    },
    completeSetup: (state) => {
      state.hasCompletedSetup = true;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.hasCompletedSetup = action.payload.user.hasCompletedSetup || false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.hasCompletedSetup = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, completeSetup, clearError, setUser } = authSlice.actions;
export default authSlice;
