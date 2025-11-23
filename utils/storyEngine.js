import { storyData } from '../data/storyData';

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
}

export default new StoryEngine();

