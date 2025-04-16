import * as server from "@minecraft/server"
import { seedsTier } from './seeds_tier'

server.system.runInterval(() => {
    for (let player of server.world.getAllPlayers()) {
        let inventory = player.getComponent("inventory").container

        for (let i = 0; i < inventory.size; i++) {
            const validSuffixes = new Set([
                "_sword", "_pickaxe", "_shovel", "_axe", "_hoe",
                "_bow", "_crossbow", "_shears", "_fishing_rod",
                "_sickle", "_scythe", "_helmet", "_chestplate",
                "_leggings", "_boots"
            ]);

            let itemStack = inventory.getItem(i)

            if (!itemStack) continue
            let lore = itemStack.getLore()
            let tags = itemStack.getTags()

            let prefix = {
                "inferium": "§e",
                "prudentium": "§a",
                "tertium": "§b",
                "imperium": "§6",
                "supremium": "§c"
            };

            //Seeds tier
            //Maybe in the lang file...
            //nvm, fixed
            let item = seedsTier.find(item => item.typeId == itemStack.typeId)
            if (item && lore.length == 0) {
                itemStack.setLore([
                    `§7Tier: ${item.tier}`
                ]);
                inventory.setItem(i, itemStack);
            }

            //Fertilized Essence
            if (itemStack.typeId == "mysticalagriculture:fertilized_essence" && lore.length == 0) {
                itemStack.setLore([
                    `§710% Drop Chance`
                ]);
                inventory.setItem(i, itemStack);
            }

            //Mystical Fertilizer
            if (itemStack.typeId == "mysticalagriculture:mystical_fertilizer" && lore.length == 0) {
                itemStack.setLore([
                    `§7Instantly grow mystical crops`
                ]);
                inventory.setItem(i, itemStack);
            }

            // Watering Can
            if (itemStack.typeId.startsWith("mysticalagriculture:") && itemStack.typeId.endsWith("_can") && lore.length == 0) {
                let type = Object.keys(prefix).find(key => itemStack.typeId.includes(key));

                let itemPrefix = prefix[type] || "§7";

                let wateringCanArea = tags.find(tag => tag.startsWith("area")).split(":").pop();

                itemStack.setLore([
                    `§7Empty`,
                    `§7Area: ${itemPrefix}${wateringCanArea}x${itemPrefix}${wateringCanArea}`
                ]);

                inventory.setItem(i, itemStack);
            }


            //Infusion Crystal
            if (itemStack.typeId == "mysticalagriculture:infusion_crystal" && lore.length == 0) {
                itemStack.setLore([
                    `§71000 Uses Left`
                ]);

                inventory.setItem(i, itemStack);
            }
            //Infusion Cristal Offhand
            if (player.getComponent("equippable").getEquipment(server.EquipmentSlot.Offhand)?.typeId == "mysticalagriculture:infusion_crystal" &&
                player.getComponent("equippable").getEquipment(server.EquipmentSlot.Offhand)?.getLore().length == 0) {
                let item = player.getComponent("equippable").getEquipment(server.EquipmentSlot.Offhand)
                item.setLore([
                    `§71000 Uses Left`
                ]);

                player.getComponent("equippable").setEquipment(server.EquipmentSlot.Offhand, item)
            }
            //Master Crystal
            if (itemStack.typeId == "mysticalagriculture:master_infusion_crystal" && lore.length == 0) {
                itemStack.setLore([
                    `§7Unlimited Uses`
                ]);

                inventory.setItem(i, itemStack);
            }
            //Master Infusion Crystal Offhand
            if (player.getComponent("equippable").getEquipment(server.EquipmentSlot.Offhand)?.typeId == "mysticalagriculture:master_infusion_crystal" &&
                player.getComponent("equippable").getEquipment(server.EquipmentSlot.Offhand)?.getLore().length == 0) {
                let item = player.getComponent("equippable").getEquipment(server.EquipmentSlot.Offhand)
                item.setLore([
                    `§7Unlimited Uses`
                ]);

                player.getComponent("equippable").setEquipment(server.EquipmentSlot.Offhand, item)
            }

            //Soul Jar
            if (itemStack.typeId.startsWith("mysticalagriculture:") && itemStack.typeId.endsWith("_jar") && itemStack.typeId != "mysticalagriculture:soul_jar" && lore.length == 0) {

                let mobName = itemStack.typeId
                    .split(":")[1]
                    .replace("_soul_jar", "")
                    .split("_")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                let tags = itemStack.getTags()
                const maxSoul = parseInt(tags.find(tag => tag.startsWith("maxSoul")).split(":").pop()).toFixed(2);;
                itemStack.setLore([`§7${mobName} (0.00/${maxSoul})`])

                inventory.setItem(i, itemStack)

            }

            //Soul Jar Full
            if (itemStack.typeId.startsWith("mysticalagriculture:") && itemStack.typeId.endsWith("_jar_full") && itemStack.typeId != "mysticalagriculture:soul_jar" && lore.length == 0) {

                let mobName = itemStack.typeId.replaceAll("_full", "")
                    .split(":")[1]
                    .replace("_soul_jar", "")
                    .split("_")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                let tags = itemStack.getTags()
                const maxSoul = parseInt(tags.find(tag => tag.startsWith("maxSoul")).split(":").pop()).toFixed(2);;
                itemStack.setLore([`§7${mobName} (${maxSoul}/${maxSoul})`])

                inventory.setItem(i, itemStack)

            }

            //Dagger
            if (itemStack.typeId.startsWith("mysticalagriculture:") && itemStack.typeId.endsWith("_dagger") && lore.length == 0) {

                if (itemStack.typeId == "mysticalagriculture:passive_soulium_dagger") itemStack.setLore([`§aPassive Attuned`, "§7Grants additional souls from peaceful creatures"])
                if (itemStack.typeId == "mysticalagriculture:hostile_soulium_dagger") itemStack.setLore([`§cHostile Attuned`, "§7Grants additional souls from hostile creatures"])
                if (itemStack.typeId == "mysticalagriculture:creative_soulium_dagger") itemStack.setLore([`§dCreative Attuned`, "§7Grants *infinite* souls from all creatures"])


                inventory.setItem(i, itemStack)

            }

            //Experience Capsule
            if (itemStack.typeId == ("mysticalagriculture:experience_capsule") && lore.length == 0) {

                itemStack.setLore([`§70 / 1200 Experience Points`, "§cThe item is not 100% perfect, bugs may occur"])

                inventory.setItem(i, itemStack)

            }
            //Experience Capsule Full
            if (itemStack.typeId == ("mysticalagriculture:experience_capsule_full") && lore.length == 0) {

                itemStack.setLore([`§71200 / 1200 Experience Points`, "§cThe item is not 100% perfect, bugs may occur"])

                inventory.setItem(i, itemStack)

            }

            //Upgrade
            if (itemStack.typeId.startsWith("mysticalagriculture:") && itemStack.typeId.endsWith("_upgrade") && lore.length == 0) {

                let type = Object.keys(prefix).find(key => itemStack.typeId.includes(key));

                let itemPrefix = prefix[type] || "§7";

                let tags = itemStack.getTags()
                const operationSpeed = parseFloat(tags.find(tag => tag.startsWith("operationSpeed")).split(":").pop());
                const fuelUsage = parseInt(tags.find(tag => tag.startsWith("fuelUsage")).split(":").pop());
                const fuelCapacity = parseInt(tags.find(tag => tag.startsWith("fuelCapacity")).split(":").pop());
                const area = parseInt(tags.find(tag => tag.startsWith("area")).split(":").pop());

                itemStack.setLore([
                    `§7Operation Speed: ${itemPrefix}${operationSpeed}§7x`,
                    `§7Fuel Usage: ${itemPrefix}${fuelUsage}§7x`,
                    `§7Fuel Capacity: ${itemPrefix}${fuelCapacity}§7x`,
                    `§7Area: +${itemPrefix}${area}`])

                inventory.setItem(i, itemStack)

            }

            handleTier(itemStack, "inferium", 1, inventory, i);
            handleTier(itemStack, "prudentium", 2, inventory, i);
            handleTier(itemStack, "tertium", 3, inventory, i);
            handleTier(itemStack, "imperium", 4, inventory, i);
            handleTier(itemStack, "supremium", 5, inventory, i);


            // if (itemStack.typeId.startsWith("mysticalagriculture:") && lore[lore.length - 1] != "§9Mystical Agriculture (Unofficial Port)") {

            //     let newLore = itemStack.getLore()

            //     newLore.push("§9Mystical Agriculture (Unofficial Port)")

            //     itemStack.setLore(newLore)
            //     inventory.setItem(i, itemStack)
            // }

            /**
             * @param {server.ItemStack} itemStack
             * @param {string} tierName
             * @param {number} tierLevel
             * @param {server.Container} inventory
             * @param {number} index
             */
            function handleTier(itemStack, tierName, tierLevel, inventory, index) {
                if (
                    itemStack.typeId.startsWith(`mysticalagriculture:${tierName}`) &&
                    Array.from(validSuffixes).some(suffix => itemStack.typeId.endsWith(suffix)) &&
                    lore.length === 0
                ) {
                    let tags = itemStack.getTags();

                    let itemPrefix = prefix[tierName] || "§7";

                    let lore = [
                        `§7Tier: ${itemPrefix}${tierLevel}`,
                        `§7Augments:`,
                        `§7 - Empty`
                    ];

                    // Sickle && Scythe
                    if (itemStack.typeId.endsWith("_sickle") || itemStack.typeId.endsWith("_scythe")) {
                        let sickleArea = tags.find(tag => tag.startsWith("area")).split(":").pop();
                        lore.unshift(`§7Area: ${itemPrefix}${sickleArea}x${itemPrefix}${sickleArea}`);
                    }

                    // Bow
                    if (itemStack.typeId.endsWith("_bow")) {
                        lore.unshift(`§cDoes not work with arrows with effects`);
                    }

                    itemStack.setLore(lore);
                    inventory.setItem(index, itemStack);
                }
            }
        }

    }
}, 10)

server.world.afterEvents.entitySpawn.subscribe(result => {

    if (!result.entity.isValid) return

    // if (result.entity.typeId != "minecraft:item") return
    let itemStack = result.entity.getComponent("minecraft:item")?.itemStack

    if (!itemStack) return

    let lore = itemStack.getLore()

    // if (itemStack.typeId.startsWith("mysticalagriculture:") && lore[lore.length - 1] != "§9Mystical Agriculture (Unofficial Port)") {
    //     lore.push("§9Mystical Agriculture (Unofficial Port)")
    //     try {
    //         itemStack.setLore(lore);
    //         result.entity.dimension.spawnItem(itemStack, result.entity.location)
    //         result.entity.runCommand("kill @s")
    //     } catch { }
    // }

    let item = seedsTier.find(item => item.typeId == itemStack.typeId)
    if (item && lore.length == 0 && itemStack.typeId.startsWith("mysticalagriculture:") && itemStack.typeId.endsWith("_seeds")) {
        try {
            itemStack.setLore([
                `§7Tier: ${item.tier}`
            ]);
            result.entity.dimension.spawnItem(itemStack, result.entity.location)
            result.entity.runCommand("kill @s")
        } catch { }
    }
})