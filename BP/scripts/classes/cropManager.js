import { EquipmentSlot, EntityEquippableComponent, GameMode, BlockTypes } from '@minecraft/server';
import { randomNum } from '../math/randomNumFunctions';
import { itemManager } from './itemManager';

export const cropBlocks = [];

export class cropManager {
    //tick data
    static tick(block) {
        let allBlocks = BlockTypes.getAll();

        allBlocks.forEach(block => {
            if (block.id.startsWith("mysticalagriculture:") && block.id.includes("_crop")) {
                cropBlocks.push({
                    blockID: block.id,
                    stateID: `mysticalagriculture:growth`,
                    maxStage: 7,
                    growChance: {
                        numerator: 1,
                        denominator: 3
                    },
                    bonemealable: true,
                    bonemeal_cancel: true
                });
            }
        });

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
        let allBlocks = BlockTypes.getAll();

        allBlocks.forEach(block => {
            if (block.id.startsWith("mysticalagriculture:") && block.id.includes("_crop")) {
                cropBlocks.push({
                    blockID: block.id,
                    stateID: `mysticalagriculture:growth`,
                    maxStage: 7,
                    growChance: {
                        numerator: 1,
                        denominator: 3
                    },
                    bonemealable: true,
                    bonemeal_cancel: true
                });
            }
        });

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