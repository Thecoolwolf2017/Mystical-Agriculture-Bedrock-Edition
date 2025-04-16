# Block Definitions in Mystical Agriculture

## Block Structure in Minecraft Bedrock Edition

This guide explains the block definition structure used in the Mystical Agriculture add-on, with specific attention to version compatibility.

### Version Compatibility

There are important differences between Minecraft Bedrock Edition versions:

1. **Version 1.20.40**:
   - Supports older event handling directly in block definitions
   - Supports components like `minecraft:ticking` and `minecraft:on_player_destroyed`
   - Allows an `events` section in block definitions
   - Note: Some components like `minecraft:queued_ticking` are deprecated even in this version

2. **Version 1.20.60**:
   - Removes support for event handling components
   - Does not support the `events` section in block definitions
   - Requires using function commands and ticking areas for complex behavior

### Alternative Approaches for Block Functionality

Since event handling in block definitions is being deprecated, here are alternative approaches:

1. **Using Ticking Areas**:
   - The `/tickingarea` command can be used to ensure chunks stay loaded
   - Example: `/tickingarea add circle <x> <y> <z> 2 growth_accelerator_area`
   - This keeps the area around growth accelerators loaded so functions can run

2. **Function-Based Approach**:
   - Create function files in `BP/functions/` directory
   - Use command blocks or scheduled functions to run the logic
   - Example function file for growth accelerators:

```mcfunction
# BP/functions/growth_accelerator_tick.mcfunction
execute as @e[type=item,r=5] at @s if block ~ ~-1 ~ strat:imperium_growth_accelerator run tag @s add accelerated
execute as @e[tag=accelerated] run data merge entity @s {Age:5900}
```

3. **Command Blocks**:
   - Place command blocks near important blocks
   - Set them to repeat and always active
   - Use them to execute the same commands that were in the block events

### Current Implementation

For the growth accelerator blocks, we've implemented the following approach:

1. **Block Textures**: All growth accelerator blocks use textures defined in `RP/textures/blocks/`, such as:
   - `imperium_growth_accelerator.png`
   - `inferium_growth_accelerator.png`
   - etc.

2. **Block Definitions**: The block definitions are in the Behavior Pack (BP) under `BP/blocks/growth_accelerators/`.

3. **Resource Pack References**: The blocks are referenced in `RP/blocks.json` with their textures and sounds.

### Block Definition Structure for 1.20.40 (Legacy)

For version 1.20.40, the block definition structure follows this pattern:

```json
{
  "format_version": "1.20.40",
  "minecraft:block": {
    "description": {
      "identifier": "strat:block_name",
      "menu_category": {
        "category": "items"
      }
    },
    "components": {
      "minecraft:destructible_by_mining": {
        "seconds_to_destroy": 1
      },
      "minecraft:material_instances": {
        "*": {
          "texture": "texture_name",
          "render_method": "alpha_test"
        }
      },
      "minecraft:collision_box": {
        "origin": [-8, 0, -8],
        "size": [16, 16, 16]
      },
      "minecraft:selection_box": {
        "origin": [-8, 0, -8],
        "size": [16, 16, 16]
      },
      "minecraft:map_color": "#HEXCOLOR",
      "minecraft:light_emission": 5,
      "minecraft:destructible_by_explosion": {
        "explosion_resistance": 8.0
      },
      "minecraft:ticking": {
        "interval_range": [100, 400],
        "looping": true,
        "on_tick": {
          "event": "strat:event_name"
        }
      },
      "minecraft:on_player_destroyed": {
        "event": "strat:event_name"
      }
    },
    "events": {
      "strat:event_name": {
        "randomize": [
          {
            "run_command": {
              "command": ["function function_name"]
            },
            "weight": 1
          }
        ]
      }
    }
  }
}
```

### Block Definition Structure for 1.20.60 (Recommended)

For version 1.20.60, the block definition structure follows this simplified pattern:

```json
{
  "format_version": "1.20.60",
  "minecraft:block": {
    "description": {
      "identifier": "strat:block_name",
      "menu_category": {
        "category": "items"
      }
    },
    "components": {
      "minecraft:destructible_by_mining": {
        "seconds_to_destroy": 1
      },
      "minecraft:material_instances": {
        "*": {
          "texture": "texture_name",
          "render_method": "alpha_test"
        }
      },
      "minecraft:collision_box": {
        "origin": [-8, 0, -8],
        "size": [16, 16, 16]
      },
      "minecraft:selection_box": {
        "origin": [-8, 0, -8],
        "size": [16, 16, 16]
      },
      "minecraft:map_color": "#HEXCOLOR",
      "minecraft:light_emission": 5,
      "minecraft:destructible_by_explosion": {
        "explosion_resistance": 8.0
      }
    }
  }
}
```

