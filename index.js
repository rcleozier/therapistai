import { registerRootComponent } from 'expo';
import * as Sentry from '@sentry/react-native';
import App from './App';

// Initialize Sentry
Sentry.init({
  dsn: 'https://63e3eebe9ae5a414fb4fe12082915b8e@o4505802780966912.ingest.us.sentry.io/4510418358763520',
  enableInExpoDevelopment: false, // Disable in development
  debug: false, // Set to true to see debug logs
  environment: __DEV__ ? 'development' : 'production',
  tracesSampleRate: 1.0, // Capture 100% of transactions for performance monitoring
});

registerRootComponent(App);
