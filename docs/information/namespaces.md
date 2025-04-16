# Namespace Standardization

## Overview

This document outlines the namespace standardization for the Mystical Agriculture Bedrock Edition mod. All identifiers in the mod have been updated to use the `strat:` namespace instead of the previous `mysticalagriculture:` namespace.

## Namespace Changes

### Block Identifiers

All block identifiers have been updated to use the `strat:` namespace:

```json
"identifier": "strat:block_name"
```

### Item Identifiers

All item identifiers have been updated to use the `strat:` namespace:

```json
"identifier": "strat:item_name"
```

### Block States

Block states have been updated to use the `strat:` namespace:

```json
"states": {
    "strat:growth_stage": [0, 1, 2, 3, 4, 5, 6, 7]
}
```

### Custom Components

Custom components have been updated to use the `strat:` namespace:

```json
"minecraft:custom_components": [
    "strat:crop_controller"
]
```

### Loot Tables

Loot tables have been updated to reference items with the `strat:` namespace:

```json
"name": "strat:item_name"
```

## Farmland Blocks

The following farmland blocks have been updated to use the `strat:` namespace:

- `strat:inferium_farmland`
- `strat:prudentium_farmland`
- `strat:tertium_farmland`
- `strat:imperium_farmland`
- `strat:supremium_farmland`

## Crop Blocks

All crop blocks have been updated to use the `strat:` namespace and reference farmland blocks with the correct namespaces:

```json
"block_filter": [
    "minecraft:farmland",
    "strat:inferium_farmland",
    "strat:prudentium_farmland",
    "strat:tertium_farmland",
    "strat:imperium_farmland",
    "strat:supremium_farmland"
]
```

## Updating Process

When updating files to use the new namespace, make sure to:

1. Update the block/item identifier
2. Update any block states
3. Update custom component references
4. Update loot table references
5. Update any block filters that reference other blocks
6. Create or update loot tables to use the new namespace

## Common Issues

- Missing loot tables: Make sure to create loot tables for all blocks using the correct namespace
- Block reference errors: Make sure all block references use the correct namespace
- Custom component errors: Make sure all custom components are properly defined with the new namespace
- Block placer errors: Make sure seed items correctly reference crop blocks with the proper namespace

## Seed Items

Seed items require special attention as they use the `minecraft:block_placer` component to reference crop blocks:

```json
"minecraft:block_placer": {
    "block": "strat:crop_name"
}
```

Errors like `Cannot find block definition: mysticalagriculture:air_crop` indicate that a seed item is still using the old namespace to reference a crop block. To fix this:

1. Update the seed item's identifier to use the `strat:` namespace
2. Update the `block` property in the `minecraft:block_placer` component to use the `strat:` namespace

Example of a correctly updated seed item:

```json
{
    "format_version": "1.20.80",
    "minecraft:item": {
        "description": {
            "identifier": "strat:air_seeds",
            "menu_category": {
                "category": "equipment"
            }
        },
        "components": {
            "minecraft:icon": "air_seeds",
            "minecraft:block_placer": {
                "block": "strat:air_crop"
            }
        }
    }
}
```
