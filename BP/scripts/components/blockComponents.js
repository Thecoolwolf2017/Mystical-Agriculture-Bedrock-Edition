import { world, system } from '@minecraft/server';
import { cropManager } from '../classes/cropManager';
import { handleOreXpDrop } from '../main';

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
                const block = data.block;
                const blockAbove = block.above();
                
                // Check if there's a crop above
                if (!blockAbove || !blockAbove.hasTag('crop')) return;
                
                // Get the current moisture level
                const isMoist = block.permutation.getState('wiki:wet_farmland') === true;
                if (!isMoist) return; // Only grow crops if farmland is moist
                
                // Check farmland tier to determine growth boost chance
                let growthChance = 0.05; // Base chance for regular farmland
                
                if (block.typeId === 'strat:inferium_farmland') {
                    growthChance = 0.1; // 10% chance
                } else if (block.typeId === 'strat:prudentium_farmland') {
                    growthChance = 0.15; // 15% chance
                } else if (block.typeId === 'strat:tertium_farmland') {
                    growthChance = 0.2; // 20% chance
                } else if (block.typeId === 'strat:imperium_farmland') {
                    growthChance = 0.25; // 25% chance
                } else if (block.typeId === 'strat:supremium_farmland') {
                    growthChance = 0.3; // 30% chance
                }
                
                // Random chance to boost growth
                if (Math.random() > growthChance) return;
                
                // Handle different crop types
                if (blockAbove.typeId.includes('strat:') && blockAbove.typeId.includes('_crop')) {
                    // Custom crops use strat:growth_stage property
                    const currentStage = blockAbove.permutation.getState('strat:growth_stage');
                    if (currentStage < 7) { // Max growth stage is 7
                        blockAbove.setPermutation(blockAbove.permutation.withState('strat:growth_stage', currentStage + 1));
                        // Optionally spawn particles to show growth
                        block.dimension.spawnParticle('minecraft:crop_growth_emitter', blockAbove.location);
                    }
                } else if (blockAbove.hasTag('minecraft:crop')) {
                    // Vanilla crops use age property
                    try {
                        const currentAge = blockAbove.permutation.getState('minecraft:age');
                        const maxAge = blockAbove.typeId === 'minecraft:beetroot' || 
                                     blockAbove.typeId === 'minecraft:sweet_berry_bush' ? 3 : 7;
                        
                        if (currentAge < maxAge) {
                            blockAbove.setPermutation(blockAbove.permutation.withState('minecraft:age', currentAge + 1));
                            // Optionally spawn particles to show growth
                            block.dimension.spawnParticle('minecraft:crop_growth_emitter', blockAbove.location);
                        }
                    } catch (e) {
                        // Handle any errors with vanilla crops
                        console.warn(`Error growing crop: ${e.message}`);
                    }
                }
            },
            // Handle farmland moisture
            onTick: (data) => {
                const block = data.block;
                
                // Check for water nearby (up to 4 blocks away)
                let hasWaterNearby = false;
                const checkRange = 4;
                
                for (let x = -checkRange; x <= checkRange; x++) {
                    for (let z = -checkRange; z <= checkRange; z++) {
                        if (x === 0 && z === 0) continue; // Skip the current block
                        
                        const neighborPos = {
                            x: block.location.x + x,
                            y: block.location.y,
                            z: block.location.z + z
                        };
                        
                        const neighborBlock = block.dimension.getBlock(neighborPos);
                        if (neighborBlock && (neighborBlock.hasTag('water') || neighborBlock.isWaterlogged)) {
                            hasWaterNearby = true;
                            break;
                        }
                    }
                    if (hasWaterNearby) break;
                }
                
                // Update moisture state
                const currentState = block.permutation.getState('wiki:wet_farmland');
                const newState = hasWaterNearby;
                
                if (currentState !== newState) {
                    block.setPermutation(block.permutation.withState('wiki:wet_farmland', newState));
                }
                
                // Check if block above is valid, if not convert to dirt
                const blockAbove = block.above();
                if (blockAbove && !blockAbove.hasTag('crop') && blockAbove.typeId !== 'minecraft:air') {
                    block.setType('minecraft:dirt');
                }
            }
        }
    },
    {
        id: "strat:ore_xp",
        code: {
            onPlayerDestroy: handleOreXpDrop
        }
    },
    {
        id: "strat:altar_check",
        code: {
            onPlayerInteract: (data) => {
                const { block, player, itemStack } = data;
                
                // Only proceed if player is holding the mystical wand
                if (!itemStack || itemStack.typeId !== 'strat:wand') return;
                
                // Check for the altar block below
                const altarBlock = block.below();
                if (!altarBlock || altarBlock.typeId !== 'strat:infusion_altar') return;
                
                // Find all pedestals in range (8 block radius)
                const pedestals = [];
                const range = 8;
                const center = altarBlock.location;
                
                // Search for pedestals in a square area
                for (let x = -range; x <= range; x++) {
                    for (let z = -range; z <= range; z++) {
                        // Skip the center position
                        if (x === 0 && z === 0) continue;
                        
                        // Calculate distance from center (using Manhattan distance for efficiency)
                        const distance = Math.abs(x) + Math.abs(z);
                        if (distance > range) continue; // Skip if too far
                        
                        const pos = {
                            x: center.x + x,
                            y: center.y,
                            z: center.z + z
                        };
                        
                        // Check for pedestal blocks
                        const blockAtPos = block.dimension.getBlock(pos);
                        if (blockAtPos && blockAtPos.typeId === 'strat:infusion_pedestal') {
                            // Find the entity associated with this pedestal
                            const entities = block.dimension.getEntities({
                                location: pos,
                                maxDistance: 1,
                                type: 'strat:infusion_pedestal_entity'
                            });
                            
                            for (const entity of entities) {
                                // Get the item on the pedestal if any
                                const item = entity.getComponent('minecraft:item')?.itemStack;
                                if (item) {
                                    pedestals.push({
                                        entity: entity,
                                        item: item,
                                        position: pos
                                    });
                                }
                            }
                        }
                    }
                }
                
                // If no pedestals with items found, show message and return
                if (pedestals.length === 0) {
                    player.onScreenDisplay.setActionBar('§cNo pedestals with items found');
                    return;
                }
                
                // Find the central altar entity
                const altarEntities = block.dimension.getEntities({
                    location: center,
                    maxDistance: 1,
                    type: 'strat:infusion_altar_entity'
                });
                
                if (altarEntities.length === 0) {
                    player.onScreenDisplay.setActionBar('§cAltar entity not found');
                    return;
                }
                
                const altarEntity = altarEntities[0];
                const centerItem = altarEntity.getComponent('minecraft:item')?.itemStack;
                
                if (!centerItem) {
                    player.onScreenDisplay.setActionBar('§cPlace an item on the altar first');
                    return;
                }
                
                // Check for valid recipe
                // This would normally check against infusion_recipes.js
                // For now, we'll just display the items found
                
                const itemList = pedestals.map(p => p.item.typeId);
                player.onScreenDisplay.setActionBar(`§aFound ${pedestals.length} items: ${itemList.join(', ')}`);
                
                // Visual effects
                block.dimension.spawnParticle('minecraft:enchanting_table_particle', center);
                block.dimension.playSound('random.levelup', center);
            },
            onTick: (data) => {
                // Optional: Add particle effects or other visual indicators
                const block = data.block;
                
                // Occasionally spawn particles
                if (Math.random() < 0.1) {
                    block.dimension.spawnParticle('minecraft:enchanting_table_particle', block.location);
                }
            }
        }
    },
    {
        id: "strat:pedestal_place",
        code: {
            onPlace: (data) => {
                // Spawn the pedestal entity when the block is placed
                const block = data.block;
                if (!block) return;
                
                // Spawn the entity slightly above the center of the block
                const spawnPos = {
                    x: block.center().x,
                    y: block.center().y + 0.49,
                    z: block.center().z
                };
                
                // Spawn the entity that will hold items
                block.dimension.spawnEntity('strat:infusion_pedestal_entity', spawnPos);
            },
            onPlayerInteract: (data) => {
                const { block, player, itemStack } = data;
                
                // Find the pedestal entity
                const entities = block.dimension.getEntities({
                    location: block.location,
                    maxDistance: 1,
                    type: 'strat:infusion_pedestal_entity'
                });
                
                if (entities.length === 0) {
                    // No entity found, create one
                    const spawnPos = {
                        x: block.center().x,
                        y: block.center().y + 0.49,
                        z: block.center().z
                    };
                    block.dimension.spawnEntity('strat:infusion_pedestal_entity', spawnPos);
                    return;
                }
                
                const pedestalEntity = entities[0];
                const itemComponent = pedestalEntity.getComponent('minecraft:item');
                
                if (!itemComponent) return;
                
                // If player is holding an item and pedestal is empty, place the item
                if (itemStack && !itemComponent.itemStack) {
                    // Clone the item to place on pedestal
                    const itemToPlace = itemStack.clone();
                    itemToPlace.amount = 1;
                    
                    // Set the item on the pedestal
                    itemComponent.itemStack = itemToPlace;
                    
                    // Decrement the player's item stack if not in creative mode
                    if (player.gameMode !== 'creative') {
                        const mainhand = player.getComponent('minecraft:equippable');
                        if (mainhand) {
                            if (itemStack.amount > 1) {
                                itemStack.amount -= 1;
                                mainhand.setEquipment('mainhand', itemStack);
                            } else {
                                mainhand.setEquipment('mainhand', undefined);
                            }
                        }
                    }
                    
                    // Play sound and particles
                    block.dimension.playSound('random.pop', block.location);
                    block.dimension.spawnParticle('minecraft:item_break_particle', block.center());
                    
                    return;
                }
                
                // If player is not holding an item and pedestal has an item, take the item
                if (!itemStack && itemComponent.itemStack) {
                    // Get the item from the pedestal
                    const itemToGive = itemComponent.itemStack;
                    
                    // Clear the pedestal
                    itemComponent.itemStack = undefined;
                    
                    // Give the item to the player
                    player.getComponent('minecraft:inventory').container.addItem(itemToGive);
                    
                    // Play sound and particles
                    block.dimension.playSound('random.pop', block.location);
                    block.dimension.spawnParticle('minecraft:item_break_particle', block.center());
                    
                    return;
                }
            },
            onBreak: (data) => {
                const block = data.block;
                
                // Find and remove the pedestal entity
                const entities = block.dimension.getEntities({
                    location: block.location,
                    maxDistance: 1,
                    type: 'strat:infusion_pedestal_entity'
                });
                
                for (const entity of entities) {
                    // Drop any item that was on the pedestal
                    const itemComponent = entity.getComponent('minecraft:item');
                    if (itemComponent && itemComponent.itemStack) {
                        block.dimension.spawnItem(itemComponent.itemStack, block.center());
                    }
                    
                    // Remove the entity
                    entity.remove();
                }
            }
        }
    },
    {
        id: "strat:none",
        code: {
            // Empty component for blocks that need a custom component reference but no behavior
        }
    },
    {
        id: "kai:on_player_destroy_slab",
        code: {
            onPlayerDestroy: (data) => {
                // This is a placeholder - the actual implementation is in kaioga5/slab/onPlayerDestroy.js
                // But we need to register it here to prevent warnings
            }
        }
    },
    {
        id: "kai:on_interact_slab",
        code: {
            onPlayerInteract: (data) => {
                // This is a placeholder - the actual implementation is in kaioga5/slab/onInteract.js
                // But we need to register it here to prevent warnings
            }
        }
    },
    {
        id: "template:stair_placement",
        code: {
            onPlace: (data) => {
                // This is a placeholder - the actual implementation is in stairPlacement.js
                // But we need to register it here to prevent warnings
            },
            onTick: (data) => {
                // This is a placeholder - the actual implementation is in stairPlacement.js
                // But we need to register it here to prevent warnings
            }
        }
    }
];

// Create a registry to track which components have been registered
let registeredComponents = new Set();

let reload = 0;
world.beforeEvents.worldInitialize.subscribe((data) => {
    //reload is needed to stop crashes
    reload = reload + 1;
    if (reload > 1) return;
    
    for (const comp of blockComponents) {
        // Only register if not already registered
        if (!registeredComponents.has(comp.id)) {
            //register the component
            data.blockComponentRegistry.registerCustomComponent(comp.id, comp.code);
            registeredComponents.add(comp.id);
            console.warn(`Registered component: ${comp.id}`);
        }
    }
});
