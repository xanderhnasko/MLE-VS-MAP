import React, { useState } from 'react';
import { InputControls } from './components/InputControls';
import { LikelihoodChart } from './components/LikelihoodChart';
import { PriorPosteriorChart } from './components/PriorPosteriorChart';
import { CoinData, BetaParams } from './components/math-utils';

export default function App() {
  const [coinData, setCoinData] = useState<CoinData>({ heads: 7, tails: 3 });
  const [priorParams, setPriorParams] = useState<BetaParams>({ alpha: 2, beta: 2 });

  return (
    <div className="min-h-screen bg-background">
      {/* Main header */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl mb-4">MLE vs MAP tug-of-war</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore how Maximum Likelihood Estimation (MLE) and Maximum A Posteriori (MAP) estimation 
            differ when analyzing coin flip data. See how prior beliefs influence your final estimate.
          </p>
        </div>
      </div>

      {/* Sticky input controls */}
      <div className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <InputControls
            coinData={coinData}
            onCoinDataChange={setCoinData}
            priorParams={priorParams}
            onPriorParamsChange={setPriorParams}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Likelihood Chart */}
          <LikelihoodChart coinData={coinData} />

          {/* Prior/Posterior Chart */}
          <PriorPosteriorChart 
            coinData={coinData} 
            priorParams={priorParams}
          />
        </div>
      </div>
    </div>
  );
}