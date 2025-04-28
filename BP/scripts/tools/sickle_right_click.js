import { system, world, ItemStack } from '@minecraft/server';

// Define the sickle IDs manually
const sickleIds = [
    'strat:inferium_sickle',
    'strat:prudentium_sickle',
    'strat:tertium_sickle',
    'strat:imperium_sickle',
    'strat:supremium_sickle'
];

// Handle right-click harvesting with sickle
world.beforeEvents.playerInteractWithBlock.subscribe(result => {
    // Only process the first event to avoid duplicates
    if (!result.isFirstEvent) return;
    
    // Check if the player is holding a sickle
    if (!result.itemStack || !sickleIds.includes(result.itemStack.typeId)) return;
    
    const block = result.block;
    
    // Check if the block is a mystical agriculture crop
    if (block.typeId.startsWith("strat:") && block.typeId.includes("_crop")) {
        // Only handle fully grown crops (growth stage 7)
        if (block.permutation.getState("strat:growth_stage") == 7) {
            // Cancel the default interaction
            result.cancel = true;
            
            const centerX = block.location.x;
            const centerY = block.location.y;
            const centerZ = block.location.z;
            let totalCrops = 0;
            
            // Get the area range from the sickle's tags
            let tags = result.itemStack.getTags();
            const area = Math.floor((parseInt(tags.find(tag => tag.startsWith("area")).split(":").pop()) / 2));
            
            system.run(() => {
                // Process the center crop and crops in the area
                for (let dx = -area; dx <= area; dx++) {
                    for (let dz = -area; dz <= area; dz++) {
                        const targetX = centerX + dx;
                        const targetY = centerY;
                        const targetZ = centerZ + dz;
                        
                        const targetBlock = block.dimension.getBlock({ x: targetX, y: targetY, z: targetZ });
                        
                        // Check if the block is a crop and is fully grown
                        if (targetBlock && 
                            targetBlock.typeId.startsWith("strat:") && 
                            targetBlock.typeId.includes("_crop") && 
                            targetBlock.permutation.getState("strat:growth_stage") == 7) {
                            
                            totalCrops++;
                            
                            // Get the base ID for the crop
                            const baseID = targetBlock.typeId.replace("_crop", "");
                            
                            // Increased essence drops for sickle (1-2 essence)
                            const essenceAmount = Math.floor(Math.random() * 2) + 1;
                            let essenceItem = new ItemStack(`${baseID}_essence`, essenceAmount);
                            
                            // Spawn the essence
                            targetBlock.dimension.spawnItem(essenceItem, {
                                x: targetBlock.location.x + 0.5,
                                y: targetBlock.location.y + 0.5,
                                z: targetBlock.location.z + 0.5
                            });
                            
                            // Increased chance for fertilized essence (30% instead of 10%)
                            if (Math.floor(Math.random() * 10) + 1 <= 3) {
                                let fertilizedEssence = new ItemStack(`strat:fertilized_essence`, 1);
                                targetBlock.dimension.spawnItem(fertilizedEssence, {
                                    x: targetBlock.location.x + 0.5,
                                    y: targetBlock.location.y + 0.5,
                                    z: targetBlock.location.z + 0.5
                                });
                            }
                            
                            // Small chance to drop a tier essence (5% chance)
                            if (Math.floor(Math.random() * 100) + 1 <= 5) {
                                // Determine which tier essence to drop based on the sickle tier
                                let tierEssence = "strat:inferium_essence";
                                if (result.itemStack.typeId.includes("prudentium")) {
                                    tierEssence = "strat:prudentium_essence";
                                } else if (result.itemStack.typeId.includes("tertium")) {
                                    tierEssence = "strat:tertium_essence";
                                } else if (result.itemStack.typeId.includes("imperium")) {
                                    tierEssence = "strat:imperium_essence";
                                } else if (result.itemStack.typeId.includes("supremium")) {
                                    tierEssence = "strat:supremium_essence";
                                }
                                let tierEssenceItem = new ItemStack(tierEssence, 1);
                                targetBlock.dimension.spawnItem(tierEssenceItem, {
                                    x: targetBlock.location.x + 0.5,
                                    y: targetBlock.location.y + 0.5,
                                    z: targetBlock.location.z + 0.5
                                });
                            }
                            
                            // Reset the crop to growth stage 0 (just planted)
                            targetBlock.setPermutation(targetBlock.permutation.withState("strat:growth_stage", 0));
                            
                            // Play harvest sound and particles
                            targetBlock.dimension.playSound("dig.grass", targetBlock.location);
                            targetBlock.dimension.spawnParticle("minecraft:crop_growth_emitter", targetBlock.center());
                        }
                    }
                }
                
                // Apply durability damage to the sickle based on crops harvested
                if (totalCrops > 0) {
                    const playerEquippableComp = result.player.getComponent("equippable");
                    if (!playerEquippableComp) return;
                    
                    let itemUsed = result.itemStack;
                    const itemEnchantmentComp = itemUsed.getComponent("minecraft:enchantable");
                    const unbreakingLevel = itemEnchantmentComp?.getEnchantment("unbreaking")?.level ?? 0;
                    
                    // Calculates the chance of an item breaking based on its unbreaking level
                    const breakChance = 100 / (unbreakingLevel + 1);
                    const randomizeChance = Math.random() * 100;
                    
                    if (breakChance < randomizeChance) return;
                    
                    const itemUsedDurabilityComp = itemUsed.getComponent("durability");
                    if (!itemUsedDurabilityComp) return;
                    
                    // Apply durability damage based on crops harvested
                    itemUsedDurabilityComp.damage = Math.min(
                        itemUsedDurabilityComp.damage + totalCrops,
                        itemUsedDurabilityComp.maxDurability
                    );
                    
                    // Check if the item is out of durability
                    const maxDurability = itemUsedDurabilityComp.maxDurability;
                    const currentDamage = itemUsedDurabilityComp.damage;
                    
                    if (currentDamage >= maxDurability) {
                        // If the item is out of durability, play breaking sound and remove it
                        result.player.playSound('random.break', { pitch: 1, location: result.player.location, volume: 1 });
                        playerEquippableComp.setEquipment("Mainhand", new ItemStack('minecraft:air', 1));
                    } else {
                        // Update the item in the player's hand
                        playerEquippableComp.setEquipment("Mainhand", itemUsed);
                    }
                    
                    // Show action bar message to the player
                    result.player.onScreenDisplay.setActionBar(`§aHarvested ${totalCrops} crops`);
                }
            });
        }
    }
});
