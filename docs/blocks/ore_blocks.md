# Ore Blocks

## Overview
Special ore blocks are an important part of the Mystical Agriculture mod's progression system. These ores provide essential resources and XP when mined with the proper tools.

## Ore Types

### Prosperity Ore
- **Block Identifier**: `strat:prosperity_ore`
- **Tool Requirement**: Stone Pickaxe or better
- **Mining Time**: 4.5 seconds
- **XP Drops**: 1-3 XP orbs
- **Location**: Found throughout the overworld, similar to iron ore distribution
- **Used for**: Crafting base materials for Mystical Agriculture

### Deepslate Prosperity Ore
- **Block Identifier**: `strat:deepslate_prosperity_ore`
- **Tool Requirement**: Stone Pickaxe or better
- **Mining Time**: 6.0 seconds
- **XP Drops**: 1-3 XP orbs
- **Location**: Found in deepslate layers, typically below Y=0
- **Used for**: Same as Prosperity Ore, but more common in deep areas

### Inferium Ore
- **Block Identifier**: `strat:inferium_ore`
- **Tool Requirement**: Stone Pickaxe or better
- **Mining Time**: 4.5 seconds
- **XP Drops**: 1-3 XP orbs
- **Location**: Found throughout the overworld
- **Used for**: Direct source of Inferium Essence, saving the need to grow Tier 1 crops

### Deepslate Inferium Ore
- **Block Identifier**: `strat:deepslate_inferium_ore`
- **Tool Requirement**: Stone Pickaxe or better
- **Mining Time**: 6.0 seconds
- **XP Drops**: 1-3 XP orbs
- **Location**: Found in deepslate layers, typically below Y=0
- **Used for**: Same as Inferium Ore, but more common in deep areas

### Soulium Ore
- **Block Identifier**: `strat:soulium_ore`
- **Tool Requirement**: Stone Pickaxe or better
- **Mining Time**: 5.0 seconds
- **XP Drops**: 1-3 XP orbs
- **Location**: Found in the Nether, typically in soul sand valleys
- **Used for**: Crafting soul-related items and mob essence

## Mining Mechanics

All ore blocks in Mystical Agriculture require the correct tools to mine:

1. **Required Tools**: 
   - Must use a pickaxe (any pickaxe including wood, stone, iron, diamond, or netherite)
   - Stone or better pickaxes are required for efficient mining

2. **Mining Without Tools**:
   - If a player attempts to mine these ores without a pickaxe, the blocks won't break
   - A message will appear informing the player that a pickaxe is required

3. **XP System**:
   - When mined with proper tools, ores will drop XP orbs
   - The amount of XP varies by ore type (see individual descriptions above)
   - XP is automatically spawned at the block's location when broken

## Technical Details

The ore block system utilizes both block definitions and scripts:

- Block definitions contain the `tag:minecraft:requires_stone_tool` property
- The `tag:minecraft:is_pickaxe_item_destructible` property ensures proper tool requirements
- Script-level validation in `oreUtils.js` provides additional enforcement and player feedback
- The XP dropping system is handled by a global event handler that detects when ore blocks are broken
