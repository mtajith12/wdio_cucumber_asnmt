def CURRENT_DATE = new Date()
def CURRENT_TIME = CURRENT_DATE.format("HH:mm:ss")
def BRANCH_NAME = null
def paramsList = []
def isCOBRABranch = null;
def isOIMBranch = null;
if (env.BRANCH_NAME.contains("/")) {
    def tokens = env.BRANCH_NAME.tokenize('/')
    BRANCH_NAME = tokens[tokens.size() - 1]
} else {
    BRANCH_NAME = env.BRANCH_NAME
}

def isNotPRBranch = !BRANCH_NAME.startsWith('PR-')

if(isNotPRBranch){
    isCOBRABranch = false;
    isOIMBranch = false;
}else{
isCOBRABranch = env.CHANGE_BRANCH.contains('ONAR')
isOIMBranch = env.CHANGE_BRANCH.contains('AAMS')
}
def email_recipients = "WDCD-COBRA@anz.com"

paramsList.add(booleanParam(defaultValue: true, description: 'Skip Tests on IE?', name: 'SKIP_IE'))
paramsList.add(booleanParam(defaultValue: true, description: 'uncheck to skip CA DB validation', name: 'DB_CHECK'))
paramsList.add(booleanParam(defaultValue: false, description: 'Archive the Screenshots', name: 'STORE_SCREENSHOTS'))
paramsList.add(string(defaultValue: '@dev', description: 'cucumber Tags for modules to be executed', name: 'cobraModuleTags'))
paramsList.add(string(defaultValue: '@OIM', description: 'cucumber Tags for modules to be executed for OIM tests', name: 'oimModuleTags'))


if(CURRENT_TIME >= "17:30:00" && CURRENT_TIME <= "21:00:00" && isNotPRBranch) {
    paramsList.add(booleanParam(defaultValue: true, description: '', name: 'report_To_Zephyr'))
    echo "Current BRANCH_NAME - ${CURRENT_TIME >= "17:30:00"}-${CURRENT_TIME <= "21:00:00"}-${isNotPRBranch}"
} else {
    paramsList.add(booleanParam(defaultValue: false, description: '', name: 'report_To_Zephyr'))
}
if(isCOBRABranch){
  paramsList.add(string(defaultValue: 'dev3', description: 'it should be either of one value dev3,dev2,cit,e2e,test1,e2e3,dev1', name: 'Test_Environment', trim: false))
  paramsList.add(booleanParam(defaultValue: false, description: 'Skip COBRA Tests?', name: 'SKIP_COBRA'))
  paramsList.add(booleanParam(defaultValue: true, description: 'Skip OIM Tests?', name: 'SKIP_OIM'))
} else if(isOIMBranch){
  paramsList.add(string(defaultValue: 'test1', description: 'it should be either of one value dev3,dev2,cit,e2e,test1,e2e3,dev1', name: 'Test_Environment', trim: false))
  paramsList.add(booleanParam(defaultValue: true, description: 'Skip COBRA Tests?', name: 'SKIP_COBRA'))
  paramsList.add(booleanParam(defaultValue: false, description: 'Skip OIM Tests?', name: 'SKIP_OIM'))
}
else{
  paramsList.add(string(defaultValue: 'dev3', description: 'it should be either of one value dev3,dev2,cit,e2e,test1,e2e3', name: 'Test_Environment', trim: false))
  paramsList.add(booleanParam(defaultValue: true, description: 'Skip OIM Tests?', name: 'SKIP_OIM'))
  paramsList.add(booleanParam(defaultValue: false, description: 'Skip COBRA Tests?', name: 'SKIP_COBRA'))
}
/* Xray parameters for COBRA tests*/
paramsList.add(booleanParam(defaultValue: false, description: 'Import execution results to Xray', name: 'IMPORT_COBRA_XRAY_RESULTS'))
paramsList.add(string(defaultValue: 'ONAR', description: 'JIRA project key for Xray results', name:'COBRA_JIRA_PROJECT_KEY'))
paramsList.add(string(defaultValue: 'Regression Test for 20.5 release', description: 'Name of Xray Test Execution issue', name:'COBRA_XRAY_TEST_EXECUTION_NAME'))
paramsList.add(string(defaultValue: 'COBRA 20.5', description: 'JIRA Fix Version', name:'COBRA_JIRA_FIX_VERSION'))
paramsList.add(string(defaultValue: 'ONAR-5981', description: 'Link execution to Test Plan', name:'COBRA_linkToTestPlan'))

