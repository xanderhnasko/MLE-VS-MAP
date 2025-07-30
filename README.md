# MLE vs MAP Educational Webapp

An interactive tool that demonstrates the difference between Maximum Likelihood Estimation (MLE) and Maximum A Posteriori (MAP) estimation using the visual metaphor of Tug-Of-War

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
- The size (strength) of each figure reflects how much evidence supports their position
- The rope shows where MAP estimation "settles" between the two forces

## Technical Details

Built with React, TypeScript, and Recharts for visualizations. Uses mathematical functions for Beta distributions and binomial likelihoods to provide accurate statistical calculations.
