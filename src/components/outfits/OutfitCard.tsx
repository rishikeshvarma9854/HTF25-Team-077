import React from 'react';
import { OutfitItem } from '../../types/outfit';
import Button from '../common/Button';
import { useWardrobe } from '../../context/WardrobeContext';

interface OutfitCardProps {
  outfit: OutfitItem;
  onSave?: (outfit: OutfitItem) => void;
  onDelete?: (id: string) => void;
  onRate?: (id: string, rating: number) => void;
  onToggleFavorite?: (id: string) => void;
  isSaved?: boolean;
}

export default function OutfitCard({
  outfit,
  onSave,
  onDelete,
  onRate,
  onToggleFavorite,
  isSaved = false,
}: OutfitCardProps) {
  const { getObjectURL } = useWardrobe();

  return (
    <div className="bg-white rounded-2xl border-2 border-brand-200 shadow-sm hover:shadow-lg transition-all overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-brand-100">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl font-semibold text-brand-900">
              {outfit.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-brand-600 capitalize">{outfit.occasion}</span>
              {outfit.mood && (
                <>
                  <span className="text-brand-300">•</span>
                  <span className="text-sm text-brand-600 capitalize">{outfit.mood}</span>
                </>
              )}
            </div>
          </div>
          
          {isSaved && onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(outfit.id)}
              className="p-2 hover:bg-brand-50 rounded-lg transition-colors"
            >
              <svg
                className={`h-6 w-6 ${outfit.isFavorite ? 'fill-accent-500 text-accent-500' : 'text-brand-300'}`}
                fill={outfit.isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Outfit Items Grid */}
      <div className="p-4">
        <div className={`grid gap-3 ${
          outfit.items.length === 1 ? 'grid-cols-1' :
          outfit.items.length === 2 ? 'grid-cols-2' :
          outfit.items.length === 3 ? 'grid-cols-3' :
          'grid-cols-2'
        }`}>
          {outfit.items.map((item) => {
            const [imageUrl, setImageUrl] = React.useState('');
            
            React.useEffect(() => {
              getObjectURL(item).then(setImageUrl);
            }, [item]);

            return (
              <div key={item.id} className="relative group">
                <div className="aspect-square rounded-xl overflow-hidden bg-brand-50 border border-brand-200">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={item.name || item.category}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-xl flex items-end p-2 opacity-0 group-hover:opacity-100">
                  <span className="text-white text-sm font-medium capitalize">
                    {item.name || item.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rating Section */}
        {isSaved && onRate && (
          <div className="mt-4 pt-4 border-t border-brand-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-brand-700">Rate this outfit:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => onRate(outfit.id, star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <svg
                      className={`h-5 w-5 ${
                        outfit.rating && star <= outfit.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-brand-300'
                      }`}
                      fill={outfit.rating && star <= outfit.rating ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 bg-brand-50 border-t border-brand-200 flex gap-2">
        {!isSaved && onSave && (
          <Button onClick={() => onSave(outfit)} variant="primary" className="flex-1">
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Outfit
            </span>
          </Button>
        )}
        
        {isSaved && onDelete && (
          <Button
            onClick={() => onDelete(outfit.id)}
            variant="outline"
            className="flex-1"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
