import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING } from '../constants/colors';
import MessageBubble from '../components/MessageBubble';
import ChoiceButton from '../components/ChoiceButton';
import storyEngine from '../utils/storyEngine';

const GameScreen = () => {
  const [currentNode, setCurrentNode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [choices, setChoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedMessageIndex, setDisplayedMessageIndex] = useState(0);
  const scrollViewRef = useRef(null);

  // Initialize story on mount
  useEffect(() => {
    try {
      const initialNode = storyEngine.start();
      if (initialNode) {
        setCurrentNode(initialNode);
        setMessages(initialNode.messages);
        setChoices(initialNode.choices);
        setDisplayedMessageIndex(0);
      }
    } catch (error) {
      console.error('Failed to initialize story:', error);
    }
  }, []);

  // Display messages one at a time with typing effect
  useEffect(() => {
    if (messages.length === 0) return;

    if (displayedMessageIndex < messages.length) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setDisplayedMessageIndex(displayedMessageIndex + 1);
        setIsTyping(false);
        // Auto-scroll to bottom when new message appears
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 800); // Delay between messages

      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [messages, displayedMessageIndex]);

  // Auto-scroll when messages change
  useEffect(() => {
    if (displayedMessageIndex > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [displayedMessageIndex]);

  const handleChoice = async (choiceId) => {
    setIsLoading(true);
    
    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const nextNode = storyEngine.makeChoice(choiceId);
      
      if (nextNode) {
        setCurrentNode(nextNode);
        setMessages(nextNode.messages);
        setChoices(nextNode.choices);
        setDisplayedMessageIndex(0);
      } else {
        console.error('Failed to load next node');
      }
    } catch (error) {
      console.error('Error making choice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    const initialNode = storyEngine.reset();
    setCurrentNode(initialNode);
    setMessages(initialNode.messages);
    setChoices(initialNode.choices);
    setDisplayedMessageIndex(0);
  };

  const displayedMessages = messages.slice(0, displayedMessageIndex);
  const showChoices = displayedMessageIndex >= messages.length && choices.length > 0 && !isLoading;
  const isEnding = currentNode?.isEnding && displayedMessageIndex >= messages.length;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>TherapistAI</Text>
        {isEnding && (
          <TouchableOpacity onPress={handleRestart} style={styles.restartButton}>
            <Text style={styles.restartText}>Restart</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {displayedMessages.map((message, index) => (
          <MessageBubble key={message.id || index} message={message} index={index} />
        ))}
        
        {isTyping && (
          <View style={styles.typingIndicator}>
            <ActivityIndicator size="small" color={COLORS.message.ai.text} />
            <Text style={styles.typingText}>AI is typing...</Text>
          </View>
        )}

        {showChoices && (
          <View style={styles.choicesContainer}>
            <Text style={styles.choicesLabel}>Choose your response:</Text>
            {choices.map((choice) => (
              <ChoiceButton
                key={choice.id}
                choice={choice}
                onPress={handleChoice}
                disabled={isLoading}
              />
            ))}
          </View>
        )}

        {isEnding && (
          <View style={styles.endingContainer}>
            <Text style={styles.endingText}>The story has ended.</Text>
            <TouchableOpacity onPress={handleRestart} style={styles.restartButtonLarge}>
              <Text style={styles.restartTextLarge}>Play Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    ...FONTS.heading,
    color: COLORS.text.primary,
  },
  restartButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  restartText: {
    ...FONTS.caption,
    color: COLORS.accent.red,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  typingText: {
    ...FONTS.caption,
    color: COLORS.text.muted,
    marginLeft: SPACING.sm,
  },
  choicesContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    marginTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  choicesLabel: {
    ...FONTS.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  endingContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    alignItems: 'center',
  },
  endingText: {
    ...FONTS.body,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  restartButtonLarge: {
    backgroundColor: COLORS.choice.background,
    borderWidth: 1,
    borderColor: COLORS.choice.border,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    minWidth: 150,
  },
  restartTextLarge: {
    ...FONTS.bodyBold,
    color: COLORS.accent.red,
    textAlign: 'center',
  },
});

export default GameScreen;

