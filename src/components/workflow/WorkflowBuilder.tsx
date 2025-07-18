import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { WorkflowSidebar } from './WorkflowSidebar';
import { WorkflowNodeTypes } from './WorkflowNodeTypes';
import { WorkflowPropertiesPanel } from './WorkflowPropertiesPanel';
import { Workflow, WorkflowNode as WorkflowNodeType } from '../../types/workflow';
import { Save, Play, Settings, Undo, Redo } from 'lucide-react';

const nodeTypes = WorkflowNodeTypes;

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'start',
    position: { x: 250, y: 25 },
    data: { label: 'Start', description: 'Workflow initiation' },
  },
];

const initialEdges: Edge[] = [];

interface WorkflowBuilderProps {
  workflow?: Workflow;
  onSave: (workflow: Partial<Workflow>) => void;
}

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ workflow, onSave }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(workflow?.nodes || initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflow?.edges || initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);
  
  // History management for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([
    { nodes: workflow?.nodes || initialNodes, edges: workflow?.edges || initialEdges }
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const saveToHistory = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    const newState = { nodes: newNodes, edges: newEdges };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    
    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }
    
    setHistory(newHistory);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      setNodes(state.nodes);
      setEdges(state.edges);
      setHistoryIndex(newIndex);
    }
  }, [historyIndex, history, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      setNodes(state.nodes);
      setEdges(state.edges);
      setHistoryIndex(newIndex);
    }
  }, [historyIndex, history, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      saveToHistory(nodes, newEdges);
    },
    [setEdges, edges, nodes, saveToHistory]
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      const newEdges = edges.filter((edge, index) => {
        const change = changes.find((c: any) => c.id === edge.id);
        return !change || change.type !== 'remove';
      });
      setEdges(newEdges);
      saveToHistory(nodes, newEdges);
    },
    [edges, setEdges, nodes, saveToHistory]
  );

  const onNodesChange = useCallback(
    (changes: any) => {
      const newNodes = nodes.filter((node, index) => {
        const change = changes.find((c: any) => c.id === node.id);
        return !change || change.type !== 'remove';
      }).map((node) => {
        const change = changes.find((c: any) => c.id === node.id);
        if (change && change.type === 'position' && change.position) {
          return { ...node, position: change.position };
        }
        return node;
      });
      setNodes(newNodes);
      saveToHistory(newNodes, edges);
    },
    [nodes, setNodes, edges, saveToHistory]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setShowPropertiesPanel(true);
  }, []);

  const addNode = useCallback((type: string) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { 
        label: type.charAt(0).toUpperCase() + type.slice(1),
        description: `${type} node`
      },
    };
    const newNodes = nodes.concat(newNode);
    setNodes(newNodes);
    saveToHistory(newNodes, edges);
  }, [nodes, setNodes, edges, saveToHistory]);

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    const newNodes = nodes.map((node) =>
      node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
    );
    setNodes(newNodes);
    saveToHistory(newNodes, edges);
  }, [setNodes, nodes, edges, saveToHistory]);

  const handleSave = () => {
    const workflowData: Partial<Workflow> = {
      nodes: nodes as WorkflowNodeType[],
      edges,
      lastModified: new Date().toISOString(),
    };
    onSave(workflowData);
  };

  const handleDeploy = () => {
    // Save first, then deploy
    handleSave();
    // Simulate deployment
    alert('Workflow deployed successfully!');
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
      } else if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
        event.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Save Workflow"
            >
              <Save className="h-5 w-5" />
            </button>
            <button
              onClick={handleDeploy}
              className="flex items-center space-x-1 p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
              title="Deploy Workflow"
            >
              <Play className="h-5 w-5" />
            </button>
            <div className="h-6 w-px bg-gray-300 mx-2" />
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="flex items-center space-x-1 p-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="h-5 w-5" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="flex items-center space-x-1 p-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={() => setShowPropertiesPanel(!showPropertiesPanel)}
            className={`flex items-center space-x-1 p-2 rounded-md transition-colors ${
              showPropertiesPanel 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            title="Toggle Properties Panel"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Workflow Canvas */}
      <div className="flex-1 flex">
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>

        {/* Node Palette */}
        <WorkflowSidebar onAddNode={addNode} />

        {/* Properties Panel */}
        {showPropertiesPanel && selectedNode && (
          <WorkflowPropertiesPanel
            node={selectedNode}
            onUpdateNode={updateNodeData}
            onClose={() => setShowPropertiesPanel(false)}
          />
        )}
      </div>
    </div>
  );
};