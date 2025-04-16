# Mystical Agriculture Crop System

This guide explains the modern crop growth system implemented in Mystical Agriculture Bedrock Edition.

## Overview

The crop system in Mystical Agriculture has been modernized to use JavaScript-based controllers instead of the deprecated `minecraft:random_ticking` component. This approach aligns with Minecraft Bedrock Edition 1.20.60's direction for custom block behavior.

## Implementation Options

Mystical Agriculture currently supports two JavaScript-based crop growth implementations:

### 1. Custom Component Approach (`crop_controller.js`)

This is the newer implementation that uses Minecraft's custom component system:

- Defined in `BP/scripts/crop_controller.js`
- Registers a custom component `strat:crop_controller` that handles growth logic
- Works with crop blocks directly
- Uses block permutations and states for growth stages
- Handles player interactions (fertilizing, harvesting)

### 2. Ticking Area Approach (`crop_growth.js`)

This is an alternative implementation that uses ticking areas:

- Defined in `BP/scripts/crop_growth.js`
- Uses ticking areas to process crop growth in chunks
- Supports growth accelerators in a radius
- Handles standard crop blocks placed in the world
- Processes dimensions separately for better performance

Both implementations can coexist, with the custom component approach being preferred for new development.

## Technical Implementation

### Block Definition

Each crop block now uses the following components:

```json
{
  "tag:crop": {},
  "tag:[crop_type]_crop": {},
  "minecraft:custom_components": ["strat:crop_controller"]
}
```

The `strat:crop_controller` custom component handles all crop growth and bone meal interactions.

### Growth Stages

Crops have growth stages defined in the block's states:

```json
"states": {
  "strat:growth_stage": [0, 1, 2, 3, 4, 5, 6]
}
```

### Textures

Crops follow a consistent texture pattern:
- Stages 0-5: Generic growth textures
- Stage 6: Crop-specific textures (e.g., `mystical_air_crop_6`, `mystical_iron_crop_6`, etc.)

### Loot Tables

Loot tables are specified in the final growth stage permutation:

```json
"condition": "query.block_state('strat:growth_stage') == 6",
"components": {
  "minecraft:loot": "loot_tables/seeds/crop_name.json"
}
```

## Crop Categories

Crops are categorized using tags:

1. **Element Crops**: `tag:element_crop` (air, earth, water, fire)
2. **Resource Crops**: `tag:resource_crop` (iron, gold, diamond, etc.)
3. **Mob Crops**: `tag:mob_crop` (zombie, skeleton, creeper, etc.)
4. **Special Crops**: `tag:special_crop` (experience, soul, etc.)

## Growth Acceleration

Crops can be accelerated using:

1. **Growth Accelerators**: Blocks that speed up crop growth in a radius
2. **Mystical Fertilizer**: Instantly grows crops to maturity
3. **Fertilized Essence**: Enhanced bone meal effect

## Upgrading from Previous Versions

When updating crop files from older versions:

1. Update `format_version` to "1.20.60"
2. Remove deprecated components:
   - `minecraft:geometry`
   - `minecraft:random_ticking`
   - `minecraft:on_interact`
3. Add tag components for categorization
4. Add the `minecraft:custom_components` with `strat:crop_controller`
5. Remove the events section (handled by the controller)
6. Add loot table reference to the final growth stage

## Troubleshooting

If crops aren't growing properly:

1. Check that the crop block definitions include the custom component
2. Verify that the JavaScript controller is properly registered
3. Ensure the crop growth functions are correctly implemented
4. Check for errors in the JavaScript console using `/scriptevent strat:debug_log`

## Script Configuration

The crop controller scripts can be configured by modifying the constants at the top of each file:

### `crop_controller.js` Constants:
```javascript
const CROP_CONTROLLER_COMPONENT = "strat:crop_controller";
const CROP_IDENTIFIER_PREFIX = "strat:";
```

### `crop_growth.js` Constants:
```javascript
const GROWTH_CHECK_INTERVAL = 20; // Ticks between growth checks (1 second)
const GROWTH_CHANCE = 0.15;      // Chance for a crop to grow on each check
const BONE_MEAL_GROWTH_CHANCE = 0.33; // Chance for bone meal to advance growth
