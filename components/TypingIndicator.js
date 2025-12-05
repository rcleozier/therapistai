import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { COLORS, FONTS, BORDER_RADIUS, SPACING } from '../constants/colors';

// Chat content horizontal padding constant - matches header
const CHAT_CONTENT_PADDING = SPACING.lg;
// Avatar size constant
const AVATAR_SIZE = 44;
// Horizontal gutter between avatar and bubble
const AVATAR_BUBBLE_GUTTER = SPACING.md;

/**
 * TypingIndicator component - shows animated typing dots in a speech bubble
 * Appears when AI is "typing" a response
 */
const TypingIndicator = () => {
  const dot1Anim = useRef(new Animated.Value(0.3)).current;
  const dot2Anim = useRef(new Animated.Value(0.3)).current;
  const dot3Anim = useRef(new Animated.Value(0.3)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Animate dots in sequence
    const createDotAnimation = (dotAnim, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dotAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const dot1 = createDotAnimation(dot1Anim, 0);
    const dot2 = createDotAnimation(dot2Anim, 200);
    const dot3 = createDotAnimation(dot3Anim, 400);

    dot1.start();
    dot2.start();
    dot3.start();

    return () => {
      dot1.stop();
      dot2.stop();
      dot3.stop();
    };
  }, []);

  return (
    <Animated.View 
      style={[
        styles.messageWrapper,
        { opacity: fadeAnim }
      ]}
    >
      <View style={styles.aiMessageGroup}>
        {/* Avatar */}
        <View style={styles.avatarContainer} pointerEvents="none">
          <View style={styles.avatarGlow} />
          <Image
            source={require('../assets/character.png')}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        </View>
        {/* Typing bubble */}
        <View style={styles.aiBubbleWrapper}>
          <Text style={styles.therapistLabel}>Therapist</Text>
          <View style={styles.typingBubble}>
            <Animated.View style={[styles.dot, { opacity: dot1Anim }]} />
            <Animated.View style={[styles.dot, { opacity: dot2Anim }]} />
            <Animated.View style={[styles.dot, { opacity: dot3Anim }]} />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  messageWrapper: {
    marginBottom: SPACING.md + 4,
    paddingHorizontal: CHAT_CONTENT_PADDING,
    paddingTop: SPACING.xs,
    paddingBottom: 0,
  },
  aiMessageGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 0,
    paddingBottom: 0,
  },
  avatarContainer: {
    position: 'relative',
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: BORDER_RADIUS.avatar,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AVATAR_BUBBLE_GUTTER,
    marginBottom: 0,
    marginTop: 0,
    borderWidth: 1,
    borderColor: 'rgba(242, 92, 77, 0.25)',
    backgroundColor: 'rgba(15, 17, 21, 0.6)',
    overflow: 'hidden',
    alignSelf: 'flex-end',
  },
  avatarGlow: {
    position: 'absolute',
    width: AVATAR_SIZE + 6,
    height: AVATAR_SIZE + 6,
    borderRadius: BORDER_RADIUS.avatar + 1,
    backgroundColor: COLORS.accent.red,
    zIndex: 0,
    opacity: 0.08,
  },
  avatarImage: {
    width: AVATAR_SIZE - 6,
    height: AVATAR_SIZE - 6,
    zIndex: 2,
    opacity: 0.9,
  },
  aiBubbleWrapper: {
    flex: 1,
    maxWidth: '80%',
    justifyContent: 'flex-end',
    paddingBottom: 0,
    marginBottom: 0,
  },
  therapistLabel: {
    ...FONTS.small,
    fontSize: 10,
    color: COLORS.text.muted,
    opacity: 0.6,
    marginBottom: SPACING.xs,
    letterSpacing: 0.3,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13151A',
    borderColor: COLORS.message.ai.border,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md + 6,
    paddingVertical: SPACING.md + 4,
    minWidth: 60,
    shadowColor: COLORS.message.ai.borderGlow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.text.muted,
    marginRight: 4,
    opacity: 0.5,
  },
});

export default TypingIndicator;

