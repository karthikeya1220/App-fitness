import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
}

const initialState: ThemeState = {
  mode: 'system',
  isDark: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
    setIsDark: (state, action: PayloadAction<boolean>) => {
      state.isDark = action.payload;
    },
    toggleTheme: (state) => {
      if (state.mode === 'system') {
        state.mode = state.isDark ? 'light' : 'dark';
      } else {
        state.mode = state.mode === 'light' ? 'dark' : 'light';
      }
      state.isDark = state.mode === 'dark';
    },
  },
});

export const { setThemeMode, setIsDark, toggleTheme } = themeSlice.actions;
export default themeSlice;
