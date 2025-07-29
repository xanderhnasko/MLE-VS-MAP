import React from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { CoinData, BetaParams } from './math-utils';

interface InputControlsProps {
  coinData: CoinData;
  onCoinDataChange: (data: CoinData) => void;
  priorParams: BetaParams;
  onPriorParamsChange: (params: BetaParams) => void;
}

export function InputControls({
  coinData,
  onCoinDataChange,
  priorParams,
  onPriorParamsChange
}: InputControlsProps) {
  const handleHeadsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const heads = Math.max(0, parseInt(e.target.value) || 0);
    onCoinDataChange({ ...coinData, heads });
  };

  const handleTailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tails = Math.max(0, parseInt(e.target.value) || 0);
    onCoinDataChange({ ...coinData, tails });
  };

  const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const alpha = Math.max(1, parseInt(e.target.value) || 1);
    onPriorParamsChange({ ...priorParams, alpha });
  };

  const handleBetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const beta = Math.max(1, parseInt(e.target.value) || 1);
    onPriorParamsChange({ ...priorParams, beta });
  };

  const total = coinData.heads + coinData.tails;

  return (
    <div className="py-4">
      <div className="flex flex-wrap items-center gap-6">
        {/* Coin Flip Data Section */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">Coin Data:</span>
          <div className="flex items-center gap-2">
            <Label htmlFor="heads" className="text-sm text-red-600 font-semibold">Heads</Label>
            <Input
              id="heads"
              type="number"
              min="0"
              value={coinData.heads}
              onChange={handleHeadsChange}
              className="w-16 h-8 text-sm text-red-600 font-semibold"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="tails" className="text-sm text-blue-600 font-semibold">Tails</Label>
            <Input
              id="tails"
              type="number"
              min="0"
              value={coinData.tails}
              onChange={handleTailsChange}
              className="w-16 h-8 text-sm text-blue-600 font-semibold"
            />
          </div>
          {total > 0 && (
            <div className="text-xs text-muted-foreground">
              ({total} flips, <span className="text-red-600 font-semibold">{(coinData.heads / total).toFixed(3)}</span> heads)
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-border"></div>

        {/* Prior Beliefs Section */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">Prior:</span>
          <div className="flex items-center gap-2">
            <Label htmlFor="alpha" className="text-sm text-orange-500 font-semibold">α</Label>
            <Input
              id="alpha"
              type="number"
              min="1"
              step="1"
              value={priorParams.alpha}
              onChange={handleAlphaChange}
              className="w-16 h-8 text-sm text-orange-500 font-semibold"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="beta" className="text-sm text-green-600 font-semibold">β</Label>
            <Input
              id="beta"
              type="number"
              min="1"
              step="1"
              value={priorParams.beta}
              onChange={handleBetaChange}
              className="w-16 h-8 text-sm text-green-600 font-semibold"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            (mean: {(priorParams.alpha / (priorParams.alpha + priorParams.beta)).toFixed(3)}, 
             strength: <span className="text-orange-500 font-semibold">{priorParams.alpha}</span> + <span className="text-green-600 font-semibold">{priorParams.beta}</span> = {(priorParams.alpha + priorParams.beta)})
          </div>
        </div>
      </div>
    </div>
  );
}