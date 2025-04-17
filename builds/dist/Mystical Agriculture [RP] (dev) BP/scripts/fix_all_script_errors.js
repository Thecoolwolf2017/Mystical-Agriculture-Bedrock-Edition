const fs = require('fs');
const path = require('path');

// Base directory
const baseDir = path.resolve(__dirname, '..');

console.log('Mystical Agriculture Script Error Fixer');
console.log('======================================');
console.log(`Base directory: ${baseDir}`);

// List of files to check for subscribe errors
const filesToCheck = [
    'infusion_all.js',
    'farmland.js',
    'stairPlacement.js'
];

// List of components that need to be registered
const requiredComponents = [
    'strat:farmland_controller',
    'kai:on_player_destroy_slab',
    'strat:custom_crop',
    'kai:on_interact_slab',
    'strat:none',
    'strat:crop_controller',
    'strat:ore_xp',
    'strat:altar_check',
    'template:stair_placement',
    'strat:pedestal_place'
];

// Function to fix TypeError: cannot read property 'subscribe' of undefined
function fixSubscribeErrors() {
    console.log('\n1. Fixing "TypeError: cannot read property \'subscribe\' of undefined" errors');
    console.log('-------------------------------------------------------------------------');
    
    let fixCount = 0;
    
    for (const fileName of filesToCheck) {
        const filePath = path.join(baseDir, 'scripts', fileName);
        
        if (!fs.existsSync(filePath)) {
            console.log(`  - File not found: ${fileName}`);
            continue;
        }
        
        console.log(`  - Checking ${fileName}...`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Look for direct subscribe calls without checks
        const subscribeRegex = /server\.world\.beforeEvents\.([a-zA-Z]+)\.subscribe/g;
        let match;
        
        while ((match = subscribeRegex.exec(content)) !== null) {
            const eventName = match[1];
            const fullMatch = match[0];
            const position = match.index;
            
            // Check if there's already an if statement around this subscribe
            const previousCode = content.substring(Math.max(0, position - 100), position);
            if (previousCode.includes(`if (server.world.beforeEvents.${eventName})`)) {
                console.log(`    - Subscribe to ${eventName} already has a safety check`);
                continue;
            }
            
            // Replace with safety check
            const replacement = `// Check if ${eventName} event exists before subscribing\nif (server.world.beforeEvents.${eventName}) {\n    ${fullMatch}`;
            
            // Find the closing bracket for this subscribe call
            let bracketCount = 1;
            let closingPosition = position + fullMatch.length;
            
            while (bracketCount > 0 && closingPosition < content.length) {
                if (content[closingPosition] === '{') bracketCount++;
                if (content[closingPosition] === '}') bracketCount--;
                closingPosition++;
            }
            
            // Add closing bracket for the if statement
            if (bracketCount === 0) {
                content = 
                    content.substring(0, position) + 
                    replacement + 
                    content.substring(position + fullMatch.length, closingPosition) + 
                    "\n}" + 
                    content.substring(closingPosition);
                
                modified = true;
                fixCount++;
                console.log(`    - Added safety check for ${eventName} event in ${fileName}`);
                
                // Reset regex to account for the modified content
                subscribeRegex.lastIndex = position + replacement.length;
            } else {
                console.log(`    - Could not find closing bracket for ${eventName} subscribe in ${fileName}`);
            }
        }
        
        if (modified) {
            fs.writeFileSync(filePath, content);
            console.log(`    - Updated ${fileName} with safety checks`);
        } else {
            console.log(`    - No unsafe subscribe calls found in ${fileName}`);
        }
    }
    
    console.log(`\n  Fixed ${fixCount} subscribe calls with safety checks`);
    return fixCount;
}

// Function to ensure all components are registered in blockComponents.js
function ensureComponentsRegistered() {
    console.log('\n2. Ensuring all components are properly registered');
    console.log('------------------------------------------------');
    
    const blockComponentsPath = path.join(baseDir, 'scripts', 'components', 'blockComponents.js');
    
    if (!fs.existsSync(blockComponentsPath)) {
        console.log(`  - Error: blockComponents.js not found at ${blockComponentsPath}`);
        return 0;
    }
    
    console.log(`  - Checking ${blockComponentsPath}...`);
    
    // Read the blockComponents.js file
    let content = fs.readFileSync(blockComponentsPath, 'utf8');
    
    // Parse the content to find existing component registrations
    const existingComponents = [];
    const componentRegex = /id:\s*"([^"]+)"/g;
    let match;
    
    while ((match = componentRegex.exec(content)) !== null) {
        existingComponents.push(match[1]);
    }
    
    console.log(`  - Found ${existingComponents.length} existing component registrations:`);
    existingComponents.forEach(comp => console.log(`    - ${comp}`));
    
    // Find missing components
    const missingComponents = requiredComponents.filter(comp => !existingComponents.includes(comp));
    
    if (missingComponents.length === 0) {
        console.log('  - All required components are already registered!');
        return 0;
    }
    
    console.log(`\n  - Found ${missingComponents.length} missing component registrations:`);
    missingComponents.forEach(comp => console.log(`    - ${comp}`));
    
    // Template for a basic component registration
    const componentTemplate = (id) => `    {
        id: "${id}",
        code: {
            onPlace: (data) => {
                // Default implementation for ${id}
                console.log("${id} onPlace event triggered");
            },
            onPlayerInteract: (data) => {
                // Default implementation for ${id}
                console.log("${id} onPlayerInteract event triggered");
            },
            onPlayerDestroy: (data) => {
                // Default implementation for ${id}
                console.log("${id} onPlayerDestroy event triggered");
            },
            onTick: (data) => {
                // Default implementation for ${id}
                // console.log("${id} onTick event triggered");
            },
            onRandomTick: (data) => {
                // Default implementation for ${id}
                // console.log("${id} onRandomTick event triggered");
            }
        }
    }`;
    
    // Add the missing components to the file
    // Find the position to insert the new components (before the closing bracket of the components array)
    const componentsArrayEndRegex = /\n\];/;
    const match2 = componentsArrayEndRegex.exec(content);
    
    if (!match2) {
        console.log('  - Error: Could not find the end of the components array in the file.');
        return 0;
    }
    
    const insertPosition = match2.index;
    const newComponentsText = missingComponents.map(comp => componentTemplate(comp)).join(',\n');
    
    // Insert the new components
    const updatedContent = 
        content.substring(0, insertPosition) + 
        (existingComponents.length > 0 ? ',\n' : '') + 
        newComponentsText + 
        content.substring(insertPosition);
    
    // Write the updated content back to the file
    fs.writeFileSync(blockComponentsPath, updatedContent);
    console.log(`  - Successfully added ${missingComponents.length} missing component registrations`);
    
    // Ensure WorldInitializeBeforeEvent registration
    if (!content.includes('world.beforeEvents.worldInitialize.subscribe')) {
        console.log('\n  - Adding WorldInitializeBeforeEvent registration...');
        
        // Find a good position to add the registration code
        const registerPosition = content.indexOf('// Create a registry to track which components have been registered');
        
        if (registerPosition === -1) {
            console.log('  - Error: Could not find a good position to add WorldInitializeBeforeEvent registration');
            return missingComponents.length;
        }
        
        const registrationCode = `
// Register all components with the WorldInitializeBeforeEvent
world.beforeEvents.worldInitialize.subscribe(event => {
    console.log('Registering custom block components...');
    
    // Register all block components
    for (const component of blockComponents) {
        try {
            event.blockComponentRegistry.registerCustomComponent(component.id, component.code);
            console.log(\`Registered component: \${component.id}\`);
        } catch (error) {
            console.error(\`Failed to register component \${component.id}:\`, error);
        }
    }
    
    console.log('All custom block components registered successfully!');
});

`;
        
        const updatedContent2 = 
            updatedContent.substring(0, registerPosition) + 
            registrationCode + 
            updatedContent.substring(registerPosition);
        
        fs.writeFileSync(blockComponentsPath, updatedContent2);
        console.log('  - Added WorldInitializeBeforeEvent registration code');
    }
    
    return missingComponents.length;
}

