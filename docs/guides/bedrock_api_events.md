# Minecraft Bedrock API Events Guide

## Overview

This document provides information about the correct event names and usage patterns for the Minecraft Bedrock Edition API. Using the correct event names is critical for your mod to function properly.

## Event Systems

Minecraft Bedrock Edition has two main event systems:

1. **BeforeEvents**: Events that fire before an action occurs, allowing you to potentially cancel or modify the action
2. **AfterEvents**: Events that fire after an action has occurred, allowing you to respond to the action

## WorldBeforeEvents

The `world.beforeEvents` object contains events that fire before an action occurs. In most cases, you can potentially cancel or modify the impending event.

**Important Note**: In before events, any APIs that modify gameplay state will not function and will throw an error (e.g., `dimension.spawnEntity`).

### Common BeforeEvents

| Event Name | Description | Usage |
|------------|-------------|-------|
| `playerInteractWithEntity` | Fires before a player interacts with an entity | Handling tool interactions with entities (e.g., shearing sheep) |
| `playerInteractWithBlock` | Fires before a player interacts with a block | Handling tool interactions with blocks (e.g., using a hoe on dirt) |
| `playerBreakBlock` | Fires before a player breaks a block | Handling tool durability when breaking blocks |
| `itemUse` | Fires when an item is used by a player | Handling item usage (e.g., eating food, using a tool) |
| `effectAdd` | Fires before an effect is added to an entity | Modifying or canceling effects |
| `explosion` | Fires before an explosion occurs | Modifying or canceling explosions |

### Example: playerInteractWithEntity

```javascript
world.beforeEvents.playerInteractWithEntity.subscribe(event => {
    // Get the player from the event source
    const player = event.source;
    // Get the item stack from the player's equipped item
    const itemStack = event.itemStack;
    // Get the target entity
    const target = event.target;
    
    // Your code here
});
```

### Example: playerInteractWithBlock

```javascript
world.beforeEvents.playerInteractWithBlock.subscribe(event => {
    // Get the player from the event source
    const player = event.source;
    // Get the block being interacted with
    const block = event.block;
    // Get the item stack being used
    const itemUsed = event.itemStack;
    
    // Your code here
});
```

## WorldAfterEvents

The `world.afterEvents` object contains events that fire after an action has occurred. These events are useful for responding to actions that have already happened.

### Common AfterEvents

| Event Name | Description | Usage |
|------------|-------------|-------|
| `playerBreakBlock` | Fires after a player breaks a block | Handling post-block-break actions (e.g., dropping items) |
| `entityDie` | Fires after an entity dies | Handling entity death (e.g., dropping loot) |
| `entityHurt` | Fires after an entity is hurt | Responding to entity damage |
| `playerJoin` | Fires after a player joins the game | Welcoming players, initializing player data |
| `playerLeave` | Fires after a player leaves the game | Cleaning up player data |
| `itemUse` | Fires after an item is used | Responding to item usage |

### Example: playerBreakBlock

```javascript
world.afterEvents.playerBreakBlock.subscribe(event => {
    const { player, block, brokenBlockPermutation } = event;
    
    // Your code here
});
```

## Common Mistakes to Avoid

1. **Using incorrect event names**: Always use the exact event names as specified in the documentation
   - Incorrect: `world.beforeEvents.itemUseOn`
   - Correct: `world.beforeEvents.playerInteractWithBlock`

2. **Accessing undefined properties**: Make sure to check the event object structure in the documentation
   - Incorrect: `event.player` (in most events)
   - Correct: `event.source` (for player-initiated events)

3. **Modifying game state in BeforeEvents**: This will throw an error
   - Incorrect: `dimension.spawnEntity()` in a BeforeEvent handler
   - Correct: Use `system.run(() => { dimension.spawnEntity() })` to defer the action

4. **Not checking for null/undefined values**: Always check if properties exist before using them
   - Example: `if (!itemStack) return;`

## API Privilege Issues

Some API methods require additional privileges and may not work in all contexts. For details, see [API Privilege Issues](api_privilege_issues.md).

## References

- [Official Minecraft Bedrock Documentation](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/world)
- [Minecraft Bedrock Edition API Changelog](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/minecraft-server-changelog)
