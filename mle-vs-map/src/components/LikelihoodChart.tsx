import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CoinData, binomialLikelihood, calculateMLE, generatePlotPoints, normalizeValues } from './math-utils';

interface LikelihoodChartProps {
  coinData: CoinData;
}

export function LikelihoodChart({ coinData }: LikelihoodChartProps) {
  const total = coinData.heads + coinData.tails;
  
  // Generate likelihood data
  const thetaValues = generatePlotPoints(0.01, 0.99, 200);
  const likelihoodValues = thetaValues.map(theta => 
    binomialLikelihood(theta, coinData.heads, coinData.tails)
  );
  
  // Normalize for better visualization
  const normalizedLikelihood = normalizeValues(likelihoodValues);
  
  const chartData = thetaValues.map((theta, i) => ({
    theta: theta,
    likelihood: normalizedLikelihood[i]
  }));

  const mle = calculateMLE(coinData);
  const mleData = {
    theta: mle,
    likelihood: normalizedLikelihood[thetaValues.findIndex(t => Math.abs(t - mle) === Math.min(...thetaValues.map(t => Math.abs(t - mle))))]
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-2 shadow-md">
          <p className="text-sm">θ = {Number(label).toFixed(3)}</p>
          <p className="text-sm text-red-600">
            Likelihood: {payload[0].value.toFixed(3)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate position for MLE label as percentage
  const mlePosition = `${(mle * 100)}%`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>1. Understanding Likelihood</CardTitle>
        <p className="text-sm text-muted-foreground">
          How likely is each possible coin bias θ given the observed data?
        </p>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="h-96 flex items-center justify-center text-muted-foreground">
            Enter some coin flip data to see the likelihood function
          </div>
        ) : (
          <div className="relative">
            {/* MLE label positioned above the chart */}
            <div className="absolute top-0 left-0 right-0 h-8 pointer-events-none z-10">
              <div className="relative h-full" style={{ marginLeft: '40px', marginRight: '40px' }}>
                <div 
                  className="absolute transform -translate-x-1/2 text-sm font-semibold text-orange-500"
                  style={{ left: mlePosition, top: '5px' }}
                >
                  p̂_MLE = {mle.toFixed(3)}
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-96 mt-8">
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
                  <Line 
                    type="monotone" 
                    dataKey="likelihood" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={false}
                    name="Likelihood"
                  />
                  <ReferenceDot 
                    x={mle} 
                    y={mleData.likelihood}
                    r={6}
                    fill="#f97316"
                    stroke="#f97316"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}