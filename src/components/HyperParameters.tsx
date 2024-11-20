import { FC } from 'react';

interface HyperParametersProps {
  onParamsChange: (params: any) => void;
}

export const HyperParameters: FC<HyperParametersProps> = ({ onParamsChange }) => {
  return (
    <div className="border rounded-lg p-4 dark:border-gray-700 mb-4">
      <h3 className="font-medium mb-3">Hyperparameters</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Learning Rate</label>
          <input
            type="number"
            step="0.001"
            defaultValue="0.001"
            onChange={(e) => onParamsChange({ learningRate: e.target.value })}
            className="w-full px-3 py-1.5 rounded border dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Batch Size</label>
          <input
            type="number"
            defaultValue="32"
            onChange={(e) => onParamsChange({ batchSize: e.target.value })}
            className="w-full px-3 py-1.5 rounded border dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Epochs</label>
          <input
            type="number"
            defaultValue="10"
            onChange={(e) => onParamsChange({ epochs: e.target.value })}
            className="w-full px-3 py-1.5 rounded border dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  );
}; 