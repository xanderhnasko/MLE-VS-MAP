import { Point, ChartDataPoint } from '../types';

// Convert Point[] to Recharts format
export function convertToChartData(data: Point[]): ChartDataPoint[] {
  return data.map(point => ({
    x: point.x,
    y: point.y
  }));
}

// Create chart data with MLE point
export function createMLEChartData(
  likelihoodData: Point[], 
  mleEstimate: number
): ChartDataPoint[] {
  const chartData = convertToChartData(likelihoodData);
  
  // Add MLE point
  const mlePoint = likelihoodData.find(p => Math.abs(p.x - mleEstimate) < 0.01);
  if (mlePoint) {
    chartData.push({
      x: mleEstimate,
      y: mlePoint.y,
      label: 'MLE'
    });
  }
  
  return chartData;
}

// Create chart data with MAP point
export function createMAPChartData(
  posteriorData: Point[], 
  mapEstimate: number
): ChartDataPoint[] {
  const chartData = convertToChartData(posteriorData);
  
  // Add MAP point
  const mapPoint = posteriorData.find(p => Math.abs(p.x - mapEstimate) < 0.01);
  if (mapPoint) {
    chartData.push({
      x: mapEstimate,
      y: mapPoint.y,
      label: 'MAP'
    });
  }
  
  return chartData;
}

// Format probability for display
export function formatProbability(p: number): string {
  return (p * 100).toFixed(1) + '%';
}

// Format number for display
export function formatNumber(n: number): string {
  return n.toFixed(2);
} 