# Soul Jars

## Overview
Soul Jars are special items in Mystical Agriculture that allow players to capture mob essences. These essences are used to craft mob-specific seeds, allowing players to grow resources typically obtained by defeating mobs.

## Obtaining Soul Jars
Soul Jars can be crafted using the following recipe:
- 1 Soul Dust in the center
- 8 Glass blocks surrounding it

## Using Soul Jars

### Capturing Souls
1. Hold an empty Soul Jar in your main hand
2. Defeat mobs to capture their souls
3. Each mob killed has a chance to add soul essence to the jar
4. Different mobs require different numbers of souls to fill a jar

### Soul Requirements
- Common mobs (Zombie, Skeleton): 10-25 souls
- Uncommon mobs (Creeper, Spider): 25-40 souls
- Rare mobs (Blaze, Enderman): 40-60 souls
- Boss mobs (Wither, Ender Dragon): 100+ souls

### Filled Soul Jars
Once a Soul Jar is filled with the required number of souls for a specific mob type:
1. The jar will transform into a Filled Soul Jar specific to that mob
2. The item's name and appearance will change to indicate the mob type
3. The Filled Soul Jar can then be used in crafting recipes

## Crafting with Soul Jars

### Mob Seeds
Filled Soul Jars are primarily used to craft mob-specific seeds:
1. Place the Filled Soul Jar in the Infusion Altar
2. Surround it with the appropriate tier essences on pedestals
3. Use an Infusion Crystal to start the process
4. The result will be a mob-specific seed

### Mob Chunks
Some recipes may require Mob Chunks instead of Soul Jars:
1. Place a Filled Soul Jar in a crafting grid
2. The result will be a Mob Chunk specific to that mob type
3. Mob Chunks are used in more advanced recipes

## Technical Details

### Soul Collection Mechanics
- Soul collection chance: 25-50% per mob killed (varies by mob type)
- Soul collection is handled by the `strat:soul_collector` component
- Progress is stored in the item's lore and custom data

### Mob Type Detection
The Soul Jar uses entity type detection to determine which souls to collect:
- Entity type is checked against a predefined list
- Compatible mobs will contribute souls to the jar
- Incompatible mobs will not contribute souls

## Troubleshooting

### Common Issues

1. **Souls Not Being Collected**
   - Ensure you're holding the Soul Jar in your main hand
   - Verify that you're killing compatible mob types
   - Check that your Soul Jar isn't already filled

2. **Can't Use Filled Soul Jar in Crafting**
   - Make sure the jar is completely filled (check the lore)
   - Verify that you're using the correct recipe
   - Ensure you're using the Infusion Altar for seed crafting

3. **Soul Jar Breaking Without Filling**
   - This is normal for some rare mob types
   - The chance of breaking increases with rarer mobs
   - Use Soul Jar fragments to craft new Soul Jars

## Tips and Tricks

- Use Soul Jars in mob farms for efficient soul collection
- Focus on one mob type at a time for faster filling
- Create multiple Soul Jars to collect different mob types simultaneously
- Some mob types may have special requirements or behaviors
