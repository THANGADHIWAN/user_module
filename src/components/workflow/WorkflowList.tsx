import React from 'react';
import { Workflow } from '../../types/workflow';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Copy, 
  MoreHorizontal,
  GitBranch,
  User,
  Calendar,
  Filter
} from 'lucide-react';

interface WorkflowListProps {
  workflows: Workflow[];
  onEditWorkflow: (workflow: Workflow) => void;
  onDeleteWorkflow: (workflowId: string) => void;
  onOpenWorkflow: (workflow: Workflow) => void;
  onToggleStatus: (workflowId: string) => void;
  onCloneWorkflow: (workflow: Workflow) => void;
}

export const WorkflowList: React.FC<WorkflowListProps> = ({
  workflows,
  onEditWorkflow,
  onDeleteWorkflow,
  onOpenWorkflow,
  onToggleStatus,
  onCloneWorkflow
}) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Sample Testing': 'bg-blue-100 text-blue-800',
      'Document Review': 'bg-purple-100 text-purple-800',
      'Equipment Qualification': 'bg-green-100 text-green-800',
      'Change Control': 'bg-orange-100 text-orange-800',
      'Deviation Management': 'bg-red-100 text-red-800',
      'Training': 'bg-indigo-100 text-indigo-800',
      'Audit': 'bg-gray-100 text-gray-800',
      'Regulatory Submission': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Workflow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onOpenWorkflow(workflow)}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <GitBranch className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                    <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(workflow.category)}`}>
                      {workflow.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {workflow.description}
              </p>

              {/* Metadata */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-500">
                  <User className="h-3 w-3 mr-1" />
                  <span>Created by {workflow.createdBy}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Modified {formatDistanceToNow(workflow.lastModified)}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <span>Version {workflow.version}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditWorkflow(workflow);
                    }}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloneWorkflow(workflow);
                    }}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Clone</span>
                  </button>
                  {/* Run/Pause button */}
                  {workflow.status === 'Active' ? (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onToggleStatus(workflow.id);
                      }}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-yellow-700 hover:bg-yellow-50 rounded-md"
                      title="Pause Workflow"
                    >
                      <Pause className="h-3 w-3" />
                      <span>Pause</span>
                    </button>
                  ) : (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onToggleStatus(workflow.id);
                      }}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-green-700 hover:bg-green-50 rounded-md"
                      title="Run Workflow"
                    >
                      <Play className="h-3 w-3" />
                      <span>Run</span>
                    </button>
                  )}
                </div>
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteWorkflow(workflow.id);
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {workflows.length === 0 && (
        <div className="text-center py-12">
          <GitBranch className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No workflows found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters or create a new workflow.
          </p>
        </div>
      )}
    </div>
  );
};