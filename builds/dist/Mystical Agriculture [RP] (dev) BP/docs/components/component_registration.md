# Custom Component Registration in Mystical Agriculture

This document explains how custom components are registered and used in the Mystical Agriculture Bedrock Edition mod.

## Overview

Custom components allow blocks and items to have specialized behaviors in Minecraft Bedrock Edition. The mod uses the `WorldInitializeBeforeEvent` to register these components during world initialization.

## Component Registration Process

Components are registered in the following way:

1. Components are defined in `BP/scripts/components/blockComponents.js`
2. The `WorldInitializeBeforeEvent` is used to register these components with Minecraft
3. Each component has specific event handlers (onPlace, onTick, onPlayerInteract, etc.)

## Registered Components

The following custom components are registered in the mod:

| Component ID | Purpose |
|--------------|---------|
| strat:farmland_controller | Handles custom farmland behavior including moisture and crop growth |
| kai:on_player_destroy_slab | Handles custom behavior when slabs are destroyed |
| strat:custom_crop | Manages custom crop behavior |
| kai:on_interact_slab | Handles player interaction with slabs |
| strat:none | A placeholder component for blocks that need minimal custom behavior |
| strat:crop_controller | Controls crop growth and interaction |
| strat:ore_xp | Handles XP drops from custom ore blocks |
| strat:altar_check | Manages the infusion altar mechanics |
| template:stair_placement | Controls custom stair placement behavior |
| strat:pedestal_place | Manages infusion pedestal functionality |

## Implementation Details

### Component Registration Code

Components are registered during world initialization using the following pattern:

```javascript
world.beforeEvents.worldInitialize.subscribe(event => {
    for (const component of blockComponents) {
        event.blockComponentRegistry.registerCustomComponent(component.id, component.code);
    }
});
```

### Error Handling

To prevent errors when the `worldInitialize` event is not available, we use a safety check:

```javascript
if (world.beforeEvents.worldInitialize) {
    world.beforeEvents.worldInitialize.subscribe(event => {
        // Registration code
    });
}
```

## Troubleshooting

If you see warnings about components not being registered, check:

1. The component is defined in `blockComponents.js`
2. The component ID matches exactly what's used in block definitions
3. The `worldInitialize` event subscription is working properly

## Adding New Components

To add a new custom component:

1. Add a new entry to the `blockComponents` array in `blockComponents.js`
2. Define the appropriate event handlers
3. Use the component in block definitions with `minecraft:custom_components`

Example:

```javascript
{
    id: "strat:my_new_component",
    code: {
        onPlace: (data) => {
            // Implementation
        },
        onPlayerInteract: (data) => {
            // Implementation
        }
    }
}
```

## Related Files

- `BP/scripts/components/blockComponents.js` - Main component definitions
- `BP/scripts/infusion_all.js` - Contains altar and pedestal logic
- `BP/scripts/farmland.js` - Contains farmland component logic
- `BP/scripts/stairPlacement.js` - Contains stair placement logic
