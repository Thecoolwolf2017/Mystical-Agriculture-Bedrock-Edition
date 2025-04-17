import * as server from "@minecraft/server";

/**
 * Handles XP drop logic for ore blocks
 * @param {server.PlayerBreakBlockBeforeEvent} result - The event data
 */
export function handleOreXpDrop(result) {
    const { block, player, dimension } = result;
    
    // Get the block's permutation
    const permutation = block.permutation;
    
    // Check if the block has the "ore" tag
    if (block.hasTag("ore")) {
        // Get the block's position
        const pos = block.location;
        
        // Determine the amount of XP to drop based on the block type
        let xp = 0;
        
        if (block.typeId.includes("diamond")) {
            xp = server.randomInt(3, 7);
        } else if (block.typeId.includes("emerald")) {
            xp = server.randomInt(3, 7);
        } else if (block.typeId.includes("lapis")) {
            xp = server.randomInt(2, 5);
        } else if (block.typeId.includes("redstone")) {
            xp = server.randomInt(1, 5);
        } else if (block.typeId.includes("gold") || block.typeId.includes("quartz")) {
            xp = server.randomInt(0, 2);
        } else if (block.typeId.includes("iron") || block.typeId.includes("copper")) {
            xp = server.randomInt(0, 1);
        } else if (block.typeId.includes("coal")) {
            xp = server.randomInt(0, 2);
        } else if (block.typeId.includes("prosperity") || block.typeId.includes("inferium") || block.typeId.includes("soulium")) {
            xp = server.randomInt(1, 3);
        }
        
        // If XP should be dropped, create an XP orb
        if (xp > 0) {
            dimension.spawnEntity("minecraft:xp_orb", { x: pos.x + 0.5, y: pos.y + 0.5, z: pos.z + 0.5 });
        }
    }
}
