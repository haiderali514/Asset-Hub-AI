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

// Mock data for development when API key is not available
const mockAssets: Asset[] = [
    {
        id: '3139371',
        type: 'photo',
        previewURL: 'https://cdn.pixabay.com/photo/2018/02/08/22/27/fantasy-3139371_150.jpg',
        largeImageURL: 'https://cdn.pixabay.com/photo/2018/02/08/22/27/fantasy-3139371_1280.jpg',
        author: 'KELLEPICS',
        source: 'Pixabay',
        license: 'Pixabay License',
        tags: ['fantasy', 'city', 'futuristic', 'synthwave', 'neon'],
        downloadURL: 'https://pixabay.com/photos/fantasy-3139371/',
    },
    {
        id: '5044810',
        type: 'photo',
        previewURL: 'https://cdn.pixabay.com/photo/2020/04/13/20/01/background-5044810_150.jpg',
        largeImageURL: 'https://cdn.pixabay.com/photo/2020/04/13/20/01/background-5044810_1280.jpg',
        author: 'u_d83d1162',
        source: 'Pixabay',
        license: 'Pixabay License',
        tags: ['background', 'retro', '80s', 'synthwave'],
        downloadURL: 'https://pixabay.com/illustrations/background-5044810/',
    },
    {
        id: '2675031',
        type: 'photo',
        previewURL: 'https://cdn.pixabay.com/photo/2017/08/20/10/44/volkswagen-2675031_150.jpg',
        largeImageURL: 'https://cdn.pixabay.com/photo/2017/08/20/10/44/volkswagen-2675031_1280.jpg',
        author: '27707',
        source: 'Pixabay',
        license: 'Pixabay License',
        tags: ['volkswagen', 'car', 'retro', 'vintage'],
        downloadURL: 'https://pixabay.com/photos/volkswagen-2675031/',
    },
    {
        id: '1867616',
        type: 'photo',
        previewURL: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_150.jpg',
        largeImageURL: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg',
        author: 'Pixabay',
        source: 'Pixabay',
        license: 'Pixabay License',
        tags: ['milky way', 'galaxy', 'space', 'stars'],
        downloadURL: 'https://pixabay.com/photos/astronomy-1867616/',
    },
    {
        id: '4369793',
        type: 'photo',
        previewURL: 'https://cdn.pixabay.com/photo/2019/07/28/21/42/vhs-4369793_150.jpg',
        largeImageURL: 'https://cdn.pixabay.com/photo/2019/07/28/21/42/vhs-4369793_1280.jpg',
        author: 'felix_w',
        source: 'Pixabay',
        license: 'Pixabay License',
        tags: ['vhs', 'retro', '80s', 'cassette'],
        downloadURL: 'https://pixabay.com/photos/vhs-4369793/',
    },
];

const mockSuggestions = ['synthwave', 'retro', '80s', 'neon', 'futuristic', 'cyberpunk', 'galaxy', 'nature', 'vintage car'];

export const fetchAssets = async (query: string, filters: FilterOptions): Promise<Asset[]> => {
  if (!PIXABAY_API_KEY) {
    console.warn("Pixabay API key is missing. Using mock data for assets.");
    return new Promise(resolve => setTimeout(() => {
        const lowerCaseQuery = query.toLowerCase();
        const results = mockAssets.filter(a => a.tags.some(t => t.toLowerCase().includes(lowerCaseQuery)));
        // If no results for query, return all mock assets to show something
        resolve(results.length > 0 ? results : mockAssets);
    }, 500));
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
    console.warn("Pixabay API key is missing. Using mock data for suggestions.");
    const lowerCaseQuery = query.toLowerCase();
    return Promise.resolve(mockSuggestions.filter(s => s.toLowerCase().includes(lowerCaseQuery)));
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
