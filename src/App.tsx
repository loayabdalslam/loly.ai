import { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Sidebar } from './components/Sidebar';
import { ThemeToggle } from './components/ThemeToggle';
import { TrainingDialog } from './components/TrainingDialog';
import { InputNode, DenseNode, ConvNode, OutputNode, CSVInputNode } from './components/MLComponents';
import { useThemeStore } from './store/theme';
import { Play } from 'lucide-react';
import { ModelPanel } from './components/ModelPanel';
import { DataPanel } from './components/DataPanel';
import './styles/scrollbar.css';
import { Toaster } from 'react-hot-toast';
import { showToast } from './utils/toast';
import { LayerConfig } from './types/ml';

const nodeTypes = {
  Input: InputNode,
  Dense: DenseNode,
  Conv2D: ConvNode,
  Output: OutputNode,
  CSVInput: CSVInputNode,
};

function App() {
  const { theme } = useThemeStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isTrainingDialogOpen, setIsTrainingDialogOpen] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingMetrics, setTrainingMetrics] = useState({
    loss: [],
    accuracy: [],
    valLoss: [],
    valAccuracy: [],
  });
  const [data, setData] = useState<any[]>([]);
  const [expandedPanel, setExpandedPanel] = useState<'data' | 'flow' | 'model' | null>(null);
  const [columns, setColumns] = useState<string[]>([]);

  // Base handlers
  const handleDeleteNode = useCallback((nodeId: string) => {
    try {
      setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
      setEdges((edges) => edges.filter((edge) => 
        edge.source !== nodeId && edge.target !== nodeId
      ));
      showToast.success('Node deleted successfully');
    } catch (error) {
      showToast.error('Failed to delete node');
    }
  }, [setNodes, setEdges]);

  const handleLabelChange = useCallback((nodeId: string, newLabel: string) => {
    setNodes((nodes) => nodes.map((node) => 
      node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
    ));
  }, [setNodes]);

  const handleParamsChange = useCallback((nodeId: string, params: Partial<LayerConfig>) => {
    setNodes((nodes) => nodes.map((node) => 
      node.id === nodeId ? { ...node, data: { ...node.data, ...params } } : node
    ));
  }, [setNodes]);

  // Flow handlers
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleAddToFlow = useCallback((analysisData: {
    features: string[];
    target: string;
    dataset: any[];
  }) => {
    const newNode = {
      id: `csv-input-${Date.now()}`,
      type: 'CSVInput',
      position: { x: 100, y: 100 },
      data: { 
        features: analysisData.features,
        target: analysisData.target,
        dataset: analysisData.dataset,
        onDelete: handleDeleteNode,
        onLabelChange: handleLabelChange,
        onParamsChange: handleParamsChange
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [handleDeleteNode, handleLabelChange, handleParamsChange]);

  const handleStartTraining = useCallback(async () => {
    if (!nodes.find(n => n.type === 'CSVInput')?.data?.dataset) {
      showToast.error('No training data found');
      return;
    }

    showToast.loading('Training model...');
    try {
      const model = await createAndTrainModel(nodes, nodes.find(n => n.type === 'CSVInput')?.data?.dataset);
      // Handle trained model...
      showToast.success('Model training completed');
    } catch (error) {
      console.error('Training failed:', error);
      showToast.error('Training failed');
    }
    setIsTraining(false);
  }, [nodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = {
        x: event.clientX - 200, // Adjust for sidebar width
        y: event.clientY - 40,  // Adjust for header height
      };

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          label: type,
          onDelete: handleDeleteNode,
          onLabelChange: handleLabelChange,
          onParamsChange: handleParamsChange
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes, handleDeleteNode, handleLabelChange, handleParamsChange]
  );

  const handleApplyTemplate = useCallback((templateNodes: any[]) => {
    try {
      // Add unique IDs to template nodes
      const nodesWithIds = templateNodes.map((node, index) => ({
        ...node,
        id: `${node.type}-${Date.now()}-${index}`,
        data: {
          ...node.data,
          label: node.type,
          onDelete: handleDeleteNode,
          onLabelChange: handleLabelChange,
          onParamsChange: handleParamsChange
        }
      }));

      setNodes(nodesWithIds);
      
      // Add edges connecting the nodes with the new IDs
      const newEdges = nodesWithIds.slice(0, -1).map((node, index) => ({
        id: `edge-${Date.now()}-${index}`,
        source: node.id,
        target: nodesWithIds[index + 1].id,
        type: 'default'
      }));
      
      setEdges(newEdges);
      showToast.success('Template applied successfully');
    } catch (error) {
      showToast.error('Failed to apply template');
    }
  }, [handleDeleteNode, handleLabelChange, handleParamsChange]);

  return (
    <div className={theme}>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div className="flex h-screen overflow-hidden">
          <Sidebar onApplyTemplate={handleApplyTemplate} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="h-14 border-b border-[var(--card-border)] flex items-center justify-between px-4 bg-[var(--card-background)]">
              <h1 className="text-xl font-bold">ML Flow Platform</h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsTrainingDialogOpen(true)}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Train Model
                </button>
                <ThemeToggle />
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-3 gap-4 p-4 overflow-hidden">
              <div className="col-span-1 overflow-hidden flex flex-col">
                <DataPanel 
                  data={data} 
                  onDataChange={setData}
                  isExpanded={expandedPanel === 'data'}
                  onExpand={() => setExpandedPanel(expandedPanel === 'data' ? null : 'data')}
                  onAddNode={handleAddToFlow}
                />
              </div>
              
              <div className="col-span-2 grid grid-rows-2 gap-4 overflow-hidden">
                <div className="border rounded-lg overflow-hidden bg-[var(--card-background)] border-[var(--card-border)]">
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    nodeTypes={nodeTypes}
                    fitView
                  >
                    <Background />
                    <Controls />
                  </ReactFlow>
                </div>
                
                <div className="overflow-hidden">
                  <ModelPanel 
                    nodes={nodes}
                    onCompile={handleStartTraining}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {isTrainingDialogOpen && (
          <TrainingDialog
            open={isTrainingDialogOpen}
            onOpenChange={setIsTrainingDialogOpen}
            onStartTraining={handleStartTraining}
            metrics={trainingMetrics}
            isTraining={isTraining}
          />
        )}

        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export default App;