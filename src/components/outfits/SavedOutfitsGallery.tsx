import React, { useState } from 'react';
import { OutfitItem } from '../../types/outfit';
import OutfitCard from './OutfitCard';
import { OCCASIONS } from '../../types/outfit';

interface SavedOutfitsGalleryProps {
  outfits: OutfitItem[];
  onDelete: (id: string) => void;
  onRate: (id: string, rating: number) => void;
  onToggleFavorite: (id: string) => void;
}

export default function SavedOutfitsGallery({
  outfits,
  onDelete,
  onRate,
  onToggleFavorite,
}: SavedOutfitsGalleryProps) {
  const [filterOccasion, setFilterOccasion] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredOutfits = outfits.filter((outfit) => {
    if (showFavoritesOnly && !outfit.isFavorite) return false;
    if (filterOccasion !== 'all' && outfit.occasion !== filterOccasion) return false;
    return true;
  });

  if (outfits.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="flex justify-center mb-4">
          <div className="h-20 w-20 bg-brand-100 rounded-full flex items-center justify-center">
            <svg className="h-10 w-10 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </div>
        </div>
        <h3 className="font-display text-2xl font-semibold text-brand-900 mb-2">
          No Saved Outfits Yet
        </h3>
        <p className="text-brand-600 max-w-md mx-auto">
          Generate some outfits and save your favorites to see them here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-brand-700">Filter:</label>
          <select
            value={filterOccasion}
            onChange={(e) => setFilterOccasion(e.target.value)}
            className="px-3 py-1.5 border-2 border-brand-200 rounded-lg text-sm focus:border-brand-500 focus:outline-none bg-white"
          >
            <option value="all">All Occasions</option>
            {OCCASIONS.map((occasion) => (
              <option key={occasion.value} value={occasion.value}>
                {occasion.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            showFavoritesOnly
              ? 'bg-accent-500 text-white'
              : 'bg-brand-100 text-brand-700 hover:bg-brand-200'
          }`}
        >
          ❤️ Favorites Only
        </button>

        <div className="ml-auto text-sm text-brand-600">
          {filteredOutfits.length} {filteredOutfits.length === 1 ? 'outfit' : 'outfits'}
        </div>
      </div>

      {/* Grid */}
      {filteredOutfits.length === 0 ? (
        <div className="text-center py-12 bg-brand-50 rounded-2xl border-2 border-dashed border-brand-200">
          <p className="text-brand-600">No outfits match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOutfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              onDelete={onDelete}
              onRate={onRate}
              onToggleFavorite={onToggleFavorite}
              isSaved
            />
          ))}
        </div>
      )}
    </div>
  );
}
