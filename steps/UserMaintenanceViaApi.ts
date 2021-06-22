import _ = require('lodash');
import { Given } from 'cucumber';
import { userRegService } from 'src/UserRegService';
import { oauthToken } from 'src/OauthTokenViaApi';
import { randomData } from 'src/RandomData';
const dataReader = require('src/DataReader');
import { getLogger } from 'log4js';
const logger = getLogger();

function formatSecurityDevicesRequestedDate(userData) {
  if (userData['securityDevices']) {
    for (var i = 0; i < userData.securityDevices.length; i++) {
      userData.securityDevices[i].requestedDate = randomData.formatDate(new Date(userData.securityDevices[i].requestedDate));
    }
  }
}

Given(/^"([^"]*)" approves the "(\d+)(?:st|nd|rd|th)" created user$/, async function(user, n) {
  const bankuser = dataReader.getBankUser(user);
  const userData = (this.users && this.users.length >= n) ? this.users[n - 1] : this.userData;
  const updatedUserData = await userRegService.approveCustomerUser(bankuser, userData.id, userData.version);
  // save updated User info into scenario context
  userData['status'] = updatedUserData['i18nStatus'];
  userData['workflow'] = updatedUserData['i18nWorkflow'];
  userData['version'] = updatedUserData['version'];
  userData['lastEvent'] = updatedUserData['i18nLastEvent'];
  userData['applications'] = userRegService.getAppInfoFromPayload(updatedUserData);
  // update security devices data for User
  const accessToken = await oauthToken.getAccessToken(bankuser);
  const userDetails = await userRegService.getCustomerUserDetailsById(accessToken, userData['id']);
  userData['securityDevices'] = userDetails['securityDevices'] ? userDetails['securityDevices'] : [];
  formatSecurityDevicesRequestedDate(userData);
  
  logger.info(`User is approved: ${JSON.stringify(userData)}`);
}); 

Given(/^"([^"]*)" disables the "(\d+)(?:st|nd|rd|th)" API created user$/, async function(user, n) {
  const bankuser = dataReader.getBankUser(user);
  const response = await userRegService.disableCustomerUser(bankuser, this.users[n - 1].id, this.users[n - 1].version);
  // save updated User info into scenario context
  this.users[n - 1]['status'] = response['i18nStatus'];
  this.users[n - 1]['workflow'] = response['i18nWorkflow'];
  this.users[n - 1]['version'] = response['version'];
  this.users[n - 1]['applications'] = userRegService.getAppInfoFromPayload(response);
  // update security devices data for User
  const accessToken = await oauthToken.getAccessToken(bankuser);
  const userDetails = await userRegService.getCustomerUserDetailsById(accessToken, this.users[n - 1]['id']);
  this.users[n - 1]['securityDevices'] = userDetails['securityDevices'] ? userDetails['securityDevices'] : [];
  formatSecurityDevicesRequestedDate(this.users[n - 1]);

  logger.info(`User is disabled: ${JSON.stringify(this.users[n - 1])}`);
}); 

Given(/^"([^"]*)" deletes the "(\d+)(?:st|nd|rd|th)" API created user$/, async function(user, n) {
  const bankuser = dataReader.getBankUser(user);
  const response = await userRegService.deleteCustomerUser(bankuser, this.users[n - 1].id, this.users[n - 1].version);
  // save updated User info into scenario context
  this.users[n - 1]['status'] = response['i18nStatus'];
  this.users[n - 1]['workflow'] = response['i18nWorkflow'];
  this.users[n - 1]['version'] = response['version'];
  this.users[n - 1]['applications'] = userRegService.getAppInfoFromPayload(response);
  // update security devices data for User
  const accessToken = await oauthToken.getAccessToken(bankuser);
  const userDetails = await userRegService.getCustomerUserDetailsById(accessToken, this.users[n - 1]['id']);
  this.users[n - 1]['securityDevices'] = userDetails['securityDevices'] ? userDetails['securityDevices'] : [];
  formatSecurityDevicesRequestedDate(this.users[n - 1]);

  logger.info(`User is pending deleted: ${JSON.stringify(this.users[n - 1])}`);
}); 


Given(/^"([^"]*)" enables the "(\d+)(?:st|nd|rd|th)" API created user$/, async function(user, n) {
  const bankuser = dataReader.getBankUser(user);
  const response = await userRegService.enableCustomerUser(bankuser, this.users[n - 1].id, this.users[n - 1].version);
  // save updated User info into scenario context
  this.users[n - 1]['status'] = response['i18nStatus'];
  this.users[n - 1]['workflow'] = response['i18nWorkflow'];
  this.users[n - 1]['version'] = response['version'];
  this.users[n - 1]['applications'] = userRegService.getAppInfoFromPayload(response);
  // update security devices data for User
  const accessToken = await oauthToken.getAccessToken(bankuser);
  const userDetails = await userRegService.getCustomerUserDetailsById(accessToken, this.users[n - 1]['id']);
  this.users[n - 1]['securityDevices'] = userDetails['securityDevices'] ? userDetails['securityDevices'] : [];
  formatSecurityDevicesRequestedDate(this.users[n - 1]);

  logger.info(`User is Pending Approve - Deleted: ${JSON.stringify(this.users[n - 1])}`);
}); 

Given(/^"([^"]*)" verifies the "(\d+)(?:st|nd|rd|th)" API created user in locale "(en|zh_CN)":$/, async function(user, n, locale, kba) {
  const bankuser = dataReader.getBankUser(user);
  const userDetails = await userRegService.verifyCustomerUser(bankuser, this.users[n - 1].id, kba.hashes(), locale, this.users[n - 1].version);
  this.users[n - 1]['version'] = userDetails['version'];

  const userKBA = await userRegService.getUserKba(bankuser, this.users[n-1].id);
  this.users[n-1]['KBAs'] = userKBA;
});

