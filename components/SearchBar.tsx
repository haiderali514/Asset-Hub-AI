import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { useDebounce } from '../hooks/useDebounce';
import { fetchSearchSuggestions } from '../services/assetService';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  suggestions?: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery = '', suggestions: localSuggestions = [] }) => {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);
  const [apiSuggestions, setApiSuggestions] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (debouncedQuery.trim().length > 1) {
      setIsFetching(true);
      fetchSearchSuggestions(debouncedQuery)
        .then(setApiSuggestions)
        .catch(err => {
          console.error("Failed to fetch API suggestions", err);
          setApiSuggestions([]);
        })
        .finally(() => setIsFetching(false));
    } else {
      setApiSuggestions([]);
    }
  }, [debouncedQuery]);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
      if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(e.target.value.trim().length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const lowerCaseQuery = query.toLowerCase();
  const filteredLocal = localSuggestions.filter(s => 
      s.toLowerCase().includes(lowerCaseQuery) && 
      s.toLowerCase() !== lowerCaseQuery
  );
  const filteredApi = apiSuggestions.filter(s => s.toLowerCase().includes(lowerCaseQuery));

  const finalSuggestions = [...new Set([...filteredLocal, ...filteredApi])].slice(0, 7);
  const showDropdown = showSuggestions && (finalSuggestions.length > 0 || isFetching);

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto" ref={wrapperRef}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => { if(query.trim()) setShowSuggestions(true); }}
        placeholder="Search for images, videos, icons..."
        className="w-full px-5 py-3 pr-12 text-base text-gray-800 bg-white dark:text-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
        autoComplete="off"
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 rounded-r-full"
        aria-label="Search"
      >
        <Icon name="search" className="w-6 h-6" />
      </button>

      {showDropdown && (
        <ul className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 overflow-hidden">
          {isFetching && finalSuggestions.length === 0 && (
             <li className="px-5 py-3 text-sm text-center text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
              <Icon name="loader" className="w-4 h-4 animate-spin" />
              <span>Searching for suggestions...</span>
            </li>
          )}
          {finalSuggestions.map(suggestion => (
            <li
              key={suggestion}
              className="px-5 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm flex items-center gap-3"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSuggestionClick(suggestion);
              }}
            >
              <Icon name={localSuggestions.includes(suggestion) ? 'history' : 'search'} className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{suggestion}</span>
            </li>
          ))}
           {!isFetching && finalSuggestions.length === 0 && query.length > 1 && (
             <li className="px-5 py-3 text-sm text-center text-gray-500 dark:text-gray-400">
               No suggestions found.
             </li>
          )}
        </ul>
      )}
    </form>
  );
};