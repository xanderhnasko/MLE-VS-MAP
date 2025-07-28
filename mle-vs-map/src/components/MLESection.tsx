import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter, ScatterChart } from 'recharts';
import { Point } from '../types';
import { createMLEChartData, formatProbability } from '../utils/chartHelpers';

interface MLESectionProps {
  heads: number;
  tails: number;
  mleEstimate: number;
  likelihoodData: Point[];
}

const MLESection: React.FC<MLESectionProps> = ({ heads, tails, mleEstimate, likelihoodData }) => {
  const chartData = createMLEChartData(likelihoodData, mleEstimate);
  const totalFlips = heads + tails;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Maximum Likelihood Estimation (MLE)
      </h2>
      
      <p className="text-gray-600 mb-6">
        MLE finds the parameter value that maximizes the likelihood of observing our data. 
        It's a "pure data" approach that doesn't incorporate any prior beliefs.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Likelihood Function</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="x" 
                domain={[0, 1]}
                tickFormatter={(value) => (value * 100).toFixed(0) + '%'}
                label={{ value: 'Probability of Heads (p)', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                dataKey="y"
                label={{ value: 'Normalized Likelihood', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  value.toFixed(3), 
                  name === 'y' ? 'Likelihood' : 'Probability'
                ]}
                labelFormatter={(label: number) => `p = ${(label * 100).toFixed(1)}%`}
              />
              <Scatter 
                dataKey="y" 
                fill="#EF4444" 
                name="Likelihood"
              />
              {/* MLE Point */}
              {chartData.find(p => p.label === 'MLE') && (
                <Scatter 
                  data={[chartData.find(p => p.label === 'MLE')!]}
                  dataKey="y"
                  fill="#F59E0B"
                  name="MLE"
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-900 mb-2">MLE Estimate</h3>
            <div className="text-3xl font-bold text-blue-600">
              {formatProbability(mleEstimate)}
            </div>
            <p className="text-sm text-blue-700 mt-2">
              Maximum likelihood estimate for the probability of heads
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Data Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total flips:</span>
                <span className="font-medium">{totalFlips}</span>
              </div>
              <div className="flex justify-between">
                <span>Heads:</span>
                <span className="font-medium">{heads}</span>
              </div>
              <div className="flex justify-between">
                <span>Tails:</span>
                <span className="font-medium">{tails}</span>
              </div>
              <div className="flex justify-between">
                <span>Observed proportion:</span>
                <span className="font-medium">
                  {totalFlips > 0 ? formatProbability(heads / totalFlips) : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-yellow-900 mb-2">MLE Formula</h3>
            <p className="text-sm text-yellow-800">
              For binomial data, MLE = heads / (heads + tails)
            </p>
            <p className="text-sm text-yellow-800 mt-1">
              MLE = {heads} / ({heads} + {tails}) = {mleEstimate.toFixed(3)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLESection; 