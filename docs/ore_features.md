# Ore Features in Mystical Agriculture Bedrock Edition

This document outlines the proper format and structure for defining ore features in the Mystical Agriculture Bedrock Edition mod, as well as special functionality such as XP drops.

## Key Components

### 1. Feature Files

Feature files define what blocks to place and where they can replace existing blocks. They are located in the `BP/features/` directory.

#### Ore Feature Format

```json
{
  "format_version": "1.20.80",
  "minecraft:ore_feature": {
    "description": {
      "identifier": "strat:example_ore_feature"
    },
    "count": 9,
    "replace_rules": [
      {
        "places_block": "strat:example_ore",
        "may_replace": [
          "minecraft:deepslate",
          "minecraft:stone",
          "minecraft:andesite",
          "minecraft:granite",
          "minecraft:diorite"
        ]
      }
    ]
  }
}
```

**Important Notes:**
- The `places_block` property must be a string, not an object
- The `may_replace` array must contain strings, not objects with "name" and "states" properties
- All block identifiers should use the "strat:" namespace for mod blocks

### 2. Feature Rule Files

Feature rule files control when and where features are placed in the world. They are located in the `BP/feature_rules/` directory.

#### Feature Rule Format

```json
{
  "format_version": "1.20.80",
  "minecraft:feature_rules": {
    "description": {
      "identifier": "strat:example_ore_feature_rule",
      "places_feature": "strat:example_ore_feature"
    },
    "conditions": {
      "placement_pass": "underground_pass",
      "minecraft:biome_filter": [
        {
          "test": "has_biome_tag",
          "operator": "==",
          "value": "overworld"
        }
      ]
    },
    "distribution": {
      "iterations": 10,
      "coordinate_eval_order": "xzy",
      "x": {
        "distribution": "uniform",
        "extent": [0, 16]
      },
      "y": {
        "distribution": "uniform",
        "extent": [0, 64]
      },
      "z": {
        "distribution": "uniform",
        "extent": [0, 16]
      }
    }
  }
}
```

**Important Notes:**
- The `placement_pass` determines when the feature is generated (use "underground_pass" for ores)
- The `minecraft:biome_filter` controls which biomes the feature generates in
- The `distribution` settings control how frequently and densely the ores appear

## Common Ore Types in Mystical Agriculture

The mod includes several ore types, each with specific generation parameters:

1. **Inferium Ore**
   - Generates in the overworld at various heights
   - Has both stone and deepslate variants

2. **Prosperity Ore**
   - Generates in the overworld at various heights
   - Has both stone and deepslate variants

3. **Soulium Ore**
   - Generates in the Nether
   - Replaces netherrack

4. **Soulstone**
   - Generates in the End
   - Replaces end stone

## Namespace Standards

All feature and feature rule identifiers should use the "strat:" namespace, replacing the old "mysticalagriculture:" namespace.

## Ore XP System

Ore blocks in Mystical Agriculture automatically drop experience orbs when mined. This is handled by a global event system that detects when players break ore blocks.

### XP Drop Mechanics

1. **XP Detection**: The system uses `world.beforeEvents.playerBreakBlock` to detect when a player breaks an ore block

2. **Ore Identification**: Blocks are identified as ores through one of three methods:
   - Having the "ore" tag
   - Having "_ore" in their typeId
   - Being a prosperity, inferium, or soulium block

3. **XP Amount**: Different ores drop different amounts of XP:
   - Diamond/Emerald: 3-7 XP
   - Lapis: 2-5 XP
   - Redstone: 1-5 XP
   - Gold/Quartz/Coal: 0-2 XP
   - Iron/Copper: 0-1 XP
   - Prosperity/Inferium/Soulium: 1-3 XP

4. **XP Spawn**: XP orbs are spawned with slight position randomization for a more natural effect

### Implementation Notes

- The ore XP system is implemented in `BP/scripts/utils/oreUtils.js`
- XP orbs are spawned through the `system.run()` method to ensure they appear after the block is broken
- Debug logging helps track XP drops with messages like: `[MYSTICAL AGRICULTURE] Spawning X XP from block_id at x, y, z`

### Adding Custom Ore XP Rules

To make a custom block drop XP when mined:

1. **Block Definition**: Add the custom component to the block's JSON definition:

```json
"minecraft:custom_components": [
  "strat:ore_xp"
]
```

2. **Block ID**: Ensure the block's ID contains one of these terms for automatic detection:
   - "_ore" (e.g., "strat:example_ore")
   - "prosperity", "inferium", or "soulium"

Alternatively, you can manually add XP drop behavior for custom blocks by extending the ore identification logic in `oreUtils.js`.

## References

- [Minecraft Bedrock Documentation - Features](https://learn.microsoft.com/en-us/minecraft/creator/documents/featuredocumentation)
- [Minecraft Bedrock Documentation - Ore Features](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/featuresreference/examples/minecraftfeatures/minecraft_ore_feature)
