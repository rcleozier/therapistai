import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/colors';
import storyEngine from '../utils/storyEngine';

const StartScreen = ({ navigation }) => {
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Check for saved game when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      checkForSavedGame();
    }, [])
  );

  const checkForSavedGame = async () => {
    try {
      const hasSaved = await storyEngine.hasSavedGameState();
      setHasSavedGame(hasSaved);
    } catch (error) {
      console.error('Error checking for saved game:', error);
      setHasSavedGame(false);
    }
  };

  const handleStartNew = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Game', { startNew: true });
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Game', { startNew: false });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <Text style={styles.title}>THERAPISTAI</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleStartNew}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              START NEW GAME
            </Text>
          </TouchableOpacity>

          {hasSavedGame && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                CONTINUE
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.xxl * 2,
  },
  title: {
    ...FONTS.heading,
    color: COLORS.text.primary,
    letterSpacing: 2,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.choice.background,
    borderWidth: 0.5,
    borderColor: COLORS.choice.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.choice.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    borderColor: COLORS.accent.red,
    borderWidth: 1,
  },
  secondaryButton: {
    borderColor: COLORS.choice.border,
  },
  buttonText: {
    ...FONTS.bodyBold,
    letterSpacing: 1,
    textAlign: 'center',
  },
  primaryButtonText: {
    color: COLORS.accent.red,
  },
  secondaryButtonText: {
    color: COLORS.text.primary,
  },
});

export default StartScreen;

