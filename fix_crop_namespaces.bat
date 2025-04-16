@echo off
echo Cleaning up old batch files...
del fix_all_crops.bat 2>nul
del fix_all_textures.bat 2>nul
del fix_crops.bat 2>nul
del fix_crops_correctly.bat 2>nul
del fix_crops_direct.bat 2>nul
del update_crop_files.bat 2>nul
del update_crops.bat 2>nul
del update_one_by_one.bat 2>nul

echo Creating a comprehensive batch file to fix all crop files...

cd /d "d:\game_development_Stuff\minecraft\projects\Mystical Agriculture [RP] (dev)\BP\blocks\crops"

echo @echo off > fix_all_crops_direct.bat
echo setlocal enabledelayedexpansion >> fix_all_crops_direct.bat
echo echo Updating all crop files... >> fix_all_crops_direct.bat

echo for %%%%f in (*.json) do ( >> fix_all_crops_direct.bat
echo   echo Processing %%%%f >> fix_all_crops_direct.bat
echo   powershell -Command "$filePath = Join-Path -Path (Get-Location).Path -ChildPath '%%%%f'; (Get-Content $filePath) -replace 'mysticalagriculture:', 'strat:' -replace '\"farmland\",', '\"minecraft:farmland\",' -replace 'strat:growth', 'strat:growth_stage' -replace 'strat:custom_crop', 'strat:crop_controller' -replace 'q.block_state\(''strat:growth''\)', 'q.block_state(''strat:growth_stage'')' -replace 'q.block_state\(''mysticalagriculture:growth''\)', 'q.block_state(''strat:growth_stage'')' -replace 'strat_resource_crop_', 'mystical_resource_crop_' | Set-Content $filePath" >> fix_all_crops_direct.bat
echo ) >> fix_all_crops_direct.bat

echo echo All crop files have been updated successfully. >> fix_all_crops_direct.bat
echo pause >> fix_all_crops_direct.bat

call fix_all_crops_direct.bat
del fix_all_crops_direct.bat

echo All crop files have been updated to use the strat: namespace.
echo Press any key to exit...
pause > nul
