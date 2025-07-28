import React, { useState } from 'react';

interface DataInputProps {
  heads: number;
  tails: number;
  onDataChange: (heads: number, tails: number) => void;
}

const DataInput: React.FC<DataInputProps> = ({ heads, tails, onDataChange }) => {
  const [localHeads, setLocalHeads] = useState(heads.toString());
  const [localTails, setLocalTails] = useState(tails.toString());

  const handleHeadsChange = (value: string) => {
    setLocalHeads(value);
    const numHeads = parseInt(value) || 0;
    if (numHeads >= 0) {
      onDataChange(numHeads, parseInt(localTails) || 0);
    }
  };

  const handleTailsChange = (value: string) => {
    setLocalTails(value);
    const numTails = parseInt(value) || 0;
    if (numTails >= 0) {
      onDataChange(parseInt(localHeads) || 0, numTails);
    }
  };

  const simulateFlip = () => {
    const isHeads = Math.random() < 0.5;
    const newHeads = heads + (isHeads ? 1 : 0);
    const newTails = tails + (isHeads ? 0 : 1);
    
    setLocalHeads(newHeads.toString());
    setLocalTails(newTails.toString());
    onDataChange(newHeads, newTails);
  };

  const resetData = () => {
    setLocalHeads('0');
    setLocalTails('0');
    onDataChange(0, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Coin Flip Data
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label htmlFor="heads" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Heads
          </label>
          <input
            type="number"
            id="heads"
            min="0"
            value={localHeads}
            onChange={(e) => handleHeadsChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="tails" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Tails
          </label>
          <input
            type="number"
            id="tails"
            min="0"
            value={localTails}
            onChange={(e) => handleTailsChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={simulateFlip}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Simulate Flip
          </button>
          <button
            onClick={resetData}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        Total flips: {heads + tails} | 
        Current estimate: {heads + tails > 0 ? ((heads / (heads + tails)) * 100).toFixed(1) + '%' : 'N/A'}
      </div>
    </div>
  );
};

export default DataInput; 