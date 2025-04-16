import { world, system } from '@minecraft/server';
import { cropManager } from '../classes/cropManager';
//block components
const blockComponents = [
    {
        id: "mysticalagriculture:custom_crop",
        code: {
            onPlayerInteract: (data) => {
                cropManager.interact(data.block, data.player);
            },
            onRandomTick: (data) => {
                cropManager.tick(data.block);
            }
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
