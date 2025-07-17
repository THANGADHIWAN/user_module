import React, { useState, useRef } from 'react';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Type,
  Hash,
  Calendar,
  CheckSquare,
  List,
  Mail,
  Phone,
  DollarSign,
  Percent,
  Link,
  FileText,
  Image,
  User,
  Building,
  MapPin,
  Clock,
  Eye,
  Move,
  MoreVertical,
  Upload,
  Search
} from 'lucide-react';

interface CustomField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'datetime' | 'email' | 'phone' | 'url' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'currency' | 'percentage' | 'file' | 'image' | 'user' | 'lookup';
  required: boolean;
  defaultValue?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  helpText?: string;
  isActive: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface ModulePage {
  id: string;
  name: string;
  module: string;
  description: string;
  fields: CustomField[];
  lastModified: string;
}

const GRID_SIZE = 20;

const fieldTypes = [
  { type: 'text', label: 'Single Line Text', icon: Type, description: 'Short text input', color: 'bg-blue-100 text-blue-800' },
  { type: 'textarea', label: 'Multi Line Text', icon: FileText, description: 'Long text input', color: 'bg-blue-100 text-blue-800' },
  { type: 'number', label: 'Number', icon: Hash, description: 'Numeric input', color: 'bg-green-100 text-green-800' },
  { type: 'email', label: 'Email', icon: Mail, description: 'Email address', color: 'bg-purple-100 text-purple-800' },
  { type: 'phone', label: 'Phone', icon: Phone, description: 'Phone number', color: 'bg-purple-100 text-purple-800' },
  { type: 'url', label: 'URL', icon: Link, description: 'Website URL', color: 'bg-purple-100 text-purple-800' },
  { type: 'date', label: 'Date', icon: Calendar, description: 'Date picker', color: 'bg-orange-100 text-orange-800' },
  { type: 'datetime', label: 'Date & Time', icon: Clock, description: 'Date and time picker', color: 'bg-orange-100 text-orange-800' },
  { type: 'select', label: 'Dropdown', icon: List, description: 'Single selection', color: 'bg-yellow-100 text-yellow-800' },
  { type: 'multiselect', label: 'Multi-Select', icon: List, description: 'Multiple selection', color: 'bg-yellow-100 text-yellow-800' },
  { type: 'radio', label: 'Radio Button', icon: CheckSquare, description: 'Single choice', color: 'bg-yellow-100 text-yellow-800' },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, description: 'Yes/No or multiple', color: 'bg-yellow-100 text-yellow-800' },
  { type: 'currency', label: 'Currency', icon: DollarSign, description: 'Monetary value', color: 'bg-green-100 text-green-800' },
  { type: 'percentage', label: 'Percentage', icon: Percent, description: 'Percentage value', color: 'bg-green-100 text-green-800' },
  { type: 'file', label: 'File Upload', icon: FileText, description: 'File attachment', color: 'bg-red-100 text-red-800' },
  { type: 'image', label: 'Image Upload', icon: Image, description: 'Image attachment', color: 'bg-red-100 text-red-800' },
  { type: 'user', label: 'User Lookup', icon: User, description: 'Select system user', color: 'bg-indigo-100 text-indigo-800' },
  { type: 'lookup', label: 'Lookup', icon: Building, description: 'Reference to record', color: 'bg-indigo-100 text-indigo-800' }
];

const modules = [
  'Sample Management',
  'Test Management', 
  'Instrument Management',
  'Batch Records',
  'Quality Control',
  'Deviation Management',
  'Change Control',
  'Training Records',
  'Supplier Management',
  'Document Control'
];

