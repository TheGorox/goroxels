@echo off
setlocal


set "PROJECT_DIR=%~dp0"
set "PROJECT_CONF=%PROJECT_DIR%\..\nginx\dev.conf"
set "NGINX_CONF_ROOT=H:\nginx\conf"

mklink "%NGINX_CONF_ROOT%\nginx.conf" "%PROJECT_CONF%"

echo Done.
pause