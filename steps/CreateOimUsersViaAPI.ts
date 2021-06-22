import _ = require('lodash');
import { Given } from 'cucumber';
import { userRegService } from 'src/UserRegService';
const dataReader = require('src/DataReader');
import { getLogger } from 'log4js';
const logger = getLogger();

const ALLOWED_SPECIAL_CHARS_USER_ID = '_-.@';
const ALLOWED_SPECIAL_CHARS_STRING = '. ,!@#$%/&*()_-+=?{}[]`:~\'"/|';

async function createUsersViaApi(user, orgId, customer, n, locale, data, divisionData) {
  const data1 = data.rowsHash();
  const appList = data1.applications ? data1.applications : null;
  const apps = (appList === null || appList.match(/^ *$/) !== null) ? undefined : appList.split(';');
  const deviceList = data1.securityDevices ? data1.securityDevices : null;
  const securityDevices = (deviceList === null || deviceList.match(/^ *$/) !== null) ? undefined : deviceList.split(';');
  const entitlementList = data1.entitlements ? data1.entitlements : null;
  const entitlements = (entitlementList === null || entitlementList.match(/^ *$/) !== null) ? undefined : entitlementList.split(';');

  const bankuser = dataReader.getBankUser(user);
  const users = await userRegService.createMultiUsers(bankuser, {}, orgId, customer, n, locale, apps, true, securityDevices, entitlements, divisionData);
  return users;
}

Given(/^"([^"]*)" creates non ANZ managed "(\d)" users with the "(\d+)(?:st|nd|rd|th)" created Org$/, async function(user, n, i) {
  const org = this.orgs[i - 1];
  const bankuser = dataReader.getBankUser(user);
  const users = await userRegService.createMultiUsers(bankuser, {}, org, undefined, n, undefined, {}, false, undefined, undefined, undefined);

  logger.info(`Save the created ${n} Users to scenario:\n${JSON.stringify(users)}`);
  if (this.users && this.users.length > 0) {
    this.users.push(...users);
  } else {
    this.users = users;
  }
});

// Create users with the Org previously created and saved in scenario context, and NO customer. 
Given(/^"([^"]*)" creates "(\d+)" users with the "(\d+)(?:st|nd|rd|th)" created Org$/, async function(user, n, i) {
  const org = this.orgs[i - 1];
  const bankuser = dataReader.getBankUser(user);
  const users = await userRegService.createMultiUsers(bankuser, {}, org, undefined, n, undefined, {}, true, undefined, undefined, undefined);
  
  logger.info(`Save the created ${n} Users to scenario:\n${JSON.stringify(users)}`);
  if (this.users && this.users.length > 0) {
    this.users.push(...users);
  } else {
    this.users = users;
  }
});

Given(/^"([^"]*)" creates "(\d+)" users with the "(\d+)(?:st|nd|rd|th)" created Org in language "(.*)"$/, async function(user, n, i, locale) {
  let org = this.orgs[i - 1];
  const bankuser = dataReader.getBankUser(user);
  const users = await userRegService.createMultiUsers(bankuser, {}, org, undefined, n, locale, {}, true, undefined, undefined, undefined);
  
  logger.info(`Save the created ${n} Users to scenario:\n${JSON.stringify(users)}`);
  if (this.users && this.users.length > 0) {
    this.users.push(...users);
  } else {
    this.users = users;
  }
});

Given(/^"([^"]*)" creates "(\d+)" users with the "(\d+)(?:st|nd|rd|th)" created Org, with the "(\d+)(?:st|nd|rd|th)" created Customer, and with:$/, async function(user, n, i, j, data) {
  let customer;
  if (this.customers && this.customers.length >= j) {
    customer = {id: this.customers[j - 1]['id'] ? this.customers[j - 1]['id'] : null, customerId: this.customers[j - 1].customerId, customerName: this.customers[j - 1].customerName};
  } else {
    // customer must have been created by step "Given create a customer using api" therefore customer data are saved in this.customerapi
    customer = {id: this.customerapi.id, customerId: this.customerapi.customerId, customerName: this.customerapi.customerName};
  }
  const divisionData = (this.divisionapi && this.divisionapi.length > 0) ? this.divisionapi[0] : undefined;
  const users = await createUsersViaApi(user, this.orgs[i - 1], customer, n, undefined, data, divisionData);
  
  logger.info(`Save the created ${n} Users to scenario:\n${JSON.stringify(users)}`);
  if (this.users && this.users.length > 0) {
    this.users.push(...users);
  } else {
    this.users = users;
  }
});

Given(/^"([^"]*)" creates "(\d+)" users with the "(\d*)(?:st|nd|rd|th)" created Org, without a Customer, and with:$/, async function(user, n, i, data) {
  const users = await createUsersViaApi(user, this.orgs[i - 1], undefined, n, undefined, data, undefined);
  
  logger.info(`Save the created ${n} Users to scenario:\n${JSON.stringify(users)}`);
  if (this.users && this.users.length > 0) {
    this.users.push(...users);
  } else {
    this.users = users;
  }
})

/*
 * This step takes address as an input parameter to create Users with the specified address.
 * address should be in format of below,
 * {
 *    addressLine1: 'line 1',
 *    addressLine2: 'line 2',
 *    suburbOrCity: 'xxxx',
 *    stateOrProvince: 'xxxx',
 *    postalCode: '3000',
 *    country: 'AU'
 * }
 */
Given(/^"([^"]*)" creates "(\d+)" users with the "(\d+)(?:st|nd|rd|th)" created Org and address:$/, async function(user, n, i, address) {
  const addr = address.rowsHash();
  const userData = {
    addressLine1: addr['addressLine1'],
    suburbOrCity: addr['suburbOrCity'],
    country: addr['country']
  };
  if (addr['addressLine2']) userData['addressLine2'] = addr['addressLine2'];
  if (addr['stateOrProvince']) userData['stateOrProvince'] = addr['stateOrProvince'];
  if (addr['postalCode']) userData['postalCode'] = addr['postalCode'];

  const bankuser = dataReader.getBankUser(user);
  const users = await userRegService.createMultiUsers(bankuser, userData, this.orgs[i - 1], undefined, n, undefined, [], true, [], [], undefined);

  logger.info(`Save the created ${n} Users to scenario:\n${JSON.stringify(users)}`);
  if (this.users && this.users.length > 0) {
    this.users.push(...users);
  } else {
    this.users = users;
  }
})
