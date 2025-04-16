//Work in progress

import './Drag0nD/index'

import { world } from "@minecraft/server";

import { ActionFormData } from "@minecraft/server-ui"

import { CustomForm } from "./Drag0nD/customForm";

/**
* @param {import("@minecraft/server").Player} player
* @param {string} title
* @param {string} body
* @param {{ text: any; texture: any; }[]} buttons
*/
function createGuideSection(player, title, body, buttons, actions = {}) {
    player.playSound("item.book.page_turn", { volume: 0.3 })
    let customform = new CustomForm();
    customform.title(title).body(body);

    buttons.forEach(({ text, texture }) => {
        customform.button("Chapters", text, texture, true);
    });

    customform.show(player).then(response => {
        if (response.canceled) return;

        // Busca si hay una acción definida para el botón presionado
        if (actions[response.text]) {
            actions[response.text](player);
        }
    });
}

world.afterEvents.itemUse.subscribe((data) => {
    if (data.itemStack.typeId == "mysticalagriculture:guide_book") {
        if (data.source.hasTag("mysticalagriculture:guide_book")) {
            guideBook(data.source)
        }
        else {
            let form = new ActionFormData()

            form.title("Hi!").body("book.mysticalagriculture.readme")

            form.button("Ok!", "textures/ui/check");

            form.show(data.source).then(response => {

                data.source.addTag("mysticalagriculture:guide_book")

                if (response.canceled) {
                    guideBook(data.source)
                }
                guideBook(data.source)
            });
        }
    }
});

/**
* @param {import("@minecraft/server").Player} player
* @param {string} title
* @param {string | any[]} pages
* @param {{ (player: import("@minecraft/server").Player): void; (player: import("@minecraft/server").Player): void; (player: import("@minecraft/server").Player): void; (player: import("@minecraft/server").Player): void; (player: import("@minecraft/server").Player): void; (player: import("@minecraft/server").Player): void; (player: import("@minecraft/server").Player): void; (player: import("@minecraft/server").Player): void; (arg0: any): void; }} form
*/
function showtext(player, title, pages, form, pageIndex = 0) {

    player.playSound("item.book.page_turn", { volume: 0.3 })

    let form1 = new ActionFormData();

    form1.title(title).body(pages[pageIndex]);

    let buttonIndex = 0;
    let previousPageIndex = -1;
    let nextPageIndex = -1;

    if (pageIndex > 0) {
        previousPageIndex = buttonIndex++;
        form1.button("Previous page", "textures/ui/arrow_left");
    }
    if (pageIndex < pages.length - 1) {
        nextPageIndex = buttonIndex++;
        form1.button("Next page", "textures/ui/arrow_right");
    }

    let okIndex = buttonIndex;
    form1.button("Ok!", "textures/ui/check");

    form1.show(player).then(response => {
        if (response.canceled) return;

        if (response.selection === okIndex) {
            form(player);
        } else if (response.selection === previousPageIndex) {
            showtext(player, title, pages, form, pageIndex - 1);
        } else if (response.selection === nextPageIndex) {
            showtext(player, title, pages, form, pageIndex + 1);
        }
    });
}


const categories = {
    "book.mysticalagriculture.credits": {
        texture: "textures/ui/credits/credits",
        action: credits
    },
    "book.mysticalagriculture.cat.basics.name": {
        texture: "textures/items/essence/in-game/inferium_essence",
        action: basics
    },
    "book.mysticalagriculture.cat.advances.name": {
        texture: "textures/items/mystical_fertilizer",
        action: advances
    },
    "book.mysticalagriculture.cat.souls.name": {
        texture: "textures/items/soulium_dagger",
        action: souls
    },
    "book.mysticalagriculture.cat.elemental.name": {
        texture: "textures/items/wand",
        action: elemental
    },
    "book.mysticalagriculture.cat.machines.name": {
        texture: "textures/ui/question_mark",
        action: machines
    },
    "book.mysticalagriculture.cat.tinkering.name": {
        texture: "textures/items/gear/inferium_pickaxe",
        action: tinkering
    },
    "book.mysticalagriculture.cat.augments.name": {
        texture: "textures/items/unattuned_augment",
        action: augments
    }
};

