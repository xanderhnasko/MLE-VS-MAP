import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceDot } from 'recharts';
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
          <p className="text-sm">P(HEADS) = {Number(label).toFixed(3)}</p>
          <p className="text-sm text-red-600">
            Likelihood: {payload[0].value.toFixed(3)}
          </p>
        </div>
      );
    }
    return null;
  };


  return (
    <Card className="border-transparent">
      <CardHeader>
        <CardTitle>1. Understanding Likelihood</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Intuitive Explanation Section */}
        <div className="mb-6 p-4 bg-muted/30 rounded-lg justify-center">
          <p className="text-sm text-muted-foreground mb-3 text-center">
            <strong>p</strong> is the unknown probability of flipping heads. The likelihood function shows how likely each possible value of <strong>p</strong> is, given our observed data.
          </p>
          
          {/* Mathematical Equation */}
          <div className="bg-background p-3 rounded border border-transparent flex justify-center">
            <div className="text-base flex flex-wrap items-center gap-2 justify-center">
              <span className="font-mono">L(p) = </span>
              <span className="font-mono">
                <span className="inline-flex items-center">
                  (
                  <span className="inline-flex flex-col text-xs leading-none mx-1">
                    <span>n</span>
                    <span>k</span>
                  </span>
                  )
                </span>
                p<sup>k</sup>(1-p)<sup>n-k</sup>
              </span>
              <span className="font-mono">∝ p<sup>k</sup>(1-p)<sup>n-k</sup></span>
              {total > 0 && (
                <>
                  <span className="font-mono">= </span>
                  <span className="font-mono">
                    p<sup className="text-red-600 font-semibold">{coinData.heads}</sup>
                    (1-p)<sup className="text-blue-600 font-semibold">{coinData.tails}</sup>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {total === 0 ? (
          <div className="h-96 flex items-center justify-center text-muted-foreground">
            Enter some coin flip data to see the likelihood function
          </div>
        ) : (
          <div className="relative">
            {/* Chart */}
            <div className="h-96" style={{ outline: 'none' }} tabIndex={-1}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={chartData}
                  margin={{ top: 20, right: 40, left: 40, bottom: 80 }}
                  style={{ outline: 'none' }}
                >
                  <XAxis 
                    dataKey="theta" 
                    type="number"
                    scale="linear"
                    domain={[0, 1]}
                    ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]}
                    tickFormatter={(value) => value.toFixed(1)}
                    label={{ value: 'P(HEADS)', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    domain={[0, 'dataMax + 0.1']}
                    label={{ value: 'Density', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    verticalAlign="bottom"
                    align="center"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="likelihood" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={false}
                    name="Likelihood"
                  />
                  {/* Simple MLE dot */}
                  <ReferenceDot 
                    x={mle} 
                    y={mleData.likelihood}
                    r={6}
                    fill="#ef4444"
                    stroke="#ef4444"
                    strokeWidth={2}
                    label={{ 
                      value: `MLE = ${mle.toFixed(3)}`, 
                      position: 'top',
                      style: { fill: '#ef4444', fontSize: '12px', fontWeight: 'bold' }
                    }}
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