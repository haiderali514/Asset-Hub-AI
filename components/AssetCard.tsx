
import React from 'react';
import type { Asset, AssetSource } from '../types';
import { Icon } from './Icon';

interface AssetCardProps {
  asset: Asset;
  onCardClick: (asset: Asset) => void;
  onFavoriteToggle: (asset: Asset) => void;
  isFavorited: boolean;
}

const SourceBadge: React.FC<{ source: AssetSource }> = ({ source }) => {
  const colors: Record<AssetSource, string> = {
    Pixabay: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Pexels: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Unsplash: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    AI: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  };
  return (
    <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded-full ${colors[source]}`}>
      {source}
    </span>
  );
};


export const AssetCard: React.FC<AssetCardProps> = ({ asset, onCardClick, onFavoriteToggle, isFavorited }) => {

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle(asset);
  };
  
  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(asset.downloadURL, '_blank');
  };

  return (
    <div 
      className="group relative block bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onClick={() => onCardClick(asset)}
    >
      <img
        src={asset.previewURL}
        alt={asset.tags.join(', ')}
        className="w-full h-full object-cover aspect-[4/3] transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <SourceBadge source={asset.source} />

      <div className="absolute bottom-0 left-0 p-4 w-full text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="font-semibold text-sm truncate">{asset.author}</p>
        <p className="text-xs text-gray-300 truncate">{asset.tags.join(', ')}</p>
      </div>
      
      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleFavoriteClick}
          className={`p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors ${isFavorited ? 'text-red-500' : 'text-white'}`}
          aria-label="Favorite"
        >
          <Icon name="heart" className="w-5 h-5" filled={isFavorited} />
        </button>
        <button
          onClick={handleDownloadClick}
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-colors"
          aria-label="Download"
        >
          <Icon name="download" className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
