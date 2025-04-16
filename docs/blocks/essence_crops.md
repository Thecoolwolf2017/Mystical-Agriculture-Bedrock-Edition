# Essence Crops

## Overview
Essence crops are the core of the Mystical Agriculture mod. They produce essence that can be used to craft various resources. The crops are organized into tiers, with each tier producing more powerful essence.

## Crop Tiers

### Tier 1: Inferium
- **Block Identifier**: `strat:inferium_crop`
- **Growth Stages**: 0-7
- **Produces**: Inferium Essence
- **Used in**: Basic crafting recipes and upgrading to higher tier essence

### Tier 2: Prudentium
- **Block Identifier**: `strat:prudentium_crop`
- **Growth Stages**: 0-7
- **Produces**: Prudentium Essence
- **Used in**: Intermediate crafting recipes and upgrading to higher tier essence

### Tier 3: Tertium
- **Block Identifier**: `strat:tertium_crop`
- **Growth Stages**: 0-7
- **Produces**: Tertium Essence
- **Used in**: Advanced crafting recipes and upgrading to higher tier essence

### Tier 4: Imperium
- **Block Identifier**: `strat:imperium_crop`
- **Growth Stages**: 0-7
- **Produces**: Imperium Essence
- **Used in**: High-tier crafting recipes and upgrading to supremium essence

### Tier 5: Supremium
- **Block Identifier**: `strat:supremium_crop`
- **Growth Stages**: 0-7
- **Produces**: Supremium Essence
- **Used in**: End-game crafting recipes

## Block Definition Structure

All essence crops follow a similar structure in their block definition files. Here's an example for the Imperium crop:

```json
{
  "format_version": "1.20.60",
  "minecraft:block": {
    "description": {
      "identifier": "strat:imperium_crop",
      "menu_category": {
        "category": "nature",
        "group": "itemGroup.name.seed"
      },
      "states": {
        "strat:growth_stage": [0, 1, 2, 3, 4, 5, 6, 7]
      }
    },
    "components": {
      "minecraft:collision_box": false,
      "minecraft:selection_box": {
        "origin": [-8, 0, -8],
        "size": [16, 4, 16]
      },
      "minecraft:placement_filter": {
        "conditions": [
          {
            "allowed_faces": ["up"],
            "block_filter": [
              "minecraft:farmland",
              "strat:mystical_growth_pot"
            ]
          }
        ]
      },
      "tag:crop": {},
      "tag:essence_crop": {},
      "tag:imperium_crop": {},
      "minecraft:custom_components": {
        "strat:crop_controller": {}
      }
    },
    "permutations": [
      // Growth stage permutations...
    ]
  }
}
```

## Growth Acceleration

Essence crops can be accelerated using growth accelerators and the crop growth functions. See the [Crop Growth Functions documentation](../functions/crop_growth.md) for more details.

## Technical Notes

- All essence crops use the `strat:growth_stage` property for their growth stages
- The crops can only be placed on farmland or mystical growth pots
- The crops use the `strat:crop_controller` custom component for growth logic
- Each crop has a corresponding loot table that defines what items drop when the crop is harvested
