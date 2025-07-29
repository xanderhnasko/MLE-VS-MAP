# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Interactive educational React webapp demonstrating Maximum Likelihood Estimation (MLE) vs Maximum A Posteriori (MAP) estimation using coin flip examples with statistical visualizations.

## Development Commands

### Starting Development
```bash
cd mle-vs-map
npm start
```
Runs the development server at http://localhost:3003 with hot reloading.

### Building and Testing
```bash
npm run build    # Creates production build in build/ folder
npm test         # Runs Jest test suite in interactive watch mode
```

### Project Structure
```
mle-vs-map/
├── src/
│   ├── components/
│   │   ├── InputControls.tsx     # Coin data and prior parameter inputs
│   │   ├── LikelihoodChart.tsx   # Binomial likelihood visualization
│   │   ├── PriorPosteriorChart.tsx # Beta distributions comparison
│   │   ├── math-utils.ts         # Mathematical functions and interfaces
│   │   ├── figma/               # Figma export components
│   │   └── ui/                  # shadcn/ui component library
│   ├── styles/
│   │   └── globals.css          # Global Tailwind CSS styles
│   ├── App.tsx                  # Main application component
│   └── index.tsx                # React app entry point
```

## Architecture Details

### State Management
- Centralized state in `App.tsx` using React `useState`
- Two main state objects: `CoinData` (heads, tails) and `BetaParams` (alpha, beta)
- Real-time calculations triggered by state changes
- Props drilling pattern for state distribution to child components

### Mathematical Implementation
- **MLE Calculation**: `heads / (heads + tails)` - maximum likelihood estimate
- **MAP Calculation**: Uses Beta-Binomial conjugacy for posterior mode
- **Beta Distribution**: PDF calculations with gamma function approximations
- **Binomial Likelihood**: Probability calculations for observed coin flip data
- All mathematical functions located in `components/math-utils.ts`

### Key Dependencies
- **React 19** with TypeScript and Create React App
- **Recharts** for statistical data visualization (LineChart, ScatterChart)
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible component primitives (dialogs, inputs, sliders, etc.)

### Component Architecture
- `App.tsx`: Main container with state management and layout
- `InputControls`: Sticky header with coin data inputs and prior parameter controls
- `LikelihoodChart`: Visualizes binomial likelihood function
- `PriorPosteriorChart`: Compares prior belief vs posterior distribution
- `ui/`: Reusable shadcn/ui components (Input, Label, Button, etc.)

### Styling System
- Tailwind CSS with shadcn/ui design tokens
- CSS custom properties for theme variables in `globals.css`
- Responsive design with mobile-first approach
- Consistent spacing and typography scales