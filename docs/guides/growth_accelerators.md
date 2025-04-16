# Growth Accelerators in Mystical Agriculture

This guide explains how growth accelerators work in the Mystical Agriculture Bedrock Edition mod.

## Overview

Growth accelerators are special blocks that speed up the growth of nearby crops. The mod includes five tiers of growth accelerators, each with increasing power:

1. **Inferium Growth Accelerator** - Tier 1
2. **Prudentium Growth Accelerator** - Tier 2
3. **Tertium Growth Accelerator** - Tier 3
4. **Imperium Growth Accelerator** - Tier 4
5. **Supremium Growth Accelerator** - Tier 5

## Technical Implementation

Growth accelerators use a modern JavaScript-based implementation with the `/tick` command system:

### Block Definition

Each growth accelerator block uses:

```json
{
  "tag:growth_accelerator": {},
  "tag:tier_growth_accelerator": {},
  "minecraft:custom_components": ["strat:growth_accelerator_controller"]
}
```

The `strat:growth_accelerator_controller` component handles the growth acceleration logic.

### JavaScript Controller

The growth accelerator controller is implemented in `BP/scripts/block_controllers.js`. When a growth accelerator is placed, it:

1. Determines the tier of the growth accelerator
2. Sets up a tick function with an appropriate delay (higher tiers have shorter delays)
3. Uses the `/tick` command to run the corresponding crop growth function

```javascript
function setupGrowthAcceleratorTicking(block) {
  const { x, y, z } = block.location;
  const blockId = block.typeId;
  
  // Determine the tier
  let tier = 1;
  if (blockId.includes("inferium")) {
    tier = 1;
  } else if (blockId.includes("prudentium")) {
    tier = 2;
  } else if (blockId.includes("tertium")) {
    tier = 3;
  } else if (blockId.includes("imperium")) {
    tier = 4;
  } else if (blockId.includes("supremium")) {
    tier = 5;
  }
  
  // Set up the tick command
  const tickDelay = Math.max(1, 20 - (tier * 3)); // Faster ticking for higher tiers
  const tickCommand = `tick function crop_growth/tier${tier}_crops @s ${tickDelay}`;
  
  // Execute the tick command
  block.dimension.runCommand(tickCommand);
}
```

### Crop Growth Functions

The crop growth is handled by tier-specific functions in the `BP/functions/crop_growth/` directory:

- `tier1_crops.mcfunction` - For Inferium Growth Accelerators
- `tier2_crops.mcfunction` - For Prudentium Growth Accelerators
- `tier3_crops.mcfunction` - For Tertium Growth Accelerators
- `tier4_crops.mcfunction` - For Imperium Growth Accelerators
- `tier5_crops.mcfunction` - For Supremium Growth Accelerators

These functions use the `fill` command to accelerate crop growth within a specific radius around the growth accelerator.

## Upgrading from Previous Versions

In older versions, growth accelerators used the `minecraft:queued_ticking` component. This has been replaced with the modern JavaScript-based implementation described above.

If you're updating from an older version, make sure to:

1. Remove any `minecraft:queued_ticking` components
2. Add the tag components and custom component
3. Ensure the JavaScript controller is properly implemented
4. Update your crop growth functions to use the correct block state properties

## Troubleshooting

If growth accelerators aren't working:

1. Check that the growth accelerator block definitions include the custom component
2. Verify that the JavaScript controller is properly registered
3. Ensure the crop growth functions are correctly implemented
4. Check for errors in the JavaScript console
