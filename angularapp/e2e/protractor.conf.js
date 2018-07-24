// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  },
  onComplete() {
    console.log('E2E finished - retrieving coverage from browser');
    browser.executeScript('return JSON.stringify(window.__coverage__);').then((v) => {
      console.log(`Script executed - the return value length is ${v.length}`);
      require('fs').writeFile("../../coverage-output/.nyc_output/coverage.json", v, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("Coverage file extracted from server and saved to coverage.json");
      });
    })
  }
};
