import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { 
  Pen, 
  Eye, 
  Edit, 
  Trash2,
  Search,
  Filter,
  FileSignature,
  Calendar,
  User,
  X,
  Save,
  Type,
  Upload,
  RotateCcw
} from 'lucide-react';

interface Signature {
  id: string;
  name: string;
  type: 'draw' | 'type' | 'upload';
  assignedUser: string;
  templateId?: string;
  templateName?: string;
  data: string; // Base64 image data or text
  createdDate: string;
  lastUsed?: string;
  status: 'Active' | 'Inactive';
}

const sampleSignatures: Signature[] = [
  {
    id: '1',
    name: 'Alice Johnson Digital Signature',
    type: 'draw',
    assignedUser: 'Alice Johnson',
    templateId: '1',
    templateName: 'SOP Approval Template',
    data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    createdDate: '2024-01-15T08:00:00Z',
    lastUsed: '2024-01-20T10:30:00Z',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Bob Wilson Typed Signature',
    type: 'type',
    assignedUser: 'Bob Wilson',
    templateId: '2',
    templateName: 'Test Result Approval',
    data: 'Bob Wilson',
    createdDate: '2024-01-14T09:30:00Z',
    lastUsed: '2024-01-19T14:15:00Z',
    status: 'Active'
  }
];

