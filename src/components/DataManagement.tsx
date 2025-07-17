import React, { useState } from 'react';
import { 
  Database, 
  Folder, 
  File, 
  Search, 
  Filter, 
  Plus,
  Upload,
  Download,
  Share,
  Lock,
  Unlock,
  Eye,
  Edit,
  Trash2,
  Users,
  Settings,
  FolderPlus,
  Server,
  Table,
  Grid,
  List
} from 'lucide-react';

interface DataFolder {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  lastModified: string;
  owner: string;
  permissions: string[];
  shared: boolean;
  locked: boolean;
  parent?: string;
}

interface DatabaseTable {
  id: string;
  name: string;
  schema: string;
  rows: number;
  size: string;
  lastModified: string;
  description: string;
}

interface UserPermission {
  userId: string;
  userName: string;
  role: string;
  permissions: ('read' | 'write' | 'delete' | 'share')[];
}

const sampleFolders: DataFolder[] = [
  {
    id: '1',
    name: 'Sample Data',
    type: 'folder',
    lastModified: '2024-01-15T10:30:00Z',
    owner: 'Alice Johnson',
    permissions: ['read', 'write'],
    shared: true,
    locked: false
  },
  {
    id: '2',
    name: 'Test Results',
    type: 'folder',
    lastModified: '2024-01-14T16:45:00Z',
    owner: 'Bob Wilson',
    permissions: ['read', 'write'],
    shared: false,
    locked: true
  },
  {
    id: '3',
    name: 'Batch Records',
    type: 'folder',
    lastModified: '2024-01-13T09:20:00Z',
    owner: 'Carol Davis',
    permissions: ['read'],
    shared: true,
    locked: false
  },
  {
    id: '4',
    name: 'TR-2024-001.pdf',
    type: 'file',
    size: '2.4 MB',
    lastModified: '2024-01-15T08:15:00Z',
    owner: 'David Chen',
    permissions: ['read', 'write'],
    shared: false,
    locked: false,
    parent: '2'
  },
  {
    id: '5',
    name: 'SOP-QC-001.docx',
    type: 'file',
    size: '856 KB',
    lastModified: '2024-01-12T14:30:00Z',
    owner: 'Eve Martinez',
    permissions: ['read'],
    shared: true,
    locked: true,
    parent: '1'
  }
];

const sampleTables: DatabaseTable[] = [
  {
    id: '1',
    name: 'users',
    schema: 'public',
    rows: 24,
    size: '128 KB',
    lastModified: '2024-01-15T10:30:00Z',
    description: 'User account information and authentication data'
  },
  {
    id: '2',
    name: 'samples',
    schema: 'lims',
    rows: 1547,
    size: '2.4 MB',
    lastModified: '2024-01-15T09:15:00Z',
    description: 'Sample tracking and metadata'
  },
  {
    id: '3',
    name: 'test_results',
    schema: 'lims',
    rows: 3892,
    size: '8.7 MB',
    lastModified: '2024-01-15T08:45:00Z',
    description: 'Laboratory test results and measurements'
  },
  {
    id: '4',
    name: 'workflows',
    schema: 'workflow',
    rows: 156,
    size: '512 KB',
    lastModified: '2024-01-14T16:20:00Z',
    description: 'Workflow definitions and process templates'
  }
];

const samplePermissions: UserPermission[] = [
  {
    userId: '1',
    userName: 'Alice Johnson',
    role: 'Admin',
    permissions: ['read', 'write', 'delete', 'share']
  },
  {
    userId: '2',
    userName: 'Bob Wilson',
    role: 'Lab Manager',
    permissions: ['read', 'write', 'share']
  },
  {
    userId: '3',
    userName: 'Carol Davis',
    role: 'QA Officer',
    permissions: ['read', 'write']
  },
  {
    userId: '4',
    userName: 'David Chen',
    role: 'QC Analyst',
    permissions: ['read']
  }
];

