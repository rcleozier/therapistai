import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/colors';
import ChoiceButton from './ChoiceButton';

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
    paddingHorizontal: SPACING.lg,
  },
  label: {
    ...FONTS.caption,
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 0.8, // Reduced from 1.4 for less aggressive feel
    color: COLORS.text.muted,
    opacity: 0.5, // More subtle
    marginBottom: SPACING.md + 4, // More space before choices
    fontWeight: '400',
    textTransform: 'none', // Title case instead of all caps
  },
  choicesContainer: {
    paddingTop: SPACING.xs, // Subtle padding for visual separation
  },
});

export default ChoiceList;


