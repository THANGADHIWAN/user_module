import React from 'react';
import { User } from '../types/user';
import { formatDistanceToNow } from '../utils/dateUtils';
import { Eye, Edit, Trash2, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

interface UserTableProps {
  users: User[];
  selectedUsers: Set<string>;
  onSelectUser: (userId: string) => void;
  onSelectAll: () => void;
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  sortField: keyof User | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof User) => void;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onViewUser,
  onEditUser,
  onDeleteUser,
  sortField,
  sortDirection,
  onSort,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange
}) => {
  const getSortIcon = (field: keyof User) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    if (status === 'Active') {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    return `${baseClasses} bg-red-100 text-red-800`;
  };

  const getSignatureBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    if (status === 'Enabled') {
      return `${baseClasses} bg-blue-100 text-blue-800`;
    }
    return `${baseClasses} bg-gray-100 text-gray-800`;
  };

  const getRoleBadge = (role: string) => {
    const baseClasses = 'px-2 py-1 rounded-md text-xs font-medium';
    const roleColors: Record<string, string> = {
      'Admin': 'bg-purple-100 text-purple-800',
      'Lab Manager': 'bg-blue-100 text-blue-800',
      'QA Officer': 'bg-green-100 text-green-800',
      'QC Analyst': 'bg-yellow-100 text-yellow-800',
      'Analyst Trainee': 'bg-orange-100 text-orange-800',
      'Auditor': 'bg-red-100 text-red-800',
      'Regulatory Affairs': 'bg-indigo-100 text-indigo-800',
      'IT Support': 'bg-gray-100 text-gray-800'
    };
    return `${baseClasses} ${roleColors[role] || 'bg-gray-100 text-gray-800'}`;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-full">
      {/* Table Header with Pagination Info */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} users
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700">Show:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-700">per page</span>
        </div>
      </div>

      {/* Scrollable Table Container */}
      <div className="flex-1 overflow-hidden">
        <div className="overflow-auto h-full" style={{maxHeight: 'calc(100vh - 320px)'}}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-3 text-left bg-gray-50">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedUsers.size === users.length && users.length > 0}
                    onChange={onSelectAll}
                  />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50 sticky top-0"
                  onClick={() => onSort('name')}
                >
                  User Name {getSortIcon('name')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50 sticky top-0"
                  onClick={() => onSort('role')}
                >
                  Role {getSortIcon('role')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50 sticky top-0"
                  onClick={() => onSort('status')}
                >
                  Status {getSortIcon('status')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50 sticky top-0"
                  onClick={() => onSort('lastLogin')}
                >
                  Last Login {getSortIcon('lastLogin')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50 sticky top-0"
                  onClick={() => onSort('digitalSignatureStatus')}
                >
                  Digital Signature {getSortIcon('digitalSignatureStatus')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50 sticky top-0"
                  onClick={() => onSort('createdDate')}
                >
                  Created Date {getSortIcon('createdDate')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                  Actions
                </th>
              </tr>
            </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedUsers.has(user.id)}
                    onChange={() => onSelectUser(user.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getRoleBadge(user.role)}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(user.status)}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin ? formatDistanceToNow(user.lastLogin) : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getSignatureBadge(user.digitalSignatureStatus)}>
                    {user.digitalSignatureStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDistanceToNow(user.createdDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onViewUser(user)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="View User"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEditUser(user)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                      title="Edit User"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteUser(user)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title="Delete User"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      {/* Fixed Pagination Controls */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let pageNum;
            if (totalPages <= 7) {
              pageNum = i + 1;
            } else if (currentPage <= 4) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 3) {
              pageNum = totalPages - 6 + i;
            } else {
              pageNum = currentPage - 3 + i;
            }

            if (pageNum < 1 || pageNum > totalPages) return null;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <div className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    </div>
  );
};