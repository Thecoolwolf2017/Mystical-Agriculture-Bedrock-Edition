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
    const id = String(blockId).toLowerCase();
    
    // Check for water blocks by string ID
    if (id.includes("water") && !id.includes("waterlogged") && !id.includes("watering")) {
        return true;
    }
    
    // Check for water blocks by numeric ID (Bedrock Edition)
    // 8 = flowing water, 9 = still water, 4 = lava (some versions mix these up)
    if (id === "8" || id === "9" || id === "4" || id === "minecraft:water") {
        return true;
    }
    
    return false;
}

// Function to check if a player is looking at water
function isLookingAtWater(player, maxDistance = 5) {
    if (!player || typeof player.getBlockFromViewDirection !== 'function') return false;
    
    try {
        const viewBlock = player.getBlockFromViewDirection({ maxDistance: maxDistance });
        if (!viewBlock || !viewBlock.block) return false;
        
        return isWaterBlock(viewBlock.block.typeId);
    } catch (error) {
        console.error("[MYSTICAL AGRICULTURE] Error checking if player is looking at water:", error);
        return false;
    }
}

// Function to check for water blocks around the player
function findWaterAroundPlayer(player, range = 2, height = 2) {
    if (!player) return null;
    
    try {
        const location = player.location;
        const dimension = player.dimension;
        
        // Search in a box around the player
        for (let y = -1; y <= height; y++) {
            for (let x = -range; x <= range; x++) {
                for (let z = -range; z <= range; z++) {
                    const blockPos = {
                        x: Math.floor(location.x) + x,
                        y: Math.floor(location.y) + y,
                        z: Math.floor(location.z) + z
                    };
                    
                    const block = dimension.getBlock(blockPos);
                    if (block && isWaterBlock(block.typeId)) {
                        console.log(`[MYSTICAL AGRICULTURE] Found water block at ${blockPos.x}, ${blockPos.y}, ${blockPos.z}: ${block.typeId}`);
                        return block;
                    }
                }
            }
        }
    } catch (error) {
        console.error("[MYSTICAL AGRICULTURE] Error finding water around player:", error);
    }
    
    return null;
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
                
                // Check if this is a custom crop
                if (block.typeId.startsWith("strat:") && block.typeId.includes("crop")) {
                    // Get the watering can tier and properties
                    const tierInfo = getWateringCanTier(itemStack.typeId);
                    
                    // Check if the watering can has water
                    const lore = itemStack.getLore();
                    if (!lore || lore.length === 0 || !lore[0].includes("Water: §a100%")) {
                        player.onScreenDisplay.setActionBar("§cWatering can is empty! Right-click on water to fill it.");
                        return;
                    }
                    
                    try {
                        const states = block.permutation.getAllStates();
                        if (states["strat:growth_stage"] !== undefined) {
                            const currentStage = states["strat:growth_stage"];
                            const maxStage = 7; // Max growth stage for custom crops
                            
                            if (currentStage < maxStage) {
                                // Advance the growth stage
                                const newStage = currentStage + 1;
                                block.setPermutation(block.permutation.withState("strat:growth_stage", newStage));
                                console.log(`[MYSTICAL AGRICULTURE] Directly advanced custom crop: ${block.typeId} from ${currentStage} to ${newStage}`);
                                
                                // Spawn particles
                                try {
                                    block.dimension.spawnParticle("minecraft:crop_growth_emitter", block.location);
                                } catch (particleError) {
                                    // Ignore particle errors
                                }
                                
                                // Empty the watering can
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
                                
                                player.onScreenDisplay.setActionBar("§aWatered crop and advanced its growth!");
                            } else {
                                player.onScreenDisplay.setActionBar("§eCrop is already fully grown!");
                            }
                        }
                    } catch (cropError) {
                        console.log(`[MYSTICAL AGRICULTURE] Error processing custom crop directly: ${cropError}`);
                    }
                    return; // Exit after handling the custom crop
                }
                
                // Check if the block is water
                if (isWaterBlock(block.typeId)) {
                    fillWateringCan(player, itemStack);
                }
            } catch (error) {
                console.error("[MYSTICAL AGRICULTURE] Error in playerInteractWithBlock event:", error);
            }
        });
        console.log("[MYSTICAL AGRICULTURE] Registered playerInteractWithBlock event for watering cans");
    } else {
        console.error("[MYSTICAL AGRICULTURE] playerInteractWithBlock event not available!");
    }
    
    // Helper function to fill the watering can
    function fillWateringCan(player, itemStack) {
        if (!player || !itemStack) return false;
        
        console.log("[MYSTICAL AGRICULTURE] Filling watering can: " + itemStack.typeId);
        
        // Get the watering can tier and properties
        const tierInfo = getWateringCanTier(itemStack.typeId);
        
        // Create a new lore array for the filled can
        const lore = [
            "§r§7Water: §a100%",
            "§r§7Range: §e" + (tierInfo.range * 2 + 1) + "x" + (tierInfo.range * 2 + 1),
            "§r§7Growth Chance: §e" + Math.round(tierInfo.growthChance * 100) + "%"
        ];
        
        // Update the item's lore
        itemStack.setLore(lore);
        
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
        
        // Show a message to the player
        player.onScreenDisplay.setActionBar("§aWatering can filled with water");
        
        console.log("[MYSTICAL AGRICULTURE] Watering can filled with water");
        
        // Update the player's equipment - try multiple approaches
        try {
            // First try the component approach
            if (typeof player.getComponent === 'function') {
                const equippable = player.getComponent("equippable");
                if (equippable) {
                    equippable.setEquipment(server.EquipmentSlot.Mainhand, itemStack);
                    console.log("[MYSTICAL AGRICULTURE] Updated player equipment via component");
                    return true;
                } else {
                    console.log("[MYSTICAL AGRICULTURE] Equippable component not available");
                }
            } else {
                console.log("[MYSTICAL AGRICULTURE] getComponent function not available");
            }
            
            // If we get here, the first approach failed, try inventory approach
            const inventory = player.getComponent("inventory");
            if (inventory && inventory.container) {
                const selectedSlot = player.selectedSlot;
                inventory.container.setItem(selectedSlot, itemStack);
                console.log("[MYSTICAL AGRICULTURE] Updated player inventory via container");
                return true;
            }
        } catch (error) {
            console.error("[MYSTICAL AGRICULTURE] Error updating equipment:", error);
        }
        
        return false;
    }

    // Handle using the watering can on crops
    if (server.world.afterEvents.itemUse) {
        server.world.afterEvents.itemUse.subscribe(event => {
            try {
                // Get essential data
                const player = event.source;
                const itemStack = event.itemStack;
                
                if (!player || !itemStack) {
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
                    
                    // Try to automatically fill the watering can if the player is looking at water
                    if (isLookingAtWater(player)) {
                        console.log("[MYSTICAL AGRICULTURE] Player is looking at water, attempting to fill watering can");
                        fillWateringCan(player, itemStack);
                        return;
                    }
                    
                    // If not looking directly at water, check for water blocks around the player
                    const waterBlock = findWaterAroundPlayer(player, 2, 2);
                    if (waterBlock) {
                        console.log("[MYSTICAL AGRICULTURE] Found water nearby, filling watering can");
                        fillWateringCan(player, itemStack);
                        return;
                    }
                    
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
                        
                        // If this is a custom crop, process it directly
                        if (block.typeId.startsWith("strat:") && block.typeId.includes("crop")) {
                            try {
                                const states = block.permutation.getAllStates();
                                if (states["strat:growth_stage"] !== undefined) {
                                    const currentStage = states["strat:growth_stage"];
                                    const maxStage = 7; // Max growth stage for custom crops
                                    
                                    if (currentStage < maxStage) {
                                        // Advance the growth stage
                                        const newStage = currentStage + 1;
                                        block.setPermutation(block.permutation.withState("strat:growth_stage", newStage));
                                        console.log(`[MYSTICAL AGRICULTURE] Directly advanced custom crop: ${block.typeId} from ${currentStage} to ${newStage}`);
                                        
                                        // Spawn particles
                                        try {
                                            block.dimension.spawnParticle("minecraft:crop_growth_emitter", block.location);
                                        } catch (particleError) {
                                            // Ignore particle errors
                                        }
                                    }
                                }
                            } catch (cropError) {
                                console.log(`[MYSTICAL AGRICULTURE] Error processing custom crop directly: ${cropError}`);
                            }
                        }
                        
                        // Always consume water when used
                        const shouldConsumeWater = true;
                        
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
                                        
                                        // Always attempt to grow the crop (removed random chance)
                                        // Spawn particles
                                        targetBlock.dimension.spawnParticle("minecraft:crop_growth_emitter", targetBlock.location);
                                        
                                        // Try to advance the growth stage
                                        try {
                                            if (targetBlock.permutation) {
                                                const states = targetBlock.permutation.getAllStates();
                                                let growthState = null;
                                                let growthProperty = null;
                                                
                                                // Check for different growth properties - prioritize the addon's custom property
                                                if (states["strat:growth_stage"] !== undefined) {
                                                    growthState = states["strat:growth_stage"];
                                                    growthProperty = "strat:growth_stage";
                                                } else if (states["age"] !== undefined) {
                                                    growthState = states["age"];
                                                    growthProperty = "age";
                                                } else if (states["growth"] !== undefined) {
                                                    growthState = states["growth"];
                                                    growthProperty = "growth";
                                                }
                                                
                                                if (growthState !== null && growthProperty !== null) {
                                                    // Determine max age based on crop type
                                                    const maxAge = targetBlock.typeId.includes("beetroot") || 
                                                                  targetBlock.typeId.includes("berry") ? 3 : 7;
                                                    
                                                    // Only proceed if not already at max growth
                                                    if (growthState < maxAge) {
                                                        // Advance growth stage - always advance by 1
                                                        const newState = growthState + 1;
                                                        
                                                        // For custom crops (strat: prefix), use the same approach as cropManager.js
                                                        if (targetBlock.typeId.startsWith("strat:")) {
                                                            try {
                                                                // This is the exact same approach used in cropManager.js
                                                                // Direct permutation update with the correct state property
                                                                targetBlock.setPermutation(targetBlock.permutation.withState("strat:growth_stage", newState));
                                                                
                                                                // Spawn growth particles just like bonemeal does
                                                                try {
                                                                    targetBlock.dimension.spawnParticle("minecraft:crop_growth_emitter", targetBlock.location);
                                                                } catch (particleError) {
                                                                    // Ignore particle errors
                                                                }
                                                                
                                                                console.log(`[MYSTICAL AGRICULTURE] Advanced custom crop growth: ${targetBlock.typeId} from ${growthState} to ${newState}`);
                                                            } catch (updateError) {
                                                                console.log(`[MYSTICAL AGRICULTURE] Error updating custom crop: ${updateError}`);
                                                            }
                                                        } else {
                                                            // For vanilla crops, use the normal permutation update
                                                            const newPermutation = targetBlock.permutation.withState(growthProperty, newState);
                                                            if (newPermutation) {
                                                                targetBlock.setPermutation(newPermutation);
                                                                console.log(`[MYSTICAL AGRICULTURE] Advanced crop growth: ${targetBlock.typeId} from ${growthState} to ${newState} using property ${growthProperty}`);
                                                            }
                                                        }
                                                    } else {
                                                        console.log(`[MYSTICAL AGRICULTURE] Crop already at max growth: ${targetBlock.typeId} (${growthState}/${maxAge})`);
                                                    }
                                                } else {
                                                    console.log(`[MYSTICAL AGRICULTURE] No valid growth property found for: ${targetBlock.typeId}`);
                                                    console.log(`[MYSTICAL AGRICULTURE] Available states: ${JSON.stringify(states)}`);
                                                }
                                            }
                                        } catch (growthError) {
                                            console.log("[MYSTICAL AGRICULTURE] Error advancing crop growth:", growthError);
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