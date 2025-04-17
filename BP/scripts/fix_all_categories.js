// Node.js script to fix all item categories in Mystical Agriculture
// This script updates essence items to use "items" category and block items to use "construction" category

const fs = require('fs');
const path = require('path');

// Base directory
const baseDir = path.join(__dirname, '..');

console.log('Starting comprehensive category update process...');

// Function to update files matching a pattern in a directory
function updateFilesInDirectory(directory, filePattern, categoryFrom, categoryTo) {
    console.log(`\nLooking for ${filePattern} files in: ${directory}`);
    
    // Check if the directory exists
    if (!fs.existsSync(directory)) {
        console.error(`Directory not found: ${directory}`);
        return 0;
    }
    
    // Get all matching files in the directory (including subdirectories)
    const getAllFiles = function(dir, pattern, fileList = []) {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                getAllFiles(filePath, pattern, fileList);
            } else if (file.match(pattern)) {
                fileList.push(filePath);
            }
        });
        
        return fileList;
    };
    
    const files = getAllFiles(directory, filePattern);
    console.log(`Found ${files.length} files to process`);
    
    // Process each file
    let updatedCount = 0;
    for (const filePath of files) {
        try {
            // Read the file content
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Check if the file contains the category to change
            if (content.includes(`"category": "${categoryFrom}"`)) {
                // Replace the category
                content = content.replace(`"category": "${categoryFrom}"`, `"category": "${categoryTo}"`);
                
                // Write the updated content back to the file
                fs.writeFileSync(filePath, content);
                
                updatedCount++;
                console.log(`Updated category for ${path.basename(filePath)}`);
            }
        } catch (error) {
            console.error(`Error processing ${path.basename(filePath)}: ${error.message}`);
        }
    }
    
    console.log(`\nSummary: Updated ${updatedCount} of ${files.length} files`);
    return updatedCount;
}

// 1. Update essence items from "equipment" to "items"
const essenceCount = updateFilesInDirectory(
    path.join(baseDir, 'items'),
    /essence\.json$/i,
    "equipment",
    "items"
);

// 2. Update prosperity and soulium items from "equipment" to "items"
const craftingItemsCount = updateFilesInDirectory(
    path.join(baseDir, 'items'),
    /(prosperity|soulium|infusion_crystal|master_infusion_crystal|soul_jar|mystical_fertilizer)\.json$/i,
    "equipment",
    "items"
);

// 3. Update block items from "items" to "construction"
const blockItemsCount = updateFilesInDirectory(
    path.join(baseDir, 'items'),
    /(block|farmland|glass|pedestal)\.json$/i,
    "items",
    "construction"
);

// 4. Update tool items from "equipment" to "items" (if needed)
const toolItemsCount = updateFilesInDirectory(
    path.join(baseDir, 'items'),
    /(pickaxe|sword|axe|shovel|hoe|watering_can|wand|dagger)\.json$/i,
    "equipment",
    "items"
);

// Final summary
console.log('\n=== FINAL SUMMARY ===');
console.log(`Total essence items updated: ${essenceCount}`);
console.log(`Total crafting items updated: ${craftingItemsCount}`);
console.log(`Total block items updated: ${blockItemsCount}`);
console.log(`Total tool items updated: ${toolItemsCount}`);
console.log(`Total items updated: ${essenceCount + craftingItemsCount + blockItemsCount + toolItemsCount}`);
console.log('\nAll item categories now match the item catalog requirements');
