export type Category = 'tops' | 'bottoms' | 'shoes' | 'accessories' | 'outerwear' | 'dresses';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type Occasion = 'casual' | 'formal' | 'party' | 'work' | 'sport';

export type ColorTag = 'black' | 'white' | 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'brown' | 'pink' | 'beige' | 'multi';

export interface WardrobeItemMeta {
  id: string;
  name?: string;
  category: Category;
  colors: ColorTag[];
  seasons: Season[];
  occasions: Occasion[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
  /** Key in storage for the binary image blob */
  blobKey: string;
  width?: number;
  height?: number;
  /** times used to help sorting */
  usageCount?: number;
}

export type SortBy = 'newest' | 'color' | 'category' | 'frequency';

export interface WardrobeFilter {
  q: string;
  categories: Category[];
  colors: ColorTag[];
  seasons: Season[];
  occasions: Occasion[];
  sortBy: SortBy;
}

export const defaultFilter: WardrobeFilter = {
  q: '',
  categories: [],
  colors: [],
  seasons: [],
  occasions: [],
  sortBy: 'newest',
};