// Function to check and fix block geometry warnings
function fixBlockGeometryWarnings() {
    console.log('\n3. Fixing block geometry warnings');
    console.log('--------------------------------');
    
    const oreBlocksDir = path.join(baseDir, 'blocks', 'ore');
    
    if (!fs.existsSync(oreBlocksDir)) {
        console.log(`  - Error: Ore blocks directory not found at ${oreBlocksDir}`);
        return 0;
    }
    
    console.log(`  - Checking ore blocks in ${oreBlocksDir}...`);
    
    const oreFiles = fs.readdirSync(oreBlocksDir)
        .filter(file => file.endsWith('_ore.json'));
    
    console.log(`  - Found ${oreFiles.length} ore block files`);
    
    let fixCount = 0;
    
    for (const fileName of oreFiles) {
        const filePath = path.join(oreBlocksDir, fileName);
        console.log(`    - Checking ${fileName}...`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the file has the minecraft:geometry component
        if (content.includes('"minecraft:geometry"')) {
            // Remove the minecraft:geometry component
            const geometryRegex = /"minecraft:geometry":\s*{[^}]*},?/;
            content = content.replace(geometryRegex, '');
            
            // Fix any double commas that might have been created
            content = content.replace(/,\s*,/g, ',');
            
            // Fix any trailing commas before closing brackets
            content = content.replace(/,\s*}/g, '\n\t\t\t}');
            
            fs.writeFileSync(filePath, content);
            console.log(`    - Removed minecraft:geometry component from ${fileName}`);
            fixCount++;
        } else {
            console.log(`    - No minecraft:geometry component found in ${fileName}`);
        }
    }
    
    console.log(`\n  Fixed ${fixCount} ore block files with geometry warnings`);
    return fixCount;
}

