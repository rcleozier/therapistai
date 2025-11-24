import React, { useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { Analytics } from "./utils/analytics";
import Navigation from "./navigation/Navigation";

function App() {
  useEffect(() => {
    // Initialize analytics and start session tracking
    Analytics.initialize();
    
    // Cleanup on unmount
    return () => {
      Analytics.cleanup();
    };
  }, []);

  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
}

// Wrap App with Sentry for error boundary
export default Sentry.wrap(App);
