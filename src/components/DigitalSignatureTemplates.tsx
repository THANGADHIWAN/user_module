import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Search,
  Filter,
  FileText,
  Calendar,
  User,
  X,
  Save
} from 'lucide-react';

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
    description: 'Standard template for SOP review and approval with multi-level signatures',
    category: 'SOP',
    status: 'Active',
    fields: [
      { id: '1', name: 'Author Signature', type: 'signature', required: true, position: { x: 100, y: 200 }, size: { width: 200, height: 50 } },
      { id: '2', name: 'Review Date', type: 'date', required: true, position: { x: 100, y: 300 }, size: { width: 150, height: 30 } },
      { id: '3', name: 'QA Approval', type: 'signature', required: true, position: { x: 400, y: 200 }, size: { width: 200, height: 50 } }
    ],
    createdBy: 'Alice Johnson',
    createdDate: '2024-01-15T08:00:00Z',
    lastModified: '2024-01-15T08:00:00Z',
    content: `<div style="padding: 20px; font-family: Arial, sans-serif;">
      <h2>Standard Operating Procedure Approval</h2>
      <p><strong>SOP Title:</strong> ___________________________</p>
      <p><strong>SOP Number:</strong> ___________________________</p>
      <p><strong>Version:</strong> ___________________________</p>
      <div style="margin-top: 40px;">
        <h3>Author Approval</h3>
        <p>I certify that this SOP has been reviewed and is accurate.</p>
        <div style="margin-top: 20px;">
          <p>Author Signature: ___________________________</p>
          <p>Date: ___________________________</p>
        </div>
      </div>
      <div style="margin-top: 40px;">
        <h3>Quality Assurance Approval</h3>
        <p>This SOP has been reviewed and approved for implementation.</p>
        <div style="margin-top: 20px;">
          <p>QA Signature: ___________________________</p>
          <p>Date: ___________________________</p>
        </div>
      </div>
    </div>`
  },
  {
    id: '2',
    name: 'Test Result Approval',
    description: 'Template for test result verification and approval with analyst and supervisor signatures',
    category: 'Test Results',
    status: 'Active',
    fields: [
      { id: '1', name: 'Analyst Signature', type: 'signature', required: true, position: { x: 100, y: 200 }, size: { width: 200, height: 50 } },
      { id: '2', name: 'Test Date', type: 'date', required: true, position: { x: 100, y: 300 }, size: { width: 150, height: 30 } },
      { id: '3', name: 'Supervisor Approval', type: 'signature', required: true, position: { x: 400, y: 200 }, size: { width: 200, height: 50 } }
    ],
    createdBy: 'Bob Wilson',
    createdDate: '2024-01-14T09:30:00Z',
    lastModified: '2024-01-14T09:30:00Z'
  }
];

