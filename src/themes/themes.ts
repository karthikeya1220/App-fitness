import { MD3LightTheme, MD3DarkTheme, MD3Theme } from "react-native-paper";
import { Theme as NavigationTheme } from "@react-navigation/native";

// Enhanced theme interface with interaction states
export interface CustomTheme extends MD3Theme {
  colors: MD3Theme["colors"] & {
    // Custom color additions
    accent: string;
    teal: string;
    textMuted: string;
    success: string;
    warning: string;
    error: string;
    info: string;

    // Button interaction states
    primaryHover: string;
    primaryPressed: string;
    secondaryHover: string;
    secondaryPressed: string;
    accentHover: string;
    accentPressed: string;

    // Surface variations
    surfaceHover: string;
    surfacePressed: string;
    surfaceDisabled: string;

    // Border colors
    borderLight: string;
    borderMedium: string;
    borderStrong: string;

    // Status colors with variations
    successLight: string;
    successDark: string;
    warningLight: string;
    warningDark: string;
    errorLight: string;
    errorDark: string;
    infoLight: string;
    infoDark: string;
  };
  dark: boolean;
}

export const lightTheme: CustomTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Primary colors
    primary: "#262135",
    primaryContainer: "#F6F3BA",
    secondary: "#FFC9E9",
    secondaryContainer: "#D6EBEB",

    // Background & surfaces
    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceVariant: "#F1F5F9",

    // Text colors
    onPrimary: "#FFFFFF",
    onSecondary: "#262135",
    onBackground: "#262135",
    onSurface: "#262135",
    onSurfaceVariant: "#64748B",

    // Outline & borders
    outline: "#CBD5E1",
    outlineVariant: "#E2E8F0",

    // Custom additions
    accent: "#F6F3BA",
    teal: "#D6EBEB",
    textMuted: "#64748B",

    // Status colors
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",

    // Button hover states
    primaryHover: "#1E1B2E", // Darker primary
    primaryPressed: "#161425", // Even darker
    secondaryHover: "#FF9FDC", // Darker secondary
    secondaryPressed: "#FF7AC6", // Even darker
    accentHover: "#F0E885", // Darker accent
    accentPressed: "#EBE14A", // Even darker

    // Surface interaction states
    surfaceHover: "#F8FAFC",
    surfacePressed: "#F1F5F9",
    surfaceDisabled: "#F8FAFC",

    // Border variations
    borderLight: "#F1F5F9",
    borderMedium: "#E2E8F0",
    borderStrong: "#CBD5E1",

    // Status color variations
    successLight: "#D1FAE5",
    successDark: "#059669",
    warningLight: "#FEF3C7",
    warningDark: "#D97706",
    errorLight: "#FEE2E2",
    errorDark: "#DC2626",
    infoLight: "#DBEAFE",
    infoDark: "#2563EB",

    // Elevation system
    elevation: {
      level0: "transparent",
      level1: "#FFFFFF",
      level2: "#FEFEFE",
      level3: "#FDFDFD",
      level4: "#FCFCFC",
      level5: "#FAFAFA",
    },
  },
  dark: false,
};

