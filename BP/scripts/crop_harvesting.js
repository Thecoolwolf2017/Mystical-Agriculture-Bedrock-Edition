import { world, ItemStack, system } from '@minecraft/server';

// Handle crop harvesting when a player breaks a crop block
world.beforeEvents.playerBreakBlock.subscribe(result => {
    const block = result.block;
    
    // Check if the block is a mystical agriculture crop
    if (block.typeId.startsWith("strat:") && block.typeId.includes("_crop")) {
        // For any growth stage, only drop seeds when breaking
        const baseID = block.typeId.replace("_crop", "");
        let seedsItem = new ItemStack(`${baseID}_seeds`, 1);
        
        // Run in the next tick to ensure items drop after the block is broken
        system.run(() => {
            // Spawn only seeds in the world
            block.dimension.spawnItem(seedsItem, block.location);
        });
    }
    }
);
