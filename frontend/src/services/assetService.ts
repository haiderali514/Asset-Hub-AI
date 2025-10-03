import type { Asset, FilterOptions } from '../types';

// --- MOCK DATA ---
const baseMockAssets: Omit<Asset, 'id' | 'downloadURL'>[] = [
    { type: 'photo', previewURL: 'https://cdn.pixabay.com/photo/2018/02/08/22/27/fantasy-3139371_150.jpg', largeImageURL: 'https://cdn.pixabay.com/photo/2018/02/08/22/27/fantasy-3139371_1280.jpg', author: 'KELLEPICS', source: 'Pixabay', license: 'Pixabay License', tags: ['fantasy', 'city', 'futuristic', 'synthwave', 'neon'] },
    { type: 'illustration', previewURL: 'https://cdn.pixabay.com/photo/2020/04/13/20/01/background-5044810_150.jpg', largeImageURL: 'https://cdn.pixabay.com/photo/2020/04/13/20/01/background-5044810_1280.jpg', author: 'u_d83d1162', source: 'Pixabay', license: 'Pixabay License', tags: ['background', 'retro', '80s', 'synthwave'] },
    { type: 'photo', previewURL: 'https://cdn.pixabay.com/photo/2017/08/20/10/44/volkswagen-2675031_150.jpg', largeImageURL: 'https://cdn.pixabay.com/photo/2017/08/20/10/44/volkswagen-2675031_1280.jpg', author: '27707', source: 'Pixabay', license: 'Pixabay License', tags: ['volkswagen', 'car', 'retro', 'vintage'] },
    { type: 'photo', previewURL: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_150.jpg', largeImageURL: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg', author: 'Pixabay', source: 'Pixabay', license: 'Pixabay License', tags: ['milky way', 'galaxy', 'space', 'stars'] },
    { type: 'photo', previewURL: 'https://cdn.pixabay.com/photo/2019/07/28/21/42/vhs-4369793_150.jpg', largeImageURL: 'https://cdn.pixabay.com/photo/2019/07/28/21/42/vhs-4369793_1280.jpg', author: 'felix_w', source: 'Pixabay', license: 'Pixabay License', tags: ['vhs', 'retro', '80s', 'cassette'] },
    { type: 'video', previewURL: 'https://cdn.pixabay.com/vimeo/169993951/sea-8210_150.jpg', largeImageURL: 'https://cdn.pixabay.com/vimeo/169993951/sea-8210_1280.jpg', author: 'SeaStock', source: 'Pixabay', license: 'Pixabay License', tags: ['sea', 'waves', 'beach', 'video'] },
    { type: 'icon', previewURL: 'https://cdn.pixabay.com/photo/2013/07/12/12/33/cancel-145890_150.png', largeImageURL: 'https://cdn.pixabay.com/photo/2013/07/12/12/33/cancel-145890_1280.png', author: 'OpenClipart-Vectors', source: 'Pixabay', license: 'Pixabay License', tags: ['cancel', 'close', 'icon', 'x'] },
    { type: 'video', previewURL: 'https://cdn.pixabay.com/vimeo/240113653/trees-22774_150.jpg', largeImageURL: 'https://cdn.pixabay.com/vimeo/240113653/trees-22774_1280.jpg', author: 'Motion-Design', source: 'Pixabay', license: 'Pixabay License', tags: ['trees', 'fog', 'forest', 'video'] },
    { type: 'icon', previewURL: 'https://cdn.pixabay.com/photo/2014/04/02/10/24/attention-303861_150.png', largeImageURL: 'https://cdn.pixabay.com/photo/2014/04/02/10/24/attention-303861_1280.png', author: 'OpenClipart-Vectors', source: 'Pixabay', license: 'Pixabay License', tags: ['attention', 'warning', 'icon', 'sign'] },
];

const allMockAssets: Asset[] = Array.from({ length: 60 }).map((_, i) => {
    const baseAsset = baseMockAssets[i % baseMockAssets.length];
    return {
        ...baseAsset,
        id: `mock-${i + 1}-${baseAsset.type}`,
        downloadURL: baseAsset.largeImageURL,
    }
});

const mockSuggestions: string[] = ['synthwave', 'retro', '80s', 'neon', 'futuristic', 'cyberpunk', 'galaxy', 'nature', 'vintage car', 'abstract', 'landscape'];

const ASSETS_PER_PAGE = 12;

export const fetchAssets = async (query: string, filters: FilterOptions, page: number): Promise<{assets: Asset[], hasMore: boolean}> => {
  console.log(`[MOCK] Searching for: ${query}, Page: ${page}, Filters:`, filters);
  return new Promise(resolve => {
    setTimeout(() => {
      const lowerCaseQuery = query.toLowerCase();
      let filteredAssets = allMockAssets;

      // Apply type filter
      if (filters.type && filters.type !== 'all') {
        filteredAssets = filteredAssets.filter(asset => asset.type === filters.type);
      }

      // Apply search query filter
      if (query) {
        filteredAssets = filteredAssets.filter(asset => 
          asset.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
        );
      }
      
      const startIndex = (page - 1) * ASSETS_PER_PAGE;
      const endIndex = startIndex + ASSETS_PER_PAGE;
      
      const paginatedAssets = filteredAssets.slice(startIndex, endIndex);
      const hasMore = endIndex < filteredAssets.length;

      resolve({ assets: paginatedAssets, hasMore });
    }, 500); // Simulate network delay
  });
};

export const fetchSearchSuggestions = async (query: string): Promise<string[]> => {
  console.log(`[MOCK] Fetching suggestions for: ${query}`);
  return new Promise(resolve => {
    setTimeout(() => {
      if (!query) {
        resolve([]);
        return;
      }
      const lowerCaseQuery = query.toLowerCase();
      resolve(mockSuggestions.filter(s => s.toLowerCase().includes(lowerCaseQuery)));
    }, 200);
  });
};

export const downloadFavoritesArchive = async (assets: Asset[]): Promise<Blob> => {
    console.log('[MOCK] Downloading archive for assets:', assets);
    return Promise.reject(new Error("Download functionality requires a backend server."));
};