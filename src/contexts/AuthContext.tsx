import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";

interface AuthContextType {
  isAuthenticated: boolean;
  hasCompletedSetup: boolean;
  user: User | null;
  loading: boolean;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  completeSetup: (profileData: Partial<User>) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hasCompletedSetup, setHasCompletedSetup] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async (): Promise<void> => {
    try {
      const [authToken, userData, setupStatus] = await Promise.all([
        AsyncStorage.getItem("authToken"),
        AsyncStorage.getItem("userData"),
        AsyncStorage.getItem("setupCompleted"),
      ]);

      if (authToken && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData) as User);
        setHasCompletedSetup(setupStatus === "true");
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData: User, token: string): Promise<void> => {
    try {
      await AsyncStorage.multiSet([
        ["authToken", token],
        ["userData", JSON.stringify(userData)],
      ]);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const completeSetup = async (profileData: Partial<User>): Promise<void> => {
    try {
      if (!user) throw new Error("No user to update");

      const updatedUser = { ...user, ...profileData };
      await AsyncStorage.multiSet([
        ["userData", JSON.stringify(updatedUser)],
        ["setupCompleted", "true"],
      ]);
      setUser(updatedUser);
      setHasCompletedSetup(true);
    } catch (error) {
      console.error("Error completing setup:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        "authToken",
        "userData",
        "setupCompleted",
      ]);
      setIsAuthenticated(false);
      setHasCompletedSetup(false);
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    try {
      if (!user) throw new Error("No user to update");

      const updatedUser = { ...user, ...updates };
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    hasCompletedSetup,
    user,
    loading,
    login,
    logout,
    completeSetup,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
