const wdioParallel = require('wdio-cucumber-parallel-execution');
let tag
if (process.env.TESTENV.toString().includes('dev') || process.env.TESTENV.toString().includes('test1'))
{
    tag="@dev"
}else if (process.env.TESTENV.toString().includes('cit'))
{
    tag="@dev"
}else {
    tag = "@" + process.env.TESTENV
}

wdioParallel.performSetup({
    sourceSpecDirectory:'./features/**/**',
    tmpSpecDirectory: './consolidated',
    lang: 'en',
    tagExpression:tag,
    cleanTmpSpecDirectory: true
});