export const darkTheme: CustomTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Primary colors (inverted for dark mode)
    primary: "#FFC9E9",
    primaryContainer: "#3D3651",
    secondary: "#F6F3BA",
    secondaryContainer: "#3D4A4A",

    // Background & surfaces
    background: "#262135",
    surface: "rgba(255, 255, 255, 0.05)",
    surfaceVariant: "rgba(255, 255, 255, 0.1)",

    // Text colors
    onPrimary: "#262135",
    onSecondary: "#262135",
    onBackground: "#FFFFFF",
    onSurface: "#FFFFFF",
    onSurfaceVariant: "#B0B0B0",

    // Outline & borders
    outline: "rgba(255, 255, 255, 0.2)",
    outlineVariant: "rgba(255, 255, 255, 0.1)",

    // Custom additions
    accent: "#F6F3BA",
    teal: "#A8C5C5",
    textMuted: "rgba(255, 255, 255, 0.7)",

    // Status colors (adjusted for dark theme)
    success: "#34D399",
    warning: "#FBBF24",
    error: "#F87171",
    info: "#60A5FA",

    // Button hover states
    primaryHover: "#FFB3E0", // Lighter primary for dark theme
    primaryPressed: "#FF9DD7", // Even lighter
    secondaryHover: "#F9F06B", // Lighter secondary
    secondaryPressed: "#F7EC3A", // Even lighter
    accentHover: "#F9F06B", // Lighter accent
    accentPressed: "#F7EC3A", // Even lighter

    // Surface interaction states
    surfaceHover: "rgba(255, 255, 255, 0.08)",
    surfacePressed: "rgba(255, 255, 255, 0.12)",
    surfaceDisabled: "rgba(255, 255, 255, 0.03)",

    // Border variations
    borderLight: "rgba(255, 255, 255, 0.05)",
    borderMedium: "rgba(255, 255, 255, 0.1)",
    borderStrong: "rgba(255, 255, 255, 0.2)",

    // Status color variations
    successLight: "rgba(52, 211, 153, 0.2)",
    successDark: "#047857",
    warningLight: "rgba(251, 191, 36, 0.2)",
    warningDark: "#B45309",
    errorLight: "rgba(248, 113, 113, 0.2)",
    errorDark: "#B91C1C",
    infoLight: "rgba(96, 165, 250, 0.2)",
    infoDark: "#1E40AF",

    // Elevation system for dark theme
    elevation: {
      level0: "transparent",
      level1: "rgba(255, 255, 255, 0.05)",
      level2: "rgba(255, 255, 255, 0.08)",
      level3: "rgba(255, 255, 255, 0.11)",
      level4: "rgba(255, 255, 255, 0.12)",
      level5: "rgba(255, 255, 255, 0.14)",
    },
  },
  dark: true,
};

// Navigation themes for React Navigation
export const lightNavigationTheme: NavigationTheme = {
  dark: false,
  colors: {
    primary: lightTheme.colors.primary,
    background: lightTheme.colors.background,
    card: lightTheme.colors.surface,
    text: lightTheme.colors.onSurface,
    border: lightTheme.colors.borderLight,
    notification: lightTheme.colors.accent,
  },
};

export const darkNavigationTheme: NavigationTheme = {
  dark: true,
  colors: {
    primary: darkTheme.colors.primary,
    background: darkTheme.colors.background,
    card: darkTheme.colors.surface,
    text: darkTheme.colors.onSurface,
    border: darkTheme.colors.borderLight,
    notification: darkTheme.colors.accent,
  },
};

