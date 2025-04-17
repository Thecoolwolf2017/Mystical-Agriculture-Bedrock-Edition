import { system, world, ItemStack, GameMode, EntityColorComponent, EntityIsShearedComponent } from '@minecraft/server';

// Omitted item durability script. Make sure you've also imported "system" when using this script

// Instead of using ItemTypes.getAll() which requires additional privileges,
// we'll manually define the tool IDs

// Defines hoes
const hoeIds = [
    'strat:inferium_hoe',
    'strat:prudentium_hoe',
    'strat:tertium_hoe',
    'strat:imperium_hoe',
    'strat:supremium_hoe',
    'minecraft:wooden_hoe',
    'minecraft:stone_hoe',
    'minecraft:iron_hoe',
    'minecraft:golden_hoe',
    'minecraft:diamond_hoe',
    'minecraft:netherite_hoe'
];

// Defines shovels
const shovelIds = [
    'strat:inferium_shovel',
    'strat:prudentium_shovel',
    'strat:tertium_shovel',
    'strat:imperium_shovel',
    'strat:supremium_shovel',
    'minecraft:wooden_shovel',
    'minecraft:stone_shovel',
    'minecraft:iron_shovel',
    'minecraft:golden_shovel',
    'minecraft:diamond_shovel',
    'minecraft:netherite_shovel'
];

// Defines axes
const axeIds = [
    'strat:inferium_axe',
    'strat:prudentium_axe',
    'strat:tertium_axe',
    'strat:imperium_axe',
    'strat:supremium_axe',
    'minecraft:wooden_axe',
    'minecraft:stone_axe',
    'minecraft:iron_axe',
    'minecraft:golden_axe',
    'minecraft:diamond_axe',
    'minecraft:netherite_axe'
];

// Defines shears
const shearsIds = [
    'strat:inferium_shears',
    'strat:prudentium_shears',
    'strat:tertium_shears',
    'strat:imperium_shears',
    'strat:supremium_shears',
    'minecraft:shears'
];

// Defines sickles
const sickleIds = [
    'strat:inferium_sickle',
    'strat:prudentium_sickle',
    'strat:tertium_sickle',
    'strat:imperium_sickle',
    'strat:supremium_sickle'
];

world.beforeEvents.playerInteractWithEntity.subscribe(result => {
    if (!result.itemStack) return

    if (shearsIds.includes(result.itemStack.typeId)) {
        const playerEquippableComp = result.player.getComponent("equippable");

        if (!playerEquippableComp) return;

        if (result.target.typeId == "minecraft:sheep" && !result.target.getComponent(EntityIsShearedComponent.componentId)) {

            const woolColors = [
                "minecraft:white_wool",
                "minecraft:orange_wool",
                "minecraft:magenta_wool",
                "minecraft:light_blue_wool",
                "minecraft:yellow_wool",
                "minecraft:lime_wool",
                "minecraft:pink_wool",
                "minecraft:gray_wool",
                "minecraft:light_gray_wool",
                "minecraft:cyan_wool",
                "minecraft:purple_wool",
                "minecraft:blue_wool",
                "minecraft:brown_wool",
                "minecraft:green_wool",
                "minecraft:red_wool",
                "minecraft:black_wool"
            ];

            system.run(() => {
                result.player.playSound("mob.sheep.shear")
                result.target.triggerEvent("minecraft:on_sheared")
                let amount = Math.floor(Math.random() * 3) + 1

                const colorValue = result.target.getComponent(EntityColorComponent.componentId).value;
                if (colorValue >= 0 && colorValue < woolColors.length) {
                    const woolType = woolColors[colorValue];
                    result.target.dimension.spawnItem(new ItemStack(woolType, amount), result.target.location);
                }

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

                durabilityModifier = 1;

                // This will set the new durability value.
                itemUsedDurabilityComp.damage += durabilityModifier;

                // Declares and checks if the item is out of durability
                const maxDurability = itemUsedDurabilityComp.maxDurability
                const currentDamage = itemUsedDurabilityComp.damage
                if (currentDamage >= maxDurability) {

                    // If the item is out of durability, plays the item breaking sound and removes the item
                    player.playSound('random.break', { pitch: 1, location: player.location, volume: 1 })
                    playerEquippableComp.setEquipment("Mainhand", new ItemStack('minecraft:air', 1));
                }
                else if (currentDamage < maxDurability) {

                    // This sets the item in the player's selected slot.
                    playerEquippableComp.setEquipment("Mainhand", itemUsed);
                }
            })
        }
    }
})

