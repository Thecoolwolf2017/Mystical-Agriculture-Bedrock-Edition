import { Block } from "@minecraft/server";

//set block wall tag here
const wallTag = 'wall:is_wall'

export class wall_Manager {
    static update_Wall_States(Wall) {
        let above = undefined;
        try {
            above = Wall.above(1);
        } catch { }
        let north = undefined;
        try {
            north = Wall.north(1);
        } catch { }
        let south = undefined;
        try {
            south = Wall.south(1);
        } catch { }
        let east = undefined;
        try {
            east = Wall.east(1);
        } catch { }
        let west = undefined;
        try {
            west = Wall.west(1);
        } catch { }
        const blocks = [
            { block: above, side: "up" },
            { block: north, side: "north" },
            { block: south, side: "south" },
            { block: east, side: "east" },
            { block: west, side: "west" },
        ];
        for (const blockData of blocks) {
            if (blockData.block != undefined) {
                if (!(blockData.block.isLiquid || blockData.block.isAir)) {
                    if (blockData.side != "up") {
                        Wall.setPermutation(Wall.permutation.withState("wall:connect_" + blockData.side, true));
                    } else {
                        Wall.setPermutation(Wall.permutation.withState("wall:top_bit", true));
                    }
                } else {
                    if (blockData.side != "up") {
                        Wall.setPermutation(Wall.permutation.withState("wall:connect_" + blockData.side, false));
                    } else {
                        Wall.setPermutation(Wall.permutation.withState("wall:top_bit", false));
                    }
                }
            } else {
                if (blockData.side != "up") {
                    Wall.setPermutation(Wall.permutation.withState("wall:connect_" + blockData.side, false));
                } else {
                    Wall.setPermutation(Wall.permutation.withState("wall:top_bit", false));
                }
            }
        }
        const north_state = Wall.permutation.getState("wall:connect_north");
        const south_state = Wall.permutation.getState("wall:connect_south");
        const east_state = Wall.permutation.getState("wall:connect_east");
        const west_state = Wall.permutation.getState("wall:connect_west");
        if (
            (north_state && south_state && !east_state && !west_state) ||
            (!north_state && !south_state && east_state && west_state)
        ) {
            Wall.setPermutation(Wall.permutation.withState("wall:slim", true));
            if (north_state && south_state) {
                Wall.setPermutation(Wall.permutation.withState("wall:slim_bit", "north_south"));
            } else {
                Wall.setPermutation(Wall.permutation.withState("wall:slim_bit", "east_west"));
            }
        } else Wall.setPermutation(Wall.permutation.withState("wall:slim", false));
    }
    static updateWallsAround(Block) {
        let above = undefined;
        try {
            above = Block.above(1);
        } catch { }
        let below = undefined;
        try {
            below = Block.below(1);
        } catch { }
        let north = undefined;
        try {
            north = Block.north(1);
        } catch { }
        let south = undefined;
        try {
            south = Block.south(1);
        } catch { }
        let east = undefined;
        try {
            east = Block.east(1);
        } catch { }
        let west = undefined;
        try {
            west = Block.west(1);
        } catch { }
        const blocks = [Block, above, below, north, south, east, west];
        for (const block of blocks) {
            if (block != undefined) {
                if (block.hasTag(wallTag)) this.update_Wall_States(block);
            }
        }
    }
}
