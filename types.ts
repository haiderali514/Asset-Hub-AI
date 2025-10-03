
export type AssetSource = 'Pixabay' | 'Pexels' | 'Unsplash' | 'AI';
export type Tab = 'search' | 'ai' | 'favorites';
export type AspectRatio = '1:1' | '16:9' | '9:16';

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