const samplePages: ModulePage[] = [
  {
    id: '1',
    name: 'Add Sample Form',
    module: 'Sample Management',
    description: 'Form for adding new samples to the system',
    lastModified: '2024-01-15T08:00:00Z',
    fields: [
      {
        id: '1',
        name: 'sample_id',
        label: 'Sample ID',
        type: 'text',
        required: true,
        position: { x: 40, y: 40 },
        size: { width: 300, height: 40 },
        isActive: true
      },
      {
        id: '2',
        name: 'sample_type',
        label: 'Sample Type',
        type: 'select',
        required: true,
        options: ['Raw Material', 'In-Process', 'Finished Product', 'Stability'],
        position: { x: 380, y: 40 },
        size: { width: 300, height: 40 },
        isActive: true
      },
      {
        id: '3',
        name: 'collection_date',
        label: 'Collection Date',
        type: 'date',
        required: true,
        position: { x: 40, y: 140 },
        size: { width: 300, height: 40 },
        isActive: true
      },
      {
        id: '4',
        name: 'priority',
        label: 'Priority',
        type: 'radio',
        required: false,
        options: ['Low', 'Medium', 'High', 'Critical'],
        defaultValue: 'Medium',
        position: { x: 380, y: 140 },
        size: { width: 300, height: 120 },
        isActive: true
      },
      {
        id: '5',
        name: 'description',
        label: 'Sample Description',
        type: 'textarea',
        required: false,
        position: { x: 40, y: 280 },
        size: { width: 640, height: 80 },
        isActive: true
      }
    ]
  },
  {
    id: '2',
    name: 'Test Method Setup',
    module: 'Test Management',
    description: 'Configuration form for test methods',
    lastModified: '2024-01-12T14:20:00Z',
    fields: [
      {
        id: '1',
        name: 'method_name',
        label: 'Method Name',
        type: 'text',
        required: true,
        position: { x: 40, y: 40 },
        size: { width: 300, height: 40 },
        isActive: true
      },
      {
        id: '2',
        name: 'test_temperature',
        label: 'Test Temperature (°C)',
        type: 'number',
        required: false,
        validation: { min: -80, max: 200 },
        position: { x: 380, y: 40 },
        size: { width: 300, height: 40 },
        isActive: true
      }
    ]
  },
  {
    id: '3',
    name: 'Instrument Registration',
    module: 'Instrument Management',
    description: 'Form for registering new instruments',
    lastModified: '2024-01-10T09:30:00Z',
    fields: [
      {
        id: '1',
        name: 'instrument_id',
        label: 'Instrument ID',
        type: 'text',
        required: true,
        position: { x: 40, y: 40 },
        size: { width: 300, height: 40 },
        isActive: true
      },
      {
        id: '2',
        name: 'calibration_due',
        label: 'Calibration Due Date',
        type: 'date',
        required: true,
        position: { x: 380, y: 40 },
        size: { width: 300, height: 40 },
        isActive: true
      }
    ]
  }
];

const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