/* Xray parameters for OIM tests*/
paramsList.add(booleanParam(defaultValue: false, description: 'Import execution results to Xray', name: 'IMPORT_OIM_XRAY_RESULTS'))
//paramsList.add(string(defaultValue: 'AAMS-1420', description: 'Xray Test Issue to execute', name:'xrayJiraIssue'))    // To be used later when exporting feature files from Xray
paramsList.add(string(defaultValue: 'AAMS', description: 'JIRA project key for Xray results', name:'OIM_JIRA_PROJECT_KEY'))
paramsList.add(string(defaultValue: 'COBRA UI Tests', description: 'Name of Xray Test Execution issue', name:'OIM_XRAY_TEST_EXECUTION_NAME'))
paramsList.add(string(defaultValue: 'FR 0.3', description: 'JIRA Fix Version', name:'OIM_JIRA_FIX_VERSION'))
paramsList.add(string(defaultValue: 'AAMS-1420', description: 'Link execution to Test Plan', name:'OIM_linkToTestPlan'))

properties([
    /*Discards builds older than 10 days. Checks after any build is run*/
    buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '5', numToKeepStr: '')),
    parameters(paramsList),

     pipelineTriggers([cron(isNotPRBranch ? 'H 19 * * *' : '')]),

])
if(!isNotPRBranch) {
    email_recipients = emailextrecipients([ [$class: 'CulpritsRecipientProvider'], [$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider'] ])
    email_recipients = email_recipients.replaceAll(" ", ",")
}
def email_subject = "UI Automation : Branch ${env.BRANCH_NAME} : Build ${BUILD_ID} : Env ${params.Test_Environment} has finished with a result of:"
def email_message = "Link to the Cobra Automation results: ${BUILD_URL}Cobra_20UI_20report/"

pipeline {
    agent {
        label "ddtb-automation"
    }
    environment {
        grid_host = 'APPAU101MEL1050.globaltest.anz.com'
        SKIP_COBRA ='${params.SKIP_COBRA}'
        SKIP_OIM ='${params.SKIP_OIM}'
        STORE_SCREENSHOTS='${params.STORE_SCREENSHOTS}'
        DB_CHECK ='${params.DB_CHECK}'

    }
    stages {
        stage('install') {
            steps {
                dir("${WORKSPACE}") {
                    sh "bash -x ./prepare.sh"

                }
            }
        }
        stage('test:chrome') {
            parallel {
                stage('test:chrome:cobra') {
                when {
                                        expression {
                                            return !params.SKIP_COBRA;
                                        }
                                    }
                    steps {
                        dir("${WORKSPACE}") {


                                    sh "npm run reports:clean"
                                    sh "npm run test:chrome-${params.Test_Environment} -- --cucumberOpts.tagExpression='${params.cobraModuleTags}'"


                        }
                    }
                }
                stage('test:chrome:oim') {
                    when {
                        expression {
                            return !params.SKIP_OIM;
                        }
                    }
                    steps {
                        dir("${WORKSPACE}") {
                            sh "npm run reports:oim:clean"
                            sh "npm run test:chrome:oim-${params.Test_Environment} -- --cucumberOpts.tagExpression='${params.oimModuleTags} and not @ignore and not @ignoreForDev2'"
                        }
                    }
                }
            }
        }
        stage('test:ie') {
            parallel {
                stage('test:ie:cobra'){
                    when {
                        expression {
                            return (!params.SKIP_IE)&& (!params.SKIP_COBRA);
                        }
                    }
                    steps {
                        dir("${WORKSPACE}") {

                                    sh "npm run test:ie-${params.Test_Environment} -- --cucumberOpts.tagExpression='${params.cobraModuleTags}'"


                        }
                    }
                }
                stage('test:ie:oim'){
                    when {
                        expression {
                            return (!params.SKIP_IE) && (!params.SKIP_OIM);
                        }
                    }
                    steps {
                        dir("${WORKSPACE}") {
                            sh "npm run test:ie:oim-${params.Test_Environment} -- --cucumberOpts.tagExpression='${params.oimModuleTags} and not @ignore and not @ignoreForDev2'"
                        }
                    }
                 }
            }
        }
    }
    post {
        always {
            dir("${WORKSPACE}") {
               script {
                 sh "npm run after"
               if (!params.SKIP_COBRA) {

                sh "npm run report:generate"
                publishHTML(target: [
                reportName           : 'Cobra UI report',
                reportDir            : 'coverage',
                reportFiles          : 'index.html',
                keepAll              : true,
                alwaysLinkToLastBuild: true,
                allowMissing         : false
                ])
                 if (params.STORE_SCREENSHOTS){
                archiveArtifacts 'screen-shots/*.*,json-report/*.*'
                }
                }
                if (!params.SKIP_OIM) {
             archiveArtifacts 'screen-shots/*.*,oim-json-report/*.*'
                        sh "npm run report:oim:generate"
                        publishHTML(target: [
                        reportName           : 'Cobra UI OIM report',
                        reportDir            : 'coverage_OIM',
                        reportFiles          : 'index.html',
                        keepAll              : true,
                        alwaysLinkToLastBuild: true,
                        allowMissing         : false
                        ])
                        archiveArtifacts 'screen-shots/*.*,oim-json-report/*.*'
                    }
                }
                                checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'github-key', url: 'https://github.service.anz/WDCD/wdcd-platform.git']]]
                                    withCredentials([usernamePassword(credentialsId: 'Email_Notifications', passwordVariable: 'EMAIL_PASSWORD', usernameVariable: 'EMAIL_USERNAME')]) {
                                            sh "python common/src/main/resources/email_utility.py 'applicationrelay.corp.anz.com' 25 'WDCD_PLATFORM_DO_NOT_REPLY@anz.com' '${email_recipients}' '${email_subject}${currentBuild.currentResult}' '${email_message}' '${EMAIL_PASSWORD}' '${EMAIL_USERNAME}'"

            script {
                if (params.IMPORT_COBRA_XRAY_RESULTS || params.IMPORT_OIM_XRAY_RESULTS) {
                    stage('Get Jira Instance') {
                        def jiraServerDetailsOutput = sh returnStdout: true, script: 'curl --insecure -X GET \'https://jenkinsci-transactivemobile-cobra-e2e3.apps.cpaas.service.test/descriptorByName/com.xpandit.plugins.xrayjenkins.task.XrayImportBuilder/fillServerInstanceItems\''
                        def jiraServerDetails = readJSON text: "${jiraServerDetailsOutput}"
                        jiraInstanceID = jiraServerDetails.values[0].value
                    }
                }
            }

            script {
                if (params.IMPORT_OIM_XRAY_RESULTS) {
                    stage('Import results to Xray for OIM tests') {
                        def report = readFile 'coverage_OIM/merged-output.json'
                        report = report.replaceAll("\"line\": \"\"", "\"line\": null")      //the Xray importer seems to break when the JSON report contains "line": ""
                        writeFile file: "oim-json-reports/cucumber.json", text: report
                        def CURRENT_DATETIME = CURRENT_DATE.format("yyyy-MM-dd'T'HH:mm:ss.SSSZ")
                        step([$class: 'XrayImportBuilder', endpointName: '/cucumber/multipart', importFilePath: 'oim-json-reports/cucumber.json', importInfo: '''{
                            "fields": {
                                "project": {
                                    "key": "''' + "${params.OIM_JIRA_PROJECT_KEY}" + '''"
                                },
                                "summary": "''' + "${params.OIM_XRAY_TEST_EXECUTION_NAME}" + '''",
                                "issuetype": {
                                    "id": "20302"
                                },
                                "customfield_35097": "''' + "${CURRENT_DATETIME}" + '''",            // Begin Date
                                "customfield_35098": "''' + "${CURRENT_DATETIME}" + '''",            // End Date
                                "customfield_35105": ["''' + "${params.Test_Environment}" + '''"],    // Test Environments
                                "customfield_35107": ["''' + "${params.OIM_linkToTestPlan}" + '''"],     // Test Plan
                                "fixVersions": [
                                    {
                                        "name": "''' + "${params.OIM_JIRA_FIX_VERSION}" + '''"
                                    }
                                ],
                                "description": "''' + "${BUILD_URL}" + '''"
                            }
                        }''', inputInfoSwitcher: 'fileContent', serverInstance: "${jiraInstanceID}"])
                    }
                }
                if (params.IMPORT_COBRA_XRAY_RESULTS) {
                    stage('Import results to Xray for COBRA tests') {
                        def report = readFile 'coverage/merged-output.json'
                        report = report.replaceAll("\"line\": \"\"", "\"line\": null")      //the Xray importer seems to break when the JSON report contains "line": ""
                        writeFile file: "json-report/cucumber.json", text: report
                        def CURRENT_DATETIME = CURRENT_DATE.format("yyyy-MM-dd'T'HH:mm:ss.SSSZ")
                        step([$class: 'XrayImportBuilder', endpointName: '/cucumber/multipart', importFilePath: 'json-report/cucumber.json', importInfo: '''{
                            "fields": {
                                "project": {
                                    "key": "''' + "${params.COBRA_JIRA_PROJECT_KEY}" + '''"
                                },
                                "summary": "''' + "${params.COBRA_XRAY_TEST_EXECUTION_NAME}" + '''",
                                "issuetype": {
                                    "id": "20302"
                                },
                                "customfield_35097": "''' + "${CURRENT_DATETIME}" + '''",            // Begin Date
                                "customfield_35098": "''' + "${CURRENT_DATETIME}" + '''",            // End Date
                                "customfield_35105": ["''' + "${params.Test_Environment}" + '''"],    // Test Environments
                                "customfield_35107": ["''' + "${params.COBRA_linkToTestPlan}" + '''"],     // Test Plan
                                "fixVersions": [
                                    {
                                        "name": "''' + "${params.COBRA_JIRA_FIX_VERSION}" + '''"
                                    }
                                ],
                                "description": "''' + "${BUILD_URL}" + '''"
                            }
                        }''', inputInfoSwitcher: 'fileContent', serverInstance: "${jiraInstanceID}"])
                    }
                }
            }
        }
    }
} }
}