/**
* @param {import("@minecraft/server").Player} player
*/
function guideBook(player) {

    player.playSound("item.book.page_turn", { volume: 0.3 })

    let customform = new CustomForm();
    customform.title("§6§lMystical Agriculture. 1st Edition").body("book.mysticalagriculture.body");

    // Agregar botones con texturas específicas
    Object.entries(categories).forEach(([section, { texture }]) => {
        customform.button("Categories", section, texture, true);
    });


    customform.show(player).then(response => {
        if (response.canceled) return;

        // Ejecutar la acción correspondiente si existe
        let selectedCategory = response.text.trim();
        if (categories[selectedCategory]?.action) {
            categories[selectedCategory].action(player);
        }
    });
}

/**
* @param {import("@minecraft/server").Player} player
*/
function basics(player) {
    const entries = [
        {
            key: "book.mysticalagriculture.entry.inferium_essence", texture: "textures/items/essence/in-game/inferium_essence",
            pages: ["book.mysticalagriculture.entry.inferium_essence.page.1"]
        },
        {
            key: "book.mysticalagriculture.entry.prosperity_shards", texture: "textures/items/prosperity_shard",
            pages: ["book.mysticalagriculture.entry.prosperity_shards.page.1"]
        },
        {
            key: "book.mysticalagriculture.entry.infusion_crystal", texture: "textures/items/infusion_crystal",
            pages: ["book.mysticalagriculture.entry.infusion_crystal.page.1"]
        },
        {
            key: "book.mysticalagriculture.entry.inferium_seeds", texture: "textures/items/seeds/in-game/inferium_seeds",
            pages: ["book.mysticalagriculture.entry.inferium_seeds.page.1"]
        },
        {
            key: "book.mysticalagriculture.overworld_ores", texture: "textures/ui/overworld_ores",
            pages: ["book.mysticalagriculture.entry.overworld_ores.page.1", "book.mysticalagriculture.entry.overworld_ores.page.2"]
        },
        {
            key: "book.mysticalagriculture.resource_crops", texture: "textures/items/prosperity_seed_base",
            pages: ["book.mysticalagriculture.entry.resource_crops.page.1", "book.mysticalagriculture.entry.resource_crops.page.2"]
        },
        {
            key: "book.mysticalagriculture.essence_farmland", texture: "textures/ui/essence_farmland",
            pages: ["book.mysticalagriculture.entry.essence_farmland.page.1", "book.mysticalagriculture.entry.essence_farmland.page.2"]
        },
        {
            key: "book.mysticalagriculture.growth_accelerators", texture: "textures/ui/growth_accelerators",
            pages: [/*"book.mysticalagriculture.entry.growth_accelerators.page.1","book.mysticalagriculture.entry.growth_accelerators.page.2"*/ "book.mysticalagriculture.coming_soon"]
        },
        {
            key: "book.mysticalagriculture.entry.watering_can", texture: "textures/items/watering_can",
            pages: ["book.mysticalagriculture.entry.watering_can.page.1"]
        },
        {
            key: "book.mysticalagriculture.infusion_altar", texture: "textures/ui/infusion_altar",
            pages: ["book.mysticalagriculture.entry.infusion_altar.page.1", "book.mysticalagriculture.entry.infusion_altar.page.2"]
        },
        {
            key: "book.mysticalagriculture.entry.fertilized_essence", texture: "textures/items/fertilized_essence",
            pages: ["book.mysticalagriculture.entry.fertilized_essence.page.1"]
        },
    ];

    const buttons = [{ text: "book.mysticalagriculture.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];

    const actions = {
        "book.mysticalagriculture.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, basics)]))
    };

    createGuideSection(
        player,
        "Basics",
        "book.mysticalagriculture.cat.basics.description",
        buttons,
        actions
    );
}


/**
* @param {import("@minecraft/server").Player} player
*/
function advances(player) {
    const entries = [
        {
            key: "book.mysticalagriculture.entry.mystical_fertilizer", texture: "textures/items/mystical_fertilizer",
            pages: ["book.mysticalagriculture.entry.mystical_fertilizer.page.1"]
        },
        {
            key: "book.mysticalagriculture.entry.master_infusion_crystal", texture: "textures/items/master_infusion_crystal",
            pages: ["book.mysticalagriculture.entry.master_infusion_crystal.page.1"]
        },
        {
            key: "book.mysticalagriculture.entry.essence_watering_cans", texture: "textures/items/gear/inferium_watering_can",
            pages: ["book.mysticalagriculture.entry.essence_watering_cans.page.1"]
        },
        {
            key: "book.mysticalagriculture.entry.sickles", texture: "textures/items/gear/inferium_sickle",
            pages: ["book.mysticalagriculture.entry.sickles.page.1"]
        },
        {
            key: "book.mysticalagriculture.entry.scythes", texture: "textures/items/gear/inferium_scythe",
            pages: ["book.mysticalagriculture.entry.scythes.page.1"]
        },
    ]

    const buttons = [{ text: "book.mysticalagriculture.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];

    const actions = {
        "book.mysticalagriculture.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, advances)]))
    };

    createGuideSection(
        player,
        "Advances",
        "book.mysticalagriculture.cat.advances.description",
        buttons,
        actions
    );
}

/**
* @param {import("@minecraft/server").Player} player
*/
function souls(player) {
    const entries = [
        {
            key: "book.mysticalagriculture.entry.soulstone", texture: "textures/ui/soulstone",
            pages: ["book.mysticalagriculture.entry.soulstone.page.1", "book.mysticalagriculture.entry.soulstone.page.2"]
        },
        {
            key: "book.mysticalagriculture.entry.soulium_ore", texture: "textures/ui/soulium_ore",
            pages: ["book.mysticalagriculture.entry.soulium_ore.page.1"]
        },
        {
            key: "book.mysticalagriculture.entry.witherproof_blocks", texture: "textures/ui/witherproof_block",
            pages: ["book.mysticalagriculture.entry.witherproof_blocks.page.1"]
        },
        {
            key: "book.mysticalagriculture.entry.soulium_dagger", texture: "textures/items/soulium_dagger",
            pages: ["book.mysticalagriculture.entry.soulium_dagger.page.1", "book.mysticalagriculture.entry.soulium_dagger.page.2", "book.mysticalagriculture.entry.soulium_dagger.page.3"]
        },
        {
            key: "book.mysticalagriculture.entry.soul_jars", texture: "textures/items/jar/soul_jar",
            pages: ["book.mysticalagriculture.entry.soul_jars.page.1"]
        },
        {
            key: "book.mysticalagriculture.entry.experience_capsule", texture: "textures/items/experience_capsule/experience_capsule_inner_6",
            pages: ["book.mysticalagriculture.entry.experience_capsule.page.1"]
        },
        {
            key: "book.mysticalagriculture.entry.enchanter", texture: "textures/ui/enchanter",
            pages: [/*"book.mysticalagriculture.entry.enchanter.page.1"*/"book.mysticalagriculture.coming_soon"]
        },
    ]

    const buttons = [{ text: "book.mysticalagriculture.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];

    const actions = {
        "book.mysticalagriculture.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, souls)]))
    };

    createGuideSection(
        player,
        "Souls",
        "book.mysticalagriculture.cat.souls.description",
        buttons,
        actions
    );
}

/**
* @param {import("@minecraft/server").Player} player
*/

////////////////
//Coming Soon//
///////////////
function elemental(player) {
    const entries = [
        {
            key: "book.mysticalagriculture.entry.elemental_essences", texture: "textures/items/essence/in-game/air_essence",
            pages: [/*"book.mysticalagriculture.entry.elemental_essences.page.1"*/"book.mysticalagriculture.coming_soon"]
        },
        {
            key: "book.mysticalagriculture.entry.cognizant_dust", texture: "textures/items/cognizant_dust",
            pages: [/*"book.mysticalagriculture.entry.cognizant_dust.page.1"*/"book.mysticalagriculture.coming_soon"]
        },
        {
            key: "book.mysticalagriculture.entry.essence_vessel", texture: "textures/ui/essence_vessel",
            pages: [/*"book.mysticalagriculture.entry.essence_vessel.page.1"*/"book.mysticalagriculture.coming_soon"]
        },
        {
            key: "book.mysticalagriculture.entry.awakening_altar", texture: "textures/ui/awakening_altar",
            pages: [/*"book.mysticalagriculture.entry.awakening_altar.page.1", "book.mysticalagriculture.entry.awakening_altar.page.2"*/"book.mysticalagriculture.coming_soon"]
        },
        {
            key: "book.mysticalagriculture.entry.awakened_supremium", texture: "textures/ui/question_mark",
            pages: [/*"book.mysticalagriculture.entry.awakened_supremium.page.1"*/, "book.mysticalagriculture.coming_soon"]
        },
    ]

    const buttons = [{ text: "book.mysticalagriculture.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];

    const actions = {
        "book.mysticalagriculture.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, elemental)]))
    };

    createGuideSection(
        player,
        "Elemental",
        "book.mysticalagriculture.category.elemental.description",
        buttons,
        actions
    );
}

/**
* @param {import("@minecraft/server").Player} player
*/

////////////////
//Coming Soon//
///////////////
function machines(player) {
    const entries = [
        {
            key: "book.mysticalagriculture.entry.machine_upgrades", texture: "textures/ui/question_mark",
            pages: [/*"book.mysticalagriculture.entry.machine_upgrades.page.1"*/"book.mysticalagriculture.coming_soon"]
        },
        {
            key: "book.mysticalagriculture.entry.essence_furnaces", texture: "textures/ui/question_mark",
            pages: [/*"book.mysticalagriculture.entry.essence_furnaces.page.1"*/"book.mysticalagriculture.coming_soon"]
        },
        {
            key: "book.mysticalagriculture.entry.seed_reprocessors", texture: "textures/ui/question_mark",
            pages: [/*"book.mysticalagriculture.entry.seed_reprocessors.page.1"*/"book.mysticalagriculture.coming_soon"]
        },
        {
            key: "book.mysticalagriculture.entry.soul_extractor", texture: "textures/ui/question_mark",
            pages: [/*"book.mysticalagriculture.entry.soul_extractor.page.1"*/"book.mysticalagriculture.coming_soon"]
        },
        {
            key: "book.mysticalagriculture.entry.harvester", texture: "textures/ui/question_mark",
            pages: [/*"book.mysticalagriculture.entry.harvester.page.1","book.mysticalagriculture.entry.harvester.page.2"*/"book.mysticalagriculture.coming_soon"]
        },
        {
            key: "book.mysticalagriculture.entry.soulium_spawner", texture: "textures/ui/question_mark",
            pages: [/*"book.mysticalagriculture.entry.soulium_spawner.page.1","book.mysticalagriculture.entry.soulium_spawner.page.2"*/"book.mysticalagriculture.coming_soon"]
        },

    ]

    const buttons = [{ text: "book.mysticalagriculture.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];

    const actions = {
        "book.mysticalagriculture.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, machines)]))
    };

    createGuideSection(
        player,
        "Machines",
        "book.mysticalagriculture.cat.machines.description",
        buttons,
        actions
    );
}

/**
* @param {import("@minecraft/server").Player} player
*/

////////////////
//Coming Soon//
///////////////
function tinkering(player) {
    const entries = [
        {
            key: "book.mysticalagriculture.entry.essence_tools", texture: "textures/items/gear/inferium_pickaxe",
            pages: [/*"book.mysticalagriculture.entry.essence_tools.page.1"*/"book.mysticalagriculture.coming_soon"]
        },
        {
            key: "book.mysticalagriculture.entry.essence_armor", texture: "textures/items/gear/inferium_chestplate",
            pages: [/*"book.mysticalagriculture.entry.essence_armor.page.1"*/"book.mysticalagriculture.coming_soon"]
        },
        {
            key: "book.mysticalagriculture.entry.tinkering_table", texture: "textures/ui/tinkering_table",
            pages: [/*"book.mysticalagriculture.entry.tinkering_table.page.1"*/"book.mysticalagriculture.coming_soon"]
        },
        {
            key: "book.mysticalagriculture.entry.augments", texture: "textures/items/unattuned_augment",
            pages: [/*"book.mysticalagriculture.entry.augments.page.1","book.mysticalagriculture.entry.augments.page.2"*/"book.mysticalagriculture.coming_soon"]
        },
    ]

    const buttons = [{ text: "book.mysticalagriculture.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];

    const actions = {
        "book.mysticalagriculture.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, tinkering)]))
    };

    createGuideSection(
        player,
        "Tinkering",
        "book.mysticalagriculture.cat.machines.description",
        buttons,
        actions
    );
}
/**
* @param {import("@minecraft/server").Player} player
*/

////////////////
//Coming Soon//
///////////////
function augments(player) {
    const entries = [
        {
            key: "book.mysticalagriculture.coming_soon", texture: "textures/items/unattuned_augment",
            pages: [/*"book.mysticalagriculture.entry.essence_tools.page.1"*/"book.mysticalagriculture.coming_soon"]
        },
    ]

    const buttons = [{ text: "book.mysticalagriculture.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];

    const actions = {
        "book.mysticalagriculture.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, augments)]))
    };

    createGuideSection(
        player,
        "Augments",
        "book.mysticalagriculture.cat.augments.description",
        buttons,
        actions
    );
}

/**
* @param {import("@minecraft/server").Player} player
*/
function credits(player) {
    const entries = [
        {
            key: "book.mysticalagriculture.credits.description1.name", texture: "textures/ui/credits/BlakeBr0",
            pages: ["book.mysticalagriculture.credits.description1"]
        },
        {
            key: "book.mysticalagriculture.credits.description2.name", texture: "textures/ui/credits/vactricaking",
            pages: ["book.mysticalagriculture.credits.description2"]
        },
        {
            key: "book.mysticalagriculture.credits.description3.name", texture: "textures/ui/credits/rebel459",
            pages: ["book.mysticalagriculture.credits.description3"]
        },
        {
            key: "book.mysticalagriculture.credits.description4.name", texture: "textures/ui/credits/alienedds",
            pages: ["book.mysticalagriculture.credits.description4"]
        },
        {
            key: "book.mysticalagriculture.credits.description5.name", texture: "textures/ui/credits/Kaioga5",
            pages: ["book.mysticalagriculture.credits.description5"]
        },
        {
            key: "book.mysticalagriculture.credits.description6.name", texture: "textures/ui/credits/Rimestor",
            pages: ["book.mysticalagriculture.credits.description6"]
        },
        {
            key: "book.mysticalagriculture.credits.description7.name", texture: "textures/ui/credits/Drag0nD",
            pages: ["book.mysticalagriculture.credits.description7"]
        },
        {
            key: "book.mysticalagriculture.credits.description8.name", texture: "textures/ui/credits/Chatgpt",
            pages: ["book.mysticalagriculture.credits.description8"]
        },
    ]

    const buttons = [{ text: "book.mysticalagriculture.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];

    const actions = {
        "book.mysticalagriculture.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, credits)]))
    };

    createGuideSection(
        player,
        "Credits",
        "book.mysticalagriculture.credits.description",
        buttons,
        actions
    );
}