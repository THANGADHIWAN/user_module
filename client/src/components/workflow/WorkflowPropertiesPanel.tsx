import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { X, User, Clock, Mail, Settings } from 'lucide-react';

interface WorkflowPropertiesPanelProps {
  node: Node;
  onUpdateNode: (nodeId: string, data: any) => void;
  onClose: () => void;
}

export const WorkflowPropertiesPanel: React.FC<WorkflowPropertiesPanelProps> = ({
  node,
  onUpdateNode,
  onClose
}) => {
  const [formData, setFormData] = useState({
    label: node.data.label || '',
    description: node.data.description || '',
    assignedTo: node.data.assignedTo || [],
    duration: node.data.duration || '',
    conditions: node.data.conditions || [],
    actions: node.data.actions || []
  });

  useEffect(() => {
    setFormData({
      label: node.data.label || '',
      description: node.data.description || '',
      assignedTo: node.data.assignedTo || [],
      duration: node.data.duration || '',
      conditions: node.data.conditions || [],
      actions: node.data.actions || []
    });
  }, [node]);

  const handleSave = () => {
    onUpdateNode(node.id, formData);
    onClose();
  };

  const addAssignee = () => {
    setFormData(prev => ({
      ...prev,
      assignedTo: [...prev.assignedTo, '']
    }));
  };

  const updateAssignee = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.map((assignee, i) => i === index ? value : assignee)
    }));
  };

  const removeAssignee = (index: number) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Node Properties</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Basic Properties */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Label
          </label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Assignment */}
        {(node.type === 'process' || node.type === 'approval' || node.type === 'review') && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Assigned To
              </label>
              <button
                onClick={addAssignee}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.assignedTo.map((assignee, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={assignee}
                    onChange={(e) => updateAssignee(index, e.target.value)}
                    placeholder="Enter user or role"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <button
                    onClick={() => removeAssignee(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Duration */}
        {(node.type === 'wait' || node.type === 'process' || node.type === 'approval') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="h-4 w-4 inline mr-1" />
              Duration (hours)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter duration in hours"
            />
          </div>
        )}

        {/* Node Type Specific Settings */}
        {node.type === 'decision' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Decision Logic</h4>
            <p className="text-xs text-yellow-700">
              Configure conditions that determine which path the workflow takes.
            </p>
            <button className="mt-2 text-sm text-yellow-800 hover:text-yellow-900 underline">
              Configure Conditions
            </button>
          </div>
        )}

        {node.type === 'notification' && (
          <div className="bg-cyan-50 border border-cyan-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-cyan-800 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Notification Settings
            </h4>
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-cyan-700 mb-1">
                  Email Template
                </label>
                <select className="w-full px-2 py-1 border border-cyan-300 rounded text-sm">
                  <option>Default Notification</option>
                  <option>Approval Required</option>
                  <option>Task Assigned</option>
                  <option>Deadline Reminder</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {node.type === 'escalation' && (
          <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-orange-800 mb-2">Escalation Rules</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-orange-700 mb-1">
                  Escalate After (hours)
                </label>
                <input
                  type="number"
                  className="w-full px-2 py-1 border border-orange-300 rounded text-sm"
                  placeholder="24"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-orange-700 mb-1">
                  Escalate To
                </label>
                <select className="w-full px-2 py-1 border border-orange-300 rounded text-sm">
                  <option>Direct Manager</option>
                  <option>Department Head</option>
                  <option>Quality Manager</option>
                  <option>System Administrator</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Properties
        </button>
      </div>
    </div>
  );
};