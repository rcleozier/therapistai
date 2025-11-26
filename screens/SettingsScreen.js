import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/colors';
import { getAudioEnabled, setAudioEnabled } from '../utils/audioManager';
import Constants from 'expo-constants';

const SettingsScreen = ({ navigation }) => {
  const [audioEnabled, setAudioEnabledState] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadSettings();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadSettings = async () => {
    try {
      const enabled = await getAudioEnabled();
      setAudioEnabledState(enabled);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioToggle = async (value) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAudioEnabledState(value);
    await setAudioEnabled(value);
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Audio Settings Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Audio</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Background Music</Text>
                <Text style={styles.settingDescription}>
                  Enable or disable ambient background music
                </Text>
              </View>
              <Switch
                value={audioEnabled}
                onValueChange={handleAudioToggle}
                trackColor={{
                  false: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.3)' : COLORS.dividerStrong,
                  true: COLORS.accent.red,
                }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : COLORS.text.primary}
                ios_backgroundColor="rgba(255, 255, 255, 0.3)"
                style={styles.switch}
              />
            </View>
          </View>

          {/* App Info Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>App Information</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>App Name</Text>
              <Text style={styles.infoValue}>TherapistAI</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>
                {Constants.expoConfig?.version || '1.0.0'}
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} TherapistAI
            </Text>
          </View>
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
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md + 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: BORDER_RADIUS.sm,
  },
  backButtonText: {
    ...FONTS.heading,
    color: COLORS.accent.red,
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 28,
  },
  headerTitle: {
    ...FONTS.heading,
    color: COLORS.text.primary,
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl + SPACING.lg,
  },
  sectionCard: {
    backgroundColor: COLORS.backgroundTertiary,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg + 4,
    paddingBottom: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    ...FONTS.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md + 4,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    minHeight: 64,
  },
  settingInfo: {
    flex: 1,
    marginRight: SPACING.lg,
    justifyContent: 'center',
  },
  settingLabel: {
    ...FONTS.bodyBold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs + 2,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  settingDescription: {
    ...FONTS.small,
    color: COLORS.text.muted,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.7,
  },
  switch: {
    transform: Platform.OS === 'ios' ? [{ scaleX: 0.9 }, { scaleY: 0.9 }] : [],
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md + 2,
    minHeight: 52,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: SPACING.xs,
  },
  infoLabel: {
    ...FONTS.body,
    color: COLORS.text.secondary,
    fontSize: 15,
    opacity: 0.8,
  },
  infoValue: {
    ...FONTS.body,
    color: COLORS.text.primary,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'right',
  },
  footer: {
    marginTop: SPACING.xl + SPACING.md,
    paddingTop: SPACING.lg,
    alignItems: 'center',
  },
  footerText: {
    ...FONTS.small,
    color: COLORS.text.muted,
    fontSize: 11,
    opacity: 0.5,
    letterSpacing: 0.3,
  },
});

export default SettingsScreen;

