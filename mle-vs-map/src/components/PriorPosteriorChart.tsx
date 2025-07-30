import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceDot } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CoinData, BetaParams, betaPDF, binomialLikelihood, calculateMLE, calculateMAP, getPosteriorParams, generatePlotPoints, normalizeValues, getTugOfWarSizes } from './math-utils';

interface PriorPosteriorChartProps {
  coinData: CoinData;
  priorParams: BetaParams;
}

export function PriorPosteriorChart({ coinData, priorParams }: PriorPosteriorChartProps) {
  const total = coinData.heads + coinData.tails;
  const posteriorParams = getPosteriorParams(coinData, priorParams);
  
  // Calculate dynamic sizes based on strength
  const { dataSize, priorSize } = getTugOfWarSizes(coinData, priorParams);
  
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

  // Enhanced tug-of-war figure creator with better visual appeal
  const createTugOfWarFigure = (cx: number, cy: number, size: number, color: string, facingRight: boolean, label: string, strength: number) => {
    // Visual parameters that scale with size and strength
    const muscleThickness = Math.max(2, size * 2.2 + strength * 0.1);
    const headRadius = 4 * size + strength * 0.05;
    const armOffset = facingRight ? 15 * size : -15 * size;
    const bodyWidth = 2 * size + strength * 0.02;
    
    // Stance gets wider with more strength (more stable)
    const legSpread = 4 * size + strength * 0.08;
    
    // Lean angle - stronger figures lean more into the pull
    const leanAngle = (strength * 0.5 + size * 2) * (facingRight ? 1 : -1);
    
    return (
      <g>
        
        {/* Head with expression */}
        <circle 
          cx={cx + leanAngle * 0.3} 
          cy={cy - 28 * size} 
          r={headRadius} 
          fill="none" 
          stroke={color} 
          strokeWidth={muscleThickness}
        />
        
        
        {/* Body - leaning with effort */}
        <line 
          x1={cx + leanAngle * 0.3} 
          y1={cy - (24 * size)} 
          x2={cx + leanAngle} 
          y2={cy - (8 * size)} 
          stroke={color} 
          strokeWidth={muscleThickness}
        />
        
        {/* Arms - pulling hard */}
        <line 
          x1={cx + leanAngle * 0.3} 
          y1={cy - (20 * size)} 
          x2={cx + armOffset + leanAngle * 0.7} 
          y2={cy - (18 * size)} 
          stroke={color} 
          strokeWidth={muscleThickness}
        />
        
        {/* Legs - wide stance for stability */}
        <line 
          x1={cx + leanAngle} 
          y1={cy - (8 * size)} 
          x2={cx - legSpread + leanAngle * 0.5} 
          y2={cy - (2 * size)} 
          stroke={color} 
          strokeWidth={muscleThickness}
        />
        <line 
          x1={cx + leanAngle} 
          y1={cy - (8 * size)} 
          x2={cx + legSpread + leanAngle * 0.5} 
          y2={cy - (2 * size)} 
          stroke={color} 
          strokeWidth={muscleThickness}
        />
        
        
        {/* Label with dynamic positioning */}
        <text 
          x={cx} 
          y={cy - (36 * size)} 
          textAnchor="middle" 
          fontSize={Math.min(12, 8 + size * 2)} 
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

        <div className="h-[700px]" style={{ outline: 'none' }} tabIndex={-1}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData}
              margin={{ top: 80, right: 40, left: 40, bottom: 80 }}
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
              
              {/* Enhanced Tug-of-War Visualization */}
              {mle !== null && mlePeak && (
                <>
                  {/* Prior figure */}
                  <ReferenceDot 
                    x={priorPeak.theta} 
                    y={priorPeak.density}
                    shape={(props: any) => {
                      const { cx, cy } = props;
                      const priorStrength = priorParams.alpha + priorParams.beta;
                      const facingRight = priorPeak.theta < mlePeak.theta;
                      
                      return createTugOfWarFigure(
                        cx, 
                        cy, 
                        priorSize, 
                        "#3b82f6", 
                        facingRight, 
                        `Prior`, 
                        priorStrength
                      );
                    }}
                  />
                  
                  {/* Data/Likelihood figure */}
                  <ReferenceDot 
                    x={mlePeak.theta} 
                    y={mlePeak.density}
                    shape={(props: any) => {
                      const { cx, cy } = props;
                      const dataStrength = coinData.heads + coinData.tails;
                      const facingRight = mlePeak.theta < priorPeak.theta;
                      
                      return createTugOfWarFigure(
                        cx, 
                        cy, 
                        dataSize, 
                        "#ef4444", 
                        facingRight, 
                        `Data`, 
                        dataStrength
                      );
                    }}
                  />
                  
                  {/* Dynamic Rope with proper alignment */}
                  <ReferenceDot 
                    x={(priorPeak.theta + mlePeak.theta) / 2} 
                    y={(priorPeak.density + mlePeak.density) / 2}
                    shape={(props: any) => {
                      // Use Recharts coordinate transformation
                      const xScale = props.cx / ((priorPeak.theta + mlePeak.theta) / 2);
                      const yScale = props.cy / ((priorPeak.density + mlePeak.density) / 2);
                      
                      const priorX = priorPeak.theta * xScale;
                      const priorY = priorPeak.density * yScale;
                      const dataX = mlePeak.theta * xScale;
                      const dataY = mlePeak.density * yScale;
                      
                      // Hand positions based on figure orientation
                      const priorFacingRight = priorPeak.theta < mlePeak.theta;
                      const dataFacingRight = mlePeak.theta < priorPeak.theta;
                      
                      const priorHandX = priorX + (priorFacingRight ? 15 * priorSize : -15 * priorSize);
                      const priorHandY = priorY - (18 * priorSize);
                      const dataHandX = dataX + (dataFacingRight ? 15 * dataSize : -15 * dataSize);
                      const dataHandY = dataY - (18 * dataSize);
                      
                      // Constant rope thickness
                      const ropeThickness = 6;
                      
                      return (
                        <g>
                          {/* Main rope */}
                          <line
                            x1={priorHandX}
                            y1={priorHandY}
                            x2={dataHandX}
                            y2={dataHandY}
                            stroke="#8B4513"
                            strokeWidth={ropeThickness}
                            strokeLinecap="round"
                          />
                          
                          {/* Rope texture lines */}
                          <line
                            x1={priorHandX + (dataHandX - priorHandX) * 0.2}
                            y1={priorHandY + (dataHandY - priorHandY) * 0.2}
                            x2={priorHandX + (dataHandX - priorHandX) * 0.8}
                            y2={priorHandY + (dataHandY - priorHandY) * 0.8}
                            stroke="#654321"
                            strokeWidth={1}
                            opacity={0.6}
                          />
                        </g>
                      );
                    }}
                  />
                  
                  {/* MAP position - green dash on rope */}
                  <ReferenceDot
                    x={map}
                    y={(priorPeak.density + mlePeak.density) / 2}
                    shape={(props: any) => {
                      const { cx } = props;
                      
                      // Calculate exact position on rope line
                      const t = (map - priorPeak.theta) / (mlePeak.theta - priorPeak.theta);
                      const xScale = props.cx / ((priorPeak.theta + mlePeak.theta) / 2);
                      const yScale = props.cy / ((priorPeak.density + mlePeak.density) / 2);
                      
                      const priorY = priorPeak.density * yScale;
                      const dataY = mlePeak.density * yScale;
                      
                      const priorHandY = priorY - (18 * priorSize);
                      const dataHandY = dataY - (18 * dataSize);
                      
                      // Calculate MAP position on the rope line
                      const mapRopeY = priorHandY + t * (dataHandY - priorHandY);
                      
                      return (
                        <g>
                          {/* Simple vertical green dash on rope */}
                          <line
                            x1={cx}
                            y1={mapRopeY - 8}
                            x2={cx}
                            y2={mapRopeY + 8}
                            stroke="#22c55e"
                            strokeWidth={4}
                            strokeLinecap="round"
                          />
                        </g>
                      );
                    }}
                  />
                </>
              )}
              
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