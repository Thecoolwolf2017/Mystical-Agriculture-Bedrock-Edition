import { EquipmentSlot, EntityEquippableComponent, GameMode, BlockTypes } from '@minecraft/server';
import { randomNum } from '../math/randomNumFunctions';
import { itemManager } from './itemManager';

export const cropBlocks = [];

export class cropManager {
    //tick data
    static tick(block) {
        // Instead of using BlockTypes.getAll() which requires additional privileges,
        // we'll define the crop blocks manually
        
        // Only initialize the crop blocks array once
        if (cropBlocks.length === 0) {
            // Tier 1 crops
            const tier1Crops = [
                'strat:air_crop',
                'strat:earth_crop',
                'strat:fire_crop',
                'strat:water_crop',
                'strat:inferium_crop',
                'strat:dirt_crop',
                'strat:stone_crop',
                'strat:wood_crop'
            ];
            
            // Tier 2 crops
            const tier2Crops = [
                'strat:nature_crop',
                'strat:ice_crop',
                'strat:nether_quartz_crop',
                'strat:coal_crop',
                'strat:copper_crop'
            ];
            
            // Tier 3 crops
            const tier3Crops = [
                'strat:iron_crop',
                'strat:gold_crop',
                'strat:lapis_lazuli_crop',
                'strat:redstone_crop',
                'strat:obsidian_crop'
            ];
            
            // Tier 4 crops
            const tier4Crops = [
                'strat:diamond_crop',
                'strat:emerald_crop',
                'strat:netherite_crop',
                'strat:glowstone_crop',
                'strat:experience_crop'
            ];
            
            // Tier 5 crops (mob drops)
            const tier5Crops = [
                'strat:zombie_crop',
                'strat:skeleton_crop',
                'strat:creeper_crop',
                'strat:spider_crop',
                'strat:slime_crop',
                'strat:enderman_crop'
            ];
            
            // Animal crops
            const animalCrops = [
                'strat:rabbit_crop',
                'strat:chicken_crop',
                'strat:cow_crop',
                'strat:pig_crop',
                'strat:sheep_crop',
                'strat:squid_crop',
                'strat:fish_crop'
            ];
            
            // All crops combined
            const allCrops = [...tier1Crops, ...tier2Crops, ...tier3Crops, ...tier4Crops, ...tier5Crops, ...animalCrops];
            
            // Add all crops to the cropBlocks array
            allCrops.forEach(cropId => {
                cropBlocks.push({
                    blockID: cropId,
                    stateID: 'strat:growth_stage', // Using the actual state name from the logs
                    maxStage: 7,
                    growChance: {
                        numerator: 1,
                        denominator: 3
                    },
                    bonemealable: true,
                    bonemeal_cancel: true
                });
            });
        }

        //get the crop data
        const data = cropBlocks.find((f) => f.blockID == block.typeId);
        if (data == undefined) return;
        //get the stage
        const stage = this.getGrowthStage(block, data);
        if (stage >= data.maxStage) return;
        //get the random number
        const num = randomNum(0, data.growChance.denominator);
        //return if the random number is more than the numerator
        if (num > data.growChance.numerator) return;
        //set the stage
        block.setPermutation(block.permutation.withState(data.stateID, stage + 1));
    }
    static interact(block, player) {
        // We don't need to initialize cropBlocks here since we already do it in the tick method
        // This avoids duplicate initialization and the BlockTypes.getAll() call that requires privileges

        //get the crop data
        const data = cropBlocks.find((f) => f.blockID == block.typeId);
        if (data == undefined) return;
        const mainhand = player.getComponent(EntityEquippableComponent.componentId).getEquipmentSlot(EquipmentSlot.Mainhand);
        const heldItem = mainhand.getItem();
        const stage = this.getGrowthStage(block, data);
        //try to use bone meal if the block isn't at its max stage
        if (stage >= data.maxStage) return;
        if (heldItem != undefined && stage != data.maxStage && heldItem.typeId == "minecraft:bone_meal" && data.bonemealable) {

            this.bonemeal(block, data, player, mainhand, heldItem, stage);
        }
    }
    //interact with bone meal
    static bonemeal(block, data, player, mainhand, heldItem, stage) {

        let setStage = stage + 3;
        if (setStage > data.maxStage) setStage = data.maxStage;

        try {
            block.dimension.spawnParticle("minecraft:crop_growth_emitter", block.center());
        } catch { }
        block.dimension.playSound("item.bone_meal.use", block.center());
        if (!data.bonemeal_cancel) block.setPermutation(block.permutation.withState(data.stateID, setStage));
        if (player.getGameMode() == GameMode.creative) return;
        mainhand.setItem(itemManager.reduceAmount(heldItem, 1));
    }
    static getGrowthStage(block, cropData) {
        //return the block's growth stage
        return block.permutation.getState(cropData.stateID);
    }
}