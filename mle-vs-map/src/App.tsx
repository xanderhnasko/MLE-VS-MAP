import React, { useState, useEffect } from 'react';
import './App.css';
import DataInput from './components/DataInput';
import MLESection from './components/MLESection';
import MAPSection from './components/MAPSection';
import { AppState } from './types';
import { 
  calculateMLE, 
  calculateMAP, 
  generateLikelihoodData, 
  generatePriorData, 
  generatePosteriorData,
  normalizeData 
} from './utils/calculations';

function App() {
  const [state, setState] = useState<AppState>({
    heads: 10,
    tails: 2,
    alpha: 2,
    beta: 2,
    mleEstimate: 0,
    mapEstimate: 0,
    likelihoodData: [],
    priorData: [],
    posteriorData: []
  });

  // Update computed values when data or prior parameters change
  useEffect(() => {
    const { heads, tails, alpha, beta } = state;
    
    // Calculate estimates
    const mleEstimate = calculateMLE(heads, tails);
    const mapEstimate = calculateMAP(heads, tails, alpha, beta);
    
    // Generate distribution data
    const likelihoodData = normalizeData(generateLikelihoodData(heads, tails));
    const priorData = normalizeData(generatePriorData(alpha, beta));
    const posteriorData = normalizeData(generatePosteriorData(heads, tails, alpha, beta));
    
    setState(prev => ({
      ...prev,
      mleEstimate,
      mapEstimate,
      likelihoodData,
      priorData,
      posteriorData
    }));
  }, [state.heads, state.tails, state.alpha, state.beta]);

  const updateData = (heads: number, tails: number) => {
    setState(prev => ({ ...prev, heads, tails }));
  };

  const updatePrior = (alpha: number, beta: number) => {
    setState(prev => ({ ...prev, alpha, beta }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MLE vs MAP: Coin Flip Estimation
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Interactive demonstration of Maximum Likelihood Estimation (MLE) vs Maximum A Posteriori (MAP) 
            estimation using coin flip examples. See how prior knowledge influences parameter estimation.
          </p>
        </header>

        {/* Data Input Section */}
        <DataInput 
          heads={state.heads}
          tails={state.tails}
          onDataChange={updateData}
        />

        {/* MLE Section */}
        <MLESection 
          heads={state.heads}
          tails={state.tails}
          mleEstimate={state.mleEstimate}
          likelihoodData={state.likelihoodData}
        />

        {/* MAP Section */}
        <MAPSection 
          heads={state.heads}
          tails={state.tails}
          alpha={state.alpha}
          beta={state.beta}
          mapEstimate={state.mapEstimate}
          priorData={state.priorData}
          likelihoodData={state.likelihoodData}
          posteriorData={state.posteriorData}
          onPriorChange={updatePrior}
        />
      </div>
    </div>
  );
}

export default App;
