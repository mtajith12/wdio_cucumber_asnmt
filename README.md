# This project shows to create and execute Cucumber BDD features using webdriverio and running them parallely.

## The framework is built using below tools:-

    1) Webdriverio
    2) Cucumber
    3) Typescript

## Browser Support :-

## For now the framework supports two browsers
    1) Chrome
    2) Internet Explorer 11

*Selenium is running using "Selenium-Standalone" as webdriverio service*

## Project stucture:-

    -config
        --wdio.conf.js
    -features
        --sample.feature
    -pages
        --pages.ts
    -steps
        --step_definition.ts
    -utils
        --Helper.ts
    -package.json
    -tsconfing.json

- config : folder for webdriverio config refer [Webdriverio](https://webdriver.io) for Webdriverio Configuration.
- features :  folder for feature files.
- pages : folder for storing pages as typescript files. Use these classes to store page locators and respective methods. Also page obejcts are created here.
- selenium-drivers : All the selenium drivers and server executables kept here.
- steps : folder for implementing step definitions. Import page files in here to access methods.
- utils : folder for storing helper classes. All the webdriverio related stuff happens here. Refer [API](https://webdriver.io/docs/api.html) for more details.
- package.json : npm build tool and dependency manager. All the dependencies are declared here along with scripts.
- tsconfig.json : typescript configurations go in this file.

## Steps:-

```bash
npm install
npm run test:chrome //to test on chrome
npm run test:ie // to test on IE
npm run test:sequential //to test sequentially on chrome and IE
```
### Fibers download issue

If npm install fails due to fibers build failing, this is because of proxy as fibers are build while connected to internet and download required dependencies.
However, if you are using node-8 and windows OS, then copy and paste the unzipped folder from "fibers-dependency" directory and place it inside, ./node_module/fibers/bin

Before that install node dependencies using npm install --ignore-scripts=true.

## Reporting: -

The framework publishes cucumberjs-json html reports at the end of test execution

 ```
1) open folder "coverage" which will be created
2) open index.html 
3) error screen shots will be generated inside folder "screen-shots"
```

## Environment

By default the tests will execute on dev3 environment, if someone wants to trigger the test on some different environment, please set environment variable "TESTENV"
Powershell : $env:TESTENV="cit"
CMD : set TESTENV="cit"
LINUX/MAC : export TESTENV="cit"

## Data based on environment

Update the data keywords with values inside file "data.json" inside folder "data". The environment is chosen based on the value of environment variable "TESTENV". 

## Executing tests on Internet explorer

By default internet explorer tests will execute on local system. Make sure you have 3.14.0-ia32-IEDriverServer.exe.
The above driver is available inside repository location tbos-ui-automation/selenium-drivers/iedriver.
Run the IEDriver using command
```
.\3.14.0-ia32-IEDriverServer.exe --port=8080
```
Note:- The port number can be any available port on your local system. Update the port inside wdio.ie.conf.js file if anything other than 8080 is used.

For executing the tests on Selenium Grid on Internet Explorer

set the envionment variable "grid_host" to the hostname of the grid server. 
For setting Environment variable refer to Environment section.

## Executing tests on chrome

By default the tests on chrome will execute on the local system headlessly on port 9515. To disbale headless execution
set environment variable "disableHeadless" to true.
For setting Environment variable refer to Environment section.

Make sure the chrome version on local system is v75 or above.

## Zypher Integration

By default nothing will be posted and updated in zypher tests.
If zypher integration is required make sure below steps are followed:-

```
1. Create the Test Cases in Zephyr
2. Create a Test Cycle named "Automated Tests"
3. Within the new Test Cycle create a Folder named after the browser being used for tests for instance if Chrome,
 create a folder named "chrome" and if IE create a folder named "internet explorer"
4. Add the Test Cases that have automated tests associated to them
5. Add @TC-XX tags within the title of your Automated Test/Scenario
6. set environment variable named "JIRA_AUTH_TOKEN", value of this token should be set to your lanid:password, if lanid:test and password is testpass set the value to "test:testpass"
7. execute the tests
```
For setting Environment variable refer to Environment section.
Some extra options needs to be passed for making zypher integration work, contact phillip.hicks@anz.com or mayank.chincholkar@anz.com to learn more.

## CICD

1) Jenkins Job :- https://jenkinsci-transactivemobile-cobra-e2e3.apps.cpaas.service.test/job/cobra-ui-test

## References
1. webdriverIo -https://webdriver.io/
