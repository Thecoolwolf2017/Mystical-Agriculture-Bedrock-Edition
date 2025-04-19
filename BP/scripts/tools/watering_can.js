import * as server from "@minecraft/server";

// Mystical Agriculture Watering Can Implementation
console.log("[MYSTICAL AGRICULTURE] Loading watering can script...");

// Debug mode - set to false for production
const DEBUG_MODE = true;

// Function to check if an item is a watering can
function isWateringCan(itemId) {
    return itemId && itemId.startsWith("strat:") && itemId.endsWith("_can");
}

// Function to get watering can tier and properties
function getWateringCanTier(itemId) {
    if (!itemId) return { tier: 0, range: 1, growthChance: 0.33 };
    
    // Default values for basic watering can
    let tier = 0;
    let range = 1; // Default 3x3 area
    let growthChance = 0.33; // 1 in 3 chance
    
    // Determine tier based on item ID
    if (itemId.includes("inferium")) {
        tier = 1;
        range = 1; // 3x3 area
        growthChance = 0.33; // 1 in 3 chance
    } else if (itemId.includes("prudentium")) {
        tier = 2;
        range = 2; // 5x5 area
        growthChance = 0.4; // 40% chance
    } else if (itemId.includes("intermedium")) {
        tier = 3;
        range = 3; // 7x7 area
        growthChance = 0.5; // 50% chance
    } else if (itemId.includes("superium")) {
        tier = 4;
        range = 4; // 9x9 area
        growthChance = 0.6; // 60% chance
    } else if (itemId.includes("supremium")) {
        tier = 5;
        range = 5; // 11x11 area
        growthChance = 0.75; // 75% chance
    }
    
    return { tier, range, growthChance };
}

// Function to check if a player has the debug tag
function hasDebugTag(player) {
    if (!player) return false;
    return player.hasTag("debug") || DEBUG_MODE;
}

// Function to check if a block is farmland or a crop
function isFarmlandOrCrop(blockId) {
    if (!blockId) return false;
    
    // Convert to lowercase for case-insensitive comparison
    const id = blockId.toLowerCase();
    
    // Check for farmland
    if (id.includes("farmland") || id.includes("fertile_soil") || id.includes("mystical_growth_pot")) {
        return true;
    }
    
    // Check for vanilla crops
    if (id.includes("wheat") || 
        id.includes("carrot") || 
        id.includes("potato") || 
        id.includes("beetroot") || 
        id.includes("melon") || 
        id.includes("pumpkin") || 
        id.includes("berry")) {
        return true;
    }
    
    // Check for custom crops
    if (id.includes("crop")) {
        return true;
    }
    
    return false;
}

// Function to check if a block is water
function isWaterBlock(blockId) {
    if (!blockId) return false;
    
    // Convert to lowercase for case-insensitive comparison
    const id = blockId.toLowerCase();
    
    // Check for water blocks by string ID
    if (id.includes("water") && !id.includes("waterlogged") && !id.includes("watering")) {
        return true;
    }
    
    // Check for water blocks by numeric ID (Bedrock Edition)
    if (id === "8" || id === "9" || id === "4") {
        return true;
    }
    
    return false;
}

