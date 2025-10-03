
import React, { useState, useMemo } from 'react';
import { AssetGrid } from './AssetGrid';
import type { Asset, Collection } from '../types';
import { Icon } from './Icon';
import { downloadFavoritesArchive } from '../services/assetService';

interface CollectionsTabProps {
  collections: Collection[];
  assets: { [id: string]: Asset };
  onAssetClick: (asset: Asset) => void;
  onAddToCollection: (asset: Asset) => void;
  isAssetInAnyCollection: (assetId: string) => boolean;
  onCreateCollection: (name: string) => void;
  onDeleteCollection: (id: string) => void;
}

const CollectionHeader: React.FC<{
    collection: Collection;
    assetCount: number;
    onDownload: () => void;
    onDelete: () => void;
    isDownloading: boolean;
}> = ({ collection, assetCount, onDownload, onDelete, isDownloading }) => (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div>
            <h3 className="text-xl font-bold">{collection.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{assetCount} {assetCount === 1 ? 'item' : 'items'}</p>
        </div>
        <div className="flex gap-2">
            <button onClick={onDownload} disabled={isDownloading || assetCount === 0}
                className="px-4 py-2 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors disabled:bg-primary-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
                {isDownloading ? <Icon name="loader" className="w-5 h-5 animate-spin" /> : <Icon name="download" className="w-5 h-5" />}
                Download All
            </button>
            <button onClick={onDelete}
                 className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
                Delete
            </button>
        </div>
    </div>
);


export const CollectionsTab: React.FC<CollectionsTabProps> = ({ collections, assets, onAssetClick, onAddToCollection, isAssetInAnyCollection, onCreateCollection, onDeleteCollection }) => {
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [downloadingState, setDownloadingState] = useState<{ [collectionId: string]: boolean }>({});
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      onCreateCollection(newCollectionName.trim());
      setNewCollectionName('');
      setIsCreating(false);
    }
  };
  
  const handleDeleteCollection = (collection: Collection) => {
      if(window.confirm(`Are you sure you want to delete the "${collection.name}" collection?`)) {
          onDeleteCollection(collection.id);
      }
  }

  const handleDownloadCollection = async (collection: Collection) => {
    if (collection.assetIds.length === 0) return;
    setDownloadingState(prev => ({ ...prev, [collection.id]: true }));
    setDownloadError(null);
    try {
      const assetsToDownload = collection.assetIds.map(id => assets[id]).filter(Boolean);
      const blob = await downloadFavoritesArchive(assetsToDownload);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${collection.name.replace(/\s/g, '_')}-collection.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : 'Download failed.');
    } finally {
      setDownloadingState(prev => ({ ...prev, [collection.id]: false }));
    }
  };

  const sortedCollections = useMemo(() => [...collections].sort((a, b) => a.name.localeCompare(b.name)), [collections]);

  if (collections.length === 0 && !isCreating) {
    return (
      <div className="text-center">
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Icon name="heart" className="w-16 h-16 mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold">No Collections Yet</h3>
            <p className="mb-4">Create your first collection to save assets.</p>
            <button onClick={() => setIsCreating(true)} className="px-5 py-2.5 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600">Create a Collection</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold">Your Collections</h2>
        {!isCreating && <button onClick={() => setIsCreating(true)} className="px-5 py-2.5 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors">Create New Collection</button>}
      </div>
      
      {isCreating && (
        <div className="p-4 mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm flex gap-4 items-center">
            <input
                type="text"
                value={newCollectionName}
                onChange={e => setNewCollectionName(e.target.value)}
                placeholder="New collection name..."
                className="w-full flex-grow px-4 py-2 text-base bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button onClick={handleCreateCollection} className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">Save</button>
            <button onClick={() => setIsCreating(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
        </div>
      )}

      {downloadError && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/20 dark:text-red-300" role="alert">
            <span className="font-bold">Download failed:</span> {downloadError}
          </div>
        )}

      <div className="space-y-10">
        {sortedCollections.map(collection => {
            const collectionAssets = collection.assetIds.map(id => assets[id]).filter(Boolean);
            return (
                <div key={collection.id}>
                    <CollectionHeader 
                        collection={collection}
                        assetCount={collectionAssets.length}
                        onDownload={() => handleDownloadCollection(collection)}
                        onDelete={() => handleDeleteCollection(collection)}
                        isDownloading={!!downloadingState[collection.id]}
                    />
                    <AssetGrid
                        assets={collectionAssets}
                        isLoading={false}
                        error={null}
                        onCardClick={onAssetClick}
                        onAddToCollection={onAddToCollection}
                        isAssetInAnyCollection={isAssetInAnyCollection}
                    />
                </div>
            );
        })}
      </div>
    </div>
  );
};
