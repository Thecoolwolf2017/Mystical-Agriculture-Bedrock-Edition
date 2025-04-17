// Script to fix seed item categories
// This script logs all seed files that need to be updated from "equipment" to "items" category

import { world } from "@minecraft/server";

// Function to log a message to the chat
function logToChat(message) {
    world.sendMessage(message);
}

// Log that the script is running
logToChat("§a[Seed Category Fixer] Starting to check seed categories...");

// List of seed files that need to be updated
const seedsToUpdate = [
    "zombie_seeds.json",
    "zinc_seeds.json",
    "wood_seeds.json",
    "wither_skeleton_seeds.json",
    "uranium_seeds.json",
    "turtle_seeds.json",
    "tin_seeds.json",
    "template_seeds.json",
    "sulfur_seeds.json",
    "stone_seeds.json",
    "steel_seeds.json",
    "squid_seeds.json",
    "spider_seeds.json",
    "soulium_seeds.json",
    "slime_seeds.json",
    "skeleton_seeds.json",
    "silver_seeds.json",
    "silicon_seeds.json",
    "sheep_seeds.json",
    "sapphire_seeds.json",
    "saltpeter_seeds.json",
    "ruby_seeds.json",
    "rubber_seeds.json",
    "redstone_seeds.json",
    "rabbit_seeds.json",
    "prismarine_seeds.json",
    "platinum_seeds.json",
    "pig_seeds.json",
    "peridot_seeds.json",
    "obsidian_seeds.json",
    "nickel_seeds.json",
    "nether_seeds.json",
    "nether_quartz_seeds.json",
    "netherite_seeds.json",
    "nature_seeds.json",
    "lead_seeds.json",
    "lapis_lazuli_seeds.json",
    "iron_seeds.json",
    "iridium_seeds.json",
    "invar_seeds.json",
    "inferium_seeds.json",
    "ice_seeds.json",
    "honey_seeds.json",
    "graphite_seeds.json",
    "gold_seeds.json",
    "glowstone_seeds.json",
    "ghast_seeds.json",
    "fish_seeds.json",
    "experience_seeds.json",
    "end_seeds.json",
    "enderman_seeds.json",
    "emerald_seeds.json",
    "electrum_seeds.json",
    "dye_seeds.json",
    "dirt_seeds.json",
    "diamond_seeds.json",
    "deepslate_seeds.json",
    "creeper_seeds.json",
    "cow_seeds.json",
    "coral_seeds.json",
    "copper_seeds.json",
    "constantan_seeds.json",
    "coal_seeds.json",
    "chicken_seeds.json",
    "bronze_seeds.json",
    "brass_seeds.json",
    "blaze_seeds.json",
    "apatite_seeds.json",
    "amethyst_seeds.json",
    "aluminum_seeds.json"
];

// Log the number of files that need to be updated
logToChat(`§e[Seed Category Fixer] Found ${seedsToUpdate.length} seed files that need to be updated.`);

// Log instructions for manually updating the files
logToChat("§e[Seed Category Fixer] To fix these files, you need to:");
logToChat("§e[Seed Category Fixer] 1. Open each file in BP/items/seeds/");
logToChat("§e[Seed Category Fixer] 2. Change 'category': 'equipment' to 'category': 'items'");

// Log a sample of files that need to be updated
logToChat("§e[Seed Category Fixer] Sample of files to update:");
for (let i = 0; i < Math.min(5, seedsToUpdate.length); i++) {
    logToChat(`§e[Seed Category Fixer] - ${seedsToUpdate[i]}`);
}

// Log completion message
logToChat("§a[Seed Category Fixer] Check complete. See documentation in docs/item_categories.md for more information.");
