# Texture References in Mystical Agriculture

## Namespace and Texture Naming Convention

In the Mystical Agriculture Bedrock Edition mod, we follow these naming conventions:

1. **Block and Item Identifiers**: Use the `strat:` namespace
   - Example: `strat:copper_crop`, `strat:inferium_farmland`

2. **Block States**: Use the `strat:` namespace with descriptive names
   - Example: `strat:growth_stage` (replacing the old `mysticalagriculture:growth`)

3. **Custom Components**: Use the `strat:` namespace
   - Example: `strat:crop_controller` (replacing the old `mysticalagriculture:custom_crop`)

4. **Texture References**: Continue to use the original `mystical_` prefix
   - Example: `mystical_resource_crop_0`, `mystical_resource_crop_1`, etc.

## Important Note on Texture References

When updating crop files or other blocks, ensure that texture references maintain the original `mystical_` prefix. The actual texture files and their entries in `terrain_texture.json` still use this prefix.

If you change a texture reference to use the `strat_` prefix (e.g., `strat_resource_crop_0`), you'll encounter this error:

```
Texture reference "strat_resource_crop_0" was not defined in terrain_texture.json
```

## Future Texture Updates

If we decide to rename the textures in the future, we'll need to:

1. Update the texture references in all block files
2. Add entries for the new texture names in the terrain_texture.json file
3. Rename the actual texture files in the resource pack

Until then, maintain the original `mystical_` prefix for all texture references.
