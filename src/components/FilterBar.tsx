import React from 'react';
import { useState } from 'react';
import { FilterOptions, UserRole } from '../types/user';
import { Search, Filter, Download, UserPlus, Trash2, Power, ChevronDown } from 'lucide-react';
import { userRoles } from '../data/sampleData';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  selectedCount: number;
  onAddUser: () => void;
  onExportUsers: () => void;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
  onBulkDelete: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  selectedCount,
  onAddUser,
  onExportUsers,
  onBulkActivate,
  onBulkDeactivate,
  onBulkDelete
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      {/* Search and Filters Row */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            />
          </div>

          {/* Filters Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {showFilters && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={filters.role}
                      onChange={(e) => onFilterChange({ ...filters, role: e.target.value as UserRole | 'All' })}
                    >
                      <option value="All">All Roles</option>
                      {userRoles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={filters.status}
                      onChange={(e) => onFilterChange({ ...filters, status: e.target.value as 'Active' | 'Inactive' | 'All' })}
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Created From</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={filters.dateCreatedFrom || ''}
                        onChange={(e) => onFilterChange({ ...filters, dateCreatedFrom: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Created To</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={filters.dateCreatedTo || ''}
                        onChange={(e) => onFilterChange({ ...filters, dateCreatedTo: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onAddUser}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </button>
          <button
            onClick={onExportUsers}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Bulk Actions Row */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md">
          <span className="text-sm text-blue-800 font-medium">
            {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={onBulkActivate}
              className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              <Power className="h-3 w-3 mr-1" />
              Activate
            </button>
            <button
              onClick={onBulkDeactivate}
              className="inline-flex items-center px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
            >
              <Power className="h-3 w-3 mr-1" />
              Deactivate
            </button>
            <button
              onClick={onBulkDelete}
              className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};