import * as server from "@minecraft/server";

/**
 * Helper function to generate random integers
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {number} Random integer between min and max
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Ore XP System:
 * This system detects when ore blocks are broken and spawns XP orbs.
 * It uses a global event handler to catch blocks before they're destroyed.
 */
const world = server.world;

world.beforeEvents.playerBreakBlock.subscribe((event) => {
    const { block, player, dimension } = event;
    
    // Only process blocks that might be ores
    if (!block) return;
    
    // Check if the block is an ore (by typeId or tag)
    const isOre = (block.hasTag && block.hasTag("ore")) || 
                 block.typeId.includes("_ore") || 
                 block.typeId.includes("prosperity") || 
                 block.typeId.includes("inferium") || 
                 block.typeId.includes("soulium");
    
    // Improved approach to check if player is using a pickaxe
    let isUsingPickaxe = false;
    
    // Skip tool check if block is not an ore
    if (!isOre) {
        isUsingPickaxe = true; // Not an ore, so we don't need to check
    } else {
        try {
            // Get the item the player is holding
            const itemInHand = player.selectedItem;
            
            // Properly handle empty hands case
            if (!itemInHand) {
                isUsingPickaxe = false;
                console.log(`[MYSTICAL AGRICULTURE] Player has empty hand - cannot mine ore`);
            }
            // Check if the item's ID contains 'pickaxe'
            else if (itemInHand.typeId && itemInHand.typeId.includes("pickaxe")) {
                isUsingPickaxe = true;
                console.log(`[MYSTICAL AGRICULTURE] Player using pickaxe: ${itemInHand.typeId}`);
            } else {
                isUsingPickaxe = false;
                console.log(`[MYSTICAL AGRICULTURE] Player using non-pickaxe tool: ${itemInHand.typeId}`);
            }
        } catch (error) {
            console.error(`[MYSTICAL AGRICULTURE] Error checking tool: ${error.message}`);
            // If there's an error, don't allow mining to prevent exploits
            isUsingPickaxe = false;
        }
    }
    
    // If it's an ore and the player isn't using a pickaxe, let them mine it but don't spawn XP
    // We don't cancel the event - let them mine it, but the loot table will handle not giving drops
    if (isOre && !isUsingPickaxe) {
        // Skip XP spawning when not using a pickaxe
        return;
    }
    
    if (isOre) {
        console.log(`[MYSTICAL AGRICULTURE] Detected ore break: ${block.typeId}`);
        
        // Get the block's position
        const pos = block.location;
        
        // Determine the amount of XP to drop based on the block type
        let xp = 0;
        
        if (block.typeId.includes("diamond")) {
            xp = randomInt(3, 7);
        } else if (block.typeId.includes("emerald")) {
            xp = randomInt(3, 7);
        } else if (block.typeId.includes("lapis")) {
            xp = randomInt(2, 5);
        } else if (block.typeId.includes("redstone")) {
            xp = randomInt(1, 5);
        } else if (block.typeId.includes("gold") || block.typeId.includes("quartz")) {
            xp = randomInt(0, 2);
        } else if (block.typeId.includes("iron") || block.typeId.includes("copper")) {
            xp = randomInt(0, 1);
        } else if (block.typeId.includes("coal")) {
            xp = randomInt(0, 2);
        } else if (block.typeId.includes("prosperity") || block.typeId.includes("inferium") || block.typeId.includes("soulium")) {
            xp = randomInt(1, 3);
        }
        
        // Spawn XP orbs if we have a valid amount
        if (xp > 0) {
            try {
                console.log(`[MYSTICAL AGRICULTURE] Spawning ${xp} XP from ${block.typeId} at ${pos.x}, ${pos.y}, ${pos.z}`);
                
                // Schedule the XP spawn for the next tick to ensure it happens after the block is broken
                server.system.run(() => {
                    try {
                        // Spawn individual XP orbs
                        for (let i = 0; i < xp; i++) {
                            // Add slight randomization to position
                            const offsetX = (Math.random() - 0.5) * 0.5;
                            const offsetY = (Math.random() - 0.5) * 0.5;
                            const offsetZ = (Math.random() - 0.5) * 0.5;
                            
                            const orbPos = { 
                                x: pos.x + 0.5 + offsetX, 
                                y: pos.y + 0.5 + offsetY, 
                                z: pos.z + 0.5 + offsetZ 
                            };
                            
                            dimension.spawnEntity("minecraft:xp_orb", orbPos);
                        }
                        console.log(`[MYSTICAL AGRICULTURE] Successfully spawned ${xp} XP orbs`);
                    } catch (innerError) {
                        console.error(`[MYSTICAL AGRICULTURE] Error in delayed XP spawn: ${innerError.message}`);
                    }
                });
            } catch (error) {
                console.error(`[MYSTICAL AGRICULTURE] Error scheduling XP spawn: ${error.message}`);
            }
        }
    }
});

/**
 * Compatibility function for the component-based ore XP system.
 * The old system is now deprecated in favor of the global event handler above.
 * This is kept for backward compatibility but does nothing.
 * @param {server.PlayerBreakBlockBeforeEvent} result - The event data
 */
export function handleOreXpDrop(result) {
    // This function is kept for backward compatibility
    // The actual XP drop logic is now handled by the global event handler above
    return;
}
