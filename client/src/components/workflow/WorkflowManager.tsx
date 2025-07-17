import React, { useState } from 'react';
import { WorkflowBuilder } from './WorkflowBuilder';
import { WorkflowList } from './WorkflowList';
import { PageHeader } from '../common/PageHeader';
import { StatsCard } from '../common/StatsCard';
import { UnifiedSearchFilter } from '../common/UnifiedSearchFilter';
import { Workflow, WorkflowCategory } from '../../types/workflow';
import { Plus, ArrowLeft, GitBranch, Play, Pause, CheckCircle } from 'lucide-react';

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
  
  // Search and Filter State
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('name');
  const [groupValue, setGroupValue] = useState('none');
  const [dateFilter, setDateFilter] = useState('All');
  
  // Filter state
  const [filters, setFilters] = useState({
    status: 'All',
    category: 'All'
  });

  // Calculate stats
  const activeWorkflows = workflows.filter(w => w.status === 'Active');
  const draftWorkflows = workflows.filter(w => w.status === 'Draft');
  const totalWorkflows = workflows.length;

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

  // Unified filters
  const unifiedFilters = {
    status: {
      value: filters.status,
      options: [
        { value: 'All', label: 'All Status' },
        { value: 'Active', label: 'Active' },
        { value: 'Draft', label: 'Draft' },
        { value: 'Inactive', label: 'Inactive' }
      ],
      label: 'Status'
    },
    category: {
      value: filters.category,
      options: [
        { value: 'All', label: 'All Categories' },
        { value: 'Document Review', label: 'Document Review' },
        { value: 'Quality Control', label: 'Quality Control' },
        { value: 'Approval Process', label: 'Approval Process' },
        { value: 'Data Management', label: 'Data Management' },
        { value: 'Sample Testing', label: 'Sample Testing' },
        { value: 'Equipment Qualification', label: 'Equipment Qualification' }
      ],
      label: 'Category'
    }
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  const handleClearAll = () => {
    setSearchValue('');
    setSortValue('name');
    setGroupValue('none');
    setDateFilter('All');
    setFilters({
      status: 'All',
      category: 'All'
    });
  };

  // Apply filters and search
  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = searchValue === '' || 
      workflow.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchValue.toLowerCase()) ||
      workflow.category.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesStatus = filters.status === 'All' || workflow.status === filters.status;
    const matchesCategory = filters.category === 'All' || workflow.category === filters.category;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Apply sorting
  const sortedWorkflows = [...filteredWorkflows].sort((a, b) => {
    switch (sortValue) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'category':
        return a.category.localeCompare(b.category);
      case 'created':
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      default:
        return 0;
    }
  });

  // Apply grouping
  const groupedWorkflows = groupValue === 'none' ? 
    { 'All Workflows': sortedWorkflows } : 
    sortedWorkflows.reduce((groups, workflow) => {
      const key = workflow[groupValue as keyof typeof workflow] as string;
      if (!groups[key]) groups[key] = [];
      groups[key].push(workflow);
      return groups;
    }, {} as Record<string, typeof sortedWorkflows>);

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'list' ? (
        <>
          {/* Page Header */}
          <PageHeader
            title="Workflow Management"
            subtitle="Design and manage automated workflows"
            icon={GitBranch}
            actions={
              <button
                onClick={handleCreateWorkflow}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Workflow</span>
              </button>
            }
          />

          <div className="mx-auto px-6 py-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Workflows"
                value={totalWorkflows}
                icon={GitBranch}
                color="blue"
              />
              <StatsCard
                title="Active Workflows"
                value={activeWorkflows.length}
                icon={Play}
                color="green"
              />
              <StatsCard
                title="Draft Workflows"
                value={draftWorkflows.length}
                icon={Pause}
                color="yellow"
              />
              <StatsCard
                title="Categories"
                value={new Set(workflows.map(w => w.category)).size}
                icon={CheckCircle}
                color="blue"
              />
            </div>

            {/* Unified Search and Filter */}
            <UnifiedSearchFilter
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              filters={unifiedFilters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
              sortOptions={[
                { value: 'name', label: 'Name' },
                { value: 'status', label: 'Status' },
                { value: 'category', label: 'Category' },
                { value: 'created', label: 'Created Date' }
              ]}
              sortValue={sortValue}
              onSortChange={setSortValue}
              groupOptions={[
                { value: 'none', label: 'None' },
                { value: 'status', label: 'Status' },
                { value: 'category', label: 'Category' }
              ]}
              groupValue={groupValue}
              onGroupChange={setGroupValue}
              dateFilter={{
                value: dateFilter,
                onChange: setDateFilter
              }}
            />

            {/* Workflow List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <WorkflowList
                workflows={sortedWorkflows}
                onEditWorkflow={handleEditWorkflow}
                onDeleteWorkflow={handleDeleteWorkflow}
                onOpenWorkflow={handleOpenWorkflow}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Builder Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="mx-auto px-6 py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('list')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors p-2 -m-2 rounded-lg hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="font-medium">Back to Workflows</span>
                </button>
                <div className="h-5 w-px bg-gray-300" />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {selectedWorkflow ? selectedWorkflow.name : 'New Workflow'}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {selectedWorkflow ? 'Edit workflow' : 'Create new workflow'}
                  </p>
                </div>
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