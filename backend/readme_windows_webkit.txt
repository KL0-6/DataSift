Follow instructions on https://docs.webkit.org/Ports/WindowsPort.html for Chocolatey
ignore the `git config --global core.autocrlf input` step

Run the following in datasift/backend:

git clone --recursive --depth 1 https://github.com/webKit/WebKit/

checkout will likely have errors, but it's only web platform tests. ignore
If you have Swift for Windows installed, please remove it from system PATH temporarily for this hackathon!
Reopen VSCode or whichever has the old ENV variables...

Manually go to 
C:\tools\rubyXX\lib\
Observe libx64-ucrt-rubyXXX.dll.a
Create a copy, and rename the copy to `libruby.a`

./powershell_env_startup.bat

cd WebKit\
perl Tools/Scripts/build-webkit --release