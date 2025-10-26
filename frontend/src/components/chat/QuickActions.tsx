import React from 'react';
import { QUICK_ACTIONS } from '../../types/chat';

interface QuickActionsProps {
  onAction: (prompt: string) => void;
}

export default function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-2xl border-2 border-brand-200 p-6">
      <h3 className="font-display text-xl font-semibold text-brand-900 mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action.prompt)}
            className="text-left p-4 rounded-xl border-2 border-brand-200 hover:border-brand-400 hover:bg-brand-50 transition-all group"
          >
            <div className="font-medium text-brand-900 group-hover:text-brand-900">
              {action.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
