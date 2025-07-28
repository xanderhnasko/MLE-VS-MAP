import { Point } from '../types';

// Beta distribution PDF
export function betaPDF(x: number, alpha: number, beta: number): number {
  if (x <= 0 || x >= 1) return 0;
  
  // Beta function B(α, β) = Γ(α)Γ(β) / Γ(α + β)
  const betaFunction = (a: number, b: number): number => {
    return gamma(a) * gamma(b) / gamma(a + b);
  };
  
  return Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1) / betaFunction(alpha, beta);
}

// Gamma function approximation (Lanczos approximation)
function gamma(z: number): number {
  const p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
  ];
  
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  }
  
  z -= 1;
  let x = p[0];
  for (let i = 1; i < p.length; i++) {
    x += p[i] / (z + i);
  }
  
  const t = z + 7.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

// Binomial likelihood for coin flips
export function binomialLikelihood(p: number, heads: number, tails: number): number {
  if (p <= 0 || p >= 1) return 0;
  const n = heads + tails;
  if (n === 0) return 1;
  
  // Binomial coefficient C(n, heads)
  const binomialCoeff = (n: number, k: number): number => {
    if (k > n - k) k = n - k;
    let result = 1;
    for (let i = 0; i < k; i++) {
      result = result * (n - i) / (i + 1);
    }
    return result;
  };
  
  return binomialCoeff(n, heads) * Math.pow(p, heads) * Math.pow(1 - p, tails);
}

// Generate plot data points for a function
export function generateDistributionData(
  fn: (x: number) => number, 
  range: [number, number], 
  points: number = 100
): Point[] {
  const [min, max] = range;
  const step = (max - min) / (points - 1);
  const data: Point[] = [];
  
  for (let i = 0; i < points; i++) {
    const x = min + i * step;
    const y = fn(x);
    if (isFinite(y) && y >= 0) {
      data.push({ x, y });
    }
  }
  
  return data;
} 