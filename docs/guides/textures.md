# Texture Management in Mystical Agriculture

This guide explains how textures are organized and referenced in the Mystical Agriculture Bedrock Edition mod.

## Texture Registration

All block textures must be registered in the `RP/textures/terrain_texture.json` file. This file maps texture names to actual image files in your resource pack.

Example entry in terrain_texture.json:
```json
"mystical_air_crop_7": {
  "textures": [
    "textures/blocks/crops/mystical_air_crop_7"
  ]
}
```

## Crop Texture Conventions

Mystical Agriculture uses a specific naming convention for crop textures:

1. **Growth Stages 0-6**: All crops use generic textures for their first 7 growth stages
   - `mystical_resource_crop_0` through `mystical_resource_crop_6`

2. **Growth Stage 7 (Final)**: Each crop uses a specific texture for its final growth stage
   - Element crops: `mystical_air_crop_7`, `mystical_fire_crop_7`, etc.
   - Resource crops: `mystical_iron_crop_7`, `mystical_gold_crop_7`, etc.
   - Mob crops: `mystical_zombie_crop_7`, `mystical_creeper_crop_7`, etc.

## Block Definition References

When referencing textures in block definitions, the name must exactly match what's defined in terrain_texture.json:

```json
"components": {
  "minecraft:material_instances": {
    "*": {
      "texture": "mystical_resource_crop_0",
      "render_method": "alpha_test"
    }
  }
}
```

## Common Texture Patterns

- **Resource Crops**: Use `mystical_resource_crop_[0-6]` for growth stages, `mystical_[resource]_crop_7` for final stage
- **Mob Crops**: Use `mystical_mob_crop_[0-6]` for growth stages, `mystical_[mob]_crop_7` for final stage
- **Element Crops**: Use `mystical_resource_crop_[0-6]` for growth stages, `mystical_[element]_crop_7` for final stage

## Troubleshooting

If you encounter a "Texture reference not defined in terrain_texture.json" error:

1. Check that the texture name in your block definition exactly matches an entry in terrain_texture.json
2. Verify that the texture file exists in the correct location (usually `RP/textures/blocks/crops/`)
3. Make sure the terrain_texture.json entry points to the correct file path

Remember that texture names are case-sensitive and must match exactly.
