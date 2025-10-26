export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  outfitSuggestions?: string[]; // outfit IDs
  wardrobeItems?: string[]; // wardrobe item IDs
}

export interface ChatContext {
  wardrobeItemCount: number;
  savedOutfitCount: number;
  recentOccasions: string[];
  favoriteColors: string[];
}

export const QUICK_ACTIONS = [
  { id: 'suggest-outfit', label: '✨ Suggest an outfit', prompt: 'Can you suggest an outfit for me?' },
  { id: 'wardrobe-tips', label: '💡 Wardrobe tips', prompt: 'Give me tips to improve my wardrobe' },
  { id: 'color-advice', label: '🎨 Color matching', prompt: 'What colors go well together in my wardrobe?' },
  { id: 'occasion-help', label: '👗 What to wear', prompt: 'What should I wear for a special occasion?' },
  { id: 'style-analysis', label: '📊 Analyze my style', prompt: 'Analyze my wardrobe and tell me about my style' },
  { id: 'shopping-advice', label: '🛍️ Shopping advice', prompt: 'What should I add to my wardrobe?' },
];
