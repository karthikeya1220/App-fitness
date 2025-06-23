import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { COLORS, FONTS, SPACING } from '../constants';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // You can log the error to an error reporting service here
    // Example: Sentry, Bugsnag, Firebase Crashlytics
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>
              We're sorry for the inconvenience. The app encountered an unexpected error.
            </Text>
            
            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>Error Details:</Text>
                <Text style={styles.errorText}>{this.state.error.message}</Text>
              </View>
            )}
            
            <Button
              mode="contained"
              onPress={this.handleRestart}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Try Again
            </Button>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING['4XL'],
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.LG,
  },
  message: {
    fontSize: 16,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING['3XL'],
  },
  errorDetails: {
    backgroundColor: COLORS.ERROR + '10',
    padding: SPACING.LG,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.ERROR,
    marginBottom: SPACING['3XL'],
    width: '100%',
  },
  errorTitle: {
    fontSize: 14,
    fontFamily: FONTS.BOLD,
    color: COLORS.ERROR,
    marginBottom: SPACING.SM,
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 18,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING['3XL'],
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: FONTS.MEDIUM,
    color: COLORS.TEXT_WHITE,
  },
});

export default ErrorBoundary;
