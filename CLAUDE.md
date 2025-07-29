# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Interactive educational React webapp demonstrating Maximum Likelihood Estimation (MLE) vs Maximum A Posteriori (MAP) estimation using coin flip examples with "tug of war" visualization metaphor.

## Development Commands

### Starting Development
```bash
cd mle-vs-map
npm start
```
Runs the development server at http://localhost:3000 with hot reloading.

### Building and Testing
```bash
npm run build    # Creates production build in build/ folder
npm test         # Runs Jest test suite in watch mode
```

### Project Structure
```
mle-vs-map/
├── src/
│   ├── components/          # React components
│   │   ├── DataInput.tsx    # Coin flip input controls
│   │   ├── MLESection.tsx   # MLE calculation and visualization
│   │   ├── MAPSection.tsx   # MAP calculation with prior controls
│   │   ├── PriorControls.tsx# Alpha/beta parameter sliders
│   │   └── TugOfWarVisualization.tsx # Three-panel comparison view
│   ├── utils/               # Mathematical functions
│   │   ├── calculations.ts  # MLE/MAP calculations, data generation
│   │   ├── distributions.ts # Beta PDF, binomial likelihood functions
│   │   └── chartHelpers.ts  # Recharts formatting utilities
│   ├── types/
│   │   └── index.ts        # TypeScript interfaces (AppState, Point)
│   └── App.tsx             # Main component with state management
```

## Architecture Details

### State Management
- Single centralized state in `App.tsx` using `useState`
- State includes: heads, tails, alpha, beta, and computed distributions
- Derived values (MLE/MAP estimates, chart data) recalculated via `useEffect`
- Props passed down to child components, callbacks passed up for updates

### Mathematical Implementation
- **MLE**: `heads / (heads + tails)` - pure data-driven estimation
- **MAP**: `(heads + alpha - 1) / (total + alpha + beta - 2)` - incorporates Beta prior
- **Distributions**: Beta PDF for prior/posterior, binomial likelihood for data
- **Chart Data**: 100-point arrays generated for smooth curve visualization

### Key Dependencies
- **React 19** with TypeScript for UI components
- **Recharts** for all data visualization (LineChart, ScatterChart)
- **Tailwind CSS** for styling with responsive design
- **Create React App** for build tooling and development server

### Component Architecture
- `App.tsx`: Central state management and layout
- `DataInput`: Coin flip controls with validation
- `MLESection`: Pure likelihood-based estimation display
- `MAPSection`: Prior-incorporated estimation with controls
- `TugOfWarVisualization`: Three-panel comparative view (prior/likelihood/posterior)

### Styling Approach
- Tailwind CSS utility classes throughout
- Mobile-first responsive design
- Color scheme: Blue (prior), Red (likelihood), Purple (posterior)
- Component-level styling in individual TSX files

### Development Notes
- TypeScript strict mode enabled
- All mathematical functions have proper type annotations
- Chart data normalized for consistent visualization scaling
- Real-time updates when sliders or inputs change