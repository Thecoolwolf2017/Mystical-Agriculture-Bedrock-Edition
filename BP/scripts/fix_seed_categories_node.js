// Node.js script to fix seed item categories
// This script updates all seed item JSON files to use the "items" category instead of "equipment"

const fs = require('fs');
const path = require('path');

// Path to the seeds directory
const seedsDir = path.join(__dirname, '..', 'items', 'seeds');

console.log('Starting seed category update process...');
console.log(`Looking for seed files in: ${seedsDir}`);

// Check if the directory exists
if (!fs.existsSync(seedsDir)) {
    console.error(`Seeds directory not found: ${seedsDir}`);
    process.exit(1);
}

// Get all JSON files in the seeds directory
const seedFiles = fs.readdirSync(seedsDir).filter(file => file.endsWith('.json'));

console.log(`Found ${seedFiles.length} seed files to process`);

// Process each seed file
let updatedCount = 0;
for (const file of seedFiles) {
    const filePath = path.join(seedsDir, file);
    
    try {
        // Read the file content
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the file contains "equipment" category
        if (content.includes('"category": "equipment"')) {
            // Replace "equipment" with "items"
            content = content.replace('"category": "equipment"', '"category": "items"');
            
            // Write the updated content back to the file
            fs.writeFileSync(filePath, content);
            
            updatedCount++;
            console.log(`Updated category for ${file}`);
        }
    } catch (error) {
        console.error(`Error processing ${file}: ${error.message}`);
    }
}

console.log(`\nSummary: Updated ${updatedCount} of ${seedFiles.length} seed files`);
console.log('All seed items now use the "items" category to match the item catalog');
