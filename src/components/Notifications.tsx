import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Settings, 
  Check, 
  X, 
  Clock, 
  AlertTriangle,
  Info,
  CheckCircle,
  User,
  Calendar,
  Filter,
  Search,
  Eye,
  Pencil,
  Trash2,
  Edit // <-- Add Edit icon import
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'System' | 'Workflow' | 'User' | 'Security' | 'Backup';
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionRequired: boolean;
}

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'email' | 'in-app' | 'sms';
  triggers: string[];
  recipients: string[];
  active: boolean;
}

const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'Workflow Approval Required',
    message: 'Document Review Process requires your approval for SOP-001',
    type: 'warning',
    category: 'Workflow',
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
    priority: 'high',
    actionRequired: true
  },
  {
    id: '2',
    title: 'System Backup Completed',
    message: 'Daily backup completed successfully at 2:00 AM',
    type: 'success',
    category: 'System',
    timestamp: '2024-01-15T02:00:00Z',
    read: true,
    priority: 'low',
    actionRequired: false
  },
  {
    id: '3',
    title: 'New User Registration',
    message: 'Eve Martinez has been added as Analyst Trainee',
    type: 'info',
    category: 'User',
    timestamp: '2024-01-14T16:45:00Z',
    read: false,
    priority: 'medium',
    actionRequired: false
  },
  {
    id: '4',
    title: 'Security Alert',
    message: 'Multiple failed login attempts detected for user account',
    type: 'error',
    category: 'Security',
    timestamp: '2024-01-14T14:20:00Z',
    read: false,
    priority: 'high',
    actionRequired: true
  },
  {
    id: '5',
    title: 'Digital Signature Expiring',
    message: 'Your digital signature certificate expires in 30 days',
    type: 'warning',
    category: 'User',
    timestamp: '2024-01-14T09:15:00Z',
    read: true,
    priority: 'medium',
    actionRequired: true
  }
];

const sampleTemplates: NotificationTemplate[] = [
  {
    id: '1',
    name: 'Workflow Approval Required',
    subject: 'Action Required: {{workflow_name}} Approval',
    body: 'Hello {{recipient_name}},\n\nThe workflow "{{workflow_name}}" requires your approval.\n\nPlease review and take action at your earliest convenience.',
    type: 'email',
    category: 'Workflow',
    triggers: ['workflow_approval_required'],
    recipients: ['approvers', 'workflow_owner'],
    active: true
  },
  {
    id: '2',
    name: 'System Backup Status',
    subject: 'System Backup {{status}}',
    body: 'System backup has {{status}} at {{timestamp}}.\n\n{{details}}',
    type: 'email',
    category: 'System',
    triggers: ['backup_completed', 'backup_failed'],
    recipients: ['system_admins'],
    active: true
  },
  {
    id: '3',
    name: 'User Account Created',
    subject: 'Welcome to LIMS - {{user_name}}',
    body: 'Welcome {{user_name}},\n\nYour account has been created successfully.\n\nUsername: {{username}}\nRole: {{role}}\n\nPlease change your password on first login.',
    type: 'email',
    category: 'User',
    triggers: ['user_created'],
    recipients: ['new_user'],
    active: true
  },
  {
    id: '4',
    name: 'Security Alert',
    subject: 'Security Alert - {{alert_type}}',
    body: 'Security Alert: {{alert_type}}\n\nTime: {{timestamp}}\nDetails: {{details}}\n\nPlease review and take appropriate action.',
    type: 'email',
    category: 'Security',
    triggers: ['security_alert'],
    recipients: ['security_team', 'system_admins'],
    active: true
  },
  {
    id: '5',
    name: 'Backup Failure',
    subject: 'Backup Failed - {{backup_type}}',
    body: 'Backup failure detected:\n\nBackup Type: {{backup_type}}\nTime: {{timestamp}}\nError: {{error_message}}\n\nImmediate attention required.',
    type: 'email',
    category: 'Backup',
    triggers: ['backup_failed'],
    recipients: ['system_admins'],
    active: true
  }
];

