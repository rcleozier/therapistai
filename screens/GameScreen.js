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
import TypingIndicator from '../components/TypingIndicator';
import storyEngine from '../utils/storyEngine';
import { Analytics } from '../utils/analytics';
import { stopBackgroundMusic, playGameMusic, stopGameMusic } from '../utils/audioManager';
import SettingsButton from '../components/SettingsButton';
import { processNodeInteractiveElements } from '../utils/interactiveElements';
import userProfile from '../utils/userProfile';

const GameScreen = ({ route, navigation }) => {
  const [currentNode, setCurrentNode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [choices, setChoices] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]); // Persistent conversation log
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false); // Track when AI is typing (showing typing indicator)
  const [displayedMessageIndex, setDisplayedMessageIndex] = useState(0);
  const [isContinuing, setIsContinuing] = useState(false); // Track if we're continuing a session
  const [pendingPlayerMessage, setPendingPlayerMessage] = useState(null); // Track player message waiting to be displayed
  const [userProfileData, setUserProfileData] = useState(null); // Store user profile for placeholder replacement
  const scrollViewRef = useRef(null);
  const choiceCountRef = useRef(0);
  const nodeVisitCountRef = useRef(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const typingOpacity = useRef(new Animated.Value(0)).current;
  const historyStartIndexRef = useRef(0); // Track where new messages start in history
  const hasScrolledToBottomRef = useRef(false); // Track if we've scrolled to bottom when continuing

  // Load user profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      const profile = await userProfile.getProfile();
      setUserProfileData(profile);
    };
    loadProfile();
  }, []);

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
        let savedConversationHistory = null;

        if (startNew) {
          // Clear any saved state and start fresh
          await storyEngine.clearGameState(storyLineId);
          initialNode = storyEngine.start(storyLineId);
        } else {
          // Continue from saved state - load saved state first to get conversation history
          const savedState = await storyEngine.loadGameState(storyLineId);
          if (savedState && savedState.conversationHistory) {
            savedConversationHistory = savedState.conversationHistory;
          }
          initialNode = await storyEngine.continue(storyLineId);
        }

        if (initialNode) {
          setCurrentNode(initialNode);
          setMessages(initialNode.messages);
          setChoices(initialNode.choices);
          
          // Initialize conversation history
          if (startNew) {
            // New game: start with initial messages
            setIsContinuing(false);
            setConversationHistory(initialNode.messages || []);
            historyStartIndexRef.current = 0;
            setDisplayedMessageIndex(0);
            hasScrolledToBottomRef.current = false;
          } else {
            // Continue: restore conversation history from saved state
            setIsContinuing(true);
            hasScrolledToBottomRef.current = false;
            
            if (savedConversationHistory && savedConversationHistory.length > 0) {
              // Restore full conversation history
              setConversationHistory(savedConversationHistory);
              
              // Calculate how many messages have already been displayed
              const currentMessagesCount = (initialNode.messages || []).length;
              
              // Check if the last messages in history match current node messages
              const lastMessagesInHistory = savedConversationHistory.slice(-currentMessagesCount);
              const messagesMatch = currentMessagesCount > 0 && 
                lastMessagesInHistory.length === currentMessagesCount &&
                lastMessagesInHistory.every((msg, idx) => 
                  msg.id === initialNode.messages[idx]?.id
                );
              
              if (messagesMatch) {
                // Current node messages are already in history - show all history immediately
                setDisplayedMessageIndex(currentMessagesCount); // All current messages are "displayed"
              } else {
                // Current node has new messages not in history yet - show with typing effect
                setDisplayedMessageIndex(0);
              }
            } else {
              // No saved history, start with current messages
              setIsContinuing(false);
              setConversationHistory(initialNode.messages || []);
              historyStartIndexRef.current = 0;
              setDisplayedMessageIndex(0);
            }
          }
          
          // Fade in animation - smoother for continuing sessions
          const fadeDuration = startNew ? 800 : 400; // Faster fade when continuing
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: fadeDuration,
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

          // Save initial state with conversation history
          // Use the history we just set (or will set)
          const historyToSave = startNew 
            ? (initialNode.messages || []) 
            : (savedConversationHistory || initialNode.messages || []);
          await storyEngine.saveGameState(historyToSave);
        }
      } catch (error) {
        console.error('Failed to initialize story:', error);
      }
    };

    initializeGame();
  }, [route?.params?.startNew, route?.params?.storyLineId]);

  // Display messages one at a time with typing effect
  // Only applies to new messages, not the conversation history
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    if (!conversationHistory) return;

    // Calculate how many new messages we're displaying
    const newMessagesCount = messages.length;
    const historyLength = (conversationHistory.length || 0) - newMessagesCount;
    
    // displayedMessageIndex tracks how many of the NEW messages have been shown
    // All previous history is already visible
    if (displayedMessageIndex < newMessagesCount) {
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
        
        // Subtle haptic feedback when new message appears (only for new messages, not when continuing)
        if (!isContinuing) {
          const currentMessage = messages[displayedMessageIndex];
          if (currentMessage) {
            // Different haptics based on message type
            if (currentMessage.from === 'ai') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } else if (currentMessage.from === 'narrator') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
          }
        }
      }, 800); // Reduced delay for smoother flow

      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
      typingOpacity.setValue(0);
    }
  }, [messages, displayedMessageIndex, conversationHistory.length, isContinuing]);

  // Calculate displayed messages: show all history + new messages up to displayedMessageIndex
  // If conversationHistory ends with the same messages as current messages, they're already in history
  // Otherwise, historyLength is the number of messages before the current batch
  const safeHistory = conversationHistory || [];
  const safeMessages = messages || [];
  const historyLength = Math.max(0, safeHistory.length - (safeMessages.length || 0));
  const isInitialLoad = historyLength === 0 && safeHistory.length > 0 && safeMessages.length > 0;
  
  // Check if current messages are already at the end of history (when continuing a session)
  const lastMessagesInHistory = safeHistory.slice(-safeMessages.length);
  const messagesAlreadyInHistory = safeMessages.length > 0 && 
    lastMessagesInHistory.length === safeMessages.length &&
    lastMessagesInHistory.every((msg, idx) => msg.id === safeMessages[idx]?.id);
  
  // Calculate displayed messages, ensuring no duplicates
  // Always show all of conversationHistory (which includes player messages)
  let displayedMessages;
  if (isInitialLoad) {
    displayedMessages = safeMessages.slice(0, displayedMessageIndex); // Initial load: show messages with typing effect
  } else {
    // Always include all conversation history (which has player messages)
    const allHistory = safeHistory;
    
    // Then add any new messages that aren't already in history
    const newMessages = safeMessages.slice(0, displayedMessageIndex);
    const historyIds = new Set(allHistory.map(msg => msg.id));
    const uniqueNewMessages = newMessages.filter(msg => !historyIds.has(msg.id));
    
    displayedMessages = [...allHistory, ...uniqueNewMessages];
  }
  
  // If there's a pending player message, ensure it's included (fallback)
  if (pendingPlayerMessage && !displayedMessages.find(msg => msg.id === pendingPlayerMessage.id)) {
    displayedMessages = [...displayedMessages, pendingPlayerMessage];
  }

  // Smooth scroll to bottom when continuing (once)
  useEffect(() => {
    if (isContinuing && !hasScrolledToBottomRef.current && displayedMessages && displayedMessages.length > 0) {
      // Wait for messages to render, then smoothly scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false }); // Instant scroll for continuing
        hasScrolledToBottomRef.current = true;
        setIsContinuing(false); // Clear the flag after initial scroll
      }, 300);
    }
  }, [isContinuing, displayedMessages.length]);

  // Ensure player message is visible before showing typing indicator
  useEffect(() => {
    if (pendingPlayerMessage && conversationHistory.length > 0) {
      // Check if player message is in conversation history
      const playerMessageInHistory = conversationHistory.find(msg => msg.id === pendingPlayerMessage.id);
      if (playerMessageInHistory) {
        // Player message is in history, scroll to show it
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }
  }, [pendingPlayerMessage, conversationHistory]);

  // Auto-scroll when typing indicator appears
  useEffect(() => {
    if (isAITyping) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  }, [isAITyping]);

  // Auto-scroll when new messages appear (only for new messages, not when continuing)
  useEffect(() => {
    if (!isContinuing && displayedMessageIndex > 0 && displayedMessages && displayedMessages.length > 0) {
      // Small delay to ensure message is rendered, then smooth scroll
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [displayedMessageIndex, displayedMessages.length, isContinuing]);

  // Save conversation history to storage whenever it changes
  useEffect(() => {
    if (conversationHistory && conversationHistory.length > 0 && currentNode) {
      // Save conversation history to storage (async, don't block)
      storyEngine.saveGameState(conversationHistory).catch(err => {
        console.error('Error saving conversation history:', err);
      });
    }
  }, [conversationHistory, currentNode]);

  const handleChoice = async (choiceId) => {
    setIsLoading(true);
    
    try {
      // Find the choice label for tracking
      const choice = choices.find(c => c.id === choiceId);
      const choiceLabel = choice?.label || 'Unknown';
      
      // Track the choice
      Analytics.trackGameChoice(choiceId, choiceLabel, currentNode?.nodeId);
      choiceCountRef.current += 1;
      
      // Create a player message so the selected choice appears in the thread
      const playerMessage = {
        id: `choice_${choiceId}_${Date.now()}`,
        from: 'player',
        type: 'chat',
        text: choiceLabel,
      };

      // Add player message to conversation history immediately so it appears first
      setConversationHistory(prev => [...prev, playerMessage]);
      setPendingPlayerMessage(playerMessage);
      
      // Wait for React to process the state update and render the player message
      await new Promise(resolve => {
        // Use double requestAnimationFrame to ensure render happens
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(() => {
              resolve();
            }, 200); // Additional delay to ensure message is visible
          });
        });
      });
      
      // Scroll to show player message
      scrollViewRef.current?.scrollToEnd({ animated: true });
      
      // Wait a bit more to ensure player message is fully visible
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Now show AI typing indicator (after player message is definitely visible)
      setIsAITyping(true);
      setPendingPlayerMessage(null); // Clear pending message
      
      // Wait a moment for typing indicator to appear
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Scroll to show typing indicator
      scrollViewRef.current?.scrollToEnd({ animated: true });
      
      // Wait for typing indicator to be visible, then delay before showing response
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second typing delay for more natural feel
      
      const nextNode = storyEngine.makeChoice(choiceId);
      
      if (nextNode) {
        // Hide typing indicator
        setIsAITyping(false);
        
        // Add the new AI/narrator messages to conversation history
        const newMessages = nextNode.messages || [];
        setConversationHistory(prev => {
          // Ensure player message is still in history
          const updated = [...prev];
          // Add new messages if they're not already there
          newMessages.forEach(msg => {
            if (!updated.find(m => m.id === msg.id)) {
              updated.push(msg);
            }
          });
          return updated;
        });

        setCurrentNode(nextNode);
        setMessages(newMessages);
        setChoices(nextNode.choices);
        setDisplayedMessageIndex(0); // Reset to show new messages with typing effect
        
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
    
    // Reset conversation history with initial messages
    setConversationHistory(initialNode.messages || []);
    historyStartIndexRef.current = 0;
    setDisplayedMessageIndex(0);
    
    // Track new game start
    Analytics.trackGameStart();
    if (initialNode.nodeId) {
      Analytics.trackGameNodeVisit(initialNode.nodeId, 'intro');
      nodeVisitCountRef.current = 1;
    }

    // Save initial state with conversation history
    const historyToSave = initialNode.messages || [];
    await storyEngine.saveGameState(historyToSave);
  };

  const handleBackToHome = () => {
    // Light haptic feedback for navigation
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Start');
  };
  
  const showChoices = displayedMessageIndex >= safeMessages.length && choices && choices.length > 0 && !isLoading;
  const isEnding = currentNode?.isEnding && displayedMessageIndex >= safeMessages.length;

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
        <StatusBar isTyping={isTyping} statusText={displayedMessageIndex < safeMessages.length ? 'Processing…' : 'Waiting for your response'} />

        {/* Chat area with scrollable messages - full conversation history */}
        <Animated.View style={[styles.contentWrapper, { opacity: fadeAnim }]}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          >
            {displayedMessages.map((message, index) => {
              const isLatest = index === displayedMessages.length - 1 && displayedMessageIndex >= (safeMessages.length || 0);
              // Determine if this is a new message (should animate) or old message (skip animation)
              const historyLength = safeHistory.length - (safeMessages.length || 0);
              const isNewMessage = index >= historyLength; // Messages after history are new
              const shouldAnimate = !isContinuing || isNewMessage; // Only animate new messages when continuing
              // Create unique key combining id and index to avoid duplicates
              const uniqueKey = `${message.id || 'msg'}_${index}_${message.from || 'unknown'}`;
              
              // Replace placeholders in message text with user profile data
              const processedMessage = userProfileData && message.text
                ? {
                    ...message,
                    text: userProfile.replacePlaceholders(message.text, userProfileData),
                  }
                : message;
              
              return (
                <ChatMessage 
                  key={uniqueKey} 
                  message={processedMessage} 
                  isLatest={isLatest}
                  shouldAnimate={shouldAnimate}
                  userProfile={userProfileData}
                />
              );
            })}
            {/* Show typing indicator when AI is typing (not when continuing) */}
            {isAITyping && !isContinuing && <TypingIndicator />}
          </ScrollView>
        </Animated.View>

        {/* Choices container - pinned to bottom */}
        {showChoices && (
          <ChoiceList 
            choices={userProfileData 
              ? choices.map(choice => ({
                  ...choice,
                  label: userProfile.replacePlaceholders(choice.label, userProfileData),
                }))
              : choices
            } 
            onChoice={handleChoice} 
            isLoading={isLoading} 
          />
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
    paddingTop: SPACING.xl + 4, // More vertical spacing between header and first message
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

