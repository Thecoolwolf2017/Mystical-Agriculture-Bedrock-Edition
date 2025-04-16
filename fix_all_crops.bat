@echo off
echo Updating crop files to use the strat: namespace...

cd /d "d:\game_development_Stuff\minecraft\projects\Mystical Agriculture [RP] (dev)\BP\blocks\crops"

for %%f in (*_crop.json) do (
    echo Processing %%f
    
    powershell -Command ^
    "$content = Get-Content '%%f' -Raw; ^
    $content = $content -replace '\"identifier\": \"mysticalagriculture:', '\"identifier\": \"strat:'; ^
    $content = $content -replace '\"mysticalagriculture:growth\":', '\"strat:growth_stage\":'; ^
    $content = $content -replace '\"mysticalagriculture:custom_crop\"', '\"strat:crop_controller\"'; ^
    $content = $content -replace '\"mysticalagriculture:none\"', '\"strat:none\"'; ^
    $content = $content -replace '\"farmland\"', '\"minecraft:farmland\"'; ^
    $content = $content -replace '\"mysticalagriculture:inferium_farmland\"', '\"strat:inferium_farmland\"'; ^
    $content = $content -replace '\"mysticalagriculture:prudentium_farmland\"', '\"strat:prudentium_farmland\"'; ^
    $content = $content -replace '\"mysticalagriculture:tertium_farmland\"', '\"strat:tertium_farmland\"'; ^
    $content = $content -replace '\"mysticalagriculture:imperium_farmland\"', '\"strat:imperium_farmland\"'; ^
    $content = $content -replace '\"mysticalagriculture:supremium_farmland\"', '\"strat:supremium_farmland\"'; ^
    $content = $content -replace 'q.block_state\(''mysticalagriculture:growth''\)', 'q.block_state(''strat:growth_stage'')'; ^
    Set-Content -Path '%%f' -Value $content"
)

echo All crop files have been updated to use the strat: namespace.
echo Press any key to exit...
pause > nul
