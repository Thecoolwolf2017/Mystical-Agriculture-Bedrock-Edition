@echo off
echo Fixing texture references in all crop files...

cd /d "d:\game_development_Stuff\minecraft\projects\Mystical Agriculture [RP] (dev)\BP\blocks\crops"

REM Create a PowerShell script that will update all crop files
echo $cropDir = "d:\game_development_Stuff\minecraft\projects\Mystical Agriculture [RP] (dev)\BP\blocks\crops" > fix_textures.ps1
echo $cropFiles = Get-ChildItem -Path $cropDir -Filter "*_crop.json" >> fix_textures.ps1
echo foreach ($file in $cropFiles) { >> fix_textures.ps1
echo     $filePath = $file.FullName >> fix_textures.ps1
echo     $fileName = $file.Name >> fix_textures.ps1
echo     Write-Host "Processing $fileName" >> fix_textures.ps1
echo     $content = Get-Content -Path $filePath -Raw >> fix_textures.ps1
echo     $content = $content -replace '"texture": "strat_resource_crop_([0-9])"', '"texture": "mystical_resource_crop_$1"' >> fix_textures.ps1
echo     Set-Content -Path $filePath -Value $content -NoNewline >> fix_textures.ps1
echo } >> fix_textures.ps1

REM Run the PowerShell script with bypass execution policy
powershell -ExecutionPolicy Bypass -File fix_textures.ps1

REM Delete the script when done
del fix_textures.ps1

echo All texture references have been fixed to use the mystical_ prefix.
echo Press any key to exit...
pause > nul
