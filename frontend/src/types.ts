
export type AssetSource = 'Pixabay' | 'Pexels' | 'Unsplash' | 'AI';
export type Tab = 'search' | 'ai' | 'favorites' | 'profile';
export type AspectRatio = '1:1' | '16:9' | '9:16';

export interface Asset {
  id: string;
  type: 'photo' | 'video' | 'illustration' | 'icon';
  previewURL: string;
  largeImageURL: string;
  author: string;
  source: AssetSource | 'AI';
  license: string;
  tags: string[];
  downloadURL:string;
}

export interface FilterOptions {
  type: 'all' | 'photo' | 'illustration' | 'video' | 'icon';
  orientation: 'all' | 'horizontal' | 'vertical';
}

export interface AIProviderAccount {
  id: string;
  name: string;
  apiKey: string | null;
  isDefault: boolean;
  description?: string;
}

export interface Collection {
  id: string;
  name: string;
  assetIds: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}