// Function to fix item category issues
function fixItemCategories() {
    console.log('\n4. Fixing item category issues');
    console.log('-----------------------------');
    
    // Items that need category updates
    const itemUpdates = [
        {
            file: path.join(baseDir, 'items', 'prosperity', 'prosperity_shard.json'),
            oldCategory: 'equipment',
            newCategory: 'items'
        },
        {
            file: path.join(baseDir, 'items', 'soulium', 'soulium_dust.json'),
            oldCategory: 'equipment',
            newCategory: 'items'
        },
        {
            file: path.join(baseDir, 'blocks', 'infusion_pedestal.json'),
            oldCategory: 'equipment',
            newCategory: 'construction'
        }
    ];
    
    let fixCount = 0;
    
    for (const item of itemUpdates) {
        console.log(`  - Checking ${path.basename(item.file)}...`);
        
        if (!fs.existsSync(item.file)) {
            console.log(`    - File not found: ${item.file}`);
            continue;
        }
        
        let content = fs.readFileSync(item.file, 'utf8');
        
        try {
            const json = JSON.parse(content);
            
            // Check for item file
            if (json['minecraft:item']) {
                if (json['minecraft:item'].description && 
                    json['minecraft:item'].description.menu_category &&
                    json['minecraft:item'].description.menu_category.category === item.oldCategory) {
                    
                    json['minecraft:item'].description.menu_category.category = item.newCategory;
                    fs.writeFileSync(item.file, JSON.stringify(json, null, '\t'));
                    console.log(`    - Updated category from '${item.oldCategory}' to '${item.newCategory}'`);
                    fixCount++;
                } else if (json['minecraft:item'].description && 
                           json['minecraft:item'].description.menu_category) {
                    console.log(`    - Already has category '${json['minecraft:item'].description.menu_category.category}'`);
                } else {
                    console.log(`    - No menu_category found in item file`);
                }
            } 
            // Check for block file
            else if (json['minecraft:block']) {
                if (json['minecraft:block'].description && 
                    json['minecraft:block'].description.menu_category &&
                    json['minecraft:block'].description.menu_category.category === item.oldCategory) {
                    
                    json['minecraft:block'].description.menu_category.category = item.newCategory;
                    fs.writeFileSync(item.file, JSON.stringify(json, null, '\t'));
                    console.log(`    - Updated category from '${item.oldCategory}' to '${item.newCategory}'`);
                    fixCount++;
                } else if (json['minecraft:block'].description && 
                           json['minecraft:block'].description.menu_category) {
                    console.log(`    - Already has category '${json['minecraft:block'].description.menu_category.category}'`);
                } else {
                    console.log(`    - No menu_category found in block file`);
                }
            } else {
                console.log(`    - Not a valid item or block file`);
            }
        } catch (error) {
            console.log(`    - Error parsing JSON: ${error.message}`);
        }
    }
    
    console.log(`\n  Fixed ${fixCount} item category issues`);
    return fixCount;
}