export const DataManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'files' | 'database' | 'permissions' | 'settings'>('files');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [folders, setFolders] = useState<DataFolder[]>(sampleFolders);
  const [tables, setTables] = useState<DatabaseTable[]>(sampleTables);
  const [permissions, setPermissions] = useState<UserPermission[]>(samplePermissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string[]>(['Root']);

  const getFileIcon = (item: DataFolder) => {
    if (item.type === 'folder') {
      return <Folder className="h-8 w-8 text-blue-500" />;
    }
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const getPermissionBadge = (permissions: string[]) => {
    if (permissions.includes('write')) {
      return 'bg-green-100 text-green-800';
    } else if (permissions.includes('read')) {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const filteredFolders = folders.filter(folder => 
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'files', label: 'File Management', icon: Folder },
    { id: 'database', label: 'Database View', icon: Database },
    { id: 'permissions', label: 'Access Control', icon: Users },
    { id: 'settings', label: 'Configuration', icon: Settings }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Management</h1>
          <p className="text-gray-600">Manage files, database access, and user permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          {activeTab === 'files' && (
            <>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <FolderPlus className="h-5 w-5" />
                <span>New Folder</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Upload className="h-5 w-5" />
                <span>Upload</span>
              </button>
            </>
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
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'files' && (
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search files and folders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>All Types</option>
                  <option>Folders</option>
                  <option>Documents</option>
                  <option>Images</option>
                  <option>Data Files</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {currentPath.map((path, index) => (
                <React.Fragment key={index}>
                  <button className="hover:text-blue-600">{path}</button>
                  {index < currentPath.length - 1 && <span>/</span>}
                </React.Fragment>
              ))}
            </div>

            {/* File Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredFolders.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-3">
                        {getFileIcon(item)}
                        {item.shared && (
                          <Share className="absolute -top-1 -right-1 h-4 w-4 text-green-500" />
                        )}
                        {item.locked && (
                          <Lock className="absolute -bottom-1 -right-1 h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 truncate w-full" title={item.name}>
                        {item.name}
                      </h3>
                      {item.size && (
                        <p className="text-xs text-gray-500 mt-1">{item.size}</p>
                      )}
                      <div className="flex items-center justify-center mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPermissionBadge(item.permissions)}`}>
                          {item.permissions.includes('write') ? 'Edit' : 'View'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Modified
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Access
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFolders.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getFileIcon(item)}
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 flex items-center">
                                {item.name}
                                {item.shared && <Share className="ml-2 h-4 w-4 text-green-500" />}
                                {item.locked && <Lock className="ml-2 h-4 w-4 text-red-500" />}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.size || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.owner}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.lastModified).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPermissionBadge(item.permissions)}`}>
                            {item.permissions.includes('write') ? 'Edit' : 'View'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50">
                              <Download className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50">
                              <Share className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'database' && (
          <div className="space-y-6">
            {/* Database Connection Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Database Connection</h3>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Connected</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Host:</span>
                  <span className="ml-2 font-medium">localhost:5432</span>
                </div>
                <div>
                  <span className="text-gray-500">Database:</span>
                  <span className="ml-2 font-medium">pharma_lims</span>
                </div>
                <div>
                  <span className="text-gray-500">User:</span>
                  <span className="ml-2 font-medium">lims_admin</span>
                </div>
              </div>
            </div>

            {/* Database Tables */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Table className="h-5 w-5 mr-2" />
                  Database Tables
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Table Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Schema
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rows
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Modified
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tables.map((table) => (
                      <tr key={table.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{table.name}</div>
                            <div className="text-sm text-gray-500">{table.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {table.schema}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {table.rows.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {table.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(table.lastModified).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50">
                              <Download className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50">
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="space-y-6">
            {/* Access Control Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">User Access Control</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="h-5 w-5" />
                <span>Add User</span>
              </button>
            </div>

            {/* Permissions Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Read
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Write
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delete
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Share
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {permissions.map((user) => (
                      <tr key={user.userId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                              {user.userName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={user.permissions.includes('read')}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            readOnly
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={user.permissions.includes('write')}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            readOnly
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={user.permissions.includes('delete')}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            readOnly
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={user.permissions.includes('share')}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            readOnly
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl space-y-8">
            {/* Database Configuration */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Server className="h-5 w-5 mr-2" />
                Database Configuration
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Database Host
                    </label>
                    <input
                      type="text"
                      defaultValue="localhost"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Port
                    </label>
                    <input
                      type="number"
                      defaultValue={5432}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Database Name
                  </label>
                  <input
                    type="text"
                    defaultValue="pharma_lims"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      defaultValue="lims_admin"
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

                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Test Connection
                </button>
              </div>
            </div>

            {/* Storage Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Storage Location
                  </label>
                  <input
                    type="text"
                    defaultValue="/data/pharma-lims"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum File Size (MB)
                  </label>
                  <input
                    type="number"
                    defaultValue={100}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-sm text-gray-600">Enable file versioning</span>
                </div>

                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-sm text-gray-600">Automatic backup of critical files</span>
                </div>
              </div>
            </div>

            {/* Access Control Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Control Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Inherit Folder Permissions</label>
                    <p className="text-sm text-gray-500">New files inherit parent folder permissions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Audit File Access</label>
                    <p className="text-sm text-gray-500">Log all file access and modifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Permission Level
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Read Only</option>
                    <option>Read/Write</option>
                    <option>Full Control</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Configuration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};