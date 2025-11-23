import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/colors';

const SettingsScreen = () => {


  return (
    <SafeAreaView style={styles.container}>
      <ExpoLinearGradient
        colors={COLORS.gradient.background}
        style={styles.headerGradient}
      >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      </ExpoLinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* About Section */}
        <View style={styles.aboutCard}>
          <View style={styles.logoContainer}>
            <Ionicons name="people" size={wp('12%')} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>Amio</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            Never let a friendship fade away. Amio helps you stay connected with the people who matter by tracking your connections and sending gentle reminders to reach out.
          </Text>
        </View>


        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with 💝</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerGradient: {
    backgroundColor: COLORS.white,
    paddingBottom: hp('2%'),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2.5%'),
  },
  headerTitle: {
    fontSize: wp('6.5%'),
    fontWeight: '800',
    color: COLORS.text.primary,
    fontFamily: Platform.select({ ios: 'SF Pro Display', android: 'Roboto' }),
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: wp('4%'),
  },
  aboutCard: {
    backgroundColor: COLORS.card.background,
    borderRadius: wp('4%'),
    padding: wp('5%'),
    borderWidth: 1,
    borderColor: COLORS.card.border,
    shadowColor: COLORS.card.shadow,
    shadowOffset: { width: 0, height: hp('0.4%') },
    shadowOpacity: 0.08,
    shadowRadius: wp('3%'),
    elevation: 4,
    alignItems: 'center',
  },
  logoContainer: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  appName: {
    fontSize: wp('6%'),
    fontWeight: '800',
    color: COLORS.text.primary,
    marginBottom: hp('0.3%'),
    fontFamily: Platform.select({ ios: 'SF Pro Display', android: 'Roboto' }),
  },
  appVersion: {
    fontSize: wp('2.8%'),
    color: COLORS.text.muted,
    marginBottom: hp('1.5%'),
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
  },
  appDescription: {
    fontSize: wp('3.5%'),
    color: COLORS.text.secondary,
    lineHeight: hp('2.5%'),
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
  },
  footer: {
    alignItems: 'center',
    paddingVertical: hp('3%'),
    marginTop: hp('1%'),
  },
  footerText: {
    fontSize: wp('3.5%'),
    color: COLORS.text.muted,
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
  },
});

export default SettingsScreen;

