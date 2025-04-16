# Loot Table Format Guidelines for Mystical Agriculture Bedrock Edition

## Namespace Updates

All loot tables in the Mystical Agriculture Bedrock Edition mod should use the `strat:` namespace instead of the old `mysticalagriculture:` namespace. This applies to all item references in the loot tables.

## Modern Loot Table Format

Loot tables should follow the current Minecraft Bedrock format:

1. Each pool should have:
   - `rolls`: Number of times to roll the pool
   - `entries`: Array of possible items to drop
   - `conditions`: (Optional) Array of conditions that must be met for the pool to be rolled

2. Each entry should have:
   - `type`: Usually "item"
   - `name`: Item identifier with the `strat:` namespace
   - `weight`: Relative chance of this item being selected (default: 1)
   - `functions`: (Optional) Array of functions to apply to the item

3. Fortune enchantment conditions should use:
   ```json
   "conditions": [
     {
       "condition": "minecraft:match_tool",
       "predicate": {
         "minecraft:is_pickaxe": true,
         "enchantments": [
           {
             "enchantment": "minecraft:fortune",
             "levels": {
               "min": 1,
               "max": 3
             }
           }
         ]
       }
     }
   ]
   ```

## Example Loot Table

```json
{
  "pools": [
    {
      "rolls": 1,
      "entries": [
        {
          "type": "item",
          "name": "strat:soulium_dust",
          "weight": 1,
          "functions": [
            {
              "function": "set_count",
              "count": {
                "min": 1,
                "max": 4
              }
            }
          ]
        }
      ]
    },
    {
      "rolls": 1,
      "entries": [
        {
          "type": "item",
          "name": "strat:soulium_dust",
          "weight": 1,
          "functions": [
            {
              "function": "set_count",
              "count": {
                "min": 1,
                "max": 3
              }
            }
          ]
        }
      ],
      "conditions": [
        {
          "condition": "minecraft:match_tool",
          "predicate": {
            "minecraft:is_pickaxe": true,
            "enchantments": [
              {
                "enchantment": "minecraft:fortune",
                "levels": {
                  "min": 1,
                  "max": 3
                }
              }
            ]
          }
        }
      ]
    }
  ]
}
```

## Common Issues and Solutions

1. **Cannot find behaviorpack loot_table definition**: This error occurs when:
   - The loot table file doesn't exist at the referenced path
   - The loot table file exists but has namespace issues
   - The loot table format is outdated or invalid

2. **Fixing namespace issues**:
   - Change all `mysticalagriculture:` prefixes to `strat:`
   - Update enchantment references to include the `minecraft:` prefix

3. **Fixing format issues**:
   - Add `weight` property to all entries
   - Update condition format to use `predicate` structure
   - Place conditions after entries in each pool
