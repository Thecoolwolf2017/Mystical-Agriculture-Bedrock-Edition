import * as server from "@minecraft/server"

const playerXpTracker = {};

server.system.runTimeout(() => {
    for (let player of server.world.getAllPlayers()) {
        playerXpTracker[player.id] = player.getTotalXp();
    }
}, 0);

server.system.runInterval(() => {
    for (let player of server.world.getAllPlayers()) {
        let inventory = player.getComponent("inventory").container;
        let capsuleSlot = null;
        let foundSpace = false;

        for (let i = 0; i < inventory.size; i++) {
            let itemStack = inventory.getItem(i);

            if (!itemStack) continue;

            if ((itemStack.typeId == "strat:experience_capsule")
                && isCapsuleNotFull(itemStack)) {

                capsuleSlot = i;
                foundSpace = true;
                break;
            }
        }

        if (foundSpace) {
            const xp = player.getTotalXp();
            const lastXp = playerXpTracker[player.id] || xp;
            const xpDelta = xp - lastXp;

            if (xpDelta > 0) {
                // console.warn(`§dMystical §5Agriculture§r - Added §a§l${xpDelta} §rExperience to §e§l${player.name}'s Experience Capsule`)
                player.addExperience(-xpDelta);

                let itemStack = inventory.getItem(capsuleSlot);
                let lore = itemStack.getLore();

                if (lore.length > 0) {
                    const lorePattern = /§7(\d+)\s\/\s(\d+)\sExperience\sPoints/;

                    if (lorePattern.test(lore[0])) {
                        let match = lore[0].match(lorePattern);

                        if (match) {
                            let currentXp = parseFloat(match[1]);
                            let maxXp = parseFloat(match[2]);

                            currentXp = Math.min(currentXp + xpDelta, maxXp);

                            lore[0] = `§7${currentXp.toFixed(0)} / ${maxXp} Experience Points`;
                            itemStack.setLore(lore);

                            if (currentXp.toFixed(0) == 1200) {
                                console.warn(`§dMystical §5Agriculture§r - §e§l${player.name}'s Experience Capsule §ris now §a§lfull`)
                                inventory.setItem(capsuleSlot, new server.ItemStack("strat:experience_capsule_full"));

                            }
                            else {
                                inventory.setItem(capsuleSlot, itemStack);

                            }

                        }
                    }
                }
            }
            playerXpTracker[player.id] = xp;
        }
    }
});


function isCapsuleNotFull(itemStack) {
    let lore = itemStack.getLore();
    if (lore.length > 0) {
        const lorePattern = /§7(\d+)\s\/\s(\d+)\sExperience\sPoints/;
        if (lorePattern.test(lore[0])) {
            let match = lore[0].match(lorePattern);
            if (match) {
                let currentXp = parseFloat(match[1]);
                let maxXp = parseFloat(match[2]);

                return currentXp < maxXp;
            }
        }
    }
    return false;
}

server.world.beforeEvents.itemUse.subscribe(result => {
    if (result.itemStack.typeId != "strat:experience_capsule") return;

    server.system.run(() => {
        const player = result.source;

        let itemStack = result.itemStack
        let lore = itemStack.getLore();

        if (lore.length > 0) {
            const lorePattern = /§7(\d+)\s\/\s(\d+)\sExperience\sPoints/;

            if (lorePattern.test(lore[0])) {
                let match = lore[0].match(lorePattern);

                if (match) {

                    if (!player.isSneaking) {

                        let currentXp = parseFloat(match[1]);
                        let maxXp = parseFloat(match[2]);

                        if (currentXp == maxXp) {

                            player.onScreenDisplay.setActionBar(`§cThe experience capsule is full`)
                            return
                        }

                        player.addLevels(-1)
                        server.system.runTimeout(() => {
                            player.addLevels(1)
                            server.system.runTimeout(() => {
                                player.addLevels(-1)
                            }, 1)
                        }, 1)
                    }
                    else {
                        // I will add it later...
                        // Or never, who know
                        // let currentXp = parseFloat(match[1]);
                        // let maxXp = parseFloat(match[2]);
                        // let xpNeeded = player.totalXpNeededForNextLevel
                        // console.warn(currentXp)
                        // console.warn(xpNeeded)
                        // lore[0] = `§7${currentXp.toFixed(0) - xpNeeded} / ${maxXp} Experience Points`;
                        // player.addLevels(1)

                        // itemStack.setLore(lore);

                        // player.getComponent("equippable").setEquipment(server.EquipmentSlot.Mainhand, itemStack)

                    }
                }
            }
        }

    })
});