### Supported Components in 1.20.40 (Legacy)

The following components are supported in Minecraft Bedrock Edition 1.20.40, but some are deprecated:

1. **minecraft:destructible_by_mining**: Controls how long it takes to mine the block
2. **minecraft:material_instances**: Defines the textures for the block
3. **minecraft:collision_box**: Defines the collision box for the block
4. **minecraft:selection_box**: Defines the selection box for the block
5. **minecraft:map_color**: Defines the color of the block on maps
6. **minecraft:light_emission**: Controls how much light the block emits
7. **minecraft:destructible_by_explosion**: Controls the block's resistance to explosions
8. **minecraft:ticking**: Allows the block to have ticking behavior (deprecated)
9. **minecraft:on_player_destroyed**: Triggers an event when the block is destroyed by a player (deprecated)

### Supported Components in 1.20.60 (Recommended)

The following components are confirmed to work in Minecraft Bedrock Edition 1.20.60:

1. **minecraft:destructible_by_mining**: Controls how long it takes to mine the block
2. **minecraft:material_instances**: Defines the textures for the block
3. **minecraft:collision_box**: Defines the collision box for the block
4. **minecraft:selection_box**: Defines the selection box for the block
5. **minecraft:map_color**: Defines the color of the block on maps
6. **minecraft:light_emission**: Controls how much light the block emits
7. **minecraft:destructible_by_explosion**: Controls the block's resistance to explosions

### Geometry Models

In previous versions of Minecraft Bedrock Edition, you could use custom geometry models for blocks by specifying the `minecraft:geometry` component. However, in recent versions, this approach has changed:

1. **No Direct Geometry References**: You should not use the `minecraft:geometry` component directly in block definitions, as it will cause the "Cannot find model definition" error.

2. **Default Cube Shape**: Instead, use the `minecraft:collision_box` and `minecraft:selection_box` components to define the shape of your block. This will create a standard cube shape.

3. **Custom Block Models**: If you need custom block models, you'll need to use a different approach, such as using entity models or creating a custom render controller.

### Troubleshooting Common Issues

#### 1. "Property events is not allowed"

This error occurs when using version 1.20.60 with an `events` section in the block definition. Either:
- Change to version 1.20.40 if you need the events functionality (not recommended for future compatibility)
- Remove the events section and implement the functionality using function commands and ticking areas

#### 2. "Property X is not allowed"

This error typically occurs when you're using a component that is not supported in the current version of Minecraft Bedrock Edition. Check the list of supported components for your version.

#### 3. "Cannot find model definition: geometry.X"

This error occurs when you're trying to use a custom geometry model that doesn't exist or can't be found. Avoid using the `minecraft:geometry` component in block definitions and rely on the collision and selection boxes instead.

#### 4. "Incorrect type. Expected 'array'"

This error typically occurs when a component or property is not formatted correctly. In Minecraft Bedrock Edition, some properties expect arrays while others expect objects. Make sure you're using the correct format for each component.

### Migration Guide: Moving from Events to Functions

To migrate from using block events to functions:

1. **Create Function Files**:
   - Create `.mcfunction` files in the `BP/functions/` directory
   - Example: `BP/functions/imperium_growth_accelerator.mcfunction`

2. **Add Function Logic**:
   - Add the commands that were previously in your events
   - Use selectors to target specific blocks or areas

3. **Schedule Function Execution**:
   - Use `/tickingarea` commands to keep chunks loaded
   - Use `/schedule` to run functions at intervals
   - Example: `/schedule function imperium_growth_accelerator 100t repeating`

4. **Simplify Block Definitions**:
   - Remove event handling components
   - Focus on visual and physical properties

### Best Practices

1. **Version Compatibility**: Be aware of the version you're targeting and use only the components supported by that version
2. **Fallback Mechanisms**: For functionality that requires events in 1.20.60+, implement alternative approaches using function commands
3. **Keep Block Definitions Simple**: Only use components that are well-supported
4. **Avoid Custom Geometry**: Use the standard cube shape defined by collision and selection boxes
5. **Test Thoroughly**: Always test your blocks in a development environment before releasing
6. **Version Checking**: When updating to new Minecraft versions, check for API changes that might affect your block definitions
7. **Use Ticking Areas**: For blocks that need to perform actions over time, use ticking areas to ensure chunks stay loaded
8. **Function-Based Logic**: Move complex logic to function files instead of embedding it in block definitions
