import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Point } from '../types';
import { convertToChartData } from '../utils/chartHelpers';

interface TugOfWarVisualizationProps {
  priorData: Point[];
  likelihoodData: Point[];
  posteriorData: Point[];
  alpha: number;
  beta: number;
  heads: number;
  tails: number;
}

const TugOfWarVisualization: React.FC<TugOfWarVisualizationProps> = ({
  priorData,
  likelihoodData,
  posteriorData,
  alpha,
  beta,
  heads,
  tails
}) => {
  const priorChartData = convertToChartData(priorData);
  const likelihoodChartData = convertToChartData(likelihoodData);
  const posteriorChartData = convertToChartData(posteriorData);

  const priorMean = alpha / (alpha + beta);
  const dataMean = heads + tails > 0 ? heads / (heads + tails) : 0.5;
  const posteriorMean = (heads + alpha) / (heads + tails + alpha + beta);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Tug of War: Prior vs Data</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prior Distribution */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-md font-medium text-blue-900 mb-2">Prior Belief</h4>
          <p className="text-xs text-blue-700 mb-3">
            Your initial belief about the coin's fairness
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart data={priorChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E0" />
              <XAxis 
                dataKey="x" 
                domain={[0, 1]}
                tickFormatter={(value) => (value * 100).toFixed(0) + '%'}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                dataKey="y"
                tick={{ fontSize: 10 }}
                hide
              />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(3), 'Prior']}
                labelFormatter={(label: number) => `p = ${(label * 100).toFixed(1)}%`}
              />
              <Scatter 
                dataKey="y" 
                fill="#3B82F6" 
                name="Prior"
              />
            </ScatterChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <div className="text-sm font-medium text-blue-900">
              Mean: {(priorMean * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-blue-700">
              Strength: {(alpha + beta).toFixed(1)}
            </div>
          </div>
        </div>

        {/* Likelihood Function */}
        <div className="bg-red-50 rounded-lg p-4">
          <h4 className="text-md font-medium text-red-900 mb-2">Data Evidence</h4>
          <p className="text-xs text-red-700 mb-3">
            What the observed data tells us
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart data={likelihoodChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#FED7D7" />
              <XAxis 
                dataKey="x" 
                domain={[0, 1]}
                tickFormatter={(value) => (value * 100).toFixed(0) + '%'}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                dataKey="y"
                tick={{ fontSize: 10 }}
                hide
              />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(3), 'Likelihood']}
                labelFormatter={(label: number) => `p = ${(label * 100).toFixed(1)}%`}
              />
              <Scatter 
                dataKey="y" 
                fill="#EF4444" 
                name="Likelihood"
              />
            </ScatterChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <div className="text-sm font-medium text-red-900">
              MLE: {(dataMean * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-red-700">
              Flips: {heads + tails}
            </div>
          </div>
        </div>

        {/* Posterior Distribution */}
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="text-md font-medium text-purple-900 mb-2">Posterior (Combined)</h4>
          <p className="text-xs text-purple-700 mb-3">
            Prior belief updated with data
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart data={posteriorChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9D8FD" />
              <XAxis 
                dataKey="x" 
                domain={[0, 1]}
                tickFormatter={(value) => (value * 100).toFixed(0) + '%'}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                dataKey="y"
                tick={{ fontSize: 10 }}
                hide
              />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(3), 'Posterior']}
                labelFormatter={(label: number) => `p = ${(label * 100).toFixed(1)}%`}
              />
              <Scatter 
                dataKey="y" 
                fill="#8B5CF6" 
                name="Posterior"
              />
            </ScatterChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <div className="text-sm font-medium text-purple-900">
              MAP: {(posteriorMean * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-purple-700">
              Total: {(heads + tails + alpha + beta).toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Force Arrows */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="bg-blue-500 text-white px-2 py-1 rounded">Prior</span>
            <svg className="w-6 h-6 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex items-center">
            <span className="bg-red-500 text-white px-2 py-1 rounded">Data</span>
            <svg className="w-6 h-6 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="bg-purple-500 text-white px-2 py-1 rounded">Posterior</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          The posterior is a weighted average of prior belief and data evidence
        </p>
      </div>
    </div>
  );
};

export default TugOfWarVisualization; 