export const CustomFields: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [pages, setPages] = useState<ModulePage[]>(samplePages);
  const [selectedPage, setSelectedPage] = useState<ModulePage | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedField, setDraggedField] = useState<any>(null);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [draggingField, setDraggingField] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState<Partial<CustomField>>({
    type: 'text',
    required: false,
    isActive: true,
    options: [],
    position: { x: 40, y: 40 },
    size: { width: 300, height: 40 }
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  const filteredPages = selectedModule === 'All' 
    ? pages 
    : pages.filter(page => page.module === selectedModule);

  const getFieldTypeInfo = (type: string) => {
    return fieldTypes.find(ft => ft.type === type) || fieldTypes[0];
  };

  const handlePageClick = (page: ModulePage) => {
    setSelectedPage(page);
    setIsEditMode(false);
  };

  const handleEditPage = (page: ModulePage) => {
    setSelectedPage(page);
    setIsEditMode(true);
  };

  const handleDragStart = (e: React.DragEvent, fieldType: any) => {
    setDraggedField(fieldType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedField || !selectedPage) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = snapToGrid(e.clientX - rect.left);
    const y = snapToGrid(e.clientY - rect.top);

    const newField: CustomField = {
      id: Date.now().toString(),
      name: `${draggedField.type}_${Date.now()}`,
      label: `New ${draggedField.label}`,
      type: draggedField.type,
      required: false,
      isActive: true,
      position: { x: Math.max(0, x - 150), y: Math.max(0, y - 20) },
      size: { width: 300, height: draggedField.type === 'textarea' ? 80 : 40 }
    };

    const updatedPage = {
      ...selectedPage,
      fields: [...selectedPage.fields, newField]
    };

    setPages(prev => prev.map(p => p.id === selectedPage.id ? updatedPage : p));
    setSelectedPage(updatedPage);
    setDraggedField(null);
  };

  const handleFieldMouseDown = (e: React.MouseEvent, fieldId: string) => {
    if (!isEditMode) return;
    
    e.preventDefault();
    const field = selectedPage?.fields.find(f => f.id === fieldId);
    if (!field) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggingField(fieldId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingField || !selectedPage || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = snapToGrid(e.clientX - canvasRect.left - dragOffset.x);
    const newY = snapToGrid(e.clientY - canvasRect.top - dragOffset.y);

    const updatedPage = {
      ...selectedPage,
      fields: selectedPage.fields.map(f => 
        f.id === draggingField 
          ? { ...f, position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
          : f
      )
    };

    setPages(prev => prev.map(p => p.id === selectedPage.id ? updatedPage : p));
    setSelectedPage(updatedPage);
  };

  const handleMouseUp = () => {
    setDraggingField(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleFieldEdit = (field: CustomField) => {
    setEditingField(field);
    setFormData(field);
    setShowFieldModal(true);
  };

  const handleFieldDelete = (fieldId: string) => {
    if (!selectedPage) return;

    const updatedPage = {
      ...selectedPage,
      fields: selectedPage.fields.filter(f => f.id !== fieldId)
    };

    setPages(prev => prev.map(p => p.id === selectedPage.id ? updatedPage : p));
    setSelectedPage(updatedPage);
  };

  const handleSaveField = () => {
    if (!selectedPage || !editingField) return;

    const updatedPage = {
      ...selectedPage,
      fields: selectedPage.fields.map(f => 
        f.id === editingField.id ? { ...f, ...formData } : f
      )
    };

    setPages(prev => prev.map(p => p.id === selectedPage.id ? updatedPage : p));
    setSelectedPage(updatedPage);
    setShowFieldModal(false);
    setEditingField(null);
  };

  const renderFieldPreview = (field: CustomField) => {
    const fieldTypeInfo = getFieldTypeInfo(field.type);
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
        return (
          <input
            type={field.type === 'text' ? 'text' : field.type}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isEditMode}
          />
        );
      
      case 'number':
      case 'currency':
      case 'percentage':
        return (
          <input
            type="number"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isEditMode}
          />
        );
      
      case 'date':
        return (
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isEditMode}
          />
        );
      
      case 'datetime':
        return (
          <input
            type="datetime-local"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isEditMode}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            placeholder={`Enter ${field.label.toLowerCase()}`}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            disabled={isEditMode}
          />
        );
      
      case 'select':
        return (
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isEditMode}
          >
            <option value="">Select {field.label.toLowerCase()}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'multiselect':
        return (
          <select
            multiple
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isEditMode}
            size={Math.min(field.options?.length || 3, 4)}
          >
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.name}
                  value={option}
                  className="text-blue-600 focus:ring-blue-500"
                  disabled={isEditMode}
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        return field.options ? (
          <div className="space-y-2">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isEditMode}
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        ) : (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={isEditMode}
            />
            <span className="text-sm text-gray-700">{field.label}</span>
          </label>
        );
      
      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            <input type="file" className="hidden" disabled={isEditMode} />
          </div>
        );
      
      case 'image':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Upload image file</p>
            <input type="file" accept="image/*" className="hidden" disabled={isEditMode} />
          </div>
        );
      
      case 'user':
        return (
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isEditMode}
          >
            <option value="">Select user</option>
            <option value="alice">Alice Johnson</option>
            <option value="bob">Bob Wilson</option>
            <option value="carol">Carol Davis</option>
          </select>
        );
      
      case 'lookup':
        return (
          <div className="flex">
            <input
              type="text"
              placeholder="Search records..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isEditMode}
            />
            <button
              type="button"
              className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
              disabled={isEditMode}
            >
              <Search className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        );
      
      default:
        return (
          <input
            type="text"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isEditMode}
          />
        );
    }
  };

  const renderField = (field: CustomField) => {
    const fieldTypeInfo = getFieldTypeInfo(field.type);
    const Icon = fieldTypeInfo.icon;

    if (isEditMode) {
      return (
        <div
          key={field.id}
          className="absolute bg-white rounded-lg p-3 group transition-all border-2 border-dashed border-blue-300 hover:border-blue-500 cursor-move"
          style={{
            left: field.position.x,
            top: field.position.y,
            width: field.size.width,
            height: field.size.height
          }}
          onMouseDown={(e) => handleFieldMouseDown(e, field.id)}
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-2 flex-1">
              <Icon className="h-4 w-4 text-gray-500" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{field.label}</div>
                <div className="text-xs text-gray-500">{fieldTypeInfo.label}</div>
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFieldEdit(field);
                }}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit className="h-3 w-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFieldDelete(field.id);
                }}
                className="p-1 text-red-600 hover:bg-red-50 rounded ml-1"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // View mode - render as form field with proper spacing
    return (
      <div
        key={field.id}
        className="mb-6"
        style={{
          marginTop: field.position.y === 40 ? '0' : '20px'
        }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div style={{ width: field.size.width }}>
          {renderFieldPreview(field)}
        </div>
        {field.helpText && (
          <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
        )}
      </div>
    );
  };

  const renderViewModeFields = () => {
    if (!selectedPage) return null;

    // Sort fields by position for proper flow layout
    const sortedFields = [...selectedPage.fields].sort((a, b) => {
      if (a.position.y === b.position.y) {
        return a.position.x - b.position.x;
      }
      return a.position.y - b.position.y;
    });

    // Group fields by rows (same Y position)
    const fieldRows: CustomField[][] = [];
    let currentRow: CustomField[] = [];
    let currentY = -1;

    sortedFields.forEach(field => {
      if (field.position.y !== currentY) {
        if (currentRow.length > 0) {
          fieldRows.push(currentRow);
        }
        currentRow = [field];
        currentY = field.position.y;
      } else {
        currentRow.push(field);
      }
    });

    if (currentRow.length > 0) {
      fieldRows.push(currentRow);
    }

    return (
      <div className="space-y-6">
        {fieldRows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid gap-6" style={{
            gridTemplateColumns: row.length === 1 ? '1fr' : 
                                 row.length === 2 ? '1fr 1fr' : 
                                 'repeat(auto-fit, minmax(300px, 1fr))'
          }}>
            {row.map(field => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderFieldPreview(field)}
                {field.helpText && (
                  <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex">
      {!selectedPage ? (
        // Page List View
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Custom Fields</h1>
              <p className="text-gray-600">Configure custom fields for different module pages</p>
            </div>
          </div>

          {/* Module Filter */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter by Module:</label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Modules</option>
                {modules.map(module => (
                  <option key={module} value={module}>{module}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pages Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handlePageClick(page)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Settings className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{page.name}</h3>
                          <span className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                            {page.module}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{page.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{page.fields.length} fields configured</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Modified {new Date(page.lastModified).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePageClick(page);
                        }}
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPage(page);
                        }}
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPages.length === 0 && (
              <div className="text-center py-12">
                <Settings className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No pages found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No pages found for the selected module.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Page Editor View
        <div className="flex-1 flex">
          {/* Field Palette */}
          {isEditMode && (
            <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Field Types</h3>
              <div className="space-y-2">
                {fieldTypes.map((fieldType) => {
                  const Icon = fieldType.icon;
                  return (
                    <div
                      key={fieldType.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, fieldType)}
                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-move transition-colors"
                    >
                      <Icon className="h-5 w-5 text-gray-600" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{fieldType.label}</div>
                        <div className="text-xs text-gray-500">{fieldType.description}</div>
                      </div>
                      <Move className="h-4 w-4 text-gray-400" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Page Canvas */}
          <div className="flex-1 flex flex-col">
            {/* Page Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedPage(null)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ← Back to Pages
                </button>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedPage.name}</h2>
                  <p className="text-sm text-gray-500">{selectedPage.module}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {!isEditMode ? (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Edit className="h-5 w-5" />
                    <span>Edit Page</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditMode(false)}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setIsEditMode(false)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Save className="h-5 w-5" />
                      <span>Save Changes</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 p-6 bg-gray-50 overflow-auto">
              <div
                ref={canvasRef}
                className="relative bg-white rounded-lg border border-gray-200 min-h-[600px] p-6"
                style={{
                  backgroundImage: isEditMode ? `radial-gradient(circle, #e5e7eb 1px, transparent 1px)` : 'none',
                  backgroundSize: isEditMode ? `${GRID_SIZE}px ${GRID_SIZE}px` : 'auto'
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                {isEditMode && (
                  <div className="absolute inset-0 border-2 border-dashed border-blue-300 rounded-lg pointer-events-none">
                    <div className="absolute top-4 left-4 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      Drag fields from the left panel to add them to this page. Fields snap to grid for perfect alignment.
                    </div>
                  </div>
                )}
                
                {isEditMode ? (
                  selectedPage.fields.map(renderField)
                ) : (
                  renderViewModeFields()
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Field Edit Modal */}
      {showFieldModal && editingField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Field</h2>
              <button
                onClick={() => setShowFieldModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field Label
                  </label>
                  <input
                    type="text"
                    value={formData.label || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field Type
                  </label>
                  <select
                    value={formData.type || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {fieldTypes.map(type => (
                      <option key={type.type} value={type.type}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {(['select', 'multiselect', 'radio', 'checkbox'].includes(formData.type || '')) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options (one per line)
                    </label>
                    <textarea
                      value={(formData.options || []).join('\n')}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        options: e.target.value.split('\n').filter(o => o.trim()) 
                      }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Help Text
                  </label>
                  <input
                    type="text"
                    value={formData.helpText || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, helpText: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Help text for users"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.required || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, required: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Required field</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.isActive || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Active</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowFieldModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveField}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>Save Field</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};