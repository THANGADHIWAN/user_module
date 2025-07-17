import React, { useState } from 'react';
import { WorkflowBuilder } from './WorkflowBuilder';
import { WorkflowList } from './WorkflowList';
import { Workflow, WorkflowCategory } from '../../types/workflow';
import { Plus, ArrowLeft } from 'lucide-react';

const sampleWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Document Review Process',
    description: 'Multi-level document review and approval workflow with automated routing',
    category: 'Document Review',
    status: 'Active',
    nodes: [
      {
        id: '1',
        type: 'start',
        position: { x: 250, y: 25 },
        data: { label: 'Document Submitted', description: 'Document submitted for review' }
      },
      {
        id: '2',
        type: 'review',
        position: { x: 250, y: 150 },
        data: { 
          label: 'Initial Review', 
          description: 'Technical review by subject matter expert',
          assignedTo: ['QC Analyst', 'Lab Manager']
        }
      },
      {
        id: '3',
        type: 'decision',
        position: { x: 250, y: 275 },
        data: { label: 'Review Decision', description: 'Approve or request changes' }
      },
      {
        id: '4',
        type: 'process',
        position: { x: 450, y: 275 },
        data: { 
          label: 'Request Changes', 
          description: 'Send back to author for revisions',
          assignedTo: ['Document Author']
        }
      },
      {
        id: '5',
        type: 'approval',
        position: { x: 250, y: 400 },
        data: { 
          label: 'QA Approval', 
          description: 'Quality assurance final approval',
          assignedTo: ['QA Officer']
        }
      },
      {
        id: '6',
        type: 'notification',
        position: { x: 250, y: 525 },
        data: { label: 'Notify Stakeholders', description: 'Send approval notification' }
      },
      {
        id: '7',
        type: 'end',
        position: { x: 250, y: 650 },
        data: { label: 'Document Approved', description: 'Process complete' }
      }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4', label: 'Changes Required' },
      { id: 'e4-2', source: '4', target: '2', label: 'Resubmit' },
      { id: 'e3-5', source: '3', target: '5', label: 'Approved' },
      { id: 'e5-6', source: '5', target: '6' },
      { id: 'e6-7', source: '6', target: '7' }
    ],
    createdBy: 'Alice Johnson',
    createdDate: '2024-01-15T08:00:00Z',
    lastModified: '2024-01-15T08:00:00Z',
    version: 1
  },
  {
    id: '2',
    name: 'Sample Testing Workflow',
    description: 'Standard workflow for pharmaceutical sample testing and approval',
    category: 'Sample Testing',
    status: 'Active',
    nodes: [],
    edges: [],
    createdBy: 'Bob Wilson',
    createdDate: '2024-01-10T09:30:00Z',
    lastModified: '2024-01-12T14:20:00Z',
    version: 2
  },
  {
    id: '3',
    name: 'Equipment Qualification',
    description: 'IQ/OQ/PQ workflow for equipment qualification',
    category: 'Equipment Qualification',
    status: 'Draft',
    nodes: [],
    edges: [],
    createdBy: 'Carol Davis',
    createdDate: '2024-01-08T11:15:00Z',
    lastModified: '2024-01-08T11:15:00Z',
    version: 1
  }
];

export const WorkflowManager: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>(sampleWorkflows);
  const [currentView, setCurrentView] = useState<'list' | 'builder'>('list');
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  const handleCreateWorkflow = () => {
    setSelectedWorkflow(null);
    setCurrentView('builder');
  };

  const handleEditWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setCurrentView('builder');
  };

  const handleOpenWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setCurrentView('builder');
  };

  const handleSaveWorkflow = (workflowData: Partial<Workflow>) => {
    if (selectedWorkflow) {
      // Update existing workflow
      setWorkflows(prev => prev.map(w => 
        w.id === selectedWorkflow.id 
          ? { ...selectedWorkflow, ...workflowData }
          : w
      ));
    } else {
      // Create new workflow
      const newWorkflow: Workflow = {
        id: Date.now().toString(),
        name: 'New Workflow',
        description: 'Workflow description',
        category: 'Sample Testing',
        status: 'Draft',
        createdBy: 'Current User',
        createdDate: new Date().toISOString(),
        version: 1,
        ...workflowData
      } as Workflow;
      setWorkflows(prev => [...prev, newWorkflow]);
    }
    setCurrentView('list');
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== workflowId));
  };

  return (
    <div className="h-full flex flex-col bg-gray-25">
      {currentView === 'list' ? (
        <>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-heading text-gray-900">Workflow Management</h1>
                <p className="text-body text-gray-600 mt-1">Create and manage approval workflows</p>
              </div>
              <button
                onClick={handleCreateWorkflow}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create Workflow</span>
              </button>
            </div>
          </div>

          {/* Workflow List */}
          <div className="flex-1 px-8 py-6 overflow-auto">
            <WorkflowList
              workflows={workflows}
              onEditWorkflow={handleEditWorkflow}
              onDeleteWorkflow={handleDeleteWorkflow}
              onOpenWorkflow={handleOpenWorkflow}
            />
          </div>
        </>
      ) : (
        <>
          {/* Builder Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setCurrentView('list')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors p-2 -m-2 rounded-lg hover:bg-gray-50"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Workflows</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-subheading text-gray-900">
                  {selectedWorkflow ? selectedWorkflow.name : 'New Workflow'}
                </h1>
                <p className="text-caption">
                  {selectedWorkflow ? 'Edit workflow' : 'Create new workflow'}
                </p>
              </div>
            </div>
          </div>

          {/* Workflow Builder */}
          <div className="flex-1 overflow-hidden">
            <WorkflowBuilder
              workflow={selectedWorkflow || undefined}
              onSave={handleSaveWorkflow}
            />
          </div>
        </>
      )}
    </div>
  );
};