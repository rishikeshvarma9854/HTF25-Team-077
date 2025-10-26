import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import localforage from 'localforage';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { WardrobeItemMeta, defaultFilter, WardrobeFilter } from '@/types/wardrobe';
import { compressImage, getImageDimensions, isSupportedImageType, validateFileSize } from '@/utils/image';

// Configure localforage stores
const blobsStore = localforage.createInstance({ name: 'outfit-ai', storeName: 'wardrobe_blobs' });
const metaStore = localforage.createInstance({ name: 'outfit-ai', storeName: 'wardrobe_meta' });

const ItemSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  category: z.string(),
  colors: z.array(z.string()),
  seasons: z.array(z.string()),
  occasions: z.array(z.string()),
  notes: z.string().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
  blobKey: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  usageCount: z.number().optional(),
});

type Context = {
  items: WardrobeItemMeta[];
  loading: boolean;
  filter: WardrobeFilter;
  setFilter: (f: Partial<WardrobeFilter>) => void;
  addFiles: (files: File[]) => Promise<void>;
  deleteItems: (ids: string[]) => Promise<void>;
  updateItem: (id: string, patch: Partial<WardrobeItemMeta>) => Promise<void>;
  getObjectURL: (item: WardrobeItemMeta) => Promise<string>;
  clearAll: () => Promise<void>;
};

const WardrobeCtx = createContext<Context | null>(null);

export function WardrobeProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WardrobeItemMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilterState] = useState<WardrobeFilter>(defaultFilter);

  const setFilter = useCallback((f: Partial<WardrobeFilter>) => setFilterState(prev => ({ ...prev, ...f })), []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const all: WardrobeItemMeta[] = [];
      await metaStore.iterate((value, key) => {
        try {
          const parsed = ItemSchema.parse(value);
          all.push(parsed as WardrobeItemMeta);
        } catch {}
      });
      all.sort((a, b) => b.createdAt - a.createdAt);
      setItems(all);
      setLoading(false);
    })();
  }, []);

  const addFiles = useCallback(async (files: File[]) => {
    const now = Date.now();
    const metas: WardrobeItemMeta[] = [];
    for (const file of files) {
      if (!isSupportedImageType(file) || !validateFileSize(file, 15)) continue;
      const compressed = await compressImage(file);
      const dims = await getImageDimensions(compressed);
      const id = nanoid();
      const blobKey = `blob_${id}`;
      await blobsStore.setItem(blobKey, compressed);
      const meta: WardrobeItemMeta = {
        id,
        name: file.name,
        category: 'tops',
        colors: ['multi'],
        seasons: [],
        occasions: [],
        createdAt: now,
        updatedAt: now,
        blobKey,
        width: dims.width,
        height: dims.height,
        usageCount: 0,
      };
      await metaStore.setItem(id, meta);
      metas.push(meta);
    }
    if (metas.length) setItems(prev => [...metas, ...prev]);
  }, []);

  const deleteItems = useCallback(async (ids: string[]) => {
    const toDelete = items.filter(i => ids.includes(i.id));
    await Promise.all(toDelete.map(async i => {
      await metaStore.removeItem(i.id);
      await blobsStore.removeItem(i.blobKey);
    }));
    setItems(prev => prev.filter(i => !ids.includes(i.id)));
  }, [items]);

  const updateItem = useCallback(async (id: string, patch: Partial<WardrobeItemMeta>) => {
    const existing = await metaStore.getItem<WardrobeItemMeta>(id);
    if (!existing) return;
    const updated: WardrobeItemMeta = { ...existing, ...patch, updatedAt: Date.now() };
    await metaStore.setItem(id, updated);
    setItems(prev => prev.map(i => (i.id === id ? updated : i)));
  }, []);

  const objectUrlCache = useMemo(() => new Map<string, string>(), []);
  useEffect(() => () => {
    for (const url of objectUrlCache.values()) URL.revokeObjectURL(url);
  }, [objectUrlCache]);

  const getObjectURL = useCallback(async (item: WardrobeItemMeta) => {
    const cached = objectUrlCache.get(item.id);
    if (cached) return cached;
    const blob = await blobsStore.getItem<Blob>(item.blobKey);
    if (!blob) return '';
    const url = URL.createObjectURL(blob);
    objectUrlCache.set(item.id, url);
    return url;
  }, [objectUrlCache]);

  const clearAll = useCallback(async () => {
    await blobsStore.clear();
    await metaStore.clear();
    setItems([]);
  }, []);

  const value: Context = { items, loading, filter, setFilter, addFiles, deleteItems, updateItem, getObjectURL, clearAll };
  return <WardrobeCtx.Provider value={value}>{children}</WardrobeCtx.Provider>;
}

export function useWardrobe() {
  const ctx = useContext(WardrobeCtx);
  if (!ctx) throw new Error('useWardrobe must be used within WardrobeProvider');
  return ctx;
}