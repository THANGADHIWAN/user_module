import React from 'react';
import { 
  Play, 
  Square, 
  Diamond, 
  CheckCircle, 
  StopCircle,
  FileText,
  Clock,
  Mail,
  AlertTriangle
} from 'lucide-react';

interface WorkflowSidebarProps {
  onAddNode: (type: string) => void;
}

const nodeCategories = [
  {
    title: 'Flow Control',
    nodes: [
      { type: 'start', label: 'Start', icon: Play, description: 'Workflow start point' },
      { type: 'end', label: 'End', icon: StopCircle, description: 'Workflow end point' },
      { type: 'decision', label: 'Decision', icon: Diamond, description: 'Conditional branching' },
    ]
  },
  {
    title: 'Process Steps',
    nodes: [
      { type: 'process', label: 'Process', icon: Square, description: 'General process step' },
      { type: 'approval', label: 'Approval', icon: CheckCircle, description: 'Approval step' },
      { type: 'review', label: 'Review', icon: FileText, description: 'Document review' },
      { type: 'wait', label: 'Wait', icon: Clock, description: 'Wait/delay step' },
    ]
  },
  {
    title: 'Actions',
    nodes: [
      { type: 'notification', label: 'Notification', icon: Mail, description: 'Send notification' },
      { type: 'escalation', label: 'Escalation', icon: AlertTriangle, description: 'Escalate to supervisor' },
    ]
  }
];

export const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({ onAddNode }) => {
  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Elements</h3>
      
      {nodeCategories.map((category) => (
        <div key={category.title} className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">{category.title}</h4>
          <div className="space-y-2">
            {category.nodes.map((node) => {
              const Icon = node.icon;
              return (
                <button
                  key={node.type}
                  onClick={() => onAddNode(node.type)}
                  className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex-shrink-0">
                    <Icon className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-gray-900">{node.label}</div>
                    <div className="text-xs text-gray-500">{node.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Quick Tips</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Drag nodes from here to the canvas</li>
          <li>• Click nodes to configure properties</li>
          <li>• Connect nodes by dragging from handles</li>
          <li>• Use decision nodes for conditional logic</li>
        </ul>
      </div>
    </div>
  );
};