export const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'settings'>('templates');
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [templates, setTemplates] = useState<NotificationTemplate[]>(sampleTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (priority) {
      case 'high':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'System': 'bg-blue-100 text-blue-800',
      'Workflow': 'bg-purple-100 text-purple-800',
      'User': 'bg-green-100 text-green-800',
      'Security': 'bg-red-100 text-red-800',
      'Backup': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || notif.category === filterCategory;
    const matchesType = filterType === 'All' || notif.type === filterType;
    const matchesRead = !showUnreadOnly || !notif.read;
    return matchesSearch && matchesCategory && matchesType && matchesRead;
  });

  // Add filteredTemplates for search/filter logic
  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = filterCategory === 'All' || template.category === filterCategory;
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch =
      search.length < 2 ||
      template.name.toLowerCase().includes(search) ||
      template.subject.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });

  // Pagination (optional, for large lists)
  // const [currentPage, setCurrentPage] = useState(1);
  // const pageSize = 6;
  // const totalTemplates = filteredTemplates.length;
  // const totalPages = Math.max(1, Math.ceil(totalTemplates / pageSize));
  // const paginatedTemplates = filteredTemplates.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const unreadCount = notifications.filter(n => !n.read).length;
  const categories = ['All', ...Array.from(new Set(notifications.map(n => n.category)))];
  const types = ['All', 'info', 'warning', 'error', 'success'];

  const tabs = [
    { id: 'templates', label: 'Templates', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Template modal handlers
  const openCreateModal = () => {
    setModalMode('create');
    setSelectedTemplate(null);
    setShowTemplateModal(true);
  };
  const openEditModal = (template: NotificationTemplate) => {
    setModalMode('edit');
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };
  const openViewModal = (template: NotificationTemplate) => {
    setModalMode('view');
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };
  const closeTemplateModal = () => {
    setShowTemplateModal(false);
    setSelectedTemplate(null);
    setModalMode(null);
  };

  // Create/Edit Template
  const handleSaveTemplate = (template: NotificationTemplate) => {
    if (modalMode === 'create') {
      setTemplates(prev => [...prev, { ...template, id: (Date.now()).toString() }]);
    } else if (modalMode === 'edit' && selectedTemplate) {
      setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? template : t));
    }
    closeTemplateModal();
  };

  // Delete Template
  const handleDeleteTemplate = () => {
    if (selectedTemplate) {
      setTemplates(prev => prev.filter(t => t.id !== selectedTemplate.id));
    }
    setShowDeleteConfirm(false);
    closeTemplateModal();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Manage system notifications and alerts</p>
        </div>
        {/* Move Create Template button here */}
        {activeTab === 'templates' && (
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={openCreateModal}
          >
            <Mail className="h-5 w-5" />
            <span>Create Template</span>
          </button>
        )}
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
            {/* Search and Filter Controls */}
            <div className="flex flex-row items-center space-x-4 mb-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search templates..."
                  className="w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-200"
                />
              </div>
              <div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                >
                  <option value="All">All Categories</option>
                  {Array.from(new Set(templates.map(t => t.category))).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Showing X of Y */}
            <div className="text-sm text-gray-500 mb-2">
              Showing {filteredTemplates.length} of {templates.length} template{templates.length === 1 ? '' : 's'}
            </div>
            {/* Templates Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notification Templates</h3>
            </div>

            {/* Card View for Templates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col shadow-sm relative"
                  style={{ minHeight: 380 }} // Increased card height to provide more space
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 mr-4">
                      <h4 className="text-lg font-medium text-gray-900 cursor-pointer hover:underline"
                        onClick={() => openViewModal(template)}
                      >
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{template.subject}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        template.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {template.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        {template.type}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-md p-3 mb-4 flex-1">
                    <p className="text-sm text-gray-700 whitespace-pre-line line-clamp-4">{template.body}</p>
                  </div>
                  <div className="flex items-center justify-between mb-16">
                    <div className="text-xs text-gray-500">
                      <span>Triggers: {template.triggers.join(', ')}</span>
                    </div>
                  </div>
                  {/* Action icons at bottom with better spacing */}
                  <div className="absolute left-4 bottom-4 flex space-x-2">
                    <button
                      onClick={() => openViewModal(template)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => openEditModal(template)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <div className="absolute right-4 bottom-4">
                    <button
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                      onClick={() => { setSelectedTemplate(template); setShowDeleteConfirm(true); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {filteredTemplates.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-12">
                  No templates found.
                </div>
              )}
            </div>

            {/* Template Modal */}
            {showTemplateModal && (
              <TemplateModal
                mode={modalMode}
                template={selectedTemplate}
                onClose={closeTemplateModal}
                onSave={handleSaveTemplate}
              />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <ConfirmDeleteModal
                templateName={selectedTemplate?.name || ''}
                onCancel={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteTemplate}
              />
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="w-full space-y-8">
            {/* Settings Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* General Settings */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Enable Email Notifications</label>
                        <p className="text-sm text-gray-500">Send notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Enable In-App Notifications</label>
                        <p className="text-sm text-gray-500">Show notifications within the application</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Enable SMS Notifications</label>
                        <p className="text-sm text-gray-500">Send critical alerts via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Enable Push Notifications</label>
                        <p className="text-sm text-gray-500">Browser push notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Delivery Settings */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notification Frequency
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>Immediate</option>
                        <option>Every 15 minutes</option>
                        <option>Hourly</option>
                        <option>Daily digest</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quiet Hours (Start)
                      </label>
                      <input
                        type="time"
                        defaultValue="22:00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quiet Hours (End)
                      </label>
                      <input
                        type="time"
                        defaultValue="08:00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                      <span className="text-sm text-gray-600">Respect quiet hours for all notifications</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Email Settings */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Server
                      </label>
                      <input
                        type="text"
                        defaultValue="smtp.pharmalims.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Port
                        </label>
                        <input
                          type="number"
                          defaultValue={587}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Security
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>TLS</option>
                          <option>SSL</option>
                          <option>None</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          placeholder="smtp_username"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue="noreply@pharmalims.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* SMS Settings */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">SMS Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMS Provider
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>Twilio</option>
                        <option>AWS SNS</option>
                        <option>MessageBird</option>
                        <option>Nexmo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key
                      </label>
                      <input
                        type="password"
                        placeholder="Enter SMS API key"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-600">Enable SMS delivery confirmations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Width Notification Categories */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.filter(c => c !== 'All').map((category) => (
                  <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-700">{category} Notifications</label>
                      <p className="text-xs text-gray-500">Enable {category.toLowerCase()} events</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Template Modal Component */}
      {showTemplateModal && (
        <TemplateModal
          mode={modalMode}
          template={selectedTemplate}
          onClose={closeTemplateModal}
          onSave={handleSaveTemplate}
        />
      )}

      {/* Confirm Delete Modal */}
      {showDeleteConfirm && (
        <ConfirmDeleteModal
          templateName={selectedTemplate?.name || ''}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteTemplate}
        />
      )}
    </div>
  );
};

// Template Modal Component
const TemplateModal: React.FC<{
  mode: 'create' | 'edit' | 'view' | null,
  template: NotificationTemplate | null,
  onClose: () => void,
  onSave: (t: NotificationTemplate) => void
}> = ({ mode, template, onClose, onSave }) => {
  const isView = mode === 'view';
  const [form, setForm] = useState<NotificationTemplate>(
    template || {
      id: '',
      name: '',
      subject: '',
      body: '',
      type: 'email',
      triggers: [],
      recipients: [],
      active: true
    }
  );
  const [triggerInput, setTriggerInput] = useState('');
  const [recipientInput, setRecipientInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };
  const addTrigger = () => {
    if (triggerInput && !form.triggers.includes(triggerInput)) {
      setForm({ ...form, triggers: [...form.triggers, triggerInput] });
      setTriggerInput('');
    }
  };
  const removeTrigger = (t: string) => {
    setForm({ ...form, triggers: form.triggers.filter(tr => tr !== t) });
  };
  const addRecipient = () => {
    if (recipientInput && !form.recipients.includes(recipientInput)) {
      setForm({ ...form, recipients: [...form.recipients, recipientInput] });
      setRecipientInput('');
    }
  };
  const removeRecipient = (r: string) => {
    setForm({ ...form, recipients: form.recipients.filter(rec => rec !== r) });
  };

  // Prevent background scroll and stacking modals
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Only one modal should be rendered at a time
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div
        className={`bg-white rounded-lg shadow-lg w-full ${
          isView ? 'max-w-lg' : 'max-w-2xl'
        } px-8 py-6 relative`}
      >
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {mode === 'create' && 'Create Template'}
          {mode === 'edit' && 'Edit Template'}
          {mode === 'view' && 'View Template'}
        </h2>
        <form
          className="space-y-4"
          onSubmit={e => { e.preventDefault(); if (!isView) onSave(form); }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              disabled={isView}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              name="subject"
              type="text"
              value={form.subject}
              onChange={handleChange}
              disabled={isView}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              disabled={isView}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={4}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                disabled={isView}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="email">Email</option>
                <option value="in-app">In-App</option>
                <option value="sms">SMS</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 mt-6">
              <input
                name="active"
                type="checkbox"
                checked={form.active}
                onChange={handleCheckbox}
                disabled={isView}
                className="h-4 w-4"
              />
              <label className="text-sm text-gray-700">Active</label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Triggers</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.triggers.map(t => (
                <span key={t} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                  {t}
                  {!isView && (
                    <button type="button" className="ml-1 text-red-500" onClick={() => removeTrigger(t)}>
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {!isView && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={triggerInput}
                  onChange={e => setTriggerInput(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded-md"
                  placeholder="Add trigger"
                />
                <button type="button" className="px-2 py-1 bg-blue-600 text-white rounded-md" onClick={addTrigger}>Add</button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.recipients.map(r => (
                <span key={r} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center">
                  {r}
                  {!isView && (
                    <button type="button" className="ml-1 text-red-500" onClick={() => removeRecipient(r)}>
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {!isView && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={recipientInput}
                  onChange={e => setRecipientInput(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded-md"
                  placeholder="Add recipient"
                />
                <button type="button" className="px-2 py-1 bg-blue-600 text-white rounded-md" onClick={addRecipient}>Add</button>
              </div>
            )}
          </div>
          {!isView && (
            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {mode === 'create' ? 'Create' : 'Save'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// Confirm Delete Modal
const ConfirmDeleteModal: React.FC<{
  templateName: string,
  onCancel: () => void,
  onConfirm: () => void
}> = ({ templateName, onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Template</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{templateName}</strong>? 
          This action cannot be undone.
        </p>
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
);