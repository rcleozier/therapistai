import storyLineManager from './storyLineManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GAME_STATE_KEY_PREFIX = 'therapistai_game_state_';

class StoryEngine {
  constructor() {
    this.story = null;
    this.storyLineId = null;
    this.currentNodeId = null;
    this.visitedNodes = new Set();
    this.messageHistory = [];
    this.choices = [];
  }

  // Get the storage key for a specific story line
  getGameStateKey(storyLineId) {
    return `${GAME_STATE_KEY_PREFIX}${storyLineId}`;
  }

  // Load a story line
  loadStoryLine(storyLineId) {
    const storyData = storyLineManager.getStoryLine(storyLineId);
    if (!storyData) {
      console.error(`Story line ${storyLineId} not found`);
      return false;
    }
    this.story = storyData;
    this.storyLineId = storyLineId;
    return true;
  }

  // Initialize the story
  start(storyLineId) {
    // Load the story line if not already loaded or if different
    if (!this.story || this.storyLineId !== storyLineId) {
      if (!this.loadStoryLine(storyLineId)) {
        return null;
      }
    }
    
    this.currentNodeId = this.story.start_node;
    this.visitedNodes.clear();
    this.messageHistory = [];
    this.choices = [];
    return this.getCurrentNode();
  }

  // Get the current node
  getCurrentNode() {
    if (!this.currentNodeId) {
      return null;
    }

    const node = this.story.nodes[this.currentNodeId];
    if (!node) {
      console.error(`Node ${this.currentNodeId} not found`);
      return null;
    }

    this.visitedNodes.add(this.currentNodeId);
    const rawChoices = node.choices || [];
    // Limit the number of responses per thread to a maximum of three
    const limitedChoices = rawChoices.slice(0, 3);
    
    return {
      nodeId: this.currentNodeId,
      messages: node.messages || [],
      choices: limitedChoices,
      isEnding: limitedChoices.length === 0,
      // Interactive elements
      interactive: node.interactive || null,
    };
  }

  // Make a choice and move to the next node
  makeChoice(choiceId) {
    const currentNode = this.getCurrentNode();
    if (!currentNode) {
      return null;
    }

    const choice = currentNode.choices.find(c => c.id === choiceId);
    if (!choice) {
      console.error(`Choice ${choiceId} not found in current node`);
      return null;
    }

    // Move to the next node
    this.currentNodeId = choice.next;
    
    // If next node doesn't exist, we've reached an ending
    if (!this.story.nodes[this.currentNodeId]) {
      console.error(`Next node ${choice.next} not found`);
      return null;
    }

    return this.getCurrentNode();
  }

  // Check if we're at an ending
  isAtEnding() {
    const node = this.getCurrentNode();
    return node && node.isEnding;
  }

  // Reset the story
  reset(storyLineId) {
    if (storyLineId && storyLineId !== this.storyLineId) {
      return this.start(storyLineId);
    }
    // Use current story line if no ID provided
    if (!this.storyLineId) {
      console.error('Cannot reset: no story line loaded');
      return null;
    }
    return this.start(this.storyLineId);
  }

  // Get story metadata
  getStoryInfo() {
    if (!this.story) {
      return null;
    }
    return {
      title: this.story.title,
      storyId: this.story.story_id,
      storyLineId: this.storyLineId,
    };
  }

  // Save game state
  async saveGameState(conversationHistory = null) {
    if (!this.storyLineId) {
      console.error('Cannot save game state: no story line loaded');
      return false;
    }
    
    try {
      const gameState = {
        storyLineId: this.storyLineId,
        currentNodeId: this.currentNodeId,
        visitedNodes: Array.from(this.visitedNodes),
        messageHistory: this.messageHistory,
        choices: this.choices,
        conversationHistory: conversationHistory || [], // Save full conversation thread
        timestamp: Date.now(),
      };
      const key = this.getGameStateKey(this.storyLineId);
      await AsyncStorage.setItem(key, JSON.stringify(gameState));
      return true;
    } catch (error) {
      console.error('Error saving game state:', error);
      return false;
    }
  }

  // Check if there's a saved game state for a specific story line
  async hasSavedGameState(storyLineId) {
    try {
      const key = this.getGameStateKey(storyLineId);
      const savedState = await AsyncStorage.getItem(key);
      return savedState !== null;
    } catch (error) {
      console.error('Error checking for saved game state:', error);
      return false;
    }
  }

  // Load game state for a specific story line
  async loadGameState(storyLineId) {
    if (!storyLineId) {
      storyLineId = this.storyLineId;
    }
    
    if (!storyLineId) {
      console.error('Cannot load game state: no story line ID provided');
      return null;
    }
    
    try {
      const key = this.getGameStateKey(storyLineId);
      const savedState = await AsyncStorage.getItem(key);
      if (!savedState) {
        return null;
      }
      const gameState = JSON.parse(savedState);
      
      // Load the story line if different
      if (gameState.storyLineId && gameState.storyLineId !== this.storyLineId) {
        if (!this.loadStoryLine(gameState.storyLineId)) {
          return null;
        }
      }
      
      // Restore state
      this.currentNodeId = gameState.currentNodeId;
      this.visitedNodes = new Set(gameState.visitedNodes || []);
      this.messageHistory = gameState.messageHistory || [];
      this.choices = gameState.choices || [];
      
      // Return conversation history if it exists (for backward compatibility)
      if (!gameState.conversationHistory && gameState.messageHistory) {
        gameState.conversationHistory = gameState.messageHistory;
      }
      
      return gameState;
    } catch (error) {
      console.error('Error loading game state:', error);
      return null;
    }
  }

  // Continue from saved state
  async continue(storyLineId) {
    if (!storyLineId) {
      storyLineId = this.storyLineId;
    }
    
    if (!storyLineId) {
      console.error('Cannot continue: no story line ID provided');
      return null;
    }
    
    const savedState = await this.loadGameState(storyLineId);
    if (!savedState || !this.currentNodeId) {
      // No saved state, start fresh
      return this.start(storyLineId);
    }
    return this.getCurrentNode();
  }

  // Clear saved game state for a specific story line
  async clearGameState(storyLineId) {
    if (!storyLineId) {
      storyLineId = this.storyLineId;
    }
    
    if (!storyLineId) {
      console.error('Cannot clear game state: no story line ID provided');
      return false;
    }
    
    try {
      const key = this.getGameStateKey(storyLineId);
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error clearing game state:', error);
      return false;
    }
  }
}

export default new StoryEngine();

