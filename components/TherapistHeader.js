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

// Chat content horizontal padding constant - used for alignment
const CHAT_CONTENT_PADDING = SPACING.lg;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: CHAT_CONTENT_PADDING, // Aligned with chat content margins
    paddingTop: SPACING.md + 4,
    paddingBottom: SPACING.md + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)', // More subtle divider
    backgroundColor: 'transparent',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md, // Increased gap for better spacing
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 2, // Tighter gap for better balance
  },
  backButton: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs,
    minWidth: 44, // 44x44pt touch target
    minHeight: 44,
    justifyContent: 'center',
  },
  backText: {
    ...FONTS.caption,
    color: COLORS.text.primary,
    opacity: 0.4, // Reduced opacity - title is visual anchor
    letterSpacing: 0.8,
    fontSize: 12,
    fontWeight: '400',
  },
  title: {
    ...FONTS.heading,
    fontSize: 20, // Larger and bolder
    letterSpacing: 0.5,
    color: COLORS.text.primary,
    fontWeight: '600', // Semi-bold for visual anchor
  },
  restartButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
  },
  restartText: {
    ...FONTS.caption,
    color: COLORS.accent.red,
    letterSpacing: 0.8,
    fontSize: 11,
  },
  settingsButton: {
    opacity: 0.4, // Reduced opacity - title is visual anchor
  },
});

export default TherapistHeader;


