
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { AssetGrid } from './AssetGrid';
import type { Asset } from '../types';
import { Icon } from './Icon';

interface AIGenerateTabProps {
  onFavoriteToggle: (asset: Asset) => void;
  isFavorited: (assetId: string) => boolean;
}

export const AIGenerateTab: React.FC<AIGenerateTabProps> = ({ onFavoriteToggle, isFavorited }) => {
  const [prompt, setPrompt] = useState('A synthwave sunset over a futuristic city');
  const [generatedAssets, setGeneratedAssets] = useState<Asset[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    setGeneratedAssets([]);
    try {
      const assets = await generateImage(prompt);
      setGeneratedAssets(assets);
    } catch (err) {
      setError('Failed to generate image. Please try again later.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="w-full max-w-2xl p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-center">
        <Icon name="sparkles" className="w-12 h-12 mx-auto text-primary-500 mb-4"/>
        <h2 className="text-2xl font-bold mb-2">AI Image Generation</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Describe the image you want to create. Be as descriptive as you can!</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A cute cat astronaut floating in space"
            className="w-full flex-grow px-4 py-2 text-base bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows={2}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Icon name="loader" className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
               <>
                <Icon name="sparkles" className="w-5 h-5" />
                Generate
               </>
            )}
          </button>
        </div>
      </div>
      
      <div className="w-full">
        <AssetGrid
          assets={generatedAssets}
          isLoading={isGenerating}
          error={error}
          onCardClick={() => {}} // No modal for AI images for now
          onFavoriteToggle={onFavoriteToggle}
          isFavorited={isFavorited}
        />
      </div>
    </div>
  );
};
