# Block Behaviors

## Overview
Mystical Agriculture Bedrock Edition uses custom block behaviors to implement special functionality for various blocks in the mod. This document explains how these behaviors work and how they're implemented.

## Block Component System

### Required Components
All custom blocks with tick-based behavior must include the `minecraft:tick` component:

```json
"minecraft:tick": {
  "interval_range": [300, 600],
  "looping": true
}
```

This component is essential for any block that needs to perform actions over time, such as crop growth or altar functionality.

## Key Block Types

### Crop Blocks

Crop blocks use several custom components:

1. **strat:crop_controller**
   - Manages growth stages (0-7)
   - Handles bone meal interactions
   - Controls harvest behavior and drops

Example implementation:
```javascript
blockRegistry.registerComponent("strat:crop_controller", {
    onTick: (block) => {
        try {
            // Growth logic
            const blockPermutation = block.permutation;
            const blockStates = blockPermutation.getAllStates();
            
            // Check and update growth state
            if (blockStates.hasOwnProperty("growth")) {
                // Growth logic for growth property
            } else if (blockStates.hasOwnProperty("age")) {
                // Growth logic for age property
            } else if (blockStates.hasOwnProperty("strat:growth_stage")) {
                // Growth logic for custom growth_stage property
            }
        } catch (error) {
            console.error("[MYSTICAL AGRICULTURE] Error in crop controller:", error);
        }
    },
    
    // Other event handlers...
});
```

### Farmland Blocks

Farmland blocks use the `strat:farmland_controller` component:

1. **strat:farmland_controller**
   - Manages moisture levels
   - Handles tool interactions (hoes)
   - Controls conversion between farmland and dirt

### Infusion Altar

The Infusion Altar uses the `strat:altar_check` component:

1. **strat:altar_check**
   - Validates the multi-block structure
   - Manages the infusion process
   - Handles item placement and retrieval

### Pedestals

Pedestals use the `strat:pedestal_place` component:

1. **strat:pedestal_place**
   - Manages item placement on pedestals
   - Handles interaction with the Infusion Altar
   - Controls visual display of items

## Block State Management

### Growth States
Crop blocks use one of three properties to track growth:
- `growth` (0-7)
- `age` (0-7)
- `strat:growth_stage` (0-7)

The code checks for all three properties to ensure compatibility with different block definitions.

### Custom Properties
Custom properties are defined in the block's JSON definition:

```json
"components": {
    "minecraft:block_property_map": {
        "strat:growth_stage": [0, 1, 2, 3, 4, 5, 6, 7]
    }
}
```

## Event Handling

### Block Events
Block events are handled through component callbacks:

```javascript
blockRegistry.registerComponent("strat:example_component", {
    onInteract: (block, player) => {
        // Handle player interaction with block
    },
    
    onPlace: (block) => {
        // Handle block placement
    },
    
    onBreak: (block, player) => {
        // Handle block breaking
    }
});
```

## Best Practices

1. **Error Handling**
   - Always wrap component logic in try-catch blocks
   - Log detailed error messages for debugging

2. **Performance Optimization**
   - Use appropriate tick intervals for different block types
   - Avoid unnecessary operations in frequently called methods
   - Use efficient data structures for block state tracking

3. **Compatibility**
   - Check for property existence before accessing
   - Support multiple property types for the same functionality
   - Use feature detection for API compatibility

## Common Issues and Solutions

1. **Missing minecraft:tick Component**
   - Error: "[Blocks][error]-Block custom component subscribed to 'onTick' but the block is missing the 'minecraft:tick' component"
   - Solution: Add the `minecraft:tick` component to all blocks that use tick-based custom components

2. **Block State Not Updating**
   - Issue: Block states don't update visually or functionally
   - Solution: Use `block.setPermutation()` with the new state values

3. **Event Not Firing**
   - Issue: Block events aren't being triggered
   - Solution: Verify component registration and event subscription
