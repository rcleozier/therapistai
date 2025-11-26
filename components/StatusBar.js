import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/colors';

/**
 * StatusBar component - empathetic, subtle status indicator
 * Shows gentle breathing animation when waiting, minimal when processing
 */
const StatusBar = ({ isTyping = false, statusText = 'Processing…' }) => {
  const breathingAnim = useRef(new Animated.Value(0.4)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isTyping) {
      // Gentle breathing animation - subtle, empathetic
      const breathing = Animated.loop(
        Animated.sequence([
          Animated.timing(breathingAnim, {
            toValue: 0.7,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(breathingAnim, {
            toValue: 0.4,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );

      // Subtle pulse for the indicator dot
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );

      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      breathing.start();
      pulse.start();

      return () => {
        breathing.stop();
        pulse.stop();
      };
    } else {
      // Fade out and reset
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      breathingAnim.setValue(0.4);
      pulseAnim.setValue(1);
    }
  }, [isTyping]);

  const label = isTyping ? 'Waiting for your response' : statusText;

  return (
    <Animated.View style={[styles.wrapper, { opacity: fadeAnim }]}>
      <View style={styles.divider} />
      <View style={styles.container}>
        {isTyping ? (
          <View style={styles.waitingContainer}>
            <Animated.View
              style={[
                styles.indicatorDot,
                {
                  opacity: breathingAnim,
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            />
            <Text style={styles.statusText}>{label}</Text>
          </View>
        ) : (
          <Text style={styles.statusText}>{statusText}</Text>
        )}
      </View>
      <View style={styles.divider} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.background,
  },
  container: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // More subtle divider
  },
  waitingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent.red,
    opacity: 0.5,
  },
  statusText: {
    ...FONTS.status,
    fontSize: 12,
    letterSpacing: 0.4,
    color: COLORS.text.status,
    opacity: 0.5, // More subtle, non-distracting
    fontWeight: '400',
  },
});

export default StatusBar;

