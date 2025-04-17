const fs = require('fs');
const path = require('path');

// Path to the blockComponents.js file
const blockComponentsPath = path.join(__dirname, 'BP', 'scripts', 'components', 'blockComponents.js');

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

// Read the blockComponents.js file
console.log(`Reading ${blockComponentsPath}...`);
let content = fs.readFileSync(blockComponentsPath, 'utf8');

// Check which components are missing
const missingComponents = [];
requiredComponents.forEach(component => {
    if (!content.includes(`id: "${component}"`)) {
        missingComponents.push(component);
        console.log(`Component ${component} is missing and will be added`);
    } else {
        console.log(`Component ${component} is already defined`);
    }
});

// Add missing components
if (missingComponents.length > 0) {
    console.log(`Adding ${missingComponents.length} missing components...`);
    
    // Find the end of the blockComponents array
    const arrayEndIndex = content.lastIndexOf('];');
    if (arrayEndIndex !== -1) {
        // Add missing components before the end of the array
        const componentsToAdd = missingComponents.map(component => {
            return `    {
        id: "${component}",
        code: {
            // Default implementation
            onPlayerInteract: (data) => {
                console.log("${component} interaction");
            },
            onTick: (data) => {
                // Default tick handler
            }
        }
    }`;
        }).join(',\n');
        
        // Insert the new components
        content = content.substring(0, arrayEndIndex) + ',\n' + componentsToAdd + '\n' + content.substring(arrayEndIndex);
        
        // Save the modified file
        fs.writeFileSync(blockComponentsPath, content, 'utf8');
        console.log(`Added missing components: ${missingComponents.join(', ')}`);
    }
} else {
    console.log('All required components are already defined');
}

// Check if the components are properly registered
if (!content.includes('if (world.beforeEvents.worldInitialize)')) {
    console.log('Adding safety check for worldInitialize event...');
    
    // Add safety check for the worldInitialize event
    const registrationPattern = /world\.beforeEvents\.worldInitialize\.subscribe\(\s*(?:event\s*=>|function\s*\(\s*event\s*\))/;
    const match = content.match(registrationPattern);
    
    if (match) {
        const index = match.index;
        const before = content.substring(0, index);
        const after = content.substring(index);
        
        content = before + 'if (world.beforeEvents.worldInitialize) {\n    ' + after;
        
        // Find the end of the subscription block to add closing brace
        const subscriptionEndPattern = /}\s*\)\s*;/g;
        const lastMatch = [...content.matchAll(subscriptionEndPattern)].pop();
        
        if (lastMatch) {
            const endIndex = lastMatch.index + lastMatch[0].length;
            content = content.substring(0, endIndex) + '\n}' + content.substring(endIndex);
            
            // Save the modified file
            fs.writeFileSync(blockComponentsPath, content, 'utf8');
            console.log('Added safety check for worldInitialize event');
        }
    }
} else {
    console.log('Safety check for worldInitialize event already exists');
}

console.log('Component registration fix completed!');
