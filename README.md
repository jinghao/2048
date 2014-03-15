= Unit tests = 

* Install jasmine-node: https://github.com/mhevery/jasmine-node
* Add tests to tests folders
* Run `jasmine-node --matchall js/__tests__/` to run all tests in that directory

= Building the Bundle =

Run `browserify js/application.js -o js/bundle.js`