import { FC } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface ExpandButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}

export const ExpandButton: FC<ExpandButtonProps> = ({ isExpanded, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {isExpanded ? (
        <Minimize2 className="w-4 h-4" />
      ) : (
        <Maximize2 className="w-4 h-4" />
      )}
    </button>
  );
}; 