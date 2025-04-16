@echo off
echo Updating crop files to use the strat: namespace...

cd /d "d:\game_development_Stuff\minecraft\projects\Mystical Agriculture [RP] (dev)\BP\blocks\crops"

for %%f in (*_crop.json) do (
    echo Processing %%f
    
    REM Create a temporary PowerShell script for each file
    echo $content = Get-Content '%%f' -Raw > temp_script.ps1
    echo $content = $content -replace '"identifier": "mysticalagriculture:', '"identifier": "strat:' >> temp_script.ps1
    echo $content = $content -replace '"mysticalagriculture:growth":', '"strat:growth_stage":' >> temp_script.ps1
    echo $content = $content -replace '"mysticalagriculture:custom_crop"', '"strat:crop_controller"' >> temp_script.ps1
    echo $content = $content -replace '"mysticalagriculture:none"', '"strat:none"' >> temp_script.ps1
    echo $content = $content -replace '"farmland"', '"minecraft:farmland"' >> temp_script.ps1
    echo $content = $content -replace '"mysticalagriculture:inferium_farmland"', '"strat:inferium_farmland"' >> temp_script.ps1
    echo $content = $content -replace '"mysticalagriculture:prudentium_farmland"', '"strat:prudentium_farmland"' >> temp_script.ps1
    echo $content = $content -replace '"mysticalagriculture:tertium_farmland"', '"strat:tertium_farmland"' >> temp_script.ps1
    echo $content = $content -replace '"mysticalagriculture:imperium_farmland"', '"strat:imperium_farmland"' >> temp_script.ps1
    echo $content = $content -replace '"mysticalagriculture:supremium_farmland"', '"strat:supremium_farmland"' >> temp_script.ps1
    echo $content = $content -replace "q.block_state('mysticalagriculture:growth')", "q.block_state('strat:growth_stage')" >> temp_script.ps1
    echo Set-Content -Path '%%f' -Value $content >> temp_script.ps1
    
    REM Run the temporary script
    powershell -ExecutionPolicy Bypass -File temp_script.ps1
    
    REM Delete the temporary script
    del temp_script.ps1
)

echo All crop files have been updated to use the strat: namespace.
echo Press any key to exit...
pause > nul
