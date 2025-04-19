# Infusion Altar

## Overview
The Infusion Altar is a multi-block structure that allows players to create higher-tier seeds and special items in Mystical Agriculture. It's a central crafting component for progression through the mod.

## Structure Setup

### Required Blocks
- 1 Infusion Altar (center block)
- 8 Infusion Pedestals (arranged in a 3x3 pattern with the altar in the center)

### Construction Pattern
```
P P P
P A P
P P P
```
Where:
- A = Infusion Altar
- P = Infusion Pedestal

The pedestals must be placed exactly 1 block away from the altar in all 8 directions (including diagonals).

## Usage

1. **Place the altar and pedestals** in the correct pattern
2. **Place ingredients** on the pedestals by right-clicking each pedestal with the required item
3. **Place the base item** (usually a seed base) on the altar by right-clicking the altar
4. **Right-click the altar** with an Infusion Crystal to start the infusion process
5. **Wait** for the infusion process to complete
6. **Collect** the resulting item from the altar

## Crafting Examples

### Tier 1 Resource Seeds
- **Center (Altar)**: Seed Base
- **Pedestals**: 8 Tier 1 Essence (Inferium)
- **Catalyst**: Infusion Crystal
- **Result**: Tier 1 Resource Seed

### Tier 2 Resource Seeds
- **Center (Altar)**: Seed Base
- **Pedestals**: 8 Tier 2 Essence (Prudentium)
- **Catalyst**: Infusion Crystal
- **Result**: Tier 2 Resource Seed

### Special Items
- **Center (Altar)**: Base item (varies)
- **Pedestals**: Resource essences and other materials
- **Catalyst**: Infusion Crystal
- **Result**: Special item

## Technical Details

### Altar Block
The Infusion Altar block uses the `strat:altar_check` component to validate the structure setup and manage the infusion process.

### Pedestal Blocks
Pedestals use the `strat:pedestal_place` component to handle item placement and interaction with the altar.

### Infusion Process
1. When the process starts, the altar checks for a valid structure
2. Items are consumed from the pedestals
3. The base item is transformed into the result
4. Particles and sound effects are played during the process

## Troubleshooting

### Common Issues

1. **"Invalid Altar Setup" Message**
   - Ensure all pedestals are exactly 1 block away from the altar
   - Check that all pedestals are properly placed in all 8 directions
   - Verify that nothing is obstructing the space between pedestals and the altar

2. **Items Not Being Consumed**
   - Make sure you're using the correct items on the pedestals
   - Check that the recipe is valid for the base item you're using
   - Ensure you're using an Infusion Crystal to start the process

3. **Process Starts But No Result**
   - The recipe might be incorrect
   - The altar structure might have been disturbed during the process
   - Check for any error messages in the game logs

## Recipes
Refer to the in-game recipe book or the crafting guide for specific recipes. Each tier of seed and special item has its own unique recipe requirements.
