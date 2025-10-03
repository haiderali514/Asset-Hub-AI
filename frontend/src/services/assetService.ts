import type { Asset, FilterOptions } from '../types';

const API_BASE_URL = '/api';

export const fetchAssets = async (query: string, filters: FilterOptions): Promise<Asset[]> => {
  const params = new URLSearchParams({
    q: query,
    type: filters.type,
    orientation: filters.orientation,
  });

  try {
    const response = await fetch(`${API_BASE_URL}/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch assets from backend:', error);
    throw error;
  }
};

export const fetchSearchSuggestions = async (query: string): Promise<string[]> => {
  if (!query) return [];
  
  const params = new URLSearchParams({ q: query });

  try {
    const response = await fetch(`${API_BASE_URL}/suggestions?${params.toString()}`);
    if (!response.ok) {
        console.error(`API error for suggestions: ${response.statusText}`);
        return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch suggestions from backend:', error);
    return [];
  }
};
