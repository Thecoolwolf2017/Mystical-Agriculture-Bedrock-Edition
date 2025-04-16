# Crop Growth Functions

## Overview
The crop growth functions are a set of specialized Minecraft Bedrock functions that handle the acceleration of crop growth for various crop types. These functions are organized by tier, with each tier corresponding to different crop types and growth accelerator blocks.

## Function Structure

### Directory Organization
All crop growth functions are located in the `BP/functions/crop_growth/` directory:

- `tier1_crops.mcfunction` - Basic crops (wheat, carrots, potatoes, inferium)
- `tier2_crops.mcfunction` - Tier 2 crops (beetroots, prudentium, basic resource crops)
- `tier3_crops.mcfunction` - Tier 3 crops (tertium, intermediate resource crops, nether wart)
- `tier4_crops.mcfunction` - Tier 4 crops (imperium, advanced resource crops, chorus)
- `tier5_crops.mcfunction` - Tier 5 crops (supremium, end-game resource crops)

### Function Execution
The crop growth functions are called by the `growth_accelerator_tick.mcfunction` file, which runs on a timer system. Each tier function is executed at different intervals to distribute processing load:

- Tier 1: Every 40 ticks
- Tier 2: Every 50 ticks
- Tier 3: Every 60 ticks
- Tier 4: Every 70 ticks
- Tier 5: Every 80 ticks

## Implementation Details

### Command Structure
Each crop growth function uses the `fill` command with the following pattern:

```mcfunction
execute as @e[type=armor_stand,name="GrowthTimer"] at @s run fill ~-3 ~-3 ~-3 ~3 ~3 ~3 <target_block>[growth=<max_value>] replace <target_block>[growth=<current_value>]
```

This command:
1. Executes at the position of the GrowthTimer armor stand
2. Fills a 7x7x7 area around the armor stand
3. Replaces crops at a specific growth stage with fully grown crops

### Growth Stages
Different crops have different maximum growth stages:
- Wheat, Carrots, Potatoes: 0-7 (8 stages)
- Beetroots, Nether Wart: 0-3 (4 stages)
- Sweet Berry Bush: 0-3 (4 stages)
- Chorus Flower: 0-5 (6 stages)
- Mystical Agriculture Crops: 0-7 (8 stages)

## Technical Notes

### Performance Considerations
- The functions use relative coordinates (`~`) to ensure they work regardless of the armor stand's position
- Each function only targets specific crop types to minimize the number of blocks checked
- Functions are executed at staggered intervals to distribute processing load

### Compatibility
- These functions are designed for Minecraft Bedrock Edition 1.20.60
- They use the Bedrock-specific command syntax (e.g., `c=1` instead of `limit=1`)
- Custom block states are referenced for mod-specific crops

### Integration with Growth Accelerators
These functions are called by the growth accelerator system, which:
1. Creates and maintains a timer entity
2. Tracks time using a scoreboard
3. Executes the appropriate crop growth function based on the timer value

## Troubleshooting

### Common Issues
- If crops aren't growing, ensure the GrowthTimer entity exists
- Verify that the scoreboard objective GrowthTimer is created
- Check that the growth accelerator blocks are properly placed and functioning

### Block State Errors
If you encounter errors related to undefined block states:
1. Ensure the custom crop blocks are properly defined in your behavior pack
2. Verify that the growth state property exists for your custom crops
3. Update the crop growth functions to match your custom crop properties

## Future Improvements
- Add support for more crop types as they are added to the mod
- Implement a more efficient targeting system to reduce unnecessary block checks
- Add configuration options to adjust growth rates and affected areas
