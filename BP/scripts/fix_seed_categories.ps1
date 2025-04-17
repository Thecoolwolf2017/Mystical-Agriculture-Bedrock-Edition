# PowerShell script to fix seed item categories
# This script updates all seed item JSON files to use the "items" category instead of "equipment"

# Define the seeds directory path - use forward slashes to avoid escaping issues
$seedsDir = "d:/game_development_Stuff/minecraft/projects/Mystical Agriculture [RP] (dev)/BP/items/seeds"

# Check if the directory exists
if (-not (Test-Path -Path $seedsDir)) {
    Write-Error "Seeds directory not found: $seedsDir"
    exit 1
}

# Get all JSON files in the seeds directory
$seedFiles = Get-ChildItem -Path $seedsDir -Filter "*.json"

Write-Host "Found $($seedFiles.Count) seed files to process"

# Process each seed file
$updatedCount = 0
foreach ($file in $seedFiles) {
    $filePath = $file.FullName
    
    try {
        # Read the file content
        $content = Get-Content -Path $filePath -Raw
        
        # Check if the file contains "equipment" category
        if ($content -match '"category":\s*"equipment"') {
            # Replace "equipment" with "items"
            $newContent = $content -replace '"category":\s*"equipment"', '"category": "items"'
            
            # Write the updated content back to the file
            Set-Content -Path $filePath -Value $newContent
            
            $updatedCount++
            Write-Host "Updated category for $($file.Name)"
        }
    } catch {
        Write-Error "Error processing $($file.Name): $_"
    }
}

Write-Host ""
Write-Host "Summary: Updated $updatedCount of $($seedFiles.Count) seed files"
Write-Host "All seed items now use the 'items' category to match the item catalog"
