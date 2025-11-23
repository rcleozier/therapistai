import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/colors';

const { width } = Dimensions.get('window');

const FriendCard = ({
  friend,
  showContactButton = false,
  showFrequency = false,
  showActions = false,
  onContactPress,
  onEditPress,
  onDeletePress,
  onFavoritePress,
  onViewLogsPress,
  getContactUrgency,
}) => {
  const urgency = getContactUrgency(friend.lastContact, friend.contactFrequency);
  const daysSinceContact = friend.lastContact ? 
    Math.floor((new Date() - new Date(friend.lastContact)) / (1000 * 60 * 60 * 24)) : null;

  const getLastContactText = () => {
    if (!friend.lastContact) return 'You haven\'t contacted them yet';
    if (daysSinceContact === 0) return 'You contacted them today';
    if (daysSinceContact === 1) return 'You contacted them yesterday';
    return `You contacted them ${daysSinceContact} days ago`;
  };

  return (
    <TouchableOpacity
      style={styles.friendCard}
      activeOpacity={0.7}
    >
      <View style={styles.friendCardHeader}>
        <View style={styles.friendAvatar}>
          <Text style={styles.friendInitial}>
            {friend.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>{friend.name}</Text>
          <Text style={styles.friendRelationship}>{friend.relationshipType}</Text>
          {showFrequency && (
            <Text style={styles.friendFrequency}>• {friend.contactFrequency}</Text>
          )}
        </View>

        {showActions && (
          <View style={styles.actionIcons}>
            <TouchableOpacity
              style={styles.actionIcon}
              onPress={() => onFavoritePress && onFavoritePress(friend)}
            >
              <Ionicons 
                name={friend.favorite ? "heart" : "heart-outline"} 
                size={20} 
                color={friend.favorite ? COLORS.error : COLORS.text.muted} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionIcon}
              onPress={() => onViewLogsPress && onViewLogsPress(friend)}
            >
              <Ionicons name="time-outline" size={20} color={COLORS.text.muted} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionIcon}
              onPress={() => onEditPress && onEditPress(friend)}
            >
              <Ionicons name="create-outline" size={20} color={COLORS.text.muted} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionIcon}
              onPress={() => onDeletePress && onDeletePress(friend)}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.urgencyBadge, { backgroundColor: urgency.color }]}>
          <Text style={styles.urgencyBadgeText}>
            {urgency.level === 'critical' ? '!' : urgency.level === 'warning' ? '~' : '✓'}
          </Text>
        </View>
      </View>

      <View style={styles.friendCardContent}>
        <Text style={styles.lastContactText}>
          {getLastContactText()}
        </Text>
        
        <Text style={[styles.urgencyText, { color: urgency.color }]}>
          {urgency.text}
        </Text>
      </View>

      {showContactButton && (
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: urgency.color }]}
            onPress={() => onContactPress && onContactPress(friend.id)}
          >
            <Ionicons name="call" size={16} color={COLORS.white} />
            <Text style={styles.contactButtonText}>Mark as Contacted</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.viewLogsButton}
            onPress={() => onViewLogsPress && onViewLogsPress(friend)}
          >
            <Text style={styles.viewLogsText}>View Contact Log {'>'}</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  friendCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.card.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  friendCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  friendAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  friendInitial: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    ...FONTS.body,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  friendRelationship: {
    ...FONTS.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  friendFrequency: {
    ...FONTS.caption,
    color: COLORS.text.muted,
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginRight: SPACING.md,
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.card.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.card.border,
  },
  urgencyBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  urgencyBadgeText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendCardContent: {
    marginBottom: SPACING.md,
  },
  lastContactText: {
    ...FONTS.body,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  urgencyText: {
    ...FONTS.caption,
    fontWeight: '600',
    fontSize: 13,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    flex: 1,
    marginRight: SPACING.md,
  },
  contactButtonText: {
    ...FONTS.caption,
    color: COLORS.white,
    fontWeight: '600',
  },
  viewLogsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  viewLogsText: {
    ...FONTS.body,
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default FriendCard; 