try {
    // Handle filling watering cans with water
    if (server.world.afterEvents.playerInteractWithBlock) {
        server.world.afterEvents.playerInteractWithBlock.subscribe(event => {
            try {
                // Get essential data
                const player = event.player;
                const itemStack = event.itemStack;
                const block = event.block;
                
                // Basic validation
                if (!player || !itemStack || !block) return;
                if (!isWateringCan(itemStack.typeId)) return;
                
                console.log("[MYSTICAL AGRICULTURE] Player interacted with block using watering can: " + block.typeId);
                
                // Check if the block is water
                console.log("[MYSTICAL AGRICULTURE] Checking block: " + block.typeId + ", Block ID type: " + typeof block.typeId);
                // Try to get the block's permutation for more detailed information
                try {
                    if (block.permutation) {
                        const blockState = block.permutation.getAllStates();
                        console.log("[MYSTICAL AGRICULTURE] Block states: " + JSON.stringify(blockState));
                    }
                } catch (stateError) {
                    console.log("[MYSTICAL AGRICULTURE] Could not get block states: " + stateError);
                }
                
                if (isWaterBlock(block.typeId)) {
                    console.log("[MYSTICAL AGRICULTURE] Player is looking at water with a watering can: " + block.typeId);
                    
                    // Fill the watering can
                    const tierInfo = getWateringCanTier(itemStack.typeId);
                    
                    // Create a new lore array for the filled can
                    const lore = [
                        "§r§7Water: §a100%",
                        "§r§7Range: §e" + (tierInfo.range * 2 + 1) + "x" + (tierInfo.range * 2 + 1),
                        "§r§7Growth Chance: §e" + Math.round(tierInfo.growthChance * 100) + "%"
                    ];
                    
                    // Create a filled version of the watering can
                    const filledCanItem = itemStack.clone();
                    filledCanItem.setLore(lore);
                    
                    // Play a sound effect for filling
                    try {
                        player.playSound("bucket.fill_water");
                    } catch (soundError) {
                        // Fallback sound if the first one isn't available
                        try {
                            player.dimension.playSound("bucket.fill_water", player.location);
                        } catch (fallbackError) {
                            console.log("[MYSTICAL AGRICULTURE] Could not play sound: " + fallbackError);
                        }
                    }
                    
                    console.log("[MYSTICAL AGRICULTURE] Watering can filled with water");
                    
                    // Update the item's lore
                    itemStack.setLore(lore);
                    
                    // Update the player's equipment - try multiple approaches
                    try {
                        // First try the component approach
                        if (typeof player.getComponent === 'function') {
                            const equippable = player.getComponent("equippable");
                            if (equippable) {
                                equippable.setEquipment(server.EquipmentSlot.Mainhand, itemStack);
                                console.log("[MYSTICAL AGRICULTURE] Updated player equipment via component");
                            } else {
                                console.log("[MYSTICAL AGRICULTURE] Equippable component not available");
                            }
                        } else {
                            console.log("[MYSTICAL AGRICULTURE] getComponent function not available");
                        }
                    } catch (error) {
                        console.error("[MYSTICAL AGRICULTURE] Error updating equipment:", error);
                    }
                }
            } catch (error) {
                console.error("[MYSTICAL AGRICULTURE] Error in playerInteractWithBlock event:", error);
            }
        });
        console.log("[MYSTICAL AGRICULTURE] Registered playerInteractWithBlock event for watering cans");
    } else {
        console.error("[MYSTICAL AGRICULTURE] playerInteractWithBlock event not available!");
    }

    // Handle using the watering can on crops
    if (server.world.afterEvents.itemUse) {
        server.world.afterEvents.itemUse.subscribe(event => {
            try {
                // Get essential data
                const player = event.source;
                const itemStack = event.itemStack;
                
                if (!itemStack) {
                    return;
                }
                
                // Check if the item is a watering can
                const itemId = itemStack.typeId;
                if (!isWateringCan(itemId)) {
                    return;
                }
                
                // Get the watering can tier and properties
                const tierInfo = getWateringCanTier(itemId);
                
                // Check if the watering can has water
                const lore = itemStack.getLore();
                if (!lore || lore.length === 0 || !lore[0].includes("Water: §a100%")) {
                    player.onScreenDisplay.setActionBar("§cWatering can is empty! Right-click on water to fill it.");
                    return;
                }
                
                // Get the block the player is looking at
                if (typeof player.getBlockFromViewDirection !== 'function') {
                    console.error("[MYSTICAL AGRICULTURE] getBlockFromViewDirection method not available");
                    return;
                }
                
                try {
                    const viewBlock = player.getBlockFromViewDirection({ maxDistance: 10 });
                    if (!viewBlock || !viewBlock.block) {
                        console.log("[MYSTICAL AGRICULTURE] No block in view");
                        return;
                    }
                    
                    const block = viewBlock.block;
                    
                    // Check if the block is farmland or a crop
                    if (isFarmlandOrCrop(block.typeId)) {
                        console.log("[MYSTICAL AGRICULTURE] Using watering can on farmland or crop: " + block.typeId);
                        
                        // Apply watering can effects
                        const range = tierInfo.range;
                        const growthChance = tierInfo.growthChance;
                        
                        // Randomly decide if we should consume water (1 in 30 chance)
                        const shouldConsumeWater = Math.random() < 0.033; // 1/30 chance
                        
                        if (shouldConsumeWater) {
                            // Create a new lore array for the empty can
                            const emptyLore = [
                                "§r§7Water: §c0%",
                                "§r§7Range: §e" + (tierInfo.range * 2 + 1) + "x" + (tierInfo.range * 2 + 1),
                                "§r§7Growth Chance: §e" + Math.round(tierInfo.growthChance * 100) + "%"
                            ];
                            
                            // Update the item's lore
                            itemStack.setLore(emptyLore);
                            
                            // Update the player's equipment
                            try {
                                if (typeof player.getComponent === 'function') {
                                    const equippable = player.getComponent("equippable");
                                    if (equippable) {
                                        equippable.setEquipment(server.EquipmentSlot.Mainhand, itemStack);
                                    }
                                }
                            } catch (equipError) {
                                console.error("[MYSTICAL AGRICULTURE] Error updating equipment:", equipError);
                            }
                            
                            player.onScreenDisplay.setActionBar("§cWatering can is now empty");
                            
                            // Play a sound effect for emptying
                            try {
                                player.playSound("bucket.empty_water");
                            } catch (soundError) {
                                try {
                                    player.dimension.playSound("bucket.empty_water", player.location);
                                } catch (fallbackError) {
                                    // Ignore sound errors
                                }
                            }
                        }
                        
                        // Apply growth effects to crops in the area
                        for (let x = -range; x <= range; x++) {
                            for (let z = -range; z <= range; z++) {
                                // Skip blocks that are too far away (for circular pattern)
                                if (x*x + z*z > range*range) continue;
                                
                                try {
                                    // Get the block at the offset position
                                    const targetBlock = block.dimension.getBlock({
                                        x: block.location.x + x,
                                        y: block.location.y,
                                        z: block.location.z + z
                                    });
                                    
                                    if (!targetBlock) continue;
                                    
                                    // Check if it's a crop
                                    if (targetBlock.typeId.includes("crop") || 
                                        targetBlock.typeId.includes("wheat") || 
                                        targetBlock.typeId.includes("carrot") || 
                                        targetBlock.typeId.includes("potato") || 
                                        targetBlock.typeId.includes("beetroot") || 
                                        targetBlock.typeId.includes("berry")) {
                                        
                                        // Attempt to grow the crop
                                        if (Math.random() < growthChance) {
                                            // Spawn particles
                                            targetBlock.dimension.spawnParticle("minecraft:crop_growth_emitter", targetBlock.location);
                                            
                                            // Try to advance the growth stage
                                            try {
                                                if (targetBlock.permutation) {
                                                    const states = targetBlock.permutation.getAllStates();
                                                    let growthState = null;
                                                    
                                                    // Check for different growth properties
                                                    if (states["growth"]) {
                                                        growthState = states["growth"];
                                                    } else if (states["age"]) {
                                                        growthState = states["age"];
                                                    } else if (states["strat:growth_stage"]) {
                                                        growthState = states["strat:growth_stage"];
                                                    }
                                                    
                                                    if (growthState !== null) {
                                                        // Determine max age based on crop type
                                                        const maxAge = targetBlock.typeId.includes("beetroot") || 
                                                                      targetBlock.typeId.includes("berry") ? 3 : 7;
                                                        
                                                        // Advance growth stage
                                                        const newState = Math.min(growthState + 1, maxAge);
                                                        
                                                        // Apply the new growth stage
                                                        let newPermutation = null;
                                                        
                                                        if (states["growth"] !== undefined) {
                                                            newPermutation = targetBlock.permutation.withState("growth", newState);
                                                        } else if (states["age"] !== undefined) {
                                                            newPermutation = targetBlock.permutation.withState("age", newState);
                                                        } else if (states["strat:growth_stage"] !== undefined) {
                                                            newPermutation = targetBlock.permutation.withState("strat:growth_stage", newState);
                                                        }
                                                        
                                                        if (newPermutation) {
                                                            targetBlock.setPermutation(newPermutation);
                                                        }
                                                    }
                                                }
                                            } catch (growthError) {
                                                console.log("[MYSTICAL AGRICULTURE] Error advancing crop growth:", growthError);
                                            }
                                        }
                                    }
                                } catch (blockError) {
                                    console.log("[MYSTICAL AGRICULTURE] Error processing block:", blockError);
                                }
                            }
                        }
                        
                        // Show success message
                        player.onScreenDisplay.setActionBar("§aWatering crops...");
                    }
                } catch (viewError) {
                    console.error("[MYSTICAL AGRICULTURE] Error getting block from view direction:", viewError);
                }
            } catch (error) {
                console.error("[MYSTICAL AGRICULTURE] Error in itemUse event:", error);
            }
        });
        console.log("[MYSTICAL AGRICULTURE] Registered itemUse event for watering cans");
    } else {
        console.error("[MYSTICAL AGRICULTURE] itemUse event not available!");
    }
} catch (globalError) {
    console.error("[MYSTICAL AGRICULTURE] Global error in watering can script:", globalError);
}
// End of watering can script