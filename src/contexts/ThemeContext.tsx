import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import {
  CustomTheme,
  lightTheme,
  darkTheme,
  getThemeStyles,
  buttonStyles,
  chipStyles,
  cardStyles,
} from "../themes/themes";

interface ThemeContextType {
  theme: CustomTheme;
  isDark: boolean;
  toggleTheme: () => Promise<void>;
  themeStyles: ReturnType<typeof getThemeStyles>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    // Load saved theme or use system preference
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme");
        if (savedTheme !== null) {
          setIsDark(savedTheme === "dark");
        } else {
          const colorScheme = Appearance.getColorScheme();
          setIsDark(colorScheme === "dark");
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      }
    };

    loadTheme();

    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === "dark");
    });

    return () => subscription?.remove();
  }, []);

  const toggleTheme = async (): Promise<void> => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;
  const themeStyles = getThemeStyles(isDark);

  const value: ThemeContextType = {
    theme,
    isDark,
    toggleTheme,
    themeStyles,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
