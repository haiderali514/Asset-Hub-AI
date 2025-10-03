
import React, { useState, useEffect } from 'react';
import type { Asset } from '../types';
import { Icon } from './Icon';

interface AssetModalProps {
  asset: Asset;
  onClose: () => void;
  onAddToCollection: (asset: Asset) => void;
  isAssetInAnyCollection: boolean;
}

export const AssetModal: React.FC<AssetModalProps> = ({ asset, onClose, onAddToCollection, isAssetInAnyCollection }) => {
  const [copied, setCopied] = useState(false);
  const attributionText = `Photo by ${asset.author} on ${asset.source}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(attributionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-2/3 flex items-center justify-center bg-black/50">
           <img src={asset.largeImageURL} alt={asset.tags.join(', ')} className="max-h-[90vh] w-auto h-auto object-contain" />
        </div>
        <div className="w-full md:w-1/3 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
                 <h2 className="text-xl font-bold capitalize">{asset.tags[0] || 'Asset Details'}</h2>
                 <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
                    <Icon name="close" className="w-6 h-6" />
                 </button>
            </div>
            
            <div className="text-sm space-y-3 mb-6 flex-grow">
                <p><strong>Author:</strong> {asset.author}</p>
                <p><strong>Source:</strong> {asset.source}</p>
                <p><strong>License:</strong> <a href={asset.downloadURL} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">{asset.license}</a></p>
                <div className="flex flex-wrap gap-2">
                    {asset.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">{tag}</span>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Attribution:</p>
                  <div className="flex items-center">
                      <p className="text-sm font-mono flex-grow mr-2">{attributionText}</p>
                      <button onClick={handleCopy} className="p-2 rounded text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600">
                          <Icon name={copied ? 'check' : 'copy'} className="w-5 h-5"/>
                      </button>
                  </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => onAddToCollection(asset)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                    isAssetInAnyCollection ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon name="heart" filled={isAssetInAnyCollection} className="w-5 h-5" />
                  {isAssetInAnyCollection ? 'In Collection' : 'Add to Collection'}
                </button>
                 <a
                    href={asset.downloadURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
                >
                    <Icon name="download" className="w-5 h-5" />
                    Download
                </a>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};
