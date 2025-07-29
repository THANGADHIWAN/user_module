import React from 'react';
import {
  Users,
  GitBranch,
  FileSignature,
  FileText,
  Files,
  Settings,
  Bell,
  HelpCircle,
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
  { id: 'signature-templates', label: 'Signature Templates', icon: FileText },
  { id: 'signature-documents', label: 'Signature Documents', icon: Files },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'custom-fields', label: 'Custom Fields', icon: Sliders },
  { id: 'settings', label: 'System Settings', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, onModuleChange }) => {
  return (
    <div className="w-16 bg-white shadow-lg h-full flex flex-col items-center py-4 space-y-4">
      {/* Logo */}
      <div className="relative group">
        <FileSignature className="h-8 w-8 text-blue-600" />
        <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[9999]">
          Pharma LIMS
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center space-y-4 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => onModuleChange(item.id)}
                className={`p-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              </button>
              <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[9999]">
                {item.label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="relative group mb-4">
        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
          AJ
        </div>
        <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[9999]">
          Alice Johnson
        </span>
      </div>
    </div>
  );
};
