import { world, ItemStack, system } from '@minecraft/server';

// Handle crop harvesting when a player right-clicks a crop block
world.beforeEvents.playerInteractWithBlock.subscribe(result => {
    // Only process the first event to avoid duplicates
    if (!result.isFirstEvent) return;
    
    const block = result.block;
    
    // Check if the block is a mystical agriculture crop
    if (block.typeId.startsWith("strat:") && block.typeId.includes("_crop")) {
        // Only handle fully grown crops (growth stage 7)
        if (block.permutation.getState("strat:growth_stage") == 7) {
            // Cancel the default interaction
            result.cancel = true;
            
            // Get the base ID for the crop (remove "_crop" suffix)
            const baseID = block.typeId.replace("_crop", "");
            
            // Create essence and seeds items
            let essenceItem = new ItemStack(`${baseID}_essence`, 1);
            let seedsItem = new ItemStack(`${baseID}_seeds`, 1);
            
            // Run in the next tick to ensure items drop properly
            system.run(() => {
                // Spawn both essence and seeds in the world
                block.dimension.spawnItem(essenceItem, {
                    x: block.location.x + 0.5,
                    y: block.location.y + 0.5,
                    z: block.location.z + 0.5
                });
                
                block.dimension.spawnItem(seedsItem, {
                    x: block.location.x + 0.5,
                    y: block.location.y + 0.5,
                    z: block.location.z + 0.5
                });
                
                // Small chance to drop fertilized essence (10%)
                if (Math.floor(Math.random() * 10) + 1 == 1) {
                    let fertilizedEssence = new ItemStack(`strat:fertilized_essence`, 1);
                    block.dimension.spawnItem(fertilizedEssence, {
                        x: block.location.x + 0.5,
                        y: block.location.y + 0.5,
                        z: block.location.z + 0.5
                    });
                }
                
                // Reset the crop to growth stage 0 (just planted)
                block.setPermutation(block.permutation.withState("strat:growth_stage", 0));
                
                // Play harvest sound and particles
                block.dimension.playSound("dig.grass", block.location);
                block.dimension.spawnParticle("minecraft:crop_growth_emitter", block.center());
                
                // Show action bar message to the player
                result.player.onScreenDisplay.setActionBar("§aHarvested crop");
            });
        }
    }
});
