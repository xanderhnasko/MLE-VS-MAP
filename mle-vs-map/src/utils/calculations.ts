import { Point } from '../types';
import { betaPDF, binomialLikelihood, generateDistributionData } from './distributions';

// MLE calculation (analytical)
export function calculateMLE(heads: number, tails: number): number {
  const total = heads + tails;
  if (total === 0) return 0.5; // Default to fair coin if no data
  return heads / total;
}

// MAP calculation (analytical for Beta-Binomial)
export function calculateMAP(heads: number, tails: number, alpha: number, beta: number): number {
  const total = heads + tails;
  if (total === 0) return alpha / (alpha + beta); // Prior mean if no data
  
  return (heads + alpha - 1) / (total + alpha + beta - 2);
}

// Generate likelihood data for plotting
export function generateLikelihoodData(heads: number, tails: number): Point[] {
  return generateDistributionData(
    (p) => binomialLikelihood(p, heads, tails),
    [0, 1],
    100
  );
}

// Generate prior data for plotting
export function generatePriorData(alpha: number, beta: number): Point[] {
  return generateDistributionData(
    (p) => betaPDF(p, alpha, beta),
    [0, 1],
    100
  );
}

// Generate posterior data for plotting
export function generatePosteriorData(heads: number, tails: number, alpha: number, beta: number): Point[] {
  const posteriorAlpha = heads + alpha;
  const posteriorBeta = tails + beta;
  
  return generateDistributionData(
    (p) => betaPDF(p, posteriorAlpha, posteriorBeta),
    [0, 1],
    100
  );
}

// Normalize data for better visualization
export function normalizeData(data: Point[]): Point[] {
  if (data.length === 0) return data;
  
  const maxY = Math.max(...data.map(p => p.y));
  if (maxY === 0) return data;
  
  return data.map(point => ({
    x: point.x,
    y: point.y / maxY
  }));
} 