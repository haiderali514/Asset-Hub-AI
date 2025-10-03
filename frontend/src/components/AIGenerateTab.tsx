
import React, { useState, useEffect } from 'react';
import { generateImage } from '../services/aiService';
import { AssetGrid } from './AssetGrid';
import { AIAccountsManager } from './AIAccountsManager';
import type { Asset, AspectRatio, AIProviderAccount } from '../types';
import { Icon } from './Icon';

interface AIGenerateTabProps {
  onAddToCollection: (asset: Asset) => void;
  isAssetInAnyCollection: (assetId: string) => boolean;
  accounts: AIProviderAccount[];
  onAccountsChange: () => void;
}

const aspectRatios: { value: AspectRatio; label: string }[] = [
    { value: '1:1', label: 'Square' },
    { value: '16:9', label: 'Landscape' },
    { value: '9:16', label: 'Portrait' },
];

export const AIGenerateTab: React.FC<AIGenerateTabProps> = ({ onAddToCollection, isAssetInAnyCollection, accounts, onAccountsChange }) => {
  const [prompt, setPrompt] = useState('A synthwave sunset over a futuristic city');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [selectedProviderId, setSelectedProviderId] = useState<string>('');
  const [generatedAssets, setGeneratedAssets] = useState<Asset[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isManageModalOpen, setManageModalOpen] = useState(false);

  useEffect(() => {
    if (accounts.length > 0 && !selectedProviderId) {
      const defaultAccount = accounts.find(acc => acc.isDefault) || accounts[0];
      setSelectedProviderId(defaultAccount.id);
    }
  }, [accounts, selectedProviderId]);

  const handleGenerate = async () => {
    if (!prompt.trim() || !selectedProviderId) return;
    setIsGenerating(true);
    setError(null);
    setGeneratedAssets([]);
    try {
      const assets = await generateImage(prompt, aspectRatio, selectedProviderId);
      setGeneratedAssets(assets);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate image. ${errorMessage}`);
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="w-full max-w-3xl p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
        <div className="text-center">
            <Icon name="sparkles" className="w-12 h-12 mx-auto text-primary-500 mb-4"/>
            <h2 className="text-2xl font-bold mb-2">AI Image Generation</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Describe the image you want to create. Be as descriptive as you can!</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label htmlFor="ai-provider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">AI Provider</label>
                <select 
                    id="ai-provider"
                    value={selectedProviderId} 
                    onChange={e => setSelectedProviderId(e.target.value)}
                    className="w-full px-3 py-2 text-base bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 invisible">Manage</label>
                <button 
                    onClick={() => setManageModalOpen(true)}
                    className="w-full px-3 py-2 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                    Manage Accounts
                </button>
            </div>
        </div>

        <div className="mb-6">
            <p className="text-sm font-medium text-center text-gray-700 dark:text-gray-300 mb-3">Aspect Ratio</p>
            <div className="flex justify-center gap-2">
                {aspectRatios.map(({ value, label }) => (
                    <button key={value} onClick={() => setAspectRatio(value)}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                            aspectRatio === value ? 'bg-primary-500 text-white shadow' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                        }`}
                    >
                        {label} ({value})
                    </button>
                ))}
            </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <textarea
            value={prompt} onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A cute cat astronaut floating in space"
            className="w-full flex-grow px-4 py-2 text-base bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows={2}
          />
          <button onClick={handleGenerate} disabled={isGenerating || !selectedProviderId}
            className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors disabled:bg-primary-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <><Icon name="loader" className="w-5 h-5 animate-spin" /> Generating...</>
            ) : (
               <><Icon name="sparkles" className="w-5 h-5" /> Generate</>
            )}
          </button>
        </div>
      </div>
      
      <div className="w-full">
        <AssetGrid
          assets={generatedAssets} isLoading={isGenerating} error={error}
          onCardClick={() => {}} // No modal for AI images for now
          onAddToCollection={onAddToCollection} isAssetInAnyCollection={isAssetInAnyCollection}
        />
      </div>

      {isManageModalOpen && (
        <AIAccountsManager 
            accounts={accounts} 
            onClose={() => setManageModalOpen(false)}
            onAccountsChange={onAccountsChange}
        />
      )}
    </div>
  );
};
