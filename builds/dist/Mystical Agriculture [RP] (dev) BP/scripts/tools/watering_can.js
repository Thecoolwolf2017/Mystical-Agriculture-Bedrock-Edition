import * as server from "@minecraft/server"

// let allItems = server.ItemTypes.getAll();

// const canIds = [];

// allItems.forEach(item => {
//     if (item.id.startsWith('strat:')) {
//         if (item.id.endsWith('_scythe')) {
//             canIds.push(item.id);
//         }
//     }
// });

server.world.beforeEvents.playerInteractWithBlock.subscribe(event => {
    // Get the player from the event source
    const player = event.source;
    // Get the item stack being used
    const itemStack = event.itemStack;
    // Get the block being interacted with
    const block = event.block;

    if (!itemStack) return

    if (!block) return

    let targetBlock = player.getBlockFromViewDirection({ includeLiquidBlocks: true }).block

    if (targetBlock.typeId == "minecraft:water" && (itemStack.typeId.startsWith("strat:") && itemStack.typeId.endsWith("_can"))) {
        server.system.run(() => {
            let lore = itemStack.getLore();

            lore = lore.filter(line => line !== "§7Empty");

            if (!lore.includes("§7Filled")) {
                lore.unshift("§7Filled");
                player.playSound("bucket.fill_water")
            }

            itemStack.setLore(lore);
            player.getComponent("equippable").setEquipment(server.EquipmentSlot.Mainhand, itemStack);
        })
    }
})

server.world.afterEvents.itemUse.subscribe(result => {
    if (!result.itemStack) return

    if (result.itemStack.typeId.startsWith("strat:") && result.itemStack.typeId.endsWith("_can")) {

        if (!result.itemStack.getLore().includes("§7Filled")) {
            result.source.onScreenDisplay.setActionBar("§cFill the watering can with water first")
            return
        }

        let block = result.source.getBlockFromViewDirection({ maxDistance: 10 })?.block;
        if (!block) return
        let blockLocation = block.location;

        let tags = result.itemStack.getTags()

        const area = Math.floor((parseInt(tags.find(tag => tag.startsWith("area")).split(":").pop()) / 2));

        for (let dx = -area; dx <= area; dx++) {
            for (let dy = 0; dy <= 1; dy++) {
                for (let dz = -area; dz <= area; dz++) {

                    let x = blockLocation.x + dx;
                    let y = blockLocation.y + dy;
                    let z = blockLocation.z + dz;

                    let targetBlock = block.dimension.getBlock({ x, y, z });

                    targetBlock.dimension.spawnParticle("strat:watering_can", {
                        x: x,
                        y: y,
                        z: z
                    })

                    if (targetBlock && (targetBlock.permutation.getState("strat:growth") == 0 || targetBlock.permutation.getState("strat:growth"))) {

                        let state = targetBlock.permutation.getAllStates();

                        if (Math.floor(Math.random() * 32) + 1 == 1) {
                            if (state["strat:growth"] != 7) targetBlock.dimension.spawnParticle("minecraft:crop_growth_emitter", targetBlock.center())
                            state["strat:growth"] = Math.min(state["strat:growth"] + 1, 7);
                            targetBlock.setPermutation(server.BlockPermutation.resolve(targetBlock.typeId, state));
                        }
                    }
                }
            }
        }
    }
})