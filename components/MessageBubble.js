import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, FONTS, BORDER_RADIUS, SPACING } from '../constants/colors';

/**
 * MessageBubble component - premium styled chat messages
 * Features refined styling with character avatar for AI messages
 */
const MessageBubble = ({ message, index }) => {
  const { from, type, text } = message;
  
  const isAI = from === 'ai';
  const isNarrator = from === 'narrator';
  const isPlayer = from === 'player';

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
    <View style={[styles.messageWrapper, bubbleStyles.wrapper]}>
      {isAI && (
        <View style={styles.avatarContainer}>
          <Image
            source={require('../assets/character-removebg.png')}
            style={styles.characterImage}
            resizeMode="contain"
          />
          {/* Soft cyan eye glow effect */}
          <View style={styles.avatarGlow} />
        </View>
      )}
      <View style={[styles.bubble, bubbleStyles.container]}>
        <Text style={[bubbleStyles.text]}>
          {text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageWrapper: {
    // Slightly tighter spacing so more messages fit on screen
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg + 2,
    paddingVertical: SPACING.xs,
  },
  aiWrapper: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: SPACING.sm + 2, // Gap between avatar and bubble
  },
  playerWrapper: {
    alignItems: 'flex-end',
  },
  narratorWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  avatarContainer: {
    position: 'relative',
    width: 40, // Slightly larger avatar (refined from spec)
    height: 40,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: SPACING.xs, // Align with top of bubble
  },
  characterImage: {
    width: 40,
    height: 40,
    opacity: 0.9, // Slight transparency (refined from spec)
    zIndex: 1,
  },
  avatarGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent.cyan,
    opacity: 0.15, // Soft cyan eye glow (refined from spec)
    zIndex: 0,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: SPACING.md + 2,
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.sm,
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
    paddingVertical: SPACING.sm + 4,
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

export default MessageBubble;

