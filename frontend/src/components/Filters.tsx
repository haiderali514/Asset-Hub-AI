
import React from 'react';
import type { FilterOptions } from '../types';

interface FiltersProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: Partial<FilterOptions>) => void;
}

const FilterButton: React.FC<{ label: string; value: string; isActive: boolean; onClick: (value: string) => void }> = ({ label, value, isActive, onClick }) => (
    <button
        onClick={() => onClick(value)}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
            isActive
                ? 'bg-primary-500 text-white shadow'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
        }`}
    >
        {label}
    </button>
);


export const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-x-8 gap-y-4 flex-wrap">
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400 shrink-0">Type</h3>
        <div className="flex flex-wrap gap-2">
            <FilterButton label="All" value="all" isActive={filters.type === 'all'} onClick={(v) => onFilterChange({ type: v as FilterOptions['type'] })} />
            <FilterButton label="Photos" value="photo" isActive={filters.type === 'photo'} onClick={(v) => onFilterChange({ type: v as FilterOptions['type'] })} />
            <FilterButton label="Videos" value="video" isActive={filters.type === 'video'} onClick={(v) => onFilterChange({ type: v as FilterOptions['type'] })} />
            <FilterButton label="Illustrations" value="illustration" isActive={filters.type === 'illustration'} onClick={(v) => onFilterChange({ type: v as FilterOptions['type'] })} />
            <FilterButton label="Icons" value="icon" isActive={filters.type === 'icon'} onClick={(v) => onFilterChange({ type: v as FilterOptions['type'] })} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400 shrink-0">Orientation</h3>
        <div className="flex flex-wrap gap-2">
            <FilterButton label="All" value="all" isActive={filters.orientation === 'all'} onClick={(v) => onFilterChange({ orientation: v as FilterOptions['orientation'] })} />
            <FilterButton label="Horizontal" value="horizontal" isActive={filters.orientation === 'horizontal'} onClick={(v) => onFilterChange({ orientation: v as FilterOptions['orientation'] })} />
            <FilterButton label="Vertical" value="vertical" isActive={filters.orientation === 'vertical'} onClick={(v) => onFilterChange({ orientation: v as FilterOptions['orientation'] })} />
        </div>
      </div>
    </div>
  );
};
