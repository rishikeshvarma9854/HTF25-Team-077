import Input from '@/components/common/Input';
import { Category } from '@/types/wardrobe';

type Props = {
  q: string;
  setQ: (q: string) => void;
  categories: Category[];
  setCategories: (c: Category[]) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
};

const ALL_CATEGORIES: Category[] = ['tops', 'bottoms', 'shoes', 'accessories', 'outerwear', 'dresses'];

export default function FiltersBar({ q, setQ, categories, setCategories, sortBy, setSortBy }: Props) {
  const toggleCategory = (c: Category) => {
    if (categories.includes(c)) setCategories(categories.filter(x => x !== c));
    else setCategories([...categories, c]);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <Input placeholder="Search your wardrobe..." value={q} onChange={e => setQ(e.target.value)} />
        <select className="rounded-lg border-2 border-brand-200 bg-white px-4 py-2.5 text-sm font-medium text-brand-900 outline-none focus:border-brand-500 transition" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="category">By Category</option>
          <option value="color">By Color</option>
          <option value="frequency">Most Worn</option>
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-brand-700">Filter:</span>
        {ALL_CATEGORIES.map(c => (
          <button key={c} onClick={() => toggleCategory(c)} className={`rounded-full border-2 px-4 py-1.5 text-sm font-medium capitalize transition-all ${categories.includes(c) ? 'border-brand-900 bg-brand-900 text-white' : 'border-brand-300 text-brand-700 hover:border-brand-500'}`}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}