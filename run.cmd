@echo off
:START
set /P bots="Bot amount... "
node . %bots%
PAUSE
goto START