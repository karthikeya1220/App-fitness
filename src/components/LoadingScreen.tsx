import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING } from '../constants';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <LinearGradient
      colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
      style={styles.container}
    >
      <View style={styles.content}>
        <ActivityIndicator 
          size="large" 
          color={COLORS.ACCENT}
          style={styles.spinner}
        />
        <Text style={styles.loadingText}>{message}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  spinner: {
    marginBottom: SPACING.XL,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: FONTS.MEDIUM,
    color: COLORS.TEXT_WHITE,
    textAlign: 'center',
  },
});

export default LoadingScreen;
