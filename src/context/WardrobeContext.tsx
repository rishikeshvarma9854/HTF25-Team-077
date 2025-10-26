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

      // Default values (will try to enrich via the detection service and color extraction)
      let category: WardrobeItemMeta['category'] = 'tops';
      let colors: WardrobeItemMeta['colors'] = ['multi'];

      // Try to call the detection service to classify the uploaded image.
      try {
        const detectorUrl = (import.meta.env.VITE_DETECTOR_URL as string) || 'http://127.0.0.1:8000/detect';
        const form = new FormData();
        // compressed is a Blob - convert to a File so backend sees filename
        const fileForUpload = new File([compressed], file.name, { type: compressed.type });
        form.append('file', fileForUpload);
        const resp = await fetch(detectorUrl, { method: 'POST', body: form });
        if (resp.ok) {
          const j = await resp.json();
          const dets = j.detections || [];
          if (dets.length > 0) {
            const topLabel = (dets[0].label || '').toLowerCase();
            // map detection labels to frontend categories
            if (/dress|onepiece/.test(topLabel)) category = 'dresses';
            else if (/jacket|coat|blazer|hoodie/.test(topLabel)) category = 'outerwear';
            else if (/shirt|tee|t-shirt|sweater|top/.test(topLabel)) category = 'tops';
            else if (/skirt|pant|jean|trouser|shorts/.test(topLabel)) category = 'bottoms';
            else if (/shoe|sneaker|boot/.test(topLabel)) category = 'shoes';
            else if (/hat|cap|scarf|bag/.test(topLabel)) category = 'accessories';
            else category = 'tops';
          }
        } else {
          console.debug('Detector response not OK', resp.status, await resp.text());
        }
      } catch (e) {
        // detection is best-effort; don't block upload on failure
        console.warn('Detection service failed:', e);
      }

      // Try to extract a dominant color tag from the image (best-effort)
      try {
        const url = URL.createObjectURL(compressed);
        const img = new Image();
        img.src = url;
        await img.decode();
        const canvas = document.createElement('canvas');
        const w = Math.min(200, img.naturalWidth);
        const h = Math.min(200, img.naturalHeight);
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const data = ctx.getImageData(0, 0, w, h).data;
          let r = 0, g = 0, b = 0, count = 0;
          // sample every 4th pixel to speed up
          for (let i = 0; i < data.length; i += 16) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
          if (count > 0) {
            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);
            // map RGB to nearest simple color bucket
            const buckets: { tag: WardrobeItemMeta['colors'][number]; rgb: [number, number, number] }[] = [
              { tag: 'black', rgb: [10, 10, 10] },
              { tag: 'white', rgb: [245, 245, 245] },
              { tag: 'gray', rgb: [128, 128, 128] },
              { tag: 'red', rgb: [200, 30, 30] },
              { tag: 'orange', rgb: [230, 120, 20] },
              { tag: 'yellow', rgb: [230, 200, 20] },
              { tag: 'green', rgb: [30, 140, 40] },
              { tag: 'blue', rgb: [40, 80, 200] },
              { tag: 'purple', rgb: [140, 60, 160] },
              { tag: 'brown', rgb: [130, 80, 40] },
              { tag: 'pink', rgb: [240, 120, 170] },
              { tag: 'beige', rgb: [220, 200, 170] },
            ];
            let best = buckets[0];
            let bestDist = Infinity;
            for (const bkt of buckets) {
              const d = Math.hypot(r - bkt.rgb[0], g - bkt.rgb[1], b - bkt.rgb[2]);
              if (d < bestDist) {
                bestDist = d;
                best = bkt;
              }
            }
            colors = [best.tag];
          }
        }
        URL.revokeObjectURL(url);
      } catch (e) {
        console.warn('Color extraction failed', e);
      }

      const meta: WardrobeItemMeta = {
        id,
        name: file.name,
        category,
        colors,
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