import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FriendsScreen from './FriendsScreen';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FriendsScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default HomeScreen;

