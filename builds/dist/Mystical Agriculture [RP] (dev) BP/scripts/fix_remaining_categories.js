const fs = require('fs');
const path = require('path');

// Items that need category updates
const itemUpdates = [
  {
    file: 'items/prosperity/prosperity_shard.json',
    oldCategory: 'equipment',
    newCategory: 'items'
  },
  {
    file: 'items/soulium/soulium_dust.json',
    oldCategory: 'equipment',
    newCategory: 'items'
  },
  {
    file: 'items/infusion_pedestal.json', // Check if this path exists
    oldCategory: 'equipment',
    newCategory: 'construction'
  }
];

// Base directory
const baseDir = path.resolve(__dirname, '..');

// Function to update item category in a file
function updateItemCategory(filePath, oldCategory, newCategory) {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return false;
    }

    // Read the file
    const data = fs.readFileSync(filePath, 'utf8');
    
    // Parse JSON
    const json = JSON.parse(data);
    
    // Check for Bedrock Edition item structure
    if (!json['minecraft:item']) {
      console.log(`File ${filePath} is not a valid item file`);
      return false;
    }
    
    // Check if the file has the expected structure
    if (!json['minecraft:item'].description || !json['minecraft:item'].description.menu_category) {
      console.log(`File ${filePath} doesn't have the menu_category property`);
      return false;
    }
    
    // Check current category
    const currentCategory = json['minecraft:item'].description.menu_category.category;
    if (currentCategory !== oldCategory) {
      console.log(`File ${filePath} has category '${currentCategory}', not '${oldCategory}'`);
      return false;
    }
    
    // Update category
    json['minecraft:item'].description.menu_category.category = newCategory;
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(json, null, '\t'));
    
    console.log(`Updated ${filePath}: changed category from '${oldCategory}' to '${newCategory}'`);
    return true;
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Process all item updates
let updatedCount = 0;
let errorCount = 0;

itemUpdates.forEach(item => {
  const fullPath = path.join(baseDir, item.file);
  const success = updateItemCategory(fullPath, item.oldCategory, item.newCategory);
  
  if (success) {
    updatedCount++;
  } else {
    errorCount++;
  }
});

console.log(`\nCategory update complete: ${updatedCount} files updated, ${errorCount} errors`);

// Also search for any other items with 'equipment' category that should be 'items'
console.log('\nSearching for additional items with incorrect categories...');

function findItemsWithCategory(directory, category) {
  const results = [];
  
  function scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        try {
          const data = fs.readFileSync(fullPath, 'utf8');
          const json = JSON.parse(data);
          
          if (json['minecraft:item'] && 
              json['minecraft:item'].description && 
              json['minecraft:item'].description.menu_category &&
              json['minecraft:item'].description.menu_category.category === category) {
            
            // Check if this is a seed, essence, or crafting item
            const isItemCategory = 
              entry.name.includes('_seeds.json') || 
              entry.name.includes('_essence.json') ||
              fullPath.includes('items/prosperity') ||
              fullPath.includes('items/soulium') ||
              fullPath.includes('items/soul_jar');
            
            if (isItemCategory) {
              results.push({
                path: fullPath,
                name: entry.name
              });
            }
          }
        } catch (error) {
          // Ignore JSON parsing errors
        }
      }
    }
  }
  
  scanDirectory(directory);
  return results;
}

// Find items with 'equipment' category that should be 'items'
const itemsDir = path.join(baseDir, 'items');
const incorrectItems = findItemsWithCategory(itemsDir, 'equipment');

if (incorrectItems.length > 0) {
  console.log(`Found ${incorrectItems.length} additional items with incorrect 'equipment' category:`);
  
  incorrectItems.forEach(item => {
    console.log(`- ${item.name} (${item.path})`);
    updateItemCategory(item.path, 'equipment', 'items');
  });
} else {
  console.log('No additional items with incorrect categories found.');
}

// Find block items with 'items' category that should be 'construction'
const blockItems = [];
const blockItemsPattern = /_block\.json$/;

function findBlockItems(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    
    if (entry.isDirectory()) {
      findBlockItems(fullPath);
    } else if (entry.isFile() && blockItemsPattern.test(entry.name)) {
      try {
        const data = fs.readFileSync(fullPath, 'utf8');
        const json = JSON.parse(data);
        
        if (json['minecraft:item'] && 
            json['minecraft:item'].description && 
            json['minecraft:item'].description.menu_category &&
            json['minecraft:item'].description.menu_category.category === 'items') {
          
          blockItems.push({
            path: fullPath,
            name: entry.name
          });
        }
      } catch (error) {
        // Ignore JSON parsing errors
      }
    }
  }
}

findBlockItems(itemsDir);

if (blockItems.length > 0) {
  console.log(`\nFound ${blockItems.length} block items with incorrect 'items' category:`);
  
  blockItems.forEach(item => {
    console.log(`- ${item.name} (${item.path})`);
    updateItemCategory(item.path, 'items', 'construction');
  });
} else {
  console.log('\nNo block items with incorrect categories found.');
}

console.log('\nCategory fix script completed successfully!');
