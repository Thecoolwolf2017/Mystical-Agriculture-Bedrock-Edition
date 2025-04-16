import { world, system } from '@minecraft/server';
import { cropManager } from '../classes/cropManager';
//block components
const blockComponents = [
    {
        id: "strat:custom_crop",
        code: {
            onPlayerInteract: (data) => {
                cropManager.interact(data.block, data.player);
            },
            onRandomTick: (data) => {
                cropManager.tick(data.block);
            }
        }
    },
    {
        id: "strat:crop_controller",
        code: {
            onPlayerInteract: (data) => {
                cropManager.interact(data.block, data.player);
            },
            onRandomTick: (data) => {
                cropManager.tick(data.block);
            }
        }
    },
    {
        id: "strat:farmland_controller",
        code: {
            onRandomTick: (data) => {
                // Handle farmland ticking logic
                const location = data.block.location;
                // Check for crops above and apply growth boost if needed
            }
        }
    },
    {
        id: "strat:ore_xp",
        code: {
            onPlayerDestroy: (data) => {
                // Handle XP drops when ore is destroyed
            }
        }
    },
    {
        id: "strat:altar_check",
        code: {
            onPlayerInteract: (data) => {
                // Handle altar interaction logic
            }
        }
    },
    {
        id: "strat:pedestal_place",
        code: {
            onPlayerInteract: (data) => {
                // Handle pedestal interaction logic
            }
        }
    },
    {
        id: "strat:none",
        code: {
            // Empty component for blocks that need a custom component reference but no behavior
        }
    }
];
let reload = 0;
world.beforeEvents.worldInitialize.subscribe((data) => {
    //reload is needed to stop crashes
    reload = reload + 1;
    if (reload > 1) return;
    for (const comp of blockComponents) {
        //register the component
        data.blockComponentRegistry.registerCustomComponent(comp.id, comp.code);
    }
});
