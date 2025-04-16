# Ore Features in Mystical Agriculture Bedrock Edition

This document outlines the proper format and structure for defining ore features in the Mystical Agriculture Bedrock Edition mod.

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

## References

- [Minecraft Bedrock Documentation - Features](https://learn.microsoft.com/en-us/minecraft/creator/documents/featuredocumentation)
- [Minecraft Bedrock Documentation - Ore Features](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/featuresreference/examples/minecraftfeatures/minecraft_ore_feature)