// Button style configurations with hover states
export const buttonStyles = {
  light: {
    contained: {
      default: {
        backgroundColor: lightTheme.colors.primary,
        color: lightTheme.colors.onPrimary,
      },
      hover: {
        backgroundColor: lightTheme.colors.primaryHover,
        color: lightTheme.colors.onPrimary,
      },
      pressed: {
        backgroundColor: lightTheme.colors.primaryPressed,
        color: lightTheme.colors.onPrimary,
      },
      disabled: {
        backgroundColor: lightTheme.colors.surfaceDisabled,
        color: lightTheme.colors.textMuted,
      },
    },
    outlined: {
      default: {
        backgroundColor: "transparent",
        borderColor: lightTheme.colors.primary,
        color: lightTheme.colors.primary,
      },
      hover: {
        backgroundColor: lightTheme.colors.surfaceHover,
        borderColor: lightTheme.colors.primaryHover,
        color: lightTheme.colors.primaryHover,
      },
      pressed: {
        backgroundColor: lightTheme.colors.surfacePressed,
        borderColor: lightTheme.colors.primaryPressed,
        color: lightTheme.colors.primaryPressed,
      },
      disabled: {
        backgroundColor: "transparent",
        borderColor: lightTheme.colors.borderLight,
        color: lightTheme.colors.textMuted,
      },
    },
    text: {
      default: {
        backgroundColor: "transparent",
        color: lightTheme.colors.primary,
      },
      hover: {
        backgroundColor: lightTheme.colors.surfaceHover,
        color: lightTheme.colors.primaryHover,
      },
      pressed: {
        backgroundColor: lightTheme.colors.surfacePressed,
        color: lightTheme.colors.primaryPressed,
      },
      disabled: {
        backgroundColor: "transparent",
        color: lightTheme.colors.textMuted,
      },
    },
  },
  dark: {
    contained: {
      default: {
        backgroundColor: darkTheme.colors.primary,
        color: darkTheme.colors.onPrimary,
      },
      hover: {
        backgroundColor: darkTheme.colors.primaryHover,
        color: darkTheme.colors.onPrimary,
      },
      pressed: {
        backgroundColor: darkTheme.colors.primaryPressed,
        color: darkTheme.colors.onPrimary,
      },
      disabled: {
        backgroundColor: darkTheme.colors.surfaceDisabled,
        color: darkTheme.colors.textMuted,
      },
    },
    outlined: {
      default: {
        backgroundColor: "transparent",
        borderColor: darkTheme.colors.primary,
        color: darkTheme.colors.primary,
      },
      hover: {
        backgroundColor: darkTheme.colors.surfaceHover,
        borderColor: darkTheme.colors.primaryHover,
        color: darkTheme.colors.primaryHover,
      },
      pressed: {
        backgroundColor: darkTheme.colors.surfacePressed,
        borderColor: darkTheme.colors.primaryPressed,
        color: darkTheme.colors.primaryPressed,
      },
      disabled: {
        backgroundColor: "transparent",
        borderColor: darkTheme.colors.borderLight,
        color: darkTheme.colors.textMuted,
      },
    },
    text: {
      default: {
        backgroundColor: "transparent",
        color: darkTheme.colors.primary,
      },
      hover: {
        backgroundColor: darkTheme.colors.surfaceHover,
        color: darkTheme.colors.primaryHover,
      },
      pressed: {
        backgroundColor: darkTheme.colors.surfacePressed,
        color: darkTheme.colors.primaryPressed,
      },
      disabled: {
        backgroundColor: "transparent",
        color: darkTheme.colors.textMuted,
      },
    },
  },
};

// Chip style configurations
export const chipStyles = {
  light: {
    default: {
      backgroundColor: lightTheme.colors.surfaceVariant,
      color: lightTheme.colors.onSurfaceVariant,
    },
    selected: {
      backgroundColor: lightTheme.colors.accent,
      color: lightTheme.colors.primary,
    },
    hover: {
      backgroundColor: lightTheme.colors.surfaceHover,
      color: lightTheme.colors.onSurface,
    },
  },
  dark: {
    default: {
      backgroundColor: darkTheme.colors.surfaceVariant,
      color: darkTheme.colors.onSurfaceVariant,
    },
    selected: {
      backgroundColor: darkTheme.colors.accent,
      color: darkTheme.colors.primary,
    },
    hover: {
      backgroundColor: darkTheme.colors.surfaceHover,
      color: darkTheme.colors.onSurface,
    },
  },
};

// Card style configurations
export const cardStyles = {
  light: {
    default: {
      backgroundColor: lightTheme.colors.surface,
      borderColor: lightTheme.colors.borderLight,
    },
    hover: {
      backgroundColor: lightTheme.colors.surface,
      borderColor: lightTheme.colors.borderMedium,
      elevation: 4,
    },
  },
  dark: {
    default: {
      backgroundColor: darkTheme.colors.surface,
      borderColor: darkTheme.colors.borderLight,
    },
    hover: {
      backgroundColor: darkTheme.colors.surfaceHover,
      borderColor: darkTheme.colors.borderMedium,
      elevation: 6,
    },
  },
};

// Export utility function to get current theme styles
export const getThemeStyles = (isDark: boolean) => ({
  button: isDark ? buttonStyles.dark : buttonStyles.light,
  chip: isDark ? chipStyles.dark : chipStyles.light,
  card: isDark ? cardStyles.dark : cardStyles.light,
});
