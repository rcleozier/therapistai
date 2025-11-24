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
    marginBottom: SPACING.md, // More space between choices
  },
  button: {
    // Container for touch handling
  },
  buttonInner: {
    backgroundColor: COLORS.choice.background, // #13151A (refined from spec)
    borderWidth: 1, // 1px border
    borderRadius: BORDER_RADIUS.md, // 14-16px radius (refined from spec)
    paddingVertical: SPACING.md + 4, // 52-56pt height for good tap targets (refined from spec)
    paddingHorizontal: SPACING.lg + 4, // 20-24px horizontal margin (refined from spec)
    minHeight: 56, // Minimum touch target (52-56pt from spec)
    justifyContent: 'center',
    alignItems: 'center',
    // Subtle shadow for depth
    shadowColor: COLORS.choice.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.3, // More faded when disabled
  },
  buttonText: {
    ...FONTS.body,
    fontSize: 16, // 15-16pt from spec
    fontWeight: '500', // Medium weight (refined from spec)
    textAlign: 'center',
    letterSpacing: 0.2,
    color: COLORS.choice.text, // #F5F3EE soft off-white (refined from spec)
  },
  buttonTextPressed: {
    color: COLORS.choice.textHover, // Red tint when pressed
  },
  buttonTextDisabled: {
    color: COLORS.text.muted,
  },
});

export default ChoiceButton;

