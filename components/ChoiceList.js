import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/colors';
import ChoiceButton from './ChoiceButton';

// Chat content horizontal padding constant - matches header and messages
const CHAT_CONTENT_PADDING = SPACING.lg;

/**
 * ChoiceList
 *
 * Pinned bottom panel that renders the "CHOOSE YOUR RESPONSE" label
 * and the list of choice buttons. Hidden entirely when there are no choices.
 */
const ChoiceList = ({ choices, onChoice, isLoading }) => {
  if (!choices || choices.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.topBorder} />
      <View style={styles.container}>
        <Text style={styles.label}>Choose your response</Text>
        <View style={styles.choicesContainer}>
          {choices.map((choice) => (
            <ChoiceButton
              key={choice.id}
              choice={choice}
              onPress={onChoice}
              disabled={isLoading}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.background,
    paddingBottom: SPACING.lg, // More space for home indicator clearance
    paddingTop: SPACING.xs, // Subtle top padding
  },
  topBorder: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // More subtle border
    marginBottom: SPACING.sm,
  },
  container: {
    paddingTop: SPACING.md, // More generous top padding
    paddingHorizontal: CHAT_CONTENT_PADDING, // Consistent with header and messages
  },
  label: {
    ...FONTS.caption,
    fontSize: 11,
    textAlign: 'left', // Left-aligned for consistency
    letterSpacing: 1.0, // Small caps feel with letter-spacing
    color: COLORS.text.secondary, // Higher contrast gray (rgba(154, 158, 164, 0.7))
    opacity: 0.8, // More legible
    marginBottom: SPACING.md + 2, // Space before choices
    fontWeight: '500', // Medium weight for section label
    textTransform: 'uppercase', // Small caps
  },
  choicesContainer: {
    // Tighter vertical spacing between buttons but still tappable
  },
});

export default ChoiceList;


