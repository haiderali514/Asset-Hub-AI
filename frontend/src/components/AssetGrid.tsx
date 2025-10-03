
import React from 'react';
import { AssetCard } from './AssetCard';
import type { Asset } from '../types';
import { Icon } from './Icon';

interface AssetGridProps {
  assets: Asset[];
  isLoading: boolean;
  error: string | null;
  onCardClick: (asset: Asset) => void;
  onAddToCollection: (asset: Asset) => void;
  isAssetInAnyCollection: (assetId: string) => boolean;
}

const SkeletonCard: React.FC = () => (
  <div className="bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden animate-pulse">
     <div className="relative w-full aspect-[4/3] bg-gray-300 dark:bg-gray-700">
       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
     </div>
  </div>
);


export const AssetGrid: React.FC<AssetGridProps> = ({ assets, isLoading, error, onCardClick, onAddToCollection, isAssetInAnyCollection }) => {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg">
        <Icon name="error" className="w-12 h-12 mb-4" />
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!assets.length && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
        <Icon name="empty" className="w-16 h-16 mb-4" />
        <h3 className="text-xl font-semibold">No Assets Found</h3>
        <p>Try a different search query or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {assets.map(asset => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onCardClick={onCardClick}
          onAddToCollection={onAddToCollection}
          isInCollections={isAssetInAnyCollection(asset.id)}
        />
      ))}
    </div>
  );
};
