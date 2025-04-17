const fs = require('fs');
const path = require('path');

// Path to the blockComponents.js file
const blockComponentsPath = path.resolve(__dirname, 'components', 'blockComponents.js');

// List of all components that should be registered
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

// Read the blockComponents.js file
console.log(`Reading file: ${blockComponentsPath}`);
let content;
try {
    content = fs.readFileSync(blockComponentsPath, 'utf8');
} catch (error) {
    console.error(`Error reading file: ${error.message}`);
    process.exit(1);
}

// Parse the content to find existing component registrations
console.log('Analyzing component registrations...');
const existingComponents = [];
const componentRegex = /id:\s*"([^"]+)"/g;
let match;
while ((match = componentRegex.exec(content)) !== null) {
    existingComponents.push(match[1]);
}

console.log(`Found ${existingComponents.length} existing component registrations:`);
existingComponents.forEach(comp => console.log(`- ${comp}`));

// Find missing components
const missingComponents = requiredComponents.filter(comp => !existingComponents.includes(comp));

if (missingComponents.length === 0) {
    console.log('All required components are already registered!');
    process.exit(0);
}

console.log(`\nFound ${missingComponents.length} missing component registrations:`);
missingComponents.forEach(comp => console.log(`- ${comp}`));

// Add the missing components to the file
console.log('\nUpdating blockComponents.js file...');

// Find the position to insert the new components (before the closing bracket of the components array)
const componentsArrayEndRegex = /\n\];/;
const match2 = componentsArrayEndRegex.exec(content);

if (!match2) {
    console.error('Could not find the end of the components array in the file.');
    process.exit(1);
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
try {
    fs.writeFileSync(blockComponentsPath, updatedContent);
    console.log('Successfully updated blockComponents.js with missing component registrations!');
} catch (error) {
    console.error(`Error writing file: ${error.message}`);
    process.exit(1);
}

// Verify the file was updated correctly
console.log('\nVerifying the update...');
const updatedContent2 = fs.readFileSync(blockComponentsPath, 'utf8');
const updatedComponents = [];
const componentRegex2 = /id:\s*"([^"]+)"/g;
let match3;
while ((match3 = componentRegex2.exec(updatedContent2)) !== null) {
    updatedComponents.push(match3[1]);
}

console.log(`Found ${updatedComponents.length} component registrations after update:`);
updatedComponents.forEach(comp => console.log(`- ${comp}`));

const stillMissing = requiredComponents.filter(comp => !updatedComponents.includes(comp));
if (stillMissing.length === 0) {
    console.log('\nAll required components are now registered successfully!');
} else {
    console.error(`\nWarning: Some components are still missing: ${stillMissing.join(', ')}`);
}

// Also check for the WorldInitializeBeforeEvent registration
if (!updatedContent2.includes('world.beforeEvents.worldInitialize.subscribe')) {
    console.warn('\nWarning: Could not find WorldInitializeBeforeEvent subscription in the file.');
    console.warn('Make sure components are properly registered with the WorldInitializeBeforeEvent.');
} else {
    console.log('\nWorldInitializeBeforeEvent subscription found in the file.');
}

console.log('\nComponent registration update completed!');
