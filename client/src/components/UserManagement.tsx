import React, { useState } from 'react';
import { UserTable } from './UserTable';
import { FilterBar } from './FilterBar';
import { UserDetailsModal } from './UserDetailsModal';
import { AddUserModal } from './AddUserModal';
import { ConfirmationModal } from './ConfirmationModal';
import { PageHeader } from './common/PageHeader';
import { StatsCard } from './common/StatsCard';
import { UnifiedSearchFilter } from './common/UnifiedSearchFilter';
import { useUserManagement } from '../hooks/useUserManagement';
import { User } from '../types/user';
import { Users, UserPlus, UserCheck, UserX, Clock } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const {
    users,
    selectedUsers,
    sortField,
    sortDirection,
    filters,
    setFilters,
    handleSort,
    handleSelectUser,
    handleSelectAll,
    updateUser,
    deleteUser,
    bulkUpdateStatus,
    bulkDelete,
    exportToCSV,
    addUser
  } = useUserManagement();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    confirmVariant?: 'danger' | 'warning' | 'primary';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Delete User',
      message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      confirmVariant: 'danger',
      onConfirm: () => {
        deleteUser(user.id);
        setConfirmationModal({ ...confirmationModal, isOpen: false });
      }
    });
  };

  const handleBulkActivate = () => {
    const selectedUserIds = Array.from(selectedUsers);
    setConfirmationModal({
      isOpen: true,
      title: 'Activate Users',
      message: `Are you sure you want to activate ${selectedUserIds.length} user(s)?`,
      confirmText: 'Activate',
      confirmVariant: 'primary',
      onConfirm: () => {
        bulkUpdateStatus(selectedUserIds, 'Active');
        setConfirmationModal({ ...confirmationModal, isOpen: false });
      }
    });
  };

  const handleBulkDeactivate = () => {
    const selectedUserIds = Array.from(selectedUsers);
    setConfirmationModal({
      isOpen: true,
      title: 'Deactivate Users',
      message: `Are you sure you want to deactivate ${selectedUserIds.length} user(s)?`,
      confirmText: 'Deactivate',
      confirmVariant: 'warning',
      onConfirm: () => {
        bulkUpdateStatus(selectedUserIds, 'Inactive');
        setConfirmationModal({ ...confirmationModal, isOpen: false });
      }
    });
  };

  const handleBulkDelete = () => {
    const selectedUserIds = Array.from(selectedUsers);
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Users',
      message: `Are you sure you want to delete ${selectedUserIds.length} user(s)? This action cannot be undone.`,
      confirmText: 'Delete',
      confirmVariant: 'danger',
      onConfirm: () => {
        bulkDelete(selectedUserIds);
        setConfirmationModal({ ...confirmationModal, isOpen: false });
      }
    });
  };

  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveNewUser = (userData: Omit<User, 'id' | 'createdDate' | 'auditLog'>) => {
    addUser(userData);
    setIsAddModalOpen(false);
  };

  // Calculate stats
  const activeUsers = users.filter(user => user.status === 'Active');
  const inactiveUsers = users.filter(user => user.status === 'Inactive');
  const pendingUsers = users.filter(user => user.status === 'Pending');

  // Search and Filter State
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('name');
  const [groupValue, setGroupValue] = useState('none');
  const [dateFilter, setDateFilter] = useState('All');

  const unifiedFilters = {
    status: {
      value: filters.status,
      options: [
        { value: 'All', label: 'All Status' },
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'Pending', label: 'Pending' }
      ],
      label: 'Status'
    },
    role: {
      value: filters.role,
      options: [
        { value: 'All', label: 'All Roles' },
        { value: 'System Administrator', label: 'System Administrator' },
        { value: 'Lab Manager', label: 'Lab Manager' },
        { value: 'Senior Analyst', label: 'Senior Analyst' },
        { value: 'Analyst', label: 'Analyst' },
        { value: 'Quality Assurance', label: 'Quality Assurance' },
        { value: 'Analyst Trainee', label: 'Analyst Trainee' }
      ],
      label: 'Role'
    },
    department: {
      value: filters.department,
      options: [
        { value: 'All', label: 'All Departments' },
        { value: 'Quality Control', label: 'Quality Control' },
        { value: 'Research & Development', label: 'Research & Development' },
        { value: 'Production', label: 'Production' },
        { value: 'Regulatory Affairs', label: 'Regulatory Affairs' },
        { value: 'IT', label: 'IT' }
      ],
      label: 'Department'
    }
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  const handleClearAll = () => {
    setSearchValue('');
    setSortValue('name');
    setGroupValue('none');
    setDateFilter('All');
    setFilters({
      status: 'All',
      role: 'All',
      department: 'All'
    });
  };

  const handleExport = () => {
    exportToCSV();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = (userData: Partial<User>) => {
    if (selectedUser) {
      updateUser(selectedUser.id, userData);
    }
    handleCloseModal();
  };

  const handleAddNewUser = (userData: Omit<User, 'id'>) => {
    addUser(userData);
    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <PageHeader
        title="User Management"
        subtitle="Manage user accounts, roles, and permissions"
        icon={Users}
        actions={
          <>
            <button
              onClick={handleExport}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={handleAddUser}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </>
        }
      />

      <div className="mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={users.length}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Active Users"
            value={activeUsers.length}
            icon={UserCheck}
            color="green"
          />
          <StatsCard
            title="Inactive Users"
            value={inactiveUsers.length}
            icon={UserX}
            color="red"
          />
          <StatsCard
            title="Pending Users"
            value={pendingUsers.length}
            icon={Clock}
            color="yellow"
          />
        </div>

        {/* Unified Search and Filter */}
        <UnifiedSearchFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={unifiedFilters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
          sortOptions={[
            { value: 'name', label: 'Name' },
            { value: 'email', label: 'Email' },
            { value: 'role', label: 'Role' },
            { value: 'department', label: 'Department' },
            { value: 'lastLogin', label: 'Last Login' }
          ]}
          sortValue={sortValue}
          onSortChange={setSortValue}
          groupOptions={[
            { value: 'none', label: 'None' },
            { value: 'role', label: 'Role' },
            { value: 'department', label: 'Department' },
            { value: 'status', label: 'Status' }
          ]}
          groupValue={groupValue}
          onGroupChange={setGroupValue}
          dateFilter={{
            value: dateFilter,
            onChange: setDateFilter
          }}
        />

        {/* Bulk Actions */}
        {selectedUsers.size > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  {selectedUsers.size} user(s) selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBulkActivate}
                  className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors"
                >
                  Activate
                </button>
                <button
                  onClick={handleBulkDeactivate}
                  className="px-3 py-1.5 text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg transition-colors"
                >
                  Deactivate
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <UserTable
            users={users}
            selectedUsers={selectedUsers}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAll}
            onViewUser={handleViewUser}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        </div>
      </div>

      {/* Modals */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        isEditing={isEditing}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        onEdit={() => setIsEditing(true)}
      />

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddNewUser}
      />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        confirmVariant={confirmationModal.confirmVariant}
        onConfirm={confirmationModal.onConfirm}
        onCancel={() => setConfirmationModal({ ...confirmationModal, isOpen: false })}
      />
    </div>
  );
};