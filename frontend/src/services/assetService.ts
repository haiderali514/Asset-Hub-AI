
import type { Asset, FilterOptions } from '../types';

// --- MOCK DATA ---
const mockAssets: Asset[] = [
    { id: '3139371', type: 'photo', previewURL: 'https://cdn.pixabay.com/photo/2018/02/08/22/27/fantasy-3139371_150.jpg', largeImageURL: 'https://cdn.pixabay.com/photo/2018/02/08/22/27/fantasy-3139371_1280.jpg', author: 'KELLEPICS', source: 'Pixabay', license: 'Pixabay License', tags: ['fantasy', 'city', 'futuristic', 'synthwave', 'neon'], downloadURL: 'https://pixabay.com/photos/fantasy-3139371/', },
    { id: '5044810', type: 'illustration', previewURL: 'https://cdn.pixabay.com/photo/2020/04/13/20/01/background-5044810_150.jpg', largeImageURL: 'https://cdn.pixabay.com/photo/2020/04/13/20/01/background-5044810_1280.jpg', author: 'u_d83d1162', source: 'Pixabay', license: 'Pixabay License', tags: ['background', 'retro', '80s', 'synthwave'], downloadURL: 'https://pixabay.com/illustrations/background-5044810/', },
    { id: '2675031', type: 'photo', previewURL: 'https://cdn.pixabay.com/photo/2017/08/20/10/44/volkswagen-2675031_150.jpg', largeImageURL: 'https://cdn.pixabay.com/photo/2017/08/20/10/44/volkswagen-2675031_1280.jpg', author: '27707', source: 'Pixabay', license: 'Pixabay License', tags: ['volkswagen', 'car', 'retro', 'vintage'], downloadURL: 'https://pixabay.com/photos/volkswagen-2675031/', },
    { id: '1867616', type: 'photo', previewURL: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_150.jpg', largeImageURL: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg', author: 'Pixabay', source: 'Pixabay', license: 'Pixabay License', tags: ['milky way', 'galaxy', 'space', 'stars'], downloadURL: 'https://pixabay.com/photos/astronomy-1867616/', },
    { id: '4369793', type: 'photo', previewURL: 'https://cdn.pixabay.com/photo/2019/07/28/21/42/vhs-4369793_150.jpg', largeImageURL: 'https://cdn.pixabay.com/photo/2019/07/28/21/42/vhs-4369793_1280.jpg', author: 'felix_w', source: 'Pixabay', license: 'Pixabay License', tags: ['vhs', 'retro', '80s', 'cassette'], downloadURL: 'https://pixabay.com/photos/vhs-4369793/', },
    { id: 'video-8210', type: 'video', previewURL: 'https://cdn.pixabay.com/vimeo/169993951/sea-8210_150.jpg', largeImageURL: 'https://cdn.pixabay.com/vimeo/169993951/sea-8210_1280.jpg', author: 'SeaStock', source: 'Pixabay', license: 'Pixabay License', tags: ['sea', 'waves', 'beach', 'video'], downloadURL: 'https://pixabay.com/videos/sea-8210/', },
    { id: 'icon-27633', type: 'icon', previewURL: 'https://cdn.pixabay.com/photo/2013/07/12/12/33/cancel-145890_150.png', largeImageURL: 'https://cdn.pixabay.com/photo/2013/07/12/12/33/cancel-145890_1280.png', author: 'OpenClipart-Vectors', source: 'Pixabay', license: 'Pixabay License', tags: ['cancel', 'close', 'icon', 'x'], downloadURL: 'https://pixabay.com/vectors/cancel-27633/', },
    { id: 'video-22774', type: 'video', previewURL: 'https://cdn.pixabay.com/vimeo/240113653/trees-22774_150.jpg', largeImageURL: 'https://cdn.pixabay.com/vimeo/240113653/trees-22774_1280.jpg', author: 'Motion-Design', source: 'Pixabay', license: 'Pixabay License', tags: ['trees', 'fog', 'forest', 'video'], downloadURL: 'https://pixabay.com/videos/trees-22774/', },
    { id: 'icon-304623', type: 'icon', previewURL: 'https://cdn.pixabay.com/photo/2014/04/02/10/24/attention-303861_150.png', largeImageURL: 'https://cdn.pixabay.com/photo/2014/04/02/10/24/attention-303861_1280.png', author: 'OpenClipart-Vectors', source: 'Pixabay', license: 'Pixabay License', tags: ['attention', 'warning', 'icon', 'sign'], downloadURL: 'https://pixabay.com/vectors/attention-304623/', },
];
const mockSuggestions: string[] = ['synthwave', 'retro', '80s', 'neon', 'futuristic', 'cyberpunk', 'galaxy', 'nature', 'vintage car', 'abstract', 'landscape'];


export const fetchAssets = async (query: string, filters: FilterOptions): Promise<Asset[]> => {
  console.log(`[MOCK] Searching for: ${query} with filters:`, filters);
  return new Promise(resolve => {
    setTimeout(() => {
      const lowerCaseQuery = query.toLowerCase();
      let filteredAssets = mockAssets;

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
      
      resolve(filteredAssets);
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