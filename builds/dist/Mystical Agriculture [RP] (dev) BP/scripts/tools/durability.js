import { world, ItemStack, GameMode, ItemTypes } from '@minecraft/server';

// Instead of using ItemTypes.getAll() which requires additional privileges,
// we'll define the tool and weapon IDs manually

// This array defines the tool items that will lose durability.
const toolTypeIds = [
    // Pickaxes
    'strat:inferium_pickaxe',
    'strat:prudentium_pickaxe',
    'strat:tertium_pickaxe',
    'strat:imperium_pickaxe',
    'strat:supremium_pickaxe',
    // Axes
    'strat:inferium_axe',
    'strat:prudentium_axe',
    'strat:tertium_axe',
    'strat:imperium_axe',
    'strat:supremium_axe',
    // Hoes
    'strat:inferium_hoe',
    'strat:prudentium_hoe',
    'strat:tertium_hoe',
    'strat:imperium_hoe',
    'strat:supremium_hoe',
    // Shovels
    'strat:inferium_shovel',
    'strat:prudentium_shovel',
    'strat:tertium_shovel',
    'strat:imperium_shovel',
    'strat:supremium_shovel',
    // Shears
    'strat:inferium_shears',
    'strat:prudentium_shears',
    'strat:tertium_shears',
    'strat:imperium_shears',
    'strat:supremium_shears'
];

// This array defines the weapon items that will lose durability.
const weaponTypeIds = [
    'strat:inferium_sword',
    'strat:prudentium_sword',
    'strat:tertium_sword',
    'strat:imperium_sword',
    'strat:supremium_sword'
];

world.afterEvents.playerBreakBlock.subscribe(evd => {
    const { player, itemStackBeforeBreak: itemUsed } = evd;

    // This returns if itemUsed is undefined or if the player is in Creative.
    if (!itemUsed || player.matches({ gameMode: GameMode.creative })) return;

    if (toolTypeIds.includes(itemUsed.typeId) || weaponTypeIds.includes(itemUsed.typeId)) {
        // This retrieves the player's equippable component.
        const playerEquippableComp = player.getComponent("equippable");

        // This returns if playerEquippableComp is undefined.
        if (!playerEquippableComp) return;

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

        let durabilityModifier = 0;
        if (toolTypeIds.includes(itemUsed.typeId)) {
            // If the item is a tool, then it will set the durability modifier to 1.
            durabilityModifier = 1;
        } else {
            // If the item is a weapon, then it will set the durability modifier to 2.
            durabilityModifier = 2;
        }

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
    }
})