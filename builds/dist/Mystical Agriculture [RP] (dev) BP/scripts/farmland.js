import * as server from "@minecraft/server"

server.world.beforeEvents.playerInteractWithBlock.subscribe(result => {

    let farmlandTypes = ["minecraft:farmland",
        "strat:inferium_farmland",
        "strat:prudentium_farmland",
        "strat:tertium_farmland",
        "strat:imperium_farmland",
        "strat:supremium_farmland"]

    let essenceFarmland = [
        { typeId: "minecraft:farmland", essence: "minecraft:air" },
        { typeId: "strat:inferium_farmland", essence: "strat:inferium_essence" },
        { typeId: "strat:prudentium_farmland", essence: "strat:prudentium_essence" },
        { typeId: "strat:tertium_farmland", essence: "strat:tertium_essence" },
        { typeId: "strat:imperium_farmland", essence: "strat:imperium_essence" },
        { typeId: "strat:supremium_farmland", essence: "strat:supremium_essence" },
    ]

    if (!result.isFirstEvent) return

    let itemStack = result.itemStack

    if (!itemStack) return

    if (!farmlandTypes.includes(result.block.typeId)) return

    server.system.run(() => {

        let returnEssence = false

        if (Math.random() * 100 < 50) returnEssence = true

        switch (itemStack.typeId) {
            case "strat:inferium_essence":
                handleEssence("strat:inferium_farmland", 1);
                break;
            case "strat:prudentium_essence":
                handleEssence("strat:prudentium_farmland", 2);
                break;
            case "strat:tertium_essence":
                handleEssence("strat:tertium_farmland", 3);
                break;
            case "strat:imperium_essence":
                handleEssence("strat:imperium_farmland", 4);
                break;
            case "strat:supremium_essence":
                handleEssence("strat:supremium_farmland", 5);
                break;
        }

        /**
        * @param {string | server.BlockType} newFarmlandType
        * @param {number} farmlandIndex
        */
        function handleEssence(newFarmlandType, farmlandIndex) {
            if (result.block.typeId == farmlandTypes[farmlandIndex]) return;
            decrementStack();
            result.block.setType(newFarmlandType);
            if (returnEssence)
                result.block.dimension.spawnItem(
                    new server.ItemStack(essenceFarmland.find(block => block.typeId == result.block.typeId).essence, 1),
                    result.block.center()
                );
        }

        function decrementStack() {
            let amount = itemStack.amount

            if (amount == 1) {
                result.player.getComponent("equippable").setEquipment(server.EquipmentSlot.Mainhand, null);
            } else {
                itemStack.amount -= 1
                result.player.getComponent("equippable").setEquipment(server.EquipmentSlot.Mainhand, itemStack);
            }
        }
    })
})

// Check if worldInitialize exists before subscribing
if (server.world.beforeEvents.worldInitialize) {
    server.world.beforeEvents.worldInitialize.subscribe(result => {
    result.blockComponentRegistry.registerCustomComponent("strat:farmland", {
        onRandomTick: result => {
            // console.warn("test")
            let state = result.block.permutation.getAllStates()
            function hasWaterNearby(block) {
                for (let dx = -4; dx <= 4; dx++) {
                    for (let dz = -4; dz <= 4; dz++) {
                        // Saltar el bloque central (0, 0) si es necesario
                        if (dx === 0 && dz === 0) continue;

                        // Obtener el bloque vecino
                        let neighborBlock = block.dimension.getBlock({
                            x: block.location.x + dx,
                            y: block.location.y,
                            z: block.location.z + dz
                        });

                        // console.warn(JSON.stringify(neighborBlock.getTags()))

                        // Verificar si el bloque vecino tiene el tag 'water' o si esta waterlogged
                        if (neighborBlock.getTags()?.includes('water') || neighborBlock?.isWaterlogged) {
                            return true;
                        }
                    }
                }
                return false;
            }

            if (!result.block.above()?.hasTag("minecraft:crop") && result.block.above().typeId != "minecraft:air") {
                result.block.setType("minecraft:dirt")
                return
            }

            if (!hasWaterNearby(result?.block)) state["wiki:wet_farmland"] = false
            else if (hasWaterNearby(result.block)) state["wiki:wet_farmland"] = true

            result.block.setPermutation(server.BlockPermutation.resolve(result.block.typeId, state))
            // if (state["wiki:wet_farmland"] == false && Math.random() < 0.8 && result.block.typeId == "farmersdelight:delight_farmland") { result.block.setType("farmersdelight:delight_dirt"); return }
        },

        // onEntityFallOn: result => {
        //     if (result.fallDistance > 1.10 && Math.random() < 0.6 && result.entity.typeId != "minecraft:item" && result.block.typeId == "farmersdelight:delight_farmland") {
        //         result.block.setType("farmersdelight:delight_dirt")
        //     }
        // }
    })
    })
}

