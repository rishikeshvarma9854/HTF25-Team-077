import React, { useState } from 'react';
import { OutfitItem } from '../../types/outfit';
import { PlannedOutfit, getWeekDates, formatDate, isToday, getShortDayName } from '../../utils/calendar';
import { useOutfits } from '../../context/OutfitContext';

export default function OutfitCalendar() {
  const { outfits } = useOutfits();
  const [plannedOutfits, setPlannedOutfits] = useState<PlannedOutfit[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState(new Date());
  
  const weekDates = getWeekDates(weekStart);

  const handlePlanOutfit = (date: string, outfitId: string) => {
    const existing = plannedOutfits.find(p => p.date === date);
    if (existing) {
      setPlannedOutfits(prev =>
        prev.map(p => (p.date === date ? { ...p, outfitId } : p))
      );
    } else {
      setPlannedOutfits(prev => [
        ...prev,
        {
          id: `${date}-${outfitId}`,
          outfitId,
          date,
          createdAt: Date.now(),
        },
      ]);
    }
    setSelectedDate(null);
  };

  const handleRemovePlanned = (date: string) => {
    setPlannedOutfits(prev => prev.filter(p => p.date !== date));
  };

  const getPlannedOutfit = (date: string): OutfitItem | null => {
    const planned = plannedOutfits.find(p => p.date === date);
    if (!planned) return null;
    return outfits.find(o => o.id === planned.outfitId) || null;
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() - 7);
    setWeekStart(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() + 7);
    setWeekStart(newDate);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-brand-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-semibold text-brand-900">
          Weekly Outfit Planner
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousWeek}
            className="p-2 hover:bg-brand-100 rounded-lg transition-colors"
          >
            <svg className="h-5 w-5 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNextWeek}
            className="p-2 hover:bg-brand-100 rounded-lg transition-colors"
          >
            <svg className="h-5 w-5 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date) => {
          const dateStr = formatDate(date);
          const plannedOutfit = getPlannedOutfit(dateStr);
          const today = isToday(date);

          return (
            <div
              key={dateStr}
              className={`relative p-3 rounded-xl border-2 min-h-[120px] transition-all ${
                today
                  ? 'border-accent-500 bg-accent-50'
                  : plannedOutfit
                  ? 'border-brand-400 bg-brand-50'
                  : 'border-brand-200 hover:border-brand-300'
              }`}
            >
              {/* Day Header */}
              <div className="text-center mb-2">
                <div className="text-xs font-medium text-brand-600">
                  {getShortDayName(date)}
                </div>
                <div className={`text-lg font-semibold ${
                  today ? 'text-accent-700' : 'text-brand-900'
                }`}>
                  {date.getDate()}
                </div>
              </div>

              {/* Planned Outfit */}
              {plannedOutfit ? (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-brand-900 truncate">
                    {plannedOutfit.name}
                  </div>
                  <button
                    onClick={() => handleRemovePlanned(dateStr)}
                    className="w-full px-2 py-1 text-xs bg-white border border-brand-300 rounded text-brand-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedDate(dateStr)}
                  className="w-full px-2 py-1 text-xs bg-brand-100 rounded text-brand-700 hover:bg-brand-200 transition-colors"
                >
                  + Plan Outfit
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Outfit Selection Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-semibold text-brand-900">
                Select Outfit for {new Date(selectedDate).toLocaleDateString()}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-2 hover:bg-brand-100 rounded-lg transition-colors"
              >
                <svg className="h-6 w-6 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {outfits.length === 0 ? (
              <div className="text-center py-12 text-brand-500">
                <p>No saved outfits yet. Create some outfits first!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {outfits.map((outfit) => (
                  <button
                    key={outfit.id}
                    onClick={() => handlePlanOutfit(selectedDate, outfit.id)}
                    className="text-left p-4 rounded-xl border-2 border-brand-200 hover:border-brand-400 hover:bg-brand-50 transition-all"
                  >
                    <div className="font-medium text-brand-900 mb-1">
                      {outfit.name}
                    </div>
                    <div className="text-sm text-brand-600 capitalize">
                      {outfit.occasion}
                      {outfit.mood && ` • ${outfit.mood}`}
                    </div>
                    <div className="text-xs text-brand-500 mt-1">
                      {outfit.items.length} items
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
