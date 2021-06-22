import _ = require('lodash');
import { Given } from 'cucumber';
import { userRegService } from 'src/UserRegService';
import { oauthToken } from 'src/OauthTokenViaApi';
import { randomData } from 'src/RandomData';
const dataReader = require('src/DataReader');
import { getLogger } from 'log4js';
import { orgRegService } from 'api/OrgRegService';
const logger = getLogger();

Given(/^"([^"]*)" deletes the "(\d+)(?:st|nd|rd|th)" API created org$/, async function(user, n) {
    const bankuser = dataReader.getBankUser(user);
    const response = await orgRegService.deleteCaasOrg(bankuser, this.orgs[n-1].id, this.orgs[n-1].version)
    // save updated org info into scenario context
    this.orgs[n - 1]['status'] = response['i18nStatus'];
    this.orgs[n - 1]['workflow'] = response['i18Workflow'];
    this.orgs[n - 1]['version'] = response['version'];
    logger.info(`Org is deleted: ${JSON.stringify(this.orgs[n - 1])}`);
}); 
