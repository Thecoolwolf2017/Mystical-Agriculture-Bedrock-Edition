@echo off
setlocal enabledelayedexpansion

echo Starting seed category update process...
echo.

set "SEEDS_DIR=%~dp0..\items\seeds"
echo Looking for seed files in: %SEEDS_DIR%

if not exist "%SEEDS_DIR%" (
    echo Seeds directory not found: %SEEDS_DIR%
    exit /b 1
)

set "COUNT=0"
set "UPDATED=0"

for %%F in ("%SEEDS_DIR%\*.json") do (
    set /a COUNT+=1
    set "FOUND=0"
    
    for /f "usebackq tokens=1* delims=:" %%A in ("%%F") do (
        set "LINE=%%B"
        if "!LINE!" == "" set "LINE=%%A"
        
        echo !LINE! | findstr /C:"\"category\": \"equipment\"" > nul
        if !ERRORLEVEL! equ 0 (
            set "FOUND=1"
            set "FILE=%%~nxF"
        )
    )
    
    if !FOUND! equ 1 (
        echo Updating category for !FILE!
        
        set "TEMP_FILE=%TEMP%\temp_seed_file.json"
        
        type "%%F" | powershell -Command "$input | ForEach-Object { $_ -replace '\"category\": \"equipment\"', '\"category\": \"items\"' }" > "!TEMP_FILE!"
        copy /y "!TEMP_FILE!" "%%F" > nul
        del "!TEMP_FILE!"
        
        set /a UPDATED+=1
    )
)

echo.
echo Summary: Updated %UPDATED% of %COUNT% seed files
echo All seed items now use the "items" category to match the item catalog

endlocal
