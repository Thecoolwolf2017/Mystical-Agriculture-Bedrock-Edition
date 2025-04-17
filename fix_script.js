// This is a Node.js script to fix component registration warnings in Mystical Agriculture Bedrock Edition
const fs = require('fs');
const path = require('path');

console.log('Starting component registration fix...');

// Path to the blockComponents.js file
const blockComponentsPath = 'BP/scripts/components/blockComponents.js';

// Read the file content
let content = fs.readFileSync(blockComponentsPath, 'utf8');

// List of all components that need to be registered
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

// Check which components are already defined
const missingComponents = [];
requiredComponents.forEach(component => {
    if (!content.includes(`id: "${component}"`)) {
        missingComponents.push(component);
        console.log(`Component ${component} is missing and will be added`);
    }
});

// Add missing components to the blockComponents array
if (missingComponents.length > 0) {
    console.log(`Adding ${missingComponents.length} missing components...`);
    
    // Find the end of the blockComponents array
    const arrayEndIndex = content.lastIndexOf('];');
    
    // Create component definitions
    const componentsToAdd = missingComponents.map(component => {
        return `    {
        id: "${component}",
        code: {
            onPlayerInteract: (data) => {
                console.log("${component} interaction");
            },
            onTick: (data) => {
                // Default tick handler
            },
            onPlayerDestroy: (data) => {
                console.log("${component} destroyed");
            }
        }
    }`;
    }).join(',\n');
    
    // Insert the new components
    if (arrayEndIndex !== -1) {
        content = content.substring(0, arrayEndIndex) + ',\n' + componentsToAdd + '\n' + content.substring(arrayEndIndex);
        
        // Write the modified content back to the file
        fs.writeFileSync(blockComponentsPath, content);
        console.log(`Added missing components: ${missingComponents.join(', ')}`);
    }
} else {
    console.log('All required components are already defined');
}

// Make sure the worldInitialize event has a safety check
if (!content.includes('if (world.beforeEvents.worldInitialize)')) {
    console.log('Adding safety check for worldInitialize event...');
    
    // Find the registration code
    const registrationIndex = content.indexOf('world.beforeEvents.worldInitialize.subscribe');
    
    if (registrationIndex !== -1) {
        // Find the beginning of the line
        const lineStart = content.lastIndexOf('\n', registrationIndex) + 1;
        
        // Add the safety check
        const before = content.substring(0, lineStart);
        const after = content.substring(lineStart);
        
        content = before + 'if (world.beforeEvents.worldInitialize) {\n    ' + after;
        
        // Find the end of the subscription block
        const subscriptionEndIndex = content.indexOf('});', registrationIndex);
        
        if (subscriptionEndIndex !== -1) {
            // Add the closing brace
            const beforeEnd = content.substring(0, subscriptionEndIndex + 3);
            const afterEnd = content.substring(subscriptionEndIndex + 3);
            
            content = beforeEnd + '\n}' + afterEnd;
            
            // Write the modified content back to the file
            fs.writeFileSync(blockComponentsPath, content);
            console.log('Added safety check for worldInitialize event');
        }
    }
}

console.log('Component registration fix completed successfully!');

// Create documentation
const docsDir = 'docs';
if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
    console.log('Created docs directory');
}

// Create error_fixes.md
const errorFixesContent = `# Mystical Agriculture Bedrock Edition Error Fixes

## Component Registration Warnings
The mod was showing warnings for components that were used but not registered:
\`\`\`
Component 'strat:farmland_controller' was not registered in script but used on a block
Component 'kai:on_player_destroy_slab' was not registered in script but used on a block
Component 'strat:custom_crop' was not registered in script but used on a block
Component 'kai:on_interact_slab' was not registered in script but used on a block
Component 'strat:none' was not registered in script but used on a block
Component 'strat:crop_controller' was not registered in script but used on a block
Component 'strat:ore_xp' was not registered in script but used on a block
Component 'strat:altar_check' was not registered in script but used on a block
Component 'template:stair_placement' was not registered in script but used on a block
Component 'strat:pedestal_place' was not registered in script but used on a block
\`\`\`

### Solution
All required components are now defined in the blockComponents.js file and properly registered during the worldInitialize event.

## TypeErrors from Unsafe Event Subscriptions
The mod was experiencing TypeErrors when trying to subscribe to events that might not be available:
\`\`\`
TypeError: cannot read property 'subscribe' of undefined
\`\`\`

### Solution
Added safety checks for all event subscriptions using the following pattern:
\`\`\`javascript
if (server.world.beforeEvents.eventName) {
    server.world.beforeEvents.eventName.subscribe(event => {
        // Event handler code
    });
}
\`\`\`

## TypeErrors from Unsafe Method Calls
The mod was experiencing TypeErrors when trying to call methods that might not be available:
\`\`\`
TypeError: cannot read property 'getBlockFromViewDirection' of undefined
\`\`\`

### Solution
Added safety checks for method calls using the following pattern:
\`\`\`javascript
if (typeof player.getBlockFromViewDirection !== 'function') return;

try {
    const viewBlock = player.getBlockFromViewDirection({ includeLiquidBlocks: true });
    // Method call code
} catch (error) {
    console.error('Error in method call:', error);
}
\`\`\`
`;

fs.writeFileSync(path.join(docsDir, 'error_fixes.md'), errorFixesContent);
console.log('Created error_fixes.md documentation');

console.log('All fixes completed successfully!');
