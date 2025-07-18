import React, { useState, useRef, useEffect } from 'react';
import { 
  FileSignature, 
  Plus, 
  Upload, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Filter,
  Users,
  Settings,
  X,
  Pen,
  Type,
  Image as ImageIcon,
  Save,
  RotateCcw,
  Check
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
    content: `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
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
      </div>
    `
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
    createdDate: '2024-01-10T09:30:00Z',
    lastModified: '2024-01-12T14:20:00Z',
    content: `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h2>Test Result Approval Form</h2>
        <p><strong>Sample ID:</strong> ___________________________</p>
        <p><strong>Test Method:</strong> ___________________________</p>
        <p><strong>Batch Number:</strong> ___________________________</p>
        
        <div style="margin-top: 40px;">
          <h3>Test Results</h3>
          <table border="1" style="width: 100%; border-collapse: collapse;">
            <tr>
              <th>Parameter</th>
              <th>Specification</th>
              <th>Result</th>
              <th>Pass/Fail</th>
            </tr>
            <tr>
              <td>_______________</td>
              <td>_______________</td>
              <td>_______________</td>
              <td>_______________</td>
            </tr>
          </table>
        </div>
        
        <div style="margin-top: 40px;">
          <h3>Analyst Certification</h3>
          <p>I certify that the testing was performed according to approved procedures.</p>
          <div style="margin-top: 20px;">
            <p>Analyst Signature: ___________________________</p>
            <p>Date: ___________________________</p>
          </div>
        </div>
        
        <div style="margin-top: 40px;">
          <h3>Supervisor Approval</h3>
          <p>Results reviewed and approved for release.</p>
          <div style="margin-top: 20px;">
            <p>Supervisor Signature: ___________________________</p>
            <p>Date: ___________________________</p>
          </div>
        </div>
      </div>
    `
  }
];

const sampleDocuments: SignatureDocument[] = [
  {
    id: '1',
    templateId: '1',
    templateName: 'SOP Approval Template',
    title: 'SOP-001 Quality Control Procedures',
    status: 'In Progress',
    signers: [
      {
        id: '1',
        name: 'Carol Davis',
        email: 'carol.davis@pharma.com',
        role: 'QA Officer',
        status: 'Signed',
        signedDate: '2024-01-15T10:30:00Z',
        order: 1
      },
      {
        id: '2',
        name: 'Bob Wilson',
        email: 'bob.wilson@pharma.com',
        role: 'Lab Manager',
        status: 'Pending',
        order: 2
      }
    ],
    createdBy: 'Alice Johnson',
    createdDate: '2024-01-15T08:00:00Z'
  }
];

