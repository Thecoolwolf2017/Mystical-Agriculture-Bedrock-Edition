@echo off
echo Updating crop files to use the strat: namespace...

cd /d "d:\game_development_Stuff\minecraft\projects\Mystical Agriculture [RP] (dev)\BP\blocks\crops"

REM Create a PowerShell script with full paths
echo $cropDir = "d:\game_development_Stuff\minecraft\projects\Mystical Agriculture [RP] (dev)\BP\blocks\crops" > update_script.ps1
echo $cropFiles = Get-ChildItem -Path $cropDir -Filter "*_crop.json" >> update_script.ps1
echo foreach ($file in $cropFiles) { >> update_script.ps1
echo     $filePath = $file.FullName >> update_script.ps1
echo     $fileName = $file.Name >> update_script.ps1
echo     Write-Host "Processing $fileName" >> update_script.ps1
echo     $content = Get-Content -Path $filePath -Raw >> update_script.ps1
echo     $content = $content -replace '"identifier": "mysticalagriculture:', '"identifier": "strat:' >> update_script.ps1
echo     $content = $content -replace '"mysticalagriculture:growth":', '"strat:growth_stage":' >> update_script.ps1
echo     $content = $content -replace '"mysticalagriculture:custom_crop"', '"strat:crop_controller"' >> update_script.ps1
echo     $content = $content -replace '"mysticalagriculture:none"', '"strat:none"' >> update_script.ps1
echo     $content = $content -replace '"farmland"', '"minecraft:farmland"' >> update_script.ps1
echo     $content = $content -replace '"mysticalagriculture:inferium_farmland"', '"strat:inferium_farmland"' >> update_script.ps1
echo     $content = $content -replace '"mysticalagriculture:prudentium_farmland"', '"strat:prudentium_farmland"' >> update_script.ps1
echo     $content = $content -replace '"mysticalagriculture:tertium_farmland"', '"strat:tertium_farmland"' >> update_script.ps1
echo     $content = $content -replace '"mysticalagriculture:imperium_farmland"', '"strat:imperium_farmland"' >> update_script.ps1
echo     $content = $content -replace '"mysticalagriculture:supremium_farmland"', '"strat:supremium_farmland"' >> update_script.ps1
echo     $content = $content -replace "q.block_state\('mysticalagriculture:growth'\)", "q.block_state('strat:growth_stage')" >> update_script.ps1
echo     Set-Content -Path $filePath -Value $content -NoNewline >> update_script.ps1
echo } >> update_script.ps1

REM Run the PowerShell script with bypass execution policy
powershell -ExecutionPolicy Bypass -File update_script.ps1

REM Delete the script when done
del update_script.ps1

echo All crop files have been updated to use the strat: namespace.
echo Press any key to exit...
pause > nul
