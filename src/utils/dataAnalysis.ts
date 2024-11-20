export type ColumnType = 'numeric' | 'categorical' | 'text' | 'unknown';

export function inferColumnType(data: any[], column: string): ColumnType {
  const values = data.map(row => row[column]).filter(v => v != null);
  
  if (values.length === 0) return 'unknown';
  
  // Check if numeric
  if (values.every(v => !isNaN(parseFloat(v)))) {
    return 'numeric';
  }
  
  // Check if categorical (less than 10 unique values)
  const uniqueValues = new Set(values);
  if (uniqueValues.size < 10) {
    return 'categorical';
  }
  
  return 'text';
}

export function getColumnStats(data: any[], column: string, type: ColumnType) {
  const values = data.map(row => row[column]).filter(v => v != null);
  
  if (type === 'numeric') {
    const numbers = values.map(v => parseFloat(v));
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const bins = 10;
    const binSize = (max - min) / bins;
    
    const histogram = Array(bins).fill(0).map((_, i) => ({
      bin: (min + i * binSize).toFixed(2),
      count: numbers.filter(n => n >= min + i * binSize && n < min + (i + 1) * binSize).length
    }));
    
    return { histogram };
  } else {
    const frequencies = Object.entries(
      values.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    )
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return { frequencies };
  }
} 