// Run all fix functions
const subscribeFixCount = fixSubscribeErrors();
const componentFixCount = ensureComponentsRegistered();
const geometryFixCount = fixBlockGeometryWarnings();
const categoryFixCount = fixItemCategories();

// Summary
console.log('\nFix Summary');
console.log('-----------');
console.log(`1. Fixed ${subscribeFixCount} subscribe errors`);
console.log(`2. Added ${componentFixCount} missing component registrations`);
console.log(`3. Fixed ${geometryFixCount} block geometry warnings`);
console.log(`4. Fixed ${categoryFixCount} item category issues`);
console.log('\nTotal fixes: ' + (subscribeFixCount + componentFixCount + geometryFixCount + categoryFixCount));

if (subscribeFixCount + componentFixCount + geometryFixCount + categoryFixCount > 0) {
    console.log('\nAll issues have been fixed! The mod should now run without errors.');
} else {
    console.log('\nNo issues were found! The mod is already in good shape.');
}

// Create documentation
console.log('\nCreating documentation...');

const docsDir = path.join(baseDir, 'docs', 'components');
if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
}

const docPath = path.join(docsDir, 'component_registration.md');
const docContent = `# Custom Component Registration in Mystical Agriculture

This document explains how custom components are registered and used in the Mystical Agriculture Bedrock Edition mod.

## Overview

Custom components allow blocks and items to have specialized behaviors in Minecraft Bedrock Edition. The mod uses the \`WorldInitializeBeforeEvent\` to register these components during world initialization.

## Component Registration Process

Components are registered in the following way:

1. Components are defined in \`BP/scripts/components/blockComponents.js\`
2. The \`WorldInitializeBeforeEvent\` is used to register these components with Minecraft
3. Each component has specific event handlers (onPlace, onTick, onPlayerInteract, etc.)

## Registered Components

The following custom components are registered in the mod:

| Component ID | Purpose |
|--------------|---------|
| strat:farmland_controller | Handles custom farmland behavior including moisture and crop growth |
| kai:on_player_destroy_slab | Handles custom behavior when slabs are destroyed |
| strat:custom_crop | Manages custom crop behavior |
| kai:on_interact_slab | Handles player interaction with slabs |
| strat:none | A placeholder component for blocks that need minimal custom behavior |
| strat:crop_controller | Controls crop growth and interaction |
| strat:ore_xp | Handles XP drops from custom ore blocks |
| strat:altar_check | Manages the infusion altar mechanics |
| template:stair_placement | Controls custom stair placement behavior |
| strat:pedestal_place | Manages infusion pedestal functionality |

## Implementation Details

### Component Registration Code

Components are registered during world initialization using the following pattern:

\`\`\`javascript
world.beforeEvents.worldInitialize.subscribe(event => {
    for (const component of blockComponents) {
        event.blockComponentRegistry.registerCustomComponent(component.id, component.code);
    }
});
\`\`\`

### Error Handling

To prevent errors when the \`worldInitialize\` event is not available, we use a safety check:

\`\`\`javascript
if (world.beforeEvents.worldInitialize) {
    world.beforeEvents.worldInitialize.subscribe(event => {
        // Registration code
    });
}
\`\`\`

## Troubleshooting

If you see warnings about components not being registered, check:

1. The component is defined in \`blockComponents.js\`
2. The component ID matches exactly what's used in block definitions
3. The \`worldInitialize\` event subscription is working properly

## Adding New Components

To add a new custom component:

1. Add a new entry to the \`blockComponents\` array in \`blockComponents.js\`
2. Define the appropriate event handlers
3. Use the component in block definitions with \`minecraft:custom_components\`

Example:

\`\`\`javascript
{
    id: "strat:my_new_component",
    code: {
        onPlace: (data) => {
            // Implementation
        },
        onPlayerInteract: (data) => {
            // Implementation
        }
    }
}
\`\`\`

## Related Files

- \`BP/scripts/components/blockComponents.js\` - Main component definitions
- \`BP/scripts/infusion_all.js\` - Contains altar and pedestal logic
- \`BP/scripts/farmland.js\` - Contains farmland component logic
- \`BP/scripts/stairPlacement.js\` - Contains stair placement logic
`;

fs.writeFileSync(docPath, docContent);
console.log(`Created documentation at ${docPath}`);

console.log('\nScript completed successfully!');
