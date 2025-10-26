import React, { useState } from 'react';
import { OutfitItem } from '../../types/outfit';
import OutfitCard from './OutfitCard';

interface OutfitCarouselProps {
  outfits: OutfitItem[];
  onSave: (outfit: OutfitItem) => void;
}

export default function OutfitCarousel({ outfits, onSave }: OutfitCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (outfits.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? outfits.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === outfits.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {outfits.map((outfit) => (
            <div key={outfit.id} className="min-w-full px-2">
              <OutfitCard outfit={outfit} onSave={onSave} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {outfits.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-3 rounded-full shadow-lg border-2 border-brand-200 hover:border-brand-400 hover:scale-110 transition-all z-10"
            aria-label="Previous outfit"
          >
            <svg className="h-6 w-6 text-brand-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-3 rounded-full shadow-lg border-2 border-brand-200 hover:border-brand-400 hover:scale-110 transition-all z-10"
            aria-label="Next outfit"
          >
            <svg className="h-6 w-6 text-brand-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {outfits.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {outfits.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-brand-900'
                  : 'w-2 bg-brand-300 hover:bg-brand-500'
              }`}
              aria-label={`Go to outfit ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      <div className="text-center mt-4 text-sm text-brand-600">
        Showing outfit {currentIndex + 1} of {outfits.length}
      </div>
    </div>
  );
}
