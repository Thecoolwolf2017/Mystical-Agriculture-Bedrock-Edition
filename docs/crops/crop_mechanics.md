# Crop Mechanics

## Overview
Mystical Agriculture's core feature is the ability to grow resources as crops. This document explains how crop growth works and how to optimize your farming.

## Crop Types
The mod includes several types of crops:

1. **Resource Crops**: Grow materials like iron, gold, diamond, etc.
2. **Mob Crops**: Grow mob drops like bones, ender pearls, etc.
3. **Element Crops**: Grow elemental essences (air, earth, water, fire)
4. **Special Crops**: Unique crops with special properties

## Growth Mechanics

### Growth Stages
- All crops have 8 growth stages (0-7)
- Stage 0 is freshly planted
- Stage 7 is fully grown and harvestable
- Each crop uses either the `age`, `growth`, or `strat:growth_stage` property

### Growth Rate
- Base growth rate is determined by Minecraft's random tick system
- Growth can be accelerated using:
  - Watering Cans
  - Growth Accelerators
  - Fertilized Farmland

### Harvest Mechanics
- Fully grown crops (stage 7) can be harvested
- Crops typically drop:
  - Seeds (for replanting)
  - Essence (the main resource)
  - Chance for fertilized essence (bonus drop)

## Crop Blocks Technical Details

All crop blocks include the following components:
```json
"minecraft:tick": {
  "interval_range": [300, 600],
  "looping": true
}
```

This component is required for the custom growth mechanics to function properly.

## Textures
- Stages 0-6 use generic textures for each crop type
- Stage 7 (final stage) uses crop-specific textures
- Texture naming follows the pattern: `mystical_[resource]_crop_7` for the final stage

## Recent Fixes
- Added the minecraft:tick component to all crop blocks
- Fixed growth stage detection and advancement
- Improved compatibility with watering cans and growth accelerators

## Troubleshooting
If crops aren't growing properly:
1. Ensure they're planted on valid farmland or mystical growth pots
2. Check that they have adequate light
3. Verify that the minecraft:tick component is present in the block definition
4. Use a watering can to accelerate growth and debug any issues
