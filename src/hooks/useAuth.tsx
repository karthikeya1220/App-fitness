import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getUserById, User } from "@/lib/mockData";

interface AuthContextType {
  user: User | null;
  login: (userId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUserId = localStorage.getItem("currentUserId");
    if (storedUserId) {
      const userData = getUserById(storedUserId);
      if (userData) {
        setUser(userData);
      }
    }
  }, []);

  const login = (userId: string) => {
    const userData = getUserById(userId);
    if (userData) {
      setUser(userData);
      localStorage.setItem("currentUserId", userId);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUserId");
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
