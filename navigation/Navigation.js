import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Analytics } from '../utils/analytics';
import StartScreen from '../screens/StartScreen';
import GameScreen from '../screens/GameScreen';
import SettingsScreen from '../screens/SettingsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import userProfile from '../utils/userProfile';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    const complete = await userProfile.isOnboardingComplete();
    setIsOnboardingComplete(complete);
    setIsLoading(false);
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#0a0a0a',
        },
      }}
      screenListeners={{
        state: (e) => {
          // Track screen changes
          const state = e.data.state;
          if (state && state.routes && state.routes[state.index]) {
            const routeName = state.routes[state.index].name;
            Analytics.trackScreenView(routeName);
          }
        },
      }}
      initialRouteName={isOnboardingComplete ? "Start" : "Onboarding"}
    >
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default Navigation;
