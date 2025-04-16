import { world } from "@minecraft/server";
import { CustomForm } from "./customForm.js";

// world.afterEvents.itemUse.subscribe((data) => {
//     if (data.itemStack.typeId == "minecraft:diamond") {
//         let customform = new CustomForm();
//         for (let i = 0; i < 5; i++) {
//             customform.button("items", `§aitem ${i}\ntest`, "textures/items/diamond", true);
//         }
//         for (let i = 0; i < 7; i++) {
//             customform.button("blocks", `block ${i}`, "textures/blocks/dirt");
//         }
//         for (let i = 0; i < 12; i++) {
//             customform.button("weapons", `weapon ${i}\ntest`, "textures/items/diamond_sword");
//         }
//         customform.title("my form").body("test");
//         customform.show(data.source).then(response => {
//             if (response.canceled) return;

//             console.warn(`Selected the button "${response.text}" in the category "${response.category}"`)
//             //you can use response.category and response.text to get current category and text of the button clicked
//         });

//     }
// });