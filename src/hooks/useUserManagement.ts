import { useState, useMemo } from 'react';
import { User, FilterOptions } from '../types/user';
import { sampleUsers } from '../data/sampleData';
import { isDateInRange } from '../utils/dateUtils';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<FilterOptions>({
    role: 'All',
    status: 'All',
    search: ''
  });

  const { filteredUsers, paginatedUsers, totalPages } = useMemo(() => {
    let filtered = users.filter(user => {
      // Role filter
      if (filters.role !== 'All' && user.role !== filters.role) return false;
      
      // Status filter
      if (filters.status !== 'All' && user.status !== filters.status) return false;
      
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (!user.name.toLowerCase().includes(search) && 
            !user.email.toLowerCase().includes(search)) return false;
      }

      // Date filters
      if (!isDateInRange(user.createdDate, filters.dateCreatedFrom, filters.dateCreatedTo)) return false;
      if (user.lastLogin && !isDateInRange(user.lastLogin, filters.lastLoginFrom, filters.lastLoginTo)) return false;

      return true;
    });

    // Sorting
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        // Handle null/undefined values
        if (aValue === null || aValue === undefined) aValue = '';
        if (bValue === null || bValue === undefined) bValue = '';

        // Convert to string for comparison
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();

        const comparison = aStr.localeCompare(bStr);
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    // Pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filtered.slice(startIndex, startIndex + itemsPerPage);

    return {
      filteredUsers: filtered,
      paginatedUsers,
      totalPages
    };
  }, [users, filters, sortField, sortDirection, currentPage, itemsPerPage]);

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedUsers(new Set()); // Clear selections when changing pages
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
    setSelectedUsers(new Set()); // Clear selections
  };

  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === paginatedUsers.length && paginatedUsers.length > 0) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(paginatedUsers.map(user => user.id)));
    }
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
  };

  const addUser = (userData: Omit<User, 'id' | 'createdDate' | 'auditLog'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdDate: new Date().toISOString(),
      auditLog: [{
        id: '1',
        timestamp: new Date().toISOString(),
        action: 'User Created',
        performedBy: 'System Administrator',
        details: 'User account created',
        ipAddress: '192.168.1.100'
      }]
    };
    setUsers(prev => [...prev, newUser]);
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    setSelectedUsers(prev => {
      const newSelected = new Set(prev);
      newSelected.delete(userId);
      return newSelected;
    });
  };

  const bulkUpdateStatus = (userIds: string[], status: 'Active' | 'Inactive') => {
    setUsers(prev => prev.map(user => 
      userIds.includes(user.id) ? { ...user, status } : user
    ));
    setSelectedUsers(new Set());
  };

  const bulkDelete = (userIds: string[]) => {
    setUsers(prev => prev.filter(user => !userIds.includes(user.id)));
    setSelectedUsers(new Set());
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Status', 'Last Login', 'Digital Signature', 'Created Date'];
    const csvData = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.role,
        user.status,
        user.lastLogin || 'Never',
        user.digitalSignatureStatus,
        user.createdDate
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return {
    users: paginatedUsers,
    allUsers: filteredUsers,
    totalUsers: filteredUsers.length,
    selectedUsers,
    currentPage,
    totalPages,
    itemsPerPage,
    sortField,
    sortDirection,
    filters,
    setFilters,
    handleSort,
    handlePageChange,
    handleItemsPerPageChange,
    handleSelectUser,
    handleSelectAll,
    updateUser,
    addUser,
    deleteUser,
    bulkUpdateStatus,
    bulkDelete,
    exportToCSV
  };
};