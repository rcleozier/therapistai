import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  Animated,
  LinearGradient,
  Platform,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import moment from "moment";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/colors';
import * as Haptics from 'expo-haptics';
import * as Contacts from 'expo-contacts';
import ConfettiCannon from 'react-native-confetti-cannon';
import FloatingAction from 'react-native-floating-action-menu';
import { 
  getAllFriends, 
  addFriend, 
  updateFriend, 
  deleteFriend, 
  toggleFriendFavorite, 
  updateLastContact,
  addContactLog,
  getContactLogsForFriend,
  deleteContactLog
} from '../utils/asyncStorageDB';

const { width, height } = Dimensions.get('window');
// Feature flags
const ENABLE_CONTACT_IMPORT = false; // Temporarily disable contact import UX

// Helper function to get avatar color based on name
const getAvatarColor = (name) => {
  const colors = COLORS.avatar;
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Dynamic encouraging messages
const getDynamicEncouragingMessage = () => {
  const messages = [
    "You're on fire this week! 🔥",
    "You're keeping the vibe alive 💫",
    "Your connections are thriving ✨",
    "Making moves and staying connected 🌟",
    "You're building meaningful bonds 💝",
    "Spreading love and staying close 💚",
    "Your friendship game is strong 🎯"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

// Helper function to get encouraging messages
const getEncouragingMessage = (urgency) => {
  const messages = {
    critical: [
      "Time to reach out! 💌",
      "They'd love to hear from you! 💕",
      "Ready for a great conversation? 🗣️"
    ],
    warning: [
      "Almost time to connect! ⏰",
      "Getting close to check-in time! 📅",
      "Perfect timing for a quick hello! 👋"
    ],
    good: [
      "You're doing great! 🌟",
      "On track! Keep it up! 💚",
      "Amazing consistency! 🙌",
      "You're nailing this! 🎯"
    ],
    default: [
      "Ready to connect! ✨",
      "Let's start building memories! 💫",
      "Time to make their day! 😊"
    ]
  };
  
  const messageArray = messages[urgency.level] || messages.default;
  return messageArray[Math.floor(Math.random() * messageArray.length)];
};

// Helper function to get connection suggestions
const getConnectionSuggestions = (friend) => {
  const suggestions = [
    { text: "Send a quick text", icon: "chatbubble", action: "text" },
    { text: "Schedule coffee ☕", icon: "cafe", action: "coffee" },
    { text: "Share a memory 📸", icon: "camera", action: "memory" },
    { text: "Video call 📹", icon: "videocam", action: "video" },
    { text: "Voice message 🎤", icon: "mic", action: "voice" },
    { text: "Send a card 💌", icon: "mail", action: "card" },
    { text: "Plan something fun 🎉", icon: "gift", action: "plan" }
  ];
  return suggestions[Math.floor(Math.random() * suggestions.length)];
};

const FriendsScreen = () => {
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showContactLogModal, setShowContactLogModal] = useState(false);
  const [showEditFriendModal, setShowEditFriendModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [contactLogs, setContactLogs] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiAnimation] = useState(new Animated.Value(0));
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showContactPickerModal, setShowContactPickerModal] = useState(false);
  const [contactsData, setContactsData] = useState([]);
  const confettiRef = React.useRef(null);
  const isIntentionalCloseRef = React.useRef(false);
  
  // New friend form state
  const [newFriend, setNewFriend] = useState({
    name: '',
    phone: '',
    email: '',
    birthday: '',
    notes: '',
    relationshipType: 'Friend',
    contactFrequency: 'Weekly',
    reminderEnabled: true
  });
  
  // Edit friend form state
  const [editFriend, setEditFriend] = useState({
    name: '',
    phone: '',
    email: '',
    birthday: '',
    notes: '',
    relationshipType: 'Friend',
    contactFrequency: 'Weekly',
  });

  // Contact log form state
  const [contactLog, setContactLog] = useState({
    contactMethod: 'call',
    notes: '',
    duration: ''
  });

  const contactMethods = [
    { key: 'call', label: 'Phone Call', icon: 'call', color: '#4CAF50' },
    { key: 'text', label: 'Text Message', icon: 'chatbubble', color: '#2196F3' },
    { key: 'email', label: 'Email', icon: 'mail', color: '#FF9800' },
    { key: 'in-person', label: 'In Person', icon: 'person', color: '#9C27B0' },
    { key: 'video', label: 'Video Call', icon: 'videocam', color: '#E91E63' }
  ];

  const relationshipTypes = ['Friend', 'Family', 'Colleague', 'Acquaintance', 'Other'];
  const contactFrequencies = ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Yearly'];

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      const friendsData = await getAllFriends();
      setFriends(friendsData);
      filterFriends(friendsData, searchQuery, activeFilter);
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  const filterFriends = (friendsData, query, filter) => {
    let filtered = friendsData;

    // Apply search filter
    if (query) {
      filtered = filtered.filter(friend => 
        friend.name.toLowerCase().includes(query.toLowerCase()) ||
        friend.notes?.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply category filter
    switch (filter) {
      case 'overdue':
        filtered = filtered.filter(friend => {
          if (!friend.lastContact) return true;
          const daysSinceContact = moment().diff(moment(friend.lastContact), 'days');
          const expectedDays = getFrequencyDays(friend.contactFrequency);
          return daysSinceContact > expectedDays;
        });
        break;
      case 'due-soon':
        filtered = filtered.filter(friend => {
          if (!friend.lastContact) return false;
          const daysSinceContact = moment().diff(moment(friend.lastContact), 'days');
          const expectedDays = getFrequencyDays(friend.contactFrequency);
          return daysSinceContact > expectedDays * 0.8 && daysSinceContact <= expectedDays;
        });
        break;
      case 'on-track':
        filtered = filtered.filter(friend => {
          if (!friend.lastContact) return false;
          const daysSinceContact = moment().diff(moment(friend.lastContact), 'days');
          const expectedDays = getFrequencyDays(friend.contactFrequency);
          return daysSinceContact <= expectedDays * 0.8;
        });
        break;
    }

    setFilteredFriends(filtered);
  };

  const getFrequencyDays = (frequency) => {
    const frequencyMap = {
      'Daily': 1,
      'Weekly': 7,
      'Bi-weekly': 14,
      'Monthly': 30,
      'Quarterly': 90,
      'Yearly': 365
    };
    return frequencyMap[frequency] || 7;
  };

  const getContactUrgency = (lastContact, contactFrequency) => {
    if (!lastContact) return { 
      level: 'critical', 
      color: COLORS.contact.overdue, 
      text: 'Never contacted',
      message: "Let's start connecting! 💫",
      icon: "heart-outline"
    };
    
    const daysSinceContact = moment().diff(moment(lastContact), 'days');
    const expectedDays = getFrequencyDays(contactFrequency);
    
    if (daysSinceContact > expectedDays) {
      return { 
        level: 'critical', 
        color: COLORS.contact.overdue, 
        text: `${daysSinceContact - expectedDays} days overdue`,
        message: "Time to reach out! 💌",
        icon: "heart",
        days: daysSinceContact - expectedDays
      };
    } else if (daysSinceContact > expectedDays * 0.8) {
      return { 
        level: 'warning', 
        color: COLORS.contact.dueSoon, 
        text: `Due in ${expectedDays - daysSinceContact} days`,
        message: "Almost time to connect! ⏰",
        icon: "time-outline",
        days: expectedDays - daysSinceContact
      };
    } else {
      return { 
        level: 'good', 
        color: COLORS.contact.onTrack, 
        text: `On track (${expectedDays - daysSinceContact} days left)`,
        message: "You're doing great! 🌟",
        icon: "checkmark-circle-outline",
        days: expectedDays - daysSinceContact
      };
    }
  };

  const handleImportFromContacts = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // 1) Permissions
      const permissionResult = await Contacts.requestPermissionsAsync();
      if (permissionResult.status !== 'granted') {
        Alert.alert('Permission Required', 'Amio needs access to your contacts to import them.');
        return;
      }

      // 2) Fetch
      const contactsResult = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.ID,
          Contacts.Fields.Name,
          Contacts.Fields.FirstName,
          Contacts.Fields.LastName,
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Emails,
        ],
        pageSize: 1000,
      });

      if (!contactsResult.data || contactsResult.data.length === 0) {
        Alert.alert('No Contacts', 'No contacts found on your device.');
        return;
      }

      // 3) Normalize and keep only contacts with a displayable name
      const processedContacts = contactsResult.data
        .map(c => {
          const displayName = c.name || [c.firstName, c.lastName].filter(Boolean).join(' ');
          return {
            ...c,
            id: c.id || `${displayName}-${Math.random().toString(36).slice(2)}`,
            name: displayName,
          };
        })
        .filter(c => c.name && c.name.trim().length > 0)
        .sort((a, b) => a.name.localeCompare(b.name));

      if (processedContacts.length === 0) {
        Alert.alert('No Valid Contacts', 'No contacts with names were found.');
        return;
      }

      // 4) Open picker (keep Add Friend modal open underneath)
      setContactsData(processedContacts);
      setShowContactPickerModal(true);
      
    } catch (error) {
      console.error('Error importing contacts:', error);
      Alert.alert('Error', `Failed to load contacts: ${error.message || 'Please try again.'}`);
    }
  };

  const handleContactSelected = (contact) => {
    if (!contact) {
      setShowContactPickerModal(false);
      setContactsData([]);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const contactName = contact.name || [contact.firstName, contact.lastName].filter(Boolean).join(' ');
    const firstPhone = Array.isArray(contact.phoneNumbers) ? contact.phoneNumbers[0] : undefined;
    const phoneNumber = firstPhone?.number || (typeof firstPhone === 'string' ? firstPhone : '');
    const firstEmail = Array.isArray(contact.emails) ? contact.emails[0] : undefined;
    const emailAddress = firstEmail?.email || (typeof firstEmail === 'string' ? firstEmail : '');

    setNewFriend(prev => ({
      ...prev,
      name: contactName,
      phone: phoneNumber,
      email: emailAddress,
    }));

    // Close only the picker; keep Add Friend open
    setShowContactPickerModal(false);
    setContactsData([]);
  };

  const handleAddFriend = async () => {
    if (!newFriend.name.trim()) {
      Alert.alert('Error', 'Please enter a name for your friend');
      return;
    }

    try {
      await addFriend(newFriend);
      isIntentionalCloseRef.current = true;
      setShowAddFriendModal(false);
      setNewFriend({
        name: '',
        phone: '',
        email: '',
        birthday: '',
        notes: '',
        relationshipType: 'Friend',
        contactFrequency: 'Weekly',
        reminderEnabled: true
      });
      await loadFriends();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        isIntentionalCloseRef.current = false;
      }, 100);
      Alert.alert('Success', 'Friend added successfully!');
    } catch (error) {
      console.error('Error adding friend:', error);
      Alert.alert('Error', 'Failed to add friend. Please try again.');
    }
  };

  const handleDeleteFriend = async (friend) => {
    setSelectedFriend(friend);
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteFriendFromModal = async () => {
    if (!selectedFriend) return;
    
    try {
      // Delete the friend
      await deleteFriend(selectedFriend.id);
      
      // Also delete all contact logs for this friend
      const contactLogs = await getContactLogsForFriend(selectedFriend.id);
      for (const log of contactLogs) {
        await deleteContactLog(log.id);
      }
      
      setShowDeleteConfirmModal(false);
      setShowContactLogModal(false);
      await loadFriends();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Friend Removed",
        `${selectedFriend.name} has been removed from your circle.`,
        [{ text: "OK", style: "default" }]
      );
    } catch (error) {
      console.error('Error deleting friend:', error);
      Alert.alert("Oops!", "Something went wrong. Let's try again!");
    }
  };

  const handleEditFriend = (friend) => {
    setSelectedFriend(friend);
    setEditFriend({
      name: friend.name || '',
      phone: friend.phone || '',
      email: friend.email || '',
      birthday: friend.birthday || '',
      notes: friend.notes || '',
      relationshipType: friend.relationshipType || 'Friend',
      contactFrequency: friend.contactFrequency || 'Weekly',
    });
    setShowEditFriendModal(true);
  };

  const handleUpdateFriend = async () => {
    if (!editFriend.name.trim()) {
      Alert.alert('Error', 'Please enter a name for your friend');
      return;
    }

    try {
      await updateFriend({ ...editFriend, id: selectedFriend.id });
      setShowEditFriendModal(false);
      await loadFriends();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Friend updated successfully!');
    } catch (error) {
      console.error('Error updating friend:', error);
      Alert.alert('Error', 'Failed to update friend. Please try again.');
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      await toggleFriendFavorite(id);
      await loadFriends();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => {
      if (confettiRef.current) {
        confettiRef.current.start();
      }
    }, 50);
    // Hide after animation completes
    setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
  };

  const handleUpdateLastContact = async (friendId) => {
    try {
      await updateLastContact(friendId);
      
      // Log the contact as a text message
      const friend = friends.find(f => f.id === friendId);
      if (friend) {
        await addContactLog({
          friendId: friendId,
          friendName: friend.name,
          contactMethod: 'text',
          notes: 'Marked as contacted',
          contactDate: new Date().toISOString()
        });
      }
      
      await loadFriends();
      // Refresh contact logs if modal is open
      await refreshContactLogsIfOpen(friendId);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      triggerConfetti();
    } catch (error) {
      console.error('Error updating contact:', error);
      Alert.alert("Oops!", "Something went wrong. Let's try again!");
    }
  };

  const handleAddContactLog = async () => {
    if (!contactLog.contactMethod) {
      Alert.alert('Error', 'Please select a contact method');
      return;
    }

    try {
      await addContactLog({
        ...contactLog,
        friendId: selectedFriend.id,
        friendName: selectedFriend.name
      });
      // Refresh contact logs if modal is still open
      await refreshContactLogsIfOpen(selectedFriend.id);
      setShowContactLogModal(false);
      setContactLog({ contactMethod: 'call', notes: '', duration: '' });
      await loadFriends();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      triggerConfetti();
    } catch (error) {
      console.error('Error adding contact log:', error);
      Alert.alert('Error', 'Failed to add contact log. Please try again.');
    }
  };

  const openContactLogs = async (friend) => {
    try {
      const logs = await getContactLogsForFriend(friend.id);
      setContactLogs(logs);
      setSelectedFriend(friend);
      setShowContactLogModal(true);
    } catch (error) {
      console.error('Error loading contact logs:', error);
    }
  };

  // Refresh contact logs if modal is open for the friend
  const refreshContactLogsIfOpen = async (friendId) => {
    if (showContactLogModal && selectedFriend && selectedFriend.id === friendId) {
      try {
        const logs = await getContactLogsForFriend(friendId);
        setContactLogs(logs);
      } catch (error) {
        console.error('Error refreshing contact logs:', error);
      }
    }
  };

  const handleCall = async () => {
    if (!selectedFriend?.phone) {
      Alert.alert('No Phone Number', 'This friend doesn\'t have a phone number saved.');
      return;
    }

    try {
      const phoneNumber = selectedFriend.phone.replace(/[^0-9+]/g, '');
      
      if (!phoneNumber) {
        Alert.alert('Invalid Phone Number', 'Please check the phone number format.');
        return;
      }

      const url = `tel:${phoneNumber}`;
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        // Log the call
        await addContactLog({
          friendId: selectedFriend.id,
          friendName: selectedFriend.name,
          contactMethod: 'call',
          notes: 'Phone call initiated',
          contactDate: new Date().toISOString()
        });
        
        // Refresh contact logs if modal is open
        await refreshContactLogsIfOpen(selectedFriend.id);
        
        await Linking.openURL(url);
      } else {
        Alert.alert('Cannot Make Call', 'Your device cannot make phone calls.');
      }
    } catch (error) {
      console.error('Error making phone call:', error);
      Alert.alert('Error', 'Could not open phone app. Please try again.');
    }
  };

  const handleMessage = async () => {
    if (!selectedFriend?.phone) {
      Alert.alert('No Phone Number', 'This friend doesn\'t have a phone number saved.');
      return;
    }

    try {
      const phoneNumber = selectedFriend.phone.replace(/[^0-9+]/g, '');
      
      if (!phoneNumber) {
        Alert.alert('Invalid Phone Number', 'Please check the phone number format.');
        return;
      }

      const url = `sms:${phoneNumber}`;
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        // Log the text message
        await addContactLog({
          friendId: selectedFriend.id,
          friendName: selectedFriend.name,
          contactMethod: 'text',
          notes: 'Text message initiated',
          contactDate: new Date().toISOString()
        });
        
        // Refresh contact logs if modal is open
        await refreshContactLogsIfOpen(selectedFriend.id);
        
        await Linking.openURL(url);
      } else {
        Alert.alert('Cannot Send Message', 'Your device cannot send text messages.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Could not open message app. Please try again.');
    }
  };

  const handleEmail = () => {
    if (selectedFriend?.email) {
      const url = `mailto:${selectedFriend.email}`;
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Could not open email app');
        }
      });
    }
  };

  const renderFriendItem = ({ item, index }) => {
    const urgency = getContactUrgency(item.lastContact, item.contactFrequency);
    const daysSinceContact = item.lastContact ? moment().diff(moment(item.lastContact), 'days') : null;
    const avatarColor = getAvatarColor(item.name);
    const isLastItem = index === filteredFriends.length - 1;
    
    return (
      <View style={[styles.friendCardContainer, isLastItem && styles.lastFriendCard]}>
        <TouchableOpacity 
          style={styles.friendCard}
          onPress={() => {
            openContactLogs(item);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          activeOpacity={0.7}
        >
          {/* Priority Badge */}
          {item.favorite && (
            <View style={styles.priorityBadge}>
              <Ionicons name="star" size={12} color={COLORS.white} />
              <Text style={styles.priorityText}>Close Friend</Text>
            </View>
          )}

          <View style={styles.friendHeader}>
            <View style={styles.friendHeaderLeft}>
              <View style={[styles.friendAvatar, { backgroundColor: avatarColor }]}>
                <Text style={styles.friendInitial}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{item.name}</Text>
                <View style={styles.friendMeta}>
                  <Text style={styles.friendRelationship}>{item.relationshipType}</Text>
                  <Text style={styles.friendFrequency}>• {item.contactFrequency}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.actionButton, item.favorite && styles.actionButtonActive]}
              onPress={(e) => {
                e.stopPropagation();
                handleToggleFavorite(item.id);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            >
              <Ionicons
                name={item.favorite ? "heart" : "heart-outline"}
                size={18}
                color={item.favorite ? COLORS.white : COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Compact Status */}
          <View style={styles.compactStatusContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: urgency.color }]}>
              <Ionicons name={urgency.icon} size={12} color={COLORS.white} />
            </View>
            <Text style={[styles.statusMessage, { color: urgency.color }]}>
              {urgency.message}
            </Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: urgency.color }]}
            onPress={(e) => {
              e.stopPropagation();
              handleUpdateLastContact(item.id);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }}
          >
            <Ionicons name="checkmark" size={20} color={COLORS.white} />
            <Text style={styles.contactButtonText}>Mark Contacted</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContactLogItem = ({ item }) => {
    const method = contactMethods.find(m => m.key === item.contactMethod);
    
    return (
      <View style={styles.logItem}>
        <View style={styles.logHeader}>
          <View style={styles.logMethod}>
            <View style={[styles.methodIcon, { backgroundColor: method?.color }]}>
              <Ionicons name={method?.icon} size={16} color={COLORS.white} />
            </View>
            <Text style={styles.methodLabel}>{method?.label}</Text>
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

  return (
    <View style={styles.container}>
      {/* Confetti Cannon - Only render when needed */}
      {showConfetti && (
        <View style={styles.confettiOverlay} pointerEvents="none">
          <ConfettiCannon
            ref={confettiRef}
            count={200}
            origin={{x: width / 2, y: 0}}
            autoStart={false}
            fadeOut={true}
            explosionSpeed={350}
            fallSpeed={3000}
          />
        </View>
      )}
      
      <FlatList
        data={filteredFriends.length > 0 ? filteredFriends : []}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.friendsList}
        showsVerticalScrollIndicator={true}
        bounces={true}
        alwaysBounceVertical={true}
        scrollEnabled={true}
        style={{ backgroundColor: COLORS.white }}
        ListEmptyComponent={
          activeFilter === 'all' && friends.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <ExpoLinearGradient
                colors={['rgba(255, 107, 107, 0.1)', 'rgba(78, 205, 196, 0.1)']}
                style={styles.emptyStateGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.emptyStateContent}>
                  <View style={styles.emptyStateIcon}>
                    <Ionicons name="people" size={64} color={COLORS.primary} />
                  </View>
                  
                  <Text style={styles.emptyStateTitle}>Welcome to Your Circle! 🌟</Text>
                  <Text style={styles.emptyStateSubtitle}>
                    Start building meaningful connections by adding your first friend
                  </Text>
                  
                  <View style={styles.emptyStateFeatures}>
                    <View style={styles.emptyStateFeature}>
                      <Ionicons name="heart" size={20} color={COLORS.primary} />
                      <Text style={styles.emptyStateFeatureText}>Never forget to reach out</Text>
                    </View>
                    <View style={styles.emptyStateFeature}>
                      <Ionicons name="time" size={20} color={COLORS.primary} />
                      <Text style={styles.emptyStateFeatureText}>Track your connection history</Text>
                    </View>
                    <View style={styles.emptyStateFeature}>
                      <Ionicons name="sparkles" size={20} color={COLORS.primary} />
                      <Text style={styles.emptyStateFeatureText}>Celebrate your relationships</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.emptyStateButton}
                    onPress={() => setShowAddFriendModal(true)}
                  >
                    <ExpoLinearGradient
                      colors={COLORS.gradient.primary}
                      style={styles.emptyStateButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Ionicons name="add-circle" size={22} color={COLORS.white} />
                      <Text style={styles.emptyStateButtonText}>Add Your First Friend</Text>
                    </ExpoLinearGradient>
                  </TouchableOpacity>
                  
                  <Text style={styles.emptyStateHint}>
                    Tap the + button anytime to add more friends
                  </Text>
                </View>
              </ExpoLinearGradient>
            </View>
          ) : filteredFriends.length === 0 && activeFilter !== 'all' ? (
            <View style={styles.filteredEmptyStateContainer}>
              <ExpoLinearGradient
                colors={['rgba(255, 107, 107, 0.05)', 'rgba(78, 205, 196, 0.05)']}
                style={styles.filteredEmptyStateGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.filteredEmptyStateContent}>
                  {activeFilter === 'overdue' && (
                    <>
                      <View style={styles.filteredEmptyStateIcon}>
                        <Ionicons name="heart" size={48} color={COLORS.contact.overdue} />
                      </View>
                      <Text style={styles.filteredEmptyStateTitle}>No One Needs Love Right Now!</Text>
                      <Text style={styles.filteredEmptyStateSubtitle}>
                        Everyone is up to date with their connections. Keep up the great work! 🌟
                      </Text>
                    </>
                  )}
                  
                  {activeFilter === 'due-soon' && (
                    <>
                      <View style={styles.filteredEmptyStateIcon}>
                        <Ionicons name="time" size={48} color={COLORS.contact.dueSoon} />
                      </View>
                      <Text style={styles.filteredEmptyStateTitle}>No One Due Soon!</Text>
                      <Text style={styles.filteredEmptyStateSubtitle}>
                        All your friends are well within their contact schedule. Amazing! ⏰
                      </Text>
                    </>
                  )}
                  
                  {activeFilter === 'on-track' && (
                    <>
                      <View style={styles.filteredEmptyStateIcon}>
                        <Ionicons name="checkmark-circle" size={48} color={COLORS.contact.onTrack} />
                      </View>
                      <Text style={styles.filteredEmptyStateTitle}>No One On Track Yet</Text>
                      <Text style={styles.filteredEmptyStateSubtitle}>
                        Start reaching out to your friends to see their progress here! 💚
                      </Text>
                    </>
                  )}
                </View>
              </ExpoLinearGradient>
            </View>
          ) : null
        }
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
            <>
              <View style={styles.headerGradient}>
                <View style={styles.header}>
                  <View style={styles.headerContent}>
                    <Text style={styles.title}>Your Friends</Text>
                    <Text style={styles.subtitle}>Stay connected with the people who matter</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                      setShowAddFriendModal(true);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Ionicons name="add" size={24} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                  <Ionicons name="search" size={20} color={COLORS.text.muted} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search friends..."
                    value={searchQuery}
                    onChangeText={(text) => {
                      setSearchQuery(text);
                      filterFriends(friends, text, activeFilter);
                    }}
                  />
                </View>
              </View>

              <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity
                    style={[styles.filterTab, activeFilter === 'all' && styles.filterTabActive]}
                    onPress={() => {
                      setActiveFilter('all');
                      filterFriends(friends, searchQuery, 'all');
                    }}
                  >
                    <Ionicons 
                      name="people" 
                      size={16} 
                      color={activeFilter === 'all' ? COLORS.white : COLORS.text.muted} 
                    />
                    <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>
                      All ({friends.length})
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.filterTab, activeFilter === 'overdue' && styles.filterTabActive]}
                    onPress={() => {
                      setActiveFilter('overdue');
                      filterFriends(friends, searchQuery, 'overdue');
                    }}
                  >
                    <Ionicons 
                      name="heart-outline" 
                      size={16} 
                      color={activeFilter === 'overdue' ? COLORS.white : COLORS.contact.overdue} 
                    />
                    <Text style={[styles.filterText, activeFilter === 'overdue' && styles.filterTextActive]}>
                      Need Love ({friends.filter(f => getContactUrgency(f.lastContact, f.contactFrequency).level === 'critical').length})
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.filterTab, activeFilter === 'due-soon' && styles.filterTabActive]}
                    onPress={() => {
                      setActiveFilter('due-soon');
                      filterFriends(friends, searchQuery, 'due-soon');
                    }}
                  >
                    <Ionicons 
                      name="time-outline" 
                      size={16} 
                      color={activeFilter === 'due-soon' ? COLORS.white : COLORS.contact.dueSoon} 
                    />
                    <Text style={[styles.filterText, activeFilter === 'due-soon' && styles.filterTextActive]}>
                      Due Soon ({friends.filter(f => getContactUrgency(f.lastContact, f.contactFrequency).level === 'warning').length})
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.filterTab, activeFilter === 'on-track' && styles.filterTabActive]}
                    onPress={() => {
                      setActiveFilter('on-track');
                      filterFriends(friends, searchQuery, 'on-track');
                    }}
                  >
                    <Ionicons 
                      name="checkmark-circle-outline" 
                      size={16} 
                      color={activeFilter === 'on-track' ? COLORS.white : COLORS.contact.onTrack} 
                    />
                    <Text style={[styles.filterText, activeFilter === 'on-track' && styles.filterTextActive]}>
                      On Track ({friends.filter(f => getContactUrgency(f.lastContact, f.contactFrequency).level === 'good').length})
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </>
          }
        />

      {/* Add Friend Modal */}
      <Modal
        visible={showAddFriendModal && !showContactPickerModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onDismiss={() => {
          // Only handle if it wasn't an intentional close
          if (!isIntentionalCloseRef.current) {
            setShowAddFriendModal(false);
            setContactsData([]);
            setShowContactPickerModal(false);
          }
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ExpoLinearGradient
            colors={COLORS.gradient.background}
            style={styles.modalGradient}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderContent}>
                <Text style={styles.modalTitle}>Add Someone Special</Text>
                <Text style={styles.modalSubtitle}>Let's celebrate your friendship! 💫</Text>
              </View>
              <View style={styles.modalHeaderActions}>
                {ENABLE_CONTACT_IMPORT && (
                  <TouchableOpacity
                    style={styles.importButton}
                    onPress={handleImportFromContacts}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="person-add" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    isIntentionalCloseRef.current = true;
                    setShowAddFriendModal(false);
                    setContactsData([]);
                    setShowContactPickerModal(false);
                    setTimeout(() => {
                      isIntentionalCloseRef.current = false;
                    }, 100);
                  }}
                >
                  <Ionicons name="close" size={24} color={COLORS.text.muted} />
                </TouchableOpacity>
              </View>
            </View>
          </ExpoLinearGradient>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Profile Section */}
            <View style={styles.modalSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="person-circle" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Basic Info</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>What's your friend's name? *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newFriend.name}
                  onChangeText={(text) => setNewFriend({...newFriend, name: text})}
                  placeholder="Their beautiful name..."
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone number</Text>
                <TextInput
                  style={styles.textInput}
                  value={newFriend.phone}
                  onChangeText={(text) => setNewFriend({...newFriend, phone: text})}
                  placeholder="So you can call them anytime 📞"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email address</Text>
                <TextInput
                  style={styles.textInput}
                  value={newFriend.email}
                  onChangeText={(text) => setNewFriend({...newFriend, email: text})}
                  placeholder="For those longer conversations 💌"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Birthday</Text>
                <TextInput
                  style={styles.textInput}
                  value={newFriend.birthday}
                  onChangeText={(text) => setNewFriend({...newFriend, birthday: text})}
                  placeholder="MM/DD - Never miss their special day! 🎂"
                />
              </View>
            </View>

            {/* Relationship Section */}
            <View style={styles.modalSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="heart" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Your Relationship</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>How do you know each other?</Text>
                <View style={styles.relationshipPicker}>
                  {relationshipTypes.map((type) => {
                    const iconMap = {
                      'Friend': 'heart',
                      'Family': 'home',
                      'Colleague': 'briefcase',
                      'Acquaintance': 'people',
                      'Other': 'star'
                    };
                    return (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.relationshipOption,
                          newFriend.relationshipType === type && styles.relationshipOptionActive
                        ]}
                        onPress={() => setNewFriend({...newFriend, relationshipType: type})}
                      >
                        <Ionicons 
                          name={iconMap[type]} 
                          size={20} 
                          color={newFriend.relationshipType === type ? COLORS.white : COLORS.primary} 
                        />
                        <Text style={[
                          styles.relationshipOptionText,
                          newFriend.relationshipType === type && styles.relationshipOptionTextActive
                        ]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Contact Frequency Section */}
            <View style={styles.modalSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="time" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>How Often to Connect</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>How often would you like to reach out?</Text>
                <View style={styles.frequencyPicker}>
                  {contactFrequencies.map((frequency) => {
                    const iconMap = {
                      'Daily': 'sunny',
                      'Weekly': 'calendar',
                      'Bi-weekly': 'time',
                      'Monthly': 'moon',
                      'Quarterly': 'leaf',
                      'Yearly': 'gift'
                    };
                    return (
                      <TouchableOpacity
                        key={frequency}
                        style={[
                          styles.frequencyOption,
                          newFriend.contactFrequency === frequency && styles.frequencyOptionActive
                        ]}
                        onPress={() => setNewFriend({...newFriend, contactFrequency: frequency})}
                      >
                        <Ionicons 
                          name={iconMap[frequency]} 
                          size={18} 
                          color={newFriend.contactFrequency === frequency ? COLORS.white : COLORS.primary} 
                        />
                        <Text style={[
                          styles.frequencyOptionText,
                          newFriend.contactFrequency === frequency && styles.frequencyOptionTextActive
                        ]}>
                          {frequency}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                isIntentionalCloseRef.current = true;
                setShowAddFriendModal(false);
                setContactsData([]);
                setShowContactPickerModal(false);
                setTimeout(() => {
                  isIntentionalCloseRef.current = false;
                }, 100);
              }}
            >
              <Text style={styles.cancelButtonText}>Maybe Later</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.addFriendButton}
              onPress={handleAddFriend}
            >
              <ExpoLinearGradient
                colors={COLORS.gradient.primary}
                style={styles.addFriendButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="heart" size={20} color={COLORS.white} />
                <Text style={styles.addFriendButtonText}>Add to My Circle</Text>
              </ExpoLinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Edit Friend Modal */}
      <Modal
        visible={showEditFriendModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <ExpoLinearGradient
            colors={COLORS.gradient.background}
            style={styles.modalGradient}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderContent}>
                <Text style={styles.modalTitle}>Edit Friend</Text>
                <Text style={styles.modalSubtitle}>Update their information 💫</Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowEditFriendModal(false)}
              >
                <Ionicons name="close" size={24} color={COLORS.text.muted} />
              </TouchableOpacity>
            </View>
          </ExpoLinearGradient>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Profile Section */}
            <View style={styles.modalSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="person-circle" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Basic Info</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={editFriend.name}
                  onChangeText={(text) => setEditFriend({...editFriend, name: text})}
                  placeholder="Their name..."
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone number</Text>
                <TextInput
                  style={styles.textInput}
                  value={editFriend.phone}
                  onChangeText={(text) => setEditFriend({...editFriend, phone: text})}
                  placeholder="Phone number"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email address</Text>
                <TextInput
                  style={styles.textInput}
                  value={editFriend.email}
                  onChangeText={(text) => setEditFriend({...editFriend, email: text})}
                  placeholder="Email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Birthday</Text>
                <TextInput
                  style={styles.textInput}
                  value={editFriend.birthday}
                  onChangeText={(text) => setEditFriend({...editFriend, birthday: text})}
                  placeholder="MM/DD"
                />
              </View>
            </View>

            {/* Relationship Section */}
            <View style={styles.modalSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="heart" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Your Relationship</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>How do you know each other?</Text>
                <View style={styles.relationshipPicker}>
                  {relationshipTypes.map((type) => {
                    const iconMap = {
                      'Friend': 'heart',
                      'Family': 'home',
                      'Colleague': 'briefcase',
                      'Acquaintance': 'people',
                      'Other': 'star'
                    };
                    return (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.relationshipOption,
                          editFriend.relationshipType === type && styles.relationshipOptionActive
                        ]}
                        onPress={() => setEditFriend({...editFriend, relationshipType: type})}
                      >
                        <Ionicons 
                          name={iconMap[type]} 
                          size={20} 
                          color={editFriend.relationshipType === type ? COLORS.white : COLORS.primary} 
                        />
                        <Text style={[
                          styles.relationshipOptionText,
                          editFriend.relationshipType === type && styles.relationshipOptionTextActive
                        ]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Contact Frequency Section */}
            <View style={styles.modalSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="time" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>How Often to Connect</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>How often would you like to reach out?</Text>
                <View style={styles.frequencyPicker}>
                  {contactFrequencies.map((frequency) => {
                    const iconMap = {
                      'Daily': 'sunny',
                      'Weekly': 'calendar',
                      'Bi-weekly': 'time',
                      'Monthly': 'moon',
                      'Quarterly': 'leaf',
                      'Yearly': 'gift'
                    };
                    return (
                      <TouchableOpacity
                        key={frequency}
                        style={[
                          styles.frequencyOption,
                          editFriend.contactFrequency === frequency && styles.frequencyOptionActive
                        ]}
                        onPress={() => setEditFriend({...editFriend, contactFrequency: frequency})}
                      >
                        <Ionicons 
                          name={iconMap[frequency]} 
                          size={18} 
                          color={editFriend.contactFrequency === frequency ? COLORS.white : COLORS.primary} 
                        />
                        <Text style={[
                          styles.frequencyOptionText,
                          editFriend.contactFrequency === frequency && styles.frequencyOptionTextActive
                        ]}>
                          {frequency}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowEditFriendModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.addFriendButton}
              onPress={handleUpdateFriend}
            >
              <ExpoLinearGradient
                colors={COLORS.gradient.primary}
                style={styles.addFriendButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="checkmark" size={20} color={COLORS.white} />
                <Text style={styles.addFriendButtonText}>Save Changes</Text>
              </ExpoLinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Contact Log Modal */}
      <Modal
        visible={showContactLogModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <ExpoLinearGradient
            colors={COLORS.gradient.background}
            style={styles.modalGradient}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderContent}>
                <Text style={styles.modalTitle}>Your Connection with {selectedFriend?.name}</Text>
                {selectedFriend?.lastContact && (
                  <Text style={styles.modalSubtitle}>
                    Last connected {moment(selectedFriend.lastContact).fromNow()}
                  </Text>
                )}
              </View>
              <View style={styles.modalHeaderActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setShowContactLogModal(false);
                    handleEditFriend(selectedFriend);
                  }}
                >
                  <Ionicons name="create-outline" size={20} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    // Close the contact log sheet first to avoid stacked modal issues
                    setShowContactLogModal(false);
                    setTimeout(() => setShowDeleteConfirmModal(true), 150);
                  }}
                >
                  <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowContactLogModal(false)}
                >
                  <Ionicons name="close" size={20} color={COLORS.text.muted} />
                </TouchableOpacity>
              </View>
            </View>
          </ExpoLinearGradient>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Timeline Section */}
            <View style={styles.modalSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="time" size={20} color={COLORS.primary} />
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>Your Connection Timeline</Text>
                  <Text style={styles.sectionMicroLabel}>Recent Activity</Text>
                </View>
              </View>
              
              {contactLogs.length > 0 ? (
                <ScrollView 
                  style={styles.timelineScrollContainer}
                  contentContainerStyle={styles.timelineContainer}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {contactLogs.map((log, index) => (
                    <View key={log.id} style={styles.timelineItem}>
                      <View style={styles.timelineDot}>
                        <Ionicons 
                          name={contactMethods.find(m => m.key === log.contactMethod)?.icon || 'call'} 
                          size={16} 
                          color={COLORS.white} 
                        />
                      </View>
                      <View style={styles.timelineContent}>
                        <View style={styles.timelineHeader}>
                          <Text style={styles.timelineMethod}>
                            {contactMethods.find(m => m.key === log.contactMethod)?.label}
                          </Text>
                          <Text style={styles.timelineDate}>
                            {moment(log.contactDate).format('MMM D, YYYY')}
                          </Text>
                        </View>
                        {log.notes && (
                          <Text style={styles.timelineNotes}>{log.notes}</Text>
                        )}
                        {log.duration && (
                          <Text style={styles.timelineDuration}>Duration: {log.duration}</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.emptyTimeline}>
                  <Ionicons name="heart-outline" size={48} color={COLORS.text.muted} />
                  <Text style={styles.emptyTimelineText}>No connections yet</Text>
                  <Text style={styles.emptyTimelineSubtext}>Start building your connection history!</Text>
                </View>
              )}
            </View>

            {/* Quick Actions Section */}
            <View style={styles.modalSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="flash" size={20} color={COLORS.primary} />
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>Quick Actions</Text>
                  <Text style={styles.sectionMicroLabel}>Reach out instantly</Text>
                </View>
              </View>
              
              <View style={styles.quickActionsGroup}>
                {(selectedFriend?.phone || selectedFriend?.email) && (
                  <View style={styles.quickActionsCard}>
                    {selectedFriend?.phone && (
                      <>
                        <TouchableOpacity
                          style={styles.quickActionButton}
                          onPress={() => {
                            handleCall();
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          }}
                          activeOpacity={0.7}
                        >
                          <ExpoLinearGradient
                            colors={['#FF6B6B', '#FF8E8E']}
                            style={styles.quickActionIconGradient}
                          >
                            <Ionicons name="call" size={24} color={COLORS.white} />
                          </ExpoLinearGradient>
                          <Text style={styles.quickActionLabel}>Call</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={styles.quickActionButton}
                          onPress={() => {
                            handleMessage();
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          }}
                          activeOpacity={0.7}
                        >
                          <ExpoLinearGradient
                            colors={['#2196F3', '#42A5F5']}
                            style={styles.quickActionIconGradient}
                          >
                            <Ionicons name="chatbubble" size={24} color={COLORS.white} />
                          </ExpoLinearGradient>
                          <Text style={styles.quickActionLabel}>Message</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    
                    {selectedFriend?.email && (
                      <TouchableOpacity
                        style={styles.quickActionButton}
                        onPress={() => {
                          handleEmail();
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        }}
                        activeOpacity={0.7}
                      >
                        <ExpoLinearGradient
                          colors={['#FF9800', '#FFB74D']}
                          style={styles.quickActionIconGradient}
                        >
                          <Ionicons name="mail" size={24} color={COLORS.white} />
                        </ExpoLinearGradient>
                        <Text style={styles.quickActionLabel}>Email</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </View>

            {/* Add New Contact Section */}
            <View style={styles.modalSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="add-circle" size={20} color={COLORS.primary} />
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>Log Your Connection</Text>
                  <Text style={styles.sectionMicroLabel}>Capture this moment</Text>
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>How did you connect?</Text>
                <View style={styles.methodPicker}>
                  {contactMethods.map((method) => (
                    <TouchableOpacity
                      key={method.key}
                      style={[
                        styles.methodOption,
                        contactLog.contactMethod === method.key && styles.methodOptionActive
                      ]}
                      onPress={() => setContactLog({...contactLog, contactMethod: method.key})}
                    >
                      <Ionicons 
                        name={method.icon} 
                        size={20} 
                        color={contactLog.contactMethod === method.key ? COLORS.white : method.color} 
                      />
                      <Text style={[
                        styles.methodOptionText,
                        contactLog.contactMethod === method.key && styles.methodOptionTextActive
                      ]}>
                        {method.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>What did you talk about? Any highlights?</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={contactLog.notes}
                  onChangeText={(text) => setContactLog({...contactLog, notes: text})}
                  placeholder="Share the highlights of your conversation... maybe a funny moment, something new you learned about them, or a plan you made together! ✨"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>How long did you chat?</Text>
                <View style={styles.durationPicker}>
                  {['5 min', '15 min', '30 min', '1 hour', '2+ hours'].map((duration) => (
                    <TouchableOpacity
                      key={duration}
                      style={[
                        styles.durationOption,
                        contactLog.duration === duration && styles.durationOptionActive
                      ]}
                      onPress={() => setContactLog({...contactLog, duration})}
                    >
                      <Text style={[
                        styles.durationOptionText,
                        contactLog.duration === duration && styles.durationOptionTextActive
                      ]}>
                        {duration}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButtonPill}
              onPress={() => setShowContactLogModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Maybe Later</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.addLogButton}
              onPress={() => {
                handleAddContactLog();
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }}
              activeOpacity={0.8}
            >
              <ExpoLinearGradient
                colors={COLORS.gradient.success}
                style={styles.addLogButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
                <Text style={styles.addLogButtonText}>Save Connection</Text>
              </ExpoLinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirmModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDeleteConfirmModal(false)}
      >
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModalContainer}>
            <View style={styles.confirmModalHeader}>
              <View style={styles.confirmModalIcon}>
                <Ionicons name="heart-dislike" size={32} color={COLORS.error} />
              </View>
              <Text style={styles.confirmModalTitle}>Remove {selectedFriend?.name}?</Text>
              <Text style={styles.confirmModalMessage}>
                This will permanently remove {selectedFriend?.name} from your friends list and delete all your connection history with them. This action cannot be undone.
              </Text>
            </View>
            
            <View style={styles.confirmModalActions}>
              <TouchableOpacity
                style={styles.confirmCancelButton}
                onPress={() => setShowDeleteConfirmModal(false)}
              >
                <Text style={styles.confirmCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={handleDeleteFriendFromModal}
              >
                <Ionicons name="trash" size={18} color={COLORS.white} />
                <Text style={styles.confirmDeleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Contact Picker Modal (disabled via feature flag) */}
      {ENABLE_CONTACT_IMPORT && (
        <Modal
          visible={showContactPickerModal}
          animationType="slide"
          presentationStyle="fullScreen"
          transparent={false}
          onRequestClose={() => setShowContactPickerModal(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <ExpoLinearGradient
              colors={COLORS.gradient.background}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderContent}>
                  <Text style={styles.modalTitle}>Select a Contact</Text>
                  <Text style={styles.modalSubtitle}>Choose from your device contacts</Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => handleContactSelected(null)}
                >
                  <Ionicons name="close" size={24} color={COLORS.text.muted} />
                </TouchableOpacity>
              </View>
            </ExpoLinearGradient>

            <FlatList
              data={contactsData}
              keyExtractor={(item, index) => item.id || `contact-${item.name}-${index}`}
              renderItem={({ item }) => {
                const phoneNumber = item.phoneNumbers?.[0]?.number || item.phoneNumbers?.[0] || '';
                return (
                  <TouchableOpacity
                    style={styles.contactPickerItem}
                    onPress={() => handleContactSelected(item)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.friendAvatar, { backgroundColor: getAvatarColor(item.name || 'A') }]}>
                      <Text style={styles.friendInitial}>
                        {(item.name || 'A').charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.contactPickerInfo}>
                      <Text style={styles.friendName}>{item.name || 'Unknown'}</Text>
                      {phoneNumber && (
                        <Text style={styles.friendRelationship}>{phoneNumber}</Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.text.muted} />
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={styles.contactPickerList}
            />
          </SafeAreaView>
        </Modal>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  confettiOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  confettiContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -30,
    marginTop: -30,
    zIndex: 1000,
  },
  headerGradient: {
    paddingBottom: hp('1%'),
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingTop: hp('1%'),
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: wp('5%'),
    fontWeight: '800',
    fontFamily: Platform.select({ ios: 'SF Pro Display', android: 'Roboto' }),
    color: COLORS.text.primary,
    marginBottom: hp('0.1%'),
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: wp('2.8%'),
    fontWeight: '400',
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
    lineHeight: hp('2%'),
    color: COLORS.text.secondary,
  },
  addButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: hp('0.5%') },
    shadowOpacity: 0.3,
    shadowRadius: wp('2%'),
    elevation: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    marginTop: SPACING.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
    justifyContent: 'center',
  },
  statValue: {
    ...FONTS.body,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    marginHorizontal: SPACING.sm,
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: hp('1%'),
    backgroundColor: COLORS.white,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card.background,
    borderRadius: wp('3%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderWidth: 1,
    borderColor: COLORS.card.border,
    shadowColor: COLORS.card.shadow,
    shadowOffset: { width: 0, height: hp('0.25%') },
    shadowOpacity: 0.1,
    shadowRadius: wp('2%'),
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.md,
    ...FONTS.body,
    color: COLORS.text.primary,
  },
  filterContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    marginRight: wp('2%'),
    borderRadius: wp('3%'),
    backgroundColor: COLORS.card.background,
    borderWidth: 1.5,
    borderColor: COLORS.card.border,
    shadowColor: COLORS.card.shadow,
    shadowOffset: { width: 0, height: hp('0.3%') },
    shadowOpacity: 0.08,
    shadowRadius: wp('1.5%'),
    elevation: 3,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  filterText: {
    fontSize: wp('3%'),
    color: COLORS.text.secondary,
    fontWeight: '600',
    marginLeft: wp('1.5%'),
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
  },
  filterTextActive: {
    color: COLORS.white,
  },
  friendsList: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.white,
  },
  friendCardContainer: {
    marginBottom: hp('0.8%'),
  },
  lastFriendCard: {
    marginBottom: hp('1.5%'),
  },
  friendCard: {
    borderRadius: wp('3%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    backgroundColor: COLORS.card.background,
    borderWidth: 1,
    borderColor: COLORS.card.border,
    shadowColor: COLORS.card.shadow,
    shadowOffset: { width: 0, height: hp('0.3%') },
    shadowOpacity: 0.08,
    shadowRadius: wp('2%'),
    elevation: 4,
    position: 'relative',
  },
  priorityBadge: {
    position: 'absolute',
    top: hp('0.5%'),
    right: wp('2%'),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: wp('3%'),
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: hp('0.2%') },
    shadowOpacity: 0.3,
    shadowRadius: wp('1%'),
    elevation: 4,
    zIndex: 10,
  },
  priorityText: {
    fontSize: wp('2%'),
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: wp('1%'),
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('0.5%'),
  },
  friendHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendAvatar: {
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: wp('5.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp('0.2%') },
    shadowOpacity: 0.1,
    shadowRadius: wp('1%'),
    elevation: 2,
  },
  friendInitial: {
    color: COLORS.white,
    fontSize: wp('5%'),
    fontWeight: '800',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: wp('4.5%'),
    fontWeight: '800',
    fontFamily: Platform.select({ ios: 'SF Pro Display', android: 'Roboto' }),
    color: COLORS.text.primary,
    marginBottom: hp('0.2%'),
    letterSpacing: -0.3,
  },
  friendMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendRelationship: {
    fontSize: wp('3%'),
    color: COLORS.text.secondary,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
  },
  friendFrequency: {
    fontSize: wp('2.8%'),
    color: COLORS.text.muted,
    marginLeft: wp('1%'),
    fontWeight: '500',
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
  },
  friendActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
  },
  actionButton: {
    position: 'absolute',
    top: hp('2.5%'),
    right: wp('4%'),
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    backgroundColor: COLORS.card.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.card.border,
    shadowColor: COLORS.card.shadow,
    shadowOffset: { width: 0, height: hp('0.2%') },
    shadowOpacity: 0.1,
    shadowRadius: wp('1%'),
    elevation: 2,
    zIndex: 5,
  },
  actionButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  deleteActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(225, 112, 85, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(225, 112, 85, 0.3)',
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  compactStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.1)',
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusMessage: {
    ...FONTS.caption,
    fontWeight: '600',
    marginRight: SPACING.sm,
  },
  statusDetails: {
    ...FONTS.small,
    color: COLORS.text.muted,
  },
  connectionSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: 'rgba(255, 248, 245, 0.9)',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.15)',
    shadowColor: COLORS.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  suggestionText: {
    ...FONTS.caption,
    color: COLORS.text.primary,
    marginLeft: SPACING.sm,
    marginRight: SPACING.xs,
    fontWeight: '500',
    flex: 1,
  },
  friendDetails: {
    marginBottom: SPACING.md,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.sm,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
    marginBottom: SPACING.xs,
  },
  contactText: {
    ...FONTS.caption,
    color: COLORS.text.secondary,
    marginLeft: SPACING.xs,
  },
  lastContactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  lastContactLabel: {
    ...FONTS.caption,
    color: COLORS.text.muted,
    marginRight: SPACING.xs,
  },
  lastContactDate: {
    ...FONTS.caption,
    fontWeight: '600',
  },
  urgencyInfo: {
    marginBottom: SPACING.sm,
  },
  urgencyText: {
    ...FONTS.caption,
    fontWeight: '600',
  },
  friendFooter: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  contactButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('3%'),
    gap: wp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp('0.5%') },
    shadowOpacity: 0.12,
    shadowRadius: wp('2%'),
    elevation: 4,
  },
  contactButtonText: {
    ...FONTS.caption,
    color: COLORS.white,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
    gap: SPACING.xs,
  },
  secondaryButtonText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalGradient: {
    paddingBottom: SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  modalHeaderContent: {
    flex: 1,
  },
  modalTitle: {
    ...FONTS.subheading,
    color: '#1A1A1A',
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  modalSubtitle: {
    ...FONTS.bodyLight,
    color: COLORS.text.secondary,
  },
  modalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(225, 112, 85, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(225, 112, 85, 0.2)',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
  importButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  modalSection: {
    marginBottom: SPACING.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg + 4,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 107, 107, 0.1)',
  },
  sectionTitleContainer: {
    marginLeft: SPACING.sm,
  },
  sectionTitle: {
    ...FONTS.body,
    color: COLORS.text.primary,
    fontWeight: '800',
    marginBottom: 2,
  },
  sectionMicroLabel: {
    ...FONTS.small,
    color: COLORS.text.muted,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    ...FONTS.body,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  textInput: {
    backgroundColor: COLORS.card.background,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.card.border,
    ...FONTS.body,
    color: COLORS.text.primary,
    shadowColor: COLORS.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  // Relationship Picker Styles
  relationshipPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  relationshipOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.card.background,
    borderWidth: 2,
    borderColor: COLORS.card.border,
    shadowColor: COLORS.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: SPACING.sm,
  },
  relationshipOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
  },
  relationshipOptionText: {
    ...FONTS.caption,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  relationshipOptionTextActive: {
    color: COLORS.white,
  },
  // Frequency Picker Styles
  frequencyPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  frequencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card.background,
    borderWidth: 2,
    borderColor: COLORS.card.border,
    shadowColor: COLORS.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: SPACING.xs,
  },
  frequencyOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
  },
  frequencyOptionText: {
    ...FONTS.small,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  frequencyOptionTextActive: {
    color: COLORS.white,
  },
  // Timeline Styles
  timelineScrollContainer: {
    maxHeight: hp('25%'), // Limit height to about 25% of screen
  },
  timelineContainer: {
    marginLeft: SPACING.md,
    paddingRight: SPACING.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: SPACING.lg + 4,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: COLORS.card.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md + 2,
    borderWidth: 1,
    borderColor: '#EDEDED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  timelineMethod: {
    ...FONTS.caption,
    color: COLORS.text.primary,
    fontWeight: '700',
  },
  timelineDate: {
    ...FONTS.small,
    color: '#9A9A9A',
    fontWeight: '500',
  },
  timelineNotes: {
    ...FONTS.bodyLight,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  timelineDuration: {
    ...FONTS.small,
    color: COLORS.text.muted,
    fontStyle: 'italic',
  },
  emptyTimeline: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTimelineText: {
    ...FONTS.body,
    color: COLORS.text.muted,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  emptyTimelineSubtext: {
    ...FONTS.caption,
    color: COLORS.text.muted,
    fontStyle: 'italic',
  },
  // Duration Picker Styles
  durationPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  durationOption: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card.background,
    borderWidth: 2,
    borderColor: COLORS.card.border,
    shadowColor: COLORS.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  durationOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
  },
  durationOptionText: {
    ...FONTS.caption,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  durationOptionTextActive: {
    color: COLORS.white,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  pickerOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.card.background,
    borderWidth: 1,
    borderColor: COLORS.card.border,
  },
  pickerOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pickerOptionText: {
    ...FONTS.caption,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  pickerOptionTextActive: {
    color: COLORS.white,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 107, 107, 0.1)',
    gap: SPACING.md,
    backgroundColor: COLORS.background,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card.background,
    borderWidth: 1,
    borderColor: COLORS.card.border,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButtonPill: {
    flex: 1,
    paddingVertical: SPACING.md + 4,
    borderRadius: 28,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    ...FONTS.body,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  addFriendButton: {
    flex: 2,
    borderRadius: BORDER_RADIUS.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addFriendButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  addFriendButtonText: {
    ...FONTS.body,
    color: COLORS.white,
    fontWeight: '700',
  },
  addLogButton: {
    flex: 2,
    borderRadius: BORDER_RADIUS.lg,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addLogButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md + 4,
    borderRadius: 28,
    gap: SPACING.sm,
  },
  addLogButtonText: {
    ...FONTS.body,
    color: COLORS.white,
    fontWeight: '700',
  },
  saveButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    ...FONTS.body,
    color: COLORS.white,
    fontWeight: '600',
  },
  logsContainer: {
    marginBottom: SPACING.xl,
  },
  logsTitle: {
    ...FONTS.subheading,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  logItem: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.card.border,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  logMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  methodLabel: {
    ...FONTS.caption,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  logDate: {
    ...FONTS.caption,
    color: COLORS.text.muted,
  },
  logNotes: {
    ...FONTS.body,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  logDuration: {
    ...FONTS.caption,
    color: COLORS.text.muted,
  },
  noLogsText: {
    ...FONTS.body,
    color: COLORS.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  addLogSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.card.border,
    paddingTop: SPACING.lg,
  },
  addLogTitle: {
    ...FONTS.subheading,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  methodPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.card.background,
    borderWidth: 1,
    borderColor: COLORS.card.border,
    gap: SPACING.xs,
  },
  methodOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  methodOptionText: {
    ...FONTS.caption,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  methodOptionTextActive: {
    color: COLORS.white,
  },
  // Delete Confirmation Modal Styles
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  confirmModalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  confirmModalHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  confirmModalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(225, 112, 85, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  confirmModalTitle: {
    ...FONTS.subheading,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  confirmModalMessage: {
    ...FONTS.bodyLight,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  confirmModalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  confirmCancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card.background,
    borderWidth: 1,
    borderColor: COLORS.card.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmCancelButtonText: {
    ...FONTS.body,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  confirmDeleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.error,
    gap: SPACING.sm,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmDeleteButtonText: {
    ...FONTS.body,
    color: COLORS.white,
    fontWeight: '700',
  },
  // Empty State Styles
  emptyStateContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
  },
  emptyStateScrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xxl + 40 : SPACING.xxl + 20,
  },
  emptyStateGradient: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 500,
  },
  emptyStateContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  emptyStateIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  emptyStateTitle: {
    ...FONTS.heading,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  emptyStateSubtitle: {
    ...FONTS.bodyLight,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  emptyStateFeatures: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  emptyStateFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.1)',
  },
  emptyStateFeatureText: {
    ...FONTS.caption,
    color: COLORS.text.primary,
    marginLeft: SPACING.md,
    fontWeight: '500',
  },
  emptyStateButton: {
    width: '100%',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  emptyStateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg + 4,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    gap: SPACING.md,
  },
  emptyStateButtonText: {
    ...FONTS.body,
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
  emptyStateHint: {
    ...FONTS.small,
    color: COLORS.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Filtered Empty State Styles
  filteredEmptyStateContainer: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filteredEmptyStateGradient: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  filteredEmptyStateContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  filteredEmptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 107, 107, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  filteredEmptyStateTitle: {
    ...FONTS.subheading,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  filteredEmptyStateSubtitle: {
    ...FONTS.bodyLight,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  backToAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.card.background,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.card.border,
    gap: SPACING.sm,
  },
  backToAllButtonText: {
    ...FONTS.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  quickActionsGroup: {
    paddingVertical: SPACING.sm,
  },
  quickActionsCard: {
    flexDirection: 'row',
    gap: SPACING.md,
    padding: SPACING.md,
    backgroundColor: 'rgba(255, 107, 107, 0.03)',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  quickActionButton: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionLabel: {
    ...FONTS.small,
    color: COLORS.text.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  quickActionText: {
    ...FONTS.caption,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  floatingActionButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  contactPickerList: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  contactPickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.card.background,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.card.border,
  },
  contactPickerInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
});

export default FriendsScreen; 