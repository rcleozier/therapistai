/**
 * Story Line Manager
 * 
 * Manages loading and accessing different story lines.
 * Each story line is a self-contained narrative with its own nodes and structure.
 */

// Import all story lines
import { storyData as storyLine1 } from '../data/storyLine1';
import { storyData as storyLine2 } from '../data/storyLine2';
import { storyData as storyLine3 } from '../data/storyLine3';

// Registry of all available story lines
const STORY_LINES = {
  'therapy_ai_session_1': {
    id: 'therapy_ai_session_1',
    title: 'The First Session',
    description: 'Your initial encounter with the AI therapist.',
    data: storyLine1,
  },
  'therapy_ai_session_2': {
    id: 'therapy_ai_session_2',
    title: 'The Second Session',
    description: 'A different path. A different outcome.',
    data: storyLine2,
  },
  'therapy_ai_session_3': {
    id: 'therapy_ai_session_3',
    title: 'The Third Session',
    description: "You wake up. The app is already open. You don't remember opening it.",
    data: storyLine3,
  },
};

/**
 * Get all available story lines
 * @returns {Array} Array of story line metadata
 */
export const getAvailableStoryLines = () => {
  return Object.values(STORY_LINES).map(({ id, title, description }) => ({
    id,
    title,
    description,
  }));
};

/**
 * Get a specific story line by ID
 * @param {string} storyLineId - The ID of the story line to load
 * @returns {Object|null} The story line data or null if not found
 */
export const getStoryLine = (storyLineId) => {
  const storyLine = STORY_LINES[storyLineId];
  if (!storyLine) return null;
  return storyLine.data;
};

/**
 * Get story line metadata
 * @param {string} storyLineId - The ID of the story line
 * @returns {Object|null} Story line metadata or null if not found
 */
export const getStoryLineInfo = (storyLineId) => {
  const storyLine = STORY_LINES[storyLineId];
  if (!storyLine) return null;
  
  return {
    id: storyLine.id,
    title: storyLine.title,
    description: storyLine.description,
  };
};

/**
 * Check if a story line exists
 * @param {string} storyLineId - The ID to check
 * @returns {boolean} True if the story line exists
 */
export const storyLineExists = (storyLineId) => {
  return storyLineId in STORY_LINES;
};

export default {
  getAvailableStoryLines,
  getStoryLine,
  getStoryLineInfo,
  storyLineExists,
};