export const DigitalSignatureManagement: React.FC = () => {
  const { showSuccess, showInfo } = useToast();
  const [signatures, setSignatures] = useState<Signature[]>(sampleSignatures);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [selectedSignature, setSelectedSignature] = useState<Signature | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSignature, setEditingSignature] = useState<Signature | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    signatureId: string;
    signatureName: string;
  }>({
    isOpen: false,
    signatureId: '',
    signatureName: ''
  });

  // Signature creation form state
  const [signatureName, setSignatureName] = useState('');
  const [signatureType, setSignatureType] = useState<'draw' | 'type' | 'upload'>('draw');
  const [assignedUser, setAssignedUser] = useState('');
  const [typedSignature, setTypedSignature] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const filteredSignatures = signatures.filter(signature => {
    const matchesSearch = signature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         signature.assignedUser.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || signature.status === statusFilter;
    const matchesType = typeFilter === 'All' || signature.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateSignature = () => {
    if (!signatureName.trim() || !assignedUser.trim()) return;

    let signatureData = '';
    if (signatureType === 'type' && typedSignature.trim()) {
      signatureData = typedSignature;
    } else if (signatureType === 'draw') {
      signatureData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    }

    const newSignature: Signature = {
      id: Date.now().toString(),
      name: signatureName,
      type: signatureType,
      assignedUser: assignedUser,
      templateId: selectedTemplate || undefined,
      data: signatureData,
      createdDate: new Date().toISOString(),
      status: 'Active'
    };

    setSignatures(prev => [...prev, newSignature]);
    showSuccess('Signature Created', `Digital signature for ${assignedUser} has been successfully created.`);
    resetCreateForm();
    setShowCreateModal(false);
  };

  const handleUpdateSignature = (updatedSignature: Signature) => {
    setSignatures(prev => prev.map(s => s.id === updatedSignature.id ? updatedSignature : s));
    showSuccess('Signature Updated', `${updatedSignature.name} has been successfully updated.`);
    setEditingSignature(null);
    setShowCreateModal(false);
  };

  const handleDeleteSignature = (signatureId: string) => {
    const signature = signatures.find(s => s.id === signatureId);
    if (signature) {
      setDeleteConfirmation({
        isOpen: true,
        signatureId: signatureId,
        signatureName: signature.name
      });
    }
  };

  const confirmDeleteSignature = () => {
    const signatureName = deleteConfirmation.signatureName;
    setSignatures(prev => prev.filter(s => s.id !== deleteConfirmation.signatureId));
    setDeleteConfirmation({
      isOpen: false,
      signatureId: '',
      signatureName: ''
    });
    showSuccess('Signature Deleted', `${signatureName} has been successfully deleted.`);
  };

  const cancelDeleteSignature = () => {
    setDeleteConfirmation({
      isOpen: false,
      signatureId: '',
      signatureName: ''
    });
  };

  const handleToggleStatus = (signatureId: string) => {
    setSignatures(prev => prev.map(signature => 
      signature.id === signatureId 
        ? { ...signature, status: signature.status === 'Active' ? 'Inactive' : 'Active' }
        : signature
    ));
    const signature = signatures.find(s => s.id === signatureId);
    const newStatus = signature?.status === 'Active' ? 'Inactive' : 'Active';
    showInfo('Status Updated', `Signature status changed to ${newStatus}.`);
  };

  const resetCreateForm = () => {
    setSignatureName('');
    setSignatureType('draw');
    setAssignedUser('');
    setTypedSignature('');
    setSelectedTemplate('');
    setEditingSignature(null);
  };

  const handleEditSignature = (signature: Signature) => {
    setEditingSignature(signature);
    setSignatureName(signature.name);
    setSignatureType(signature.type);
    setAssignedUser(signature.assignedUser);
    setTypedSignature(signature.type === 'type' ? signature.data : '');
    setSelectedTemplate(signature.templateId || '');
    setShowCreateModal(true);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    return status === 'Active' 
      ? `${baseClasses} bg-green-100 text-green-800`
      : `${baseClasses} bg-gray-100 text-gray-800`;
  };

  const getTypeBadge = (type: string) => {
    const baseClasses = 'px-2 py-1 rounded-md text-xs font-medium';
    const typeColors: Record<string, string> = {
      'draw': 'bg-blue-100 text-blue-800',
      'type': 'bg-purple-100 text-purple-800',
      'upload': 'bg-orange-100 text-orange-800'
    };
    return `${baseClasses} ${typeColors[type] || 'bg-gray-100 text-gray-800'}`;
  };

  return (
    <div className="h-full flex flex-col">
      <button
        data-create-signature
        onClick={() => {
          resetCreateForm();
          setShowCreateModal(true);
        }}
        className="hidden"
      >
        <Pen className="h-5 w-5" />
        <span>Create Signature</span>
      </button>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search signatures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Types</option>
              <option value="draw">Drawn</option>
              <option value="type">Typed</option>
              <option value="upload">Uploaded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Signatures Grid */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSignatures.map((signature) => (
            <div key={signature.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{signature.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">Assigned to: {signature.assignedUser}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className={getTypeBadge(signature.type)}>
                    {signature.type.charAt(0).toUpperCase() + signature.type.slice(1)}
                  </span>
                  <span className={getStatusBadge(signature.status)}>
                    {signature.status}
                  </span>
                </div>

                {signature.templateName && (
                  <div className="text-xs text-gray-500 mb-2">
                    Template: {signature.templateName}
                  </div>
                )}

                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span className="mr-3">Created {new Date(signature.createdDate).toLocaleDateString()}</span>
                  {signature.lastUsed && (
                    <>
                      <span className="mr-1">•</span>
                      <span>Last used {new Date(signature.lastUsed).toLocaleDateString()}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleToggleStatus(signature.id)}
                    className={`text-xs px-2 py-1 rounded ${
                      signature.status === 'Active' 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {signature.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        setSelectedSignature(signature);
                        setShowSignatureModal(true);
                      }}
                      className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditSignature(signature)}
                      className="p-1 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSignature(signature.id)}
                      className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                      title="Delete signature"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSignatures.length === 0 && (
          <div className="text-center py-12">
            <FileSignature className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No signatures found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or create a new signature.
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Signature Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingSignature ? 'Edit Signature' : 'Create New Signature'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetCreateForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Signature Name</label>
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter signature name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned User</label>
                <input
                  type="text"
                  value={assignedUser}
                  onChange={(e) => setAssignedUser(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter user name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Signature Type</label>
                <div className="flex space-x-4">
                  {(['draw', 'type', 'upload'] as const).map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        value={type}
                        checked={signatureType === type}
                        onChange={(e) => setSignatureType(e.target.value as 'draw' | 'type' | 'upload')}
                        className="mr-2"
                      />
                      <span className="capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {signatureType === 'type' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Typed Signature</label>
                  <input
                    type="text"
                    value={typedSignature}
                    onChange={(e) => setTypedSignature(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-serif text-lg"
                    placeholder="Type your signature"
                  />
                </div>
              )}

              {signatureType === 'draw' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Draw Signature</label>
                  <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                    <div className="w-full h-32 bg-white border rounded flex items-center justify-center">
                      <span className="text-gray-500">Signature canvas (placeholder)</span>
                    </div>
                    <div className="flex justify-end space-x-2 mt-2">
                      <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800">
                        <RotateCcw className="h-4 w-4" />
                        <span>Clear</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {signatureType === 'upload' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Signature</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetCreateForm();
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingSignature) {
                    handleUpdateSignature({
                      ...editingSignature,
                      name: signatureName,
                      type: signatureType,
                      assignedUser: assignedUser,
                      data: signatureType === 'type' ? typedSignature : editingSignature.data
                    });
                  } else {
                    handleCreateSignature();
                  }
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Save className="h-4 w-4" />
                <span>{editingSignature ? 'Update' : 'Create'} Signature</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signature View Modal */}
      {showSignatureModal && selectedSignature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{selectedSignature.name}</h3>
                <p className="text-sm text-gray-600">Assigned to: {selectedSignature.assignedUser}</p>
              </div>
              <button
                onClick={() => {
                  setShowSignatureModal(false);
                  setSelectedSignature(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4 flex items-center space-x-4">
                <span className={getTypeBadge(selectedSignature.type)}>
                  {selectedSignature.type.charAt(0).toUpperCase() + selectedSignature.type.slice(1)}
                </span>
                <span className={getStatusBadge(selectedSignature.status)}>
                  {selectedSignature.status}
                </span>
                <div className="text-sm text-gray-500">
                  Created on {new Date(selectedSignature.createdDate).toLocaleDateString()}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Signature Preview</h4>
                <div className="bg-white p-4 rounded border min-h-24 flex items-center justify-center">
                  {selectedSignature.type === 'type' ? (
                    <span className="text-2xl font-serif">{selectedSignature.data}</span>
                  ) : (
                    <span className="text-gray-500">Signature preview</span>
                  )}
                </div>
              </div>

              {selectedSignature.templateName && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Associated Template:</strong> {selectedSignature.templateName}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Signature</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{deleteConfirmation.signatureName}</strong>? 
                This action cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={cancelDeleteSignature}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteSignature}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};