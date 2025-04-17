# Mystical Agriculture Bedrock Edition Code Structure

This document outlines the code structure and module organization of the Mystical Agriculture Bedrock Edition mod to help with future maintenance and development.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Directory Structure](#directory-structure)
3. [Key Files and Modules](#key-files-and-modules)
4. [Component System](#component-system)
5. [Event Handling](#event-handling)
6. [Utility Functions](#utility-functions)
7. [Dependency Management](#dependency-management)

## Project Overview

Mystical Agriculture is a mod that adds resource crops to Minecraft, allowing players to grow various resources. The Bedrock Edition port adapts the original Java Edition mod to work with Minecraft Bedrock's scripting API.

## Directory Structure

```
Mystical Agriculture [RP] (dev)/
├── BP/
│   ├── blocks/
│   │   ├── infusion_pedestal.json
│   │   ├── ore/
│   │   │   ├── deepslate_inferium_ore.json
│   │   │   ├── deepslate_prosperity_ore.json
│   │   │   ├── inferium_ore.json
│   │   │   ├── prosperity_ore.json
│   │   │   └── soulium_ore.json
│   │   └── ... (other block definitions)
│   ├── docs/
│   │   ├── components/
│   │   │   └── component_registration.md
│   │   ├── functions/
│   │   │   └── crop_growth.md
│   │   └── error_fixes.md
│   ├── items/
│   │   ├── prosperity/
│   │   │   └── prosperity_shard.json
│   │   ├── soulium/
│   │   │   └── soulium_dust.json
│   │   └── ... (other item definitions)
│   └── scripts/
│       ├── classes/
│       │   └── cropManager.js
│       ├── components/
│       │   └── blockComponents.js
│       ├── kaioga5/
│       │   └── slab/
│       │       ├── onInteract.js
│       │       └── onPlayerDestroy.js
│       ├── tools/
│       │   ├── durability.js
│       │   ├── interactions.js
│       │   ├── scythe.js
│       │   ├── sickle.js
│       │   └── watering_can.js
│       ├── utils/
│       │   └── oreUtils.js
│       ├── experience_capsule.js
│       ├── farmland.js
│       ├── fix_all_script_errors.js
│       ├── guide_book.js
│       ├── infusion_all.js
│       ├── infusion_crystal.js
│       ├── items_lore.js
│       ├── main.js
│       ├── player_view.js
│       ├── soul_jar.js
│       └── stairPlacement.js
└── RP/ (Resource Pack)
    └── ... (textures, models, etc.)
```

## Key Files and Modules

### Main Entry Point
- `main.js`: The primary entry point for the mod. Imports all necessary modules and sets up the mod's functionality.

### Core Functionality
- `farmland.js`: Handles custom farmland behavior for growing resource crops.
- `infusion_all.js`: Manages the infusion altar system for creating higher-tier seeds.
- `infusion_crystal.js`: Handles the infusion crystal item used in the infusion process.
- `stairPlacement.js`: Manages custom stair placement behavior.

### Component System
- `components/blockComponents.js`: Centralizes the registration of all custom block components.
- `kaioga5/slab/onInteract.js`: Handles custom slab interaction behavior.
- `kaioga5/slab/onPlayerDestroy.js`: Handles custom slab destruction behavior.

### Tools
- `tools/interactions.js`: Manages tool interaction behaviors.
- `tools/durability.js`: Handles tool durability mechanics.
- `tools/sickle.js`: Implements the sickle tool functionality.
- `tools/scythe.js`: Implements the scythe tool functionality.
- `tools/watering_can.js`: Implements the watering can tool functionality.

### Utilities
- `utils/oreUtils.js`: Contains utility functions for ore-related functionality.
- `fix_all_script_errors.js`: Automated script to detect and fix common errors.

## Component System

The mod uses a custom component system to add behavior to blocks and items. Components are registered during the `worldInitialize` event and then referenced in block and item JSON files.

### Component Registration

Components are registered in `blockComponents.js`:

```javascript
const blockComponents = [
    {
        id: "strat:custom_crop",
        code: {
            // Component implementation
        }
    },
    // Other components...
];

if (world.beforeEvents.worldInitialize) {
    world.beforeEvents.worldInitialize.subscribe(eventData => {
        for (const component of blockComponents) {
            eventData.blockComponentRegistry.registerCustomComponent(component.id, component.code);
        }
    });
}
```

### Component Usage

Components are referenced in block JSON files:

```json
{
    "format_version": "1.20.60",
    "minecraft:block": {
        "description": {
            "identifier": "strat:inferium_crop",
            "menu_category": {
                "category": "nature"
            }
        },
        "components": {
            "minecraft:material_instances": {
                "*": {
                    "texture": "inferium_crop_stage0",
                    "render_method": "alpha_test"
                }
            },
            "strat:crop_controller": {}
        }
    }
}
```

## Event Handling

The mod uses Minecraft Bedrock's event system to respond to player actions and game events. Event handlers are set up with safety checks to prevent errors:

```javascript
if (world.beforeEvents.worldInitialize) {
    world.beforeEvents.worldInitialize.subscribe(eventData => {
        // Event handling code
    });
}
```

## Utility Functions

Utility functions are organized in the `utils` directory to promote code reuse and prevent circular dependencies:

```javascript
// utils/oreUtils.js
export function handleOreXpDrop(result) {
    // Function implementation
}
```

## Dependency Management

To prevent circular dependencies, the mod follows these principles:

1. **Hierarchical Imports**: Maintain a clear hierarchy of imports, with `main.js` at the top.
2. **Utility Modules**: Move shared functionality to utility modules.
3. **Component Centralization**: Keep all component registrations in one place.
4. **Explicit Dependencies**: Make dependencies explicit through imports.

Example of proper dependency management:

```javascript
// main.js imports components and utilities
import './components/blockComponents';
import './utils/oreUtils';

// blockComponents.js imports from utilities
import { handleOreXpDrop } from '../utils/oreUtils';

// Utilities have no dependencies on main modules
// utils/oreUtils.js
import * as server from "@minecraft/server";
export function handleOreXpDrop(result) { /* ... */ }
```

---

Last updated: April 16, 2025
