import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/colors';
import storyEngine from '../utils/storyEngine';
import storyLineManager from '../utils/storyLineManager';
import { initializeAudio, playBackgroundMusic, stopBackgroundMusic, getAudioEnabled } from '../utils/audioManager';
import SettingsButton from '../components/SettingsButton';

// Session Library theme - Premium therapeutic design
const SESSION_THEME = {
  // Colors
  background: '#050608',
  surface: '#0F1115', // Card background - refined for better contrast
  surfaceSelected: '#151920', // Selected card background
  surfaceGradient: ['#0F1115', '#111317'], // Subtle gradient for depth
  accent: '#F45C4E',
  accentBorder: 'rgba(244, 92, 78, 0.25)', // Softer border
  accentBorderSelected: 'rgba(244, 92, 78, 0.5)', // More visible when selected
  primaryText: '#F5F3EE',
  secondaryText: 'rgba(154, 158, 164, 0.7)', // Improved contrast
  mutedText: 'rgba(154, 158, 164, 0.5)',
  footerText: 'rgba(245, 243, 238, 0.4)',
  
  // Opacities
  microcopyOpacity: 0.5,
  activityDotOpacity: 0.4, // More subtle
  
  // Spacing
  cardSpacing: 12, // Tighter spacing for cleaner look
  headerPadding: SPACING.lg,
  cardPadding: 20, // More generous padding
  
  // Typography
  titleSize: 28, // Slightly larger for hierarchy
  titleLetterSpacing: 0.8,
  subtitleSize: 13,
  microcopySize: 11,
};

const StartScreen = ({ navigation }) => {
  const [storyLines, setStoryLines] = useState([]);
  const [selectedStoryLine, setSelectedStoryLine] = useState(null);
  const [sessionProgress, setSessionProgress] = useState({});
  const [lastAnalyzed, setLastAnalyzed] = useState(new Date());

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;
  const activityDotOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Load available story lines
    const availableStoryLines = storyLineManager.getAvailableStoryLines();
    setStoryLines(availableStoryLines);
    if (availableStoryLines.length > 0) {
      setSelectedStoryLine(availableStoryLines[0].id);
    }

    const setupAudio = async () => {
      await initializeAudio();
      await playBackgroundMusic();
    };
    setupAudio();

    Animated.timing(screenOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Breathing pulse on robot icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulse, {
          toValue: 1.03,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(logoPulse, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Activity dot pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(activityDotOpacity, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(activityDotOpacity, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      stopBackgroundMusic();
    };
  }, [screenOpacity, logoPulse, activityDotOpacity]);

  // Check progress for all sessions
  useFocusEffect(
    React.useCallback(() => {
      let timer;
      
      const checkProgress = async () => {
        const progress = {};
        for (const storyLine of storyLines) {
          try {
            const hasSaved = await storyEngine.hasSavedGameState(storyLine.id);
            progress[storyLine.id] = hasSaved;
          } catch (error) {
            progress[storyLine.id] = false;
          }
        }
        setSessionProgress(progress);
      };

      const resumeMusic = async () => {
        const enabled = await getAudioEnabled();
        if (enabled) {
          await playBackgroundMusic();
        }
      };

      if (storyLines.length > 0) {
        checkProgress();
      }
      timer = setTimeout(resumeMusic, 120);
      
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }, [storyLines])
  );

  const handleStartSession = () => {
    if (!selectedStoryLine) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Game', { startNew: true, storyLineId: selectedStoryLine });
  };

  const handleContinueSession = () => {
    if (!selectedStoryLine || !sessionProgress[selectedStoryLine]) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Game', { startNew: false, storyLineId: selectedStoryLine });
  };

  const handleStartOver = () => {
    if (!selectedStoryLine) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Game', { startNew: true, storyLineId: selectedStoryLine });
  };

  const handleSessionSelect = (storyLineId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedStoryLine(storyLineId);
  };

  const hasProgress = selectedStoryLine && sessionProgress[selectedStoryLine];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Dark vignette overlay */}
      <View style={styles.vignetteOverlay} pointerEvents="none" />

      <Animated.View style={[styles.content, { opacity: screenOpacity }]}>
        {/* Top settings button */}
        <View style={styles.topBar}>
          <View style={styles.topBarSpacer} />
          <SettingsButton style={styles.settingsButton} />
        </View>

        {/* Brand Header */}
        <HeaderBrand logoPulse={logoPulse} activityDotOpacity={activityDotOpacity} />

        {/* Session Library Section */}
        <View style={styles.sessionSection}>
          <Text style={styles.sectionLabel}>Select Session</Text>
          
          <ScrollView 
            style={styles.sessionList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sessionListContent}
          >
            {storyLines.map((storyLine) => {
              const hasSaved = sessionProgress[storyLine.id] || false;
              const isSelected = selectedStoryLine === storyLine.id;
              
              return (
                <SessionCard
                  key={storyLine.id}
                  storyLine={storyLine}
                  hasProgress={hasSaved}
                  isSelected={isSelected}
                  onSelect={() => handleSessionSelect(storyLine.id)}
                />
              );
            })}
          </ScrollView>
        </View>

        {/* Microcopy above actions */}
        <Text style={styles.microcopy}>
          Your emotional model persists across sessions.
        </Text>

        {/* Primary Actions */}
        <PrimaryActionBar
          hasProgress={hasProgress}
          onContinue={handleContinueSession}
          onStart={handleStartSession}
          onStartOver={handleStartOver}
        />

        {/* Footer Legal */}
        <FooterLegal />
      </Animated.View>
    </SafeAreaView>
  );
};

