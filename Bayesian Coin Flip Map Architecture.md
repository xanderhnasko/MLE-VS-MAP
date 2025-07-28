# MLE vs MAP Coin Flip Webapp - Architecture Summary

## Project Overview
Interactive educational webapp demonstrating Maximum Likelihood Estimation (MLE) vs Maximum A Posteriori (MAP) estimation using coin flip examples with "tug of war" visualization metaphor.

## Technical Stack
- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Charting**: Recharts (React-native charting library)
- **Math**: Custom JavaScript functions for Beta/Binomial distributions
- **Deployment**: Vercel (progressive: local → GitHub Pages → Vercel)

## Application Structure

### Component Hierarchy
```
App
├── Header (title, description)
├── DataInput (heads/tails inputs, flip simulator)
├── MLESection
│   ├── LikelihoodChart
│   └── MLEResults
└── MAPSection
    ├── PriorControls (α, β sliders)
    ├── TugOfWarVisualization
    │   ├── PriorChart
    │   ├── LikelihoodChart  
    │   ├── PosteriorChart
    │   └── ForceArrows
    └── MAPResults
```

### State Management
```typescript
interface AppState {
  // Data
  heads: number;
  tails: number;
  
  // Prior parameters
  alpha: number;
  beta: number;
  
  // Computed values (derived state)
  mleEstimate: number;
  mapEstimate: number;
  likelihoodData: Point[];
  priorData: Point[];
  posteriorData: Point[];
}
```

## Mathematical Implementation

### Core Functions
```typescript
// Beta distribution PDF
function betaPDF(x: number, alpha: number, beta: number): number

// Binomial likelihood for coin flips
function binomialLikelihood(p: number, heads: number, tails: number): number

// MLE calculation (analytical)
function calculateMLE(heads: number, tails: number): number

// MAP calculation (analytical for Beta-Binomial)
function calculateMAP(heads: number, tails: number, alpha: number, beta: number): number

// Generate plot data points
function generateDistributionData(fn: Function, range: [number, number], points: number): Point[]
```

### Distribution Parameters
- **Prior**: Beta(α, β)
- **Likelihood**: Binomial(n, p)  
- **Posterior**: Beta(α + heads, β + tails)

## UI/UX Design

### Layout (Mobile-first, responsive)
```
┌─────────────────────────────────────┐
│ Header & Description                │
├─────────────────────────────────────┤
│ Data Input Section                  │
│ [Heads: ___] [Tails: ___] [Simulate]│
├─────────────────────────────────────┤
│ MLE Section                         │
│ "Pure Data Approach"                │
│ [Likelihood Chart with MLE point]   │
│ MLE = 0.67                         │
├─────────────────────────────────────┤
│ MAP Section                         │
│ "Incorporating Prior Knowledge"      │
│ Prior Controls: α[slider] β[slider] │
│                                     │
│ Tug of War Visualization:           │
│ [Prior] ←→ [Likelihood] = [Posterior]│
│                                     │
│ MAP = 0.62                         │
└─────────────────────────────────────┘
```

### Color Scheme
- **Prior**: Blue (#3B82F6)
- **Likelihood**: Red (#EF4444) 
- **Posterior**: Purple (#8B5CF6)
- **MLE Point**: Orange (#F59E0B)
- **MAP Point**: Green (#10B981)

### Interactive Elements
1. **Number inputs** with validation (non-negative integers)
2. **Flip simulator**: Click button to add random flips
3. **Prior sliders**: Real-time updates for α, β ∈ [0.1, 10]
4. **Hover tooltips** on chart points
5. **Reset button** to clear data

## Tug of War Visualization

### Three-Panel Display
```
Prior Distribution → Likelihood Function → Posterior Distribution
      (α, β)             (data)              (combined)
        ↓                   ↓                    ↓
   [Blue curve]        [Red curve]         [Purple curve]
        ↓                   ↓                    ↓
     "Pulls left"      "Pulls right"        "Compromise"
```

### Force Arrows
- Bidirectional arrows between panels
- Arrow thickness proportional to "influence strength"
- Dynamic positioning based on distribution means
- Animated transitions when parameters change

### Mathematical Intuition Display
```
Prior belief: "Coin is fair-ish" (α=2, β=2)
Data evidence: "10 heads, 2 tails" → favors high p
MAP result: "Compromise at p=0.75"
```

## File Structure
```
src/
├── components/
│   ├── DataInput.tsx
│   ├── MLESection.tsx
│   ├── MAPSection.tsx
│   ├── LikelihoodChart.tsx
│   ├── PriorChart.tsx
│   ├── PosteriorChart.tsx
│   ├── TugOfWarVisualization.tsx
│   └── ForceArrows.tsx
├── utils/
│   ├── distributions.ts
│   ├── calculations.ts
│   └── chartHelpers.ts
├── types/
│   └── index.ts
├── App.tsx
└── index.tsx
```

## Development Phases

### Phase 1: Basic MLE (MVP)
- Data input component
- Likelihood chart with MLE point
- Basic styling

### Phase 2: Add MAP
- Prior parameter controls
- Posterior calculation and display
- Side-by-side comparison

### Phase 3: Tug of War Visualization
- Three-panel layout
- Force arrows and animations
- Interactive prior adjustment

### Phase 4: Polish & Deploy
- Responsive design
- Error handling
- Performance optimization
- Vercel deployment

## Key Features

### Educational Value
- Progressive complexity (MLE first, then MAP)
- Clear visual metaphors ("tug of war")
- Immediate feedback on parameter changes
- Intuitive explanations alongside math

### Technical Requirements
- Responsive design (mobile-friendly)
- Real-time updates (< 100ms response)
- Accessible (screen reader friendly)
- Cross-browser compatibility

### Performance Considerations
- Debounced slider updates
- Memoized distribution calculations
- Efficient chart re-rendering
- Lazy loading for complex visualizations

## Future Enhancements
- Multiple prior shapes (uniform, informative, skeptical)
- Credible intervals visualization
- Different likelihood functions (beyond binomial)
- Export functionality (charts, data)
- Guided tutorial mode
- Mobile app version