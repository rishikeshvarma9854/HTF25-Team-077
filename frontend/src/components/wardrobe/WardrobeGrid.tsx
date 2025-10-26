import { useEffect, useMemo, useState } from 'react';
import { WardrobeItemMeta, Category } from '@/types/wardrobe';
import { useWardrobe } from '@/context/WardrobeContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

type Props = {
  onOpenItem: (item: WardrobeItemMeta) => void;
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
};

export default function WardrobeGrid({ onOpenItem, selected, onToggleSelect }: Props) {
  const { items, loading, filter, getObjectURL } = useWardrobe();
  const [urls, setUrls] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    let out = items;
    if (filter.q) out = out.filter(i => (i.name || '').toLowerCase().includes(filter.q.toLowerCase()));
    if (filter.categories.length) out = out.filter(i => filter.categories.includes(i.category as Category));
    switch (filter.sortBy) {
      case 'category': out = [...out].sort((a, b) => a.category.localeCompare(b.category)); break;
      case 'color': out = [...out].sort((a, b) => (a.colors[0] || '').localeCompare(b.colors[0] || '')); break;
      case 'frequency': out = [...out].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0)); break;
      case 'newest': default: out = [...out].sort((a, b) => b.createdAt - a.createdAt);
    }
    return out;
  }, [items, filter]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const map: Record<string, string> = {};
      for (const item of filtered) {
        map[item.id] = await getObjectURL(item);
        if (cancelled) return;
      }
      setUrls(map);
    })();
    return () => { cancelled = true; };
  }, [filtered, getObjectURL]);

  if (loading) return <div className="py-12 flex justify-center"><LoadingSpinner label="Loading your wardrobe..." /></div>;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {filtered.map(item => (
        <div key={item.id} className="group relative overflow-hidden rounded-2xl border-2 border-brand-200 bg-white transition-all hover:shadow-lg hover:border-brand-400">
          <button 
            className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 backdrop-blur text-sm font-semibold shadow-md hover:bg-brand-900 hover:text-white transition-all" 
            onClick={(e) => { e.stopPropagation(); onToggleSelect(item.id); }}
          >
            {selected.has(item.id) ? '✓' : '+'}
          </button>
          <div className="cursor-pointer" onClick={() => onOpenItem(item)}>
            <img src={urls[item.id]} alt={item.name || 'Clothing item'} className="aspect-square w-full object-cover" />
            <div className="p-3">
              <div className="line-clamp-1 font-semibold text-brand-900 mb-0.5">{item.name || 'Untitled'}</div>
              <div className="text-xs text-brand-600 capitalize">{item.category}</div>
              {item.colors.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {item.colors.slice(0, 3).map((color, i) => (
                    <span key={i} className="inline-block h-4 w-4 rounded-full border border-brand-300" style={{ backgroundColor: getColorHex(color) }} title={color} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getColorHex(color: string): string {
  const map: Record<string, string> = {
    black: '#000', white: '#fff', gray: '#6b7280', red: '#ef4444',
    orange: '#f97316', yellow: '#eab308', green: '#22c55e', blue: '#3b82f6',
    purple: '#a855f7', brown: '#92400e', pink: '#ec4899', beige: '#d4cec3', multi: '#ccc'
  };
  return map[color] || '#ccc';
}