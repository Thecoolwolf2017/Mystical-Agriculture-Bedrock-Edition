# Ore XP System

## Overview
The Ore XP System is a feature that allows players to obtain experience points when mining ore blocks, similar to vanilla Minecraft. This system applies to both vanilla ores and custom Mystical Agriculture ores.

## Functionality

### Supported Ore Types
The system provides XP drops for the following ore types:

#### Vanilla Minecraft Ores
- **Diamond Ore**: 3-7 XP orbs
- **Emerald Ore**: 3-7 XP orbs
- **Lapis Lazuli Ore**: 2-5 XP orbs
- **Redstone Ore**: 1-5 XP orbs
- **Gold Ore**: 0-2 XP orbs
- **Nether Quartz**: 0-2 XP orbs
- **Iron Ore**: 0-1 XP orbs
- **Copper Ore**: 0-1 XP orbs
- **Coal Ore**: 0-2 XP orbs

#### Mystical Agriculture Ores
- **Prosperity Ore**: 1-3 XP orbs
- **Inferium Ore**: 1-3 XP orbs
- **Soulium Ore**: 1-3 XP orbs

### Tool Requirements
All ores in Mystical Agriculture require proper tools to be mined:

1. **Required Tool**: Pickaxe (any type)
2. **Tool Level**: Stone pickaxe or better for most ores

If a player attempts to mine an ore without a pickaxe:
- The block won't break
- The player will receive a message stating "You need a pickaxe to mine this ore!"
- No XP will drop

## Technical Implementation

### Event-Based System
The Ore XP System uses a global event handler that triggers before a block is broken:

```javascript
world.beforeEvents.playerBreakBlock.subscribe((event) => {
    // Logic for detecting ores and spawning XP
});
```

### XP Spawning Process
1. The system detects when a player breaks a block
2. It checks if the block is an ore (using typeId or tags)
3. It validates the player is using a pickaxe
4. It calculates a random amount of XP based on the ore type
5. It spawns XP orbs at the block's location with slight position randomization

### Randomization
XP amounts are randomized using the following function:

```javascript
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

This ensures players get varied XP amounts within the specified range for each ore type.

## Future Improvements
- Add configuration options for XP amounts
- Support for custom ore types added by add-ons
- Compatibility with fortune enchantments to increase XP drops

## Related Documentation
- [Ore Blocks](../blocks/ore_blocks.md) - Documentation for all custom ore blocks
- [Technical Implementation Notes](../technical/ore_handling.md) - Technical details for developers
