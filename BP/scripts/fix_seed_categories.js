// Script to fix seed item categories
// This script updates all seed item JSON files to use the "items" category instead of "equipment"

const { readFileSync, writeFileSync, readdirSync } = require('fs');
const { join } = require('path');

// Path to the seeds directory
const seedsDir = join(__dirname, '..', 'items', 'seeds');

// Get all JSON files in the seeds directory
const seedFiles = readdirSync(seedsDir).filter(file => file.endsWith('.json'));

console.log(`Found ${seedFiles.length} seed files to process`);

// Process each seed file
let updatedCount = 0;
for (const file of seedFiles) {
    const filePath = join(seedsDir, file);
    
    try {
        // Read the file content
        const content = readFileSync(filePath, 'utf8');
        
        // Parse the JSON
        const json = JSON.parse(content);
        
        // Check if the category is "equipment"
        if (json.minecraft?.item?.description?.menu_category?.category === 'equipment') {
            // Update the category to "items"
            json.minecraft.item.description.menu_category.category = 'items';
            
            // Write the updated content back to the file
            writeFileSync(filePath, JSON.stringify(json, null, '\t'));
            
            updatedCount++;
            console.log(`Updated category for ${file}`);
        }
    } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
    }
}

console.log(`\nSummary: Updated ${updatedCount} of ${seedFiles.length} seed files`);
console.log('All seed items now use the "items" category to match the item catalog');
