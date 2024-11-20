import { FC, useState, useCallback } from 'react';
import { Table } from './Table';
import { FeatureEngineering } from './FeatureEngineering';
import { Upload, Table as TableIcon, Wand2 } from 'lucide-react';
import { ExpandButton } from './ExpandButton';

interface DataPanelProps {
  data: any[];
  onDataChange: (newData: any[]) => void;
  isExpanded: boolean;
  onExpand: () => void;
  onAddNode: (node: any) => void;
}

export const DataPanel: FC<DataPanelProps> = ({ data, onDataChange, isExpanded, onExpand, onAddNode }) => {
  const [activeTab, setActiveTab] = useState<'table' | 'features'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState<string[]>([]);
  const itemsPerPage = 10;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const text = await file.text();
    const rows = text.split('\n');
    const headers = rows[0].split(',').map(h => h.trim());
    
    const parsedData = rows.slice(1).map(row => {
      const values = row.split(',');
      return headers.reduce((obj, header, index) => ({
        ...obj,
        [header]: values[index]?.trim()
      }), {});
    });

    setColumns(headers);
    onDataChange(parsedData);
  };

  const handleAddToFlow = () => {
    onAddNode();
  };

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={`h-full border rounded-lg overflow-hidden bg-[var(--card-background)] border-[var(--card-border)] ${
      isExpanded ? 'fixed inset-0 z-50' : ''
    }`}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-2 rounded-lg ${
                activeTab === 'table' ? 'bg-blue-500 text-white' : 'text-gray-600'
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <TableIcon className="w-4 h-4 mr-2 inline-block" />
              Data Table
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-3 py-2 rounded-lg ${
                activeTab === 'features' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <Wand2 className="w-4 h-4 mr-2 inline-block" />
              Feature Engineering
            </button>
          </div>
          <ExpandButton isExpanded={isExpanded} onClick={onExpand} />
        </div>

        <div className="flex-1 min-h-0">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <label className="flex flex-col items-center cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Upload CSV/XLSX</span>
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          ) : (
            activeTab === 'table' ? (
              <div>
                <Table data={paginatedData} columns={columns} />
                <div className="flex justify-between items-center p-4 border-t dark:border-gray-700">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-gray-600 dark:text-gray-300">Page {currentPage}</span>
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage * itemsPerPage >= data.length}
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full overflow-hidden">
                <FeatureEngineering 
                  data={data} 
                  columns={columns}
                  onDataChange={onDataChange}
                  onColumnsChange={setColumns}
                  onAddToFlow={handleAddToFlow}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}; 