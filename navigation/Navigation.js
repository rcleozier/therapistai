import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Analytics } from '../utils/analytics';
import StartScreen from '../screens/StartScreen';
import GameScreen from '../screens/GameScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
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
      initialRouteName="Start"
    >
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default Navigation;
