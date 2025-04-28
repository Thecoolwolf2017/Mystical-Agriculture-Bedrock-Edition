# Ore Drop Mechanics

## Overview

This document outlines the drop mechanics for all ore blocks in Mystical Agriculture Bedrock Edition.

## Inferium Ore Drops

Both regular and deepslate inferium ore blocks have the following drop mechanics:

- **Normal Mining**: 1-4 Inferium Essence when mined with any pickaxe
- **Fortune Bonus**: Additional 1-3 essence when mined with Fortune enchantment (levels 1-3)
- **Silk Touch**: Drops the actual ore block when mined with Silk Touch enchantment
  - These Silk Touch drops include special lore about the ore's properties
  - Regular inferium mentions it "can be smelted for bonus Inferium"
  - Deepslate inferium notes it's "deep in the earth, enriched with essence"
- **Tool Requirements**: Any pickaxe (required)
- **Location**: `BP/loot_tables/blocks/inferium_ore.json` and `BP/loot_tables/blocks/deepslate_inferium_ore.json`

## Prosperity Ore Drops

Both regular and deepslate prosperity ore blocks have the following drop mechanics:

- **Normal Mining**: 1-4 Prosperity Shards when mined with any pickaxe
- **Fortune Bonus**: Additional 1-3 shards when mined with Fortune enchantment (levels 1-3)
- **Silk Touch**: Drops the actual ore block when mined with Silk Touch enchantment
  - These Silk Touch drops include special lore about the ore's properties
  - Regular prosperity is described as "a source of pure prosperity" 
  - Deepslate prosperity is noted as being "fortified by the deep stone"
- **Tool Requirements**: Any pickaxe (required)
- **Location**: `BP/loot_tables/blocks/prosperity_ore.json` and `BP/loot_tables/blocks/deepslate_prosperity_ore.json`

## Soulium Ore Drops

Soulium ore has the following drop mechanics:

- **Normal Mining**: 1-4 Soul Dust when mined with any pickaxe
- **Fortune Bonus**: Additional 1-3 dust when mined with Fortune enchantment (levels 1-3)
- **Silk Touch**: Drops the actual ore block when mined with Silk Touch enchantment
  - This Silk Touch drop includes special lore describing it as containing "the essence of souls"
  - Notes that it "can be smelted for bonus Soul Dust"
- **Tool Requirements**: Any pickaxe (required)
- **Location**: `BP/loot_tables/blocks/soulium_ore.json`

## Implementation Details

All ore blocks in Mystical Agriculture use the following mechanics:

### Loot Table Structure

Each ore has three drop pools:

1. **Silk Touch Pool**: Drops the ore block itself when mined with Silk Touch
   - Uses the `set_lore` function to add special descriptions to the ore blocks
   - Each ore type has unique lore that hints at its purpose and value
2. **Base Drop Pool**: Drops essence/shards when mined with a normal pickaxe
3. **Fortune Pool**: Provides bonus drops when mined with Fortune enchantment

### Loot Table Conditions

- **Pickaxe Requirement**: Uses the `minecraft:match_tool` condition with `minecraft:is_pickaxe` predicate
- **Enchantment Detection**: Checks for specific enchantments like Silk Touch and Fortune
- **Enchantment Exclusivity**: Fortune bonuses don't apply when Silk Touch is present

### Example Structure

```json
{
  "pools": [
    {
      "rolls": 1,
      "entries": [
        {
          "type": "item",
          "name": "strat:ore_block_name",
          "weight": 1,
          "functions": [
            {
              "function": "set_lore",
              "lore": [
                "Carefully extracted with Silk Touch",
                "Custom lore specific to this ore type",
                "Can be smelted for bonus resources"
              ]
            }
          ]
        }
      ],
      "conditions": [
        {
          "condition": "minecraft:match_tool",
          "predicate": {
            "minecraft:is_pickaxe": true,
            "enchantments": [{ "enchantment": "minecraft:silk_touch", "levels": { "min": 1 } }]
          }
        }
      ]
    },
    // Additional pools for normal and fortune drops
                "min": 1,
                "max": 4
              }
            }
          ]
        }
      ],
      "conditions": [
        // Tool conditions if applicable
      ]
    }
  ]
}
```

Deepslate variants have identical drop mechanics to their regular counterparts, providing consistency across all world generation layers.