export const DigitalSignatureTemplates: React.FC = () => {
  const { showSuccess, showInfo } = useToast();
  const [templates, setTemplates] = useState<SignatureTemplate[]>(sampleTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedTemplate, setSelectedTemplate] = useState<SignatureTemplate | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SignatureTemplate | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    templateId: string;
    templateName: string;
  }>({
    isOpen: false,
    templateId: '',
    templateName: ''
  });

  // Template creation form state
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateCategory, setTemplateCategory] = useState<SignatureTemplate['category']>('SOP');
  const [templateContent, setTemplateContent] = useState('');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || template.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || template.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreateTemplate = () => {
    if (!templateName.trim()) return;

    const newTemplate: SignatureTemplate = {
      id: Date.now().toString(),
      name: templateName,
      description: templateDescription,
      category: templateCategory,
      status: 'Draft',
      fields: [],
      createdBy: 'Current User',
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      content: templateContent
    };

    setTemplates(prev => [...prev, newTemplate]);
    showSuccess('Template Created', `${templateName} has been successfully created.`);
    resetCreateForm();
    setShowCreateModal(false);
  };

  const handleUpdateTemplate = (updatedTemplate: SignatureTemplate) => {
    setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
    showSuccess('Template Updated', `${updatedTemplate.name} has been successfully updated.`);
    setEditingTemplate(null);
    setShowCreateModal(false);
  };

  const handleDeleteTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setDeleteConfirmation({
        isOpen: true,
        templateId: templateId,
        templateName: template.name
      });
    }
  };

  const confirmDeleteTemplate = () => {
    const templateName = deleteConfirmation.templateName;
    setTemplates(prev => prev.filter(t => t.id !== deleteConfirmation.templateId));
    setDeleteConfirmation({
      isOpen: false,
      templateId: '',
      templateName: ''
    });
    showSuccess('Template Deleted', `${templateName} has been successfully deleted.`);
  };

  const cancelDeleteTemplate = () => {
    setDeleteConfirmation({
      isOpen: false,
      templateId: '',
      templateName: ''
    });
  };

  const resetCreateForm = () => {
    setTemplateName('');
    setTemplateDescription('');
    setTemplateCategory('SOP');
    setTemplateContent('');
    setEditingTemplate(null);
  };

  const handleEditTemplate = (template: SignatureTemplate) => {
    setEditingTemplate(template);
    setTemplateName(template.name);
    setTemplateDescription(template.description);
    setTemplateCategory(template.category);
    setTemplateContent(template.content || '');
    setShowCreateModal(true);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'Active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Draft':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Archived':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getCategoryBadge = (category: string) => {
    const baseClasses = 'px-2 py-1 rounded-md text-xs font-medium';
    const categoryColors: Record<string, string> = {
      'SOP': 'bg-blue-100 text-blue-800',
      'Test Results': 'bg-green-100 text-green-800',
      'Batch Records': 'bg-purple-100 text-purple-800',
      'Deviation Reports': 'bg-red-100 text-red-800',
      'Change Control': 'bg-orange-100 text-orange-800'
    };
    return `${baseClasses} ${categoryColors[category] || 'bg-gray-100 text-gray-800'}`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Signature Templates</h2>
          <p className="text-gray-600">Manage document signature templates</p>
        </div>
        <button
          data-create-template
          onClick={() => {
            resetCreateForm();
            setShowCreateModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>Create Template</span>
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search templates..."
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
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Categories</option>
              <option value="SOP">SOP</option>
              <option value="Test Results">Test Results</option>
              <option value="Batch Records">Batch Records</option>
              <option value="Deviation Reports">Deviation Reports</option>
              <option value="Change Control">Change Control</option>
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className={getCategoryBadge(template.category)}>
                    {template.category}
                  </span>
                  <span className={getStatusBadge(template.status)}>
                    {template.status}
                  </span>
                </div>

                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <User className="h-3 w-3 mr-1" />
                  <span className="mr-3">{template.createdBy}</span>
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{new Date(template.createdDate).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {template.fields.length} field(s)
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        setSelectedTemplate(template);
                        setShowTemplateModal(true);
                      }}
                      className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="p-1 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                      title="Delete template"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or create a new template.
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter template name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter template description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={templateCategory}
                  onChange={(e) => setTemplateCategory(e.target.value as SignatureTemplate['category'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="SOP">SOP</option>
                  <option value="Test Results">Test Results</option>
                  <option value="Batch Records">Batch Records</option>
                  <option value="Deviation Reports">Deviation Reports</option>
                  <option value="Change Control">Change Control</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Content (HTML)</label>
                <textarea
                  value={templateContent}
                  onChange={(e) => setTemplateContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  rows={8}
                  placeholder="Enter HTML content for the template"
                />
              </div>
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
                  if (editingTemplate) {
                    handleUpdateTemplate({
                      ...editingTemplate,
                      name: templateName,
                      description: templateDescription,
                      category: templateCategory,
                      content: templateContent,
                      lastModified: new Date().toISOString()
                    });
                  } else {
                    handleCreateTemplate();
                  }
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>{editingTemplate ? 'Update' : 'Create'} Template</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template View Modal */}
      {showTemplateModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{selectedTemplate.name}</h3>
                <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
              </div>
              <button
                onClick={() => {
                  setShowTemplateModal(false);
                  setSelectedTemplate(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4 flex items-center space-x-4">
                <span className={getCategoryBadge(selectedTemplate.category)}>
                  {selectedTemplate.category}
                </span>
                <span className={getStatusBadge(selectedTemplate.status)}>
                  {selectedTemplate.status}
                </span>
                <div className="text-sm text-gray-500">
                  Created by {selectedTemplate.createdBy} on {new Date(selectedTemplate.createdDate).toLocaleDateString()}
                </div>
              </div>

              {selectedTemplate.content && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Template Preview</h4>
                  <div 
                    className="bg-white p-4 rounded border"
                    dangerouslySetInnerHTML={{ __html: selectedTemplate.content }}
                  />
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Template</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{deleteConfirmation.templateName}</strong>? 
                This action cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={cancelDeleteTemplate}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteTemplate}
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