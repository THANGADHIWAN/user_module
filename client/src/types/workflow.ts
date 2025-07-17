export interface WorkflowNode {
  id: string;
  type: 'start' | 'process' | 'decision' | 'approval' | 'end';
  data: {
    label: string;
    description?: string;
    assignedTo?: string[];
    conditions?: WorkflowCondition[];
    actions?: WorkflowAction[];
  };
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
}

export interface WorkflowCondition {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: string;
}

export interface WorkflowAction {
  id: string;
  type: 'email' | 'status_change' | 'assignment' | 'notification';
  parameters: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: WorkflowCategory;
  status: 'Draft' | 'Active' | 'Inactive';
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdBy: string;
  createdDate: string;
  lastModified: string;
  version: number;
}

export type WorkflowCategory = 
  | 'Sample Testing'
  | 'Document Review'
  | 'Equipment Qualification'
  | 'Change Control'
  | 'Deviation Management'
  | 'Training'
  | 'Audit'
  | 'Regulatory Submission';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: WorkflowCategory;
  nodes: Omit<WorkflowNode, 'id'>[];
  edges: Omit<WorkflowEdge, 'id'>[];
}