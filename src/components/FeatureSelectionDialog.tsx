import { FC, useState, useCallback } from 'react';

interface FeatureSelectionDialogProps {
  columns: string[];
  onConfirm: (features: string[], target: string) => void;
  onClose: () => void;
}

export const FeatureSelectionDialog: FC<FeatureSelectionDialogProps> = ({
  columns,
  onConfirm,
  onClose,
}) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [targetVariable, setTargetVariable] = useState<string>('');

  const handleConfirm = () => {
    onConfirm(selectedFeatures, targetVariable);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
        <h3 className="text-lg font-medium mb-4">Select Features</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Input Features (X)</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {columns.map(col => (
              <label key={col} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(col)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFeatures([...selectedFeatures, col]);
                    } else {
                      setSelectedFeatures(selectedFeatures.filter(f => f !== col));
                    }
                  }}
                  className="mr-2"
                />
                {col}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Target Variable (Y)</label>
          <select
            value={targetVariable}
            onChange={(e) => setTargetVariable(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Select target...</option>
            {columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!targetVariable || selectedFeatures.length === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}; 