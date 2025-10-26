import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex gap-3 max-w-[80%]">
        {/* Avatar */}
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center">
          <span className="text-xl">✨</span>
        </div>

        {/* Typing Animation */}
        <div className="bg-white border-2 border-brand-200 rounded-2xl px-5 py-3 flex items-center gap-1">
          <div className="flex gap-1">
            <span className="h-2 w-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="h-2 w-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="h-2 w-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    </div>
  );
}
