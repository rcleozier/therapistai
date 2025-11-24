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
        <Text style={styles.label}>CHOOSE YOUR RESPONSE</Text>
        <View>
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
    paddingBottom: SPACING.md, // clears home indicator on modern iPhones
  },
  topBorder: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.dividerGradient, // accent-tinted hairline
    opacity: 0.4,
  },
  container: {
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  label: {
    ...FONTS.caption,
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 1.4,
    color: COLORS.text.muted,
    opacity: 0.6, // System-like meta label
    marginBottom: SPACING.md,
  },
});

export default ChoiceList;


