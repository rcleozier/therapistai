import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, BORDER_RADIUS, SPACING } from '../constants/colors';

// Chat content horizontal padding constant - matches header, messages, and choices
const CHAT_CONTENT_PADDING = SPACING.lg;

const ChoiceButton = ({ choice, onPress, disabled = false }) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [borderAnim] = useState(new Animated.Value(0));
  const [backgroundAnim] = useState(new Animated.Value(0));
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    if (!disabled) {
      setIsPressed(true);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.97, // Slight scale down
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(borderAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(backgroundAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (!disabled) {
      // Medium impact - choice feels weighty, significant
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress(choice.id);
    }
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.choice.border, COLORS.choice.borderHover],
  });

  const backgroundColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.choice.background, COLORS.choice.backgroundPressed],
  });

  return (
    <Animated.View
      style={[
        styles.buttonContainer,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1} // We handle opacity with animation
        disabled={disabled}
      >
        <Animated.View
          style={[
            styles.buttonInner,
            {
              borderColor: borderColor,
              backgroundColor: backgroundColor,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              disabled && styles.buttonTextDisabled,
              isPressed && !disabled && styles.buttonTextPressed,
            ]}
          >
            {choice.label}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginBottom: SPACING.sm + 4, // Tighter vertical spacing but still tappable
    width: '100%', // Consistent width
  },
  button: {
    // Container for touch handling
    width: '100%',
  },
  buttonInner: {
    // Background color handled by animation
    borderWidth: 1, // Border in accent color
    borderRadius: BORDER_RADIUS.md, // Consistent with design system
    paddingVertical: SPACING.md + 4, // Generous vertical padding
    paddingHorizontal: SPACING.lg + 4, // Generous horizontal padding
    minHeight: 56, // Good touch target
    justifyContent: 'center',
    alignItems: 'center',
    // Enhanced shadow for better depth and contrast
    shadowColor: COLORS.choice.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.3, // More faded when disabled
  },
  buttonText: {
    ...FONTS.body,
    fontSize: 15, // Slightly smaller for better readability
    fontWeight: '400', // Regular weight for less aggressive feel
    textAlign: 'center',
    letterSpacing: 0.3, // Slightly increased for clarity
    color: COLORS.choice.text, // #F5F3EE soft off-white (refined from spec)
    lineHeight: 22, // Better line height for readability
    opacity: 0.95, // Slightly softer for better contrast balance
  },
  buttonTextPressed: {
    color: COLORS.choice.textHover, // Red tint when pressed
  },
  buttonTextDisabled: {
    color: COLORS.text.muted,
  },
});

export default ChoiceButton;

