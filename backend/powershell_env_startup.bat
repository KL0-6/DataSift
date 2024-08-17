@echo off
cd %~dp0

path C:\xampp\apache\bin;%path%
path C:\xampp\perl\bin;%path%
path C:\tools\ruby33\bin;%path%
path C:\LLVM\bin;%path%
path %ProgramFiles%\CMake\bin;%path%
path %ProgramFiles(x86)%\Microsoft Visual Studio\Installer;%path%
for /F "usebackq delims=" %%I in (`vswhere.exe -latest -property installationPath`) do set VSPATH=%%I

rem set WEBKIT_LIBRARIES=%~dp0WebKitLibraries\win
path %~dp0WebKit\WebKitLibraries\win\bin64;%path%
set WEBKIT_TESTFONTS=%~dp0Tools\WebKitTestRunner\fonts
set DUMPRENDERTREE_TEMP=%TEMP%

set CC=clang-cl
set CXX=clang-cl

rem set http_proxy=http://your-proxy:8080
rem set https_proxy=%http_proxy%

rem You can pass necessary JSC options https://github.com/WebKit/WebKit/blob/main/Source/JavaScriptCore/runtime/OptionsList.h#L83-L607.
rem set JSC_dumpOptions=1
rem set JSC_useJIT=0
rem set JSC_useDFGJIT=0
rem set JSC_useRegExpJIT=0
rem set JSC_useDOMJIT=0

rem You can show check TextureMapper FPS via WEBKIT_SHOW_FPS.
rem set WEBKIT_SHOW_FPS=1

call "%VSPATH%\VC\Auxiliary\Build\vcvars64.bat"
cd %~dp0
start powershell