import { FC, useState } from 'react';
import { Brain, Layers, Box, BarChart, Settings, Cpu, Workflow, Shield, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const layerComponents = [
  {
    category: 'Input/Output',
    items: [
      { name: 'Input', icon: Box },
      { name: 'Output', icon: Box },
      { name: 'CSVInput', icon: Box },
    ]
  },
  {
    category: 'Core Layers',
    items: [
      { name: 'Dense', icon: Layers },
      { name: 'Conv2D', icon: Brain },
      { name: 'MaxPool2D', icon: Brain },
      { name: 'LSTM', icon: Brain },
      { name: 'Flatten', icon: Layers },
    ]
  },
  {
    category: 'Optimizers',
    items: [
      { name: 'Adam', icon: Cpu },
      { name: 'SGD', icon: Cpu },
      { name: 'RMSprop', icon: Cpu },
    ]
  },
  {
    category: 'Regularization',
    items: [
      { name: 'Dropout', icon: Shield },
      { name: 'L1', icon: Shield },
      { name: 'L2', icon: Shield },
    ]
  }
];

const modelTemplates = [
  {
    name: 'Simple Classification',
    nodes: [
      { type: 'Input', position: { x: 100, y: 100 } },
      { type: 'Dense', position: { x: 250, y: 100 }, data: { units: 128, activation: 'relu' } },
      { type: 'Dropout', position: { x: 400, y: 100 }, data: { rate: 0.3 } },
      { type: 'Dense', position: { x: 550, y: 100 }, data: { units: 64, activation: 'relu' } },
      { type: 'Dense', position: { x: 700, y: 100 }, data: { units: 10, activation: 'softmax' } },
    ]
  },
  {
    name: 'Simple Regression',
    nodes: [
      { type: 'Input', position: { x: 100, y: 100 } },
      { type: 'Dense', position: { x: 250, y: 100 }, data: { units: 64, activation: 'relu' } },
      { type: 'Dense', position: { x: 400, y: 100 }, data: { units: 32, activation: 'relu' } },
      { type: 'Dense', position: { x: 550, y: 100 }, data: { units: 1, activation: 'linear' } },
    ]
  },
  {
    name: 'Seq2Seq',
    nodes: [
      { type: 'Input', position: { x: 100, y: 100 } },
      { type: 'LSTM', position: { x: 250, y: 100 }, data: { units: 256, returnSequences: true } },
      { type: 'LSTM', position: { x: 400, y: 100 }, data: { units: 128 } },
      { type: 'Dense', position: { x: 550, y: 100 }, data: { units: 64, activation: 'relu' } },
      { type: 'Dense', position: { x: 700, y: 100 }, data: { units: 1, activation: 'linear' } },
    ]
  }
];

interface SidebarProps {
  onApplyTemplate: (nodes: any[]) => void;
}

export const Sidebar: FC<SidebarProps> = ({ onApplyTemplate }) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Templates']);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-72 bg-[var(--card-background)] border-r border-[var(--card-border)] p-4 overflow-y-auto custom-scrollbar">
      <div className="space-y-4">
        <div className="border rounded-lg overflow-hidden border-[var(--card-border)]">
          <h3 className="p-3 font-medium bg-[var(--card-background)]">Templates</h3>
          <div className="p-2 space-y-2">
            {modelTemplates.map((template) => (
              <button
                key={template.name}
                onClick={() => onApplyTemplate(template.nodes)}
                className="w-full text-left p-3 rounded-lg hover:bg-[var(--hover-background)] transition-colors"
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>
        
        {layerComponents.map((category) => (
          <div key={category.category} className="border rounded-lg overflow-hidden border-[var(--card-border)]">
            <button
              onClick={() => toggleCategory(category.category)}
              className="w-full p-3 flex items-center justify-between bg-[var(--card-background)]"
            >
              <span className="font-medium">{category.category}</span>
              {expandedCategories.includes(category.category) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            {expandedCategories.includes(category.category) && (
              <div className="p-2 space-y-2">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    draggable
                    onDragStart={(e) => onDragStart(e, item.name)}
                    className="flex items-center space-x-2 p-2 rounded-lg cursor-move hover:bg-[var(--hover-background)]"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};