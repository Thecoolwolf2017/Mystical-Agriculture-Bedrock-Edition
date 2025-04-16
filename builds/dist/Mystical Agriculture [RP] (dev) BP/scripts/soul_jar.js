import * as server from "@minecraft/server"

server.world.afterEvents.entityDie.subscribe(result => {

    if (!result.deadEntity.isValid) return

    const passiveMobs = ["minecraft:pig", "minecraft:chicken", "minecraft:cow", "minecraft:sheep", "minecraft:squid", "minecraft:fish",
        "minecraft:turtle", "minecraft:rabbit"]
    const hostileMobs = ["minecraft:slime", "minecraft:zombie", "minecraft:skeleton", "minecraft:creeper", "minecraft:spider", "minecraft:blaze",
        "minecraft:ghast", "minecraft:enderman", "minecraft:wither_skeleton"]

    let item = result.damageSource.damagingEntity?.getComponent("equippable")?.getEquipment(server.EquipmentSlot.Mainhand)

    if (!item) return

    if (result.damageSource.cause == server.EntityDamageCause.entityAttack && item.hasTag("mysticalagriculture:dagger")) {
        let inventory = result.damageSource.damagingEntity.getComponent("inventory").container
        let jar_slot = null

        for (let i = 0; i < inventory.size; i++) {
            let item = inventory.getItem(i)

            if (!item) continue

            if (item.typeId == "mysticalagriculture:soul_jar") {
                jar_slot = i
                break
            }
        }

        let has_jar = false

        let fish = ["minecraft:cod", "minecraft:pufferfish", "minecraft:tropicalfish", "minecraft:salmon"]
        let fullID = result.deadEntity.typeId

        if (fish.includes(result.deadEntity.typeId)) fullID = "minecraft:fish"

        let animalID = fullID.split(":").pop().toLowerCase();
        let capitalizedAnimalID = animalID.split("_")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

        for (let i = 0; i < inventory.size; i++) {
            let item = inventory.getItem(i);

            if (!item) continue;

            if (item.typeId == `mysticalagriculture:${animalID}_soul_jar`) {
                let lore = item.getLore();

                // Verifica que el lore contenga el formato esperado
                if (lore.length > 0 && /§7.*\((\d+\.\d+)\/(\d+\.\d+)\)/.test(lore[0])) {
                    let match = lore[0].match(/\((\d+\.\d+)\/(\d+\.\d+)\)/);

                    if (match) {
                        let current = parseFloat(match[1]);
                        let max = parseFloat(match[2]);

                        // Comprueba si el valor actual no está al máximo
                        if (current < max) {
                            jar_slot = i;
                            has_jar = true;
                            break;
                        }
                        else {
                            result.damageSource.damagingEntity.onScreenDisplay.setActionBar(`§cThe ${capitalizedAnimalID} Soul Jar is full`)
                        }
                    }
                }
            }
        }

        if (!has_jar) {
            if (!server.ItemTypes.get(`mysticalagriculture:${animalID}_soul_jar`)) return
            let itemStack = new server.ItemStack(`mysticalagriculture:${animalID}_soul_jar`, 1)
            let tags = itemStack.getTags()
            const maxSoul = parseInt(tags.find(tag => tag.startsWith("maxSoul")).split(":").pop()).toFixed(2);;
            let hasPassiveDagger = result.damageSource.damagingEntity.getComponent("equippable").getEquipment(server.EquipmentSlot.Mainhand).typeId == "mysticalagriculture:passive_soulium_dagger"
            let hasHostileDagger = result.damageSource.damagingEntity.getComponent("equippable").getEquipment(server.EquipmentSlot.Mainhand).typeId == "mysticalagriculture:hostile_soulium_dagger"
            let hasCreativeDagger = result.damageSource.damagingEntity.getComponent("equippable").getEquipment(server.EquipmentSlot.Mainhand).typeId == "mysticalagriculture:creative_soulium_dagger"
            if (hasPassiveDagger && passiveMobs.includes(result.deadEntity.typeId)) {
                itemStack.setLore([`§7${capitalizedAnimalID} (1.50/${maxSoul})`])
            }
            else if (hasHostileDagger && hostileMobs.includes(result.deadEntity.typeId)) {
                itemStack.setLore([`§7${capitalizedAnimalID} (1.50/${maxSoul})`])
            }
            else if (hasCreativeDagger) {
                inventory.setItem(jar_slot, new server.ItemStack(`mysticalagriculture:${animalID}_soul_jar_full`, 1))
                return
                // itemStack.setLore([`§7${capitalizedAnimalID} (${maxSoul}/${maxSoul})`])
            }
            else {
                itemStack.setLore([`§7${capitalizedAnimalID} (1.00/${maxSoul})`])
            }

            if (jar_slot != null) {
                inventory.setItem(jar_slot, itemStack)
            }
        }
        else {
            let itemStack = inventory.getItem(jar_slot);
            let lore = itemStack.getLore();

            // Verifica que el lore no esté vacío y tenga el formato esperado
            if (lore.length > 0 && /§7.*\((\d+\.\d+)\/(\d+\.\d+)\)/.test(lore[0])) {
                let hasPassiveDagger = result.damageSource.damagingEntity.getComponent("equippable").getEquipment(server.EquipmentSlot.Mainhand).typeId == "mysticalagriculture:passive_soulium_dagger"
                let hasHostileDagger = result.damageSource.damagingEntity.getComponent("equippable").getEquipment(server.EquipmentSlot.Mainhand).typeId == "mysticalagriculture:hostile_soulium_dagger"
                let hasCreativeDagger = result.damageSource.damagingEntity.getComponent("equippable").getEquipment(server.EquipmentSlot.Mainhand).typeId == "mysticalagriculture:creative_soulium_dagger"
                let currentLore = lore[0];
                let soul_value = 0

                if (passiveMobs.includes(result.deadEntity.typeId) && hasPassiveDagger) {
                    soul_value = 1.5;
                } else if (hostileMobs.includes(result.deadEntity.typeId) && hasHostileDagger) {
                    soul_value = 1.5;
                } else if (hasCreativeDagger) {
                    soul_value = 99
                } else {
                    soul_value = 1;
                }

                // identificar y modificar el valor inicial
                let updatedLore = currentLore.replace(/(§7.*)\((\d+\.\d+)\/(\d+\.\d+)\)/, (match, prefix, current, max) => {
                    let newValue = Math.min(parseFloat(current) + soul_value, parseFloat(max)).toFixed(2); // Incrementa sin superar el máximo


                    if (newValue == max) {
                        return "full"
                    }

                    return `${prefix}(${newValue}/${max})`;
                });

                if (updatedLore == "full") {
                    inventory.setItem(jar_slot, new server.ItemStack(`mysticalagriculture:${animalID}_soul_jar_full`, 1))
                    return
                }



                // Actualiza el lore con el nuevo valor
                lore[0] = updatedLore;
                itemStack.setLore(lore);

                // Devuelve el ítem al inventario
                inventory.setItem(jar_slot, itemStack);
            }
        }
    }
})