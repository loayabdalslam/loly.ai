import { FC, useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { X, Edit2, Settings, Upload } from 'lucide-react';
import { LayerConfig } from '../types/ml';
import { showToast } from '../utils/toast';

interface LayerNodeProps extends NodeProps {
  data: LayerConfig & {
    onDelete: (id: string) => void;
    onLabelChange: (id: string, label: string) => void;
    onParamsChange: (id: string, params: Partial<LayerConfig>) => void;
  };
}

const BaseNode: FC<LayerNodeProps> = ({ id, data, type }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showParams, setShowParams] = useState(false);
  const [label, setLabel] = useState(data.label || type);

  return (
    <div className="relative p-4 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="absolute top-1 right-1 flex space-x-1">
        <button onClick={() => setShowParams(!showParams)} className="p-1 hover:text-blue-500">
          <Settings className="w-4 h-4" />
        </button>
        <button onClick={() => data.onDelete(id)} className="p-1 hover:text-red-500">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="text-sm font-medium dark:text-white mb-2">{label}</div>

      {showParams && (
        <div className="mt-2 space-y-2">
          {renderLayerParams(type, data, (params) => data.onParamsChange(id, params))}
        </div>
      )}

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const renderLayerParams = (type: string, data: LayerConfig, onChange: (params: Partial<LayerConfig>) => void) => {
  switch (type) {
    case 'Dense':
      return (
        <>
          <div>
            <label className="block text-xs mb-1">Units</label>
            <input
              type="number"
              value={data.units || 64}
              onChange={(e) => onChange({ units: parseInt(e.target.value) })}
              className="w-full px-2 py-1 text-sm rounded border dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Activation</label>
            <select
              value={data.activation || 'relu'}
              onChange={(e) => onChange({ activation: e.target.value })}
              className="w-full px-2 py-1 text-sm rounded border dark:bg-gray-700"
            >
              <option value="relu">ReLU</option>
              <option value="sigmoid">Sigmoid</option>
              <option value="tanh">Tanh</option>
            </select>
          </div>
        </>
      );

    case 'Conv2D':
      return (
        <>
          <div>
            <label className="block text-xs mb-1">Filters</label>
            <input
              type="number"
              value={data.filters || 32}
              onChange={(e) => onChange({ filters: parseInt(e.target.value) })}
              className="w-full px-2 py-1 text-sm rounded border dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Kernel Size</label>
            <input
              type="number"
              value={data.kernelSize || 3}
              onChange={(e) => onChange({ kernelSize: parseInt(e.target.value) })}
              className="w-full px-2 py-1 text-sm rounded border dark:bg-gray-700"
            />
          </div>
        </>
      );

    case 'Dropout':
      return (
        <div>
          <label className="block text-xs mb-1">Rate</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={data.rate || 0.5}
            onChange={(e) => onChange({ rate: parseFloat(e.target.value) })}
            className="w-full px-2 py-1 text-sm rounded border dark:bg-gray-700"
          />
        </div>
      );

    default:
      return null;
  }
};

const CSVInputNodeComponent: FC<LayerNodeProps> = ({ id, data }) => {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      showToast.loading('Processing CSV file...');
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result;
          if (typeof text === 'string') {
            const [header, ...rows] = text.split('\n');
            const columns = header.split(',');
            const dataset = rows.map(row => {
              const values = row.split(',');
              return columns.reduce((obj, col, i) => ({
                ...obj,
                [col]: values[i]
              }), {});
            });
            
            data.onParamsChange(id, { features: columns, dataset });
            showToast.dismiss();
            showToast.success('CSV file loaded successfully');
          }
        } catch (error) {
          showToast.error('Failed to process CSV file');
        }
      };
      reader.onerror = () => showToast.error('Failed to read CSV file');
      reader.readAsText(file);
    }
  }, [id, data]);

  return (
    <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      <Handle type="source" position={Position.Right} />
      <div className="absolute top-1 right-1">
        <button onClick={() => data.onDelete(id)} className="p-1 hover:text-red-500">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <h3 className="font-semibold mb-2">CSV Input</h3>
      
      <label className="flex flex-col items-center p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
        <Upload className="w-8 h-8 text-gray-400 mb-2" />
        <span className="text-sm text-gray-500">Upload CSV</span>
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>
      
      {data.features && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-1">Features:</p>
          <div className="text-xs text-gray-500">
            {data.features.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};

export const InputNode = BaseNode;
export const DenseNode = BaseNode;
export const ConvNode = BaseNode;
export const OutputNode = BaseNode;
export const DropoutNode = BaseNode;
export const CSVInputNode = CSVInputNodeComponent;