import * as server from "@minecraft/server"

server.world.beforeEvents.itemUse.subscribe(result => {
    if (!result.itemStack) return;

    let offhandItemStack = result.source.getComponent("equippable").getEquipment(server.EquipmentSlot.Offhand);
    let itemStack = result.itemStack;
    let amount = itemStack.amount;

    if (!offhandItemStack) return;

    if (offhandItemStack.typeId != "strat:infusion_crystal" &&
        offhandItemStack.typeId != "strat:master_infusion_crystal") return;

    const essenceConversions = {
        "strat:inferium_essence": "strat:prudentium_essence",
        "strat:prudentium_essence": "strat:tertium_essence",
        "strat:tertium_essence": "strat:imperium_essence",
        "strat:imperium_essence": "strat:supremium_essence",

        "strat:inferium_block": "strat:prudentium_block",
        "strat:prudentium_block": "strat:tertium_block",
        "strat:tertium_block": "strat:imperium_block",
        "strat:imperium_block": "strat:supremium_block",
    };

    const targetEssence = essenceConversions[result.itemStack.typeId];
    if (!targetEssence) return;

    const updateMainhandStack = (remainingAmount) => {
        if (remainingAmount === 0) {
            result.source.getComponent("equippable").setEquipment(server.EquipmentSlot.Mainhand, null);
        } else {
            itemStack.amount = remainingAmount;
            result.source.getComponent("equippable").setEquipment(server.EquipmentSlot.Mainhand, itemStack);
        }
    };

    const updateOffhandStack = (batches) => {
        let lore = offhandItemStack.getLore();
        if (lore && lore.length > 0) {
            let usesMatch = lore[0].match(/§7(\d+)\s+Uses\s+Left/);
            if (usesMatch) {
                let usesLeft = parseInt(usesMatch[1]);
                usesLeft -= batches;
                if (usesLeft > 0) {
                    offhandItemStack.setLore([`§7${usesLeft} Uses Left`]);
                    result.source.getComponent("equippable").setEquipment(server.EquipmentSlot.Offhand, offhandItemStack);
                } else {
                    result.source.getComponent("equippable").setEquipment(server.EquipmentSlot.Offhand, null);
                }
            }
        }
    };

    const convertEssences = (batches) => {
        for (let i = 0; i < batches; i++) {
            result.source.getComponent("inventory").container.addItem(new server.ItemStack(targetEssence, 1));
        }
    };

    server.system.run(() => {
        const isSneaking = result.source.isSneaking;
        const batchSize = 4;
        const batches = Math.floor(amount / batchSize);
        const totalConverted = batches * batchSize;
        const remaining = amount - totalConverted;

        if (isSneaking && batches > 0) {
            updateMainhandStack(remaining);
            if (offhandItemStack.typeId != "strat:master_infusion_crystal") updateOffhandStack(batches);
            convertEssences(batches);
        } else if (!isSneaking && amount >= batchSize) {
            updateMainhandStack(amount - batchSize);
            if (offhandItemStack.typeId != "strat:master_infusion_crystal") updateOffhandStack(1);
            convertEssences(1);
        }
    });
});