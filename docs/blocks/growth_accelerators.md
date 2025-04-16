# Growth Accelerators

## Overview
Growth accelerators are special blocks that increase the growth rate of nearby crops. They come in five tiers, each with increasing effectiveness:

1. **Inferium Growth Accelerator** - Basic tier
2. **Prudentium Growth Accelerator** - Second tier
3. **Tertium Growth Accelerator** - Third tier
4. **Imperium Growth Accelerator** - Fourth tier
5. **Supremium Growth Accelerator** - Highest tier

## Technical Implementation

### Block Definitions
As of Minecraft Bedrock Edition 1.20.60, growth accelerator blocks are defined with a simplified structure that relies on JavaScript API for functionality rather than using deprecated components.

Each growth accelerator block definition includes:
- Basic block properties (destructible, material instances)
- Collision and selection boxes
- Map color and light emission
- Explosion resistance

The block definitions **no longer include**:
- `minecraft:geometry` component (removed due to compatibility issues)
- `minecraft:queued_ticking` or `minecraft:ticking` components (replaced with JavaScript)
- Event handlers (replaced with JavaScript)

### JavaScript Implementation
The functionality of growth accelerators is now handled through the JavaScript API in `BP/scripts/growth_accelerators.js`. This script:

1. Registers event handlers for each growth accelerator type
2. Implements ticking behavior to periodically trigger crop growth
3. Handles block break events to disrupt infusion altars when a growth accelerator is broken

The script uses the following Minecraft Bedrock JavaScript API features:
- `world.afterEvents.worldInitialize` - For initial setup
- `system.runInterval` - For periodic ticking
- `world.afterEvents.blockBreak` - For handling block destruction

### MCFunction Support
Growth accelerators are supported by several MCFunction files:

- `BP/functions/setup_growth_accelerators.mcfunction` - Creates ticking areas around growth accelerators
- `BP/functions/growth_accelerator_tick.mcfunction` - Runs periodically to check and execute growth functions
- Individual tier functions (e.g., `inferium_growth_accelerator.mcfunction`) - Contain the actual crop growth logic

#### Crop Growth Functions
The system includes specialized crop growth functions organized by tier:

- `BP/functions/crop_growth/tier1_crops.mcfunction` - Handles basic crops (wheat, carrots, potatoes, inferium)
- `BP/functions/crop_growth/tier2_crops.mcfunction` - Handles tier 2 crops (beetroots, prudentium, basic resource crops)
- `BP/functions/crop_growth/tier3_crops.mcfunction` - Handles tier 3 crops (tertium, intermediate resource crops, nether wart)
- `BP/functions/crop_growth/tier4_crops.mcfunction` - Handles tier 4 crops (imperium, advanced resource crops, chorus)
- `BP/functions/crop_growth/tier5_crops.mcfunction` - Handles tier 5 crops (supremium, end-game resource crops)

These functions use the `fill` command with target block states to instantly mature crops within range of the growth accelerator.

## Usage

When placed, growth accelerators will automatically:
1. Accelerate the growth of nearby crops at intervals based on their tier
2. Emit light (higher tiers emit more light)
3. Create a ticking area to ensure chunks stay loaded

Higher tier growth accelerators have:
- Faster growth acceleration
- Higher light emission
- Greater explosion resistance
- Larger area of effect

## Technical Notes

- Growth accelerators use a timer-based system to control growth rates
- The JavaScript implementation uses random chance based on tier to determine when to trigger growth
- Breaking a growth accelerator will automatically disrupt any nearby active infusion altars
- The implementation uses modern Minecraft Bedrock APIs and avoids deprecated components
- Crop growth is handled through specialized functions that target specific crop types and growth stages

## Compatibility

This implementation is compatible with Minecraft Bedrock Edition 1.20.60 and above. It uses the modern JavaScript API and avoids deprecated components that cause lint errors in older implementations.
