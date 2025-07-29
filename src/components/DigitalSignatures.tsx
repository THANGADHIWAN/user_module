import React, { useState } from 'react';
import { DigitalSignatureTemplates } from './DigitalSignatureTemplates';
import { DigitalSignatureManagement } from './DigitalSignatureManagement';
import { DigitalSignatureSettings } from './DigitalSignatureSettings';
import { 
  FileText, 
  Pen, 
  Settings
} from 'lucide-react';

type TabType = 'templates' | 'signatures' | 'settings';

export const DigitalSignatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('templates');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'templates':
        return <DigitalSignatureTemplates />;
      case 'signatures':
        return <DigitalSignatureManagement />;
      case 'settings':
        return <DigitalSignatureSettings />;
      default:
        return <DigitalSignatureTemplates />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital Signatures</h1>
          <p className="text-gray-600">Manage signature templates, signatures, and settings</p>
        </div>
        <div className="flex items-center space-x-3">
          {activeTab === 'templates' && (
            <button
              onClick={() => {
                // Trigger create template modal
                setTimeout(() => {
                  const createTemplateBtn = document.querySelector('[data-create-template]');
                  if (createTemplateBtn) {
                    (createTemplateBtn as HTMLButtonElement).click();
                  }
                }, 100);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FileText className="h-5 w-5" />
              <span>Create Template</span>
            </button>
          )}
          {activeTab === 'signatures' && (
            <button
              onClick={() => {
                // Trigger create signature modal
                setTimeout(() => {
                  const createSignatureBtn = document.querySelector('[data-create-signature]');
                  if (createSignatureBtn) {
                    (createSignatureBtn as HTMLButtonElement).click();
                  }
                }, 100);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Pen className="h-5 w-5" />
              <span>Create Signature</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-4" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Templates</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('signatures')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'signatures'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Pen className="h-5 w-5" />
              <span>Signatures</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
};