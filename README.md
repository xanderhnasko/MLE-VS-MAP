# MLE vs MAP Educational Webapp

An interactive educational tool that demonstrates the difference between Maximum Likelihood Estimation (MLE) and Maximum A Posteriori (MAP) estimation using coin flip examples.

## What This App Does

This webapp helps students understand two fundamental concepts in statistics and machine learning:

- **Maximum Likelihood Estimation (MLE)**: Finding the parameter value that makes the observed data most likely
- **Maximum A Posteriori (MAP)**: Finding the parameter value that balances the likelihood of the data with prior beliefs

## How It Works

The app uses a simple coin flipping scenario where you're trying to estimate the probability of getting heads. You can:

1. **Enter coin flip data**: Specify how many heads and tails you observed
2. **Set prior beliefs**: Adjust your initial belief about the coin's bias using Beta distribution parameters
3. **See the results**: Watch how MLE and MAP estimates differ

## Key Features

### Interactive Visualizations

- **Likelihood Chart**: Shows how likely different probability values are given your observed data
- **Prior, Likelihood, and Posterior Chart**: Displays all three distributions and how they relate

### Tug-of-War Metaphor

The app includes a unique visual metaphor where two figures engage in a tug-of-war:
- One figure represents your prior beliefs
- The other represents the observed data
- The size and strength of each figure reflects how much evidence supports their position
- The rope shows where MAP estimation "settles" between the two forces

### Real-Time Updates

All charts and calculations update immediately as you change the input parameters, making it easy to explore different scenarios and see how prior beliefs and data strength affect the final estimates.

## Educational Value

This tool is designed for students learning about:
- Bayesian statistics
- Parameter estimation
- The relationship between frequentist and Bayesian approaches
- How prior beliefs influence statistical inference

## Getting Started

1. Clone this repository
2. Navigate to the `mle-vs-map` directory
3. Run `npm install` to install dependencies
4. Run `npm start` to launch the development server
5. Open your browser to `http://localhost:3003`

## Technical Details

Built with React, TypeScript, and Recharts for visualizations. Uses mathematical functions for Beta distributions and binomial likelihoods to provide accurate statistical calculations.