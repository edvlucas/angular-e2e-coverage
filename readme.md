# Angular e2e coverage

Reference implementation/tutorial showing how to get code coverage reports from Angular e2e tests.

## Steps

1. Install pre-requisites

    * Docker
    * Node
    * Angular cli : npm install -g @angular/cli
    * Istanbul command line : npm i nyc -g

2. Create a root folder for your application and coverage scripts 

    md approot

3. Create a new Angular application using Angular CLI

    cd approot

    ng new angularapp

4. Create a coverage-sripts folder (at the root level, parallel to the angular app) and copy into it the contents of this project's "coverage-scripts" folder

5. Add OnComplete to e2e\protractor.conf.js

    ```js
    onComplete() {
        console.log('E2E finished - retrieving coverage from browser');
        browser.executeScript('return JSON.stringify(window.__coverage__);').then((v) => {
          console.log(`Script executed - coverage info length is ${v.length}`);
          require('fs').writeFile("../../coverage-output/.nyc_output/coverage.json", v, function (err) {
            if (err) {
              return console.log(err);
            }
            console.log("Coverage file extracted from server and saved to coverage.json");
          });
        })
    }
    ```
6. Switch to the coverage-scripts folder and run cov.bat
7. Open the html report at coverage-output\index.html

## How does it work

1. Nyc is used to instrument the transpiled js files
2. Protractor runs the e2e tests using the instrumented code. Istanbul adds the coverage information to the variable window.\_\_coverage\_\_
3. When the protractor tests finish (OnComplete), the content of the \_\_coverage\_\_ variable is retrieved from the browser and saved as a local coverage.json file
4. Nyc is used to create a lcov.info file based on coverage.json
5. Mapcov.js is used to translate the js file locations to ts file locations using the map files generated during the angular application compilation (ng build)
6. Lcov's genhtml command is used to create an html report based on the remapped lcov file

## To be improved

* Nyc should be able to use the source map files out-of the box, but I could not get it working. In the meanwhile,  the mapcov.js solution above is a workaround.
* Mapcov.js needs a list of all the available source-map files. This step can be automated and the list fetched dynamically from the dist folder.