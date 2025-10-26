import { useMemo, useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import UploadArea from '@/components/wardrobe/UploadArea';
import WardrobeGrid from '@/components/wardrobe/WardrobeGrid';
import ItemDetailModal from '@/components/wardrobe/ItemDetailModal';
import FiltersBar from '@/components/wardrobe/FiltersBar';
import CameraCaptureModal from '@/components/wardrobe/CameraCaptureModal';
import { useWardrobe } from '@/context/WardrobeContext';

export default function Wardrobe() {
	const { items, addFiles, deleteItems, filter, setFilter } = useWardrobe();
	const [camOpen, setCamOpen] = useState(false);
		const [selected, setSelected] = useState<Set<string>>(new Set());
		const [activeId, setActiveId] = useState<string | null>(null);

	const onToggleSelect = (id: string) => {
		setSelected(prev => {
			const ns = new Set(prev);
			ns.has(id) ? ns.delete(id) : ns.add(id);
			return ns;
		});
	};

	const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 className="font-display text-4xl font-bold text-brand-900 mb-2">My Wardrobe</h1>
					<p className="text-brand-600">{items.length} {items.length === 1 ? 'item' : 'items'} in your collection</p>
				</div>
				<div className="flex gap-3">
					<Button variant="outline" onClick={() => setCamOpen(true)}>
						<svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						Camera
					</Button>
					{selected.size > 0 && (
						<Button variant="secondary" onClick={async () => { 
							if (confirm(`Delete ${selected.size} selected items?`)) {
								await deleteItems(Array.from(selected)); 
								setSelected(new Set()); 
							}
						}}>
							Delete ({selected.size})
						</Button>
					)}
				</div>
			</div>

			{/* Upload Section */}
			<Card>
				<UploadArea onFiles={addFiles} />
				<div className="mt-4 flex items-center justify-between text-xs">
					<span className="text-brand-600">
						Sync: <span className={isOnline ? 'text-green-600 font-medium' : 'text-yellow-700 font-medium'}>{isOnline ? 'Online' : 'Offline (cached)'}</span>
					</span>
					<span className="text-brand-500">Images stored locally with IndexedDB</span>
				</div>
			</Card>

			{/* Filters */}
			<FiltersBar
				q={filter.q}
				setQ={(q) => setFilter({ q })}
				categories={filter.categories}
				setCategories={(categories) => setFilter({ categories })}
				sortBy={filter.sortBy}
				setSortBy={(s) => setFilter({ sortBy: s as any })}
			/>

			{/* Grid */}
			{items.length === 0 ? (
				<Card className="text-center py-16">
					<div className="mx-auto mb-4 h-20 w-20 rounded-full bg-brand-100 flex items-center justify-center">
						<svg className="h-10 w-10 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
						</svg>
					</div>
					<h3 className="text-xl font-semibold text-brand-900 mb-2">Your wardrobe is empty</h3>
					<p className="text-brand-600 mb-6">Start by uploading photos of your clothes above</p>
				</Card>
			) : (
				<WardrobeGrid onOpenItem={(i) => setActiveId(i.id)} selected={selected} onToggleSelect={onToggleSelect} />
			)}

			{/* Modals */}
			<CameraCaptureModal open={camOpen} onClose={() => setCamOpen(false)} onCapture={(f) => addFiles([f])} />
			<ItemDetailModal item={items.find(i => i.id === activeId) || null} onClose={() => setActiveId(null)} />
		</div>
	);
}
