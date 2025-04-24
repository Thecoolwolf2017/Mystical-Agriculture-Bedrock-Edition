# Watering Can

## Overview
The watering can is a tool in Mystical Agriculture that allows players to accelerate crop growth.
It needs to be filled with water before use and will empty after each use. The watering can comes in different tiers with varying effectiveness.

## Tiers
- **Inferium Watering Can**: 3x3 area, 33% growth chance
- **Prudentium Watering Can**: 5x5 area, 40% growth chance
- **Intermedium Watering Can**: 7x7 area, 50% growth chance
- **Superium Watering Can**: 9x9 area, 60% growth chance
- **Supremium Watering Can**: 11x11 area, 75% growth chance

## Usage
1. **Filling**: Right-click on a water block to fill the watering can
2. **Using**: Right-click on crops or farmland to accelerate growth
3. **Water Consumption**: The watering can empties completely after each use

## Technical Details
- Supports both vanilla crops and custom Mystical Agriculture crops
- Detects water blocks using both string IDs and numeric IDs (8, 9, 4)
- Provides visual feedback through particles and action bar messages
- Handles different growth properties (growth, age, strat:growth_stage)
- Two ways to use the watering can:
  1. On farmland: Waters all crops in the area (based on tier range)
  2. Directly on a custom crop: Immediately advances that specific crop's growth stage

## Recent Fixes
- Fixed water detection to work with both string and numeric IDs
- Improved error handling with proper try-catch blocks
- Updated water consumption to empty after each use for better balance
- Added better feedback messages when using the watering can
- Fixed custom crop growth to properly update visually when watered
