import { WardrobeItemMeta } from './wardrobe';

export type Mood = 'professional' | 'casual' | 'elegant' | 'sporty' | 'edgy' | 'romantic';

export interface OutfitGenerationParams {
  occasion: string;
  mood?: Mood;
  weather?: {
    temp: number;
    condition: string;
  };
  colors?: string[];
}

export interface OutfitItem {
  id: string;
  name: string;
  items: WardrobeItemMeta[];
  occasion: string;
  mood?: Mood;
  rating?: number;
  createdAt: number;
  updatedAt: number;
  notes?: string;
  isFavorite?: boolean;
}

export const MOODS: { value: Mood; label: string; emoji: string }[] = [
  { value: 'professional', label: 'Professional', emoji: '💼' },
  { value: 'casual', label: 'Casual', emoji: '😊' },
  { value: 'elegant', label: 'Elegant', emoji: '✨' },
  { value: 'sporty', label: 'Sporty', emoji: '⚡' },
  { value: 'edgy', label: 'Edgy', emoji: '🎸' },
  { value: 'romantic', label: 'Romantic', emoji: '💕' },
];

export const OCCASIONS = [
  { value: 'work', label: 'Work', icon: '💼' },
  { value: 'casual', label: 'Casual Day Out', icon: '☀️' },
  { value: 'date', label: 'Date Night', icon: '🌹' },
  { value: 'party', label: 'Party', icon: '🎉' },
  { value: 'formal', label: 'Formal Event', icon: '🎩' },
  { value: 'gym', label: 'Gym/Sports', icon: '💪' },
  { value: 'travel', label: 'Travel', icon: '✈️' },
  { value: 'brunch', label: 'Brunch', icon: '🥂' },
];
