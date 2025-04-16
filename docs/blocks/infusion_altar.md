# Infusion Altar

## Overview
The Infusion Altar is a central block in the Mystical Agriculture mod that allows players to create advanced materials through the infusion process. It works in conjunction with Infusion Pedestals arranged in a specific pattern around it.

## Technical Implementation

### Block Definition
As of Minecraft Bedrock Edition 1.20.60, the Infusion Altar uses a modern implementation approach:

- The block definition (`BP/blocks/infusion_altar/infusion_altar.json`) uses the format_version 1.20.60
- Block states are defined for tracking activation and pedestal guide visibility
- The block uses a custom component called `strat:infusion_altar_controller` implemented in JavaScript
- The geometry definition has been removed to avoid compatibility issues with custom models

### JavaScript Implementation
The functionality is implemented in `BP/scripts/infusion_altar.js` using the Minecraft Bedrock JavaScript API. This approach provides several advantages:

1. **Better Performance**: JavaScript execution is more efficient than the previous JSON-based event system
2. **More Flexibility**: The JavaScript API allows for more complex logic and interactions
3. **Future Compatibility**: This approach aligns with Minecraft's direction for custom block behavior

The implementation includes:
- Registration of the custom component during world initialization
- Handling player interaction to toggle pedestal guides
- Checking for correctly placed pedestals and activating the altar
- Cleaning up pedestal guides when the altar is destroyed

### Infusion Altar States
The Infusion Altar has two block states:
- `strat:activation` (0 or 1): Indicates whether the altar is active
- `strat:pedestal_guides` (0 or 1): Controls visibility of pedestal placement guides

When active, the altar emits light (level 7) and can be used for crafting.

## Pedestal Configuration

The Infusion Altar requires eight Infusion Pedestals arranged in a specific pattern:
- Four pedestals at cardinal directions (North, East, South, West), 3 blocks away from the altar
- Four pedestals at diagonal positions (NE, SE, SW, NW), 2 blocks away from the altar

```
    P   P   P
      P P P
    P P A P P
      P P P
    P   P   P
```
(Where A is the altar and P represents pedestal positions)

## Pedestal Guides

To help players place pedestals correctly, the Infusion Altar includes a pedestal guide feature:
1. Right-clicking the altar toggles guide blocks that show where pedestals should be placed
2. These guide blocks are automatically removed when:
   - The altar is broken
   - The altar is activated
   - The player toggles them off

## Activation Process

The altar activates automatically when:
1. All eight pedestals are correctly placed
2. The system performs a periodic check (every 10 seconds)

When activated, the altar:
- Changes its block state to `strat:activation = 1`
- Emits light
- Spawns particles
- Plays a sound effect
- Removes any visible pedestal guides

If any pedestal is removed, the altar will deactivate during the next check.

## Technical Notes

- The implementation uses block tags to identify infusion pedestals and the altar
- The JavaScript code uses the `system.runInterval()` method for periodic checks
- Block state changes are handled through the `block.setPermutation()` method
- The altar uses the Minecraft Bedrock custom components system introduced in 1.20

## Compatibility

This implementation is compatible with Minecraft Bedrock Edition 1.20.60 and above. It uses the modern JavaScript API and avoids deprecated components that cause lint errors in older implementations.
