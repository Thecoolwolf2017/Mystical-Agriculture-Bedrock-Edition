# Component Registration

## Overview
Mystical Agriculture Bedrock Edition uses custom components to implement special behaviors for blocks and items. This document explains how components are registered and used in the mod.

## Component Registration Process

Components must be registered during the `worldInitialize` event to ensure they're available when needed. The mod follows this pattern for safe component registration:

```javascript
// Safe subscription to worldInitialize event
if (server.world.beforeEvents.worldInitialize) {
    server.world.beforeEvents.worldInitialize.subscribe(event => {
        try {
            // Register block components
            const blockRegistry = event.blockComponentRegistry;
            
            // Register custom components
            blockRegistry.registerComponent("strat:crop_controller", {
                // Component implementation
            });
            
            // Register more components...
            
        } catch (error) {
            console.error("[MYSTICAL AGRICULTURE] Error registering components:", error);
        }
    });
}
```

## Key Custom Components

### Block Components

1. **strat:crop_controller**
   - Handles crop growth mechanics
   - Manages bone meal interactions
   - Controls harvest behavior

2. **strat:farmland_controller**
   - Manages interaction with hoes
   - Handles tool damage and sound effects
   - Controls conversion between farmland and dirt

3. **strat:altar_check**
   - Validates infusion altar setup
   - Checks for correctly placed pedestals

4. **strat:pedestal_place**
   - Manages pedestal placement logic
   - Handles interaction with the infusion altar

### Item Components

1. **strat:watering_can**
   - Implements watering can functionality
   - Manages water detection and crop growth

## Best Practices

1. **Error Handling**
   - Always wrap component registration in try-catch blocks
   - Provide detailed error messages for debugging

2. **API Compatibility**
   - Check for API availability before using methods
   - Use conditional checks for backward compatibility

3. **Event Subscription**
   - Always check if events exist before subscribing
   - Use the pattern: `if (world.beforeEvents.eventName) { ... }`

4. **Component Structure**
   - Keep components focused on a single responsibility
   - Use clear naming conventions for components

## Common Issues

1. **Missing minecraft:tick Component**
   - Custom components that subscribe to the `onTick` event require the block to have the `minecraft:tick` component
   - Error: "[Blocks][error]-Block custom component subscribed to 'onTick' but the block is missing the 'minecraft:tick' component"
   - Solution: Add the `minecraft:tick` component to all blocks that use tick-based custom components

2. **Circular Dependencies**
   - Avoid circular imports between component registration files
   - Use utility modules to share common functionality

3. **Event Availability**
   - Some events might not be available in all API versions
   - Always check event availability before subscribing
