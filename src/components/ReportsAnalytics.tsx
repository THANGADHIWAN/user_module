import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Download,
  Calendar,
  Filter,
  Eye
} from 'lucide-react';

interface ReportMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
  color: string;
}

interface Report {
  id: string;
  name: string;
  description: string;
  category: 'User Activity' | 'Workflow Performance' | 'Document Status' | 'System Usage';
  lastGenerated: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'On-Demand';
  status: 'Ready' | 'Generating' | 'Failed';
}

const metrics: ReportMetric[] = [
  {
    id: '1',
    title: 'Active Users',
    value: '24',
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: 'blue'
  },
  {
    id: '2',
    title: 'Pending Approvals',
    value: '8',
    change: '-5%',
    trend: 'down',
    icon: Clock,
    color: 'orange'
  },
  {
    id: '3',
    title: 'Completed Workflows',
    value: '156',
    change: '+23%',
    trend: 'up',
    icon: CheckCircle,
    color: 'green'
  },
  {
    id: '4',
    title: 'System Alerts',
    value: '3',
    change: '+1',
    trend: 'up',
    icon: AlertTriangle,
    color: 'red'
  }
];

const reports: Report[] = [
  {
    id: '1',
    name: 'User Activity Summary',
    description: 'Overview of user login patterns and system usage',
    category: 'User Activity',
    lastGenerated: '2024-01-15T08:00:00Z',
    frequency: 'Daily',
    status: 'Ready'
  },
  {
    id: '2',
    name: 'Workflow Performance Report',
    description: 'Analysis of workflow completion times and bottlenecks',
    category: 'Workflow Performance',
    lastGenerated: '2024-01-14T16:30:00Z',
    frequency: 'Weekly',
    status: 'Ready'
  },
  {
    id: '3',
    name: 'Document Approval Status',
    description: 'Status of pending and completed document approvals',
    category: 'Document Status',
    lastGenerated: '2024-01-15T09:15:00Z',
    frequency: 'Daily',
    status: 'Generating'
  },
  {
    id: '4',
    name: 'System Usage Analytics',
    description: 'Detailed system usage patterns and performance metrics',
    category: 'System Usage',
    lastGenerated: '2024-01-13T12:00:00Z',
    frequency: 'Monthly',
    status: 'Ready'
  }
];

export const ReportsAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'analytics'>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const getMetricColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500',
      orange: 'bg-orange-500',
      green: 'bg-green-500',
      red: 'bg-red-500'
    };
    return colors[color] || 'bg-gray-500';
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '➡️';
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'Ready':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Generating':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'Failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const filteredReports = selectedCategory === 'All' 
    ? reports 
    : reports.filter(report => report.category === selectedCategory);

  const categories = ['All', ...Array.from(new Set(reports.map(r => r.category)))];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Monitor system performance and generate insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-5 w-5" />
            <span>Export Data</span>
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
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.id} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                        <p className={`text-sm flex items-center space-x-1 ${
                          metric.trend === 'up' ? 'text-green-600' : 
                          metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          <span>{getTrendIcon(metric.trend)}</span>
                          <span>{metric.change}</span>
                        </p>
                      </div>
                      <div className={`h-12 w-12 rounded-lg ${getMetricColor(metric.color)} flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity Trends</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Chart visualization would appear here</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Performance</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Chart visualization would appear here</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New user registered</p>
                    <p className="text-xs text-gray-500">Eve Martinez joined as Analyst Trainee</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>

                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Workflow completed</p>
                    <p className="text-xs text-gray-500">Sample Testing Workflow finished successfully</p>
                  </div>
                  <span className="text-xs text-gray-500">4 hours ago</span>
                </div>

                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Approval pending</p>
                    <p className="text-xs text-gray-500">Document Review Process awaiting approval</p>
                  </div>
                  <span className="text-xs text-gray-500">6 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <div key={report.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                        <span className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                          {report.category}
                        </span>
                      </div>
                      <span className={getStatusBadge(report.status)}>
                        {report.status}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{report.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Last generated: {new Date(report.lastGenerated).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Frequency: {report.frequency}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md">
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </button>
                        <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                          <Download className="h-3 w-3" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Analytics Overview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">System Analytics Overview</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance Metrics */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Performance Metrics</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Average Response Time</span>
                      <span className="text-sm font-medium text-gray-900">1.2s</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">System Uptime</span>
                      <span className="text-sm font-medium text-gray-900">99.8%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.8%' }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Error Rate</span>
                      <span className="text-sm font-medium text-gray-900">0.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '0.2%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Usage Statistics */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Usage Statistics</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Daily Active Users</span>
                      <span className="text-sm font-medium text-gray-900">18</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Documents Processed</span>
                      <span className="text-sm font-medium text-gray-900">245</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Workflows Executed</span>
                      <span className="text-sm font-medium text-gray-900">89</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Digital Signatures</span>
                      <span className="text-sm font-medium text-gray-900">156</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">User engagement analytics would appear here</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Load</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">System load analytics would appear here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};