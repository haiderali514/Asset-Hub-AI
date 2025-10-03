
import React from 'react';
import { AssetGrid } from './AssetGrid';
import type { Asset } from '../types';
import { Icon } from './Icon';

interface FavoritesTabProps {
  favorites: Asset[];
  onCardClick: (asset: Asset) => void;
  onFavoriteToggle: (asset: Asset) => void;
  isFavorited: (assetId: string) => boolean;
}

export const FavoritesTab: React.FC<FavoritesTabProps> = ({ favorites, onCardClick, onFavoriteToggle, isFavorited }) => {
  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
        <Icon name="heart" className="w-16 h-16 mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold">No Favorites Yet</h3>
        <p>Click the heart icon on any asset to save it here.</p>
      </div>
    );
  }

  return (
    <div>
        <h2 className="text-3xl font-bold mb-8">Your Favorites</h2>
        <AssetGrid
            assets={favorites}
            isLoading={false}
            error={null}
            onCardClick={onCardClick}
            onFavoriteToggle={onFavoriteToggle}
            isFavorited={isFavorited}
        />
    </div>
  );
};
