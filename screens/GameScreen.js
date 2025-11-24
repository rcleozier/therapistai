import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/colors';
import MessageBubble from '../components/MessageBubble';
import ChoiceButton from '../components/ChoiceButton';
import storyEngine from '../utils/storyEngine';
import { Analytics } from '../utils/analytics';
import { stopBackgroundMusic, playGameMusic, stopGameMusic } from '../utils/audioManager';
import SettingsButton from '../components/SettingsButton';
import { processNodeInteractiveElements } from '../utils/interactiveElements';

const GameScreen = ({ route }) => {
  const [currentNode, setCurrentNode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [choices, setChoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedMessageIndex, setDisplayedMessageIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const choiceCountRef = useRef(0);
  const nodeVisitCountRef = useRef(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const typingOpacity = useRef(new Animated.Value(0)).current;

  // Initialize story on mount
  useEffect(() => {
    // playGameMusic() already stops all music via stopAllMusic(), so we just call it directly
    const setupAudio = async () => {
      await playGameMusic();
    };
    setupAudio();

    const initializeGame = async () => {
      try {
        const startNew = route?.params?.startNew ?? true;
        let initialNode;

        if (startNew) {
          // Clear any saved state and start fresh
          await storyEngine.clearGameState();
          initialNode = storyEngine.start();
        } else {
          // Continue from saved state
          initialNode = await storyEngine.continue();
        }

        if (initialNode) {
          setCurrentNode(initialNode);
          setMessages(initialNode.messages);
          setChoices(initialNode.choices);
          setDisplayedMessageIndex(0);
          
          // Fade in animation
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800, // Slow fade - creates unease
            useNativeDriver: true,
          }).start();
          
          // Subtle haptic feedback when game starts
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          
          // Track game start
          Analytics.trackGameStart();
          Analytics.trackScreenView('Game');
          
          // Track initial node visit
          if (initialNode.nodeId) {
            Analytics.trackGameNodeVisit(initialNode.nodeId, 'intro');
            nodeVisitCountRef.current = 1;
          }

          // Process interactive elements for initial node
          await processNodeInteractiveElements(initialNode, 2000);

          // Save initial state
          await storyEngine.saveGameState();
        }
      } catch (error) {
        console.error('Failed to initialize story:', error);
      }
    };

    initializeGame();
  }, [route?.params?.startNew]);

  // Display messages one at a time with typing effect
  useEffect(() => {
    if (messages.length === 0) return;

    if (displayedMessageIndex < messages.length) {
      setIsTyping(true);
      
      // Animate typing indicator
      Animated.sequence([
        Animated.timing(typingOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(typingOpacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
      
      const timer = setTimeout(() => {
        setDisplayedMessageIndex(displayedMessageIndex + 1);
        setIsTyping(false);
        typingOpacity.setValue(0);
        
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
      }, 1000); // Slightly longer delay - creates tension

      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
      typingOpacity.setValue(0);
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

        // Process interactive elements for the new node (after a short delay)
        await processNodeInteractiveElements(nextNode, 1500);

        // Save game state after making a choice
        await storyEngine.saveGameState();
      } else {
        console.error('Failed to load next node');
      }
    } catch (error) {
      console.error('Error making choice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = async () => {
    // Medium haptic feedback for restart
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Track game restart
    Analytics.trackGameRestart();
    
    // Reset counters
    choiceCountRef.current = 0;
    nodeVisitCountRef.current = 0;
    
    // Clear saved state and start fresh
    await storyEngine.clearGameState();
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

    // Save initial state
    await storyEngine.saveGameState();
  };

  const displayedMessages = messages.slice(0, displayedMessageIndex);
  const showChoices = displayedMessageIndex >= messages.length && choices.length > 0 && !isLoading;
  const isEnding = currentNode?.isEnding && displayedMessageIndex >= messages.length;

  // Track ending when reached
  useEffect(() => {
    if (isEnding && currentNode?.nodeId) {
      // Strong haptic feedback for ending
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
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

  // Cleanup when leaving game screen
  useEffect(() => {
    return () => {
      stopGameMusic();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.title}>THERAPISTAI</Text>
        <View style={styles.headerRight}>
          {isEnding && (
            <TouchableOpacity onPress={handleRestart} style={styles.restartButton}>
              <Text style={styles.restartText}>RESTART</Text>
            </TouchableOpacity>
          )}
          <SettingsButton style={styles.settingsButton} />
        </View>
      </Animated.View>

      <Animated.View style={[styles.contentWrapper, { opacity: fadeAnim }]}>
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
            <Animated.View style={[styles.typingIndicator, { opacity: typingOpacity }]}>
              <View style={styles.typingDots}>
                <View style={[styles.dot, styles.dot1]} />
                <View style={[styles.dot, styles.dot2]} />
                <View style={[styles.dot, styles.dot3]} />
              </View>
            </Animated.View>
          )}

          {showChoices && (
            <View style={styles.choicesContainer}>
              <Text style={styles.choicesLabel}>CHOOSE YOUR RESPONSE</Text>
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
              <Text style={styles.endingText}>THE STORY HAS ENDED</Text>
              <TouchableOpacity onPress={handleRestart} style={styles.restartButtonLarge}>
                <Text style={styles.restartTextLarge}>PLAY AGAIN</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </Animated.View>
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
    paddingHorizontal: SPACING.xl, // Wider padding - more breathing room
    paddingVertical: SPACING.lg, // Taller header - more presence
    borderBottomWidth: 0.5, // Thinner border - subtle
    borderBottomColor: COLORS.divider,
    backgroundColor: COLORS.background,
    position: 'relative',
    zIndex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  title: {
    ...FONTS.heading,
    color: COLORS.text.primary,
    letterSpacing: 2, // Extra spacing for clinical feel
  },
  restartButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  restartText: {
    ...FONTS.caption,
    color: COLORS.accent.red,
    letterSpacing: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: SPACING.xl, // More vertical padding
    paddingBottom: SPACING.xxl + SPACING.md, // Extra bottom padding
    paddingHorizontal: 0, // No horizontal padding - handled by MessageBubble
  },
  typingIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.message.ai.text,
    opacity: 0.6,
  },
  dot1: {
    // Will be animated separately if needed
  },
  dot2: {
    // Will be animated separately if needed
  },
  dot3: {
    // Will be animated separately if needed
  },
  choicesContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl, // More space before choices
    marginTop: SPACING.xl, // More separation
    borderTopWidth: 0.5, // Thinner divider
    borderTopColor: COLORS.divider,
  },
  choicesLabel: {
    ...FONTS.caption,
    color: COLORS.text.muted, // More muted
    marginBottom: SPACING.lg, // More space
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  endingContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl, // Much more space
    paddingBottom: SPACING.xl,
    alignItems: 'center',
  },
  endingText: {
    ...FONTS.caption,
    color: COLORS.text.muted,
    marginBottom: SPACING.xl,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  restartButtonLarge: {
    backgroundColor: COLORS.choice.background,
    borderWidth: 0.5,
    borderColor: COLORS.choice.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl + SPACING.md,
    minWidth: 180,
    shadowColor: COLORS.choice.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  restartTextLarge: {
    ...FONTS.bodyBold,
    color: COLORS.accent.red,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  settingsButton: {
    // Positioned within header, no absolute positioning needed
  },
});

export default GameScreen;

