# Testing Loot Tables in Mystical Agriculture

This document provides guidance on how to test the loot tables in Mystical Agriculture using Minecraft Bedrock's loot overload commands.

## Overview

Minecraft Bedrock provides several commands that allow you to test loot tables without actually breaking blocks or killing entities. These are particularly useful for:

- Verifying that ore blocks drop the correct items
- Testing the Silk Touch and Fortune enchantment functionality
- Debugging any issues with loot tables

## Testing Ore Drops

### Basic Mining Simulation

To test what items an ore block will drop when mined normally, use the `/mine` command:

```
/mine <x> <y> <z> mainhand
```

This simulates mining the block at the specified coordinates with the item in your main hand. For proper testing, hold different pickaxes with various enchantments.

### Examples:

1. Test Inferium Ore drops with a regular pickaxe:
   ```
   /mine <coordinates of inferium ore> mainhand
   ```

2. Test with a Fortune III pickaxe:
   Hold a pickaxe with Fortune III and run:
   ```
   /mine <coordinates of inferium ore> mainhand
   ```

3. Test with a Silk Touch pickaxe:
   Hold a pickaxe with Silk Touch and run:
   ```
   /mine <coordinates of inferium ore> mainhand
   ```

## Testing Container Loot

If you've created any chests with custom loot tables, you can test them using:

```
/loot spawn <x> <y> <z> loot "BP/loot_tables/path/to/table.json"
```

This will spawn the items from the specified loot table at the given coordinates.

## Populating Containers for Testing

You can fill a chest with the drops from a specific loot table using:

```
/loot replace block <x> <y> <z> slot.container 0 9 loot "BP/loot_tables/blocks/inferium_ore.json"
```

This fills slots 0-8 of the container with multiple rolls of the inferium ore loot table.

## Testing Multiple Drop Scenarios

To test how different tools affect the drops, you can set up a command block system that:

1. Places the ore block
2. Mines it with different tools
3. Collects and displays the results

This allows you to quickly visualize the different possible drops from each ore type.

## What to Check For

When testing ore loot tables, verify that:

1. **Basic Pickaxe Mining**: Drops the correct number of essence/shards (1-4)
2. **Fortune Enchantment**: Provides bonus drops (additional 1-3 items)
3. **Silk Touch Enchantment**: Drops the ore block itself with proper lore
4. **Tool Requirements**: No drops occur when mined without a pickaxe

## Troubleshooting Common Issues

- If no items drop, check that the loot table file exists and has the correct path
- If the wrong items drop, verify the entry names in the loot table
- If enchantments don't affect drops, ensure the enchantment predicates are correctly defined

---

This testing documentation will help ensure all ore loot tables function correctly in the Mystical Agriculture mod.
