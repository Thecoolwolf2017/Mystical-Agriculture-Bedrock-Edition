const fs = require('fs');
const path = require('path');

// Project root directory
const projectRoot = __dirname;

console.log('Starting project cleanup...');

// 1. Clean up temporary fix scripts
const tempScripts = [
    'fix_syntax.js',
    'fix_missing_brace.js',
    'fix_final.js',
    'fix_structure.js',
    'fix_try_catch.js',
    'fix_complete.js'
];

tempScripts.forEach(script => {
    const scriptPath = path.join(projectRoot, script);
    if (fs.existsSync(scriptPath)) {
        try {
            fs.unlinkSync(scriptPath);
            console.log(`Removed temporary script: ${script}`);
        } catch (error) {
            console.error(`Error removing ${script}: ${error.message}`);
        }
    }
});

// 2. Clean up backup files
const cleanupBackups = (dir) => {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            cleanupBackups(filePath); // Recursively check subdirectories
        } else if (file.endsWith('.backup') || 
                  file.endsWith('.backup.2') || 
                  file.endsWith('.backup.3') || 
                  file.endsWith('.backup.final') || 
                  file.endsWith('.backup.structure') || 
                  file.endsWith('.backup.try_catch') || 
                  file.endsWith('.backup.complete')) {
            try {
                fs.unlinkSync(filePath);
                console.log(`Removed backup file: ${filePath}`);
            } catch (error) {
                console.error(`Error removing backup ${filePath}: ${error.message}`);
            }
        }
    });
};

// 3. Create docs directory if it doesn't exist
const docsDir = path.join(projectRoot, 'docs');
if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
    console.log('Created docs directory');
}

// 4. Create tools documentation
const toolsDocsDir = path.join(docsDir, 'tools');
if (!fs.existsSync(toolsDocsDir)) {
    fs.mkdirSync(toolsDocsDir);
    console.log('Created docs/tools directory');
}

// 5. Create watering can documentation
const wateringCanDoc = `# Watering Can

## Overview
The watering can is a tool in Mystical Agriculture that allows players to accelerate crop growth.
It needs to be filled with water before use and has different tiers with varying effectiveness.

## Tiers
- **Inferium Watering Can**: 3x3 area, 33% growth chance
- **Prudentium Watering Can**: 5x5 area, 40% growth chance
- **Intermedium Watering Can**: 7x7 area, 50% growth chance
- **Superium Watering Can**: 9x9 area, 60% growth chance
- **Supremium Watering Can**: 11x11 area, 75% growth chance

## Usage
1. **Filling**: Right-click on a water block to fill the watering can
2. **Using**: Right-click on crops or farmland to accelerate growth
3. **Water Consumption**: 1-in-30 chance to consume water when used

## Technical Details
- Supports both vanilla crops and custom Mystical Agriculture crops
- Detects water blocks using both string IDs and numeric IDs (8, 9, 4)
- Provides visual feedback through particles and action bar messages
- Handles different growth properties (growth, age, strat:growth_stage)

## Recent Fixes
- Fixed water detection to work with both string and numeric IDs
- Improved error handling with proper try-catch blocks
- Reduced water consumption rate from 1-in-10 to 1-in-30
- Added better feedback messages when using the watering can
`;

fs.writeFileSync(path.join(toolsDocsDir, 'watering_can.md'), wateringCanDoc);
console.log('Created watering can documentation');

// 6. Start cleaning up backup files
cleanupBackups(projectRoot);

console.log('Project cleanup completed successfully!');
