# Block Texture Troubleshooting Guide
**Last Updated: April 28, 2025**

## Common Block Texture Issues

This document outlines common issues related to block textures in the Mystical Agriculture Bedrock Edition mod, along with detailed troubleshooting steps and solutions.

## Missing or Incorrect Block Textures

If a block is displaying as purple/black checkerboard or has an incorrect texture, follow this troubleshooting checklist:

### 1. Check the Resource Pack Configuration

#### Blocks.json Configuration

The `blocks.json` file in the resource pack is critical for properly rendering block textures. Each custom block must have an entry in this file.

**Example format:**
```json
"strat:block_name": {
    "sound": "appropriate_sound",
    "textures": "texture_name"
}
```

**Common Issues:**
- Missing entry for a block
- Incorrect texture reference
- Incorrect sound reference

**Real-world example:**
The deepslate_inferium_ore block was missing from blocks.json, causing it to not display correctly. The fix was adding:
```json
"strat:deepslate_inferium_ore": {
    "sound": "deepslate",
    "textures": "deepslate_inferium_ore"
}
```

### 2. Verify Texture References in terrain_texture.json

The `terrain_texture.json` file maps block texture names to actual texture file paths.

**Example format:**
```json
"texture_name": {
    "textures": [
        "textures/blocks/path/to/texture"
    ]
}
```

**Common Issues:**
- Missing texture entry
- Incorrect path to texture file
- Duplicate entries causing conflicts

### 3. Check Block Definitions in Behavior Pack

Block definitions in the behavior pack must correctly reference the texture:

**Example format:**
```json
"minecraft:material_instances": {
    "*": {
        "texture": "texture_name",
        "render_method": "opaque"
    }
}
```

**Common Issues:**
- Incorrect texture name reference
- Missing render_method
- Missing or incorrect material instances component

### 4. Verify Creative Menu Configuration

For blocks not appearing in the creative menu, check:

```json
"description": {
    "identifier": "strat:block_name",
    "menu_category": {
        "category": "construction",
        "group": "itemGroup.name.ore"
    }
}
```

**Common Issues:**
- Missing menu_category
- Incorrect category or group
- Incorrect identifier format

### 5. Confirm Texture File Exists

Ensure the actual texture file exists in the correct path:
- Common path format: `RP/textures/blocks/folder/texture_name.png`
- Check file name case sensitivity
- Confirm image dimensions (typically 16x16 pixels)

## Texture Reference Flow

Understanding how textures are referenced is crucial:

1. **Block Definition** → References texture name in `minecraft:material_instances`
2. **blocks.json** → Maps block ID to texture name
3. **terrain_texture.json** → Maps texture name to actual file path
4. **Texture File** → The actual PNG file

## Case Study: Deepslate Inferium Ore Fix

The deepslate_inferium_ore block wasn't displaying correctly due to:
1. A missing entry in `blocks.json`
2. This prevented the texture from being properly recognized

The solution involved:
1. Adding the missing block entry to `blocks.json`
2. Ensuring proper creative menu categorization
3. Adding a display name for better identification

## Testing Your Fixes

After making changes:
1. Reload resource packs or restart Minecraft
2. Check the block appearance in creative inventory
3. Place the block to verify its texture
4. Break the block to confirm sound effects

## Additional Resource Pack Requirements

For blocks to display correctly, ensure:
1. Valid manifest.json with proper UUIDs
2. Correct folder structure following Bedrock Edition conventions
3. Proper file naming and case sensitivity
