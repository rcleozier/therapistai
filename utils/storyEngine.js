import { storyData } from '../data/storyData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GAME_STATE_KEY = 'therapistai_game_state';

class StoryEngine {
  constructor() {
    this.story = storyData;
    this.currentNodeId = null;
    this.visitedNodes = new Set();
    this.messageHistory = [];
    this.choices = [];
  }

  // Initialize the story
  start() {
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
    
    return {
      nodeId: this.currentNodeId,
      messages: node.messages || [],
      choices: node.choices || [],
      isEnding: (node.choices || []).length === 0,
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
  reset() {
    return this.start();
  }

  // Get story metadata
  getStoryInfo() {
    return {
      title: this.story.title,
      storyId: this.story.story_id,
    };
  }

  // Save game state
  async saveGameState() {
    try {
      const gameState = {
        currentNodeId: this.currentNodeId,
        visitedNodes: Array.from(this.visitedNodes),
        messageHistory: this.messageHistory,
        choices: this.choices,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
      return true;
    } catch (error) {
      console.error('Error saving game state:', error);
      return false;
    }
  }

  // Check if there's a saved game state (without loading it)
  async hasSavedGameState() {
    try {
      const savedState = await AsyncStorage.getItem(GAME_STATE_KEY);
      return savedState !== null;
    } catch (error) {
      console.error('Error checking for saved game state:', error);
      return false;
    }
  }

  // Load game state
  async loadGameState() {
    try {
      const savedState = await AsyncStorage.getItem(GAME_STATE_KEY);
      if (!savedState) {
        return null;
      }
      const gameState = JSON.parse(savedState);
      
      // Restore state
      this.currentNodeId = gameState.currentNodeId;
      this.visitedNodes = new Set(gameState.visitedNodes || []);
      this.messageHistory = gameState.messageHistory || [];
      this.choices = gameState.choices || [];
      
      return gameState;
    } catch (error) {
      console.error('Error loading game state:', error);
      return null;
    }
  }

  // Continue from saved state
  async continue() {
    const savedState = await this.loadGameState();
    if (!savedState || !this.currentNodeId) {
      // No saved state, start fresh
      return this.start();
    }
    return this.getCurrentNode();
  }

  // Clear saved game state
  async clearGameState() {
    try {
      await AsyncStorage.removeItem(GAME_STATE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing game state:', error);
      return false;
    }
  }
}

export default new StoryEngine();

