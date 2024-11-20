import { FC } from 'react';
import * as Select from '@radix-ui/react-select';
import * as Slider from '@radix-ui/react-slider';
import { OptimizerType, TrainingConfig } from '../types/ml';

interface TrainingFormProps {
  onSubmit: (config: TrainingConfig) => void;
}

export const TrainingForm: FC<TrainingFormProps> = ({ onSubmit }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    onSubmit({
      optimizer: formData.get('optimizer') as OptimizerType,
      learningRate: parseFloat(formData.get('learningRate') as string),
      batchSize: parseInt(formData.get('batchSize') as string),
      epochs: parseInt(formData.get('epochs') as string),
      validationSplit: parseFloat(formData.get('validationSplit') as string),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Optimizer</label>
        <Select.Root name="optimizer" defaultValue="Adam">
          <Select.Trigger className="w-full p-2 border rounded">
            <Select.Value />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-white dark:bg-gray-800 border rounded-md shadow-lg">
              <Select.Viewport>
                <Select.Item value="Adam" className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Select.ItemText>Adam</Select.ItemText>
                </Select.Item>
                <Select.Item value="SGD" className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Select.ItemText>SGD</Select.ItemText>
                </Select.Item>
                <Select.Item value="RMSprop" className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Select.ItemText>RMSprop</Select.ItemText>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Learning Rate</label>
        <Slider.Root
          name="learningRate"
          defaultValue={[0.001]}
          min={0.0001}
          max={0.01}
          step={0.0001}
          className="relative flex items-center w-full h-5"
        >
          <Slider.Track className="bg-gray-200 relative grow h-1 rounded-full">
            <Slider.Range className="absolute h-full bg-blue-500 rounded-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-4 h-4 bg-blue-500 rounded-full" />
        </Slider.Root>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Batch Size</label>
          <input
            type="number"
            name="batchSize"
            defaultValue={32}
            min={1}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Epochs</label>
          <input
            type="number"
            name="epochs"
            defaultValue={10}
            min={1}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Validation Split</label>
        <Slider.Root
          name="validationSplit"
          defaultValue={[0.2]}
          min={0}
          max={0.5}
          step={0.1}
          className="relative flex items-center w-full h-5"
        >
          <Slider.Track className="bg-gray-200 relative grow h-1 rounded-full">
            <Slider.Range className="absolute h-full bg-blue-500 rounded-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-4 h-4 bg-blue-500 rounded-full" />
        </Slider.Root>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Start Training
      </button>
    </form>
  );
};