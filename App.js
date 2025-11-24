import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import Navigation from "./navigation/Navigation";

function App() {
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
}

// Wrap App with Sentry for error boundary
export default Sentry.wrap(App);
