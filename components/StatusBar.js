import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/colors';

/**
 * StatusBar component - subtle system-like status row for chat state.
 * Shows animated dots when the AI is "typing", otherwise a static label.
 */
const StatusBar = ({ isTyping = false, statusText = 'Processing…' }) => {
  const dot1Anim = useRef(new Animated.Value(0.3)).current;
  const dot2Anim = useRef(new Animated.Value(0.3)).current;
  const dot3Anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (isTyping) {
      // Animate dots in sequence for pulsing effect
      const createAnimation = (anim, delay) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        );
      };

      const anim1 = createAnimation(dot1Anim, 0);
      const anim2 = createAnimation(dot2Anim, 200);
      const anim3 = createAnimation(dot3Anim, 400);

      anim1.start();
      anim2.start();
      anim3.start();

      return () => {
        anim1.stop();
        anim2.stop();
        anim3.stop();
      };
    } else {
      // Reset to default opacity
      dot1Anim.setValue(0.3);
      dot2Anim.setValue(0.3);
      dot3Anim.setValue(0.3);
    }
  }, [isTyping]);

  const label = isTyping ? 'Waiting for your response' : statusText;

  return (
    <View style={styles.wrapper}>
      {/* Hairline dividers above and below to keep it feeling like a system status strip */}
      <View style={styles.divider} />
      <View style={styles.container}>
        {isTyping ? (
          <View style={styles.typingContainer}>
            <Text style={styles.statusText}>{label}</Text>
            <View style={styles.dotsContainer}>
              <Animated.View style={[styles.dot, { opacity: dot1Anim }]} />
              <Animated.View style={[styles.dot, { opacity: dot2Anim }]} />
              <Animated.View style={[styles.dot, { opacity: dot3Anim }]} />
            </View>
          </View>
        ) : (
          <Text style={styles.statusText}>{label}</Text>
        )}
      </View>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.background,
  },
  container: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.18)', // 15–20% opacity hairline
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  typingLabel: {
    ...FONTS.status,
    color: COLORS.text.status,
    marginRight: SPACING.xs,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.text.status,
  },
  statusText: {
    ...FONTS.status,
    fontSize: 12,
    letterSpacing: 0.5,
    color: COLORS.text.status,
    opacity: 0.6, // Make status feel secondary to messages
  },
});

export default StatusBar;

