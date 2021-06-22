const report = require('multiple-cucumber-html-reporter');

report.generate({
    reportName:
        "<div style='height:91px'><div style='height: 7em; background: #004165; white-space: nowrap; margin-left: -15px; position: absolute; left: 0; right: 0;' role='banner'><div style='display: inline-block; vertical-align: top; height: 7em; width: 12.7em; margin: 0 0 0 3em; background: url(data:image/png;base64,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) 0 1.4em no-repeat; background-size: contain;' role='img' aria-label='ANZ Logo'></div><div style='display: inline-block; vertical-align: top; margin: 1.9em 0 0 .75em; color: #FFF; font-weight: 500; font-style: normal; font-size: 2rem; white-space: nowrap;'>Automation Report</div></div></div>",
    pageTitle: "Automation Report",
    pageFooter: " ",
    jsonDir: "oim-json-report",
    reportPath: "coverage_OIM",
    saveCollectedJSON:'true',
    displayDuration: true,
    durationInMS: false,
    saveCollectedJSON: true,
    customData: {
        title: "Run info",
        data: [
            {label: "Project", value: "COBRA UI OIM test"},
            {label: "Squad", value: "CAAS"}
        ]
    }
});
