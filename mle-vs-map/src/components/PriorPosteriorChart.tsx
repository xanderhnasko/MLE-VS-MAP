import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CoinData, BetaParams, betaPDF, binomialLikelihood, calculateMLE, calculateMAP, getPosteriorParams, generatePlotPoints, normalizeValues } from './math-utils';

interface PriorPosteriorChartProps {
  coinData: CoinData;
  priorParams: BetaParams;
}

export function PriorPosteriorChart({ coinData, priorParams }: PriorPosteriorChartProps) {
  const total = coinData.heads + coinData.tails;
  const posteriorParams = getPosteriorParams(coinData, priorParams);
  
  // Generate data points
  const thetaValues = generatePlotPoints(0.01, 0.99, 200);
  
  // Calculate distributions
  const priorValues = thetaValues.map(theta => betaPDF(theta, priorParams.alpha, priorParams.beta));
  const likelihoodValues = total > 0 
    ? thetaValues.map(theta => binomialLikelihood(theta, coinData.heads, coinData.tails))
    : thetaValues.map(() => 0);
  const posteriorValues = thetaValues.map(theta => betaPDF(theta, posteriorParams.alpha, posteriorParams.beta));
  
  // Normalize for visualization
  const normalizedPrior = normalizeValues(priorValues);
  const normalizedLikelihood = normalizeValues(likelihoodValues);
  const normalizedPosterior = normalizeValues(posteriorValues);
  
  const chartData = thetaValues.map((theta, i) => ({
    theta: theta,
    prior: normalizedPrior[i],
    likelihood: normalizedLikelihood[i],
    posterior: normalizedPosterior[i]
  }));

  const mle = total > 0 ? calculateMLE(coinData) : null;
  const map = calculateMAP(coinData, priorParams);

  // Find peak positions and their densities
  const priorPeakIndex = normalizedPrior.indexOf(Math.max(...normalizedPrior));
  const priorPeak = {
    theta: thetaValues[priorPeakIndex],
    density: normalizedPrior[priorPeakIndex]
  };

  // MLE peak on likelihood curve
  const mlePeak = mle !== null ? {
    theta: mle,
    density: normalizedLikelihood[thetaValues.findIndex(t => Math.abs(t - mle) === Math.min(...thetaValues.map(t => Math.abs(t - mle))))]
  } : null;

  // MAP peak on posterior curve
  const mapIndex = thetaValues.findIndex(t => Math.abs(t - map) === Math.min(...thetaValues.map(t => Math.abs(t - map))));
  const mapPeak = {
    theta: map,
    density: normalizedPosterior[mapIndex]
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-2 shadow-md">
          <p className="text-sm">θ = {Number(label).toFixed(3)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(3)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>2. Prior, Likelihood, and Posterior</CardTitle>
        <p className="text-sm text-muted-foreground">
          How the prior belief combines with data likelihood to form the posterior distribution
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData}
              margin={{ top: 20, right: 40, left: 40, bottom: 80 }}
            >
              <XAxis 
                dataKey="theta" 
                type="number"
                scale="linear"
                domain={[0, 1]}
                tickFormatter={(value) => value.toFixed(1)}
                label={{ value: 'P(HEADS)', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                domain={[0, 'dataMax + 0.1']}
                label={{ value: 'Density', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '15px' }} />
              
              {/* Prior */}
              <Line 
                type="monotone" 
                dataKey="prior" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
                name="Prior"
              />
              
              {/* Likelihood - now solid red */}
              {total > 0 && (
                <Line 
                  type="monotone" 
                  dataKey="likelihood" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={false}
                  name="Likelihood"
                />
              )}
              
              {/* Posterior */}
              <Line 
                type="monotone" 
                dataKey="posterior" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={false}
                name="Posterior"
              />
              
              {/* Prior peak point */}
              <ReferenceDot 
                x={priorPeak.theta} 
                y={priorPeak.density}
                r={6}
                fill="#3b82f6"
                stroke="#3b82f6"
                strokeWidth={2}
              />
              
              {/* MLE peak point on likelihood curve */}
              {mle !== null && mlePeak && (
                <ReferenceDot 
                  x={mlePeak.theta} 
                  y={mlePeak.density}
                  r={6}
                  fill="#ef4444"
                  stroke="#ef4444"
                  strokeWidth={2}
                  label={{ 
                    value: `MLE = ${mle.toFixed(3)}`, 
                    position: 'top',
                    style: { fill: '#ef4444', fontSize: '12px' }
                  }}
                />
              )}
              
              {/* MAP peak point on posterior curve */}
              <ReferenceDot 
                x={mapPeak.theta} 
                y={mapPeak.density}
                r={6}
                fill="#10b981"
                stroke="#10b981"
                strokeWidth={2}
                label={{ 
                  value: `MAP = ${map.toFixed(3)}`, 
                  position: 'top',
                  style: { fill: '#10b981', fontSize: '12px' }
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}