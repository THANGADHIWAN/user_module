import React from 'react';
import { 
  Users, 
  GitBranch, 
  FileSignature, 
  Settings, 
  Bell,
  Sliders
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
  { id: 'settings', label: 'System Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, onModuleChange }) => {
  return (
    <div className="w-20 bg-white shadow-xl h-full flex flex-col border-r border-gray-200">
      {/* Logo */}
      <div className="px-4 py-8 border-b border-gray-100">
        <div className="flex items-center justify-center">
          <div className="p-2 bg-blue-600 rounded-xl">
            <FileSignature className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            
            return (
              <li key={item.id}>
                <div className="relative group">
                  <button
                    onClick={() => onModuleChange(item.id)}
                    className={`w-full p-3 rounded-xl flex items-center justify-center transition-all duration-200 sidebar-icon-hover ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600 shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                    }`}
                    title={item.label}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                  
                  {/* Tooltip */}
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 top-1/2 -translate-y-1/2">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="px-3 py-6 border-t border-gray-100 bg-gray-50">
        <div className="relative group">
          <div className="flex items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm cursor-pointer">
              AJ
            </div>
          </div>
          
          {/* User tooltip */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 top-1/2 -translate-y-1/2">
            Alice Johnson<br />
            System Administrator
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
  );
};