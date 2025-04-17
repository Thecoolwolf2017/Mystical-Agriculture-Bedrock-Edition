import * as server from "@minecraft/server";

// Simple watering can implementation
console.log("[MYSTICAL AGRICULTURE] Loading watering can script...");

// Function to check if an item is a watering can
function isWateringCan(itemId) {
    return itemId && itemId.startsWith("strat:") && itemId.endsWith("_can");
}

// Function to check if a block is water
function isWaterBlock(blockId) {
    if (!blockId) {
        console.log("[MYSTICAL AGRICULTURE] No blockId provided to isWaterBlock");
        return false;
    }
    
    // Check for numeric IDs in Bedrock Edition
    // 8 = flowing_water (ID in the table)
    // 9 = water (ID in the table)
    // 4 = water block (as mentioned in the documentation)
    if (blockId === 8 || blockId === 9 || blockId === 4 || 
        blockId === "8" || blockId === "9" || blockId === "4") {
        console.log("[MYSTICAL AGRICULTURE] Detected water by numeric ID: " + blockId);
        return true;
    }
    
    // Convert to lowercase for case-insensitive comparison
    const id = String(blockId).toLowerCase();
    
    // Check for various water block types - more inclusive matching based on Bedrock documentation
    const isWater = id === "minecraft:water" || 
                    id === "minecraft:flowing_water" || 
                    id.includes(":water") || 
                    id.includes("water") ||
                    id === "water" ||
                    id.includes("waterlogged") ||
                    id.includes("liquid") ||
                    id === "minecraft:bubble_column";
    
    if (isWater) {
        console.log("[MYSTICAL AGRICULTURE] Detected water by name: " + id);
    }
    
    // Additional check for cauldron with water
    if (id === "minecraft:cauldron" || id.includes("cauldron")) {
        console.log("[MYSTICAL AGRICULTURE] Detected possible cauldron, checking if it contains water");
        // Note: In a full implementation, we would check the cauldron's state to see if it contains water
        // This would require accessing the block's permutation and checking its states
        return true; // For now, assume all cauldrons can be used to fill the watering can
    }
    
    return isWater;
}

