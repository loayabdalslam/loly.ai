import { FC, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Upload } from 'lucide-react';

export const CSVInputNode: FC = () => {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        // Process CSV data here
        console.log('CSV loaded:', text);
      };
      reader.readAsText(file);
    }
  }, []);

  return (
    <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      <Handle type="source" position={Position.Right} />
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
    </div>
  );
}; 