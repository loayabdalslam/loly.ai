export type LayerType = 
  | 'Input'
  | 'Dense'
  | 'Conv2D'
  | 'MaxPool2D'
  | 'Dropout'
  | 'BatchNormalization'
  | 'LSTM'
  | 'Flatten';

export type OptimizerType = 
  | 'Adam'
  | 'SGD'
  | 'RMSprop'
  | 'Adagrad';

export type RegularizationType = 
  | 'Dropout'
  | 'L1'
  | 'L2'
  | 'L1L2';

export interface LayerConfig {
  label?: string;
  units?: number;
  activation?: string;
  filters?: number;
  kernelSize?: number;
  rate?: number;
  returnSequences?: boolean;
  features?: string[];
  dataset?: any[];
  target?: string;
}

export interface TrainingConfig {
  optimizer: OptimizerType;
  learningRate: number;
  batchSize: number;
  epochs: number;
  validationSplit: number;
}