import React, { useState } from 'react';
import { useOutfits } from '../context/OutfitContext';
import Card from '../components/common/Card';
import OutfitGeneratorPanel from '../components/outfits/OutfitGeneratorPanel';
import OutfitCarousel from '../components/outfits/OutfitCarousel';
import SavedOutfitsGallery from '../components/outfits/SavedOutfitsGallery';
import OutfitCalendar from '../components/outfits/OutfitCalendar';

export default function Outfits() {
  const {
    outfits,
    generatedOutfits,
    generateOutfits,
    saveOutfit,
    deleteOutfit,
    rateOutfit,
    toggleFavorite,
    clearGenerated,
    isGenerating,
  } = useOutfits();

  const [showGenerator, setShowGenerator] = useState(true);

  return (
    <div className="container-responsive space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-900 mb-2">
          Outfit Planner
        </h1>
        <p className="text-brand-600 text-lg">
          Generate personalized outfit recommendations based on occasion, mood, and weather
        </p>
      </div>

      {/* Generator Section */}
      <Card>
        <button
          onClick={() => setShowGenerator(!showGenerator)}
          className="w-full flex items-center justify-between mb-4"
        >
          <h2 className="font-display text-2xl font-semibold text-brand-900">
            ✨ Generate New Outfit
          </h2>
          <svg
            className={`h-6 w-6 text-brand-600 transition-transform ${
              showGenerator ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showGenerator && (
          <OutfitGeneratorPanel
            onGenerate={(params) => {
              generateOutfits(params);
              setShowGenerator(false);
            }}
            isGenerating={isGenerating}
          />
        )}
      </Card>

      {/* Generated Outfits Carousel */}
      {generatedOutfits.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-semibold text-brand-900">
              Generated Suggestions
            </h2>
            <button
              onClick={clearGenerated}
              className="text-sm text-brand-600 hover:text-brand-900 font-medium"
            >
              Clear All
            </button>
          </div>
          <OutfitCarousel outfits={generatedOutfits} onSave={saveOutfit} />
        </Card>
      )}

      {/* Outfit Calendar */}
      {outfits.length > 0 && (
        <OutfitCalendar />
      )}

      {/* Saved Outfits */}
      <div>
        <h2 className="font-display text-3xl font-semibold text-brand-900 mb-6">
          Saved Outfits
          {outfits.length > 0 && (
            <span className="ml-3 text-lg font-normal text-brand-600">
              ({outfits.length})
            </span>
          )}
        </h2>
        <SavedOutfitsGallery
          outfits={outfits}
          onDelete={deleteOutfit}
          onRate={rateOutfit}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </div>
  );
}
