import React, { useEffect, useState } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { Category, ColorTag, Occasion, Season, WardrobeItemMeta } from '@/types/wardrobe';
import { useWardrobe } from '@/context/WardrobeContext';

const CATEGORIES: Category[] = ['tops', 'bottoms', 'shoes', 'accessories', 'outerwear', 'dresses'];
const COLORS: ColorTag[] = ['black','white','gray','red','orange','yellow','green','blue','purple','brown','pink','beige','multi'];
const SEASONS: Season[] = ['spring','summer','autumn','winter'];
const OCCASIONS: Occasion[] = ['casual','formal','party','work','sport'];

type Props = {
  item: WardrobeItemMeta | null;
  onClose: () => void;
};

export default function ItemDetailModal({ item, onClose }: Props) {
  const { getObjectURL, updateItem } = useWardrobe();
  const [url, setUrl] = useState('');
  const [draft, setDraft] = useState<WardrobeItemMeta | null>(item);

  useEffect(() => {
    setDraft(item);
    if (item) getObjectURL(item).then(setUrl);
  }, [item, getObjectURL]);

  if (!item || !draft) return null;

  const toggle = <T extends string>(arr: T[], v: T) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];

  const save = async () => {
    await updateItem(item.id, draft);
    onClose();
  };

  return (
    <Modal open={!!item} onClose={onClose} title="Edit Item">
      <div className="grid gap-6 md:grid-cols-[20rem_1fr]">
        <img src={url} className="aspect-square w-full rounded-2xl object-cover border-2 border-brand-200" alt={draft.name || 'Clothing item'} />
        <div className="space-y-4">
          <Input label="Name" value={draft.name || ''} onChange={e => setDraft({ ...draft, name: e.target.value })} />
          <div>
            <label className="mb-2 block text-sm font-medium text-brand-800">Category</label>
            <select className="w-full rounded-lg border-2 border-brand-200 bg-white px-4 py-2.5 text-brand-900 outline-none focus:border-brand-500 transition" value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value as Category })}>
              {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-brand-800">Colors</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button key={c} onClick={() => setDraft({ ...draft, colors: toggle(draft.colors, c) })} className={`rounded-full border-2 px-3 py-1.5 text-sm font-medium capitalize transition-all ${draft.colors.includes(c) ? 'border-brand-900 bg-brand-900 text-white' : 'border-brand-300 text-brand-700 hover:border-brand-500'}`}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-brand-800">Seasons</label>
            <div className="flex flex-wrap gap-2">
              {SEASONS.map(s => (
                <button key={s} onClick={() => setDraft({ ...draft, seasons: toggle(draft.seasons, s) })} className={`rounded-full border-2 px-3 py-1.5 text-sm font-medium capitalize transition-all ${draft.seasons.includes(s) ? 'border-brand-900 bg-brand-900 text-white' : 'border-brand-300 text-brand-700 hover:border-brand-500'}`}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-brand-800">Occasions</label>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map(o => (
                <button key={o} onClick={() => setDraft({ ...draft, occasions: toggle(draft.occasions, o) })} className={`rounded-full border-2 px-3 py-1.5 text-sm font-medium capitalize transition-all ${draft.occasions.includes(o) ? 'border-brand-900 bg-brand-900 text-white' : 'border-brand-300 text-brand-700 hover:border-brand-500'}`}>{o}</button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={save}>Save Changes</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}