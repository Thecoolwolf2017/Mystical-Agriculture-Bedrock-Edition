@echo off
echo Updating crop files to use the strat: namespace...

powershell -Command "& {
    $cropDir = 'd:\game_development_Stuff\minecraft\projects\Mystical Agriculture [RP] (dev)\BP\blocks\crops'
    $cropFiles = Get-ChildItem -Path $cropDir -Filter '*_crop.json'
    $totalFiles = $cropFiles.Count
    $processedFiles = 0
    
    foreach ($file in $cropFiles) {
        $filePath = $file.FullName
        $fileName = $file.Name
        $processedFiles++
        Write-Host \"[$processedFiles of $totalFiles] Processing $fileName\"
        
        # Read the file content
        $content = Get-Content -Path $filePath -Raw
        
        # Update block identifiers
        $content = $content -replace '\"identifier\": \"mysticalagriculture:([^\"]+)\"', '\"identifier\": \"strat:$1\"'
        
        # Update block states
        $content = $content -replace '\"mysticalagriculture:growth\":', '\"strat:growth_stage\":'
        
        # Update custom components
        $content = $content -replace '\"mysticalagriculture:custom_crop\"', '\"strat:crop_controller\"'
        $content = $content -replace '\"mysticalagriculture:none\"', '\"strat:none\"'
        
        # Update farmland references
        $content = $content -replace '\"farmland\"', '\"minecraft:farmland\"'
        $content = $content -replace '\"mysticalagriculture:inferium_farmland\"', '\"strat:inferium_farmland\"'
        $content = $content -replace '\"mysticalagriculture:prudentium_farmland\"', '\"strat:prudentium_farmland\"'
        $content = $content -replace '\"mysticalagriculture:tertium_farmland\"', '\"strat:tertium_farmland\"'
        $content = $content -replace '\"mysticalagriculture:imperium_farmland\"', '\"strat:imperium_farmland\"'
        $content = $content -replace '\"mysticalagriculture:supremium_farmland\"', '\"strat:supremium_farmland\"'
        
        # Update block state conditions in permutations
        $content = $content -replace \"q.block_state\('mysticalagriculture:growth'\)\", \"q.block_state('strat:growth_stage')\"
        
        # Write the updated content back to the file
        Set-Content -Path $filePath -Value $content -NoNewline
    }
    
    Write-Host \"All $totalFiles crop files have been updated to use the strat: namespace.\"
}"

echo.
echo Script completed. Press any key to exit.
pause > nul
