@echo off
echo Updating crop files to use the strat: namespace...

cd /d "d:\game_development_Stuff\minecraft\projects\Mystical Agriculture [RP] (dev)\BP\blocks\crops"

REM Process each crop file individually
for %%f in (*_crop.json) do (
    echo Processing %%f
    
    REM Create a temporary file for each crop
    type "%%f" > "%%f.tmp"
    
    REM Use PowerShell to update the file
    powershell -Command "(Get-Content '%%f.tmp') | ForEach-Object { $_ -replace '\"identifier\": \"mysticalagriculture:', '\"identifier\": \"strat:' -replace '\"mysticalagriculture:growth\":', '\"strat:growth_stage\":' -replace '\"mysticalagriculture:custom_crop\"', '\"strat:crop_controller\"' -replace '\"mysticalagriculture:none\"', '\"strat:none\"' -replace '\"farmland\"', '\"minecraft:farmland\"' -replace '\"mysticalagriculture:inferium_farmland\"', '\"strat:inferium_farmland\"' -replace '\"mysticalagriculture:prudentium_farmland\"', '\"strat:prudentium_farmland\"' -replace '\"mysticalagriculture:tertium_farmland\"', '\"strat:tertium_farmland\"' -replace '\"mysticalagriculture:imperium_farmland\"', '\"strat:imperium_farmland\"' -replace '\"mysticalagriculture:supremium_farmland\"', '\"strat:supremium_farmland\"' -replace \"q.block_state\('mysticalagriculture:growth'\)\", \"q.block_state('strat:growth_stage')\" -replace 'mystical_resource_crop_', 'strat_resource_crop_' } | Set-Content '%%f'"
    
    REM Remove the temporary file
    del "%%f.tmp"
)

echo All crop files have been updated to use the strat: namespace.
echo Press any key to exit...
pause > nul
