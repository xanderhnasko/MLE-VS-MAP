export interface Point {
  x: number;
  y: number;
}

export interface AppState {
  // Data
  heads: number;
  tails: number;
  
  // Prior parameters
  alpha: number;
  beta: number;
  
  // Computed values (derived state)
  mleEstimate: number;
  mapEstimate: number;
  likelihoodData: Point[];
  priorData: Point[];
  posteriorData: Point[];
}

export interface ChartDataPoint {
  x: number;
  y: number;
  label?: string;
} 