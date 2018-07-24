var lcovSourcemap = require("lcov-sourcemap");

lcovSourcemap.writeLcov("../coverage-output/lcov.info", {
  main: "../coverage-output/angularapp/main.js.map",
  polyfills: "../coverage-output/angularapp/polyfills.js.map",
  runtime: "../coverage-output/angularapp/runtime.js.map",
  styles: "../coverage-output/angularapp/styles.js.map",
  vendor:"../coverage-output/angularapp/vendor.js.map"
}, "../coverage-output/", "../coverage-output/lcov-map.info").then(function () {
  console.log('lcov-map.info file based on source maps created')
});
