import type { Asset, FilterOptions } from '../types';

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY || '';
const PIXABAY_API_URL = 'https://pixabay.com/api/';

const normalizePixabayData = (item: any): Asset => ({
  id: item.id.toString(),
  type: item.type === 'film' ? 'video' : 'photo',
  previewURL: item.webformatURL,
  largeImageURL: item.largeImageURL,
  author: item.user,
  source: 'Pixabay',
  license: 'Pixabay License',
  tags: item.tags.split(',').map((tag: string) => tag.trim()),
  downloadURL: item.pageURL,
});

export const fetchAssets = async (query: string, filters: FilterOptions): Promise<Asset[]> => {
  if (!PIXABAY_API_KEY) {
    throw new Error("Pixabay API key is missing.");
  }
    
  const params = new URLSearchParams({
    key: PIXABAY_API_KEY,
    q: query,
    image_type: filters.type === 'all' ? 'photo' : filters.type,
    orientation: filters.orientation,
    per_page: '30',
    safesearch: 'true',
  });

  try {
    const response = await fetch(`${PIXABAY_API_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Pixabay API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.hits.map(normalizePixabayData);
  } catch (error) {
    console.error('Failed to fetch from Pixabay:', error);
    throw error;
  }
};

export const fetchSearchSuggestions = async (query: string): Promise<string[]> => {
  if (!PIXABAY_API_KEY) {
    throw new Error("Pixabay API key is missing.");
  }

  const params = new URLSearchParams({
    key: PIXABAY_API_KEY,
    q: query,
    per_page: '10',
  });

  try {
    const response = await fetch(`${PIXABAY_API_URL}?${params.toString()}`);
    if (!response.ok) {
      console.error(`Pixabay API error for suggestions: ${response.statusText}`);
      return [];
    }
    const data = await response.json();
    
    const tags = new Set<string>();
    data.hits.forEach((item: any) => {
      item.tags.split(',').forEach((tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag) {
          tags.add(trimmedTag);
        }
      });
    });

    return Array.from(tags);
  } catch (error) {
    console.error('Failed to fetch suggestions from Pixabay:', error);
    return [];
  }
};