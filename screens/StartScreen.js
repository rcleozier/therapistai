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
  
  // Hero card colors
  heroBackground: '#08090b',
  heroBackgroundGradient: ['#08090b', '#0a0b0d'], // Faint vertical gradient
  heroBorderRadius: 16,
  heroShadowOpacity: 0.3,
  heroShadowRadius: 12,
  
  // Avatar constants
  avatarSize: 44, // Match chat avatar size
  avatarBorderRadius: 8, // 6-10px range
  avatarBorderWidth: 1.5,
  avatarBorderColor: 'rgba(244, 92, 78, 0.2)', // Low-opacity accent
  avatarGlowOpacity: 0.12,
  
  // Status pill
  statusPillBackground: 'rgba(244, 92, 78, 0.15)',
  statusPillText: '#F45C4E',
  statusPillBorderRadius: 12,
  
  // Opacities
  microcopyOpacity: 0.5,
  activityDotOpacity: 0.4, // More subtle
  settingsButtonOpacity: 0.4, // Reduced for hero alignment
  
  // Spacing
  cardSpacing: 12, // Tighter spacing for cleaner look
  heroPaddingVertical: SPACING.lg + 4, // Increased vertical padding
  heroPaddingHorizontal: SPACING.lg + 2,
  heroMarginBottom: SPACING.xl + 8, // Consistent spacing to session label
  cardPadding: 20, // More generous padding
  
  // Typography
  heroTitleSize: 24, // Dominant, semi-bold
  heroTitleWeight: '600', // Semi-bold
  heroSubtitleSize: 13, // Smaller
  heroSubtitleWeight: '400', // Medium weight
  heroSubtitleColor: 'rgba(154, 158, 164, 0.65)', // Desaturated gray
  statusPillTextSize: 11,
  syncLabelSize: 10,
  titleLetterSpacing: 0.5,
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
        {/* Brand Header Hero Card */}
        <HeaderBrand logoPulse={logoPulse} activityDotOpacity={activityDotOpacity} />

        {/* Settings button aligned with hero */}
        <View style={styles.heroSettingsContainer}>
          <SettingsButton style={styles.settingsButton} />
        </View>

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

