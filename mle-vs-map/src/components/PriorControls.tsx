import React from 'react';

interface PriorControlsProps {
  alpha: number;
  beta: number;
  onPriorChange: (alpha: number, beta: number) => void;
}

const PriorControls: React.FC<PriorControlsProps> = ({ alpha, beta, onPriorChange }) => {
  const handleAlphaChange = (value: number) => {
    onPriorChange(value, beta);
  };

  const handleBetaChange = (value: number) => {
    onPriorChange(alpha, value);
  };

  const priorMean = alpha / (alpha + beta);
  const priorStrength = alpha + beta;

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Prior Distribution Controls</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="alpha" className="block text-sm font-medium text-gray-700 mb-2">
            Alpha (α) Parameter
          </label>
          <input
            type="range"
            id="alpha"
            min="0.1"
            max="10"
            step="0.1"
            value={alpha}
            onChange={(e) => handleAlphaChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.1</span>
            <span className="font-medium">{alpha.toFixed(1)}</span>
            <span>10.0</span>
          </div>
        </div>

        <div>
          <label htmlFor="beta" className="block text-sm font-medium text-gray-700 mb-2">
            Beta (β) Parameter
          </label>
          <input
            type="range"
            id="beta"
            min="0.1"
            max="10"
            step="0.1"
            value={beta}
            onChange={(e) => handleBetaChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.1</span>
            <span className="font-medium">{beta.toFixed(1)}</span>
            <span>10.0</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-sm font-medium text-blue-900">Prior Mean</div>
          <div className="text-lg font-bold text-blue-600">
            {(priorMean * 100).toFixed(1)}%
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="text-sm font-medium text-purple-900">Prior Strength</div>
          <div className="text-lg font-bold text-purple-600">
            {priorStrength.toFixed(1)}
          </div>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-sm font-medium text-gray-900">Prior Shape</div>
          <div className="text-sm text-gray-600">
            {alpha === beta ? 'Symmetric' : alpha > beta ? 'Right-skewed' : 'Left-skewed'}
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Prior interpretation:</strong> You believe the coin has a 
          {(priorMean * 100).toFixed(1)}% chance of landing heads, with a 
          confidence equivalent to {priorStrength.toFixed(1)} observations.
        </p>
      </div>
    </div>
  );
};

export default PriorControls; 