import React, { useState } from 'react';
import { 
  FileSignature, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Search,
  Filter,
  X,
  Save,
  RotateCcw
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface SignatureTemplate {
  id: string;
  name: string;
  description: string;
  category: 'SOP' | 'Test Results' | 'Batch Records' | 'Deviation Reports' | 'Change Control';
  status: 'Active' | 'Draft' | 'Archived';
  fields: SignatureField[];
  createdBy: string;
  createdDate: string;
  lastModified: string;
  content?: string;
}

interface SignatureField {
  id: string;
  name: string;
  type: 'signature' | 'text' | 'date' | 'checkbox';
  required: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const sampleTemplates: SignatureTemplate[] = [
  {
    id: '1',
    name: 'SOP Approval Template',
    description: 'Standard template for SOP document approval process',
    category: 'SOP',
    status: 'Active',
    fields: [
      {
        id: '1',
        name: 'Reviewer Signature',
        type: 'signature',
        required: true,
        position: { x: 100, y: 100 },
        size: { width: 200, height: 50 }
      }
    ],
    createdBy: 'Admin User',
    createdDate: '2024-01-15T10:00:00Z',
    lastModified: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    name: 'Test Results Template',
    description: 'Template for test result verification and approval',
    category: 'Test Results',
    status: 'Active',
    fields: [
      {
        id: '1',
        name: 'Analyst Signature',
        type: 'signature',
        required: true,
        position: { x: 100, y: 100 },
        size: { width: 200, height: 50 }
      },
      {
        id: '2',
        name: 'QA Signature',
        type: 'signature',
        required: true,
        position: { x: 100, y: 200 },
        size: { width: 200, height: 50 }
      }
    ],
    createdBy: 'QA Manager',
    createdDate: '2024-01-10T09:00:00Z',
    lastModified: '2024-01-25T16:45:00Z'
  }
];

export const SignatureTemplates: React.FC = () => {
  const { showSuccess, showInfo } = useToast();
  const [templates, setTemplates] = useState<SignatureTemplate[]>(sampleTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<SignatureTemplate | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'SOP' as const,
    status: 'Draft' as const
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || template.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim()) {
      return;
    }

    const template: SignatureTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      description: newTemplate.description,
      category: newTemplate.category,
      status: newTemplate.status,
      fields: [],
      createdBy: 'Current User',
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    setTemplates(prev => [...prev, template]);
    setNewTemplate({ name: '', description: '', category: 'SOP', status: 'Draft' });
    setIsCreating(false);
    showSuccess('Template Created', `${template.name} has been successfully created.`);
  };

  const handleDeleteTemplate = (template: SignatureTemplate) => {
    setTemplates(prev => prev.filter(t => t.id !== template.id));
    showSuccess('Template Deleted', `${template.name} has been successfully deleted.`);
  };

  const handleExport = () => {
    showInfo('Export Complete', `${filteredTemplates.length} templates exported successfully.`);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
              <FileSignature className="h-6 w-6 mr-3 text-blue-600" />
              Signature Templates
            </h1>
            <p className="text-gray-600 mt-1">Manage reusable signature templates</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Export Templates
            </button>
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="SOP">SOP</option>
              <option value="Test Results">Test Results</option>
              <option value="Batch Records">Batch Records</option>
              <option value="Deviation Reports">Deviation Reports</option>
              <option value="Change Control">Change Control</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        template.category === 'SOP' ? 'bg-blue-100 text-blue-800' :
                        template.category === 'Test Results' ? 'bg-green-100 text-green-800' :
                        template.category === 'Batch Records' ? 'bg-purple-100 text-purple-800' :
                        template.category === 'Deviation Reports' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {template.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        template.status === 'Active' ? 'bg-green-100 text-green-800' :
                        template.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {template.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mb-4">
                  <div>Created by {template.createdBy}</div>
                  <div>Modified {new Date(template.lastModified).toLocaleDateString()}</div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedTemplate(template);
                        setShowTemplateModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTemplate(template);
                        setShowTemplateModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    {template.fields.length} field{template.fields.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileSignature className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or create a new template.
            </p>
          </div>
        )}
      </div>

      {/* Create Template Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Template</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter template name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter template description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="SOP">SOP</option>
                  <option value="Test Results">Test Results</option>
                  <option value="Batch Records">Batch Records</option>
                  <option value="Deviation Reports">Deviation Reports</option>
                  <option value="Change Control">Change Control</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                disabled={!newTemplate.name.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template View Modal */}
      {showTemplateModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">{selectedTemplate.name}</h3>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedTemplate.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Category</h4>
                    <p className="text-gray-600">{selectedTemplate.category}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                    <p className="text-gray-600">{selectedTemplate.status}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Signature Fields ({selectedTemplate.fields.length})</h4>
                  <div className="space-y-2">
                    {selectedTemplate.fields.map((field) => (
                      <div key={field.id} className="p-3 border border-gray-200 rounded-md">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{field.name}</span>
                          <span className="text-sm text-gray-500">{field.type}</span>
                        </div>
                        {field.required && (
                          <span className="text-xs text-red-600">Required</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};