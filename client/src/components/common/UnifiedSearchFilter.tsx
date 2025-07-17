import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface UnifiedSearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: {
    [key: string]: {
      value: string;
      options: FilterOption[];
      label: string;
    };
  };
  onFilterChange: (filterKey: string, value: string) => void;
  onClearAll: () => void;
  sortOptions?: FilterOption[];
  sortValue?: string;
  onSortChange?: (value: string) => void;
  groupOptions?: FilterOption[];
  groupValue?: string;
  onGroupChange?: (value: string) => void;
}

export const UnifiedSearchFilter: React.FC<UnifiedSearchFilterProps> = ({
  searchValue,
  onSearchChange,
  filters,
  onFilterChange,
  onClearAll,
  sortOptions,
  sortValue,
  onSortChange,
  groupOptions,
  groupValue,
  onGroupChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = Object.values(filters).some(filter => filter.value !== 'All') || 
                          searchValue.length > 0 || 
                          (sortValue && sortValue !== 'name') ||
                          (groupValue && groupValue !== 'none');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Advanced Filters</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Dynamic Filters */}
            {Object.entries(filters).map(([key, filter]) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {filter.label}
                </label>
                <select
                  value={filter.value}
                  onChange={(e) => onFilterChange(key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {filter.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* Sort Options */}
            {sortOptions && onSortChange && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Sort By
                </label>
                <select
                  value={sortValue}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Group Options */}
            {groupOptions && onGroupChange && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Group By
                </label>
                <select
                  value={groupValue}
                  onChange={(e) => onGroupChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {groupOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};