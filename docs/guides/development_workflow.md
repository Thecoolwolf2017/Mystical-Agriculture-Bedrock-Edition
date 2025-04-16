# Development Workflow Guide

## Avoiding Duplicate Block Definitions

When developing the Mystical Agriculture add-on, it's important to avoid duplicate block definitions that can cause errors in Minecraft. This commonly happens when both source files and build output files are loaded by Minecraft at the same time.

### Problem

If you see an error like this:
```
Duplicate block definition: strat:imperium_growth_accelerator
```

It means that Minecraft is finding the same block identifier defined in multiple locations, typically:
1. In your source files (BP/blocks/...)
2. In your build output files (builds/dev/...)

### Solution

To prevent this issue, we've added a `.mcignore` file to the project root that tells Minecraft to ignore the `builds/` directory when loading the add-on.

### Development Best Practices

1. **Source Files**: Make all your changes in the source files (BP/ and RP/ directories)
2. **Testing**: When testing in Minecraft, ensure you're only loading either:
   - The source files (for development)
   - The build output files (for final testing)
   - Never both at the same time

3. **Build Process**: Use the build process only to create distributable versions of the add-on, not for regular development testing

### Troubleshooting

If you continue to see duplicate definition errors:
1. Check that the `.mcignore` file exists in the project root and contains `builds/`
2. Verify that you haven't manually copied block definitions to multiple locations
3. Restart Minecraft completely to ensure it reloads the add-on properly
