import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
      };
    } else if (isNarrator) {
      return {
        container: styles.narratorContainer,
        text: styles.narratorText,
      };
    } else {
      return {
        container: styles.playerContainer,
        text: styles.playerText,
      };
    }
  };

  const bubbleStyles = getStyles();

  return (
    <View style={[styles.messageWrapper, isPlayer && styles.playerWrapper]}>
      <View style={[styles.bubble, bubbleStyles.container]}>
        <Text style={[styles.text, bubbleStyles.text]}>
          {text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageWrapper: {
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  playerWrapper: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '85%',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
  aiContainer: {
    backgroundColor: COLORS.message.ai.background,
    borderColor: COLORS.message.ai.border,
    alignSelf: 'flex-start',
  },
  playerContainer: {
    backgroundColor: COLORS.message.player.background,
    borderColor: COLORS.message.player.border,
    alignSelf: 'flex-end',
  },
  narratorContainer: {
    backgroundColor: COLORS.message.narrator.background,
    borderColor: COLORS.message.narrator.border,
    alignSelf: 'center',
    maxWidth: '95%',
    borderStyle: 'dashed',
  },
  text: {
    ...FONTS.body,
    lineHeight: 22,
  },
  aiText: {
    color: COLORS.message.ai.text,
    ...FONTS.aiMessage,
  },
  playerText: {
    color: COLORS.message.player.text,
  },
  narratorText: {
    color: COLORS.message.narrator.text,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default MessageBubble;

