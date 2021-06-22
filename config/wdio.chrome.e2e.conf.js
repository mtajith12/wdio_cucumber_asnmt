var fs = require("fs");
var rimraf = require("rimraf");
const path = require('path')
const video = require("wdio-video-reporter");
var log4js = require("log4js");
var logger = log4js.getLogger();
logger.level = "debug";
//  process.env.DB_CHECK = false
// process.env.SKIP_OIM = true
let jiraAuthToken
global.downloadDir = path.join(__dirname, '/../ReportDownload');
if (process.env.jiraAuthToken !== undefined) {
    if (process.env.jiraAuthToken.includes(':')) {
        jiraAuthToken = Buffer.from(process.env.jiraAuthToken).toString('base64');
    } else jiraAuthToken = process.env.jiraAuthToken;
}


function rmdir(dir) {
    var list = fs.readdirSync(dir);
    for(var i = 0; i < list.length; i += 1) {
        var filename = path.join(dir, list[i]);
        var stat = fs.statSync(filename);
        
        if(filename == "." || filename == "..") {
            // pass these files
        } else if(stat.isDirectory()) {
            // rmdir recursively
            rmdir(filename);
        } else {
            // rm fiilename
            fs.unlinkSync(filename);
        }
    }
}
exports.config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    //
    // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
    // on a remote machine).
    runner: "local",
    hostname: "localhost",
    port: 9515,
    path: "/",
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called. Notice that, if you are calling `wdio` from an
    // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
    // directory is where your package.json resides, so `wdio` will be called from there.
    //
    specs: ["./features/**/*.feature"],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: 9,
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://docs.saucelabs.com/reference/platforms-configurator
    //
    capabilities: [
        {
            // maxInstances can get overwritten per capability. So if you have an in-house Selenium
            // grid with only 5 firefox instances available you can make sure that not more than
            // 5 instances get started at a time.
            maxInstances: 9,
            //
            browserName: "chrome",
            "goog:chromeOptions": process.env.disableHeadless
                ? { prefs: {
                        'directory_upgrade': true,
                        'prompt_for_download': false,
                        'download.default_directory': downloadDir
                    },
                    args: [
                        "--ignore-certificate-errors",
                        "--test-type",
                        "--incognito"
                    ]
                }
                : { prefs: {
                        'directory_upgrade': true,
                        'prompt_for_download': false,
                        'download.default_directory': downloadDir
                    },
                    args: [
                        "--headless",
                        "--disable-gpu",
                        "--window-size=1640,1050",
                        "--disable-dev-shm-usage",
                        "--no-sandbox",
                        "--ignore-certificate-errors",
                        "--test-type",
                        "--incognito"
                    ]
                }
        }
    ],
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: "silent",
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner, @wdio/lambda-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/applitools-service': 'info'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    //baseUrl:
    //    "https://tbos.e2etransactive.online.ecom.anz",
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 15000,
    //
    // Default timeout in milliseconds for request
    // if Selenium Grid doesn't send response
    connectionRetryTimeout: 90000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    services: ["chromedriver"],
    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks.html
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: "cucumber",
    cucumberOpts: {
        backtrace: false,   // <boolean> show full backtrace for errors
        compiler: [],       // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
        dryRun: false,      // <boolean> invoke formatters without executing steps

        format: ['pretty'], // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
        colors: true,       // <boolean> disable colors in formatter output
        snippets: true,     // <boolean> hide step definition snippets for pending steps
        source: true,       // <boolean> hide source URIs
        profile: [],        // <string[]> (name) specify the profile to use
        name: [],           // Only execute the scenarios with name matching the expression (repeatable)

        timeout: 600000,
        requireModule: [
            "tsconfig-paths/register",
            () => {
                require("ts-node").register({files: true});
            }
        ],
        ailAmbiguousDefinitions: true,
        failFast: false,
        ignoreUndefinedDefinitions: false,
        require: [
            "./steps/**/*.ts"
            // "./node_modules/zephyr-results-poster-cucumberjs"
        ],
        strict: true,
        tagExpression: "@e2e and not @wip and not @ignore",
        tagsInTitle: true
        // profile: 'zephyr-cucumber'
    },
    //
    // The number of times to retry the entire specfile when it fails as a whole
    specFileRetries:3,
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter.html
    reporters: [
        "dot",
        "spec",
        ['mochawesome',{
            outputDir: './Results',
            outputFileFormat: function(opts) {
                return `results.json`
            }
        }],
        [
            "junit",
            {
                outputDir: "./junit-results/",
                outputFileFormat: function (options) {
                    return `results-${options.cid}.xml`;
                }
            }
        ],
        ['cucumberjs-json', {
            jsonFolder: './json-reports',
            language: 'en',
        },
        ],
    ],
    screenshotPath: "./screen-shots/",
    allurePath: "./allure-results",
    //
    // Options to be passed to Mocha.
    // See the full list at http://mochajs.org/
    // mochaOpts: {
    //     ui: 'bdd',
    //     timeout: 600000
    // },
    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    /**
     * Gets executed once before all workers get launched.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    onPrepare: async function (config, capabilities) {
        if (!fs.existsSync(this.screenshotPath)) {
            fs.mkdirSync(this.screenshotPath);
        }
        if (!fs.existsSync(downloadDir)){
            // if it doesn't exist, create it
            fs.mkdirSync(downloadDir);
        }else{
            rmdir(downloadDir)
        }
    },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    // beforeSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    before: function (capabilities, specs) {
        // require("ts-node").register({files: true});
    },
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },
    /**
     * Hook that gets executed before the suite starts
     * @param {Object} suite suite details
     */
    // beforeSuite: function (suite) {
    // },
    /**
     * Function to be executed before a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
     * @param {Object} test test details
     //  */
    // beforeTest: function (test) {
    // },
    /**
     * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
     * beforeEach in Mocha)
     */
    // beforeHook: function () {
    // },
    /**
     * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
     * afterEach in Mocha)
     */
    // afterHook: function () {
    // },
    /**
     * Function to be executed after a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
     * @param {Object} test test details
     */
    afterTest: async function (test) {
        await browser.pause(2000)
    }
    /**
     * Hook that gets executed after the suite has ended
     * @param {Object} suite suite details
     */
    // afterSuite: function (suite) {
    // },
    /**
     * Runs after a WebdriverIO command gets executed
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {Number} result 0 - command success, 1 - command error
     * @param {Object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {Number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // after: function (result, capabilities, specs) {
    // },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // afterSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     * @param {Object} exitCode 0 - success, 1 - fail
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    // onComplete: function(exitCode, config, capabilities, results) {
    // },
    /**
     * Gets executed when a refresh happens.
     * @param {String} oldSessionId session ID of the old session
     * @param {String} newSessionId session ID of the new session
     */
    //onReload: function(oldSessionId, newSessionId) {
    //}

    // beforeFeature: function (uri, feature) {
    // },

    // beforeScenario: function (uri, feature, scenario) {
    // },

    // beforeStep: function (uri, feature, scenario, step) {
    // },

    // afterStep: function (uri, feature, scenario, step, result) {
    // },

    // afterScenario: function (uri, feature, scenario) {
    // },

    // afterFeature: function (uri, feature) {
    // }
};
