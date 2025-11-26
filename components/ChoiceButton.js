import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, BORDER_RADIUS, SPACING } from '../constants/colors';

const ChoiceButton = ({ choice, onPress, disabled = false }) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [borderAnim] = useState(new Animated.Value(0));
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    if (!disabled) {
      setIsPressed(true);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.97, // Slight scale down (0.97 from spec)
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
        Animated.timing(borderAnim, {
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
    marginBottom: SPACING.md, // Increased spacing between buttons for clarity
  },
  button: {
    // Container for touch handling
  },
  buttonInner: {
    backgroundColor: COLORS.choice.background, // Slightly lighter than page background
    borderWidth: 1.5, // Slightly thicker border for definition
    borderRadius: BORDER_RADIUS.lg, // Larger radius for softer, more intentional feel
    paddingVertical: SPACING.md + 4, // More generous vertical padding
    paddingHorizontal: SPACING.lg + 4, // More generous horizontal padding
    minHeight: 56, // Slightly taller for better touch target and presence
    justifyContent: 'center',
    alignItems: 'center',
    // Softer shadow for depth without being heavy
    shadowColor: COLORS.choice.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 1,
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
  },
  buttonTextPressed: {
    color: COLORS.choice.textHover, // Red tint when pressed
  },
  buttonTextDisabled: {
    color: COLORS.text.muted,
  },
});

export default ChoiceButton;

