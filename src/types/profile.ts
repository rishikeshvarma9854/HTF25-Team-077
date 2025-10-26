export interface UserProfile {
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
  style?: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  defaultOccasion: string;
  preferredColors: string[];
  measurementUnit: 'metric' | 'imperial';
  language: 'en' | 'es' | 'fr' | 'de';
}

export interface UsageStatistics {
  totalWardrobeItems: number;
  totalOutfits: number;
  totalChats: number;
  outfitsGenerated: number;
  outfitsSaved: number;
  favoriteOccasion?: string;
  mostUsedColors: string[];
  wardrobeValue?: number;
  itemsAddedThisMonth: number;
  outfitsCreatedThisMonth: number;
  lastActive: number;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  notifications: true,
  defaultOccasion: 'casual',
  preferredColors: [],
  measurementUnit: 'metric',
  language: 'en',
};
