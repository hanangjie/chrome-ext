@echo off
set NODE_SCRIPT="g:/hzw/chrome-ext/pan/index.js"
set GIT_BASH_PATH="C:\Program Files\Git\git-bash.exe"

for /L %%i in (1,1,10) do (
  start "" %GIT_BASH_PATH% -c "node %NODE_SCRIPT% --worker=%%i"
)