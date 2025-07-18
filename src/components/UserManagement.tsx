import React, { useState } from 'react';
import { UserTable } from './UserTable';
import { FilterBar } from './FilterBar';
import { UserDetailsModal } from './UserDetailsModal';
import { AddUserModal } from './AddUserModal';
import { ConfirmationModal } from './ConfirmationModal';
import { useUserManagement } from '../hooks/useUserManagement';
import { User } from '../types/user';
import { Users } from 'lucide-react';

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

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{users.length} users</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4">
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          selectedCount={selectedUsers.size}
          onAddUser={handleAddUser}
          onExportUsers={exportToCSV}
          onBulkActivate={handleBulkActivate}
          onBulkDeactivate={handleBulkDeactivate}
          onBulkDelete={handleBulkDelete}
        />

        <UserTable
          users={users}
          selectedUsers={selectedUsers}
          onSelectUser={handleSelectUser}
          onSelectAll={handleSelectAll}
          onViewUser={handleViewUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={updateUser}
        isEditing={isEditing}
      />

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewUser}
      />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ ...confirmationModal, isOpen: false })}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        confirmVariant={confirmationModal.confirmVariant}
      />
    </div>
  );
};