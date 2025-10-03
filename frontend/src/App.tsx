import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { Filters } from './components/Filters';
import { AssetGrid } from './components/AssetGrid';
import { AIGenerateTab } from './components/AIGenerateTab';
import { CollectionsTab } from './components/CollectionsTab';
import { ProfileTab } from './components/ProfileTab';
import { AssetModal } from './components/AssetModal';
import { AddToCollectionModal } from './components/AddToCollectionModal';
import { LoginModal } from './components/LoginModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { fetchAssets } from './services/assetService';
import { getLinkedAccounts } from './services/aiService';
import type { Asset, FilterOptions, Tab, AIProviderAccount, Collection, User } from './types';

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
  
  // Infinite scroll state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>('searchHistory', []);
  const [aiAccounts, setAiAccounts] = useState<AIProviderAccount[]>([]);
  
  // Account state
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // New state for collections
  const [collections, setCollections] = useLocalStorage<Collection[]>('collections', []);
  const [favoritedAssets, setFavoritedAssets] = useLocalStorage<{ [id: string]: Asset }>('favoritedAssets', {});
  const [collectionModalState, setCollectionModalState] = useState<{ asset: Asset | null }>({ asset: null });

  // One-time migration from old favorites system
  useEffect(() => {
    const oldFavoritesRaw = localStorage.getItem('favorites');
    if (oldFavoritesRaw) {
      try {
        const oldFavorites: Asset[] = JSON.parse(oldFavoritesRaw);
        if (Array.isArray(oldFavorites) && oldFavorites.length > 0 && collections.length === 0) {
          const newAssetsMap: { [id: string]: Asset } = {};
          const assetIds: string[] = [];

          oldFavorites.forEach(asset => {
            newAssetsMap[asset.id] = asset;
            assetIds.push(asset.id);
          });
          
          const defaultCollection: Collection = {
            id: `collection-${Date.now()}`,
            name: 'My Favorites',
            assetIds: assetIds,
          };

          setCollections([defaultCollection]);
          setFavoritedAssets(newAssetsMap);
        }
      } catch (e) {
        console.error('Failed to migrate old favorites:', e);
      } finally {
        localStorage.removeItem('favorites'); // Clean up old key
      }
    }
  }, [collections.length, setCollections, setFavoritedAssets]);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const refreshAiAccounts = useCallback(async () => {
    try {
      const accounts = await getLinkedAccounts();
      setAiAccounts(accounts);
    } catch (err) {
      console.error("Failed to fetch AI accounts", err);
    }
  }, []);

  useEffect(() => {
    refreshAiAccounts();
  }, [refreshAiAccounts]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  // --- Auth Handlers ---
  const handleLogin = () => {
      setUser({ id: 'demo-user', name: 'Demo User', email: 'demo@assethub.ai' });
      setIsLoginModalOpen(false);
  };
  const handleLogout = () => {
      setUser(null);
      setActiveTab('search'); // Redirect to search page after logout
  };
  const handleUpdateUser = (updatedUser: Partial<User>) => {
      if (user) {
          setUser({ ...user, ...updatedUser });
      }
  };


  // --- Data Fetching & Infinite Scroll ---

  const loadAssets = useCallback(async (query: string, searchFilters: FilterOptions, pageNum: number) => {
    if (!query) return;
    setIsLoading(true);
    setError(null);
    
    try {
      const { assets: fetchedAssets, hasMore: newHasMore } = await fetchAssets(query, searchFilters, pageNum);
      setAssets(prev => pageNum === 1 ? fetchedAssets : [...prev, ...fetchedAssets]);
      setHasMore(newHasMore);
    } catch (err) {
      setError('Failed to fetch assets. Please check your network and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Effect for initial load and subsequent searches/filter changes
  useEffect(() => {
    if (activeTab === 'search') {
      setAssets([]);
      setPage(1);
      setHasMore(true);
      loadAssets(searchQuery, filters, 1);
    }
  }, [searchQuery, filters, activeTab, loadAssets]);
  
  // Effect for loading more assets on page change
  useEffect(() => {
    if (page > 1 && activeTab === 'search') {
      loadAssets(searchQuery, filters, page);
    }
  }, [page, activeTab, searchQuery, filters, loadAssets]);

  // Effect for scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 500 || isLoading || !hasMore) {
        return;
      }
      setPage(prevPage => prevPage + 1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore]);


  const onSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setSearchHistory(prev => {
        const lowerCaseQuery = query.toLowerCase();
        const newHistory = [ query, ...prev.filter(item => item.toLowerCase() !== lowerCaseQuery) ];
        return newHistory.slice(0, 10);
    });
  };

  const onFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
  };
  
  // --- Collection Management ---

  const handleOpenCollectionModal = (asset: Asset) => setCollectionModalState({ asset });
  const handleCloseCollectionModal = () => setCollectionModalState({ asset: null });

  const isAssetInAnyCollection = (assetId: string) => collections.some(c => c.assetIds.includes(assetId));
  const getCollectionsForAsset = (assetId: string) => collections.filter(c => c.assetIds.includes(assetId)).map(c => c.id);

  const toggleAssetInCollection = (asset: Asset, collectionId: string) => {
    if (!favoritedAssets[asset.id]) {
      setFavoritedAssets(prev => ({ ...prev, [asset.id]: asset }));
    }
    setCollections(prev => prev.map(c => {
      if (c.id === collectionId) {
        const newAssetIds = c.assetIds.includes(asset.id)
          ? c.assetIds.filter(id => id !== asset.id)
          : [...c.assetIds, asset.id];
        return { ...c, assetIds: newAssetIds };
      }
      return c;
    }));
  };

  const createCollection = (name: string, assetToAdd?: Asset): Collection => {
    if (assetToAdd && !favoritedAssets[assetToAdd.id]) {
      setFavoritedAssets(prev => ({ ...prev, [assetToAdd.id]: assetToAdd }));
    }
    const newCollection: Collection = {
      id: `collection-${Date.now()}`,
      name,
      assetIds: assetToAdd ? [assetToAdd.id] : [],
    };
    setCollections(prev => [...prev, newCollection]);
    return newCollection;
  };

  const deleteCollection = (collectionId: string) => {
    setCollections(prev => prev.filter(c => c.id !== collectionId));
  };
  
  // --- Render Logic ---

  const renderContent = () => {
    switch (activeTab) {
      case 'search':
        return (
            <>
                <AssetGrid
                  assets={assets}
                  isLoading={isLoading}
                  error={error}
                  onCardClick={setSelectedAsset}
                  onAddToCollection={handleOpenCollectionModal}
                  isAssetInAnyCollection={isAssetInAnyCollection}
                />
                {!isLoading && !hasMore && assets.length > 0 && (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        <p>You've reached the end of the results.</p>
                    </div>
                )}
            </>
        );
      case 'ai':
        return <AIGenerateTab 
                  onAddToCollection={handleOpenCollectionModal}
                  isAssetInAnyCollection={isAssetInAnyCollection}
                  accounts={aiAccounts}
                  onAccountsChange={refreshAiAccounts}
               />;
      case 'favorites':
        return (
          <CollectionsTab
            collections={collections}
            assets={favoritedAssets}
            onAssetClick={setSelectedAsset}
            onAddToCollection={handleOpenCollectionModal}
            isAssetInAnyCollection={isAssetInAnyCollection}
            onCreateCollection={createCollection}
            onDeleteCollection={deleteCollection}
          />
        );
      case 'profile':
        if (!user) {
            setActiveTab('search');
            return null;
        }
        return (
            <ProfileTab 
                user={user}
                onUpdateUser={handleUpdateUser}
                collectionsTab={
                    <CollectionsTab
                        collections={collections}
                        assets={favoritedAssets}
                        onAssetClick={setSelectedAsset}
                        onAddToCollection={handleOpenCollectionModal}
                        isAssetInAnyCollection={isAssetInAnyCollection}
                        onCreateCollection={createCollection}
                        onDeleteCollection={deleteCollection}
                    />
                }
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
        user={user}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />
      <main className="container mx-auto p-4 md:p-8">
        {activeTab === 'search' && (
          <>
            <div className="mb-8">
              <SearchBar 
                onSearch={onSearchSubmit} 
                initialQuery={searchQuery} 
                searchHistory={searchHistory}
              />
            </div>
            <div className="mb-8">
              <Filters filters={filters} onFilterChange={onFilterChange} />
            </div>
          </>
        )}
        {renderContent()}
      </main>
      {selectedAsset && (
        <AssetModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onAddToCollection={handleOpenCollectionModal}
          isAssetInAnyCollection={isAssetInAnyCollection(selectedAsset.id)}
        />
      )}
      {collectionModalState.asset && (
        <AddToCollectionModal
          asset={collectionModalState.asset}
          onClose={handleCloseCollectionModal}
          collections={collections}
          assetCollectionIds={getCollectionsForAsset(collectionModalState.asset.id)}
          onToggleAssetInCollection={toggleAssetInCollection}
          onCreateCollection={createCollection}
        />
      )}
      {isLoginModalOpen && (
        <LoginModal 
            onClose={() => setIsLoginModalOpen(false)}
            onLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default App;