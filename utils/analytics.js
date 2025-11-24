import { Platform, AppState } from "react-native";
import Aptabase, { trackEvent } from "@aptabase/react-native";

const EVENTS = {
  SESSION_START: "session_start",
  SESSION_END: "session_end",
  SCREEN_VIEW: "screen_view",
  GAME_START: "game_start",
  GAME_RESTART: "game_restart",
  GAME_CHOICE: "game_choice",
  GAME_NODE_VISIT: "game_node_visit",
  GAME_ENDING_REACHED: "game_ending_reached",
};

const isNative = Platform.OS === "ios" || Platform.OS === "android";

// Session tracking state
let sessionStartTime = null;
let sessionId = null;
let appStateSubscription = null;
let sessionDurationInterval = null;

// Generate unique session ID
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Calculate session duration in seconds
const getSessionDuration = () => {
  if (!sessionStartTime) return 0;
  return Math.floor((Date.now() - sessionStartTime) / 1000);
};

export const Analytics = {
  initialize() {
    if (isNative) {
      try {
        Aptabase.init("A-US-1946704640");
        this.startSession();
        this.setupAppStateListener();
      } catch (error) {
        console.error("Error initializing Aptabase:", error);
      }
    }
  },

  startSession() {
    if (!isNative || sessionStartTime) return;

    sessionStartTime = Date.now();
    sessionId = generateSessionId();

    try {
      trackEvent(EVENTS.SESSION_START, {
        session_id: sessionId,
        timestamp: new Date().toISOString(),
        platform: Platform.OS,
      });
    } catch (error) {
      console.error("Error tracking session start:", error);
    }
  },

  endSession() {
    if (!isNative || !sessionStartTime) return;

    const duration = getSessionDuration();

    try {
      trackEvent(EVENTS.SESSION_END, {
        session_id: sessionId,
        duration_seconds: duration,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error tracking session end:", error);
    }

    // Clear session state
    sessionStartTime = null;
    sessionId = null;

    // Clear interval if it exists
    if (sessionDurationInterval) {
      clearInterval(sessionDurationInterval);
      sessionDurationInterval = null;
    }
  },

  setupAppStateListener() {
    if (!isNative) return;

    appStateSubscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active" && !sessionStartTime) {
        // App came to foreground - start new session
        this.startSession();
      } else if (nextAppState === "background" || nextAppState === "inactive") {
        // App went to background - end current session
        this.endSession();
      }
    });
  },

  getCurrentSessionId() {
    return sessionId;
  },

  getSessionDuration() {
    return getSessionDuration();
  },

  trackScreenView(screenName) {
    if (isNative) {
      try {
        trackEvent(EVENTS.SCREEN_VIEW, {
          screen: screenName,
          session_id: sessionId,
          session_duration: getSessionDuration(),
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error tracking screen view:", error);
      }
    }
  },

  // Game-specific tracking
  trackGameStart() {
    if (isNative) {
      try {
        trackEvent(EVENTS.GAME_START, {
          session_id: sessionId,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error tracking game start:", error);
      }
    }
  },

  trackGameRestart() {
    if (isNative) {
      try {
        trackEvent(EVENTS.GAME_RESTART, {
          session_id: sessionId,
          session_duration: getSessionDuration(),
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error tracking game restart:", error);
      }
    }
  },

  trackGameChoice(choiceId, choiceLabel, currentNodeId) {
    if (isNative) {
      try {
        trackEvent(EVENTS.GAME_CHOICE, {
          choice_id: choiceId,
          choice_label: choiceLabel,
          current_node_id: currentNodeId,
          session_id: sessionId,
          session_duration: getSessionDuration(),
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error tracking game choice:", error);
      }
    }
  },

  trackGameNodeVisit(nodeId, nodeType) {
    if (isNative) {
      try {
        trackEvent(EVENTS.GAME_NODE_VISIT, {
          node_id: nodeId,
          node_type: nodeType || "story",
          session_id: sessionId,
          session_duration: getSessionDuration(),
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error tracking node visit:", error);
      }
    }
  },

  trackGameEnding(endingName, totalChoices, totalNodes) {
    if (isNative) {
      try {
        trackEvent(EVENTS.GAME_ENDING_REACHED, {
          ending_name: endingName,
          total_choices: totalChoices,
          total_nodes_visited: totalNodes,
          session_id: sessionId,
          session_duration: getSessionDuration(),
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error tracking game ending:", error);
      }
    }
  },

  // Cleanup method
  cleanup() {
    if (appStateSubscription) {
      appStateSubscription.remove();
      appStateSubscription = null;
    }
    this.endSession();
  },
};
