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
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface SignatureDocument {
  id: string;
  templateId: string;
  templateName: string;
  title: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Rejected';
  signers: DocumentSigner[];
  createdBy: string;
  createdDate: string;
  completedDate?: string;
}

interface DocumentSigner {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Pending' | 'Signed' | 'Rejected';
  signedDate?: string;
  order: number;
}

const sampleDocuments: SignatureDocument[] = [
  {
    id: '1',
    templateId: '1',
    templateName: 'SOP Approval Template',
    title: 'SOP-001 Cleaning Validation Procedure',
    status: 'In Progress',
    signers: [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@pharma.com',
        role: 'QA Manager',
        status: 'Signed',
        signedDate: '2024-01-20T10:30:00Z',
        order: 1
      },
      {
        id: '2',
        name: 'Dr. Michael Chen',
        email: 'michael.chen@pharma.com',
        role: 'QC Director',
        status: 'Pending',
        order: 2
      }
    ],
    createdBy: 'Admin User',
    createdDate: '2024-01-18T14:00:00Z'
  },
  {
    id: '2',
    templateId: '2',
    templateName: 'Test Results Template',
    title: 'Batch 2024-001 Test Results',
    status: 'Completed',
    signers: [
      {
        id: '3',
        name: 'Dr. Emily Davis',
        email: 'emily.davis@pharma.com',
        role: 'Senior Analyst',
        status: 'Signed',
        signedDate: '2024-01-15T09:15:00Z',
        order: 1
      },
      {
        id: '4',
        name: 'Dr. Robert Wilson',
        email: 'robert.wilson@pharma.com',
        role: 'QA Supervisor',
        status: 'Signed',
        signedDate: '2024-01-15T11:45:00Z',
        order: 2
      }
    ],
    createdBy: 'QC Analyst',
    createdDate: '2024-01-14T16:20:00Z',
    completedDate: '2024-01-15T11:45:00Z'
  }
];

export const SignatureDocuments: React.FC = () => {
  const { showSuccess, showInfo } = useToast();
  const [documents, setDocuments] = useState<SignatureDocument[]>(sampleDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [templateFilter, setTemplateFilter] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<SignatureDocument | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: '',
    templateId: '',
    templateName: ''
  });

  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         document.templateName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || document.status === statusFilter;
    const matchesTemplate = templateFilter === 'all' || document.templateId === templateFilter;
    
    return matchesSearch && matchesStatus && matchesTemplate;
  });

  const handleCreateDocument = () => {
    if (!newDocument.title.trim() || !newDocument.templateId) {
      return;
    }

    const document: SignatureDocument = {
      id: Date.now().toString(),
      templateId: newDocument.templateId,
      templateName: newDocument.templateName,
      title: newDocument.title,
      status: 'Pending',
      signers: [],
      createdBy: 'Current User',
      createdDate: new Date().toISOString()
    };

    setDocuments(prev => [...prev, document]);
    setNewDocument({ title: '', templateId: '', templateName: '' });
    setIsCreating(false);
    showSuccess('Document Created', `${document.title} signature document has been created.`);
  };

  const handleDeleteDocument = (document: SignatureDocument) => {
    setDocuments(prev => prev.filter(d => d.id !== document.id));
    showSuccess('Document Deleted', `${document.title} has been successfully deleted.`);
  };

  const handleSignDocument = (document: SignatureDocument) => {
    // Simulate signing process
    setDocuments(prev => prev.map(d => 
      d.id === document.id 
        ? { ...d, status: 'In Progress' as const }
        : d
    ));
    showSuccess('Document Signed', `You have successfully signed ${document.title}.`);
  };

  const handleExport = () => {
    showInfo('Export Complete', `${filteredDocuments.length} signature documents exported successfully.`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs rounded-full font-medium';
    switch (status) {
      case 'Pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'In Progress':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'Completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
              <FileSignature className="h-6 w-6 mr-3 text-blue-600" />
              Signature Documents
            </h1>
            <p className="text-gray-600 mt-1">Manage documents requiring digital signatures</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Export Documents
            </button>
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Document
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
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              value={templateFilter}
              onChange={(e) => setTemplateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Templates</option>
              <option value="1">SOP Approval Template</option>
              <option value="2">Test Results Template</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-4">
          {filteredDocuments.map((document) => (
            <div key={document.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(document.status)}
                      <h3 className="text-lg font-medium text-gray-900">{document.title}</h3>
                      <span className={getStatusBadge(document.status)}>
                        {document.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Template: {document.templateName}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        Created by {document.createdBy}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(document.createdDate).toLocaleDateString()}
                      </div>
                      {document.completedDate && (
                        <div className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed {new Date(document.completedDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Signers */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Signers ({document.signers.length})</h4>
                  <div className="space-y-2">
                    {document.signers.map((signer) => (
                      <div key={signer.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {signer.status === 'Signed' ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : signer.status === 'Rejected' ? (
                              <XCircle className="h-4 w-4 text-red-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{signer.name}</div>
                            <div className="text-xs text-gray-500">{signer.role}</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {signer.status === 'Signed' && signer.signedDate ? (
                            `Signed ${new Date(signer.signedDate).toLocaleDateString()}`
                          ) : (
                            signer.status
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedDocument(document);
                        setShowDocumentModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDocument(document);
                        setShowDocumentModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(document)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {document.status === 'Pending' && (
                    <button
                      onClick={() => handleSignDocument(document)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
                    >
                      Sign Document
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileSignature className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or create a new document.
            </p>
          </div>
        )}
      </div>

      {/* Create Document Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Document</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
                <input
                  type="text"
                  value={newDocument.title}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter document title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                <select
                  value={newDocument.templateId}
                  onChange={(e) => {
                    const templateId = e.target.value;
                    const templateName = templateId === '1' ? 'SOP Approval Template' : 
                                        templateId === '2' ? 'Test Results Template' : '';
                    setNewDocument(prev => ({ ...prev, templateId, templateName }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a template</option>
                  <option value="1">SOP Approval Template</option>
                  <option value="2">Test Results Template</option>
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
                onClick={handleCreateDocument}
                disabled={!newDocument.title.trim() || !newDocument.templateId}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document View Modal */}
      {showDocumentModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">{selectedDocument.title}</h3>
                <button
                  onClick={() => setShowDocumentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Template</h4>
                    <p className="text-gray-600">{selectedDocument.templateName}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                    <span className={getStatusBadge(selectedDocument.status)}>
                      {selectedDocument.status}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Signature Progress</h4>
                  <div className="space-y-3">
                    {selectedDocument.signers.map((signer, index) => (
                      <div key={signer.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-md">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                            signer.status === 'Signed' ? 'bg-green-500' :
                            signer.status === 'Rejected' ? 'bg-red-500' :
                            'bg-gray-400'
                          }`}>
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{signer.name}</div>
                          <div className="text-sm text-gray-500">{signer.role} • {signer.email}</div>
                          {signer.signedDate && (
                            <div className="text-xs text-gray-500 mt-1">
                              Signed on {new Date(signer.signedDate).toLocaleString()}
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          {signer.status === 'Signed' ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : signer.status === 'Rejected' ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          )}
                        </div>
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