import React from 'react';
import { 
  Users, 
  GitBranch, 
  FileSignature, 
  Settings, 
  Bell,
  HelpCircle,
  Sliders,
  BarChart3,
  Database
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const menuItems = [
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'workflows', label: 'Workflow Builder', icon: GitBranch },
  { id: 'signatures', label: 'Digital Signatures', icon: FileSignature },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'custom-fields', label: 'Custom Fields', icon: Sliders },
  { id: 'data-management', label: 'Data Management', icon: Database },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'settings', label: 'System Settings', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, onModuleChange }) => {
  return (
    <div className="w-16 bg-white shadow-lg h-full flex flex-col group hover:w-64 transition-all duration-300 ease-in-out">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-center group-hover:justify-start group-hover:px-6">
        <FileSignature className="h-8 w-8 text-blue-600" />
        <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
          <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">Pharma LIMS</h1>
          <p className="text-sm text-gray-500 whitespace-nowrap">Management Console</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 group-hover:p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            
            return (
              <li key={item.id} className="relative">
                <button
                  onClick={() => onModuleChange(item.id)}
                  className={`w-full flex items-center justify-center group-hover:justify-start px-3 py-3 rounded-lg text-left transition-colors relative group/button ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="ml-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                    {item.label}
                  </span>
                  
                  {/* Tooltip for collapsed state */}
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-md opacity-0 pointer-events-none group/button:hover:opacity-100 group-hover:opacity-0 transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
                    {item.label}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200 flex items-center justify-center group-hover:justify-start">
        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
          AJ
        </div>
        <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
          <p className="text-sm font-medium text-gray-900 truncate whitespace-nowrap">Alice Johnson</p>
          <p className="text-xs text-gray-500 truncate whitespace-nowrap">System Administrator</p>
        </div>
      </div>
    </div>
  );
};