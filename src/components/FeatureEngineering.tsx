import { FC, useState } from 'react';
import { Trash2, Edit2, Plus, ArrowRight, X, Info } from 'lucide-react';
import { ColumnAnalysis } from './ColumnAnalysis';
import { analyzeVariables } from '../utils/variableAnalysis';
import { showToast } from '../utils/toast';

interface FeatureEngineeringProps {
  data: any[];
  columns: string[];
  onDataChange: (newData: any[]) => void;
  onAddToFlow: () => void;
  onColumnsChange: (newColumns: string[]) => void;
}

export const FeatureEngineering: FC<FeatureEngineeringProps> = ({
  data,
  columns,
  onDataChange,
  onAddToFlow,
  onColumnsChange,
}) => {
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [newColumnName, setNewColumnName] = useState('');
  const [variableAnalysis, setVariableAnalysis] = useState<{
    dependent: string[];
    independent: string[];
  } | null>(null);

  const handleDropColumn = (column: string) => {
    const newColumns = columns.filter(col => col !== column);
    const newData = data.map(row => {
      const newRow = { ...row };
      delete newRow[column];
      return newRow;
    });
    onDataChange(newData);
    onColumnsChange(newColumns);
    try {
      showToast.success(`Column "${column}" dropped successfully`);
    } catch (error) {
      showToast.error(`Failed to drop column "${column}"`);
    }
  };

  const handleRenameColumn = (oldName: string, newName: string) => {
    const newData = data.map(row => {
      const { [oldName]: value, ...rest } = row;
      return { ...rest, [newName]: value };
    });
    onDataChange(newData);
    setEditingColumn(null);
  };

  const handleDropNaN = (column: string) => {
    const newData = data.filter(row => row[column] !== '' && row[column] != null);
    onDataChange(newData);
    try {
      showToast.success(`NaN values removed from "${column}"`);
    } catch (error) {
      showToast.error(`Failed to remove NaN values from "${column}"`);
    }
  };

  const handleNormalize = (column: string) => {
    const values = data.map(row => parseFloat(row[column]));
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    const newData = data.map(row => ({
      ...row,
      [`${column}_normalized`]: ((parseFloat(row[column]) - min) / (max - min)).toFixed(4)
    }));
    
    onDataChange(newData);
    onColumnsChange([...columns, `${column}_normalized`]);
    try {
      showToast.success(`Column "${column}" normalized successfully`);
    } catch (error) {
      showToast.error(`Failed to normalize column "${column}"`);
    }
  };

  const handleOneHot = (column: string) => {
    const uniqueValues = [...new Set(data.map(row => row[column]))];
    const newColumns = uniqueValues.map(value => `${column}_${value}`);
    
    const newData = data.map(row => {
      const newRow = { ...row };
      delete newRow[column];
      uniqueValues.forEach(value => {
        newRow[`${column}_${value}`] = row[column] === value ? 1 : 0;
      });
      return newRow;
    });
    
    onDataChange(newData);
    onColumnsChange([...columns.filter(col => col !== column), ...newColumns]);
    try {
      showToast.success(`One-hot encoding applied to "${column}"`);
    } catch (error) {
      showToast.error(`Failed to apply one-hot encoding to "${column}"`);
    }
  };

  const handleAnalyzeVariables = async () => {
    showToast.loading('Analyzing variables...');
    try {
      const analysis = await analyzeVariables(data, columns);
      setVariableAnalysis(analysis);
      showToast.success('Variable analysis completed');
    } catch (error) {
      showToast.error('Failed to analyze variables');
    }
  };

  const handleAddToFlow = () => {
    if (variableAnalysis) {
      onAddToFlow({
        features: variableAnalysis.independent,
        target: variableAnalysis.dependent[0],
        dataset: data
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-4">
          {columns.map(column => (
            <div key={column} className="border rounded-lg p-4 dark:border-gray-700 bg-white dark:bg-gray-800">
              {editingColumn === column ? (
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                    placeholder="New column name"
                  />
                  <button
                    onClick={() => handleRenameColumn(column, newColumnName)}
                    className="p-1 text-green-500 hover:text-green-600"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingColumn(null)}
                    className="p-1 text-red-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium dark:text-white">{column}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingColumn(column);
                          setNewColumnName(column);
                        }}
                        className="p-1 text-blue-500 hover:text-blue-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDropColumn(column)}
                        className="p-1 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <ColumnAnalysis data={data} column={column} />
                </>
              )}

              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => handleDropNaN(column)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                >
                  Drop NaN
                </button>
                <button
                  onClick={() => handleNormalize(column)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                >
                  Normalize
                </button>
                <button
                  onClick={() => handleOneHot(column)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                >
                  One-Hot Encode
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 space-y-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <button
          onClick={handleAnalyzeVariables}
          className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          Analyze Variables with AI
        </button>
        
        {variableAnalysis && (
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Target Variable: </span>
              {variableAnalysis.dependent.join(', ')}
            </div>
            <div className="text-sm">
              <span className="font-medium">Feature Variables: </span>
              {variableAnalysis.independent.join(', ')}
            </div>
          </div>
        )}
        
        <button
          onClick={handleAddToFlow}
          disabled={!variableAnalysis}
          className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-sm disabled:opacity-50"
        >
          Add to Flow
        </button>
      </div>
    </div>
  );
};