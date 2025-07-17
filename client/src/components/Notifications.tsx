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
  Plus
} from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { StatsCard } from './common/StatsCard';
import { UnifiedSearchFilter } from './common/UnifiedSearchFilter';

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
    triggers: ['backup_completed', 'backup_failed'],
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

  const unreadCount = notifications.filter(n => !n.read).length;
  const categories = ['All', ...Array.from(new Set(notifications.map(n => n.category)))];
  const types = ['All', 'info', 'warning', 'error', 'success'];

  const tabs = [
    { id: 'templates', label: 'Templates', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Manage system notifications and alerts</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={markAllAsRead}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Check className="h-5 w-5" />
            <span>Mark All Read</span>
          </button>
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
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'templates' && (
          <div className="space-y-6">
            {/* Templates Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notification Templates</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Mail className="h-5 w-5" />
                <span>Create Template</span>
              </button>
            </div>

            {/* Templates List */}
            <div className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.subject}</p>
                    </div>
                    <div className="flex items-center space-x-2">
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

                  <div className="bg-gray-50 rounded-md p-3 mb-4">
                    <p className="text-sm text-gray-700 whitespace-pre-line">{template.body}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span>Triggers: {template.triggers.join(', ')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
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
              </div>
            </div>

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

            {/* Notification Categories */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Categories</h3>
              <div className="space-y-4">
                {categories.filter(c => c !== 'All').map((category) => (
                  <div key={category} className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">{category} Notifications</label>
                      <p className="text-sm text-gray-500">Enable notifications for {category.toLowerCase()} events</p>
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
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};