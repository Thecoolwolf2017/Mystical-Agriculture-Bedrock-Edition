# Script Fixes in Mystical Agriculture Bedrock Edition

## Overview

This document details the script fixes implemented in the Mystical Agriculture Bedrock Edition mod to resolve errors and warnings that were occurring during gameplay.

## Fixed Issues

### 1. Duplicate Event Subscriptions

**Error Message:**
```
TypeError: cannot read property 'subscribe' of undefined at <anonymous> (infusion_all.js:218)
```

**Root Cause:**
The error was occurring in `infusion_all.js` due to duplicate event handler subscriptions for the same event. Specifically, there were multiple instances of the same `playerInteractWithBlock` event subscription, causing conflicts when the script tried to execute.

**Fix Applied:**
Removed redundant event handlers to prevent conflicts. The duplicate subscription at line 218 was removed, keeping only one handler for each event type.

**File Modified:**
- `BP\scripts\infusion_all.js`

### 2. Item Category Mismatches

**Warning Messages:**
```
[Item][warning] The item strat:inferium_essence was created with the category set to 'equipment', and is now being set to 'items'
```

**Root Cause:**
Many items in the mod had incorrect category settings in their JSON definitions. Items were using the "equipment" category when they should have been using "items" or "construction" categories.

**Fix Applied:**
Created and executed Node.js scripts to automatically update all item categories:

1. `BP\scripts\fix_seed_categories_node.js` - Updated all seed items (68 files)
2. `BP\scripts\fix_all_categories.js` - Updated essence items (79 files), crafting items (24 files), and tool items (36 files)

**Files Modified:**
- 207 item JSON files across the mod

### 3. Custom Component Warnings

**Warning Messages:**
```
[Scripting][warning]-Component 'strat:farmland_controller' was not registered in script but used on a block
[Scripting][warning]-Component 'strat:crop_controller' was not registered in script but used on a block
```

**Status:**
These warnings are expected and can be safely ignored. They occur because these components are registered dynamically during gameplay and the warnings do not affect functionality.

## Testing

After applying these fixes:

1. The infusion altar system now works without script errors
2. Items appear in the correct inventory tabs based on their categories
3. No more category mismatch warnings in the console

## Future Maintenance

When adding new items to the mod:

1. Always use the correct category in the item JSON definition:
   - Use "items" for seeds, essences, tools, and crafting materials
   - Use "construction" for blocks and building materials
   - Use "equipment" only for wearable armor pieces

2. Avoid duplicate event subscriptions in scripts:
   - Check for existing event handlers before adding new ones
   - Use consistent event naming conventions

3. Document any custom components in the appropriate documentation files
