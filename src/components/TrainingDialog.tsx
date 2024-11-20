import { FC } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { TrainingMetrics } from './TrainingMetrics';
import { TrainingForm } from './TrainingForm';

interface TrainingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartTraining: (config: any) => void;
  metrics: any;
  isTraining: boolean;
}

export const TrainingDialog: FC<TrainingDialogProps> = ({
  open,
  onOpenChange,
  onStartTraining,
  metrics,
  isTraining,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] bg-white dark:bg-gray-800 rounded-lg p-6">
          <Dialog.Title className="text-xl font-bold mb-4">
            Model Training
          </Dialog.Title>
          
          <div className="space-y-4">
            {!isTraining ? (
              <TrainingForm onSubmit={onStartTraining} />
            ) : (
              <TrainingMetrics metrics={metrics} />
            )}
          </div>

          <Dialog.Close className="absolute top-4 right-4">
            <X className="w-5 h-5" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};