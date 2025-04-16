# Loot Tables in Mystical Agriculture

This guide explains the structure and organization of loot tables in the Mystical Agriculture Bedrock Edition mod.

## Directory Structure

Loot tables are organized into specific directories based on their purpose:

- `loot_tables/seeds/` - Contains loot tables for crops (e.g., `air_crop.json`)
- `loot_tables/resources/` - Contains loot tables for resource blocks (e.g., `cobbled_soulstone.json`)
- `loot_tables/ores/` - Contains loot tables for ore blocks (e.g., `inferium_ore.json`)

## Loot Table Types

### Crop Loot Tables

Crop loot tables typically contain:
- Seeds (for replanting)
- Essence (the main resource)
- Chance for fertilized essence (bonus drop)

Example (`air_crop.json`):
```json
{
  "pools": [
    {
      "rolls": 1,
      "entries": [
        {
          "type": "item",
          "name": "strat:air_seeds"
        }
      ]
    },
    {
      "rolls": 1,
      "entries": [
        {
          "type": "item",
          "name": "strat:air_essence"
        }
      ]
    },
    {
      "rolls": 1,
      "entries": [
        {
          "type": "item",
          "name": "strat:fertilized_essence",
          "weight": 1
        },
        {
          "type": "empty",
          "weight": 9
        }
      ]
    }
  ]
}
```

### Block Loot Tables

Block loot tables typically contain:
- The block itself
- Sometimes with count functions

Example (`cobbled_soulstone.json`):
```json
{
  "pools": [
    {
      "rolls": 1,
      "entries": [
        {
          "type": "item",
          "name": "strat:cobbled_soulstone",
          "functions": [
            {
              "function": "set_count",
              "count": 1
            }
          ]
        }
      ]
    }
  ]
}
```

## Referencing Loot Tables

When referencing loot tables in block definitions, make sure the path matches the actual location of the loot table file:

```json
"minecraft:loot": "loot_tables/seeds/air_crop.json"
```

The path is relative to the behavior pack root directory.

## Common Issues

1. **Missing Loot Table Error**: If you see an error like `Cannot find behaviorpack loot_table definition`, check that:
   - The loot table file exists
   - The path in the block definition matches the actual location
   - The filename matches exactly (case-sensitive)

2. **Empty Drops**: If a block doesn't drop anything when broken, check that:
   - The loot table is correctly referenced
   - The loot table contains the correct item names
   - The block's destruction component is properly configured
