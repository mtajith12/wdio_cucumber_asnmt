
'use strict';

const find = require('find');
const fs = require('fs-extra');
const jsonFile = require('jsonfile');
const path = require('path');
const _ = require('lodash');

(function () {
    let files;
    const reportDir = "./json-report/";
    try {
        files = find.fileSync(/\.json$/, path.resolve(process.cwd(), reportDir));
    } catch (e) {
        throw new Error(`There were issues reading JSON-files from '${reportDir}'.`);
    }
    let platformName = process.platform;
    const device = platformName.charAt(0).toUpperCase() + platformName.slice(1);

    if (platformName === 'darwin') {
        platformName = 'osx';
    } else if (platformName.startsWith('win')) {
        platformName = 'windows';
    }

    const platform = { name: platformName, version: process.arch };

    if (files.length > 0) {
        files.map(file => {
            const jsonOutput = [];
            const browser = file.indexOf("firefox") !== -1 ? 'firefox' : 'chrome';
            const browserVersin = browser === "firefox" ? "65.0b13 (64-bit)" : "74.0.3723.0 (64-bit)";
            const data = fs.readFileSync(file).toString() || "[]";

            const metadata = { browser: { name: browser, version: browserVersin }, device, platform }

            JSON.parse(data).map(feature => {
                if (!feature.metadata) {
                    feature = Object.assign({metadata}, feature);
                }

                jsonOutput.push(feature)
            });

//             var uniqueList = _.uniqBy(jsonOutput[0].elements,function(x){ return x.id && x.name})
//             logger.info(uniqueList)
// //            _.replace( jsonOutput[0].elements,uniqueList);
// //
// // logger.info((jsonOutput))
            const outFile = path.resolve('./json-report/', file);
            fs.ensureDirSync('./json-report');
            jsonFile.writeFileSync(outFile, jsonOutput, { spaces: 2 });
        });    }
})();
