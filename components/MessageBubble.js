import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, FONTS, BORDER_RADIUS, SPACING } from '../constants/colors';

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
        <Image
          source={require('../assets/character-removebg.png')}
          style={styles.characterImage}
          resizeMode="contain"
        />
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
    marginBottom: SPACING.lg, // More space between messages - clinical spacing
    paddingHorizontal: SPACING.lg, // Wider margins
  },
  aiWrapper: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  playerWrapper: {
    alignItems: 'flex-end',
  },
  narratorWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  bubble: {
    maxWidth: '78%', // Slightly narrower - more intimate, claustrophobic
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.sm, // Smaller radius - more clinical, less friendly
    borderWidth: 0.5, // Thinner border - subtle
  },
  aiContainer: {
    backgroundColor: COLORS.message.ai.background,
    borderColor: COLORS.message.ai.border,
    borderWidth: 0.5,
    // Subtle shadow for depth and unease
    shadowColor: COLORS.message.ai.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
    color: COLORS.message.ai.text,
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
  characterImage: {
    width: 32,
    height: 32,
    opacity: 0.9,
    marginTop: SPACING.xs,
  },
});

export default MessageBubble;