// Brand Header Component - Hero Card Design
const HeaderBrand = ({ logoPulse, activityDotOpacity }) => {
  return (
    <View style={styles.heroCard}>
      {/* Faint vertical gradient background */}
      <LinearGradient
        colors={SESSION_THEME.heroBackgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.heroGradient}
      />
      
      <View style={styles.heroContent}>
        {/* Square avatar with border and glow */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarGlow} />
          <Animated.View style={{ transform: [{ scale: logoPulse }] }}>
            <Image
              source={require('../assets/character.png')}
              style={styles.avatarImage}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Text block with status pill */}
        <View style={styles.heroTextBlock}>
          <View style={styles.heroTitleRow}>
            <Text style={styles.heroTitle}>Therapy AI</Text>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
          
          <View style={styles.heroSubtitleRow}>
            <Text style={styles.heroSubtitle}>Clinical conversational support</Text>
            {/* Profile syncing inline label */}
            <View style={styles.syncLabel}>
              <Animated.View 
                style={[
                  styles.syncDot,
                  { opacity: activityDotOpacity }
                ]} 
              />
              <Text style={styles.syncLabelText}>Profile syncing</Text>
            </View>
          </View>
        </View>
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
    paddingHorizontal: SPACING.lg + 2,
    paddingTop: SPACING.md + 4,
    paddingBottom: SPACING.lg,
  },
  // Hero Card Styles
  heroCard: {
    width: '100%',
    borderRadius: SESSION_THEME.heroBorderRadius,
    marginBottom: SESSION_THEME.heroMarginBottom,
    marginHorizontal: -(SPACING.lg + 2), // Negative margin to extend to edges (full-width within safe area)
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: SESSION_THEME.heroShadowOpacity,
    shadowRadius: SESSION_THEME.heroShadowRadius,
    elevation: 4,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Align items to bottom
    paddingTop: SESSION_THEME.heroPaddingVertical, // Only top padding
    paddingBottom: 0, // No bottom padding - avatar flush to bottom
    paddingHorizontal: SESSION_THEME.heroPaddingHorizontal,
    backgroundColor: SESSION_THEME.heroBackground,
  },
  avatarContainer: {
    width: SESSION_THEME.avatarSize,
    height: SESSION_THEME.avatarSize,
    borderRadius: SESSION_THEME.avatarBorderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md + 4,
    marginBottom: 0, // No bottom margin - fixed to bottom
    position: 'relative',
    borderWidth: SESSION_THEME.avatarBorderWidth,
    borderColor: SESSION_THEME.avatarBorderColor,
    backgroundColor: 'rgba(15, 17, 21, 0.6)',
    overflow: 'hidden',
  },
  avatarGlow: {
    position: 'absolute',
    width: SESSION_THEME.avatarSize + 8,
    height: SESSION_THEME.avatarSize + 8,
    borderRadius: SESSION_THEME.avatarBorderRadius + 2,
    backgroundColor: SESSION_THEME.accent,
    opacity: SESSION_THEME.avatarGlowOpacity,
    zIndex: 0,
  },
  avatarImage: {
    width: SESSION_THEME.avatarSize,
    height: SESSION_THEME.avatarSize,
    zIndex: 2,
    borderRadius: SESSION_THEME.avatarBorderRadius,
  },
  heroTextBlock: {
    flex: 1,
    justifyContent: 'flex-end', // Align text to bottom to match avatar
    paddingBottom: 0, // No bottom padding
    marginBottom: 0, // No bottom margin
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs + 2,
    flexWrap: 'wrap',
  },
  heroTitle: {
    ...FONTS.titleScreen.title,
    fontSize: SESSION_THEME.heroTitleSize,
    fontWeight: SESSION_THEME.heroTitleWeight,
    color: SESSION_THEME.primaryText,
    letterSpacing: SESSION_THEME.titleLetterSpacing,
    marginRight: SPACING.sm,
    lineHeight: 30,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SESSION_THEME.statusPillBackground,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: SESSION_THEME.statusPillBorderRadius,
    borderWidth: 1,
    borderColor: SESSION_THEME.accentBorder,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SESSION_THEME.statusPillText,
    marginRight: SPACING.xs,
  },
  statusText: {
    ...FONTS.caption,
    fontSize: SESSION_THEME.statusPillTextSize,
    color: SESSION_THEME.statusPillText,
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  heroSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  heroSubtitle: {
    ...FONTS.titleScreen.tagline,
    fontSize: SESSION_THEME.heroSubtitleSize,
    fontWeight: SESSION_THEME.heroSubtitleWeight,
    color: SESSION_THEME.heroSubtitleColor,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  syncLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  syncDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: SESSION_THEME.mutedText,
    marginRight: SPACING.xs,
  },
  syncLabelText: {
    ...FONTS.small,
    fontSize: SESSION_THEME.syncLabelSize,
    color: SESSION_THEME.mutedText,
    letterSpacing: 0.4,
    opacity: 0.6,
  },
  // Settings button aligned with hero
  heroSettingsContainer: {
    position: 'absolute',
    top: SESSION_THEME.heroPaddingVertical + SPACING.md + 4, // Account for content paddingTop
    right: SESSION_THEME.heroPaddingHorizontal, // Align with hero card's right padding
    zIndex: 10,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    opacity: SESSION_THEME.settingsButtonOpacity,
  },
  sessionSection: {
    flex: 1,
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    ...FONTS.caption,
    fontSize: 11,
    color: SESSION_THEME.secondaryText,
    marginBottom: SPACING.md + 4,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    lineHeight: 16,
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
    lineHeight: 22,
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
    marginTop: 2, // Small spacing from title
  },
  microcopy: {
    ...FONTS.small,
    fontSize: 11,
    color: SESSION_THEME.secondaryText,
    opacity: SESSION_THEME.microcopyOpacity,
    textAlign: 'center',
    marginBottom: SPACING.md,
    letterSpacing: 0.3,
    lineHeight: 16,
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
