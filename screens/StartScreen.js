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

// Session Library theme - Black Mirror-style session hub
const SESSION_THEME = {
  // Colors
  background: '#050608',
  surface: '#111317', // Card background
  surfaceSelected: '#151920', // Selected card background
  accent: '#F45C4E',
  accentBorder: 'rgba(244, 92, 78, 0.4)',
  accentBorderSelected: 'rgba(244, 92, 78, 0.7)',
  primaryText: '#F5F3EE',
  secondaryText: 'rgba(154, 158, 164, 0.6)',
  mutedText: 'rgba(154, 158, 164, 0.4)',
  footerText: 'rgba(245, 243, 238, 0.4)',
  
  // Opacities
  microcopyOpacity: 0.45,
  activityDotOpacity: 0.6,
  
  // Spacing
  cardSpacing: 16,
  headerPadding: SPACING.lg,
  
  // Typography
  titleSize: 26,
  titleLetterSpacing: 1.2,
  subtitleSize: 12,
  microcopySize: 11,
};

// Session metadata with enhanced descriptions
const SESSION_METADATA = {
  'therapy_ai_session_1': {
    tag: null,
    description: 'Anxious first-time user, standard onboarding.',
    duration: '~45 min',
  },
  'therapy_ai_session_2': {
    tag: 'RECOMMENDED',
    description: 'Returning patient with escalating dependency.',
    duration: '~50 min',
  },
  'therapy_ai_session_3': {
    tag: 'EXPERIMENTAL',
    description: 'Experimental profile with reduced safeguards.',
    duration: '~55 min',
  },
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
        <HeaderBrand logoPulse={logoPulse} activityDotOpacity={activityDotOpacity} lastAnalyzed={lastAnalyzed} />

        {/* Session Library Section */}
        <View style={styles.sessionSection}>
          <Text style={styles.sectionLabel}>Choose a profile to evaluate</Text>
          
          <ScrollView 
            style={styles.sessionList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sessionListContent}
          >
            {storyLines.map((storyLine) => {
              const metadata = SESSION_METADATA[storyLine.id] || {};
              const hasSaved = sessionProgress[storyLine.id] || false;
              const isSelected = selectedStoryLine === storyLine.id;
              
              return (
                <SessionCard
                  key={storyLine.id}
                  storyLine={storyLine}
                  metadata={metadata}
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
const HeaderBrand = ({ logoPulse, activityDotOpacity, lastAnalyzed }) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <View style={styles.headerWrapper}>
      {/* Radial gradient halo */}
      <View style={styles.headerHalo}>
        <LinearGradient
          colors={['rgba(74, 158, 158, 0.15)', 'transparent']}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.headerHaloGradient}
        />
      </View>

      <View style={styles.headerContent}>
        {/* Robot icon with glow */}
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
          <View style={styles.microcopyRow}>
            <Text style={styles.headerMicrocopy}>Cognitive profile syncing…</Text>
            <Animated.View 
              style={[
                styles.activityDot,
                { opacity: activityDotOpacity }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Last analyzed timestamp */}
      <Text style={styles.lastAnalyzed}>
        Last analyzed: {formatTime(lastAnalyzed)}
      </Text>
    </View>
  );
};

// Session Card Component
const SessionCard = ({ storyLine, metadata, hasProgress, isSelected, onSelect }) => {
  const cardScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(cardScale, {
      toValue: 0.97,
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
        activeOpacity={0.9}
      >
        {/* Tag badge */}
        {metadata.tag && (
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>{metadata.tag}</Text>
          </View>
        )}

        {/* Card content */}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{storyLine.title}</Text>
          <Text style={styles.cardDescription}>{metadata.description || storyLine.description}</Text>
          
          {/* Metadata row */}
          <View style={styles.cardMetadata}>
            <Text style={styles.metadataText}>
              {hasProgress ? 'Progress: Active' : 'Not started'}
            </Text>
            <Text style={styles.metadataText}>•</Text>
            <Text style={styles.metadataText}>{metadata.duration || '~45 min'}</Text>
          </View>
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
              activeOpacity={0.9}
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
              activeOpacity={0.9}
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
            activeOpacity={0.9}
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
    marginBottom: SPACING.xl,
    position: 'relative',
  },
  headerHalo: {
    position: 'absolute',
    top: -SPACING.lg,
    left: -SPACING.xl,
    right: -SPACING.xl,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  headerHaloGradient: {
    width: 280,
    height: 120,
    borderRadius: 140,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accent.cyan,
    opacity: 0.2,
  },
  robotIcon: {
    width: 40,
    height: 40,
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
    marginBottom: 2,
  },
  headerSubtitle: {
    ...FONTS.titleScreen.tagline,
    fontSize: SESSION_THEME.subtitleSize,
    color: SESSION_THEME.secondaryText,
    marginBottom: 4,
  },
  microcopyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerMicrocopy: {
    ...FONTS.small,
    fontSize: SESSION_THEME.microcopySize,
    color: SESSION_THEME.secondaryText,
    opacity: SESSION_THEME.microcopyOpacity,
  },
  activityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: SESSION_THEME.accent,
    marginLeft: SPACING.xs,
  },
  lastAnalyzed: {
    ...FONTS.small,
    fontSize: 10,
    color: SESSION_THEME.mutedText,
    marginTop: SPACING.xs,
    letterSpacing: 0.5,
  },
  sessionSection: {
    flex: 1,
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    ...FONTS.caption,
    fontSize: 11,
    color: SESSION_THEME.secondaryText,
    marginBottom: SPACING.md,
    letterSpacing: 1,
  },
  sessionList: {
    flex: 1,
  },
  sessionListContent: {
    paddingBottom: SPACING.md,
  },
  sessionCard: {
    backgroundColor: SESSION_THEME.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SESSION_THEME.cardSpacing,
    borderWidth: 1,
    borderColor: SESSION_THEME.accentBorder,
    position: 'relative',
  },
  sessionCardSelected: {
    backgroundColor: SESSION_THEME.surfaceSelected,
    borderColor: SESSION_THEME.accentBorderSelected,
    borderWidth: 1.5,
  },
  tagContainer: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: SESSION_THEME.accent,
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  tagText: {
    ...FONTS.caption,
    fontSize: 9,
    color: '#FEF7F4',
    letterSpacing: 0.8,
  },
  cardContent: {
    paddingRight: SPACING.lg, // Space for tag
  },
  cardTitle: {
    ...FONTS.bodyBold,
    fontSize: 16,
    color: SESSION_THEME.primaryText,
    marginBottom: SPACING.xs,
  },
  cardDescription: {
    ...FONTS.body,
    fontSize: 13,
    color: SESSION_THEME.secondaryText,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  cardMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataText: {
    ...FONTS.small,
    fontSize: 11,
    color: SESSION_THEME.mutedText,
    marginRight: SPACING.xs,
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
    paddingVertical: SPACING.md,
    shadowColor: SESSION_THEME.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonLabel: {
    ...FONTS.bodyBold,
    color: '#FEF7F4',
    fontSize: 16,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
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
