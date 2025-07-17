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
  const [activeTab, setActiveTab] = useState<'notifications' | 'templates' | 'settings'>('notifications');
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [templates, setTemplates] = useState<NotificationTemplate[]>(sampleTemplates);
  
  // Search and Filter State
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('timestamp');
  const [groupValue, setGroupValue] = useState('none');
  const [dateFilter, setDateFilter] = useState('All');

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



  const unreadCount = notifications.filter(n => !n.read).length;
  const totalNotifications = notifications.length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high').length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired).length;

  // Unified filters
  const unifiedFilters = {
    category: {
      value: 'All',
      options: [
        { value: 'All', label: 'All Categories' },
        { value: 'System', label: 'System' },
        { value: 'Workflow', label: 'Workflow' },
        { value: 'User', label: 'User' },
        { value: 'Security', label: 'Security' },
        { value: 'Backup', label: 'Backup' }
      ],
      label: 'Category'
    },
    type: {
      value: 'All',
      options: [
        { value: 'All', label: 'All Types' },
        { value: 'info', label: 'Info' },
        { value: 'warning', label: 'Warning' },
        { value: 'error', label: 'Error' },
        { value: 'success', label: 'Success' }
      ],
      label: 'Type'
    },
    priority: {
      value: 'All',
      options: [
        { value: 'All', label: 'All Priorities' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' }
      ],
      label: 'Priority'
    },
    status: {
      value: 'All',
      options: [
        { value: 'All', label: 'All Status' },
        { value: 'Read', label: 'Read' },
        { value: 'Unread', label: 'Unread' }
      ],
      label: 'Status'
    }
  };

  // Filter state
  const [filters, setFilters] = useState({
    category: 'All',
    type: 'All',
    priority: 'All',
    status: 'All'
  });

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  const handleClearAll = () => {
    setSearchValue('');
    setSortValue('timestamp');
    setGroupValue('none');
    setDateFilter('All');
    setFilters({
      category: 'All',
      type: 'All',
      priority: 'All',
      status: 'All'
    });
  };

  // Update unified filters to use filter state
  const updatedUnifiedFilters = {
    category: {
      value: filters.category,
      options: unifiedFilters.category.options,
      label: 'Category'
    },
    type: {
      value: filters.type,
      options: unifiedFilters.type.options,
      label: 'Type'
    },
    priority: {
      value: filters.priority,
      options: unifiedFilters.priority.options,
      label: 'Priority'
    },
    status: {
      value: filters.status,
      options: unifiedFilters.status.options,
      label: 'Status'
    }
  };

  // Apply filters and search
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = searchValue === '' || 
      notification.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesCategory = filters.category === 'All' || notification.category === filters.category;
    const matchesType = filters.type === 'All' || notification.type === filters.type;
    const matchesPriority = filters.priority === 'All' || notification.priority === filters.priority;
    const matchesStatus = filters.status === 'All' || 
      (filters.status === 'Read' && notification.read) ||
      (filters.status === 'Unread' && !notification.read);
    
    return matchesSearch && matchesCategory && matchesType && matchesPriority && matchesStatus;
  });

  // Apply sorting
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    switch (sortValue) {
      case 'timestamp':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'priority':
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  // Apply grouping
  const groupedNotifications = groupValue === 'none' ? 
    { 'All Notifications': sortedNotifications } : 
    sortedNotifications.reduce((groups, notification) => {
      const key = notification[groupValue as keyof typeof notification] as string;
      if (!groups[key]) groups[key] = [];
      groups[key].push(notification);
      return groups;
    }, {} as Record<string, typeof sortedNotifications>);

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'templates', label: 'Templates', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <PageHeader
        title="Notifications"
        subtitle="Manage system notifications and alerts"
        icon={Bell}
        actions={
          <button
            onClick={markAllAsRead}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Check className="h-4 w-4" />
            <span>Mark All Read</span>
          </button>
        }
      />

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto px-6">
          <nav className="flex space-x-8">
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
      </div>

      <div className="mx-auto px-6 py-8">
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Notifications"
                value={totalNotifications}
                icon={Bell}
                color="blue"
              />
              <StatsCard
                title="Unread"
                value={unreadCount}
                icon={AlertTriangle}
                color="yellow"
              />
              <StatsCard
                title="High Priority"
                value={highPriorityCount}
                icon={CheckCircle}
                color="red"
              />
              <StatsCard
                title="Action Required"
                value={actionRequiredCount}
                icon={User}
                color="orange"
              />
            </div>

            {/* Unified Search and Filter */}
            <UnifiedSearchFilter
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              filters={updatedUnifiedFilters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
              sortOptions={[
                { value: 'timestamp', label: 'Date' },
                { value: 'title', label: 'Title' },
                { value: 'priority', label: 'Priority' },
                { value: 'category', label: 'Category' }
              ]}
              sortValue={sortValue}
              onSortChange={setSortValue}
              groupOptions={[
                { value: 'none', label: 'None' },
                { value: 'category', label: 'Category' },
                { value: 'priority', label: 'Priority' },
                { value: 'type', label: 'Type' }
              ]}
              groupValue={groupValue}
              onGroupChange={setGroupValue}
              dateFilter={{
                value: dateFilter,
                onChange: setDateFilter
              }}
            />

            {/* Notifications List */}
            <div className="space-y-4">
              {Object.entries(groupedNotifications).map(([groupName, groupNotifications]) => (
                <div key={groupName}>
                  {groupValue !== 'none' && (
                    <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900">{groupName} ({groupNotifications.length})</h3>
                    </div>
                  )}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
                    {groupNotifications.map((notification) => (
                      <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              {getNotificationIcon(notification.type)}
                              <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                              <span className={getPriorityBadge(notification.priority)}>
                                {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                              </span>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{notification.category}</span>
                              <span>{new Date(notification.timestamp).toLocaleDateString()}</span>
                              {notification.actionRequired && (
                                <span className="text-red-600 font-medium">Action Required</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Mark as Read
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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