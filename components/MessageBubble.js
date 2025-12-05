import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { COLORS, FONTS, BORDER_RADIUS, SPACING } from '../constants/colors';

// Chat content horizontal padding constant - matches header
const CHAT_CONTENT_PADDING = SPACING.lg;
// Avatar size constant
const AVATAR_SIZE = 44; // 40-48px range
// Horizontal gutter between avatar and bubble
const AVATAR_BUBBLE_GUTTER = SPACING.md;

/**
 * ChatMessage component - premium styled chat messages with empathetic micro-interactions
 * Features refined styling with square character avatar for AI messages
 */
const ChatMessage = ({ message, isLatest = false, shouldAnimate = true }) => {
  const { from, type, text } = message;
  
  const isAI = from === 'ai';
  const isNarrator = from === 'narrator';
  const isPlayer = from === 'player';

  const fadeAnim = useRef(new Animated.Value(shouldAnimate ? 0 : 1)).current; // Start visible if no animation
  const glowAnim = useRef(new Animated.Value(0.1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Calculate if this is an initial message (available in render scope)
  const isInitial = message.id === 'm1' || message.id === 'm2' || message.id === 'm3';

  useEffect(() => {
    // Skip animations for old messages when continuing
    if (!shouldAnimate) {
      fadeAnim.setValue(1);
      return;
    }
    
    // Welcoming fade-in with gentle scale for initial messages
    if (isInitial && isAI) {
      scaleAnim.setValue(0.96);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600, // Slower, more welcoming for initial messages
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Staggered fade-in for smoother conversation flow
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250, // Faster for smoother flow
        useNativeDriver: true,
      }).start();
    }

    // Subtle breathing glow for latest AI message (empathetic cue)
    if (isAI && isLatest) {
      const breathing = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.12, // Subtle glow
            duration: 2500, // Slower, more calming
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.08,
            duration: 2500,
            useNativeDriver: false,
          }),
        ])
      );
      breathing.start();
      return () => breathing.stop();
    } else if (isAI) {
      // Set initial glow for non-latest messages
      glowAnim.setValue(isInitial ? 0.1 : 0.08);
    }
  }, [isAI, isLatest, message.id, isInitial, shouldAnimate]);

  const getStyles = () => {
    if (isAI) {
      return {
        container: styles.aiContainer,
        text: styles.aiText,
        wrapper: styles.aiWrapper,
      };
    } else if (isNarrator) {
      return {
        container: styles.narratorContainer,
        text: styles.narratorText,
        wrapper: styles.narratorWrapper,
      };
    } else {
      return {
        container: styles.playerContainer,
        text: styles.playerText,
        wrapper: styles.playerWrapper,
      };
    }
  };

  const bubbleStyles = getStyles();

  return (
    <Animated.View 
      style={[
        styles.messageWrapper, 
        bubbleStyles.wrapper, 
        { 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      {isAI && (
        <View style={styles.aiMessageGroup}>
          {/* Square avatar with border and glow */}
          <View style={styles.avatarContainer} pointerEvents="none">
            <Animated.View 
              style={[
                styles.avatarGlow,
                { opacity: isLatest ? glowAnim : (isInitial ? 0.1 : 0.08) }
              ]} 
            />
            <Image
              source={require('../assets/character.png')}
              style={styles.avatarImage}
              resizeMode="contain"
            />
          </View>
          {/* Message bubble aligned with avatar */}
          <View style={styles.aiBubbleWrapper}>
            <Text style={styles.therapistLabel}>Therapist</Text>
            <View style={[styles.bubble, bubbleStyles.container]}>
              <Text style={bubbleStyles.text}>{text}</Text>
            </View>
          </View>
        </View>
      )}
      {!isAI && (
        <View style={styles.bubbleWrapper}>
          <View style={[styles.bubble, bubbleStyles.container]}>
            <Text style={bubbleStyles.text}>{text}</Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  messageWrapper: {
    marginBottom: SPACING.md + 4, // More vertical spacing between messages
    paddingHorizontal: CHAT_CONTENT_PADDING, // Consistent with header
    paddingTop: SPACING.xs, // Only top padding
    paddingBottom: 0, // No bottom padding - avatar flush to bottom
  },
  aiWrapper: {
    // Legacy - kept for compatibility
  },
  playerWrapper: {
    alignItems: 'flex-end',
    width: '100%',
  },
  narratorWrapper: {
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.lg + 4, // Extra separation so narrator feels like its own beat
  },
  // AI message group - avatar and bubble as single unit
  aiMessageGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Align avatar to bottom of container
    width: '100%',
    marginBottom: 0, // No bottom margin
    paddingBottom: 0, // No bottom padding
  },
  avatarContainer: {
    position: 'relative',
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: BORDER_RADIUS.avatar, // 7px rounded corners
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AVATAR_BUBBLE_GUTTER, // Consistent horizontal gutter
    marginBottom: 0, // No bottom margin - fixed to bottom
    marginTop: 0, // No top margin
    borderWidth: 1,
    borderColor: 'rgba(242, 92, 77, 0.25)', // Thin border with accent color at low opacity
    backgroundColor: 'rgba(15, 17, 21, 0.6)',
    overflow: 'hidden',
    alignSelf: 'flex-end', // Force to bottom
  },
  avatarImage: {
    width: AVATAR_SIZE - 6, // Slightly smaller to show border
    height: AVATAR_SIZE - 6,
    zIndex: 2,
  },
  avatarGlow: {
    position: 'absolute',
    width: AVATAR_SIZE + 6,
    height: AVATAR_SIZE + 6,
    borderRadius: BORDER_RADIUS.avatar + 1,
    backgroundColor: COLORS.accent.red,
    zIndex: 0,
  },
  aiBubbleWrapper: {
    flex: 1,
    maxWidth: '80%', // Prevent bubble from getting too wide
    justifyContent: 'flex-end', // Align bubble content to bottom
    paddingBottom: 0, // No bottom padding
    marginBottom: 0, // No bottom margin
  },
  therapistLabel: {
    ...FONTS.small,
    fontSize: 10,
    color: COLORS.text.muted,
    opacity: 0.6,
    marginBottom: SPACING.xs,
    letterSpacing: 0.3,
  },
  bubbleWrapper: {
    // Wrapper for player/narrator bubbles
    alignItems: 'flex-end',
    width: '100%',
  },
  bubble: {
    paddingHorizontal: SPACING.md + 6, // More generous horizontal padding
    paddingVertical: SPACING.md + 4, // More generous vertical padding so text doesn't hug border
    borderRadius: BORDER_RADIUS.sm, // Tighter corner radius (12px) for more modern feel
    borderWidth: 1,
  },
  playerContainer: {
    backgroundColor: COLORS.message.player.background,
    borderColor: COLORS.message.player.border,
    borderWidth: 1,
    shadowColor: COLORS.message.player.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    maxWidth: '75%', // More right-aligned, narrower than AI messages
    alignSelf: 'flex-end', // Ensure right alignment
  },
  aiContainer: {
    backgroundColor: '#13151A', // Slightly lighter than screen background (#050608)
    borderColor: COLORS.message.ai.border, // Desaturated red-orange at 40% opacity
    // Subtle glow effect
    shadowColor: COLORS.message.ai.borderGlow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
  },
  narratorContainer: {
    backgroundColor: 'transparent', // No background - just text floating
    borderColor: COLORS.message.narrator.border,
    borderWidth: 0.5,
    borderStyle: 'dashed', // Dashed border - broken, incomplete
    maxWidth: '90%',
    paddingVertical: SPACING.sm + 2,
    opacity: 0.85,
  },
  aiText: {
    color: COLORS.message.ai.text, // #F3E4D8 muted warm off-white (refined from spec)
    ...FONTS.aiMessage, // Now includes increased line height (26px)
  },
  playerText: {
    color: COLORS.message.player.text,
    ...FONTS.body,
  },
  narratorText: {
    color: COLORS.message.narrator.text,
    ...FONTS.narrator,
    textAlign: 'center',
  },
});

export default ChatMessage;

