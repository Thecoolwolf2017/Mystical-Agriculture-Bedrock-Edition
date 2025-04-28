import * as server from "@minecraft/server"

import { ActionFormData } from "@minecraft/server-ui"

const addonVersion = 'V1.0 Beta'

import './tools/interactions';
import './tools/durability';
import './tools/sickle';
import './tools/sickle_right_click';
import './tools/scythe';
import './tools/watering_can';
import './items_lore';
import './soul_jar';
import './experience_capsule';
import './infusion_all'
import './infusion_crystal'
import './farmland'
import './player_view'
import './stairPlacement'
import './crop_harvesting'
import './crop_right_click_harvest'
// import './kaioga5/fence/onInteract'
// import './kaioga5/fence/onTick'
// import './kaioga5/fence/onPlayerDestroy'
// import './kaioga5/fence/onPlayerPlaced'
import "./guide_book"

import { wall_Manager } from 'AlienEdds/walls/wall_Manager'

server.world.afterEvents.playerBreakBlock.subscribe((data) => {
    wall_Manager.updateWallsAround(data.block)
})

server.world.afterEvents.playerPlaceBlock.subscribe((data) => {
    wall_Manager.updateWallsAround(data.block)
})

import { sendNotification } from './manager'

import './kaioga5/slab/onInteract'
import './kaioga5/slab/onPlayerDestroy'

server.system.runTimeout(() => {
    server.system.runInterval(() => {
        for (let player of server.world.getAllPlayers()) {
            if (player.hasTag("mysticalagriculture")) return

            for (const player of server.world.getPlayers()) {
                const currentX = player.location.x.toFixed(1);
                const currentY = player.location.y.toFixed(1);
                const currentZ = player.location.z.toFixed(1);

                const oldX = player.getDynamicProperty('oldX');
                const oldY = player.getDynamicProperty('oldY');
                const oldZ = player.getDynamicProperty('oldZ');

                const locationChanged = currentX !== oldX || currentY !== oldY || currentZ !== oldZ;

                if (locationChanged) {
                    player.setDynamicProperty('oldX', currentX);
                    player.setDynamicProperty('oldY', currentY);
                    player.setDynamicProperty('oldZ', currentZ);

                    player.addTag("mysticalagriculture")
                    firstJoin(player)
                }
            }
        }
    }, 2);
}, 100)

/**
* @param {server.Player} player
*/
function firstJoin(player) {

    player.getComponent("inventory").container.addItem(new server.ItemStack("strat:guide_book", 1))

    sendNotification(player, `§dMystical §5Agriculture§r: Thank you for downloading \nMystical Agriculture Bedrock, \nI hope you enjoy the addon.`, "textures/ui/mystical_icon")
    server.system.runTimeout(() => {
        sendNotification(player, `§dMystical §5Agriculture§r: Original mod created \nby §2BlakeBr0§r, port for Minecraft Bedrock \ncreated by §6Pupy200mine§r.`, "textures/ui/mystical_icon")
    }, 130)
    server.system.runTimeout(() => {
        player.sendMessage(`§e§k§5Pupy200minePupy200minePupy200mine`)
        player.sendMessage(`§dMystical §5Agriculture§r: §cOnly download this addon from §aMCPEDL§c or §6CurseForge§c to ensure it's safe and updated!`)
        player.sendMessage(`§eAdd-on Version: §a${addonVersion}`)
        player.sendMessage(`§eEnjoy the Add-on!`)
        player.sendMessage(`§e- Pupy200mine`)
        player.sendMessage(`§e§k§5Pupy200minePupy200minePupy200mine`)
    }, 260)
}

// Import the components registration module
import './components/blockComponents';
// Import the direct component registration script
import './register_components';

// Import the ore utilities
import './utils/oreUtils';

/**
@param {number} min The minimum integer
@param {number} max The maximum integer
@returns {number} A random integer between the min and max parameters (inclusive)
*/
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

server.world.beforeEvents.playerPlaceBlock.subscribe(result => {

    if (result.permutationBeingPlaced.type.id.startsWith("strat:witherproof")) {
        server.system.run(() => {
            result.player.onScreenDisplay.setActionBar("§cDOES NOT WORK WELL, DO NOT USE")
        })
        // result.cancel = true
    }
})

//Mystical Fertilizer
// Add safety check for the itemUseOn event to prevent TypeError
if (server.world.beforeEvents.itemUseOn) {
    server.world.beforeEvents.itemUseOn.subscribe(result => {

    if (result.itemStack.typeId != "strat:mystical_fertilizer") return

    if (!result.isFirstEvent) return

    let state = result.block.permutation.getAllStates()

    // Handle custom crops with strat:growth_stage property
    if ("strat:growth_stage" in state) {
        state["strat:growth_stage"] = 7
        server.system.run(() => {
            result.block.dimension.spawnParticle("minecraft:crop_growth_emitter", result.block.center())
            result.source.playSound("item.bone_meal.use", result.block.center())
            result.block.setPermutation(server.BlockPermutation.resolve(result.block.typeId, state))
        })
    }
    // Handle vanilla crops with age property
    else if ("age" in state) {
        // Get the maximum age value for the crop type
        let maxAge = 7; // Default for most crops
        if (result.block.typeId === "minecraft:beetroot") maxAge = 3;
        if (result.block.typeId === "minecraft:sweet_berry_bush") maxAge = 3;
        
        state["age"] = maxAge;
        server.system.run(() => {
            result.block.dimension.spawnParticle("minecraft:crop_growth_emitter", result.block.center())
            result.source.playSound("item.bone_meal.use", result.block.center())
            result.block.setPermutation(server.BlockPermutation.resolve(result.block.typeId, state))
        })
    }
    // Also check for the old namespace property (for backward compatibility)
    else if ("strat:growth" in state) {
        state["strat:growth"] = 7
        server.system.run(() => {
            result.block.dimension.spawnParticle("minecraft:crop_growth_emitter", result.block.center())
            result.source.playSound("item.bone_meal.use", result.block.center())
            result.block.setPermutation(server.BlockPermutation.resolve(result.block.typeId, state))
        })
    }
})

// server.system.runInterval(() => {
//     for (let player of server.world.getAllPlayers()) {
//         let block = player.getBlockFromViewDirection({ maxDistance: 8 })?.block
//         if (!block) return
//         let message = JSON.stringify(block.permutation.getAllStates()).replaceAll(",", "\n")
//         player.onScreenDisplay.setActionBar(message)
//     }
// })

// Register all custom components during world initialization
server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    // Import the block components from the components file
    import('./components/blockComponents.js')
        .then(module => {
            // Log successful component registration
            console.log("Registered all custom block components successfully");
        })
        .catch(error => {
            console.error("Failed to register custom components:", error);
        });
});
}