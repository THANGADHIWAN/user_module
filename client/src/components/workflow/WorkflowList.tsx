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
}

export const WorkflowList: React.FC<WorkflowListProps> = ({
  workflows,
  onEditWorkflow,
  onDeleteWorkflow,
  onOpenWorkflow
}) => {
  const [filterCategory, setFilterCategory] = useState<WorkflowCategory | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Draft' | 'Inactive'>('All');

  const filteredWorkflows = workflows.filter(workflow => {
    if (filterCategory !== 'All' && workflow.category !== filterCategory) return false;
    if (filterStatus !== 'All' && workflow.status !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'badge-success';
      case 'Draft':
        return 'badge-warning';
      case 'Inactive':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const getCategoryColor = (category: WorkflowCategory) => {
    const colors: Record<WorkflowCategory, string> = {
      'Sample Testing': 'bg-blue-50 text-blue-700 border-blue-200',
      'Document Review': 'bg-purple-50 text-purple-700 border-purple-200',
      'Equipment Qualification': 'bg-green-50 text-green-700 border-green-200',
      'Change Control': 'bg-orange-50 text-orange-700 border-orange-200',
      'Deviation Management': 'bg-red-50 text-red-700 border-red-200',
      'Training': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Audit': 'bg-gray-50 text-gray-700 border-gray-200',
      'Regulatory Submission': 'bg-pink-50 text-pink-700 border-pink-200'
    };
    const baseClasses = 'inline-block px-2.5 py-1 rounded-full text-xs font-medium border';
    return `${baseClasses} ${colors[category] || 'badge-neutral'}`;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as WorkflowCategory | 'All')}
                className="form-input text-sm min-w-[200px]"
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
              className="form-input text-sm min-w-[140px]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workflow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkflows.map((workflow) => (
          <div
            key={workflow.id}
            className="card card-hover cursor-pointer group"
            onClick={() => onOpenWorkflow(workflow)}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                    <GitBranch className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{workflow.name}</h3>
                    <span className={getCategoryColor(workflow.category)}>
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
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Clone</span>
                  </button>
                </div>
                <div className="flex items-center space-x-1">
                  {workflow.status === 'Active' ? (
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Pause Workflow"
                    >
                      <Pause className="h-4 w-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
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
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Workflow"
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
        <div className="text-center py-16">
          <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <GitBranch className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-subheading text-gray-900">No workflows found</h3>
          <p className="text-body text-gray-500 mt-2">
            Try adjusting your filters or create a new workflow.
          </p>
        </div>
      )}
    </div>
  );
};