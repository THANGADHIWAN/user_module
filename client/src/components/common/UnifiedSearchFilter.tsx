import React from 'react';
import { Search, Filter, Group, Calendar, X } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  value: string;
  options: FilterOption[];
  label: string;
}

interface UnifiedSearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: Record<string, FilterConfig>;
  onFilterChange: (filterKey: string, value: string) => void;
  onClearAll: () => void;
  sortOptions: FilterOption[];
  sortValue: string;
  onSortChange: (value: string) => void;
  groupOptions: FilterOption[];
  groupValue: string;
  onGroupChange: (value: string) => void;
  dateFilter?: {
    value: string;
    onChange: (value: string) => void;
  };
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
  dateFilter
}) => {
  const hasActiveFilters = searchValue || 
    Object.values(filters).some(filter => filter.value !== 'All' && filter.value !== 'none') ||
    sortValue !== sortOptions[0]?.value ||
    groupValue !== 'none' ||
    (dateFilter && dateFilter.value !== 'All');

  // Get visible filters based on group selection
  const getVisibleFilters = () => {
    if (groupValue === 'none') {
      return {}; // No filters when no grouping
    }
    
    // Show all filters when grouping is selected
    return filters;
  };

  const visibleFilters = getVisibleFilters();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Single Row Layout */}
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* Left Side - Search */}
        <div className="relative min-w-0 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm w-64"
          />
        </div>

        {/* Center - Filters in a row */}
        <div className="flex items-center space-x-6 flex-1 justify-center">
          {/* Group By */}
          <div className="flex items-center space-x-2">
            <Group className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700 font-medium">Group by:</span>
            <select
              value={groupValue}
              onChange={(e) => onGroupChange(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white min-w-24"
            >
              {groupOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter - Show only one at a time based on group selection */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700 font-medium">Filter:</span>
            {groupValue === 'none' ? (
              // Show the first filter when no grouping is selected
              Object.entries(filters).slice(0, 1).map(([key, config]) => (
                <select
                  key={key}
                  value={config.value}
                  onChange={(e) => onFilterChange(key, e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white min-w-32"
                >
                  {config.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ))
            ) : (
              // Show different filters based on group selection
              Object.entries(filters)
                .filter(([key]) => key !== groupValue)
                .slice(0, 1)
                .map(([key, config]) => (
                  <select
                    key={key}
                    value={config.value}
                    onChange={(e) => onFilterChange(key, e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white min-w-32"
                  >
                    {config.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ))
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 font-medium">Sort:</span>
            <select
              value={sortValue}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white min-w-24"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          {dateFilter && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">Created:</span>
              <select
                value={dateFilter.value}
                onChange={(e) => dateFilter.onChange(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white min-w-28"
              >
                <option value="All">All Dates</option>
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 90 Days">Last 90 Days</option>
              </select>
            </div>
          )}
        </div>

        {/* Right Side - Clear Button */}
        <div>
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};