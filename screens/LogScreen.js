import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/colors';
import { getAllContactLogs } from '../utils/asyncStorageDB';

const { width } = Dimensions.get('window');

const LogScreen = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const allLogs = await getAllContactLogs();
      // Sort by most recent first and limit to last 50
      const sortedLogs = allLogs
        .sort((a, b) => new Date(b.contactDate) - new Date(a.contactDate))
        .slice(0, 50);
      setLogs(sortedLogs);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh logs whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadLogs();
    }, [])
  );

  const renderLogItem = ({ item }) => {
    const method = getContactMethodInfo(item.contactMethod);
    
    return (
      <View style={styles.logItem}>
        <View style={styles.logHeader}>
          <View style={[styles.methodIcon, { backgroundColor: method.color }]}>
            <Ionicons name={method.icon} size={20} color="#FFF" />
          </View>
          <View style={styles.logContent}>
            <Text style={styles.friendName}>{item.friendName}</Text>
            <Text style={styles.methodName}>{method.label}</Text>
          </View>
          <Text style={styles.logDate}>
            {moment(item.contactDate).format('MMM D, YYYY')}
          </Text>
        </View>
        
        {item.notes && (
          <Text style={styles.logNotes}>{item.notes}</Text>
        )}
        
        {item.duration && (
          <Text style={styles.logDuration}>Duration: {item.duration}</Text>
        )}
      </View>
    );
  };

  const getContactMethodInfo = (method) => {
    const methods = {
      call: { label: 'Phone Call', icon: 'call', color: '#4CAF50' },
      text: { label: 'Text Message', icon: 'chatbubble', color: '#2196F3' },
      email: { label: 'Email', icon: 'mail', color: '#FF9800' },
      'in-person': { label: 'In Person', icon: 'person', color: '#9C27B0' },
      video: { label: 'Video Call', icon: 'videocam', color: '#E91E63' },
    };
    return methods[method] || { label: method, icon: 'call', color: '#757575' };
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="time-outline" size={64} color={COLORS.text.muted} />
      <Text style={styles.emptyStateTitle}>No Activity Yet</Text>
      <Text style={styles.emptyStateText}>
        Start connecting with your friends to see your activity log here!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ExpoLinearGradient
        colors={COLORS.gradient.background}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Activity Log</Text>
          <Text style={styles.subtitle}>Your connection history</Text>
        </View>
      </ExpoLinearGradient>

      <FlatList
        data={logs}
        renderItem={renderLogItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    paddingVertical: SPACING.lg,
  },
  header: {
    paddingHorizontal: SPACING.lg,
  },
  title: {
    ...FONTS.heading,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...FONTS.bodyLight,
    color: COLORS.text.secondary,
  },
  listContent: {
    padding: SPACING.lg,
  },
  logItem: {
    backgroundColor: COLORS.card.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.card.border,
    shadowColor: COLORS.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  logContent: {
    flex: 1,
    paddingLeft: 0,
  },
  friendName: {
    ...FONTS.body,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  methodName: {
    ...FONTS.caption,
    color: COLORS.text.secondary,
  },
  logDate: {
    ...FONTS.small,
    color: COLORS.text.muted,
  },
  logNotes: {
    ...FONTS.bodyLight,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
    marginLeft: 56, // Icon width (40) + icon marginRight (16) = 56
  },
  logDuration: {
    ...FONTS.small,
    color: COLORS.text.muted,
    fontStyle: 'italic',
    marginLeft: 56, // Icon width (40) + icon marginRight (16) = 56
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyStateTitle: {
    ...FONTS.heading,
    color: COLORS.text.primary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  emptyStateText: {
    ...FONTS.bodyLight,
    color: COLORS.text.secondary,
    textAlign: 'center',
    maxWidth: width * 0.7,
  },
});

export default LogScreen;