world.beforeEvents.itemUseOn.subscribe(evd => {
    const { source: player, block, itemStack: itemUsed } = evd;

    // This returns if itemUsed is undefined.
    if (!itemUsed) return;

    if (hoeIds.includes(itemUsed.typeId) || shovelIds.includes(itemUsed.typeId) || axeIds.includes(itemUsed.typeId)) {

        // This retrieves the player's equippable component.
        const playerEquippableComp = player.getComponent("equippable");

        // This returns if playerEquippableComp is undefined.
        if (!playerEquippableComp) return;

        // Hoes
        if (hoeIds.includes(itemUsed.typeId)) {
            const blockAbove = block.dimension.getBlock(block.location).above(1);
            if (!blockAbove.isAir) return;
            if (block.permutation.matches('minecraft:dirt') || block.permutation.matches('minecraft:grass_block') || block.permutation.matches('minecraft:dirt_with_roots') || block.permutation.matches('minecraft:grass_path')) {
                system.run(function () {
                    block.setType("farmland")
                    player.playSound('use.gravel', { pitch: 1, location: block.location, volume: 1 });
                })
            }
            else return;
        }

        // Shovels
        if (shovelIds.includes(itemUsed.typeId)) {
            const blockAbove = block.dimension.getBlock(block.location).above(1);
            if (!blockAbove.isAir) return;
            if (block.permutation.matches('minecraft:dirt') || block.permutation.matches('minecraft:grass_block') || block.permutation.matches('minecraft:dirt_with_roots') || block.permutation.matches('minecraft:mycelium') || block.permutation.matches('minecraft:podzol')) {
                if (!block.permutation.matches('minecraft:grass_block')) {
                    system.run(function () {
                        block.setType("minecraft:grass_path");
                    })
                }
                system.run(function () {
                    player.playSound('use.grass', { pitch: 1, location: block.location, volume: 0.5 });
                })
            }
            else return;
        }

        // Axes
        if (axeIds.includes(itemUsed.typeId)) {
            if (block.permutation.matches('minecraft:oak_log') || block.permutation.matches('minecraft:birch_log') || block.permutation.matches('minecraft:spruce_log') || block.permutation.matches('minecraft:dark_oak_log') || block.permutation.matches('minecraft:jungle_log') || block.permutation.matches('minecraft:acacia_log') || block.permutation.matches('minecraft:mangrove_log') || block.permutation.matches('minecraft:oak_wood') || block.permutation.matches('minecraft:birch_wood') || block.permutation.matches('minecraft:spruce_wood') || block.permutation.matches('minecraft:dark_oak_wood') || block.permutation.matches('minecraft:jungle_wood') || block.permutation.matches('minecraft:acacia_wood') || block.permutation.matches('minecraft:mangrove_wood'))
                system.run(function () {
                    player.playSound('use.wood', { pitch: 1, location: block.location, volume: 1 })
                })
            else if (block.permutation.matches('minecraft:cherry_log') || block.permutation.matches('minecraft:cherry_wood'))
                system.run(function () {
                    player.playSound('step.cherry_wood', { pitch: 1, location: block.location, volume: 1 })
                })
            else if (block.permutation.matches('minecraft:bamboo_block'))
                system.run(function () {
                    player.playSound('step.bamboo_wood', { pitch: 1, location: block.location, volume: 1 })
                })
            else if (block.permutation.matches('minecraft:crimson_stem') || block.permutation.matches('minecraft:warped_stem') || block.permutation.matches('minecraft:crimson_hyphae') || block.permutation.matches('minecraft:warped_hyphae'))
                system.run(function () {
                    player.playSound('use.stem', { pitch: 1, location: block.location, volume: 1 })
                })
            else return;
        }

        // This returns if the player is in Creative mode
        if (player.matches({ gameMode: GameMode.creative })) return;

        // This retrieves the enchantable component of the item.
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

        // This will set the new durability value.
        system.run(function () {
            itemUsedDurabilityComp.damage += 1;

            // Declares and checks if the item is out of durability
            const maxDurability = itemUsedDurabilityComp.maxDurability
            const currentDamage = itemUsedDurabilityComp.damage
            if (currentDamage >= maxDurability) {

                // If the item is out of durability, plays the item breaking sound and removes the item
                system.run(() => {
                    player.playSound('random.break', { pitch: 1, location: player.location, volume: 1 })
                    playerEquippableComp.setEquipment("Mainhand", new ItemStack('minecraft:air', 1));
                });
            }
            else if (currentDamage < maxDurability) {

                // This sets the item in the player's selected slot.
                system.run(() => {
                    playerEquippableComp.setEquipment("Mainhand", itemUsed);
                });
            }
        })
    }
})