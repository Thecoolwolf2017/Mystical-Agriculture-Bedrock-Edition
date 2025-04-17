import * as server from "@minecraft/server"

import { seedsTier } from "./seeds_tier"

server.system.runInterval(() => {
    for (let player of server.world.getAllPlayers()) {

        let block = player.getBlockFromViewDirection({ maxDistance: 8 })?.block

        if (!block) return

        if (block.typeId.startsWith("strat:") && block.typeId.endsWith("_crop")) {

            let farmlandTierList = [
                { typeId: "minecraft:farmland", tier: "0", output: 100 },
                { typeId: "strat:inferium_farmland", tier: "§e1", output: 100 },
                { typeId: "strat:prudentium_farmland", tier: "§a2", output: 150 },
                { typeId: "strat:tertium_farmland", tier: "§63", output: 200 },
                { typeId: "strat:imperium_farmland", tier: "§b4", output: 250 },
                { typeId: "strat:supremium_farmland", tier: "§c5", output: 300 },
            ]

            // Fix for NaN% growth display issue
            let growthValue = block.permutation.getState("strat:growth");
            let growth;
            
            if (growthValue === undefined || growthValue === null) {
                growth = "§fUnknown";
            } else if (growthValue == 7) {
                growth = "§aMature";
            } else {
                // Make sure we have a valid number
                try {
                    const growthNum = parseInt(growthValue);
                    if (isNaN(growthNum)) {
                        growth = "§f0%";
                    } else {
                        growth = `§f${((growthNum * 100) / 7).toFixed(0)}%`;
                    }
                } catch (e) {
                    growth = "§f0%";
                }
            }
            let cropTier = seedsTier.find(seed => seed.typeId.replaceAll("_seeds", "_crop") == block.typeId).tier
            let output = farmlandTierList.find(farmBlock => farmBlock.typeId == block.below().typeId).output
            let farmlandTier = farmlandTierList.find(farmBlock => farmBlock.typeId == block.below().typeId).tier

            let itemPrefix = cropTier.substring(0, 2)

            let secondaryChance = 0

            if (farmlandTier == cropTier) {
                secondaryChance = 20
            }
            else if (farmlandTier != "0") {
                secondaryChance = 10
            }

            let isInferium = false

            if (block.typeId == "strat:inferium_crop") {
                isInferium = true
            }



            player.onScreenDisplay.setActionBar(`§7Growth: ${itemPrefix}${growth}\n§7Tier: ${cropTier}${secondaryChance ? `\n§7Secondary Chance: ${itemPrefix}${secondaryChance}%` : ``}${isInferium ? `\n§7Inferium Output: ${itemPrefix}${output}%` : ``} `)

        }
        else if (block.typeId == "strat:infusion_altar") {
            let state = block.above().permutation.getAllStates()
            let isActive = state["strat:is_active"] ? "§aTrue" : "§cFalse"
            player.onScreenDisplay.setActionBar(`§dInfusion §5Altar§r\nActive: ${isActive}`)
        }
    }
})