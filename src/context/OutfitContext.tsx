import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import localforage from 'localforage';
import { nanoid } from 'nanoid';
import { OutfitItem, OutfitGenerationParams } from '../types/outfit';
import { WardrobeItemMeta, Occasion } from '../types/wardrobe';
import { useWardrobe } from './WardrobeContext';
import { fetchWeather, callGemini, hasKeys } from '@/lib/ai';

interface OutfitContextValue {
  outfits: OutfitItem[];
  generatedOutfits: OutfitItem[];
  generateOutfits: (params: OutfitGenerationParams) => Promise<void>;
  saveOutfit: (outfit: OutfitItem) => Promise<void>;
  deleteOutfit: (id: string) => Promise<void>;
  updateOutfit: (id: string, updates: Partial<OutfitItem>) => Promise<void>;
  rateOutfit: (id: string, rating: number) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  clearGenerated: () => void;
  isGenerating: boolean;
}

const OutfitContext = createContext<OutfitContextValue | null>(null);

const outfitsStore = localforage.createInstance({
  name: 'ai_outfit_planner',
  storeName: 'outfits',
});

// Simple outfit generation algorithm
function generateOutfitCombination(
  items: WardrobeItemMeta[],
  params: OutfitGenerationParams
): WardrobeItemMeta[] {
  const selectedItems: WardrobeItemMeta[] = [];
  
  // Filter items by occasion if specified
  let availableItems = params.occasion === 'casual' || params.occasion === 'brunch'
    ? items
    : items.filter(item => item.occasions.includes(params.occasion as Occasion));
  
  if (availableItems.length === 0) {
    availableItems = items; // Fall back to all items
  }
  
  // For dresses, we need dress + shoes + optional accessories
  const dresses = availableItems.filter(item => item.category === 'dresses');
  if (dresses.length > 0 && Math.random() > 0.5) {
    selectedItems.push(dresses[Math.floor(Math.random() * dresses.length)]);
    
    // Add shoes
    const shoes = availableItems.filter(item => item.category === 'shoes');
    if (shoes.length > 0) {
      selectedItems.push(shoes[Math.floor(Math.random() * shoes.length)]);
    }
    
    // Maybe add accessories
    const accessories = availableItems.filter(item => item.category === 'accessories');
    if (accessories.length > 0 && Math.random() > 0.4) {
      selectedItems.push(accessories[Math.floor(Math.random() * accessories.length)]);
    }
  } else {
    // Build top + bottom combination
    const tops = availableItems.filter(item => item.category === 'tops');
    const bottoms = availableItems.filter(item => item.category === 'bottoms');
    
    if (tops.length > 0) {
      selectedItems.push(tops[Math.floor(Math.random() * tops.length)]);
    }
    if (bottoms.length > 0) {
      selectedItems.push(bottoms[Math.floor(Math.random() * bottoms.length)]);
    }
    
    // Add outerwear based on weather
    if (params.weather && params.weather.temp < 18) {
      const outerwear = availableItems.filter(item => item.category === 'outerwear');
      if (outerwear.length > 0) {
        selectedItems.push(outerwear[Math.floor(Math.random() * outerwear.length)]);
      }
    }
    
    // Add shoes
    const shoes = availableItems.filter(item => item.category === 'shoes');
    if (shoes.length > 0) {
      selectedItems.push(shoes[Math.floor(Math.random() * shoes.length)]);
    }
    
    // Maybe add accessories
    const accessories = availableItems.filter(item => item.category === 'accessories');
    if (accessories.length > 0 && Math.random() > 0.5) {
      selectedItems.push(accessories[Math.floor(Math.random() * accessories.length)]);
    }
  }
  
  return selectedItems;
}

