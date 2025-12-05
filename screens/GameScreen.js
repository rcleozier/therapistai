import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/colors';
import StatusBar from '../components/StatusBar';
import ChatMessage from '../components/MessageBubble';
import TherapistHeader from '../components/TherapistHeader';
import ChoiceList from '../components/ChoiceList';
import storyEngine from '../utils/storyEngine';
import { Analytics } from '../utils/analytics';
import { stopBackgroundMusic, playGameMusic, stopGameMusic } from '../utils/audioManager';
import SettingsButton from '../components/SettingsButton';
import { processNodeInteractiveElements } from '../utils/interactiveElements';

const GameScreen = ({ route, navigation }) => {
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
    const initializeGame = async () => {
      try {
        const startNew = route?.params?.startNew ?? true;
        const storyLineId = route?.params?.storyLineId || 'therapy_ai_session_1'; // Default to first story line
        
        // playGameMusic() already stops all music via stopAllMusic(), so we just call it directly
        const setupAudio = async () => {
          await playGameMusic(storyLineId);
        };
        setupAudio();
        let initialNode;

        if (startNew) {
          // Clear any saved state and start fresh
          await storyEngine.clearGameState(storyLineId);
          initialNode = storyEngine.start(storyLineId);
        } else {
          // Continue from saved state
          initialNode = await storyEngine.continue(storyLineId);
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

          // Process interactive elements for initial node (reduced delay for better UX)
          // Process after a short delay so user sees the first message first
          setTimeout(() => {
            processNodeInteractiveElements(initialNode, 500);
          }, 1000);

          // Save initial state
          await storyEngine.saveGameState();
        }
      } catch (error) {
        console.error('Failed to initialize story:', error);
      }
    };

    initializeGame();
  }, [route?.params?.startNew, route?.params?.storyLineId]);

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
        // Create a player message so the selected choice appears in the thread
        const playerMessage = {
          id: `choice_${choiceId}_${Date.now()}`,
          from: 'player',
          type: 'chat',
          text: choiceLabel,
        };

        // Prepend the player message to the next node's messages so it shows right before the AI/narrator replies
        const combinedMessages = [playerMessage, ...(nextNode.messages || [])];

        setCurrentNode(nextNode);
        setMessages(combinedMessages);
        setChoices(nextNode.choices);
        setDisplayedMessageIndex(0);
        
        // Track node visit
        if (nextNode.nodeId) {
          const nodeType = nextNode.isEnding ? 'ending' : 'story';
          Analytics.trackGameNodeVisit(nextNode.nodeId, nodeType);
          nodeVisitCountRef.current += 1;
        }

        // Process interactive elements for the new node (after a short delay)
        // Process after messages start appearing
        setTimeout(() => {
          processNodeInteractiveElements(nextNode, 500);
        }, 800);

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
    const storyLineId = route?.params?.storyLineId || 'therapy_ai_session_1';
    await storyEngine.clearGameState(storyLineId);
    const initialNode = storyEngine.start(storyLineId);
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

  const handleBackToHome = () => {
    // Light haptic feedback for navigation
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Start');
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
      {/* Enhanced gradient background with depth */}
      <LinearGradient
        colors={[COLORS.backgroundGradient.start, COLORS.backgroundGradient.end, COLORS.backgroundGradient.start]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Subtle radial gradient overlay for depth - avoids flat black-on-black */}
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.3)', 'transparent', 'rgba(0, 0, 0, 0.2)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.depthOverlay}
        pointerEvents="none"
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header - shared therapist-style header */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <TherapistHeader
            onBack={handleBackToHome}
            onRestart={handleRestart}
            showRestart={isEnding}
          />
        </Animated.View>

        {/* Status bar - processing/typing indicator */}
        <StatusBar isTyping={isTyping} statusText={displayedMessageIndex < messages.length ? 'Processing…' : 'Waiting for your response'} />

        {/* Chat area with scrollable messages */}
        <Animated.View style={[styles.contentWrapper, { opacity: fadeAnim }]}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {displayedMessages.map((message, index) => {
              const isLatest = index === displayedMessages.length - 1;
              return (
                <ChatMessage 
                  key={message.id || index} 
                  message={message} 
                  isLatest={isLatest}
                />
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Choices container - pinned to bottom */}
        {showChoices && (
          <ChoiceList choices={choices} onChoice={handleChoice} isLoading={isLoading} />
        )}

        {/* Ending container */}
        {isEnding && (
          <View style={styles.endingContainer}>
            <Text style={styles.endingText}>THE STORY HAS ENDED</Text>
            <TouchableOpacity onPress={handleRestart} style={styles.restartButtonLarge}>
              <Text style={styles.restartTextLarge}>PLAY AGAIN</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Near-black base (#050608)
  },
  depthOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.6, // Subtle depth without being heavy
  },
  keyboardView: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    // Chat area container - card-like with padding (refined from spec)
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingTop: SPACING.lg, // More top padding for breathing room
    paddingBottom: SPACING.xxl + SPACING.md, // More space above response panel for clarity
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
    borderWidth: 1,
    borderColor: COLORS.choice.border,
    borderRadius: BORDER_RADIUS.md,
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
    // Positioned within header, larger tap target handled in component
  },
  backButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  backText: {
    ...FONTS.caption,
    color: COLORS.text.muted,
    letterSpacing: 1,
  },
});

export default GameScreen;

