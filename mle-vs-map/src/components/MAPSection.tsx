import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Point } from '../types';
import { createMAPChartData, formatProbability } from '../utils/chartHelpers';
import PriorControls from './PriorControls';
import TugOfWarVisualization from './TugOfWarVisualization';

interface MAPSectionProps {
  heads: number;
  tails: number;
  alpha: number;
  beta: number;
  mapEstimate: number;
  priorData: Point[];
  likelihoodData: Point[];
  posteriorData: Point[];
  onPriorChange: (alpha: number, beta: number) => void;
}

const MAPSection: React.FC<MAPSectionProps> = ({
  heads,
  tails,
  alpha,
  beta,
  mapEstimate,
  priorData,
  likelihoodData,
  posteriorData,
  onPriorChange
}) => {
  const totalFlips = heads + tails;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Maximum A Posteriori (MAP) Estimation
      </h2>
      
      <p className="text-gray-600 mb-6">
        MAP finds the parameter value that maximizes the posterior probability, 
        which combines our prior beliefs with the observed data using Bayes' theorem.
      </p>

      {/* Prior Controls */}
      <PriorControls 
        alpha={alpha}
        beta={beta}
        onPriorChange={onPriorChange}
      />

      {/* Tug of War Visualization */}
      <TugOfWarVisualization
        priorData={priorData}
        likelihoodData={likelihoodData}
        posteriorData={posteriorData}
        alpha={alpha}
        beta={beta}
        heads={heads}
        tails={tails}
      />

      {/* MAP Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-green-900 mb-2">MAP Estimate</h3>
          <div className="text-3xl font-bold text-green-600">
            {formatProbability(mapEstimate)}
          </div>
          <p className="text-sm text-green-700 mt-2">
            Maximum a posteriori estimate incorporating prior knowledge
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-purple-900 mb-2">Prior Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Prior mean:</span>
              <span className="font-medium">
                {formatProbability(alpha / (alpha + beta))}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Prior strength:</span>
              <span className="font-medium">{alpha + beta}</span>
            </div>
            <div className="flex justify-between">
              <span>Data strength:</span>
              <span className="font-medium">{totalFlips}</span>
            </div>
            <div className="flex justify-between">
              <span>Posterior strength:</span>
              <span className="font-medium">{totalFlips + alpha + beta}</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAP Formula */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
        <h3 className="text-lg font-medium text-yellow-900 mb-2">MAP Formula</h3>
        <p className="text-sm text-yellow-800">
          For Beta prior and binomial likelihood, MAP = (heads + α - 1) / (total + α + β - 2)
        </p>
        <p className="text-sm text-yellow-800 mt-1">
          MAP = ({heads} + {alpha} - 1) / ({totalFlips} + {alpha} + {beta} - 2) = {mapEstimate.toFixed(3)}
        </p>
      </div>

      {/* Comparison */}
      <div className="bg-gray-50 rounded-lg p-4 mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">MLE vs MAP Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatProbability(heads / totalFlips)}
            </div>
            <div className="text-sm text-gray-600">MLE (Data Only)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatProbability(mapEstimate)}
            </div>
            <div className="text-sm text-gray-600">MAP (Prior + Data)</div>
          </div>
        </div>
        <div className="text-center mt-2 text-sm text-gray-600">
          Difference: {Math.abs((heads / totalFlips) - mapEstimate).toFixed(3)}
        </div>
      </div>
    </div>
  );
};

export default MAPSection; 