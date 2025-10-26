import React from 'react';
import { UsageStatistics } from '../../types/profile';

interface StatsCardProps {
  statistics: UsageStatistics;
}

export default function StatsCard({ statistics }: StatsCardProps) {
  const stats = [
    {
      label: 'Wardrobe Items',
      value: statistics.totalWardrobeItems,
      icon: '👕',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Saved Outfits',
      value: statistics.totalOutfits,
      icon: '✨',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      label: 'Items This Month',
      value: statistics.itemsAddedThisMonth,
      icon: '📦',
      color: 'bg-green-100 text-green-700',
    },
    {
      label: 'Outfits Created',
      value: statistics.outfitsCreatedThisMonth,
      icon: '🎨',
      color: 'bg-orange-100 text-orange-700',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border-2 border-brand-200 p-6">
      <h2 className="font-display text-2xl font-semibold text-brand-900 mb-6">
        Your Statistics
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="text-center p-4 rounded-xl bg-brand-50 border border-brand-200"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-brand-900">{stat.value}</div>
            <div className="text-sm text-brand-600 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="space-y-4">
        {statistics.favoriteOccasion && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-accent-50 border border-accent-200">
            <span className="text-sm font-medium text-brand-700">Favorite Occasion:</span>
            <span className="text-sm font-semibold text-brand-900 capitalize">
              {statistics.favoriteOccasion}
            </span>
          </div>
        )}

        {statistics.mostUsedColors.length > 0 && (
          <div className="p-4 rounded-xl bg-brand-50 border border-brand-200">
            <div className="text-sm font-medium text-brand-700 mb-3">Most Used Colors:</div>
            <div className="flex flex-wrap gap-2">
              {statistics.mostUsedColors.map((color) => (
                <span
                  key={color}
                  className="px-3 py-1 rounded-full bg-white border-2 border-brand-300 text-sm font-medium text-brand-900 capitalize"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
