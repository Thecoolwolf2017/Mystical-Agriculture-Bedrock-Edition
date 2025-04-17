# Item Categories in Mystical Agriculture

## Overview

This document explains the item category system in Mystical Agriculture Bedrock Edition and how to properly categorize different types of items. Proper categorization is essential for ensuring items appear in the correct creative inventory tabs and function correctly within the game.

## Item Category Types

Minecraft Bedrock Edition uses item categories to organize items in the creative inventory and to determine how items behave in certain contexts. The main categories used in Mystical Agriculture are:

1. **Items** - For general items like seeds, essences, and crafting materials
2. **Equipment** - For tools, weapons, and armor (only use for actual wearable armor)
3. **Construction** - For blocks and building materials

## Proper Item Categorization

The following item types should use these specific categories:

### Items Category (`"category": "items"`)
- All seed items (e.g., `strat:air_seeds`, `strat:zombie_seeds`)
- All essence items (e.g., `strat:inferium_essence`, `strat:supremium_essence`)
- Crafting materials (e.g., `strat:prosperity_shard`, `strat:soulium_dust`)
- Tools and weapons (e.g., `strat:inferium_pickaxe`, `strat:watering_can`)
- Special items (e.g., `strat:infusion_crystal`, `strat:soul_jar`)

### Construction Category (`"category": "construction"`)
- Block items (e.g., `strat:inferium_block`, `strat:supremium_block`)
- Farmland blocks (e.g., `strat:inferium_farmland`, `strat:supremium_farmland`)
- Decorative blocks (e.g., `strat:soul_glass`)

### Equipment Category (`"category": "equipment"`)
- Armor pieces only (e.g., `strat:inferium_helmet`, `strat:supremium_boots`)

## Example of Correct Item JSON Format

```json
{
    "format_version": "1.20.80",
    "minecraft:item": {
        "description": {
            "identifier": "strat:example_seeds",
            "menu_category": {
                "category": "items"
            }
        },
        "components": {
            "minecraft:icon": "example_seeds",
            "minecraft:block_placer": {
                "block": "strat:example_crop"
            }
        }
    }
}
```

## Common Issues

Using the wrong category for items can cause several issues:

1. Items appearing in the wrong creative inventory tab
2. Warning messages in the console about item category mismatches
3. Potential compatibility issues with other mods or future Minecraft updates
4. Confusion for players when trying to find items

## Fixing Category Issues

### Manual Method
1. Open the item's JSON file
2. Locate the `"menu_category"` section
3. Update the category according to the guidelines above

### Automated Category Fixing

Two Node.js scripts have been created to automatically fix item categories:

1. **`BP\scripts\fix_seed_categories_node.js`** - Updates all seed items to use the "items" category
   - Fixed 68 seed files
   - Run with: `node BP\scripts\fix_seed_categories_node.js`

2. **`BP\scripts\fix_all_categories.js`** - Updates all remaining item categories
   - Fixed 79 essence items
   - Fixed 24 crafting items (soul jars, infusion crystals, etc.)
   - Fixed 36 tool items (daggers, pickaxes, swords, etc.)
   - Run with: `node BP\scripts\fix_all_categories.js`

## Script Error Fixes

In addition to item category fixes, the following script errors were addressed:

### 1. Duplicate Event Subscriptions

Fixed the error: `TypeError: cannot read property 'subscribe' of undefined at <anonymous> (infusion_all.js:218)`

The issue was caused by duplicate event handler subscriptions in `infusion_all.js`. The fix involved removing redundant event handlers to prevent conflicts.

### 2. Custom Component Warnings

The following component warnings are expected and can be safely ignored:
```
[Scripting][warning]-Component 'strat:farmland_controller' was not registered in script but used on a block
[Scripting][warning]-Component 'strat:crop_controller' was not registered in script but used on a block
```

These components are registered dynamically during gameplay and the warnings do not affect functionality.

## Maintaining Proper Categories

When adding new items to the mod, always follow these categorization guidelines to avoid warnings and ensure proper functionality. The item catalog (`BP\item_catalog\crafting_item_catalog.json`) expects items to be in their correct categories.
