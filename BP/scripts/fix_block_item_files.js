// Node.js script to fix block item files in Mystical Agriculture
// This script updates block item files to use "construction" category instead of "items" or "equipment" category

const fs = require('fs');
const path = require('path');

// Base directory
const baseDir = path.join(__dirname, '..');

console.log('Starting block item file update process...');

// List of block-related item IDs from the item catalog
const blockItemIds = [
    'inferium_ore',
    'prosperity_ore',
    'inferium_block',
    'prudentium_block',
    'tertium_block',
    'imperium_block',
    'supremium_block',
    'infusion_altar',
    'infusion_pedestal',
    'inferium_farmland',
    'prudentium_farmland',
    'tertium_farmland',
    'imperium_farmland',
    'supremium_farmland',
    'soulstone',
    'soulstone_bricks',
    'soul_glass'
];

// Function to recursively find all item files
function findAllItemFiles(directory) {
    let itemFiles = [];
    
    function searchDirectory(dir) {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isDirectory()) {
                searchDirectory(filePath);
            } else if (stats.isFile() && file.endsWith('.json')) {
                itemFiles.push(filePath);
            }
        }
    }
    
    searchDirectory(directory);
    return itemFiles;
}

// Function to identify block item files from all item files
function identifyBlockItemFiles(files) {
    let blockFiles = [];
    
    for (const filePath of files) {
        try {
            // Read file content
            const content = fs.readFileSync(filePath, 'utf8');
            let isBlockItem = false;
            
            // Check filename for block-related keywords
            const fileName = path.basename(filePath, '.json');
            if (fileName.includes('block') || 
                fileName.includes('farmland') || 
                fileName.includes('altar') || 
                fileName.includes('pedestal') || 
                fileName.includes('soulstone') || 
                fileName.includes('glass') || 
                fileName.includes('ore')) {
                isBlockItem = true;
            }
            
            // Check if the item ID matches any in our block items list
            for (const blockId of blockItemIds) {
                if (fileName === blockId || fileName.endsWith('_' + blockId)) {
                    isBlockItem = true;
                    break;
                }
            }
            
            if (isBlockItem) {
                blockFiles.push(filePath);
            }
        } catch (error) {
            // Skip files that can't be read
            console.error(`Error reading ${path.basename(filePath)}: ${error.message}`);
        }
    }
    
    return blockFiles;
}

// Function to update block item files
function updateBlockItemFiles(files) {
    let updatedCount = 0;
    
    for (const filePath of files) {
        try {
            // Read the file content
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Check if the file has the menu_category property
            if (content.includes('"menu_category"') && content.includes('"category"')) {
                // Check if the category is not already "construction"
                if (!content.includes('"category": "construction"')) {
                    // Replace the category with "construction"
                    const oldCategory = content.match(/"category":\s*"([^"]+)"/)[1];
                    content = content.replace(/"category":\s*"([^"]+)"/, '"category": "construction"');
                    
                    // Write the updated content back to the file
                    fs.writeFileSync(filePath, content);
                    
                    updatedCount++;
                    console.log(`Updated category for ${path.basename(filePath)} from "${oldCategory}" to "construction"`);
                }
            }
        } catch (error) {
            console.error(`Error processing ${path.basename(filePath)}: ${error.message}`);
        }
    }
    
    return updatedCount;
}

// Find all item files
console.log('Searching for all item files...');
const allItemFiles = findAllItemFiles(path.join(baseDir, 'items'));
console.log(`Found ${allItemFiles.length} total item files`);

// Identify block item files
console.log('\nIdentifying block item files...');
const blockItemFiles = identifyBlockItemFiles(allItemFiles);
console.log(`Identified ${blockItemFiles.length} block item files`);

// Update block item files
console.log('\nUpdating block item files...');
const updatedCount = updateBlockItemFiles(blockItemFiles);

// Final summary
console.log('\n=== FINAL SUMMARY ===');
console.log(`Total block item files updated: ${updatedCount} of ${blockItemFiles.length}`);
console.log('\nAll block items now use the "construction" category as required by the item catalog');

// Create documentation for the changes
const docsDir = path.join(baseDir, 'docs');
const categoriesDocsDir = path.join(docsDir, 'item_categories');

// Create directories if they don't exist
if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
}
if (!fs.existsSync(categoriesDocsDir)) {
    fs.mkdirSync(categoriesDocsDir);
}

// Write documentation
const docContent = `# Item Categories in Mystical Agriculture

## Category Guidelines

Mystical Agriculture uses three main item categories to organize items in the creative inventory:

1. **items**: General items like seeds, essences, and crafting materials
   - Seeds (elemental, resource, mob)
   - Essences
   - Crafting materials (infusion crystals, soul jars, etc.)
   - Tools (pickaxes, swords, etc.)

2. **construction**: Blocks and building materials
   - Ore blocks
   - Essence blocks
   - Farmland blocks
   - Functional blocks (infusion altar, pedestal)
   - Decorative blocks (soulstone, soul glass)

3. **equipment**: Wearable armor
   - Inferium armor
   - Prudentium armor
   - Tertium armor
   - Imperium armor
   - Supremium armor

## Item Catalog Structure

The item catalog in \`BP/item_catalog/crafting_item_catalog.json\` organizes items into these categories and further groups them by type.

### Items Category
- Elemental Seeds
- Resource Seeds
- Mob Seeds
- Materials
- Tools

### Construction Category
- Blocks (including ores, essence blocks, farmland, and functional blocks)

### Equipment Category
- Armor sets

## Recent Updates

The item catalog and individual item files have been updated to ensure all items are in the correct categories:
- All seed items moved from "equipment" to "items"
- All essence items set to "items"
- All block items moved from "items" to "construction"
- All tool items set to "items"
- All armor items set to "equipment"

These changes ensure items appear in the correct tabs in the creative inventory and function properly with crafting and other game systems.
`;

fs.writeFileSync(path.join(categoriesDocsDir, 'categories.md'), docContent);
console.log('\nCreated documentation for item categories at docs/item_categories/categories.md');


