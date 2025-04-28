// Direct component registration script for Mystical Agriculture
import { world, system } from '@minecraft/server';
import { cropManager } from './classes/cropManager';
import { handleOreXpDrop } from './utils/oreUtils';

// This script directly registers all custom components to fix the warnings

// Try to use system.beforeEvents.startup (v2.0.0 API) if available
if (system && system.beforeEvents && system.beforeEvents.startup) {
    console.log('[MYSTICAL AGRICULTURE] Using system.beforeEvents.startup for component registration');
    system.beforeEvents.startup.subscribe(event => {
        console.log('[MYSTICAL AGRICULTURE] Registering all custom components...');
        
        try {
            // Register farmland_controller
            event.blockComponentRegistry.registerCustomComponent("strat:farmland_controller", {
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
                    if (Math.random() < growthChance) {
                        // Trigger growth on the crop above
                        if (blockAbove.typeId.startsWith('strat:') && blockAbove.hasTag('crop')) {
                            // Get current growth state
                            const state = blockAbove.permutation.getAllStates();
                            if (state['strat:growth'] !== undefined && state['strat:growth'] < 7) {
                                // Increment growth state
                                state['strat:growth'] = Math.min(state['strat:growth'] + 1, 7);
                                blockAbove.setPermutation(blockAbove.permutation.withState('strat:growth', state['strat:growth']));
                                
                                // Spawn growth particles
                                blockAbove.dimension.spawnParticle('minecraft:crop_growth_emitter', blockAbove.center());
                            }
                        }
                    }
                }
            });
            console.log('[MYSTICAL AGRICULTURE] Registered strat:farmland_controller');
            
            // Register kai:on_player_destroy_slab
            event.blockComponentRegistry.registerCustomComponent("kai:on_player_destroy_slab", {
                onPlayerDestroy: (data) => {
                    console.log("Slab destroyed");
                }
            });
            console.log('[MYSTICAL AGRICULTURE] Registered kai:on_player_destroy_slab');
            
            // Register strat:custom_crop
            event.blockComponentRegistry.registerCustomComponent("strat:custom_crop", {
                onPlayerInteract: (data) => {
                    cropManager.interact(data.block, data.player);
                },
                onRandomTick: (data) => {
                    cropManager.tick(data.block);
                }
            });
            console.log('[MYSTICAL AGRICULTURE] Registered strat:custom_crop');
            
            // Register kai:on_interact_slab
            event.blockComponentRegistry.registerCustomComponent("kai:on_interact_slab", {
                onPlayerInteract: (data) => {
                    console.log("Slab interacted with");
                }
            });
            console.log('[MYSTICAL AGRICULTURE] Registered kai:on_interact_slab');
            
            // Register strat:none
            event.blockComponentRegistry.registerCustomComponent("strat:none", {
                onTick: (data) => {
                    // Empty implementation
                }
            });
            console.log('[MYSTICAL AGRICULTURE] Registered strat:none');
            
            // Register strat:crop_controller
            event.blockComponentRegistry.registerCustomComponent("strat:crop_controller", {
                onPlayerInteract: (data) => {
                    cropManager.interact(data.block, data.player);
                },
                onRandomTick: (data) => {
                    cropManager.tick(data.block);
                }
            });
            console.log('[MYSTICAL AGRICULTURE] Registered strat:crop_controller');
            
            // Register strat:ore_xp
            // Note: The main XP functionality is now handled by the global event handler in oreUtils.js
            // This component is kept for backward compatibility
            event.blockComponentRegistry.registerCustomComponent("strat:ore_xp", {
                onPlayerDestroy: (data) => {
                    // Call the simplified compatibility handler
                    handleOreXpDrop(data);
                }
            });
            console.log('[MYSTICAL AGRICULTURE] Registered strat:ore_xp');
            
            // Register strat:altar_check
            event.blockComponentRegistry.registerCustomComponent("strat:altar_check", {
                onPlayerInteract: (data) => {
                    console.log("Altar checked");
                },
                onTick: (data) => {
                    // Empty implementation
                }
            });
            console.log('[MYSTICAL AGRICULTURE] Registered strat:altar_check');
            
            // Register template:stair_placement
            event.blockComponentRegistry.registerCustomComponent("template:stair_placement", {
                onPlace: (data) => {
                    console.log("Stair placed");
                }
            });
            console.log('[MYSTICAL AGRICULTURE] Registered template:stair_placement');
            
            // Register strat:pedestal_place
            event.blockComponentRegistry.registerCustomComponent("strat:pedestal_place", {
                onPlace: (data) => {
                    console.log("Pedestal placed");
                },
                onPlayerInteract: (data) => {
                    console.log("Pedestal interacted with");
                }
            });
            console.log('[MYSTICAL AGRICULTURE] Registered strat:pedestal_place');
            
            console.log('[MYSTICAL AGRICULTURE] All components registered successfully!');
        } catch (error) {
            console.error('[MYSTICAL AGRICULTURE] Error registering components:', error);
        }
    });
} else if (world.beforeEvents && world.beforeEvents.worldInitialize) {
    console.log('[MYSTICAL AGRICULTURE] Using beforeEvents.worldInitialize for component registration');
    world.beforeEvents.worldInitialize.subscribe(event => {
        console.log('[MYSTICAL AGRICULTURE] Registering all custom components...');
        
        try {
            // Register farmland_controller
            event.blockComponentRegistry.registerCustomComponent("strat:farmland_controller", {
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
                    if (Math.random() < growthChance) {
                        // Trigger growth on the crop above
                        if (blockAbove.typeId.startsWith('strat:') && blockAbove.hasTag('crop')) {
                            // Get current growth state
                            const state = blockAbove.permutation.getAllStates();
                            if (state['strat:growth'] !== undefined && state['strat:growth'] < 7) {
                                // Increment growth state
                                state['strat:growth'] = Math.min(state['strat:growth'] + 1, 7);
                                blockAbove.setPermutation(blockAbove.permutation.withState('strat:growth', state['strat:growth']));
                                
                                // Spawn growth particles
                                blockAbove.dimension.spawnParticle('minecraft:crop_growth_emitter', blockAbove.center());
                            }
                        }
                    }
                }
            });
            console.log('[MYSTICAL AGRICULTURE] Registered strat:farmland_controller');
            
            // Register kai:on_player_destroy_slab
            event.blockComponentRegistry.registerCustomComponent("kai:on_player_destroy_slab", {
                onPlayerDestroy: (data) => {
                    console.log("Slab destroyed");
                }
            });
            console.log('[MYSTICAL AGRICULTURE] Registered kai:on_player_destroy_slab');
            
            // Register strat:custom_crop
            event.blockComponentRegistry.registerCustomComponent("strat:custom_crop", {
                onPlayerInteract: (data) => {
                    cropManager.interact(data.block, data.player);
                },
                onRandomTick: (data) => {
                    cropManager.tick(data.block);
                }
            });
            console.log('[MYSTICAL AGRICULTURE] Registered strat:custom_crop');
            
            // Register kai:on_interact_slab
            event.blockComponentRegistry.registerCustomComponent("kai:on_interact_slab", {
                onPlayerInteract: (data) => {
                    console.log("Slab interacted with");
                }
            });
            console.log('[MYSTICAL AGRICULTURE] Registered kai:on_interact_slab');
            
            // Register strat:none
            event.blockComponentRegistry.registerCustomComponent("strat:none", {
                onTick: (data) => {
                    // Empty implementation
                }
            });
            console.log('[MYSTICAL AGRICULTURE] Registered strat:none');
            
            // Register strat:crop_controller
            event.blockComponentRegistry.registerCustomComponent("strat:crop_controller", {
                onPlayerInteract: (data) => {
                    cropManager.interact(data.block, data.player);
                },
                onRandomTick: (data) => {
                    cropManager.tick(data.block);
                }
            });
            console.log('[MYSTICAL AGRICULTURE] Registered strat:crop_controller');
            
            // Register strat:ore_xp
            // Note: The main XP functionality is now handled by the global event handler in oreUtils.js
            // This component is kept for backward compatibility
            event.blockComponentRegistry.registerCustomComponent("strat:ore_xp", {
                onPlayerDestroy: (data) => {
                    // Call the simplified compatibility handler
                    handleOreXpDrop(data);
                }
            });
            console.log('[MYSTICAL AGRICULTURE] Registered strat:ore_xp');
            
            // Register strat:altar_check
            event.blockComponentRegistry.registerCustomComponent("strat:altar_check", {
                onPlayerInteract: (data) => {
                    console.log("Altar checked");
                },
                onTick: (data) => {
                    // Empty implementation
                }
            });
            console.log('[MYSTICAL AGRICULTURE] Registered strat:altar_check');
            
            // Register template:stair_placement
            event.blockComponentRegistry.registerCustomComponent("template:stair_placement", {
                onPlace: (data) => {
                    console.log("Stair placed");
                }
            });
            console.log('[MYSTICAL AGRICULTURE] Registered template:stair_placement');
            
            // Register strat:pedestal_place
            event.blockComponentRegistry.registerCustomComponent("strat:pedestal_place", {
                onPlace: (data) => {
                    console.log("Pedestal placed");
                },
                onPlayerInteract: (data) => {
                    console.log("Pedestal interacted with");
                }
            });
            console.log('[MYSTICAL AGRICULTURE] Registered strat:pedestal_place');
            
            console.log('[MYSTICAL AGRICULTURE] All components registered successfully!');
        } catch (error) {
            console.error('[MYSTICAL AGRICULTURE] Error registering components:', error);
        }
    });
} else if (world.afterEvents && world.afterEvents.worldLoad) {
    // Fallback to v2.0.0 API or alternative approach
    console.log('[MYSTICAL AGRICULTURE] Using afterEvents.worldLoad for component registration');
    world.afterEvents.worldLoad.subscribe(() => {
        console.log('[MYSTICAL AGRICULTURE] World loaded, but worldInitialize event was not available');
        console.log('[MYSTICAL AGRICULTURE] Components could not be registered');
        console.log('[MYSTICAL AGRICULTURE] This is likely due to an API version mismatch');
        console.log('[MYSTICAL AGRICULTURE] Please check your Minecraft version and update the script accordingly');
    });
} else {
    // Last resort fallback
    console.error('[MYSTICAL AGRICULTURE] No suitable event found for component registration');
    console.error('[MYSTICAL AGRICULTURE] Components will not be registered');
    console.error('[MYSTICAL AGRICULTURE] This may cause warnings and some features may not work properly');
}
