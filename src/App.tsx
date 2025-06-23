import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';

// Store and Context Providers
import { store, persistor } from './store';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';

// Navigation and Themes
import AppNavigator from './navigation/AppNavigator';
import { lightTheme, darkTheme, lightNavigationTheme, darkNavigationTheme } from './themes/themes';

// Error Handling
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

// Custom fonts
const loadFonts = async () => {
  // Using system fonts for now
  // await Font.loadAsync({
  //   'MontserratAlternates-Regular': require('./assets/fonts/MontserratAlternates-Regular.ttf'),
  //   'MontserratAlternates-Medium': require('./assets/fonts/MontserratAlternates-Medium.ttf'),
  //   'MontserratAlternates-Bold': require('./assets/fonts/MontserratAlternates-Bold.ttf'),
  // });
};

// App Content Component
const AppContent: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContentWithTheme />
    </ThemeProvider>
  );
};

// App Content with Theme
const AppContentWithTheme: React.FC = () => {
  const { theme, isDark } = useTheme();
  const paperTheme = isDark ? darkTheme : lightTheme;
  const navigationTheme = isDark ? darkNavigationTheme : lightNavigationTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <ToastProvider>
          <AppNavigator />
        </ToastProvider>
        <Toast />
      </NavigationContainer>
    </PaperProvider>
  );
};

// Main App Component
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts and other resources
        await loadFonts();
        
        // Artificially delay for splash screen visibility
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn('Error loading app resources:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      // Hide the splash screen
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ErrorBoundary>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ReduxProvider store={store}>
            <PersistGate loading={<LoadingScreen />} persistor={persistor}>
              <QueryClientProvider client={queryClient}>
                <AppContent />
              </QueryClientProvider>
            </PersistGate>
          </ReduxProvider>
        </GestureHandlerRootView>
      </ErrorBoundary>
    </View>
  );
}
