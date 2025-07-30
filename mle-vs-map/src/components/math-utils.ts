// Mathematical utility functions for MLE vs MAP demonstration

export interface CoinData {
  heads: number;
  tails: number;
}

export interface BetaParams {
  alpha: number;
  beta: number;
}

// Gamma function approximation using Stirling's approximation for integer values
export function gamma(z: number): number {
  if (z === 1) return 1;
  if (z === 0.5) return Math.sqrt(Math.PI);
  if (z > 1) return (z - 1) * gamma(z - 1);
  return Math.sqrt(2 * Math.PI / z) * Math.pow(z / Math.E, z);
}

// Beta function B(α, β) = Γ(α)Γ(β)/Γ(α+β)
export function betaFunction(alpha: number, beta: number): number {
  return (gamma(alpha) * gamma(beta)) / gamma(alpha + beta);
}

// Beta distribution PDF
export function betaPDF(x: number, alpha: number, beta: number): number {
  if (x <= 0 || x >= 1) return 0;
  const coefficient = 1 / betaFunction(alpha, beta);
  return coefficient * Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1);
}

// Binomial coefficient
export function binomialCoeff(n: number, k: number): number {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;
  
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = result * (n - i) / (i + 1);
  }
  return result;
}

// Binomial likelihood P(data | θ)
export function binomialLikelihood(theta: number, heads: number, tails: number): number {
  const n = heads + tails;
  const coeff = binomialCoeff(n, heads);
  return coeff * Math.pow(theta, heads) * Math.pow(1 - theta, tails);
}

// Calculate MLE (simple: heads / total)
export function calculateMLE(data: CoinData): number {
  const total = data.heads + data.tails;
  if (total === 0) return 0.5;
  return data.heads / total;
}

// Calculate MAP estimate using Beta-Binomial conjugacy
export function calculateMAP(data: CoinData, prior: BetaParams): number {
  const posteriorAlpha = prior.alpha + data.heads;
  const posteriorBeta = prior.beta + data.tails;
  
  // MAP estimate for Beta distribution is (α-1)/(α+β-2) when α,β > 1
  if (posteriorAlpha > 1 && posteriorBeta > 1) {
    return (posteriorAlpha - 1) / (posteriorAlpha + posteriorBeta - 2);
  }
  // If α or β ≤ 1, use the mode at the boundary or mean
  return posteriorAlpha / (posteriorAlpha + posteriorBeta);
}

// Get posterior Beta parameters
export function getPosteriorParams(data: CoinData, prior: BetaParams): BetaParams {
  return {
    alpha: prior.alpha + data.heads,
    beta: prior.beta + data.tails
  };
}

// Generate points for plotting
export function generatePlotPoints(
  startX: number = 0.01,
  endX: number = 0.99,
  numPoints: number = 200
): number[] {
  const points: number[] = [];
  const step = (endX - startX) / (numPoints - 1);
  for (let i = 0; i < numPoints; i++) {
    points.push(startX + i * step);
  }
  return points;
}

// Normalize values for plotting (scale to 0-1 range)
export function normalizeValues(values: number[]): number[] {
  const max = Math.max(...values);
  if (max === 0) return values;
  return values.map(v => v / max);
}

// Calculate "strength" of data for tug-of-war visualization
export function calculateDataStrength(data: CoinData): number {
  return data.heads + data.tails;
}

// Calculate "strength" of prior for tug-of-war visualization
export function calculatePriorStrength(prior: BetaParams): number {
  // Sum of alpha and beta represents pseudo-observations
  return prior.alpha + prior.beta;
}

// Get relative sizes for tug-of-war figures based on strength
export function getTugOfWarSizes(data: CoinData, prior: BetaParams): { dataSize: number; priorSize: number } {
  const dataStrength = calculateDataStrength(data);
  const priorStrength = calculatePriorStrength(prior);
  
  const maxStrength = Math.max(dataStrength, priorStrength, 1); // Avoid division by zero
  const minSize = 0.6; // Minimum figure size
  const maxSize = 1.8; // Maximum figure size
  
  const dataSize = minSize + (dataStrength / maxStrength) * (maxSize - minSize);
  const priorSize = minSize + (priorStrength / maxStrength) * (maxSize - minSize);
  
  return { dataSize, priorSize };
}