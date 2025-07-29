import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceDot } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CoinData, BetaParams, betaPDF, binomialLikelihood, calculateMLE, calculateMAP, getPosteriorParams, generatePlotPoints, normalizeValues } from './math-utils';

interface PriorPosteriorChartProps {
  coinData: CoinData;
  priorParams: BetaParams;
}

export function PriorPosteriorChart({ coinData, priorParams }: PriorPosteriorChartProps) {
  const total = coinData.heads + coinData.tails;
  const posteriorParams = getPosteriorParams(coinData, priorParams);
  
  // Calculate strengths for dynamic sizing
  const dataStrength = total; // Number of coin flips
  const priorStrength = priorParams.alpha + priorParams.beta; // Prior pseudo-observations
  
  // Calculate relative sizes (normalize to reasonable range)
  const maxStrength = Math.max(dataStrength, priorStrength);
  const minSize = 0.7; // Minimum figure size
  const maxSize = 1.5; // Maximum figure size
  
  const dataSize = maxStrength > 0 
    ? minSize + (dataStrength / maxStrength) * (maxSize - minSize)
    : minSize;
  const priorSize = maxStrength > 0 
    ? minSize + (priorStrength / maxStrength) * (maxSize - minSize) 
    : minSize;
  
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

  // Helper function to create a stick figure with dynamic sizing and muscularity
  const createStickFigure = (cx: number, cy: number, size: number, color: string, faceRight: boolean, label: string) => {
    const armX = faceRight ? cx + (12 * size) : cx - (12 * size);
    
    // Muscle thickness increases with size (for stronger figures)
    const muscleThickness = Math.max(1.5, size * 1.8);
    const baseThickness = 1.5;
    
    // Head size scales with overall size
    const headRadius = 3 * size;
    
    // Body and limb scaling
    const bodyLength = 14 * size;
    const armLength = 6 * size;
    const legLength = 6 * size;
    
    return (
      <g>
        {/* Head */}
        <circle 
          cx={cx} 
          cy={cy - 25 * size} 
          r={headRadius} 
          fill="none" 
          stroke={color} 
          strokeWidth={muscleThickness}
        />
        
        {/* Body - thicker for stronger figures */}
        <line 
          x1={cx} 
          y1={cy - (22 * size)} 
          x2={cx} 
          y2={cy - (8 * size)} 
          stroke={color} 
          strokeWidth={muscleThickness}
        />
        
        {/* Arms - muscular appearance */}
        <line 
          x1={cx} 
          y1={cy - (19 * size)} 
          x2={armX} 
          y2={cy - (22 * size)} 
          stroke={color} 
          strokeWidth={muscleThickness}
        />
        
        {/* Legs - thicker for stronger figures */}
        <line 
          x1={cx} 
          y1={cy - (8 * size)} 
          x2={cx - (3 * size)} 
          y2={cy - (2 * size)} 
          stroke={color} 
          strokeWidth={muscleThickness}
        />
        <line 
          x1={cx} 
          y1={cy - (8 * size)} 
          x2={cx + (3 * size)} 
          y2={cy - (2 * size)} 
          stroke={color} 
          strokeWidth={muscleThickness}
        />
        
        {/* Label */}
        <text 
          x={cx} 
          y={cy - (32 * size)} 
          textAnchor="middle" 
          fontSize={10 * size} 
          fill={color} 
          fontWeight="bold"
        >
          {label}
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-2 shadow-md">
          <p className="text-sm">P(HEADS) = {Number(label).toFixed(3)}</p>
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
    <Card className="border-transparent">
      <CardHeader>
        <CardTitle>2. Prior, Likelihood, and Posterior</CardTitle>
      </CardHeader>
      <CardContent>
        {/* MAP/Bayes Theorem Explanation Section */}
        <div className="mb-6 p-4 bg-muted/30 rounded-lg justify-center">
          <p className="text-sm text-muted-foreground mb-3 text-center">
            By Bayes' theorem...
          </p>
          
          {/* Mathematical Equation */}
          <div className="bg-background p-3 rounded border border-transparent flex justify-center">
            <div className="text-base flex flex-wrap items-center gap-2">
              <span className="font-mono">P(p | x) ∝ L(p) × P(p) = </span>
              <span className="font-mono">
                    p<sup className="text-red-600 font-semibold">{coinData.heads}</sup>
                    (1-p)<sup className="text-blue-600 font-semibold">{coinData.tails}</sup>
                  </span>
              <span className="font-mono">×</span>
              <span className="font-mono">
                p<sup><span className="text-orange-500 font-semibold">α</span>-1</sup>(1-p)<sup><span className="text-green-600 font-semibold">β</span>-1</sup>
              </span>
             
              {total > 0 && (
                <>
                  <span className="font-mono">
                    ∼ Beta(
                    <span className="text-red-600 font-semibold">{coinData.heads}</span> + <span className="text-orange-500 font-semibold">{priorParams.alpha}</span>, 
                    <span className="text-blue-600 font-semibold">{coinData.tails}</span> + <span className="text-green-600 font-semibold">{priorParams.beta}</span>
                    )
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="h-[600px]" style={{ outline: 'none' }} tabIndex={-1}>
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
              
              
              
              
              {/* Custom figure shapes using ReferenceDot */}
              
              
              {/* Prior stick figure */}
              <ReferenceDot 
                x={priorPeak.theta} 
                y={priorPeak.density}
                shape={(props: any) => {
                  const { cx, cy } = props;
                  // Determine direction: if prior is to the left of MLE, face right; otherwise face left
                  const faceRight = mle !== null && mlePeak ? priorPeak.theta < mlePeak.theta : true;
                  
                  return createStickFigure(
                    cx, 
                    cy, 
                    priorSize, 
                    "#3b82f6", 
                    faceRight, 
                    `Prior = ${priorPeak.theta.toFixed(3)}`
                  );
                }}
              />
              
              {/* MLE stick figure with rope */}
              {mle !== null && mlePeak && (
                <ReferenceDot 
                  x={mlePeak.theta} 
                  y={mlePeak.density}
                  shape={(props: any) => {
                    const { cx, cy } = props;
                    // Face opposite direction from prior for tug-of-war
                    const faceRight = mlePeak.theta < priorPeak.theta; // Face toward prior
                    
                    return (
                      <g>
                        {/* Rope to Prior figure (drawn first, behind MLE figure) */}
                        {(() => {
                          // Calculate Prior position using coordinate transformation from MLE position
                          const deltaTheta = priorPeak.theta - mlePeak.theta;
                          const deltaDensity = priorPeak.density - mlePeak.density;
                          
                          // Use chart dimensions from the margins
                          const plotWidth = 720; // 800 - 40 - 40  
                          const plotHeight = 500; // 600 - 20 - 80
                          
                          const priorScreenX = cx + (deltaTheta * plotWidth);
                          const priorScreenY = cy + (deltaDensity * -plotHeight);
                          
                          // Calculate hand positions
                          const mleHandX = cx + (faceRight ? 12 * dataSize : -12 * dataSize);
                          const mleHandY = cy - (25 * dataSize);
                          
                          const priorFaceRight = priorPeak.theta < mlePeak.theta;
                          const priorHandX = priorScreenX + (priorFaceRight ? 12 * priorSize : -12 * priorSize);
                          const priorHandY = priorScreenY - (25 * priorSize);
                          
                          return (
                            <line
                              x1={mleHandX}
                              y1={mleHandY}
                              x2={priorHandX}
                              y2={priorHandY}
                              stroke="#8B4513"
                              strokeWidth={Math.max(3, (priorSize + dataSize) * 1.5)}
                              strokeLinecap="round"
                            />
                          );
                        })()}
                        
                        {/* MLE stick figure */}
                        {createStickFigure(
                          cx, 
                          cy, 
                          dataSize, 
                          "#ef4444", 
                          faceRight, 
                          `MLE = ${mle.toFixed(3)}`
                        )}
                      </g>
                    );
                  }}
                />
              )}
              
              
              {/* Green dash at MAP position on rope */}
              {mle !== null && mlePeak && (() => {
                // Calculate rope height at MAP position (same as before)
                const mapX = mapPeak.theta;
                const priorX = priorPeak.theta;
                const dataX = mlePeak.theta;
                const priorY = priorPeak.density + (25 * priorSize) / 500;
                const dataY = mlePeak.density + (25 * dataSize) / 500;
                const t = (mapX - priorX) / (dataX - priorX);
                const ropeYAtMap = priorY + t * (dataY - priorY);
                
                return (
                  <ReferenceDot
                    x={mapX}
                    y={ropeYAtMap}
                    shape={(props: any) => {
                      const { cx, cy } = props;
                      return (
                        <line
                          x1={cx}
                          y1={cy}
                          x2={cx}
                          y2={cy + 15} // Hang down 15 pixels
                          stroke="#22c55e"
                          strokeWidth={4}
                          strokeLinecap="round"
                        />
                      );
                    }}
                  />
                );
              })()}
              
              {/* MAP position marker */}
              <ReferenceDot 
                x={mapPeak.theta} 
                y={mapPeak.density}
                r={4}
                fill="#8b5cf6"
                stroke="#8b5cf6"
                strokeWidth={2}
                label={{ 
                  value: `MAP = ${map.toFixed(3)}`, 
                  position: 'top',
                  style: { fill: '#8b5cf6', fontSize: '10px', fontWeight: 'bold' }
                }}
              />
              
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}