// Handle filling watering cans with water
// Try to use afterEvents.playerInteractWithBlock which is more widely available
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
                try {
                    // Get current lore
                    let lore = itemStack.getLore() || [];
                    
                    // Remove any "Empty" tags
                    lore = lore.filter(line => line !== "§7Empty");
                    
                    // Add "Filled" tag if not already present
                    if (!lore.includes("§7Filled")) {
                        lore.unshift("§7Filled");
                        player.onScreenDisplay.setActionBar("§aWatering can filled with water");
                        
                        try {
                            // Try to play a sound if available
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
                    }
                    
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
                                // Try direct equipment update if available
                                if (player.selectedSlot !== undefined) {
                                    const inventory = player.getComponent("inventory");
                                    if (inventory && inventory.container) {
                                        inventory.container.setItem(player.selectedSlot, itemStack);
                                        console.log("[MYSTICAL AGRICULTURE] Updated player equipment via inventory");
                                    }
                                }
                            }
                        } else {
                            console.log("[MYSTICAL AGRICULTURE] getComponent method not available on player");
                        }
                    } catch (equipError) {
                        console.error("[MYSTICAL AGRICULTURE] Error updating equipment:", equipError);
                    }
                } catch (loreError) {
                    console.error("[MYSTICAL AGRICULTURE] Error updating lore:", loreError);
                }
            }
        } catch (error) {
            console.error("[MYSTICAL AGRICULTURE] Error in watering can interaction:", error);
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
            // Basic validation
            const player = event.source;
            const itemStack = event.itemStack;
            
            if (!player || !itemStack) return;
            if (!isWateringCan(itemStack.typeId)) return;
            
            console.log("[MYSTICAL AGRICULTURE] Player used watering can");
            
            // Check if the watering can is filled
            const lore = itemStack.getLore() || [];
            if (!lore.includes("§7Filled")) {
                // Try to fill the watering can if looking at water
                if (typeof player.getBlockFromViewDirection === 'function') {
                    try {
                        // Increase max distance to better detect water blocks
                        const viewBlock = player.getBlockFromViewDirection({ maxDistance: 8 });
                        if (viewBlock && viewBlock.block) {
                            const block = viewBlock.block;
                            console.log("[MYSTICAL AGRICULTURE] Looking at block: " + block.typeId);
                            
                            console.log("[MYSTICAL AGRICULTURE] Checking for water in itemUse event: " + block.typeId + ", Block ID type: " + typeof block.typeId);
                            
                            // Check if the player is standing in water
                            const playerStandingBlock = player.dimension.getBlock({
                                x: Math.floor(player.location.x),
                                y: Math.floor(player.location.y),
                                z: Math.floor(player.location.z)
                            });
                            
                            if (playerStandingBlock && isWaterBlock(playerStandingBlock.typeId)) {
                                console.log("[MYSTICAL AGRICULTURE] Player is standing in water: " + playerStandingBlock.typeId);
                                // We'll use this as our water source later
                            }
                            
                            // Try to get the block's permutation for more detailed information
                            try {
                                if (block.permutation) {
                                    const blockState = block.permutation.getAllStates();
                                    console.log("[MYSTICAL AGRICULTURE] Block states in itemUse: " + JSON.stringify(blockState));
                                }
                            } catch (stateError) {
                                console.log("[MYSTICAL AGRICULTURE] Could not get block states in itemUse: " + stateError);
                            }
                            
                            // Try to check blocks around the player for water
                            const playerPos = player.location;
                            let foundWaterBlock = null; // New variable to store the water block
                            
                            // Check if player is standing in water first (reuse the check from earlier if possible)
                            if (typeof playerStandingBlock !== 'undefined' && isWaterBlock(playerStandingBlock.typeId)) {
                                console.log(`[MYSTICAL AGRICULTURE] Using already detected water at player position: ${playerStandingBlock.typeId}`);
                                foundWaterBlock = playerStandingBlock;
                            } else {
                                // Check again if not already checked
                                const playerCurrentBlock = player.dimension.getBlock({
                                    x: Math.floor(playerPos.x),
                                    y: Math.floor(playerPos.y),
                                    z: Math.floor(playerPos.z)
                                });
                                
                                if (playerCurrentBlock && isWaterBlock(playerCurrentBlock.typeId)) {
                                    console.log(`[MYSTICAL AGRICULTURE] Player is standing in water: ${playerCurrentBlock.typeId}`);
                                    foundWaterBlock = playerCurrentBlock;
                                }
                            }
                            
                            // If not found yet, check a wider area around player
                            if (!foundWaterBlock) {
                                // Expand search area to 3x3x3
                                for (let x = -2; x <= 2; x++) {
                                    for (let y = -2; y <= 1; y++) {
                                        for (let z = -2; z <= 2; z++) {
                                            try {
                                                const nearbyBlock = player.dimension.getBlock({
                                                    x: Math.floor(playerPos.x) + x,
                                                    y: Math.floor(playerPos.y) + y,
                                                    z: Math.floor(playerPos.z) + z
                                                });
                                                
                                                if (nearbyBlock) {
                                                    console.log(`[MYSTICAL AGRICULTURE] Checking nearby block at offset (${x},${y},${z}): ${nearbyBlock.typeId}`);
                                                    if (isWaterBlock(nearbyBlock.typeId)) {
                                                        console.log(`[MYSTICAL AGRICULTURE] Found water nearby at offset (${x},${y},${z})`);
                                                        foundWaterBlock = nearbyBlock; // Store the water block in our new variable
                                                        break; // Exit the loop once we find water
                                                    }
                                                }
                                            } catch (nearbyError) {
                                                console.log(`[MYSTICAL AGRICULTURE] Error checking nearby block: ${nearbyError}`);
                                            }
                                        }
                                        if (foundWaterBlock) break;
                                    }
                                    if (foundWaterBlock) break;
                                }
                            }
                            
                            // Use either the original block or the found water block
                            if (isWaterBlock(block.typeId) || foundWaterBlock) {
                                console.log("[MYSTICAL AGRICULTURE] Using water block to fill watering can");
                                console.log("[MYSTICAL AGRICULTURE] Found water block in view: " + block.typeId);
                                
                                // Remove any "Empty" tags
                                const updatedLore = lore.filter(line => line !== "§7Empty");
                                
                                // Add "Filled" tag if not already present
                                if (!updatedLore.includes("§7Filled")) {
                                    updatedLore.unshift("§7Filled");
                                    player.onScreenDisplay.setActionBar("§aWatering can filled with water");
                                    
                                    try {
                                        // Try to play a sound if available
                                        player.playSound("bucket.fill_water");
                                    } catch (soundError) {
                                        // Fallback sound if the first one isn't available
                                        try {
                                            player.dimension.playSound("bucket.fill_water", player.location);
                                        } catch (fallbackError) {
                                            console.log("[MYSTICAL AGRICULTURE] Could not play sound: " + fallbackError);
                                        }
                                    }
                                    
                                    // Update the item's lore
                                    itemStack.setLore(updatedLore);
                                    
                                    // Update the player's equipment
                                    try {
                                        if (typeof player.getComponent === 'function') {
                                            const inventory = player.getComponent("inventory");
                                            if (inventory && inventory.container && player.selectedSlot !== undefined) {
                                                inventory.container.setItem(player.selectedSlot, itemStack);
                                                console.log("[MYSTICAL AGRICULTURE] Updated player equipment via inventory");
                                            }
                                        }
                                    } catch (equipError) {
                                        console.error("[MYSTICAL AGRICULTURE] Error updating equipment:", equipError);
                                    }
                                    
                                    console.log("[MYSTICAL AGRICULTURE] Watering can filled with water");
                                    return; // Exit after filling
                                }
                            }
                        }
                    } catch (viewError) {
                        console.error("[MYSTICAL AGRICULTURE] Error checking view direction:", viewError);
                    }
                }
                
                player.onScreenDisplay.setActionBar("§cFill the watering can with water first");
                console.log("[MYSTICAL AGRICULTURE] Watering can is not filled");
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
                const blockLocation = block.location;
                
                // Get the area of effect from the watering can's tags
                const tags = itemStack.getTags() || [];
                const areaTag = tags.find(tag => tag.startsWith("area"));
                
                // Default to area 1 if no tag is found
                const area = areaTag ? Math.floor((parseInt(areaTag.split(":").pop()) / 2)) : 1;
                console.log(`[MYSTICAL AGRICULTURE] Watering can area: ${area * 2 + 1}x${area * 2 + 1}`);
                
                // Show message that watering can is being used
                player.onScreenDisplay.setActionBar("§aUsing watering can");
                console.log("[MYSTICAL AGRICULTURE] Using watering can on crops");
                
                // Consume water from the can (1 in 30 chance - much less frequent)
                if (Math.floor(Math.random() * 30) === 0) {
                    // Update lore to show the can is now empty
                    const updatedLore = lore.filter(line => line !== "§7Filled");
                    updatedLore.unshift("§7Empty");
                    itemStack.setLore(updatedLore);
                    
                    // Update the player's equipment
                    try {
                        if (typeof player.getComponent === 'function') {
                            const inventory = player.getComponent("inventory");
                            if (inventory && inventory.container && player.selectedSlot !== undefined) {
                                inventory.container.setItem(player.selectedSlot, itemStack);
                                console.log("[MYSTICAL AGRICULTURE] Watering can is now empty");
                                player.onScreenDisplay.setActionBar("§cWatering can is now empty");
                            }
                        }
                    } catch (equipError) {
                        console.error("[MYSTICAL AGRICULTURE] Error updating equipment:", equipError);
                    }
                } else {
                    // Make sure the player knows the can is still filled
                    player.onScreenDisplay.setActionBar("§aWatering plants (§7Filled§a)");
                }
                
                // Apply watering can effect to blocks in the area
                for (let dx = -area; dx <= area; dx++) {
                    for (let dy = 0; dy <= 1; dy++) {
                        for (let dz = -area; dz <= area; dz++) {
                            const x = blockLocation.x + dx;
                            const y = blockLocation.y + dy;
                            const z = blockLocation.z + dz;
                            
                            try {
                                const targetBlock = block.dimension.getBlock({ x, y, z });
                                if (!targetBlock) continue;
                                
                                // Spawn particles
                                targetBlock.dimension.spawnParticle("strat:watering_can", { x, y, z });
                                
                                // Check if this is a crop that can grow
                                try {
                                    // First try to check for custom growth state
                                    let canGrow = false;
                                    let growthState = null;
                                    
                                    try {
                                        if (targetBlock.permutation) {
                                            const state = targetBlock.permutation.getAllStates();
                                            console.log(`[MYSTICAL AGRICULTURE] Block states for ${targetBlock.typeId}: ${JSON.stringify(state)}`);
                                            
                                            // Check for mystical agriculture custom growth state
                                            if (state && (state["strat:growth"] !== undefined)) {
                                                canGrow = true;
                                                growthState = state["strat:growth"];
                                                console.log(`[MYSTICAL AGRICULTURE] Found custom crop with growth state: ${growthState}`);
                                            }
                                            // Check for vanilla growth state
                                            else if (state && (state["growth"] !== undefined || state["age"] !== undefined)) {
                                                canGrow = true;
                                                growthState = state["growth"] !== undefined ? state["growth"] : state["age"];
                                                console.log(`[MYSTICAL AGRICULTURE] Found vanilla crop with growth state: ${growthState}`);
                                            }
                                        }
                                    } catch (stateError) {
                                        console.log(`[MYSTICAL AGRICULTURE] Error checking block states: ${stateError}`);
                                    }
                                    
                                    // Also check if this is a crop by type ID
                                    if (!canGrow) {
                                        const cropTypes = [
                                            "wheat", "potato", "carrot", "beetroot", "melon", "pumpkin", 
                                            "bamboo", "sweet_berry", "cactus", "sugar_cane", "crop", "sapling"
                                        ];
                                        
                                        const id = targetBlock.typeId.toLowerCase();
                                        for (const cropType of cropTypes) {
                                            if (id.includes(cropType)) {
                                                canGrow = true;
                                                console.log(`[MYSTICAL AGRICULTURE] Found crop by type ID: ${id}`);
                                                break;
                                            }
                                        }
                                    }
                                    
                                    if (canGrow) {
                                        // Random chance to grow the crop (1 in 16 - increased from 1 in 32 for better results)
                                        if (Math.floor(Math.random() * 16) + 1 === 1) {
                                            // Spawn growth particles
                                            targetBlock.dimension.spawnParticle("minecraft:crop_growth_emitter", targetBlock.center());
                                            
                                            // For custom crops with strat:growth state
                                            if (growthState !== null && targetBlock.permutation.getState("strat:growth") !== undefined) {
                                                const state = targetBlock.permutation.getAllStates();
                                                // Increase the growth state (max 7)
                                                state["strat:growth"] = Math.min(state["strat:growth"] + 1, 7);
                                                targetBlock.setPermutation(server.BlockPermutation.resolve(targetBlock.typeId, state));
                                                console.log(`[MYSTICAL AGRICULTURE] Grew custom crop at ${x}, ${y}, ${z} to stage ${state["strat:growth"]}`);
                                            }
                                            // For vanilla crops
                                            else {
                                                // Use the vanilla tick event to trigger growth
                                                try {
                                                    targetBlock.dimension.runCommand(`tickingarea add ${x} ${y} ${z} ${x} ${y} ${z} temp_growth_area`);
                                                    targetBlock.dimension.runCommand(`tickingarea remove temp_growth_area`);
                                                    console.log(`[MYSTICAL AGRICULTURE] Triggered vanilla growth for crop at ${x}, ${y}, ${z}`);
                                                } catch (cmdError) {
                                                    console.log(`[MYSTICAL AGRICULTURE] Error running growth commands: ${cmdError}`);
                                                }
                                            }
                                        }
                                    }
                                } catch (cropError) {
                                    console.log(`[MYSTICAL AGRICULTURE] Error processing crop: ${cropError}`);
                                }
                            } catch (blockError) {
                                console.error(`[MYSTICAL AGRICULTURE] Error processing block at ${x}, ${y}, ${z}:`, blockError);
                            }
                        }
                    }
                }
            } catch (viewError) {
                console.error("[MYSTICAL AGRICULTURE] Error getting block from view direction:", viewError);
            }
        } catch (error) {
            console.error("[MYSTICAL AGRICULTURE] Error in watering can use:", error);
        }
    });
    console.log("[MYSTICAL AGRICULTURE] Registered itemUse event for watering cans");
} else {
    console.error("[MYSTICAL AGRICULTURE] itemUse event not available!");
}