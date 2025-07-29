import React, { useState, useMemo } from 'react';
import { WorkflowBuilder } from './WorkflowBuilder';
import { WorkflowList } from './WorkflowList';
import { Workflow, WorkflowCategory } from '../../types/workflow';
import { useToast } from '../../contexts/ToastContext';
import { Plus, ArrowLeft, Search, Filter } from 'lucide-react';

const sampleWorkflows: Workflow[] = [
        {
                id: '1',
                name: 'Document Review Process',
                description:
                        'Multi-level document review and approval workflow with automated routing',
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
        const { showSuccess, showInfo } = useToast();
        const [workflows, setWorkflows] = useState<Workflow[]>(sampleWorkflows);
        const [currentView, setCurrentView] = useState<'list' | 'builder'>('list');
        const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
        const [searchQuery, setSearchQuery] = useState('');
        const [statusFilter, setStatusFilter] = useState<string>('all');
        const [categoryFilter, setCategoryFilter] = useState<string>('all');
        const [deleteConfirmation, setDeleteConfirmation] = useState<{
                isOpen: boolean;
                workflowId: string;
                workflowName: string;
        }>({
                isOpen: false,
                workflowId: '',
                workflowName: ''
        });

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
                        setWorkflows(prev =>
                                prev.map(w => (w.id === selectedWorkflow.id ? { ...selectedWorkflow, ...workflowData } : w))
                        );
                        showSuccess('Workflow Updated', `${selectedWorkflow.name} has been successfully updated.`);
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
                        showSuccess('Workflow Created', `${newWorkflow.name} has been successfully created.`);
                }
                setCurrentView('list');
        };

        const handleDeleteWorkflow = (workflowId: string) => {
                const workflow = workflows.find(w => w.id === workflowId);
                if (workflow) {
                        setDeleteConfirmation({
                                isOpen: true,
                                workflowId: workflowId,
                                workflowName: workflow.name
                        });
                }
        };

        const confirmDeleteWorkflow = () => {
                const workflowName = deleteConfirmation.workflowName;
                setWorkflows(prev => prev.filter(w => w.id !== deleteConfirmation.workflowId));
                setDeleteConfirmation({
                        isOpen: false,
                        workflowId: '',
                        workflowName: ''
                });
                showSuccess('Workflow Deleted', `${workflowName} has been successfully deleted.`);
        };

        const cancelDeleteWorkflow = () => {
                setDeleteConfirmation({
                        isOpen: false,
                        workflowId: '',
                        workflowName: ''
                });
        };

        const handleToggleWorkflowStatus = (workflowId: string) => {
                const workflow = workflows.find(w => w.id === workflowId);
                const newStatus = workflow?.status === 'Active' ? 'Inactive' : 'Active';
                setWorkflows(prev =>
                        prev.map(workflow =>
                                workflow.id === workflowId
                                        ? {
                                                        ...workflow,
                                                        status: newStatus,
                                                        lastModified: new Date().toISOString()
                                          }
                                        : workflow
                        )
                );
                showInfo('Status Updated', `Workflow status changed to ${newStatus}.`);
        };

        const handleCloneWorkflow = (workflow: Workflow) => {
                const clonedWorkflow: Workflow = {
                        ...workflow,
                        id: Date.now().toString(),
                        name: `${workflow.name} (Copy)`,
                        status: 'Draft',
                        createdBy: 'Current User',
                        createdDate: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        version: 1
                };
                setWorkflows(prev => [...prev, clonedWorkflow]);
                showSuccess('Workflow Cloned', `${clonedWorkflow.name} has been successfully created.`);
        };

        // Filter workflows based on search and filters
        const filteredWorkflows = useMemo(() => {
                return workflows.filter(workflow => {
                        const matchesSearch =
                                searchQuery === '' ||
                                workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                workflow.category.toLowerCase().includes(searchQuery.toLowerCase());

                        const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
                        const matchesCategory = categoryFilter === 'all' || workflow.category === categoryFilter;

                        return matchesSearch && matchesStatus && matchesCategory;
                });
        }, [workflows, searchQuery, statusFilter, categoryFilter]);

        // Get unique categories for filter
        const categories = useMemo(() => {
                const uniqueCategories = Array.from(new Set(workflows.map(w => w.category)));
                return uniqueCategories.sort();
        }, [workflows]);

        return (
                <div className="h-full flex flex-col">
                        {currentView === 'list' ? (
                                <>
                                        {/* Header */}
                                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                                <div>
                                                        <h1 className="text-2xl font-bold text-gray-900">Workflow Management</h1>
                                                        <p className="text-gray-600">Create and manage approval workflows</p>
                                                </div>
                                                <button
                                                        onClick={handleCreateWorkflow}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                >
                                                        <Plus className="h-5 w-5" />
                                                        <span>Create Workflow</span>
                                                </button>
                                        </div>

                                        {/* Search and Filters */}
                                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                        {/* Search */}
                                                        <div className="relative" style={{ maxWidth: 280, width: '100%' }}>
                                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                                <input
                                                                        type="text"
                                                                        placeholder="Search workflows by name, description, or category..."
                                                                        value={searchQuery}
                                                                        onChange={e => setSearchQuery(e.target.value)}
                                                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                                />
                                                        </div>

                                                        {/* Status Filter */}
                                                        <div className="flex items-center space-x-2">
                                                                <Filter className="h-4 w-4 text-gray-400" />
                                                                <select
                                                                        value={statusFilter}
                                                                        onChange={e => setStatusFilter(e.target.value)}
                                                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                >
                                                                        <option value="all">All Status</option>
                                                                        <option value="Active">Active</option>
                                                                        <option value="Draft">Draft</option>
                                                                        <option value="Inactive">Inactive</option>
                                                                </select>
                                                        </div>

                                                        {/* Category Filter */}
                                                        <div>
                                                                <select
                                                                        value={categoryFilter}
                                                                        onChange={e => setCategoryFilter(e.target.value)}
                                                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                >
                                                                        <option value="all">All Categories</option>
                                                                        {categories.map(category => (
                                                                                <option key={category} value={category}>
                                                                                        {category}
                                                                                </option>
                                                                        ))}
                                                                </select>
                                                        </div>
                                                </div>

                                                {/* Results summary */}
                                                <div className="mt-3 text-sm text-gray-600">
                                                        Showing {filteredWorkflows.length} of {workflows.length} workflows
                                                        {searchQuery && (
                                                                <span className="ml-2">
                                                                        for "<span className="font-medium">{searchQuery}</span>"
                                                                </span>
                                                        )}
                                                </div>
                                        </div>

                                        {/* Workflow List */}
                                        <div className="flex-1 p-4">
                                                <WorkflowList
                                                        workflows={filteredWorkflows}
                                                        onEditWorkflow={handleEditWorkflow}
                                                        onDeleteWorkflow={handleDeleteWorkflow}
                                                        onOpenWorkflow={handleOpenWorkflow}
                                                        onToggleStatus={handleToggleWorkflowStatus}
                                                        onCloneWorkflow={handleCloneWorkflow}
                                                />
                                        </div>
                                </>
                        ) : (
                                <>
                                        {/* Builder Header */}
                                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                                                <div className="flex items-center space-x-4">
                                                        <button
                                                                onClick={() => setCurrentView('list')}
                                                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                                                        >
                                                                <ArrowLeft className="h-5 w-5" />
                                                                <span>Back to Workflows</span>
                                                        </button>
                                                        <div className="h-6 w-px bg-gray-300" />
                                                        <div>
                                                                <h1 className="text-xl font-semibold text-gray-900">
                                                                        {selectedWorkflow ? selectedWorkflow.name : 'New Workflow'}
                                                                </h1>
                                                                <p className="text-sm text-gray-500">
                                                                        {selectedWorkflow ? 'Edit workflow' : 'Create new workflow'}
                                                                </p>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Workflow Builder */}
                                        <div className="flex-1">
                                                <WorkflowBuilder
                                                        workflow={selectedWorkflow || undefined}
                                                        onSave={handleSaveWorkflow}
                                                />
                                        </div>
                                </>
                        )}
                        
                        {/* Delete Confirmation Modal */}
                        {deleteConfirmation.isOpen && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                        Delete Workflow
                                                </h3>
                                                <p className="text-gray-600 mb-6">
                                                        Are you sure you want to delete "{deleteConfirmation.workflowName}"? 
                                                        This action cannot be undone.
                                                </p>
                                                <div className="flex space-x-3 justify-end">
                                                        <button
                                                                onClick={cancelDeleteWorkflow}
                                                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                                        >
                                                                Cancel
                                                        </button>
                                                        <button
                                                                onClick={confirmDeleteWorkflow}
                                                                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                                                        >
                                                                Delete
                                                        </button>
                                                </div>
                                        </div>
                                </div>
                        )}
                </div>
        );
};