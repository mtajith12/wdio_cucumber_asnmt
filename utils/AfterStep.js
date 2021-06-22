
const wdioParallel = require('wdio-cucumber-parallel-execution');
const fs = require('fs-extra');
const _ = require('lodash')
if(fs.existsSync('./oim-json-reports')) {
    console.log("iam inside this")
    let consolidatedJsonArray = wdioParallel.getConsolidatedData({
        parallelExecutionReportDirectory: './oim-json-reports'
    });
    for (var i in consolidatedJsonArray) {
        consolidatedJsonArray[i].elements = _.uniqBy((consolidatedJsonArray[i].elements), function (x) {
            return x.id && x.name
        })
    }
    fs.ensureDirSync('./oim-json-report');
    fs.writeFileSync('./oim-json-report/json-report.json', JSON.stringify(consolidatedJsonArray))
}
if(fs.existsSync('./json-reports')) {
    let consolidatedJsonArray = wdioParallel.getConsolidatedData({
        parallelExecutionReportDirectory: './json-reports'
    });
    for (var i in consolidatedJsonArray) {
        consolidatedJsonArray[i].elements = _.uniqBy((consolidatedJsonArray[i].elements), function (x) {
            return x.id && x.name
        })
    }
    fs.ensureDirSync('./json-report');
    fs.writeFileSync('./json-report/json-report.json', JSON.stringify(consolidatedJsonArray))
}
