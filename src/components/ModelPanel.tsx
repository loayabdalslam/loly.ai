import { FC, useState } from 'react';
import { HyperParameters } from './HyperParameters';

interface ModelPanelProps {
  nodes: any[];
  onCompile: (params: any) => void;
}

export const ModelPanel: FC<ModelPanelProps> = ({ nodes, onCompile }) => {
  const [hyperParams, setHyperParams] = useState({
    learningRate: 0.001,
    batchSize: 32,
    epochs: 10
  });

  return (
    <div className="h-full flex flex-col bg-[var(--card-background)] border-l border-[var(--card-border)]">
      <div className="p-4 border-b border-[var(--card-border)]">
        <h2 className="text-xl font-bold">Model Summary</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <div className="space-y-4">
          <HyperParameters onParamsChange={setHyperParams} />
          
          <div className="border rounded-lg p-4 border-[var(--card-border)]">
            <h3 className="font-medium mb-2">Layer Structure</h3>
            <div className="space-y-2">
              {nodes.map((node, index) => (
                <div key={node.id} className="flex items-center space-x-2 text-sm">
                  <span className="font-mono">{index + 1}.</span>
                  <span>{node.type}</span>
                  {node.data.units && <span>({node.data.units} units)</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-4 border-[var(--card-border)]">
            <h3 className="font-medium mb-2">Model Statistics</h3>
            <div className="space-y-1 text-sm">
              <p>Total Layers: {nodes.length}</p>
              <p>Trainable Parameters: {calculateParams(nodes)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-[var(--card-border)]">
        <button
          onClick={() => onCompile(hyperParams)}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Compile Model
        </button>
      </div>
    </div>
  );
};

function calculateParams(nodes: any[]): string {
  // This is a placeholder - implement actual parameter calculation
  return "Calculate based on layer configurations";
} 