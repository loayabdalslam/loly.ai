import { FC } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TrainingMetricsProps {
  metrics: {
    loss: number[];
    accuracy: number[];
    valLoss: number[];
    valAccuracy: number[];
  };
}

export const TrainingMetrics: FC<TrainingMetricsProps> = ({ metrics }) => {
  const data = metrics.loss.map((loss, index) => ({
    epoch: index + 1,
    loss,
    accuracy: metrics.accuracy[index],
    valLoss: metrics.valLoss[index],
    valAccuracy: metrics.valAccuracy[index],
  }));

  return (
    <div className="space-y-6">
      <div className="h-64">
        <h3 className="text-lg font-medium mb-2">Loss</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="epoch" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="loss" stroke="#3b82f6" name="Training Loss" />
            <Line type="monotone" dataKey="valLoss" stroke="#ef4444" name="Validation Loss" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-64">
        <h3 className="text-lg font-medium mb-2">Accuracy</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="epoch" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" name="Training Accuracy" />
            <Line type="monotone" dataKey="valAccuracy" stroke="#ef4444" name="Validation Accuracy" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};