import { seedsTier } from './seeds_tier'
//Loot of the crops
server.world.beforeEvents.playerBreakBlock.subscribe(result => {

    if (result.player.getGameMode() == server.GameMode.creative) return

    const blockID = result.block.typeId


    let farmlandTierList = [
        { typeId: "minecraft:farmland", tier: "0", output: 100 },
        { typeId: "strat:inferium_farmland", tier: "§e1", output: 100 },
        { typeId: "strat:prudentium_farmland", tier: "§a2", output: 150 },
        { typeId: "strat:tertium_farmland", tier: "§63", output: 200 },
        { typeId: "strat:imperium_farmland", tier: "§b4", output: 250 },
        { typeId: "strat:supremium_farmland", tier: "§c5", output: 300 },
    ]

    if (result.block.permutation.getState("strat:growth") == 7) {
        if (blockID.startsWith("strat:") && blockID.includes("_crop")) {
            const baseID = blockID.replace("_crop", "");
            let itemStack1 = new server.ItemStack(`${baseID}_essence`, 1)
            let itemStack2 = new server.ItemStack(`${baseID}_seeds`, 1)

            let secondaryChance = 0

            //Seeds tier
            let item = seedsTier.find(item => item.typeId == itemStack2.typeId)

            if (item) {
                let farmlandType = result.block.below(1)
                let farmlandTier = farmlandTierList.find(block => block.typeId == farmlandType.typeId).tier
                let seedTier = item.tier

                let output = farmlandTierList.find(block => block.typeId == farmlandType.typeId).output
                let baseAmount = Math.floor(output / 100)
                let remainder = output % 100

                let outputResult = baseAmount

                if (remainder > 0) {
                    let probability = remainder / 100
                    if (Math.random() < probability) {
                        outputResult++
                    }
                }

                if (result.block.typeId == "strat:inferium_crop") {
                    server.system.run(() => {
                        itemStack1.amount = outputResult
                    })
                }

                if (farmlandTier == seedTier) {
                    secondaryChance = 20
                }
                else if (farmlandTier != "0") {
                    secondaryChance = 10
                }

                if (Math.random() * 100 < secondaryChance) {
                    server.system.run(() => {
                        itemStack2.amount = 2
                    })
                }

            }

            server.system.run(() => {
                result.block.dimension.spawnItem(itemStack1, result.block.location);
                result.block.dimension.spawnItem(itemStack2, result.block.location);
            })

            if (Math.floor(Math.random() * 10) + 1 == 1) {
                let itemStack3 = new server.ItemStack(`strat:fertilized_essence`, 1)
                server.system.run(() => {
                    result.block.dimension.spawnItem(itemStack3, result.block.location);
                })
            }
        }
    } else if (result.block.permutation.getState("strat:growth") < 7) {
        if (blockID.startsWith("strat:") && blockID.includes("_crop")) {
            const baseID = blockID.replace("_crop", "");
            let itemStack = new server.ItemStack(`${baseID}_seeds`, 1)
            server.system.run(() => {
                result.block.dimension.spawnItem(itemStack, result.block.location);
            })
        }
    }

    server.system.run(() => {
        let silk_touch = result.dimension.getEntities({ location: result.block.center(), maxDistance: 2 }).filter(entity => entity.typeId == "minecraft:item")

        silk_touch.forEach(entity => {
            let itemStack = entity.getComponent("item").itemStack
            if (itemStack.typeId.startsWith("strat:") && itemStack.typeId.endsWith("_crop")) entity.kill()
        })
    })

})