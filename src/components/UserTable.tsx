import React from 'react';
import { User } from '../types/user';
import { formatDistanceToNow } from '../utils/dateUtils';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

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
  onPageChange: (page: number) => void;
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
  onPageChange
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
    <div className="bg-white rounded-lg shadow flex flex-col h-full">
      {/* Scrollable Table Container */}
      <div className="flex-1 overflow-hidden">
        <div className="overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-4 py-3 text-left bg-gray-50 sticky top-0 z-10 w-12">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedUsers.size === users.length && users.length > 0}
                    onChange={onSelectAll}
                  />
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50 sticky top-0 z-10"
                  onClick={() => onSort('name')}
                  style={{ width: '25%' }}
                >
                  User Name {getSortIcon('name')}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50 sticky top-0 z-10"
                  onClick={() => onSort('role')}
                  style={{ width: '12%' }}
                >
                  Role {getSortIcon('role')}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50 sticky top-0 z-10"
                  onClick={() => onSort('status')}
                  style={{ width: '10%' }}
                >
                  Status {getSortIcon('status')}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50 sticky top-0 z-10"
                  onClick={() => onSort('lastLogin')}
                  style={{ width: '12%' }}
                >
                  Last Login {getSortIcon('lastLogin')}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50 sticky top-0 z-10"
                  onClick={() => onSort('digitalSignatureStatus')}
                  style={{ width: '13%' }}
                >
                  Digital Signature {getSortIcon('digitalSignatureStatus')}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50 sticky top-0 z-10"
                  onClick={() => onSort('createdDate')}
                  style={{ width: '12%' }}
                >
                  Created Date {getSortIcon('createdDate')}
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 z-10" style={{ width: '8%' }}>
                  Actions
                </th>
              </tr>
            </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 relative">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedUsers.has(user.id)}
                    onChange={() => onSelectUser(user.id)}
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                      <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={getRoleBadge(user.role)}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={getStatusBadge(user.status)}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {user.lastLogin ? formatDistanceToNow(user.lastLogin) : 'Never'}
                </td>
                <td className="px-4 py-4">
                  <span className={getSignatureBadge(user.digitalSignatureStatus)}>
                    {user.digitalSignatureStatus}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {formatDistanceToNow(user.createdDate)}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2 relative">
                    <div className="relative group">
                      <button
                        onClick={() => onViewUser(user)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                        View User
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                    <div className="relative group">
                      <button
                        onClick={() => onEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                        Edit User
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                    <div className="relative group">
                      <button
                        onClick={() => onDeleteUser(user)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                        Delete User
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      {/* Compact Pagination Controls */}
      <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-3 w-3 mr-1" />
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-3 w-3 ml-1" />
          </button>
        </div>

        <div className="text-xs text-gray-700">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    </div>
  );
};