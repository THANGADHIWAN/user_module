import React, { useState } from 'react';
import { 
  FileSignature, 
  FileText,
  Files,
  Settings as SettingsIcon
} from 'lucide-react';
import { SignatureTemplates } from './SignatureTemplates';
import { SignatureDocuments } from './SignatureDocuments';
import { useToast } from '../contexts/ToastContext';

export const DigitalSignatures: React.FC = () => {
  const { showSuccess } = useToast();
  const [activeTab, setActiveTab] = useState<'templates' | 'documents' | 'settings'>('templates');
  const [settings, setSettings] = useState({
    requireDigitalCertificate: true,
    allowBulkSigning: false,
    signatureTimeout: 30,
    auditTrail: true,
    emailNotifications: true,
    autoArchive: 90
  });

  const handleSaveSettings = () => {
    // Simulate saving settings
    showSuccess('Settings Saved', 'Signature settings have been successfully updated.');
  };

  const renderSettingsTab = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Signature Settings</h3>
          
          <div className="space-y-6">
            {/* Security Settings */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Security</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Require Digital Certificate</label>
                    <p className="text-sm text-gray-500">All signatures must be backed by a digital certificate</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.requireDigitalCertificate}
                    onChange={(e) => setSettings(prev => ({ ...prev, requireDigitalCertificate: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Enable Audit Trail</label>
                    <p className="text-sm text-gray-500">Track all signature activities and changes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.auditTrail}
                    onChange={(e) => setSettings(prev => ({ ...prev, auditTrail: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Workflow Settings */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Workflow</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Allow Bulk Signing</label>
                    <p className="text-sm text-gray-500">Enable signing multiple documents at once</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.allowBulkSigning}
                    onChange={(e) => setSettings(prev => ({ ...prev, allowBulkSigning: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Signature Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.signatureTimeout}
                    onChange={(e) => setSettings(prev => ({ ...prev, signatureTimeout: parseInt(e.target.value) }))}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="5"
                    max="120"
                  />
                  <p className="text-sm text-gray-500 mt-1">Time before signature session expires</p>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Notifications</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                    <p className="text-sm text-gray-500">Send email alerts for signature requests and completions</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Archive Settings */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Archive</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto-archive completed documents (days)</label>
                <input
                  type="number"
                  value={settings.autoArchive}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoArchive: parseInt(e.target.value) }))}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="30"
                  max="365"
                />
                <p className="text-sm text-gray-500 mt-1">Automatically move completed documents to archive</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
              <FileSignature className="h-6 w-6 mr-3 text-blue-600" />
              Digital Signatures
            </h1>
            <p className="text-gray-600 mt-1">Manage signature templates, documents, and settings</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Templates</span>
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Files className="h-4 w-4" />
              <span>Documents</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <SettingsIcon className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'templates' && <SignatureTemplates />}
        {activeTab === 'documents' && <SignatureDocuments />}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
    </div>
  );
};