export const DigitalSignatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'settings'>('templates');
  const [templates, setTemplates] = useState<SignatureTemplate[]>(sampleTemplates);
  const [documents, setDocuments] = useState<SignatureDocument[]>(sampleDocuments);
  const [selectedTemplate, setSelectedTemplate] = useState<SignatureTemplate | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [signatureType, setSignatureType] = useState<'draw' | 'type' | 'upload'>('draw');
  const [signatureName, setSignatureName] = useState('');
  const [assignedUser, setAssignedUser] = useState('');
  const [typedSignature, setTypedSignature] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Template creation form state
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateCategory, setTemplateCategory] = useState('SOP');
  const [templateContent, setTemplateContent] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    let signatureData = '';
    
    if (signatureType === 'draw' && canvas) {
      signatureData = canvas.toDataURL();
    } else if (signatureType === 'type') {
      signatureData = typedSignature;
    }
    
    // Here you would typically save to your backend
    console.log('Saving signature:', {
      name: signatureName,
      type: signatureType,
      data: signatureData,
      assignedUser
    });
    
    // Reset form and close modal
    setSignatureName('');
    setAssignedUser('');
    setTypedSignature('');
    clearCanvas();
    setShowCreateModal(false);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1';
    switch (status) {
      case 'Active':
      case 'Completed':
      case 'Signed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Draft':
      case 'Pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'In Progress':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'Archived':
      case 'Rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'SOP': 'bg-blue-100 text-blue-800',
      'Test Results': 'bg-green-100 text-green-800',
      'Batch Records': 'bg-purple-100 text-purple-800',
      'Deviation Reports': 'bg-red-100 text-red-800',
      'Change Control': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleEditTemplate = (template: SignatureTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };

  const handleCreateTemplate = () => {
    const newTemplate: SignatureTemplate = {
      id: Date.now().toString(),
      name: templateName || 'New Template',
      description: templateDescription || 'Template description',
      category: templateCategory as any,
      status: 'Active',
      fields: [],
      createdBy: 'Current User',
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      content: templateContent || ''
    };
    
    setTemplates(prev => [...prev, newTemplate]);
    
    // Reset form
    setTemplateName('');
    setTemplateDescription('');
    setTemplateCategory('SOP');
    setTemplateContent('');
    setShowCreateTemplateModal(false);
  };

  const tabs = [
    { id: 'templates', label: 'Templates', icon: FileSignature },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital Signatures</h1>
          <p className="text-gray-600">Manage signature templates and document workflows</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Pen className="h-5 w-5" />
            <span>Create Signature</span>
          </button>
          {activeTab === 'templates' && (
            <button
              onClick={() => setShowCreateTemplateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              <span>Create Template</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'templates' && (
          <div className="space-y-6">
            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <FileSignature className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                          <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(template.category)}`}>
                            {template.category}
                          </span>
                        </div>
                      </div>
                      <span className={getStatusBadge(template.status)}>
                        {template.status}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{template.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="h-3 w-3 mr-1" />
                        <span>Created by {template.createdBy}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Modified {new Date(template.lastModified).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditTemplate(template)}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </button>
                        <button 
                          onClick={() => handleEditTemplate(template)}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl space-y-8">
            {/* General Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Require Digital Signatures</label>
                    <p className="text-sm text-gray-500">Enforce digital signatures for all critical documents</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Multi-level Approval</label>
                    <p className="text-sm text-gray-500">Enable sequential approval workflows</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                    <p className="text-sm text-gray-500">Send email notifications for signature requests</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Certificate Management */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Management</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate Authority
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Internal CA</option>
                    <option>DigiCert</option>
                    <option>GlobalSign</option>
                    <option>Entrust</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate Validity Period (days)
                  </label>
                  <input
                    type="number"
                    defaultValue={365}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto-renewal
                  </label>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-600">Automatically renew certificates before expiration</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regulatory Standard
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>21 CFR Part 11</option>
                    <option>EU GMP Annex 11</option>
                    <option>ICH Q7</option>
                    <option>ISO 13485</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Audit Trail Retention (years)
                  </label>
                  <input
                    type="number"
                    defaultValue={7}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-sm text-gray-600">Enable tamper-evident sealing</span>
                </div>

                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-sm text-gray-600">Require reason for signature</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Signature Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create Digital Signature</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Signature Name
                    </label>
                    <input
                      type="text"
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      placeholder="Enter signature name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign to User
                    </label>
                    <select 
                      value={assignedUser}
                      onChange={(e) => setAssignedUser(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select User</option>
                      <option value="alice">Alice Johnson</option>
                      <option value="bob">Bob Wilson</option>
                      <option value="carol">Carol Davis</option>
                      <option value="david">David Chen</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Signature Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setSignatureType('draw')}
                      className={`border-2 rounded-lg p-4 text-left transition-colors ${
                        signatureType === 'draw' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <Pen className="h-6 w-6 text-blue-600 mb-2" />
                      <h4 className="font-medium text-gray-900">Draw Signature</h4>
                      <p className="text-sm text-gray-500">Draw your signature using mouse or touch</p>
                    </button>
                    <button
                      onClick={() => setSignatureType('type')}
                      className={`border-2 rounded-lg p-4 text-left transition-colors ${
                        signatureType === 'type' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <Type className="h-6 w-6 text-blue-600 mb-2" />
                      <h4 className="font-medium text-gray-900">Type Signature</h4>
                      <p className="text-sm text-gray-500">Type your name in a signature font</p>
                    </button>
                    <button
                      onClick={() => setSignatureType('upload')}
                      className={`border-2 rounded-lg p-4 text-left transition-colors ${
                        signatureType === 'upload' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <ImageIcon className="h-6 w-6 text-blue-600 mb-2" />
                      <h4 className="font-medium text-gray-900">Upload Image</h4>
                      <p className="text-sm text-gray-500">Upload an image of your signature</p>
                    </button>
                  </div>
                </div>

                {signatureType === 'draw' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Draw your signature below:</label>
                      <button
                        onClick={clearCanvas}
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Clear</span>
                      </button>
                    </div>
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <canvas 
                        ref={canvasRef}
                        width={600} 
                        height={200} 
                        className="border border-gray-300 bg-white rounded mx-auto cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                      />
                      <p className="text-gray-600 mt-2 text-sm">Use your mouse to draw your signature above</p>
                    </div>
                  </div>
                )}

                {signatureType === 'type' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type your name
                      </label>
                      <input
                        type="text"
                        value={typedSignature}
                        onChange={(e) => setTypedSignature(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-8 text-center">
                      <div className="text-4xl text-blue-600" style={{ fontFamily: 'cursive' }}>
                        {typedSignature || 'Your signature will appear here'}
                      </div>
                    </div>
                  </div>
                )}

                {signatureType === 'upload' && (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Signature Image</h4>
                    <p className="text-gray-600 mb-4">Choose an image file (PNG, JPG, SVG)</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="signature-upload"
                    />
                    <label
                      htmlFor="signature-upload"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={saveSignature}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>Save Signature</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create Signature Template</h2>
              <button
                onClick={() => setShowCreateTemplateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Name
                    </label>
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Enter template name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select 
                      value={templateCategory}
                      onChange={(e) => setTemplateCategory(e.target.value)}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="Enter template description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Content
                  </label>
                  <textarea
                    rows={10}
                    value={templateContent}
                    onChange={(e) => setTemplateContent(e.target.value)}
                    placeholder="Enter HTML content for the template"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Template Guidelines</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Use HTML markup for formatting</li>
                    <li>• Add signature fields using placeholder text</li>
                    <li>• Include all required regulatory information</li>
                    <li>• Test template before making it active</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreateTemplateModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateTemplate}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>Create Template</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{selectedTemplate.name}</h2>
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
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div dangerouslySetInnerHTML={{ __html: selectedTemplate.content || '' }} />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowTemplateModal(false);
                  setSelectedTemplate(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                Edit Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};