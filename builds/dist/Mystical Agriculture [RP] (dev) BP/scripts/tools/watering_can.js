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
    
    const id = String(blockId).toLowerCase();
    
    // Skip grass blocks and regular dirt blocks
    if (id === "minecraft:grass_block" || id === "minecraft:dirt") {
        return false;
    }
    
    // Check if this is a crop block
    if (id.includes("crop") || 
        id.includes("wheat") || 
        id.includes("potato") || 
        id.includes("carrot") || 
        id.includes("beetroot") || 
        id.includes("melon") || 
        id.includes("pumpkin") || 
        id.includes("berry") || 
        id.includes("bamboo") || 
        id.includes("sapling") || 
        id.includes("kelp") || 
        id.includes("cactus") || 
        id.includes("sugar_cane") || 
        id.includes("cocoa") || 
        id.startsWith("strat:") || 
        id.includes("farmland") || 
        id.includes("soil")) {
        return true;
    }
    
    return false;
}

// Function to check if a block is water
function isWaterBlock(blockId) {
    if (!blockId) {
        return false;
    }
    
    // Handle numeric IDs for water (Bedrock Edition uses these)
    if (blockId === 8 || blockId === 9) {
        console.log("[MYSTICAL AGRICULTURE] Detected water by numeric ID: " + blockId);
        return true;
    }
    
    // Convert to lowercase for case-insensitive comparison
    const id = String(blockId).toLowerCase();
    
    // IMPORTANT: Explicitly exclude sand and gravel to prevent them from being detected as water
    if (id === "minecraft:sand" || id.includes(":sand") || id === "minecraft:gravel" || id.includes(":gravel")) {
        return false;
    }
    
    // Check for cauldrons with water
    if (id === "minecraft:cauldron" || id === "minecraft:water_cauldron") {
        return true;
    }
    
    // Check for waterlogged blocks
    if (typeof blockId === 'object' && blockId.permutation) {
        try {
            const states = blockId.permutation.getAllStates();
            if (states && states.waterlogged === true) {
                return true;
            }
        } catch (error) {
            // Ignore errors when checking states
        }
    }
    
    // Check for various water block types
    const isWater = id === "minecraft:water" || 
                    id === "minecraft:flowing_water" || 
                    id === "water" ||
                    id === "flowing_water" ||
                    id === "minecraft:bubble_column" ||
                    id === "minecraft:water_bucket" ||
                    id === "minecraft:kelp" ||
                    id === "minecraft:seagrass" ||
                    id === "minecraft:lily_pad" ||
                    id === "minecraft:ice" ||
                    id === "minecraft:packed_ice" ||
                    id === "minecraft:blue_ice" ||
                    id === "minecraft:frosted_ice" ||
                    id === "minecraft:snow" ||
                    id === "minecraft:snow_layer" ||
                    id === "minecraft:powder_snow";
    
    // More specific checks for water blocks
    if (!isWater && id.includes(":water")) {
        return true;
    }
    
    // In debug mode, allow specific blocks to be used as water
    if (DEBUG_MODE) {
        if (id === "minecraft:grass_block" || 
            id === "minecraft:dirt" || 
            id === "minecraft:farmland" ||
            id.includes("flower") ||
            id.includes("_crop") ||
            id.includes("allium") ||
            id.includes("air")) {
            console.log("[MYSTICAL AGRICULTURE] Debug mode: Treating " + id + " as water");
            return true;
        }
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
            const lore = itemStack.getLore();
            
            // In debug mode, always consider the watering can filled
            if (DEBUG_MODE) {
                // If not already filled, add the filled tag
                if (!lore.includes("§7Filled")) {
                    // Remove any "Empty" tags
                    const updatedLore = lore.filter(line => line !== "§7Empty");
                    
                    // Add "Filled" tag if not already present
                    updatedLore.unshift("§7Filled");
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
                    
                    player.onScreenDisplay.setActionBar("§aDebug mode: Watering can automatically filled");
                    console.log("[MYSTICAL AGRICULTURE] Debug mode: Watering can automatically filled");
                }
            }          
            // For normal mode, check if the watering can is filled
            if (!lore.includes("§7Filled") && !DEBUG_MODE) {
                // Try to fill the watering can if looking at water
                if (typeof player.getBlockFromViewDirection === 'function') {
                    try {
                        // Increase max distance to better detect water blocks
                        const viewBlock = player.getBlockFromViewDirection({ maxDistance: 8 });
                        if (viewBlock && viewBlock.block) {
                            const block = viewBlock.block;
                            console.log("[MYSTICAL AGRICULTURE] Looking at block: " + block.typeId);
                            
                            console.log("[MYSTICAL AGRICULTURE] Checking for water in itemUse event: " + block.typeId + ", Block ID type: " + typeof block.typeId);
                            
                            // Check if the player is standing above water
                            const playerPos = player.location;
                            const blockBelowPlayer = player.dimension.getBlock({
                                x: Math.floor(playerPos.x),
                                y: Math.floor(playerPos.y) - 1,
                                z: Math.floor(playerPos.z)
                            });
                            
                            if (blockBelowPlayer && isWaterBlock(blockBelowPlayer.typeId)) {
                                console.log(`[MYSTICAL AGRICULTURE] Player is standing above water: ${blockBelowPlayer.typeId}`);
                                // Don't auto-fill when standing on water - require direct interaction
                            }
                            // Check the block the player is looking at
                            const viewedBlock = player.dimension.getBlock({
                                x: Math.floor(player.location.x),
                                y: Math.floor(player.location.y),
                                z: Math.floor(player.location.z)
                            });
                            
                            // Check nearby blocks for water (5x4x5 area around player)
                            let foundWaterBlock = null;
                            if (!isWaterBlock(viewedBlock.typeId)) {
                                console.log("[MYSTICAL AGRICULTURE] Checking nearby blocks for water");
                                const playerPos = player.location;
                                
                                // Check a 5x4x5 area around the player for water
                                for (let x = -2; x <= 2; x++) {
                                    for (let y = -3; y <= 1; y++) {
                                        for (let z = -2; z <= 2; z++) {
                                            try {
                                                // Skip the block we're already checking
                                                if (x === 0 && y === 0 && z === 0) continue;
                                                
                                                const nearbyBlock = player.dimension.getBlock({
                                                    x: Math.floor(playerPos.x) + x,
                                                    y: Math.floor(playerPos.y) + y,
                                                    z: Math.floor(playerPos.z) + z
                                                });
                                                
                                                if (nearbyBlock) {
                                                    console.log(`[MYSTICAL AGRICULTURE] Checking nearby block at offset (${x},${y},${z}): ${nearbyBlock.typeId}`);
                                                    if (isWaterBlock(nearbyBlock.typeId)) {
                                                        console.log(`[MYSTICAL AGRICULTURE] Found water nearby at offset (${x},${y},${z})`);
                                                        foundWaterBlock = nearbyBlock;
                                                        break;
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
                            // Only fill if looking directly at water or if water is nearby
                            if (isWaterBlock(block.typeId) || isWaterBlock(viewedBlock.typeId) || foundWaterBlock || isWaterBlock(blockBelowPlayer.typeId)) {
                                console.log("[MYSTICAL AGRICULTURE] Using water block to fill watering can");
                                
                                // If we're in debug mode and found water nearby but not directly in view
                                if (DEBUG_MODE && foundWaterBlock && !isWaterBlock(block.typeId)) {
                                    console.log("[MYSTICAL AGRICULTURE] Debug mode: Found water nearby, not directly in view");
                                } else if (DEBUG_MODE && hasDebugTag(player) && !isWaterBlock(block.typeId) && !foundWaterBlock) {
                                    console.log("[MYSTICAL AGRICULTURE] Debug mode: Filling watering can without water");
                                } else {
                                    // Double-check to prevent sand from being detected as water
                                    if (block.typeId.includes("sand")) {
                                        console.log("[MYSTICAL AGRICULTURE] Prevented sand from being detected as water");
                                        player.onScreenDisplay.setActionBar("§cYou need to look at water to fill the watering can");
                                        return;
                                    }
                                    
                                    // Fill the watering can if we're near water (even if not looking directly at it)
                                    let waterSource = "";
                                    if (isWaterBlock(block.typeId)) {
                                        waterSource = "looking directly at water";
                                    } else if (isWaterBlock(blockBelowPlayer.typeId)) {
                                        waterSource = "standing on water";
                                    } else if (foundWaterBlock) {
                                        waterSource = "near water";
                                    } else if (isWaterBlock(viewedBlock.typeId)) {
                                        waterSource = "looking at water block";
                                    }
                                    
                                    console.log(`[MYSTICAL AGRICULTURE] Filling watering can (${waterSource})`);
                                    
                                    // Create a completely new filled watering can
                                    const filledCanItem = itemStack.clone();
                                    
                                    // Set the lore to Filled
                                    const newLore = ["§7Filled"];
                                    filledCanItem.setLore(newLore);
                                    
                                    // Update the player's inventory with the filled can
                                    try {
                                        if (typeof player.getComponent === 'function') {
                                            const inventory = player.getComponent("inventory");
                                            if (inventory && inventory.container && player.selectedSlot !== undefined) {
                                                inventory.container.setItem(player.selectedSlot, filledCanItem);
                                                player.onScreenDisplay.setActionBar("§aWatering can filled with water");
                                                console.log("[MYSTICAL AGRICULTURE] Watering can filled with water");
                                                
                                                // Play a sound effect
                                                try {
                                                    player.playSound("bucket.fill_water");
                                                } catch (soundError) {
                                                    try {
                                                        player.dimension.playSound("bucket.fill_water", player.location);
                                                    } catch (fallbackError) {
                                                        // Ignore sound errors
                                                    }
                                                }
                                                
                                                return; // Exit after filling
                                            }
                                        }
                                    } catch (error) {
                                        console.error("[MYSTICAL AGRICULTURE] Error updating inventory: " + error);
                                    }
                                    
                                    // This code is now handled by the filledCanItem logic above
                                    // Removed to prevent duplicate filling logic
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
                
                // IMPORTANT: Check if the player is looking directly at a crop
                // If so, we need to offset the location to make sure we're not trying to grow the block we're looking at
                let centerLocation = {...blockLocation};
                if (block.typeId.includes("crop") || block.typeId.startsWith("strat:")) {
                    console.log(`[MYSTICAL AGRICULTURE] Looking directly at a crop: ${block.typeId}`);
                    // Use the player's location as the center instead
                    centerLocation = {
                        x: Math.floor(player.location.x),
                        y: Math.floor(player.location.y),
                        z: Math.floor(player.location.z)
                    };
                }
                
                // Get the watering can properties based on its tier
                const canProperties = getWateringCanTier(itemStack.typeId);
                const area = canProperties.range;
                const growthChance = canProperties.growthChance;
                
                console.log(`[MYSTICAL AGRICULTURE] Watering can tier: ${canProperties.tier}, area: ${area * 2 + 1}x${area * 2 + 1}, growth chance: ${growthChance * 100}%`);
                
                // Check if the watering can is filled before using it
                if (!lore.includes("§7Filled")) {
                    player.onScreenDisplay.setActionBar("§cWatering can is empty! Fill it with water first.");
                    console.log("[MYSTICAL AGRICULTURE] Attempted to use empty watering can");
                    return; // Exit early if the watering can is empty
                }
                
                // In debug mode, log the watering can tier and properties
                console.log(`[MYSTICAL AGRICULTURE] Watering can tier: ${canProperties.tier}, area: ${canProperties.range*2+1}x${canProperties.range*2+1}, growth chance: ${Math.round(canProperties.growthChance*100)}%`);
                
                // Show message that watering can is being used
                console.log("[MYSTICAL AGRICULTURE] Using watering can on crops");
                
                // Create a completely new empty watering can item
                const emptyCanItem = itemStack.clone();
                
                // Clear existing lore and set it to Empty
                const newLore = ["§7Empty"];
                emptyCanItem.setLore(newLore);
                
                // Show message to player
                player.onScreenDisplay.setActionBar("§aWatering plants (§cNow Empty§a)");
                console.log("[MYSTICAL AGRICULTURE] Watering can used up its water");
                
                // Replace the watering can with the empty version in the player's inventory
                try {
                    if (typeof player.getComponent === 'function') {
                        const inventory = player.getComponent("inventory");
                        if (inventory && inventory.container && player.selectedSlot !== undefined) {
                            // Replace the item with our empty version
                            inventory.container.setItem(player.selectedSlot, emptyCanItem);
                            console.log("[MYSTICAL AGRICULTURE] Replaced watering can with empty version");
                        }
                    }
                } catch (equipError) {
                    console.error("[MYSTICAL AGRICULTURE] Error updating equipment after water use:", equipError);
                }
                
                // Apply growth effect to crops in range
                const range = canProperties.range;
                
                // Increase growth chance in debug mode
                const effectiveGrowthChance = DEBUG_MODE ? 0.75 : canProperties.growthChance;
                
                // Define the area to check for crops
                for (let x = -range; x <= range; x++) {
                    for (let z = -range; z <= range; z++) {
                        // Skip blocks that are too far away (for circular pattern)
                        if (x*x + z*z > range*range) continue;
                        
                        // Get the block at the offset position
                        try {
                            // Use the center location (which might be the player's location if looking at a crop)
                            const targetBlock = block.dimension.getBlock({
                                x: centerLocation.x + x,
                                y: centerLocation.y,
                                z: centerLocation.z + z
                            });
                            
                            // Also check one block below for crops (many crops are on farmland)
                            let targetBlockBelow = null;
                            try {
                                targetBlockBelow = block.dimension.getBlock({
                                    x: centerLocation.x + x,
                                    y: centerLocation.y - 1,
                                    z: centerLocation.z + z
                                });
                            } catch (belowError) {
                                // Ignore errors when checking blocks below
                            }
                            if (!targetBlock) continue;
                            
                            // Skip non-farmland and non-crop blocks
                            if (!isFarmlandOrCrop(targetBlock.typeId) && (!targetBlockBelow || !isFarmlandOrCrop(targetBlockBelow.typeId))) {
                                continue;
                            }
                            
                            // If we're looking at a crop block directly, make sure to include it
                            if (block.typeId === targetBlock.typeId && block.location.x === targetBlock.location.x && 
                                block.location.y === targetBlock.location.y && block.location.z === targetBlock.location.z) {
                                console.log(`[MYSTICAL AGRICULTURE] Including the directly targeted crop: ${targetBlock.typeId}`);
                            }
                            
                            // Spawn particles for visual effect
                            targetBlock.dimension.spawnParticle("minecraft:water_splash_particle", { x: blockLocation.x + x, y: blockLocation.y, z: blockLocation.z + z });
                            
                            // Check for growth state
                            let canGrow = false;
                            let growthState = null;
                            
                            try {
                                if (targetBlock.permutation) {
                                    const states = targetBlock.permutation.getAllStates();
                                    
                                    // Only log states for debugging
                                    if (DEBUG_MODE) {
                                        console.log(`[MYSTICAL AGRICULTURE] Block states for ${targetBlock.typeId}: ${JSON.stringify(states)}`);
                                    }
                                    
                                    // In debug mode, always allow crops to grow
                                    if (DEBUG_MODE && targetBlock.typeId.includes("crop")) {
                                        canGrow = true;
                                        growthState = 0; // Assume it's at the beginning stage
                                        console.log(`[MYSTICAL AGRICULTURE] Debug mode: Allowing crop to grow: ${targetBlock.typeId}`);
                                    }
                                    // Check for custom growth state (strat:growth_stage)
                                    else if (states && states["strat:growth_stage"] !== undefined) {
                                        growthState = states["strat:growth_stage"];
                                        console.log(`[MYSTICAL AGRICULTURE] Found custom crop with growth_stage: ${growthState}`);
                                        if (growthState < 7) { // Max growth stage is 7
                                            canGrow = true;
                                        }
                                    }
                                    // Also check for strat:growth which might be used in some crops
                                    else if (states && states["strat:growth"] !== undefined) {
                                        growthState = states["strat:growth"];
                                        console.log(`[MYSTICAL AGRICULTURE] Found custom crop with growth: ${growthState}`);
                                        if (growthState < 7) { // Max growth stage is 7
                                            canGrow = true;
                                        }
                                    }
                                    // Check for vanilla growth state (age)
                                    else if (states && states.age !== undefined) {
                                        growthState = states.age;
                                        // Different max ages for different crops
                                        const maxAge = targetBlock.typeId.includes("beetroot") || targetBlock.typeId.includes("berry") ? 3 : 7;
                                        if (growthState < maxAge) {
                                            canGrow = true;
                                        }
                                    }
                                    // If we still can't determine if it can grow but it has "crop" in the name, allow it to grow
                                    else if (targetBlock.typeId.includes("crop") || targetBlock.typeId.startsWith("strat:")) {
                                        canGrow = true;
                                        growthState = 0; // Assume it's at the beginning stage
                                        console.log(`[MYSTICAL AGRICULTURE] Assuming crop can grow: ${targetBlock.typeId}`);
                                    }
                                    // Special case for farmland - check moisture level
                                    else if (states && states.moisture !== undefined) {
                                        const moisture = states.moisture;
                                        if (moisture < 7) { // Max moisture is 7
                                            // Increase moisture level on farmland
                                            try {
                                                // We can't directly set the moisture, but we can simulate it with particles
                                                targetBlock.dimension.spawnParticle("minecraft:water_splash_particle", targetBlock.center());
                                                canGrow = true; // Consider farmland as something that can be affected
                                            } catch (moistureError) {
                                                console.log(`[MYSTICAL AGRICULTURE] Error setting farmland moisture: ${moistureError}`);
                                            }
                                        }
                                    }
                                }
                            } catch (stateError) {
                                console.log(`[MYSTICAL AGRICULTURE] Error checking growth state: ${stateError}`);
                            }
                            
                            if (canGrow) {
                                // Attempt to grow the crop by applying bonemeal-like effect
                                if (Math.random() < effectiveGrowthChance) {
                                    // Spawn growth particles
                                    targetBlock.dimension.spawnParticle("minecraft:crop_growth_emitter", targetBlock.center());
                                    
                                    try {
                                        // Try to advance the crop's growth stage
                                        if (growthState !== null) {
                                            // For custom crops (strat: prefix)
                                            if (targetBlock.typeId.startsWith("strat:")) {
                                                const newState = Math.min(growthState + 1, 7);
                                                let newPermutation = null;
                                                
                                                // Check which property the crop is using
                                                if (targetBlock.permutation.getState("strat:growth_stage") !== undefined) {
                                                    newPermutation = targetBlock.permutation.withState("strat:growth_stage", newState);
                                                    console.log(`[MYSTICAL AGRICULTURE] Advanced custom crop with growth_stage from ${growthState} to ${newState}`);
                                                } else if (targetBlock.permutation.getState("strat:growth") !== undefined) {
                                                    newPermutation = targetBlock.permutation.withState("strat:growth", newState);
                                                    console.log(`[MYSTICAL AGRICULTURE] Advanced custom crop with growth from ${growthState} to ${newState}`);
                                                } else {
                                                    // Force growth for any custom crop even without known properties
                                                    console.log(`[MYSTICAL AGRICULTURE] Forcing growth on custom crop: ${targetBlock.typeId}`);
                                                    // Try to use a generic approach for custom crops
                                                    try {
                                                        // Try to apply a bonemeal-like effect
                                                        const location = targetBlock.location;
                                                        player.dimension.spawnParticle("minecraft:crop_growth_emitter", location);
                                                        
                                                        // If we're in debug mode, try to set a new permutation
                                                        if (DEBUG_MODE) {
                                                            // Try to create a new permutation with an incremented growth stage
                                                            const allStates = targetBlock.permutation.getAllStates();
                                                            const newStates = {...allStates};
                                                            
                                                            // Try to find any property that might be related to growth
                                                            for (const key in newStates) {
                                                                if (key.includes("growth") || key.includes("stage") || key.includes("age")) {
                                                                    const currentValue = newStates[key];
                                                                    if (typeof currentValue === 'number' && currentValue < 7) {
                                                                        newStates[key] = currentValue + 1;
                                                                        console.log(`[MYSTICAL AGRICULTURE] Found and incremented property: ${key} from ${currentValue} to ${currentValue + 1}`);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    } catch (forceGrowthError) {
                                                        console.log(`[MYSTICAL AGRICULTURE] Error forcing growth: ${forceGrowthError}`);
                                                    }
                                                }
                                                
                                                if (newPermutation) {
                                                    targetBlock.setPermutation(newPermutation);
                                                    // Try to play a sound effect for growth
                                                    try {
                                                        player.dimension.spawnParticle("minecraft:crop_growth_emitter", targetBlock.location);
                                                        player.playSound("random.levelup", {pitch: 2.0, volume: 0.5});
                                                    } catch (soundError) {
                                                        // Ignore sound errors
                                                    }
                                                }
                                            }
                                            // For vanilla crops
                                            else {
                                                const maxAge = targetBlock.typeId.includes("beetroot") || targetBlock.typeId.includes("berry") ? 3 : 7;
                                                const newState = Math.min(growthState + 1, maxAge);
                                                const newPermutation = targetBlock.permutation.withState("age", newState);
                                                targetBlock.setPermutation(newPermutation);
                                                console.log(`[MYSTICAL AGRICULTURE] Advanced vanilla crop growth from ${growthState} to ${newState}`);
                                                
                                                // Try to play a sound effect for growth
                                                try {
                                                    player.dimension.spawnParticle("minecraft:crop_growth_emitter", targetBlock.location);
                                                    player.playSound("random.levelup", {pitch: 2.0, volume: 0.5});
                                                } catch (soundError) {
                                                    // Ignore sound errors
                                                }
                                            }
                                        }
                                    } catch (growthError) {
                                        console.log(`[MYSTICAL AGRICULTURE] Error advancing crop growth: ${growthError}`);
                                    }
                                }
                            }
                        } catch (blockError) {
                            console.error(`[MYSTICAL AGRICULTURE] Error processing block at offset (${x}, ${z}):`, blockError);
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