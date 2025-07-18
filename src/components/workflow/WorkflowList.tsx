import React, { useState } from 'react';
import { Workflow, WorkflowCategory } from '../../types/workflow';
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
  const [filterCategory, setFilterCategory] = useState<WorkflowCategory | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Draft' | 'Inactive'>('All');

  const filteredWorkflows = workflows.filter(workflow => {
    if (filterCategory !== 'All' && workflow.category !== filterCategory) return false;
    if (filterStatus !== 'All' && workflow.status !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'Active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Draft':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Inactive':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getCategoryColor = (category: WorkflowCategory) => {
    const colors: Record<WorkflowCategory, string> = {
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
      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as WorkflowCategory | 'All')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            <option value="Sample Testing">Sample Testing</option>
            <option value="Document Review">Document Review</option>
            <option value="Equipment Qualification">Equipment Qualification</option>
            <option value="Change Control">Change Control</option>
            <option value="Deviation Management">Deviation Management</option>
            <option value="Training">Training</option>
            <option value="Audit">Audit</option>
            <option value="Regulatory Submission">Regulatory Submission</option>
          </select>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'All' | 'Active' | 'Draft' | 'Inactive')}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Workflow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkflows.map((workflow) => (
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
                <div className="flex items-center space-x-1">
                  <span className={getStatusBadge(workflow.status)}>
                    {workflow.status}
                  </span>
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
                </div>
                <div className="flex items-center space-x-1">
                  {workflow.status === 'Active' ? (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStatus(workflow.id);
                      }}
                      className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                      title="Pause Workflow"
                    >
                      <Pause className="h-4 w-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStatus(workflow.id);
                      }}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Activate Workflow"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  )}
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

      {filteredWorkflows.length === 0 && (
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