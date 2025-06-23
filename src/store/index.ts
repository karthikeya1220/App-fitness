import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authSlice from './slices/authSlice';
import socialSlice from './slices/socialSlice';
import themeSlice from './slices/themeSlice';
import notificationSlice from './slices/notificationSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'theme'], // Only persist auth and theme
  blacklist: ['social', 'notifications'], // Don't persist social data (fresh from server)
};

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  social: socialSlice.reducer,
  theme: themeSlice.reducer,
  notifications: notificationSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: __DEV__,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