// Brand Header Component
const HeaderBrand = ({ logoPulse, activityDotOpacity }) => {
  return (
    <View style={styles.headerWrapper}>
      {/* Subtle radial gradient halo */}
      <View style={styles.headerHalo}>
        <LinearGradient
          colors={['rgba(74, 158, 158, 0.08)', 'transparent']}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.headerHaloGradient}
        />
      </View>

      <View style={styles.headerContent}>
        {/* Robot icon with subtle glow */}
        <View style={styles.iconContainer}>
          <View style={styles.iconGlow} />
          <Animated.View style={{ transform: [{ scale: logoPulse }] }}>
            <Image
              source={require('../assets/character-removebg.png')}
              style={styles.robotIcon}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Text stack */}
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Therapy AI</Text>
          <Text style={styles.headerSubtitle}>Clinical conversational support</Text>
        </View>
      </View>

      {/* Subtle background indicator for cognitive syncing */}
      <View style={styles.syncIndicator}>
        <Animated.View 
          style={[
            styles.syncDot,
            { opacity: activityDotOpacity }
          ]} 
        />
        <Text style={styles.syncText}>Profile syncing</Text>
      </View>
    </View>
  );
};

// Session Card Component
const SessionCard = ({ storyLine, hasProgress, isSelected, onSelect }) => {
  const cardScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(cardScale, {
      toValue: 0.98,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    Animated.spring(cardScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: cardScale }] }}>
      <TouchableOpacity
        style={[
          styles.sessionCard,
          isSelected && styles.sessionCardSelected,
        ]}
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
      >
        {/* Subtle gradient overlay for depth */}
        <LinearGradient
          colors={SESSION_THEME.surfaceGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        />

        {/* Card content */}
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{storyLine.title}</Text>
            {hasProgress && (
              <View style={styles.progressIndicator}>
                <View style={styles.progressDot} />
                <Text style={styles.progressText}>Active</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardDescription}>{storyLine.description}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Primary Action Bar Component
const PrimaryActionBar = ({ hasProgress, onContinue, onStart, onStartOver }) => {
  const primaryScale = useRef(new Animated.Value(1)).current;
  const secondaryScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = (target) => {
    const scale = target === 'primary' ? primaryScale : secondaryScale;
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 280,
      friction: 12,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = (target) => {
    const scale = target === 'primary' ? primaryScale : secondaryScale;
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 280,
      friction: 12,
    }).start();
  };

  return (
    <View style={styles.actionBar}>
      {hasProgress ? (
        <>
          <Animated.View style={{ transform: [{ scale: primaryScale }] }}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onContinue}
              onPressIn={() => handlePressIn('primary')}
              onPressOut={() => handlePressOut('primary')}
              activeOpacity={0.95}
            >
              <Text style={styles.primaryButtonLabel}>Continue Session</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <View style={styles.buttonSpacer} />
          
          <Animated.View style={{ transform: [{ scale: secondaryScale }] }}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onStartOver}
              onPressIn={() => handlePressIn('secondary')}
              onPressOut={() => handlePressOut('secondary')}
              activeOpacity={0.95}
            >
              <Text style={styles.secondaryButtonLabel}>Start Over</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      ) : (
        <Animated.View style={{ transform: [{ scale: primaryScale }] }}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onStart}
            onPressIn={() => handlePressIn('primary')}
            onPressOut={() => handlePressOut('primary')}
            activeOpacity={0.95}
          >
            <Text style={styles.primaryButtonLabel}>Start Session</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

// Footer Legal Component
const FooterLegal = () => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>
      Sessions may be stored and reviewed to improve your emotional model.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SESSION_THEME.background,
  },
  vignetteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    shadowColor: SESSION_THEME.background,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 120,
    elevation: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: SPACING.md,
  },
  topBarSpacer: {
    flex: 1,
  },
  settingsButton: {
    opacity: 0.5,
  },
  headerWrapper: {
    marginBottom: SPACING.xl + 4,
    position: 'relative',
  },
  headerHalo: {
    position: 'absolute',
    top: -SPACING.lg,
    left: -SPACING.xl,
    right: -SPACING.xl,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  headerHaloGradient: {
    width: 260,
    height: 100,
    borderRadius: 130,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md + 2,
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.accent.cyan,
    opacity: 0.15,
  },
  robotIcon: {
    width: 44,
    height: 44,
    zIndex: 2,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    ...FONTS.titleScreen.title,
    fontSize: SESSION_THEME.titleSize,
    letterSpacing: SESSION_THEME.titleLetterSpacing,
    color: SESSION_THEME.primaryText,
    marginBottom: 4,
    fontWeight: '600',
  },
  headerSubtitle: {
    ...FONTS.titleScreen.tagline,
    fontSize: SESSION_THEME.subtitleSize,
    color: SESSION_THEME.secondaryText,
    lineHeight: 18,
  },
  syncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm + 2,
    paddingLeft: 2,
  },
  syncDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: SESSION_THEME.accent,
    marginRight: SPACING.xs + 2,
  },
  syncText: {
    ...FONTS.small,
    fontSize: 10,
    color: SESSION_THEME.mutedText,
    letterSpacing: 0.4,
    opacity: 0.6,
  },
  sessionSection: {
    flex: 1,
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    ...FONTS.caption,
    fontSize: 11,
    color: SESSION_THEME.secondaryText,
    marginBottom: SPACING.md + 2,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sessionList: {
    flex: 1,
  },
  sessionListContent: {
    paddingBottom: SPACING.md,
  },
  sessionCard: {
    backgroundColor: SESSION_THEME.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SESSION_THEME.cardSpacing,
    borderWidth: 1,
    borderColor: SESSION_THEME.accentBorder,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  sessionCardSelected: {
    backgroundColor: SESSION_THEME.surfaceSelected,
    borderColor: SESSION_THEME.accentBorderSelected,
    borderWidth: 1.5,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  cardContent: {
    padding: SESSION_THEME.cardPadding,
    position: 'relative',
    zIndex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  cardTitle: {
    ...FONTS.bodyBold,
    fontSize: 17,
    color: SESSION_THEME.primaryText,
    flex: 1,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SESSION_THEME.accent,
    marginRight: SPACING.xs,
    opacity: 0.8,
  },
  progressText: {
    ...FONTS.small,
    fontSize: 11,
    color: SESSION_THEME.accent,
    opacity: 0.8,
    letterSpacing: 0.3,
  },
  cardDescription: {
    ...FONTS.body,
    fontSize: 14,
    color: SESSION_THEME.secondaryText,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  microcopy: {
    ...FONTS.small,
    fontSize: 11,
    color: SESSION_THEME.secondaryText,
    opacity: SESSION_THEME.microcopyOpacity,
    textAlign: 'center',
    marginBottom: SPACING.md,
    letterSpacing: 0.3,
  },
  actionBar: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  primaryButton: {
    backgroundColor: SESSION_THEME.accent,
    borderRadius: BORDER_RADIUS.lg,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md + 2,
    shadowColor: SESSION_THEME.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonLabel: {
    ...FONTS.bodyBold,
    color: '#FEF7F4',
    fontSize: 16,
    letterSpacing: 0.3,
    fontWeight: '500',
  },
  buttonSpacer: {
    height: SPACING.sm,
  },
  secondaryButton: {
    borderRadius: BORDER_RADIUS.lg,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md - 2,
    borderWidth: 1,
    borderColor: SESSION_THEME.accentBorder,
    backgroundColor: 'transparent',
  },
  secondaryButtonLabel: {
    ...FONTS.bodyBold,
    color: SESSION_THEME.primaryText,
    opacity: 0.8,
    fontSize: 15,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.sm,
  },
  footerText: {
    ...FONTS.titleScreen.disclaimer,
    color: SESSION_THEME.footerText,
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 14,
  },
});

export default StartScreen;
