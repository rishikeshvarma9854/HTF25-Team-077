import React from 'react';
import { useChat } from '../context/ChatContext';
import ChatWindow from '../components/chat/ChatWindow';
import QuickActions from '../components/chat/QuickActions';
import Button from '../components/common/Button';

export default function Chat() {
  const { sendMessage, clearHistory, messages } = useChat();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-900 mb-2">
              AI Style Assistant
            </h1>
            <p className="text-brand-600 text-lg">
              Get personalized fashion advice and outfit recommendations
            </p>
          </div>
          {messages.length > 1 && (
            <Button
              onClick={clearHistory}
              variant="outline"
              className="text-sm"
            >
              Clear Chat
            </Button>
          )}
        </div>
      </div>

      {/* Quick Actions - Show only if chat is new */}
      {messages.length <= 1 && (
        <div className="flex-shrink-0 mb-6">
          <QuickActions onAction={sendMessage} />
        </div>
      )}

      {/* Chat Window */}
      <div className="flex-1 bg-brand-50 rounded-2xl border-2 border-brand-200 overflow-hidden flex flex-col min-h-0">
        <ChatWindow />
      </div>
    </div>
  );
}
