
import React, { useState } from 'react';
import type { Asset, Collection } from '../types';
import { Icon } from './Icon';

interface AddToCollectionModalProps {
  asset: Asset;
  onClose: () => void;
  collections: Collection[];
  assetCollectionIds: string[];
  onToggleAssetInCollection: (asset: Asset, collectionId: string) => void;
  onCreateCollection: (name: string, assetToAdd?: Asset) => Collection;
}

export const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({ 
    asset, onClose, collections, assetCollectionIds, onToggleAssetInCollection, onCreateCollection 
}) => {

    const [isCreating, setIsCreating] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');

    const handleCreate = () => {
        if (newCollectionName.trim()) {
            onCreateCollection(newCollectionName, asset);
            setNewCollectionName('');
            setIsCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold">Add to Collection</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <Icon name="close" className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-3">
                    {collections.length > 0 ? (
                        collections.map(collection => (
                            <label key={collection.id} className="flex items-center p-3 -m-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={assetCollectionIds.includes(collection.id)}
                                    onChange={() => onToggleAssetInCollection(asset, collection.id)}
                                    className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="ml-3 text-gray-800 dark:text-gray-200">{collection.name}</span>
                            </label>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No collections yet. Create one below!</p>
                    )}
                </div>

                <div className="p-6 mt-auto border-t dark:border-gray-700">
                    {isCreating ? (
                        <div className="flex items-center gap-2">
                            <input 
                                type="text"
                                value={newCollectionName}
                                onChange={e => setNewCollectionName(e.target.value)}
                                placeholder="New collection name..."
                                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                autoFocus
                            />
                            <button onClick={handleCreate} className="px-4 py-2 bg-primary-500 text-white font-semibold rounded-md hover:bg-primary-600">Create</button>
                        </div>
                    ) : (
                        <button onClick={() => setIsCreating(true)} className="w-full py-2 px-4 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold">
                            Create New Collection
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
