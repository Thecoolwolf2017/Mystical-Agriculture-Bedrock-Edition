# Deprecated Components in Mystical Agriculture

This document tracks deprecated components that have been updated in the Mystical Agriculture Bedrock Edition addon to maintain compatibility with the latest Minecraft Bedrock Edition standards.

## Block Components

### Removed Empty Events Sections

In Minecraft Bedrock Edition 1.20.60, block events have been deprecated in favor of `minecraft:custom_components`. Even empty event sections need to be removed to comply with the latest standards.

The following blocks had their empty events sections removed:
- Storage blocks (all essence tiers)
- Ingot blocks (all essence tiers)
- Gemstone blocks (all essence tiers)

Example change:
```diff
  "components": {
    "minecraft:destructible_by_mining": {
      "seconds_to_destroy": 2
    },
    "minecraft:map_color": "#0D4AA1",
    "minecraft:destructible_by_explosion": {
      "explosion_resistance": 10.0
    },
    "tag:stone": {}
- },
- "events": {}
+ }
```

## Entity Components

### Updated Player Entity

The `minecraft:scaffolding_climber` component has been deprecated and replaced with `minecraft:block_climber`. This component allows players to detect and maneuver on scaffolding blocks.

```diff
  "minecraft:conditional_bandwidth_optimization": {},
- "minecraft:scaffolding_climber": {},
+ "minecraft:block_climber": {},
  "minecraft:environment_sensor": {
```

## Crop System Modernization

Crop files have been modernized with these key changes:

1. Updated format_version to 1.20.60
2. Removed deprecated components:
   - minecraft:geometry
   - minecraft:random_ticking
   - minecraft:on_interact
   - All event handlers

3. Added modern components:
   - tag:crop
   - tag:[crop_type]_crop (e.g., tag:mob_crop, tag:resource_crop)
   - tag:[crop_name]_crop (e.g., tag:obsidian_crop, tag:pig_crop)
   - minecraft:custom_components with strat:crop_controller

4. Added loot table references directly in the final growth stage permutation

5. Updated block_filter in placement_filter:
   - Changed "farmland" to "minecraft:farmland"
   - ~~Replaced "strat:fertile_soil" and "strat:crop_pot" with "strat:mystical_growth_pot"~~
   - Removed "strat:mystical_growth_pot" references as it has been completely removed from the addon
   - Now crops can only be placed on "strat:inferium_farmland" and "minecraft:farmland"

This modernization aligns with Minecraft Bedrock Edition 1.20.60 standards and improves performance by leveraging the JavaScript-based crop growth system.

## Item Components

### Deprecated Description Properties

In Minecraft Bedrock Edition 1.20.60, several item description properties have been deprecated:

1. The `category` property in the description section has been replaced with `menu_category`:

```diff
  "description": {
    "identifier": "strat:fire_agglomeratio",
-   "category": "items"
+   "menu_category": {
+     "category": "items"
+   }
  },
```

### Simplified Icon Format

The icon format has been simplified from an object to a direct string:

```diff
  "components": {
-   "minecraft:icon": {
-     "texture": "fire_agglomeratio"
-   },
+   "minecraft:icon": "fire_agglomeratio",
    "minecraft:display_name": {
```

### Removed Creative Category

The `minecraft:creative_category` component has been deprecated as it's now handled by the `menu_category` in the description:

```diff
    "minecraft:display_name": {
      "value": "Fire Agglomeratio"
-   },
-   "minecraft:creative_category": {
-     "parent": "items"
    }
  }
```

### Removed Empty Events

Empty events sections have been removed from item files:

```diff
  "components": {
    // components here
- },
- "events": {}
+ }
