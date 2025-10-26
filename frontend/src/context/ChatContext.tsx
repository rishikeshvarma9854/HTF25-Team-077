import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import localforage from 'localforage';
import { nanoid } from 'nanoid';
import { ChatMessage, ChatContext } from '../types/chat';
import { useWardrobe } from './WardrobeContext';
import { useOutfits } from './OutfitContext';

interface ChatContextValue {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearHistory: () => void;
}

const ChatContextAPI = createContext<ChatContextValue | null>(null);

const chatStore = localforage.createInstance({
  name: 'ai_outfit_planner',
  storeName: 'chat_history',
});

// AI response generator based on user's wardrobe context
function generateAIResponse(
  userMessage: string,
  context: ChatContext
): string {
  const msg = userMessage.toLowerCase();
  
  // Outfit suggestions
  if (msg.includes('suggest') && msg.includes('outfit')) {
    return `I'd love to help you create an outfit! Based on your wardrobe of ${context.wardrobeItemCount} items, I can suggest combinations for any occasion. What event are you dressing for? Is it casual, formal, a party, or something else?`;
  }
  
  // Wardrobe tips
  if (msg.includes('tip') || msg.includes('improve')) {
    if (context.wardrobeItemCount < 10) {
      return `You're building a great foundation! With ${context.wardrobeItemCount} items, I'd recommend adding versatile basics like a white button-down shirt, well-fitted jeans, and neutral shoes. These pieces can mix and match with almost everything!`;
    }
    return `Your wardrobe looks good with ${context.wardrobeItemCount} items! Here are some tips:\n\n1. **Invest in quality basics** - They're the foundation of great outfits\n2. **Follow the rule of thirds** - Mix colors in 60-30-10 proportions\n3. **Organize by color** - It makes outfit planning easier\n4. **Try the one-in-one-out rule** - Keep your wardrobe curated and fresh`;
  }
  
  // Color advice
  if (msg.includes('color')) {
    const colorTips = context.favoriteColors.length > 0
      ? `I see you love ${context.favoriteColors.join(', ')}! These are great choices. `
      : '';
    
    return `${colorTips}Here are some universal color pairing tips:\n\n🎨 **Classic Combos:**\n- Navy + White + Tan\n- Black + White + Gold\n- Gray + Pink + White\n\n💡 **Pro Tip:** Neutrals (black, white, gray, beige) go with everything and make colorful pieces pop!`;
  }
  
  // Occasion advice
  if (msg.includes('wear') || msg.includes('occasion') || msg.includes('event')) {
    return `I can help you dress for any occasion! Tell me more about the event:\n\n• **Type:** Casual, formal, business, party, date?\n• **Weather:** Hot, cold, rainy?\n• **Time:** Morning, afternoon, evening?\n• **Vibe:** Professional, fun, elegant, relaxed?\n\nThe more details you share, the better I can help!`;
  }
  
  // Style analysis
  if (msg.includes('analyz') || msg.includes('style')) {
    if (context.wardrobeItemCount === 0) {
      return `I don't see any items in your wardrobe yet! Start by uploading photos of your clothes in the Wardrobe section, and I'll be able to analyze your personal style and give you tailored advice.`;
    }
    
    const occasions = context.recentOccasions.length > 0
      ? `I notice you often dress for ${context.recentOccasions.join(', ')} occasions. `
      : '';
    
    return `${occasions}Based on your ${context.wardrobeItemCount} wardrobe items:\n\n✨ **Your Style Profile:**\nYou have a balanced wardrobe that gives you flexibility. I'd categorize your style as versatile and practical.\n\n💡 **Recommendations:**\n- Keep adding pieces that match your lifestyle\n- Don't be afraid to experiment with new styles\n- Quality over quantity - invest in timeless pieces`;
  }
  
  // Shopping advice
  if (msg.includes('shop') || msg.includes('buy') || msg.includes('add')) {
    return `Smart shopping is key to a great wardrobe! Here's what I recommend:\n\n🛍️ **Essential Additions:**\n1. A versatile blazer (pairs with everything)\n2. Quality shoes in neutral colors\n3. A statement piece that reflects your personality\n4. Seasonal items for weather changes\n\n💰 **Shopping Tips:**\n- Build around what you already own\n- Choose pieces that work with 3+ existing items\n- Invest in quality for items you'll wear often`;
  }
  
  // General greeting
  if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
    return `Hello! 👋 I'm your personal style assistant. I can help you with:\n\n✨ Outfit suggestions\n🎨 Color coordination\n💡 Wardrobe tips\n👗 Occasion-based advice\n📊 Style analysis\n\nWhat would you like to explore today?`;
  }
  
  // Thank you
  if (msg.includes('thank')) {
    return `You're welcome! I'm always here to help with your style questions. Feel free to ask me anything about fashion, outfits, or your wardrobe! 😊`;
  }
  
  // Default helpful response
  return `That's an interesting question! I'm here to help with style and outfit advice. You can ask me about:\n\n• Outfit suggestions for any occasion\n• Color matching and coordination\n• Wardrobe organization tips\n• What to wear for specific events\n• Style analysis and recommendations\n\nWhat would you like to know?`;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { items } = useWardrobe();
  const { outfits } = useOutfits();

  // Load chat history from IndexedDB
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const saved = await chatStore.getItem<ChatMessage[]>('messages');
        if (saved && saved.length > 0) {
          setMessages(saved);
        } else {
          // Welcome message
          const welcomeMessage: ChatMessage = {
            id: nanoid(),
            role: 'assistant',
            content: `👋 Welcome to your AI Style Assistant!\n\nI'm here to help you create amazing outfits, give fashion advice, and make the most of your wardrobe. You currently have ${items.length} items in your wardrobe.\n\nHow can I help you today?`,
            timestamp: Date.now(),
          };
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };
    loadHistory();
  }, [items.length]);

  // Save messages to IndexedDB whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      chatStore.setItem('messages', messages);
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      // Add user message
      const userMessage: ChatMessage = {
        id: nanoid(),
        role: 'user',
        content,
        timestamp: Date.now(),
      };
      
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      // Simulate AI thinking delay
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

      // Generate context for AI
      const context: ChatContext = {
        wardrobeItemCount: items.length,
        savedOutfitCount: outfits.length,
        recentOccasions: [...new Set(outfits.slice(-5).map((o) => o.occasion))],
        favoriteColors: [],
      };

      // Generate AI response
      const aiResponse = generateAIResponse(content, context);
      
      const assistantMessage: ChatMessage = {
        id: nanoid(),
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    },
    [items.length, outfits]
  );

  const clearHistory = useCallback(() => {
    const welcomeMessage: ChatMessage = {
      id: nanoid(),
      role: 'assistant',
      content: `Chat history cleared! How can I help you today?`,
      timestamp: Date.now(),
    };
    setMessages([welcomeMessage]);
    chatStore.removeItem('messages');
  }, []);

  return (
    <ChatContextAPI.Provider
      value={{
        messages,
        isTyping,
        sendMessage,
        clearHistory,
      }}
    >
      {children}
    </ChatContextAPI.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContextAPI);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}
