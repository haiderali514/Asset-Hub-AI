
import React from 'react';
import type { FilterOptions } from '../types';

interface FiltersProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: Partial<FilterOptions>) => void;
}

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">{title}</h3>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

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
    <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
        <h2 className="text-lg font-bold mb-6">Filters</h2>
        
        <FilterSection title="Type">
          <FilterButton label="All" value="all" isActive={filters.type === 'all'} onClick={(v) => onFilterChange({ type: v as FilterOptions['type'] })} />
          <FilterButton label="Photos" value="photo" isActive={filters.type === 'photo'} onClick={(v) => onFilterChange({ type: v as FilterOptions['type'] })} />
          <FilterButton label="Illustrations" value="illustration" isActive={filters.type === 'illustration'} onClick={(v) => onFilterChange({ type: v as FilterOptions['type'] })} />
        </FilterSection>

        <FilterSection title="Orientation">
          <FilterButton label="All" value="all" isActive={filters.orientation === 'all'} onClick={(v) => onFilterChange({ orientation: v as FilterOptions['orientation'] })} />
          <FilterButton label="Horizontal" value="horizontal" isActive={filters.orientation === 'horizontal'} onClick={(v) => onFilterChange({ orientation: v as FilterOptions['orientation'] })} />
          <FilterButton label="Vertical" value="vertical" isActive={filters.orientation === 'vertical'} onClick={(v) => onFilterChange({ orientation: v as FilterOptions['orientation'] })} />
        </FilterSection>
      </div>
    </aside>
  );
};
