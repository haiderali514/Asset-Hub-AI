
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { Filters } from './components/Filters';
import { AssetGrid } from './components/AssetGrid';
import { AIGenerateTab } from './components/AIGenerateTab';
import { FavoritesTab } from './components/FavoritesTab';
import { AssetModal } from './components/AssetModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { fetchAssets } from './services/assetService';
import type { Asset, FilterOptions, Tab } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('synthwave');
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'photo',
    orientation: 'all',
  });
  const [favorites, setFavorites] = useLocalStorage<Asset[]>('favorites', []);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>('searchHistory', []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSearch = useCallback(async (query: string, searchFilters: FilterOptions) => {
    if (!query) return;
    setIsLoading(true);
    setError(null);
    setAssets([]);
    try {
      const fetchedAssets = await fetchAssets(query, searchFilters);
      setAssets(fetchedAssets);
    } catch (err) {
      setError('Failed to fetch assets. Please check your API keys and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleSearch(searchQuery, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const onSearchSubmit = (query: string) => {
    setSearchQuery(query);
    handleSearch(query, filters);
    
    // Add term to search history
    setSearchHistory(prev => {
        const lowerCaseQuery = query.toLowerCase();
        // Add new query to the front, remove duplicates, and limit to 10 items
        const newHistory = [
            query, 
            ...prev.filter(item => item.toLowerCase() !== lowerCaseQuery)
        ];
        return newHistory.slice(0, 10);
    });
  };

  const onFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    handleSearch(searchQuery, updatedFilters);
  };
  
  const handleFavoriteToggle = (asset: Asset) => {
    setFavorites(prev =>
      prev.some(fav => fav.id === asset.id)
        ? prev.filter(fav => fav.id !== asset.id)
        : [...prev, asset]
    );
  };

  const isFavorited = (assetId: string) => {
    return favorites.some(fav => fav.id === assetId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'search':
        return (
          <div className="flex flex-col md:flex-row gap-8">
            <Filters filters={filters} onFilterChange={onFilterChange} />
            <div className="flex-grow">
              <AssetGrid
                assets={assets}
                isLoading={isLoading}
                error={error}
                onCardClick={setSelectedAsset}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorited={isFavorited}
              />
            </div>
          </div>
        );
      case 'ai':
        return <AIGenerateTab onFavoriteToggle={handleFavoriteToggle} isFavorited={isFavorited} />;
      case 'favorites':
        return (
          <FavoritesTab
            favorites={favorites}
            onCardClick={setSelectedAsset}
            onFavoriteToggle={handleFavoriteToggle}
            isFavorited={isFavorited}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-gray-800 bg-gray-100 dark:text-gray-200 dark:bg-gray-900 font-sans transition-colors duration-300">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="container mx-auto p-4 md:p-8">
        {activeTab === 'search' && (
          <div className="mb-8">
            <SearchBar 
              onSearch={onSearchSubmit} 
              initialQuery={searchQuery} 
              suggestions={searchHistory}
            />
          </div>
        )}
        {renderContent()}
      </main>
      {selectedAsset && (
        <AssetModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onFavoriteToggle={handleFavoriteToggle}
          isFavorited={isFavorited(selectedAsset.id)}
        />
      )}
    </div>
  );
};

export default App;
