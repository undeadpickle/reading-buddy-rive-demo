// Event type definitions for data-driven buddy animations

export type EventCategory = 'reading' | 'achievement' | 'social' | 'special';
export type InputType = 'trigger' | 'boolean' | 'number';

export interface EventAction {
  type: InputType;
  inputName: string;
  value?: boolean | number;
}

export interface EventMapping {
  id: string;
  label: string;
  emoji: string;
  category: EventCategory;
  description: string;
  action: EventAction;
}

export interface EventLogEntry {
  id: string;
  timestamp: Date;
  event: EventMapping;
}
