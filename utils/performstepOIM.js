const wdioParallel = require('wdio-cucumber-parallel-execution');

wdioParallel.performSetup({
    sourceSpecDirectory:'./features/Caas/**',
    tmpSpecDirectory: './oimConsolidated',
    lang: 'en',
    cleanTmpSpecDirectory: true
});
