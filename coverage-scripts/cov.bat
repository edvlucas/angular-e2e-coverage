REM REM Makes sure that Istanbul command line is installed
REM call npm i nyc -g

REM Build
cd ..\angularapp
rd dist /s /q
call ng build --output-path .\dist\angularapp
cd ..\coverage-scripts

REM Reset previous instrumentation
rd ..\coverage-output /s /q
xcopy ..\angularapp\dist ..\coverage-output\ /s /y
xcopy ..\angularapp\src ..\coverage-output\src\ /s /y

REM Instrument and serve the app
cd ..\coverage-output
call nyc instrument ../angularapp/dist . --exclude-after-remap=false
start docker run -it --rm -p 4200:8080 -v %cd%/angularapp:/public --name artserver danjellz/http-server

REM Run the ART and stop the server
cd ..\angularapp\e2e
md ..\..\coverage-output\.nyc_output
call protractor
docker stop artserver

REM Convert the JSON report to LCOV
cd ..\..\coverage-output
call nyc report --reporter=lcov --report-dir=..\coverage-output

REM Use the source-maps to remapthe lcov file to the source TS files
cd ..\coverage-scripts
call npm init
call npm i lcov-sourcemap
call node mapcov.js

REM REM Generate and open the html version of lcov
call docker run -it -v %cd%/../angularapp/node_modules:/app/node_modules -v %cd%/../coverage-output:/app kaskada/lcov /bin/sh -c "cd app && genhtml lcov-map.info"
start ..\coverage-output\index.html
