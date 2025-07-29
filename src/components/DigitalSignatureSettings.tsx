import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Save, Settings, Shield, Key, Clock, Users } from 'lucide-react';

interface SignatureSettings {
  defaultSignatureMethod: 'draw' | 'type' | 'upload';
  requireDigitalSignature: boolean;
  allowMultipleSignatures: boolean;
  signatureTimeout: number; // in minutes
  auditRetention: number; // in days
  requireReason: boolean;
  enableBiometric: boolean;
  maxSignatureSize: number; // in KB
  allowedFileTypes: string[];
  encryptionLevel: 'basic' | 'advanced' | 'enterprise';
}

const defaultSettings: SignatureSettings = {
  defaultSignatureMethod: 'draw',
  requireDigitalSignature: true,
  allowMultipleSignatures: true,
  signatureTimeout: 30,
  auditRetention: 2555, // 7 years
  requireReason: false,
  enableBiometric: false,
  maxSignatureSize: 500,
  allowedFileTypes: ['png', 'jpg', 'jpeg'],
  encryptionLevel: 'advanced'
};

export const DigitalSignatureSettings: React.FC = () => {
  const { showSuccess } = useToast();
  const [settings, setSettings] = useState<SignatureSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: keyof SignatureSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    // Here you would typically save to backend/database
    console.log('Saving settings:', settings);
    setHasChanges(false);
    showSuccess('Settings Saved', 'Digital signature settings have been successfully updated.');
  };

  const handleResetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Signature Settings</h2>
          <p className="text-gray-600">Configure digital signature policies and security</p>
        </div>
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded">
              Unsaved changes
            </span>
          )}
          <button
            onClick={handleResetSettings}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={!hasChanges}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          
          {/* General Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Signature Method
                </label>
                <select
                  value={settings.defaultSignatureMethod}
                  onChange={(e) => handleSettingChange('defaultSignatureMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="draw">Hand Drawn</option>
                  <option value="type">Typed Text</option>
                  <option value="upload">Image Upload</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Signature Size (KB)
                </label>
                <input
                  type="number"
                  value={settings.maxSignatureSize}
                  onChange={(e) => handleSettingChange('maxSignatureSize', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="100"
                  max="2000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signature Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={settings.signatureTimeout}
                  onChange={(e) => handleSettingChange('signatureTimeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="5"
                  max="120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audit Log Retention (days)
                </label>
                <input
                  type="number"
                  value={settings.auditRetention}
                  onChange={(e) => handleSettingChange('auditRetention', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="365"
                  max="3650"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 2555 days (7 years) for FDA compliance
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Require Digital Signature</h4>
                  <p className="text-sm text-gray-500">Mandate digital signatures for document approval</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requireDigitalSignature}
                    onChange={(e) => handleSettingChange('requireDigitalSignature', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Allow Multiple Signatures</h4>
                  <p className="text-sm text-gray-500">Enable multiple signatures on a single document</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowMultipleSignatures}
                    onChange={(e) => handleSettingChange('allowMultipleSignatures', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Require Signature Reason</h4>
                  <p className="text-sm text-gray-500">Require users to provide a reason when signing</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requireReason}
                    onChange={(e) => handleSettingChange('requireReason', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Encryption Level
                </label>
                <select
                  value={settings.encryptionLevel}
                  onChange={(e) => handleSettingChange('encryptionLevel', e.target.value)}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="basic">Basic (AES-128)</option>
                  <option value="advanced">Advanced (AES-256)</option>
                  <option value="enterprise">Enterprise (AES-256 + HSM)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Higher encryption levels provide better security but may impact performance
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allowed File Types for Upload
                </label>
                <div className="flex flex-wrap gap-2">
                  {['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg'].map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.allowedFileTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleSettingChange('allowedFileTypes', [...settings.allowedFileTypes, type]);
                          } else {
                            handleSettingChange('allowedFileTypes', settings.allowedFileTypes.filter(t => t !== type));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 uppercase">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Enable Biometric Authentication</h4>
                  <p className="text-sm text-gray-500">Require biometric verification for signatures (future enhancement)</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableBiometric}
                    onChange={(e) => handleSettingChange('enableBiometric', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Compliance Information */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Key className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium text-blue-900">Compliance Information</h3>
            </div>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start space-x-2">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">21 CFR Part 11 Compliance</p>
                  <p>Digital signatures meet FDA requirements for electronic records and signatures in pharmaceutical and biotech industries.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Users className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Audit Trail Requirements</p>
                  <p>All signature activities are logged with timestamps, user identification, and action details for regulatory compliance.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Data Integrity</p>
                  <p>Cryptographic controls ensure signatures cannot be altered, copied, or transferred without detection.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};