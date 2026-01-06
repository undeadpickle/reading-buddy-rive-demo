import type { EventMapping, EventCategory } from '../types/events';
import { TRIGGERS, INPUTS } from './constants';

// Event-to-animation mappings
// Maps in-app events to Rive state machine actions
export const EVENT_MAPPINGS: Record<string, EventMapping> = {
  // Reading milestones (trigger celebrations)
  'reading-5min': {
    id: 'reading-5min',
    label: '5 min read!',
    emoji: '📖',
    category: 'reading',
    description: 'Read for 5 minutes',
    action: { type: 'trigger', inputName: TRIGGERS.WAVE },
  },
  'reading-10min': {
    id: 'reading-10min',
    label: '10 min read!',
    emoji: '📚',
    category: 'reading',
    description: 'Read for 10 minutes',
    action: { type: 'trigger', inputName: TRIGGERS.JUMP },
  },
  'reading-15min': {
    id: 'reading-15min',
    label: '15 min read!',
    emoji: '🌟',
    category: 'reading',
    description: 'Read for 15 minutes',
    action: { type: 'trigger', inputName: TRIGGERS.WAVE },
  },
  'reading-20min': {
    id: 'reading-20min',
    label: '20 min streak!',
    emoji: '🔥',
    category: 'reading',
    description: 'Read for 20 minutes straight',
    action: { type: 'trigger', inputName: TRIGGERS.JUMP },
  },

  // Achievement events
  '3-star-book': {
    id: '3-star-book',
    label: '3-Star Book!',
    emoji: '⭐',
    category: 'achievement',
    description: 'Completed book with 3 stars',
    action: { type: 'trigger', inputName: TRIGGERS.JUMP },
  },
  'streak-7-days': {
    id: 'streak-7-days',
    label: '7-Day Streak!',
    emoji: '🏆',
    category: 'achievement',
    description: 'Read 7 days in a row',
    action: { type: 'trigger', inputName: TRIGGERS.JUMP },
  },
  'level-up': {
    id: 'level-up',
    label: 'Level Up!',
    emoji: '⬆️',
    category: 'achievement',
    description: 'Reached a new level',
    action: { type: 'trigger', inputName: TRIGGERS.JUMP },
  },

  // Social events
  'kudos-received': {
    id: 'kudos-received',
    label: 'Got Kudos!',
    emoji: '💌',
    category: 'social',
    description: 'Parent sent encouragement',
    action: { type: 'trigger', inputName: TRIGGERS.WAVE },
  },
  'new-badge': {
    id: 'new-badge',
    label: 'New Badge!',
    emoji: '🎖️',
    category: 'social',
    description: 'Earned a new badge',
    action: { type: 'trigger', inputName: TRIGGERS.JUMP },
  },

  // Boolean inputs (prepared for future Rive updates)
  'start-reading': {
    id: 'start-reading',
    label: 'Start Reading',
    emoji: '▶️',
    category: 'special',
    description: 'Begin reading session',
    action: { type: 'boolean', inputName: INPUTS.IS_READING, value: true },
  },
  'stop-reading': {
    id: 'stop-reading',
    label: 'Stop Reading',
    emoji: '⏹️',
    category: 'special',
    description: 'End reading session',
    action: { type: 'boolean', inputName: INPUTS.IS_READING, value: false },
  },

  // Number inputs (prepared for future Rive updates)
  'excitement-low': {
    id: 'excitement-low',
    label: 'Calm',
    emoji: '😌',
    category: 'special',
    description: 'Set excitement to 25',
    action: { type: 'number', inputName: INPUTS.EXCITEMENT_LEVEL, value: 25 },
  },
  'excitement-high': {
    id: 'excitement-high',
    label: 'Excited!',
    emoji: '🎉',
    category: 'special',
    description: 'Set excitement to 100',
    action: { type: 'number', inputName: INPUTS.EXCITEMENT_LEVEL, value: 100 },
  },
};

// Helper to get events by category
export function getEventsByCategory(category: EventCategory): EventMapping[] {
  return Object.values(EVENT_MAPPINGS).filter(
    (event) => event.category === category
  );
}

// Quick events shown in the UI (excludes timer-triggered milestones)
export const QUICK_EVENTS = {
  reading: ['reading-5min', 'reading-10min', 'reading-20min'],
  achievement: ['3-star-book', 'streak-7-days', 'level-up'],
  social: ['kudos-received', 'new-badge'],
};

// Category display config
export const CATEGORY_CONFIG: Record<
  EventCategory,
  { label: string; bgColor: string; borderColor: string }
> = {
  reading: { label: 'Reading', bgColor: '#e3f2fd', borderColor: '#2196f3' },
  achievement: {
    label: 'Achievement',
    bgColor: '#fff8e1',
    borderColor: '#ffc107',
  },
  social: { label: 'Social', bgColor: '#fce4ec', borderColor: '#e91e63' },
  special: { label: 'Special', bgColor: '#e8f5e9', borderColor: '#4caf50' },
};