export function OutfitProvider({ children }: { children: React.ReactNode }) {
  const [outfits, setOutfits] = useState<OutfitItem[]>([]);
  const [generatedOutfits, setGeneratedOutfits] = useState<OutfitItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { items } = useWardrobe();

  // Load saved outfits from IndexedDB
  useEffect(() => {
    const loadOutfits = async () => {
      try {
        const saved = await outfitsStore.getItem<OutfitItem[]>('saved_outfits');
        if (saved) {
          setOutfits(saved);
        }
      } catch (error) {
        console.error('Failed to load outfits:', error);
      }
    };
    loadOutfits();
  }, []);

  // Save outfits to IndexedDB whenever they change
  useEffect(() => {
    // Persist the current outfits array. If it's empty we explicitly save
    // an empty array so deletes are persisted (previous logic only saved
    // when length>0 which left stale data in the store).
    try {
      outfitsStore.setItem('saved_outfits', outfits);
    } catch (e) {
      console.warn('Failed to persist outfits:', e);
    }
  }, [outfits]);

  const generateOutfits = useCallback(async (params: OutfitGenerationParams) => {
    setIsGenerating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const generated: OutfitItem[] = [];
      
      // Generate 3-5 outfit variations
      const count = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < count; i++) {
        const outfitItems = generateOutfitCombination(items, params);
        
        if (outfitItems.length > 0) {
          generated.push({
            id: nanoid(),
            name: `${params.occasion} Outfit ${i + 1}`,
            items: outfitItems,
            occasion: params.occasion,
            mood: params.mood,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            // placeholder for LLM notes; may be filled below
            notes: undefined,
          });
        }
      }

      // If API keys are present, attempt to fetch weather and call Gemini to enhance results
      if (hasKeys()) {
        try {
          // fetch weather summary if params.weather provided
          const weather = params.weather ? { temp: params.weather.temp, condition: params.weather.condition } : null;
          let weatherObj = null;
          if (weather && (weather.temp !== undefined || weather.condition)) {
            // we already have weather, but try to enrich via OpenWeather if key present
            weatherObj = await fetchWeather(undefined);
          }

          // build a simple prompt for the LLM
          const labels = generated
            .flatMap(o => o.items.map(it => it.category))
            .slice(0, 10)
            .join(', ');

          const promptParts = [
            'You are a helpful fashion assistant. Given detected wardrobe categories and an occasion, propose 3 short outfit descriptions (title + 1-2 sentence rationale).',
            `Occasion: ${params.occasion}`,
            params.mood ? `Mood: ${params.mood}` : '',
            weatherObj?.summary ? `Weather: ${weatherObj.summary}` : (params.weather ? `Weather: ${params.weather.temp}C ${params.weather.condition}` : ''),
            `Available categories/examples: ${labels || 'tops, bottoms, shoes, accessories, outerwear'}`,
            'Return concise suggestions separated by blank lines.'
          ];

          const prompt = promptParts.filter(Boolean).join('\n');
          const llm = await callGemini(prompt);
          if (llm) {
            // Attach the same LLM explanation to each generated outfit as notes
            const withNotes = generated.map((g, idx) => ({ ...g, notes: llm }));
            setGeneratedOutfits(withNotes);
          } else {
            setGeneratedOutfits(generated);
          }
        } catch (e) {
          console.warn('LLM enhancement failed', e);
          setGeneratedOutfits(generated);
        }
      } else {
        setGeneratedOutfits(generated);
      }
    } finally {
      setIsGenerating(false);
    }
  }, [items]);

  const saveOutfit = useCallback(async (outfit: OutfitItem) => {
    const newOutfit = {
      ...outfit,
      id: outfit.id || nanoid(),
      createdAt: outfit.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
    
    setOutfits(prev => [...prev, newOutfit]);
  }, []);

  const deleteOutfit = useCallback(async (id: string) => {
    setOutfits(prev => prev.filter(o => o.id !== id));
  }, []);

  const updateOutfit = useCallback(async (id: string, updates: Partial<OutfitItem>) => {
    setOutfits(prev =>
      prev.map(outfit =>
        outfit.id === id
          ? { ...outfit, ...updates, updatedAt: Date.now() }
          : outfit
      )
    );
  }, []);

  const rateOutfit = useCallback(async (id: string, rating: number) => {
    setOutfits(prev =>
      prev.map(outfit =>
        outfit.id === id
          ? { ...outfit, rating, updatedAt: Date.now() }
          : outfit
      )
    );
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    setOutfits(prev =>
      prev.map(outfit =>
        outfit.id === id
          ? { ...outfit, isFavorite: !outfit.isFavorite, updatedAt: Date.now() }
          : outfit
      )
    );
  }, []);

  const clearGenerated = useCallback(() => {
    setGeneratedOutfits([]);
  }, []);

  return (
    <OutfitContext.Provider
      value={{
        outfits,
        generatedOutfits,
        generateOutfits,
        saveOutfit,
        deleteOutfit,
        updateOutfit,
        rateOutfit,
        toggleFavorite,
        clearGenerated,
        isGenerating,
      }}
    >
      {children}
    </OutfitContext.Provider>
  );
}

export function useOutfits() {
  const context = useContext(OutfitContext);
  if (!context) {
    throw new Error('useOutfits must be used within OutfitProvider');
  }
  return context;
}
