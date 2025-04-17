const fs = require('fs');
const path = require('path');

// Path to the crops directory
const cropsDir = path.join(__dirname, '..', 'blocks', 'crops');

// Function to add minecraft:tick component to a crop block JSON
function addTickComponent(cropJson) {
    // Make sure components exists
    if (!cropJson['minecraft:block'].components) {
        cropJson['minecraft:block'].components = {};
    }
    
    // Add the minecraft:tick component if it doesn't exist
    if (!cropJson['minecraft:block'].components['minecraft:tick']) {
        cropJson['minecraft:block'].components['minecraft:tick'] = {
            "interval_range": [300, 600],
            "looping": true
        };
        console.log(`Added minecraft:tick component to ${cropJson['minecraft:block'].description.identifier}`);
        return true;
    }
    return false;
}

// Process all crop files
function processCropFiles() {
    try {
        // Get all JSON files in the crops directory
        const files = fs.readdirSync(cropsDir).filter(file => file.endsWith('_crop.json'));
        console.log(`Found ${files.length} crop files to process`);
        
        let modifiedCount = 0;
        
        // Process each file
        for (const file of files) {
            const filePath = path.join(cropsDir, file);
            try {
                // Read and parse the JSON file
                const content = fs.readFileSync(filePath, 'utf8');
                const cropJson = JSON.parse(content);
                
                // Add the tick component
                if (addTickComponent(cropJson)) {
                    // Write the updated JSON back to the file
                    fs.writeFileSync(filePath, JSON.stringify(cropJson, null, 2));
                    modifiedCount++;
                }
            } catch (fileError) {
                console.error(`Error processing file ${file}:`, fileError);
            }
        }
        
        console.log(`Modified ${modifiedCount} crop files`);
    } catch (error) {
        console.error('Error processing crop files:', error);
    }
}

// Run the script
console.log('Starting crop block fix script...');
processCropFiles();
console.log('Crop block fix script completed');
