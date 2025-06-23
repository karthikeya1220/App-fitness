import React, { createContext, useContext, ReactNode } from "react";
import Toast from "react-native-toast-message";

interface ToastContextType {
  success: (title: string, message: string) => void;
  error: (title: string, message: string) => void;
  info: (title: string, message: string) => void;
  showToast: (
    type: "success" | "error" | "info",
    title: string,
    message: string,
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const showToast = (
    type: "success" | "error" | "info",
    title: string,
    message: string,
  ): void => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 60,
    });
  };

  const success = (title: string, message: string): void =>
    showToast("success", title, message);
  const error = (title: string, message: string): void =>
    showToast("error", title, message);
  const info = (title: string, message: string): void =>
    showToast("info", title, message);

  const value: ToastContextType = {
    success,
    error,
    info,
    showToast,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
