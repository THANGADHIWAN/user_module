import React, { useState } from 'react';
import { User, Privilege } from '../types/user';
import { X, Shield, FileText, Settings, Clock, Upload, Download } from 'lucide-react';
import { privileges } from '../data/sampleData';
import { formatDate, formatDistanceToNow } from '../utils/dateUtils';

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  isEditing: boolean;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
  isEditing
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [editedUser, setEditedUser] = useState<User | null>(user);

  React.useEffect(() => {
    setEditedUser(user);
  }, [user]);

  if (!isOpen || !user || !editedUser) return null;

  const handleSave = () => {
    if (editedUser) {
      onSave(editedUser);
      onClose();
    }
  };

  const togglePrivilege = (privilegeId: string) => {
    if (!isEditing) return;
    
    setEditedUser(prev => {
      if (!prev) return prev;
      const newPrivileges = prev.privileges.includes(privilegeId)
        ? prev.privileges.filter(p => p !== privilegeId)
        : [...prev.privileges, privilegeId];
      return { ...prev, privileges: newPrivileges };
    });
  };

  const handleDownloadSignature = () => {
    if (editedUser.signatureCertificate) {
      // Create a mock download for the signature certificate
      const element = document.createElement('a');
      const file = new Blob(['Mock certificate data for ' + editedUser.name], { type: 'application/x-pkcs12' });
      element.href = URL.createObjectURL(file);
      element.download = editedUser.signatureCertificate;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const privilegesByCategory = privileges.reduce((acc, privilege) => {
    if (!acc[privilege.category]) {
      acc[privilege.category] = [];
    }
    acc[privilege.category].push(privilege);
    return acc;
  }, {} as Record<string, Privilege[]>);

  const tabs = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'privileges', label: 'Privileges', icon: Shield },
    { id: 'authorization', label: 'Authorization', icon: Settings },
    { id: 'signature', label: 'Digital Signature', icon: FileText },
    { id: 'audit', label: 'Audit Trail', icon: Clock }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-lg">
              {editedUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{editedUser.name}</h2>
              <p className="text-sm text-gray-500">{editedUser.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
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
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{editedUser.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{editedUser.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  {isEditing ? (
                    <select
                      value={editedUser.role}
                      onChange={(e) => setEditedUser({...editedUser, role: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Lab Manager">Lab Manager</option>
                      <option value="QA Officer">QA Officer</option>
                      <option value="QC Analyst">QC Analyst</option>
                      <option value="Analyst Trainee">Analyst Trainee</option>
                      <option value="Auditor">Auditor</option>
                      <option value="Regulatory Affairs">Regulatory Affairs</option>
                      <option value="IT Support">IT Support</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{editedUser.role}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  {isEditing ? (
                    <select
                      value={editedUser.status}
                      onChange={(e) => setEditedUser({...editedUser, status: e.target.value as 'Active' | 'Inactive'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      editedUser.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {editedUser.status}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Created Date</label>
                  <p className="text-gray-900">{formatDate(editedUser.createdDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Login</label>
                  <p className="text-gray-900">
                    {editedUser.lastLogin ? formatDistanceToNow(editedUser.lastLogin) : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privileges' && (
            <div className="space-y-6">
              {isEditing && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">
                        Warning: Privilege Changes
                      </h3>
                      <p className="mt-1 text-sm text-amber-700">
                        Modifying user privileges will affect their access to system functions. Changes take effect immediately after saving.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {Object.entries(privilegesByCategory).map(([category, categoryPrivileges]) => (
                <div key={category}>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">{category}</h3>
                  <div className="space-y-3">
                    {categoryPrivileges.map((privilege) => (
                      <div key={privilege.id} className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id={privilege.id}
                          checked={editedUser.privileges.includes(privilege.id)}
                          onChange={() => togglePrivilege(privilege.id)}
                          disabled={!isEditing}
                          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={privilege.id}
                            className={`text-sm font-medium ${isEditing ? 'cursor-pointer' : ''} text-gray-900`}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Authorization Level</label>
                {isEditing ? (
                  <select
                    value={editedUser.authorizationLevel}
                    onChange={(e) => setEditedUser({...editedUser, authorizationLevel: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={0}>Level 0 - No Authorization</option>
                    <option value={1}>Level 1 - Basic Authorization</option>
                    <option value={2}>Level 2 - Intermediate Authorization</option>
                    <option value={3}>Level 3 - Full Authorization</option>
                  </select>
                ) : (
                  <p className="text-gray-900">Level {editedUser.authorizationLevel}</p>
                )}
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

          {activeTab === 'signature' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Digital Signature Status</h3>
                  <p className="text-sm text-gray-500">Manage digital signature settings and certificate</p>
                </div>
                {isEditing && (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editedUser.digitalSignatureStatus === 'Enabled'}
                      onChange={(e) => setEditedUser({
                        ...editedUser, 
                        digitalSignatureStatus: e.target.checked ? 'Enabled' : 'Disabled'
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                )}
              </div>

              {editedUser.digitalSignatureStatus === 'Enabled' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Certificate File</label>
                    <div className="flex items-center space-x-3">
                      {editedUser.signatureCertificate ? (
                        <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                          <FileText className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-800">{editedUser.signatureCertificate}</span>
                          <button 
                            onClick={handleDownloadSignature}
                            className="text-green-600 hover:text-green-800"
                            title="Download Certificate"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No certificate uploaded</p>
                      )}
                      {isEditing && (
                        <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Certificate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              <div className="space-y-4">
                {editedUser.auditLog.map((entry) => (
                  <div key={entry.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{entry.action}</h4>
                      <span className="text-sm text-gray-500">{formatDate(entry.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{entry.details}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Performed by: {entry.performedBy}</span>
                      <span>IP: {entry.ipAddress}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {isEditing ? 'Cancel' : 'Close'}
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};