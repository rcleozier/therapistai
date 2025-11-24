import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, BORDER_RADIUS, SPACING } from '../constants/colors';

const ChoiceButton = ({ choice, onPress, disabled = false }) => {
  const handlePress = () => {
    if (!disabled) {
      // Light impact feedback for choice selection
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress(choice.id);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
        {choice.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.choice.background,
    borderWidth: 1,
    borderColor: COLORS.choice.border,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    minHeight: 50,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...FONTS.body,
    color: COLORS.choice.text,
    textAlign: 'center',
  },
  buttonTextDisabled: {
    color: COLORS.text.muted,
  },
});

export default ChoiceButton;

