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
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING } from '../constants/colors';
import MessageBubble from '../components/MessageBubble';
import ChoiceButton from '../components/ChoiceButton';
import storyEngine from '../utils/storyEngine';
import { Analytics } from '../utils/analytics';

const GameScreen = () => {
  const [currentNode, setCurrentNode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [choices, setChoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedMessageIndex, setDisplayedMessageIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const choiceCountRef = useRef(0);
  const nodeVisitCountRef = useRef(0);

  // Initialize story on mount
  useEffect(() => {
    try {
      const initialNode = storyEngine.start();
      if (initialNode) {
        setCurrentNode(initialNode);
        setMessages(initialNode.messages);
        setChoices(initialNode.choices);
        setDisplayedMessageIndex(0);
        
        // Track game start
        Analytics.trackGameStart();
        Analytics.trackScreenView('Game');
        
        // Track initial node visit
        if (initialNode.nodeId) {
          Analytics.trackGameNodeVisit(initialNode.nodeId, 'intro');
          nodeVisitCountRef.current = 1;
        }
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
        
        // Subtle haptic feedback when new message appears
        const currentMessage = messages[displayedMessageIndex];
        if (currentMessage) {
          // Different haptics based on message type
          if (currentMessage.from === 'ai') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } else if (currentMessage.from === 'narrator') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }
        }
        
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
      // Find the choice label for tracking
      const choice = choices.find(c => c.id === choiceId);
      const choiceLabel = choice?.label || 'Unknown';
      
      // Track the choice
      Analytics.trackGameChoice(choiceId, choiceLabel, currentNode?.nodeId);
      choiceCountRef.current += 1;
      
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const nextNode = storyEngine.makeChoice(choiceId);
      
      if (nextNode) {
        setCurrentNode(nextNode);
        setMessages(nextNode.messages);
        setChoices(nextNode.choices);
        setDisplayedMessageIndex(0);
        
        // Track node visit
        if (nextNode.nodeId) {
          const nodeType = nextNode.isEnding ? 'ending' : 'story';
          Analytics.trackGameNodeVisit(nextNode.nodeId, nodeType);
          nodeVisitCountRef.current += 1;
        }
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
    // Medium haptic feedback for restart
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Track game restart
    Analytics.trackGameRestart();
    
    // Reset counters
    choiceCountRef.current = 0;
    nodeVisitCountRef.current = 0;
    
    const initialNode = storyEngine.reset();
    setCurrentNode(initialNode);
    setMessages(initialNode.messages);
    setChoices(initialNode.choices);
    setDisplayedMessageIndex(0);
    
    // Track new game start
    Analytics.trackGameStart();
    if (initialNode.nodeId) {
      Analytics.trackGameNodeVisit(initialNode.nodeId, 'intro');
      nodeVisitCountRef.current = 1;
    }
  };

  const displayedMessages = messages.slice(0, displayedMessageIndex);
  const showChoices = displayedMessageIndex >= messages.length && choices.length > 0 && !isLoading;
  const isEnding = currentNode?.isEnding && displayedMessageIndex >= messages.length;

  // Track ending when reached
  useEffect(() => {
    if (isEnding && currentNode?.nodeId) {
      // Extract ending name from node ID
      const endingName = currentNode.nodeId
        .replace(/_ending$/, '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      Analytics.trackGameEnding(
        endingName,
        choiceCountRef.current,
        nodeVisitCountRef.current
      );
    }
  }, [isEnding, currentNode]);

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

