import { FC, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { inferColumnType, getColumnStats, ColumnType } from '../utils/dataAnalysis';
import { analyzeColumn } from '../utils/geminiAnalysis';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ColumnAnalysisProps {
  data: any[];
  column: string;
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY!);

export const ColumnAnalysis: FC<ColumnAnalysisProps> = ({ data, column }) => {
  const [stats, setStats] = useState<any>(null);
  const [columnType, setColumnType] = useState<ColumnType>('unknown');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const analyze = async () => {
      setIsLoading(true);
      const type = inferColumnType(data, column);
      setColumnType(type);
      setStats(getColumnStats(data, column, type));
      
      try {
        const result = await analyzeColumn(data, column);
        setAnalysis(result);
      } catch (error) {
        console.error('Analysis failed:', error);
      }
      setIsLoading(false);
    };
    
    analyze();
  }, [data, column]);

  if (!stats) return null;

  return (
    <div className="mt-2 p-4 bg-gray-800 rounded-lg">
      <div className="mb-4">
        <h4 className="text-sm font-medium text-white mb-1">{column}</h4>
        <div className="text-xs text-gray-300">
          <span className="font-medium">Type:</span> {columnType}
          {isLoading ? (
            <div className="animate-pulse mt-1">Analyzing...</div>
          ) : analysis ? (
            <div className="mt-1 space-y-1">
              <div>{analysis.description}</div>
              <div className="text-blue-300">{analysis.mlUse}</div>
              <div className="text-green-300">{analysis.preprocessing}</div>
            </div>
          ) : null}
        </div>
      </div>
      
      <div className="h-40 bg-gray-900 rounded-md p-2">
        <ResponsiveContainer width="100%" height="100%">
          {columnType === 'numeric' ? (
            <BarChart data={stats.histogram}>
              <XAxis dataKey="bin" stroke="#9CA3AF" fontSize={10} />
              <YAxis stroke="#9CA3AF" fontSize={10} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgb(31, 41, 55)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          ) : (
            <BarChart data={stats.frequencies}>
              <XAxis dataKey="value" stroke="#9CA3AF" fontSize={10} />
              <YAxis stroke="#9CA3AF" fontSize={10} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgb(31, 41, 55)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 