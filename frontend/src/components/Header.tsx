
import React from 'react';
import type { Tab } from '../types';
import { Icon } from './Icon';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const NavButton: React.FC<{
  label: string;
  icon: 'search' | 'sparkles' | 'heart';
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-primary-500 text-white'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}
  >
    <Icon name={icon} className="w-5 h-5" />
    <span className="hidden md:inline">{label}</span>
  </button>
);

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, theme, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Icon name="logo" className="w-8 h-8 text-primary-500" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">AssetHub AI</h1>
          </div>
          
          <nav className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <NavButton label="Search" icon="search" isActive={activeTab === 'search'} onClick={() => setActiveTab('search')} />
            <NavButton label="AI Generate" icon="sparkles" isActive={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
            <NavButton label="Collections" icon="heart" isActive={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')} />
          </nav>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Icon name="moon" className="w-6 h-6" /> : <Icon name="sun" className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
};
