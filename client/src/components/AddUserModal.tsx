import React, { useState } from 'react';
import { User, UserRole } from '../types/user';
import { X, User as UserIcon, Mail, Shield, Key } from 'lucide-react';
import { userRoles, privileges } from '../data/sampleData';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id' | 'createdDate' | 'auditLog'>) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Analyst Trainee' as UserRole,
    status: 'Active' as 'Active' | 'Inactive',
    privileges: [] as string[],
    authorizationLevel: 0,
    digitalSignatureStatus: 'Disabled' as 'Enabled' | 'Disabled',
    signatureCertificate: '',
    lastLogin: null as string | null
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newUser: Omit<User, 'id' | 'createdDate' | 'auditLog'> = {
      ...formData,
      auditLog: []
    };

    onSave(newUser);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      role: 'Analyst Trainee',
      status: 'Active',
      privileges: [],
      authorizationLevel: 0,
      digitalSignatureStatus: 'Disabled',
      signatureCertificate: '',
      lastLogin: null
    });
    setErrors({});
    setActiveTab('basic');
    onClose();
  };

  const togglePrivilege = (privilegeId: string) => {
    setFormData(prev => ({
      ...prev,
      privileges: prev.privileges.includes(privilegeId)
        ? prev.privileges.filter(p => p !== privilegeId)
        : [...prev.privileges, privilegeId]
    }));
  };

  const privilegesByCategory = privileges.reduce((acc, privilege) => {
    if (!acc[privilege.category]) {
      acc[privilege.category] = [];
    }
    acc[privilege.category].push(privilege);
    return acc;
  }, {} as Record<string, typeof privileges>);

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: UserIcon },
    { id: 'privileges', label: 'Privileges', icon: Shield },
    { id: 'authorization', label: 'Authorization', icon: Key }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
              <p className="text-sm text-gray-500">Create a new user account</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {userRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <Mail className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Account Setup
                    </h3>
                    <p className="mt-1 text-sm text-blue-700">
                      A welcome email with login credentials will be sent to the user's email address after account creation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privileges' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                <div className="flex">
                  <Shield className="h-5 w-5 text-amber-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">
                      Privilege Assignment
                    </h3>
                    <p className="mt-1 text-sm text-amber-700">
                      Select the privileges this user should have. Privileges determine what actions the user can perform in the system.
                    </p>
                  </div>
                </div>
              </div>

              {Object.entries(privilegesByCategory).map(([category, categoryPrivileges]) => (
                <div key={category}>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">{category}</h3>
                  <div className="space-y-3">
                    {categoryPrivileges.map((privilege) => (
                      <div key={privilege.id} className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id={privilege.id}
                          checked={formData.privileges.includes(privilege.id)}
                          onChange={() => togglePrivilege(privilege.id)}
                          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={privilege.id}
                            className="text-sm font-medium cursor-pointer text-gray-900"
                          >
                            {privilege.name}
                          </label>
                          <p className="text-sm text-gray-500">{privilege.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'authorization' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Authorization Level
                </label>
                <select
                  value={formData.authorizationLevel}
                  onChange={(e) => setFormData({...formData, authorizationLevel: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={0}>Level 0 - No Authorization</option>
                  <option value={1}>Level 1 - Basic Authorization</option>
                  <option value={2}>Level 2 - Intermediate Authorization</option>
                  <option value={3}>Level 3 - Full Authorization</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digital Signature
                </label>
                <select
                  value={formData.digitalSignatureStatus}
                  onChange={(e) => setFormData({...formData, digitalSignatureStatus: e.target.value as 'Enabled' | 'Disabled'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Disabled">Disabled</option>
                  <option value="Enabled">Enabled</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Authorization Level Guide</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li><strong>Level 0:</strong> No authorization required, trainee level</li>
                  <li><strong>Level 1:</strong> Can approve own work, analyst level</li>
                  <li><strong>Level 2:</strong> Can approve others' work, supervisor level</li>
                  <li><strong>Level 3:</strong> Full system authorization, administrator level</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Create User
          </button>
        </div>
      </div>
    </div>
  );
};