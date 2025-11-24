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
          toValue: 0.98,
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
    marginBottom: SPACING.md, // More space between choices
  },
  button: {
    // Container for touch handling
  },
  buttonInner: {
    backgroundColor: COLORS.choice.background,
    borderWidth: 0.5, // Thin border - clinical
    borderRadius: BORDER_RADIUS.sm, // Smaller radius - less friendly
    paddingVertical: SPACING.lg, // Taller buttons - easier to tap, more presence
    paddingHorizontal: SPACING.xl, // Wider padding - breathing room
    minHeight: 56, // Minimum touch target
    justifyContent: 'center',
    alignItems: 'center',
    // Subtle shadow for depth
    shadowColor: COLORS.choice.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.3, // More faded when disabled
  },
  buttonText: {
    ...FONTS.body,
    textAlign: 'center',
    letterSpacing: 0.2, // Slightly wider spacing
    color: COLORS.choice.text,
  },
  buttonTextPressed: {
    color: COLORS.choice.textHover, // Red tint when pressed
  },
  buttonTextDisabled: {
    color: COLORS.text.muted,
  },
});

export default ChoiceButton;

