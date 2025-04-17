# Custom Components in Mystical Agriculture Bedrock Edition

This document describes the custom components used in the Mystical Agriculture Bedrock Edition mod and their functionality.

## Table of Contents
1. [Crop Components](#crop-components)
   - [strat:crop_controller](#stratcrop_controller)
   - [strat:custom_crop](#stratcustom_crop)
2. [Farmland Components](#farmland-components)
   - [strat:farmland_controller](#stratfarmland_controller)
3. [Infusion System Components](#infusion-system-components)
   - [strat:altar_check](#strataltar_check)
   - [strat:pedestal_place](#stratpedestal_place)
4. [Utility Components](#utility-components)
   - [strat:ore_xp](#stratore_xp)
   - [strat:none](#stratnone)
5. [Slab Components](#slab-components)
   - [kai:on_interact_slab](#kaion_interact_slab)
   - [kai:on_player_destroy_slab](#kaion_player_destroy_slab)
6. [Stair Components](#stair-components)
   - [template:stair_placement](#templatestair_placement)
7. [Implementation Notes](#implementation-notes)
   - [API Privilege Issues](#api-privilege-issues)
   - [Block State Syntax](#block-state-syntax)

## Crop Components

### strat:crop_controller

This component manages the growth and interaction with custom crops in the mod.

**Events:**
- `onPlayerInteract`: Handles player interactions with crops, such as using bone meal
- `onRandomTick`: Manages random growth ticks for crops

**Functionality:**
- Detects when a player interacts with a crop using bone meal
- Applies growth stage increases based on random chance
- Manages crop growth stages from 0 to 7

### strat:custom_crop

This is an alternative implementation of the crop controller with the same functionality.

## Farmland Components

### strat:farmland_controller

This component manages the custom farmland blocks that accelerate crop growth.

**Events:**
- `onRandomTick`: Accelerates crop growth based on farmland tier
- `onTick`: Manages farmland moisture and block state

**Functionality:**
- Checks for water nearby (up to 4 blocks away)
- Updates moisture state based on water proximity
- Accelerates crop growth with different rates based on farmland tier:
  - Inferium Farmland: 10% chance
  - Prudentium Farmland: 15% chance
  - Tertium Farmland: 20% chance
  - Imperium Farmland: 25% chance
  - Supremium Farmland: 30% chance
- Converts farmland to dirt if an invalid block is placed on top

## Infusion System Components

### strat:altar_check

This component manages the infusion altar's functionality for crafting.

**Events:**
- `onPlayerInteract`: Handles player interactions with the altar
- `onTick`: Creates visual effects for the altar

**Functionality:**
- Detects when a player uses the mystical wand on the altar
- Searches for pedestals with items in an 8-block radius
- Verifies that the altar has a central item
- Checks for valid recipes (implemented in infusion_recipes.js)
- Creates visual and sound effects during infusion

### strat:pedestal_place

This component manages the infusion pedestals that hold items for crafting.

**Events:**
- `onPlace`: Spawns a pedestal entity when the block is placed
- `onPlayerInteract`: Handles item placement and removal
- `onBreak`: Handles pedestal destruction

**Functionality:**
- Spawns an invisible entity that holds items
- Allows players to place items on the pedestal
- Allows players to retrieve items from the pedestal
- Drops items when the pedestal is broken

## Utility Components

### strat:ore_xp

This component manages XP drops from custom ore blocks.

**Events:**
- `onPlayerDestroy`: Handles XP drops when an ore is mined

**Functionality:**
- Checks if the player is using a pickaxe
- Verifies the pickaxe doesn't have Silk Touch
- Spawns 0-3 XP orbs when the ore is mined

### strat:none

This is an empty component used as a placeholder for blocks that need a component reference but no behavior.

## Slab Components

### kai:on_interact_slab

This component manages interactions with custom slab blocks.

**Events:**
- `onPlayerInteract`: Handles slab placement to create double slabs

**Functionality:**
- Detects when a player places a matching slab on an existing slab
- Creates a double slab block when appropriate
- Handles item consumption in survival mode

### kai:on_player_destroy_slab

This component manages the destruction of custom slab blocks.

**Events:**
- `onPlayerDestroy`: Handles slab breaking behavior

**Functionality:**
- Ensures proper item drops when breaking slabs
- Handles special cases for double slabs

## Stair Components

### template:stair_placement

This component manages the placement and appearance of custom stair blocks.

**Events:**
- `onPlace`: Handles stair placement and orientation
- `onTick`: Updates stair appearance based on adjacent blocks

**Functionality:**
- Automatically adjusts stair shape (straight, inner corner, outer corner)
- Handles vertical orientation (upside-down vs. normal)
- Updates stair appearance when adjacent stairs are placed or removed

## Implementation Notes

### API Privilege Issues

In Minecraft Bedrock Edition 1.20.60+, certain API calls require additional privileges that may not be available in all contexts. The following components and files have been modified to address these issues:

**Modified Files:**
- `BP\scripts\tools\interactions.js`
- `BP\scripts\tools\sickle.js`
- `BP\scripts\tools\scythe.js`
- `BP\scripts\tools\durability.js`
- `BP\scripts\classes\cropManager.js`

**Changes Made:**
- Replaced `ItemTypes.getAll()` and `BlockTypes.getAll()` calls with hardcoded arrays
- Manually defined tool IDs, crop IDs, and other item/block collections
- Removed duplicate variable declarations and unnecessary loops
- Updated event handlers to use correct event names from the Bedrock API

For more details, see the [API Privilege Issues](../guides/api_privilege_issues.md) guide.

### Bedrock API Events

Minecraft Bedrock Edition uses specific event names that must be used exactly as defined in the API. Using incorrect event names will result in errors like `TypeError: cannot read property 'subscribe' of undefined`.

**Event Systems:**
- `world.beforeEvents` - Events that fire before an action occurs
- `world.afterEvents` - Events that fire after an action has occurred

**Common Events Used:**
- `playerInteractWithEntity` - For tool interactions with entities (e.g., shearing sheep)
- `playerInteractWithBlock` - For tool interactions with blocks (e.g., using a hoe on dirt)
- `playerBreakBlock` - For handling block breaking (e.g., tool durability)

For a comprehensive guide to Bedrock API events, see the [Bedrock API Events Guide](../guides/bedrock_api_events.md).

### Block State Syntax

Minecraft Bedrock Edition requires a specific syntax for block states in mcfunction files and JavaScript code:

**Correct Bedrock Edition syntax:**
- Use square brackets with quotes around property names and colons between property and value
- Example: `minecraft:wheat ["age":7]`
- Example: `strat:inferium_crop ["strat:growth_stage":7]`

**Property Names:**
- Custom crops use `strat:growth_stage` property (0-7)
- Vanilla crops use `age` property:
  - Wheat, Carrots, Potatoes: 0-7
  - Beetroot, Sweet Berry Bush: 0-3

**Component Implementation:**
- The `farmland_controller` component checks for crop growth stages using the correct property names
- The `crop_controller` component manages growth stages using the correct property syntax

For more details, see the [Block State Syntax](../functions/block_state_syntax.md) documentation.
