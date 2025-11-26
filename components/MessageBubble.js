import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { COLORS, FONTS, BORDER_RADIUS, SPACING } from '../constants/colors';

/**
 * ChatMessage component - premium styled chat messages with empathetic micro-interactions
 * Features refined styling with character avatar for AI messages
 */
const ChatMessage = ({ message, isLatest = false }) => {
  const { from, type, text } = message;
  
  const isAI = from === 'ai';
  const isNarrator = from === 'narrator';
  const isPlayer = from === 'player';

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.1)).current;

  useEffect(() => {
    // Gentle fade-in for new messages
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Subtle breathing glow for latest AI message (empathetic cue)
    if (isAI && isLatest) {
      const breathing = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.15,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.1,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      );
      breathing.start();
      return () => breathing.stop();
    }
  }, [isAI, isLatest]);

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
    <Animated.View style={[styles.messageWrapper, bubbleStyles.wrapper, { opacity: fadeAnim }]}>
      {isAI && (
        <View style={styles.avatarContainer} pointerEvents="none">
          <Image
            source={require('../assets/character-removebg.png')}
            style={styles.characterImage}
            resizeMode="contain"
          />
          {/* Gentle breathing glow for empathetic presence */}
          <Animated.View 
            style={[
              styles.avatarGlow,
              { opacity: isLatest ? glowAnim : 0.1 }
            ]} 
          />
        </View>
      )}
      <View style={[styles.bubble, bubbleStyles.container]}>
        <Text style={bubbleStyles.text}>{text}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  messageWrapper: {
    // Improved vertical rhythm with more breathing room
    marginBottom: SPACING.md + 2, // Increased from sm to md+2 for better spacing
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs + 2,
  },
  aiWrapper: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: SPACING.md, // Increased gap for better visual separation
  },
  playerWrapper: {
    alignItems: 'flex-end',
  },
  narratorWrapper: {
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.lg + 4, // Extra separation so narrator feels like its own beat
  },
  avatarContainer: {
    position: 'relative',
    width: 36,
    height: 36,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: SPACING.xs, // Align with top of bubble
  },
  characterImage: {
    width: 32,
    height: 32,
    opacity: 0.9, // Slight transparency (refined from spec)
    zIndex: 1,
  },
  avatarGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent.cyan,
    opacity: 0.1, // Subtle glow for empathetic presence
    zIndex: 0,
  },
  bubble: {
    maxWidth: '80%', // Slightly narrower for better readability
    paddingHorizontal: SPACING.md + 4, // More generous horizontal padding
    paddingVertical: SPACING.md + 2, // More generous vertical padding
    borderRadius: BORDER_RADIUS.md, // Slightly larger radius for softer feel
    borderWidth: 1,
  },
  aiContainer: {
    backgroundColor: COLORS.message.ai.background, // #111318 (refined from spec)
    borderColor: COLORS.message.ai.border, // Desaturated red-orange at 40% opacity
    // Outer glow effect for alert feel (10-15% opacity)
    shadowColor: COLORS.message.ai.borderGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12, // 10-15% opacity glow
    shadowRadius: 8,
    elevation: 2,
  },
  playerContainer: {
    backgroundColor: COLORS.message.player.background,
    borderColor: COLORS.message.player.border,
    borderWidth: 0.5,
    shadowColor: COLORS.message.player.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
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
    ...FONTS.aiMessage,
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

