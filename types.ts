
export type AssetSource = 'Pixabay' | 'Pexels' | 'Unsplash' | 'AI';
export type Tab = 'search' | 'ai' | 'favorites';

export interface Asset {
  id: string;
  type: 'photo' | 'video' | 'illustration' | 'icon';
  previewURL: string;
  largeImageURL: string;
  author: string;
  source: AssetSource;
  license: string;
  tags: string[];
  downloadURL: string;
}

export interface FilterOptions {
  type: 'all' | 'photo' | 'illustration' | 'vector' | 'video';
  orientation: 'all' | 'horizontal' | 'vertical';
}
