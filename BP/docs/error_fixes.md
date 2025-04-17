# Mystical Agriculture Bedrock Edition Error Fixes

This document outlines the common errors encountered in the Mystical Agriculture Bedrock Edition mod and the solutions implemented to fix them.

## Table of Contents
1. [TypeError: cannot read property 'subscribe' of undefined](#typeerror-cannot-read-property-subscribe-of-undefined)
2. [ReferenceError: handleOreXpDrop is not initialized](#referenceerror-handleorexpdrop-is-not-initialized)
3. [Component Registration Warnings](#component-registration-warnings)
4. [Block Geometry Warnings](#block-geometry-warnings)
5. [Item Category Issues](#item-category-issues)
6. [Best Practices](#best-practices)

## TypeError: cannot read property 'subscribe' of undefined

### Problem
This error occurs when the code attempts to subscribe to an event that doesn't exist or isn't available in the current context. In Minecraft Bedrock Edition, certain events might not be available depending on the game state or API version.

### Affected Files
- `infusion_all.js`
- `farmland.js`
- `stairPlacement.js`
- `kaioga5/slab/onInteract.js`
- `kaioga5/slab/onPlayerDestroy.js`

### Solution
Added safety checks before subscribing to events:

```javascript
// Before (problematic code)
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // Event handler code
});

// After (fixed code)
if (world.beforeEvents.worldInitialize) {
    world.beforeEvents.worldInitialize.subscribe(eventData => {
        // Event handler code
    });
}
```

This pattern ensures that the code only attempts to subscribe to events that exist, preventing TypeErrors.

## ReferenceError: handleOreXpDrop is not initialized

### Problem
This error was caused by a circular dependency between `main.js` and `blockComponents.js`. The `blockComponents.js` file was trying to import the `handleOreXpDrop` function from `main.js`, but `main.js` was also importing `blockComponents.js`.

### Affected Files
- `main.js`
- `components/blockComponents.js`

### Solution
1. Created a new utility file `utils/oreUtils.js` to contain the ore XP drop functionality
2. Moved the `handleOreXpDrop` function from `main.js` to this dedicated utility file
3. Updated import references in both `main.js` and `blockComponents.js` to import from the utility file

```javascript
// New file: utils/oreUtils.js
import * as server from "@minecraft/server";

export function handleOreXpDrop(result) {
    // Function implementation
}

// In blockComponents.js
import { handleOreXpDrop } from '../utils/oreUtils';

// In main.js
import './utils/oreUtils';
```

This approach resolves the circular dependency by:
- Moving shared functionality to a separate utility module
- Having both files import from this utility module
- Eliminating the need for main.js to export functions that blockComponents.js needs

## Component Registration Warnings

### Problem
Custom components were being used in blocks but weren't properly registered in the script, causing warnings.

### Affected Components
- `strat:farmland_controller`
- `kai:on_player_destroy_slab`
- `strat:custom_crop`
- `kai:on_interact_slab`
- `strat:none`
- `strat:crop_controller`
- `strat:ore_xp`
- `strat:altar_check`
- `template:stair_placement`
- `strat:pedestal_place`

### Solution
Ensured all components are properly registered in `blockComponents.js` during the `worldInitialize` event:

```javascript
// In blockComponents.js
const blockComponents = [
    {
        id: "strat:custom_crop",
        code: {
            // Component implementation
        }
    },
    // Other component registrations
];

// Registration during worldInitialize
if (world.beforeEvents.worldInitialize) {
    world.beforeEvents.worldInitialize.subscribe(eventData => {
        for (const component of blockComponents) {
            eventData.blockComponentRegistry.registerCustomComponent(component.id, component.code);
        }
    });
}
```

## Block Geometry Warnings

### Problem
Some ore blocks were using the deprecated `minecraft:geometry` component, causing warnings.

### Affected Files
- `deepslate_inferium_ore.json`
- `deepslate_prosperity_ore.json`
- `soulium_ore.json`

### Solution
Removed the deprecated `minecraft:geometry` component from these block definition files, as it's no longer needed in newer Minecraft Bedrock Edition versions.

## Item Category Issues

### Problem
Some items had incorrect menu categories, causing them to appear in inappropriate inventory tabs.

### Affected Files
- `prosperity_shard.json`
- `soulium_dust.json`
- `infusion_pedestal.json`

### Solution
Updated the menu categories to more appropriate values:
- Changed from 'equipment' to 'items' for `prosperity_shard.json` and `soulium_dust.json`
- Changed from 'equipment' to 'construction' for `infusion_pedestal.json`

## Best Practices

To prevent similar errors in the future, follow these best practices:

1. **Always check if events exist before subscribing to them**:
   ```javascript
   if (world.beforeEvents.someEvent) {
       world.beforeEvents.someEvent.subscribe(handler);
   }
   ```

2. **Avoid circular dependencies**:
   - Move shared functionality to separate utility files
   - Design a clear dependency hierarchy
   - Use dependency injection where appropriate

3. **Register all custom components during worldInitialize**:
   - Keep component registrations centralized
   - Ensure all components are registered before they're used

4. **Stay updated with Minecraft API changes**:
   - Remove deprecated components
   - Update to newer API patterns
   - Test with the latest Minecraft version

5. **Use appropriate item categories**:
   - 'items' for general items
   - 'construction' for building blocks
   - 'equipment' for tools, weapons, and armor
   - 'nature' for plants and natural items

By following these practices, you can maintain a more stable and error-free mod experience.

## Automated Error Fixing

The mod includes an automated error fixing script (`fix_all_script_errors.js`) that can detect and fix many common issues. Run this script whenever you make significant changes to ensure everything is working correctly.

```javascript
node "BP/scripts/fix_all_script_errors.js"
```

The script checks for:
- Unsafe event subscriptions
- Missing component registrations
- Deprecated block components
- Incorrect item categories

---

Last updated: April 16, 2025
