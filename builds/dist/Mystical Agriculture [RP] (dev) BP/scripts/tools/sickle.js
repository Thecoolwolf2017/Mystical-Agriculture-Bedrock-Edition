import { system, world, ItemStack, GameMode, EntityColorComponent, EntityIsShearedComponent } from '@minecraft/server';

// Instead of using ItemTypes.getAll() which requires additional privileges,
// we'll define the sickle IDs manually
const sickleIds = [
    'strat:inferium_sickle',
    'strat:prudentium_sickle',
    'strat:tertium_sickle',
    'strat:imperium_sickle',
    'strat:supremium_sickle'
];

world.beforeEvents.playerBreakBlock.subscribe(result => {

    if (!result.itemStack) return

    if (sickleIds.includes(result.itemStack.typeId) && result.block.hasTag("minecraft:crop")) {
        const block = result.block;
        const centerX = block.location.x;
        const centerY = block.location.y;
        const centerZ = block.location.z;
        let totalCrops = 1

        let tags = result.itemStack.getTags()

        const area = Math.floor((parseInt(tags.find(tag => tag.startsWith("area")).split(":").pop()) / 2));;
        system.run(() => {
            for (let dx = -area; dx <= area; dx++) {
                for (let dz = -area; dz <= area; dz++) {
                    const targetX = centerX + dx;
                    const targetY = centerY;
                    const targetZ = centerZ + dz;

                    const targetBlock = block.dimension.getBlock({ x: targetX, y: targetY, z: targetZ });

                    if (targetBlock && targetBlock.hasTag("minecraft:crop")) {
                        totalCrops++;

                        const blockID = targetBlock.typeId;

                        if (targetBlock.permutation.getState("strat:growth") == 7) {
                            if (blockID.startsWith("strat:") && blockID.includes("_crop")) {
                                const baseID = blockID.replace("_crop", "");
                                let itemStack1 = new ItemStack(`${baseID}_essence`, 1);
                                let itemStack2 = new ItemStack(`${baseID}_seeds`, 1);
                                targetBlock.dimension.spawnItem(itemStack1, targetBlock.location);
                                targetBlock.dimension.spawnItem(itemStack2, targetBlock.location);

                                if (Math.floor(Math.random() * 10) + 1 == 1) {
                                    let itemStack3 = new ItemStack(`strat:fertilized_essence`, 1);
                                    targetBlock.dimension.spawnItem(itemStack3, targetBlock.location);
                                }
                            }
                        } else if (targetBlock.permutation.getState("strat:growth") < 7) {
                            if (blockID.startsWith("strat:") && blockID.includes("_crop")) {
                                const baseID = blockID.replace("_crop", "");
                                let itemStack = new ItemStack(`${baseID}_seeds`, 1);
                                targetBlock.dimension.spawnItem(itemStack, targetBlock.location);
                            }
                        }

                        targetBlock.dimension.runCommand(
                            `fill ${targetBlock.location.x} ${targetBlock.location.y} ${targetBlock.location.z} ` +
                            `${targetBlock.location.x} ${targetBlock.location.y} ${targetBlock.location.z} air destroy`
                        );
                    }
                }
            }

            const playerEquippableComp = result.player.getComponent("equippable");

            // This returns if playerEquippableComp is undefined.
            if (!playerEquippableComp) return;

            let itemUsed = result.itemStack

            const itemEnchantmentComp = itemUsed.getComponent("minecraft:enchantable");
            const unbreakingLevel = itemEnchantmentComp?.getEnchantment("unbreaking")?.level ?? 0;

            // Calculates the chance of an item breaking based on its unbreaking level. This is the vanilla unbreaking formula.
            const breakChance = 100 / (unbreakingLevel + 1);
            // Generates a random chance value between 0 and 100.
            const randomizeChance = Math.random() * 100;

            // This returns if breakChance is less than randomizeChance.
            if (breakChance < randomizeChance) return;

            // This retrieves the durability component of the item.
            const itemUsedDurabilityComp = itemUsed.getComponent("durability");

            // This returns if itemUsedDurabilityComp is undefined.
            if (!itemUsedDurabilityComp) return;

            let durabilityModifier = 0;

            durabilityModifier += totalCrops;

            // This will set the new durability value.
            itemUsedDurabilityComp.damage = Math.min(
                itemUsedDurabilityComp.damage + durabilityModifier,
                itemUsedDurabilityComp.maxDurability
            );

            // Declares and checks if the item is out of durability
            const maxDurability = itemUsedDurabilityComp.maxDurability
            const currentDamage = itemUsedDurabilityComp.damage
            if (currentDamage >= maxDurability) {

                // If the item is out of durability, plays the item breaking sound and removes the item
                result.player.playSound('random.break', { pitch: 1, location: result.player.location, volume: 1 })
                playerEquippableComp.setEquipment("Mainhand", new ItemStack('minecraft:air', 1));
            }
            else if (currentDamage < maxDurability) {

                // This sets the item in the player's selected slot.
                playerEquippableComp.setEquipment("Mainhand", itemUsed);
            }
        })
    }
});