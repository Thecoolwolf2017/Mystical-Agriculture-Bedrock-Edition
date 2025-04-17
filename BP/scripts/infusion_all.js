import * as server from "@minecraft/server"
import { recipes } from './infusion_recipes'

let allPedestals = false
/** @type {server.Entity[]} */
let entities = []

server.world.beforeEvents.playerPlaceBlock.subscribe(result => {
    if (result.permutationBeingPlaced.type.id == "strat:infusion_altar_player") {
        server.system.run(() => {
            result.block.setType("strat:infusion_altar")
            result.block.above(1).setType("strat:infusion_altar_check")
        })
    }
})

let converting = false
server.world.beforeEvents.playerBreakBlock.subscribe(result => {
    if (converting) return

    let i = 0
    if (result.block.typeId == "strat:infusion_altar") {
        server.system.run(() => {
            if (result.player.getGameMode() != server.GameMode.creative && i == 0) {
                i++
                result.block.dimension.spawnItem(new server.ItemStack("strat:infusion_altar_player"), result.block.center())
            }
            result.block.setType("minecraft:air")
            result.block.above(1).setType("minecraft:air")
        })
    }
})

server.world.afterEvents.playerPlaceBlock.subscribe(result => {
    if (result.block.typeId != "strat:infusion_altar") return

    result.block.dimension.spawnEntity("strat:infusion_altar_entity", { x: result.block.center().x, y: result.block.center().y + 0.49, z: result.block.center().z })
})

