import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Animated,
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
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backButtonText}>← Back</Text>
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
          <View style={styles.section}>
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
                  false: COLORS.dividerStrong,
                  true: COLORS.accent.red,
                }}
                thumbColor={COLORS.text.primary}
                ios_backgroundColor={COLORS.dividerStrong}
              />
            </View>
          </View>

          {/* App Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Information</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>App Name</Text>
              <Text style={styles.infoValue}>TherapistAI</Text>
            </View>

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
    paddingVertical: SPACING.md,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.divider,
  },
  backButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  backButtonText: {
    ...FONTS.body,
    color: COLORS.accent.red,
    fontSize: 16,
  },
  headerTitle: {
    ...FONTS.heading,
    color: COLORS.text.primary,
    fontSize: 20,
  },
  headerSpacer: {
    width: 60, // Match back button width for centering
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...FONTS.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
    fontSize: 12,
    letterSpacing: 1.5,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.divider,
  },
  settingInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  settingLabel: {
    ...FONTS.bodyBold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  settingDescription: {
    ...FONTS.caption,
    color: COLORS.text.muted,
    fontSize: 12,
    lineHeight: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: SPACING.md,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.divider,
  },
  infoLabel: {
    ...FONTS.body,
    color: COLORS.text.secondary,
    flex: 1,
    marginRight: SPACING.md,
  },
  infoValue: {
    ...FONTS.body,
    color: COLORS.text.primary,
    flex: 1,
    textAlign: 'right',
  },
  footer: {
    marginTop: SPACING.xl,
    paddingTop: SPACING.lg,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.divider,
    alignItems: 'center',
  },
  footerText: {
    ...FONTS.small,
    color: COLORS.text.muted,
    opacity: 0.6,
  },
});

export default SettingsScreen;

