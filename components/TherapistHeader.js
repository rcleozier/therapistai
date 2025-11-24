import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/colors';
import SettingsButton from './SettingsButton';

/**
 * TherapistHeader
 *
 * Shared header for in-game screens:
 * - BACK (low-emphasis text)
 * - Title ("Therapist AI")
 * - Optional RESTART action
 * - Settings gear on the right
 */
const TherapistHeader = ({ onBack, onRestart, showRestart = false }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftGroup}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Therapist AI</Text>
      </View>

      <View style={styles.rightGroup}>
        {showRestart && (
          <TouchableOpacity onPress={onRestart} style={styles.restartButton} activeOpacity={0.7}>
            <Text style={styles.restartText}>RESTART</Text>
          </TouchableOpacity>
        )}
        <SettingsButton style={styles.settingsButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md, // Slightly tighter than before to give chat more room
    paddingBottom: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
    backgroundColor: 'transparent',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  backButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  backText: {
    ...FONTS.caption,
    color: COLORS.text.primary,
    opacity: 0.55, // Lower emphasis so title and content take priority
    letterSpacing: 1,
  },
  title: {
    ...FONTS.heading,
    fontSize: 18, // Slightly smaller to keep things clinical and understated
    letterSpacing: 0.7,
    color: COLORS.text.primary,
  },
  restartButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  restartText: {
    ...FONTS.caption,
    color: COLORS.accent.red,
    letterSpacing: 1,
  },
  settingsButton: {
    opacity: 0.6,
  },
});

export default TherapistHeader;