server.world.beforeEvents.playerInteractWithBlock.subscribe(result => {
    if (converting) return

    if (!result.isFirstEvent) return

    if (result.block.typeId != "strat:infusion_altar") return

    if (!result.itemStack) return

    if (result.itemStack.typeId != "strat:wand") return

    if (!allPedestals) return

    result.cancel = true

    converting = true

    let altarEntity = result.block.dimension.getEntitiesAtBlockLocation({ x: result.block.center().x, y: result.block.center().y + 0.49, z: result.block.center().z }).filter(entity => entity.typeId == "strat:infusion_altar_entity")[0]
    server.system.run(() => {

        let items = []

        for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];

            const location = entity.location
            const dimension = entity.dimension
            entity.triggerEvent("strat:respawn")
            server.system.runTimeout(() => {
                let item = dimension.getEntitiesAtBlockLocation(location).filter(entity => entity.typeId == "minecraft:item")[0]
                let itemStack = item?.getComponent("minecraft:item")?.itemStack
                if (itemStack) {
                    items.push(itemStack.typeId)
                    dimension.getEntitiesAtBlockLocation(location).filter(entity => entity.typeId == "strat:infusion_pedestal_entity" || entity.typeId == "strat:infusion_altar_entity")[0].runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${itemStack.typeId}`)
                }
                if (item) item.kill()
            }, 2)
        }

        server.system.runTimeout(() => {
            // console.warn(JSON.stringify(items))

            const matchingRecipe = findMatchingRecipe(items, recipes);

            if (matchingRecipe) {
                // converting = true;

                console.warn(`§dMystical §5Agriculture§r - Creating §a${matchingRecipe}`);

                if (matchingRecipe == "strat:pig_seeds") result.block.dimension.spawnParticle("strat:infusion_altar_techno", result.block.center());
                else result.block.dimension.spawnParticle("strat:infusion_altar", result.block.center());

                server.system.runTimeout(() => {
                    try {
                        result.block?.dimension?.spawnParticle("minecraft:crop_growth_emitter", {
                            x: result.block.center().x,
                            y: result.block.center().y + 0.75,
                            z: result.block.center().z
                        });

                        result.block?.dimension?.playSound("mob.zombie.unfect", {
                            x: result.block.center().x,
                            y: result.block.center().y + 0.75,
                            z: result.block.center().z
                        })

                        altarEntity = result.block?.dimension?.getEntitiesAtBlockLocation({
                            x: result.block.center().x,
                            y: result.block.center().y + 0.49,
                            z: result.block.center().z
                        }).filter(entity => entity.typeId == "strat:infusion_altar_entity")[0];

                        altarEntity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${matchingRecipe}`);
                        // altarEntity.triggerEvent("strat:respawn")

                        for (let j = 0; j < entities.length; j++) {
                            let entity = entities[j];
                            if (entity.typeId != "strat:infusion_altar_entity") {
                                entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 air`)
                                entity.dimension.spawnParticle("strat:infusion_altar_end", { x: entity.location.x, y: entity.location.y + 0.3, z: entity.location.z });
                            }
                        }

                        console.warn(`§dMystical §5Agriculture§r - §aSuccessfully created ${matchingRecipe}`)
                        converting = false;
                    } catch {
                        console.warn("§dMystical §5Agriculture§r - §cSomething went wrong... did you move too far away from the altar?")
                        result.player.onScreenDisplay.setActionBar("§dMystical §5Agriculture§r - §cSomething went wrong... did you move too far away from the altar?")
                        converting = false;
                    }
                }, 100);
            }
            else {
                server.system.runTimeout(() => {
                    converting = false;
                }, 20)
            }
        }, 4)















        function doesRecipeMatch(items, recipeItems) {
            if (items[0] !== recipeItems[0]) return false; // El primer ítem debe coincidir exactamente

            const remainingItems = items.slice(1); // Excluir el primer ítem
            const remainingRecipeItems = recipeItems.slice(1); // Excluir el primer ítem de la receta

            for (let i = 0; i < remainingRecipeItems.length; i++) {
                const recipeItem = remainingRecipeItems[i];
                if (recipeItem === "minecraft:logs") {
                    // Verificar si el item tiene el tag "minecraft:logs"
                    const matchingItem = remainingItems.find(item => {
                        const itemStack = new server.ItemStack(item, 1);
                        return itemStack.hasTag("minecraft:logs");
                    });
                    if (!matchingItem) return false;
                    remainingItems.splice(remainingItems.indexOf(matchingItem), 1); // Eliminar el item que coincide
                } else {
                    // Verificar si el item es exactamente igual
                    if (!remainingItems.includes(recipeItem)) return false;
                    remainingItems.splice(remainingItems.indexOf(recipeItem), 1); // Eliminar el item que coincide
                }
            }

            return true;
        }

        // Buscar coincidencias en las recetas
        function findMatchingRecipe(items, recipes) {
            let recipeItems
            for (const recipeKey in recipes) {
                console.warn(`§dMystical §5Agriculture§r - §6Checking Recipe ${recipeKey}`)
                recipeItems = recipes[recipeKey];
                if (doesRecipeMatch(items, recipeItems)) {
                    console.warn(`§dMystical §5Agriculture§r - Recipe found: §a${recipeKey}`)
                    return recipeKey; // Devuelve el ID de la receta que coincide
                }
            }
            console.warn(`§dMystical §5Agriculture§r - §a§cNo matching recipe was found for the items:\n§r§e${JSON.stringify(items).replaceAll(",", "\n- ").replaceAll("[", "- ").replaceAll("]", "").replaceAll(`"`, "")}`)
            return null; // No se encontró una coincidencia
        }
    })
})

server.world.beforeEvents.playerPlaceBlock.subscribe(result => {
    if (result.permutationBeingPlaced.type.id == "strat:infusion_altar") result.cancel = true
})

// Consolidated event handlers to prevent subscription errors
server.world.beforeEvents.playerInteractWithEntity.subscribe(result => {
    if (converting && result.target.typeId.startsWith("strat:")) result.cancel = true
})

// Handle block interactions during conversion
server.world.beforeEvents.playerBreakBlock.subscribe(result => {
    if (converting && result.block.typeId.startsWith("strat:")) result.cancel = true
})

import { sendNotification } from './manager'

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("strat:altar_check", {
        onTick: (result) => {

            let blockBelow = result.block.below(1)
            let blocks = [
                result.block,
                blockBelow.north(3),
                blockBelow.north(2).east(2),
                blockBelow.east(3),
                blockBelow.south(2).east(2),
                blockBelow.south(3),
                blockBelow.south(2).west(2),
                blockBelow.west(3),
                blockBelow.north(2).west(2),
            ]

            allPedestals = blocks.slice(1).every(block => block?.typeId === "strat:infusion_pedestal");

            let state = result.block.permutation.getAllStates()
            if (allPedestals) {

                for (let player of result.block.dimension.getPlayers({ maxDistance: 12, location: result.block.center() })) {
                    if (player.hasTag("strat:altar")) continue

                    sendNotification(player, `The altar is a key mechanic in\n§dMystical §5Agriculture§r; allowing you to\ncreate various seeds, most of which require\nessence from different tiers.`, "textures/ui/mystical_icon")

                    player.addTag("strat:altar")
                }

                if (state["strat:is_active"] == false) {
                    result.block.dimension.playSound("note.bell", result.block.center())
                    result.block.dimension.spawnParticle("minecraft:totem_particle", result.block.center())
                }

                state["strat:is_active"] = true
                result.block.setPermutation(server.BlockPermutation.resolve(result.block.typeId, state))
            }
            else {

                if (state["strat:is_active"] == true) {
                    result.block.dimension.playSound("note.bass", result.block.center())
                    result.block.dimension.spawnParticle("minecraft:villager_angry", result.block.center())
                }

                state["strat:is_active"] = false
                result.block.setPermutation(server.BlockPermutation.resolve(result.block.typeId, state))
            }

            //Eliminar

            entities = []
            blocks.forEach(block => {
                entities.push(block?.dimension.getEntitiesAtBlockLocation({ x: block.center().x, y: block.center().y + 0.49, z: block.center().z }).filter(entity => entity.typeId == "strat:infusion_pedestal_entity" || entity.typeId == "strat:infusion_altar_entity")[0])
            });
        }
    }),
        initEvent.blockComponentRegistry.registerCustomComponent("strat:pedestal_place", {
            onPlace: result => {
                result.block.dimension.spawnEntity("strat:infusion_pedestal_entity", { x: result.block.center().x, y: result.block.center().y + 0.49, z: result.block.center().z })
            }
        })
})