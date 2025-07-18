import React from 'react';
import { Handle, Position } from 'reactflow';
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

const NodeWrapper: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  selected?: boolean;
}> = ({ children, className = '', selected }) => (
  <div className={`px-4 py-2 shadow-md rounded-md border-2 bg-white ${
    selected ? 'border-blue-500' : 'border-gray-200'
  } ${className}`}>
    {children}
  </div>
);

const StartNode = ({ data, selected }: any) => (
  <>
    <NodeWrapper selected={selected} className="bg-green-50 border-green-200">
      <div className="flex items-center space-x-2">
        <Play className="h-4 w-4 text-green-600" />
        <div>
          <div className="text-sm font-medium text-green-900">{data.label}</div>
          {data.description && (
            <div className="text-xs text-green-700">{data.description}</div>
          )}
        </div>
      </div>
    </NodeWrapper>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
  </>
);

const EndNode = ({ data, selected }: any) => (
  <>
    <Handle type="target" position={Position.Top} className="w-3 h-3" />
    <NodeWrapper selected={selected} className="bg-red-50 border-red-200">
      <div className="flex items-center space-x-2">
        <StopCircle className="h-4 w-4 text-red-600" />
        <div>
          <div className="text-sm font-medium text-red-900">{data.label}</div>
          {data.description && (
            <div className="text-xs text-red-700">{data.description}</div>
          )}
        </div>
      </div>
    </NodeWrapper>
  </>
);

const ProcessNode = ({ data, selected }: any) => (
  <>
    <Handle type="target" position={Position.Top} className="w-3 h-3" />
    <NodeWrapper selected={selected} className="bg-blue-50 border-blue-200">
      <div className="flex items-center space-x-2">
        <Square className="h-4 w-4 text-blue-600" />
        <div>
          <div className="text-sm font-medium text-blue-900">{data.label}</div>
          {data.description && (
            <div className="text-xs text-blue-700">{data.description}</div>
          )}
          {data.assignedTo && (
            <div className="text-xs text-blue-600 mt-1">
              Assigned: {data.assignedTo.join(', ')}
            </div>
          )}
        </div>
      </div>
    </NodeWrapper>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
  </>
);

const DecisionNode = ({ data, selected }: any) => (
  <>
    <Handle type="target" position={Position.Top} className="w-3 h-3" />
    <NodeWrapper selected={selected} className="bg-yellow-50 border-yellow-200">
      <div className="flex items-center space-x-2">
        <Diamond className="h-4 w-4 text-yellow-600" />
        <div>
          <div className="text-sm font-medium text-yellow-900">{data.label}</div>
          {data.description && (
            <div className="text-xs text-yellow-700">{data.description}</div>
          )}
        </div>
      </div>
    </NodeWrapper>
    <Handle type="source" position={Position.Bottom} id="yes" className="w-3 h-3" />
    <Handle type="source" position={Position.Right} id="no" className="w-3 h-3" />
  </>
);

const ApprovalNode = ({ data, selected }: any) => (
  <>
    <Handle type="target" position={Position.Top} className="w-3 h-3" />
    <NodeWrapper selected={selected} className="bg-purple-50 border-purple-200">
      <div className="flex items-center space-x-2">
        <CheckCircle className="h-4 w-4 text-purple-600" />
        <div>
          <div className="text-sm font-medium text-purple-900">{data.label}</div>
          {data.description && (
            <div className="text-xs text-purple-700">{data.description}</div>
          )}
          {data.assignedTo && (
            <div className="text-xs text-purple-600 mt-1">
              Approver: {data.assignedTo.join(', ')}
            </div>
          )}
        </div>
      </div>
    </NodeWrapper>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
  </>
);

const ReviewNode = ({ data, selected }: any) => (
  <>
    <Handle type="target" position={Position.Top} className="w-3 h-3" />
    <NodeWrapper selected={selected} className="bg-indigo-50 border-indigo-200">
      <div className="flex items-center space-x-2">
        <FileText className="h-4 w-4 text-indigo-600" />
        <div>
          <div className="text-sm font-medium text-indigo-900">{data.label}</div>
          {data.description && (
            <div className="text-xs text-indigo-700">{data.description}</div>
          )}
        </div>
      </div>
    </NodeWrapper>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
  </>
);

const WaitNode = ({ data, selected }: any) => (
  <>
    <Handle type="target" position={Position.Top} className="w-3 h-3" />
    <NodeWrapper selected={selected} className="bg-gray-50 border-gray-200">
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-gray-600" />
        <div>
          <div className="text-sm font-medium text-gray-900">{data.label}</div>
          {data.description && (
            <div className="text-xs text-gray-700">{data.description}</div>
          )}
        </div>
      </div>
    </NodeWrapper>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
  </>
);

const NotificationNode = ({ data, selected }: any) => (
  <>
    <Handle type="target" position={Position.Top} className="w-3 h-3" />
    <NodeWrapper selected={selected} className="bg-cyan-50 border-cyan-200">
      <div className="flex items-center space-x-2">
        <Mail className="h-4 w-4 text-cyan-600" />
        <div>
          <div className="text-sm font-medium text-cyan-900">{data.label}</div>
          {data.description && (
            <div className="text-xs text-cyan-700">{data.description}</div>
          )}
        </div>
      </div>
    </NodeWrapper>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
  </>
);

const EscalationNode = ({ data, selected }: any) => (
  <>
    <Handle type="target" position={Position.Top} className="w-3 h-3" />
    <NodeWrapper selected={selected} className="bg-orange-50 border-orange-200">
      <div className="flex items-center space-x-2">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <div>
          <div className="text-sm font-medium text-orange-900">{data.label}</div>
          {data.description && (
            <div className="text-xs text-orange-700">{data.description}</div>
          )}
        </div>
      </div>
    </NodeWrapper>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
  </>
);

export const WorkflowNodeTypes = {
  start: StartNode,
  end: EndNode,
  process: ProcessNode,
  decision: DecisionNode,
  approval: ApprovalNode,
  review: ReviewNode,
  wait: WaitNode,
  notification: NotificationNode,
  escalation: EscalationNode,
};