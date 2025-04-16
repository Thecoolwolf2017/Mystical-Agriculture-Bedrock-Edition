# Block Modernization Guide

This guide explains the process of modernizing block definitions in Mystical Agriculture Bedrock Edition to align with Minecraft Bedrock Edition 1.20.60 standards.

## Overview

As Minecraft Bedrock Edition evolves, the format for defining blocks changes. This guide documents the process of updating block definitions from older formats to the latest standards, focusing on the transition to JavaScript-based custom components.

## Key Changes in 1.20.60

### Deprecated Components

The following components are deprecated and should be replaced:

- `minecraft:on_player_destroyed` - Replace with direct loot table references
- `minecraft:random_ticking` - Replace with `minecraft:ticking` or JavaScript controllers
- `minecraft:on_interact` - Replace with JavaScript event handling
- Custom event handlers in block definitions - Move to JavaScript

### Modern Alternatives

#### 1. Custom Components

Use the `minecraft:custom_components` array to register JavaScript-based components:

```json
"minecraft:custom_components": ["strat:crop_controller"]
```

The JavaScript component should be registered in a script file:

```javascript
world.afterEvents.worldInitialize.subscribe((eventData) => {
    const blockComponentRegistry = eventData.blockTypeRegistry;
    
    blockComponentRegistry.registerCustomComponent("strat:crop_controller", {
        onAdd: (block) => { /* ... */ },
        onRemove: (block) => { /* ... */ },
        onRandomTick: (block) => { /* ... */ },
        onPlayerInteract: (eventData) => { /* ... */ }
    });
});
```

#### 2. Block Tags

Use tags to categorize blocks for easier selection and behavior application:

```json
"tag:crop": {},
"tag:resource_crop": {}
```

#### 3. Block States

Define block states to track properties like growth stage:

```json
"states": {
  "strat:growth_stage": [0, 1, 2, 3, 4, 5, 6]
}
```

#### 4. Direct Loot Table References

Instead of using events for loot, directly reference loot tables:

```json
"minecraft:loot": "loot_tables/blocks/my_block.json"
```

## Modernization Process

### Step 1: Update Format Version

Change the format version to the latest:

```json
"format_version": "1.20.60"
```

### Step 2: Replace Deprecated Components

1. Remove `minecraft:random_ticking` and add a JavaScript controller
2. Replace `minecraft:on_player_destroyed` with `minecraft:loot`
3. Remove custom events and implement them in JavaScript

### Step 3: Add Custom Components

Register your custom components in JavaScript and reference them in the block definition:

```json
"minecraft:custom_components": ["strat:my_component"]
```

### Step 4: Update Permutations

Make sure permutations use the correct format and reference valid components.

### Step 5: Test and Debug

Test the block in-game to ensure all functionality works as expected.

## Common Issues

### Lint Errors

- `Property X is not allowed` - The property might be deprecated or not supported in the current format
- `Incorrect type. Expected "array"` - Some properties expect arrays instead of objects
- `String does not match the pattern` - UUIDs must follow the correct format

### Runtime Errors

- Missing functionality - Check that all events were properly migrated to JavaScript
- Block state issues - Ensure block states are properly defined and accessed

## Example: Mystical Growth Pot

The Mystical Growth Pot was modernized by:

1. Updating to format version 1.20.60
2. Replacing custom event handlers with a JavaScript crop controller
3. Using block states to track crop type and growth stage
4. Implementing permutations for different growth stages
5. Adding direct loot table references

## Resources

- [Minecraft Bedrock Documentation](https://learn.microsoft.com/en-us/minecraft/creator/)
- [Block Components Documentation](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/blockreference/examples/blockcomponents)
- [JavaScript API Documentation](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/minecraft-server)
