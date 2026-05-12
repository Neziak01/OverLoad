export interface Sport {
  _id: string;
  name: string;
  slug: string;
  color: string; // hex
  emoji: string;
  order: number;
  createdAt: string;
}

export interface GenericActivity {
  _id: string;
  sportSlug: string;
  date: string;
  duration?: number;
  notes?: string;
  createdAt: string;
}

export interface CreateGenericActivity {
  sportSlug: string;
  date: string;
  duration?: number;
  notes?: string;
}

export const COLOR_OPTIONS = [
  { id: 'rose',    hex: '#f43f5e', light: '#ffe4e6' },
  { id: 'orange',  hex: '#f97316', light: '#ffedd5' },
  { id: 'pink',    hex: '#ec4899', light: '#fce7f3' },
  { id: 'indigo',  hex: '#6366f1', light: '#e0e7ff' },
  { id: 'cyan',    hex: '#06b6d4', light: '#cffafe' },
  { id: 'lime',    hex: '#84cc16', light: '#ecfccb' },
  { id: 'fuchsia', hex: '#d946ef', light: '#fae8ff' },
  { id: 'red',     hex: '#ef4444', light: '#fee2e2' },
];

export const EMOJI_OPTIONS = [
  '🚴', '⛷️', '🏀', '⚽', '🎾', '🏋️', '🤸', '🧘',
  '🏊', '🥊', '🤾', '🏌️', '🛹', '🤺', '🏇', '🧗',
  '🎿', '🏄', '🤽', '🚣', '🏸', '🥋', '⛸️', '🎯',
];
