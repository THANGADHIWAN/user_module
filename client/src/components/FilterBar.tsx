import React from 'react';
import { FilterOptions, UserRole } from '../types/user';
import { Search, Filter, Download, UserPlus, Trash2, Power } from 'lucide-react';
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
  return (
    <div className="card">
      {/* Search and Filters Row */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="form-input pl-10"
                value={filters.search}
                onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              />
            </div>

            {/* Role Filter */}
            <select
              className="form-input min-w-[140px]"
              value={filters.role}
              onChange={(e) => onFilterChange({ ...filters, role: e.target.value as UserRole | 'All' })}
            >
              <option value="All">All Roles</option>
              {userRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="form-input min-w-[120px]"
              value={filters.status}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value as 'Active' | 'Inactive' | 'All' })}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onAddUser}
              className="btn-primary inline-flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </button>
            <button
              onClick={onExportUsers}
              className="btn-secondary inline-flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Row */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-100 mx-6 mt-4 p-4 rounded-lg animate-slide-up">
          <span className="text-sm text-blue-800 font-semibold">
            {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={onBulkActivate}
              className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
            >
              <Power className="h-3 w-3 mr-1" />
              Activate
            </button>
            <button
              onClick={onBulkDeactivate}
              className="inline-flex items-center px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Power className="h-3 w-3 mr-1" />
              Deactivate
            </button>
            <button
              onClick={onBulkDelete}
              className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Advanced Filters Row */}
      <div className="p-6 border-t border-gray-100 bg-gray-25">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Created From</label>
            <input
              type="date"
              className="form-input text-sm"
              value={filters.dateCreatedFrom || ''}
              onChange={(e) => onFilterChange({ ...filters, dateCreatedFrom: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Created To</label>
            <input
              type="date"
              className="form-input text-sm"
              value={filters.dateCreatedTo || ''}
              onChange={(e) => onFilterChange({ ...filters, dateCreatedTo: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Last Login From</label>
            <input
              type="date"
              className="form-input text-sm"
              value={filters.lastLoginFrom || ''}
              onChange={(e) => onFilterChange({ ...filters, lastLoginFrom: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Last Login To</label>
            <input
              type="date"
              className="form-input text-sm"
              value={filters.lastLoginTo || ''}
              onChange={(e) => onFilterChange({ ...filters, lastLoginTo: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};