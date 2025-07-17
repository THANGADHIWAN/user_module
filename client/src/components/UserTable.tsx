import React from 'react';
import { User } from '../types/user';
import { formatDistanceToNow } from '../utils/dateUtils';
import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';

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
  onSort
}) => {
  const getSortIcon = (field: keyof User) => {
    if (sortField !== field) {
      return <span className="text-gray-300 ml-1">↕</span>;
    }
    return sortDirection === 'asc' ? 
      <span className="text-blue-600 ml-1">↑</span> : 
      <span className="text-blue-600 ml-1">↓</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Active') {
      return 'badge-success';
    }
    return 'badge-error';
  };

  const getSignatureBadge = (status: string) => {
    if (status === 'Enabled') {
      return 'badge-info';
    }
    return 'badge-neutral';
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      'Admin': 'bg-purple-50 text-purple-700 border-purple-200',
      'Lab Manager': 'bg-blue-50 text-blue-700 border-blue-200',
      'QA Officer': 'bg-green-50 text-green-700 border-green-200',
      'QC Analyst': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Analyst Trainee': 'bg-orange-50 text-orange-700 border-orange-200',
      'Auditor': 'bg-red-50 text-red-700 border-red-200',
      'Regulatory Affairs': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'IT Support': 'bg-gray-50 text-gray-700 border-gray-200'
    };
    const baseClasses = 'px-2.5 py-1 rounded-full text-xs font-medium border';
    return `${baseClasses} ${roleColors[role] || 'badge-neutral'}`;
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-modern">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" className="table-header w-12">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  checked={selectedUsers.size === users.length && users.length > 0}
                  onChange={onSelectAll}
                />
              </th>
              <th
                scope="col"
                className="table-header cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center">
                  User Name 
                  {getSortIcon('name')}
                </div>
              </th>
              <th
                scope="col"
                className="table-header cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('role')}
              >
                <div className="flex items-center">
                  Role 
                  {getSortIcon('role')}
                </div>
              </th>
              <th
                scope="col"
                className="table-header cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('status')}
              >
                <div className="flex items-center">
                  Status 
                  {getSortIcon('status')}
                </div>
              </th>
              <th
                scope="col"
                className="table-header cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('lastLogin')}
              >
                <div className="flex items-center">
                  Last Login 
                  {getSortIcon('lastLogin')}
                </div>
              </th>
              <th
                scope="col"
                className="table-header cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('digitalSignatureStatus')}
              >
                <div className="flex items-center">
                  Digital Signature 
                  {getSortIcon('digitalSignatureStatus')}
                </div>
              </th>
              <th
                scope="col"
                className="table-header cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('createdDate')}
              >
                <div className="flex items-center">
                  Created Date 
                  {getSortIcon('createdDate')}
                </div>
              </th>
              <th scope="col" className="table-header text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="table-row">
                <td className="table-cell">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    checked={selectedUsers.has(user.id)}
                    onChange={() => onSelectUser(user.id)}
                  />
                </td>
                <td className="table-cell">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <span className={getRoleBadge(user.role)}>
                    {user.role}
                  </span>
                </td>
                <td className="table-cell">
                  <span className={getStatusBadge(user.status)}>
                    {user.status}
                  </span>
                </td>
                <td className="table-cell text-gray-600">
                  {user.lastLogin ? formatDistanceToNow(user.lastLogin) : 'Never'}
                </td>
                <td className="table-cell">
                  <span className={getSignatureBadge(user.digitalSignatureStatus)}>
                    {user.digitalSignatureStatus}
                  </span>
                </td>
                <td className="table-cell text-gray-600">
                  {formatDistanceToNow(user.createdDate)}
                </td>
                <td className="table-cell text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => onViewUser(user)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View User"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEditUser(user)}
                      className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit User"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteUser(user)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
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
  );
};