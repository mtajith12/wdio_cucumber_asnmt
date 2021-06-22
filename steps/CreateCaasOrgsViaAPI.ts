import { Given } from 'cucumber';
import * as faker from 'faker';
import { orgRegService } from 'src/OrgRegService';
import { getLogger } from 'log4js';
import { createCaasOrgPage } from 'src/CreateCaasOrgPage';
const data = require('src/DataReader');
const logger = getLogger();

const ALLOWED_SPECIAL_CHARS_ORG_NAME = '. ,!@#$%/&*()_-+=?{}[]`:~\'"/|';
const ALLOWED_SPECIAL_CHARS_ORG_ID = '_-.@()&';

Given(/^"([^"]*)" creates "(\d+)" organisations with a unique random string in orgData$/, async function(user, n) {
  const bankuser = data.getBankUser(user);
  const randomStr = faker.random.alphaNumeric(12);
  const orgDataPrefix = {
    orgId: `searchOrgId${randomStr}`,
    orgName: `Search orgName ${randomStr}`,
    businessId: `searchBin${randomStr}`,
  };
  this.orgs = await orgRegService.createMultiOrgs(bankuser, n, orgDataPrefix);
  this.rndmStr = randomStr;
  logger.info(`Save the ${n} Orgs created to scenario:\n${JSON.stringify(this.orgs)}`);
});

Given(/^"([^"]*)" creates "(\d+)" organisations with a unique random string and a special char in ID and name$/, async function(user, n) {
  const bankuser = data.getBankUser(user);
  const randomStr = faker.random.alphaNumeric(12);
  const randomSpeCharOrgId = faker.random.arrayElement(ALLOWED_SPECIAL_CHARS_ORG_ID.split(''));
  const randomSpeCharOrgName = faker.random.arrayElement(ALLOWED_SPECIAL_CHARS_ORG_NAME.split(''));  
  const orgDataPrefix = {
    orgId: `searchOrgId${randomSpeCharOrgId}${randomStr}`,
    orgName: `Search orgName ${randomSpeCharOrgName}${randomStr}`,
    businessId: `bin${randomStr}`,
  };
  this.orgs = await orgRegService.createMultiOrgs(bankuser, n, orgDataPrefix);
  this.rndmStr = randomStr;
  logger.info(`${n} Orgs created with special char in ID and Name:\n${JSON.stringify(this.orgs)}`);
});

Given(/^"([^"]*)" creates "(\d+)" organisations with (all|no|.*) applications$/, async function(user, n, apps) {
  const bankuser = data.getBankUser(user);

  let appList = [];
  appList = ( apps === 'all') ? createCaasOrgPage.applications : (apps === 'no' ? []: apps.split(","));

  const randomStr = faker.random.alphaNumeric(12);
  const orgDataPrefix = {
    orgId: `testOrg${randomStr}`,
    orgName: `Test Org ${randomStr}`,
    businessId: `bin${randomStr}`,
    applications: appList,
  };
  if (!this.orgs) {
    this.orgs = await orgRegService.createMultiOrgs(bankuser, n, orgDataPrefix);
  } else {
    this.orgs = this.orgs.concat(await orgRegService.createMultiOrgs(bankuser, n, orgDataPrefix));
  }  
  logger.info(`Orgs created :${JSON.stringify(this.orgs)}`);
});

Given(/^"([^"]*)" creates "(\d+)" Customers with all products and jurisdictions$/, async function(user, n) {
  const bankuser = data.getBankUser(user);

  for (var i = 0; i < n; i++) {
    const randomStr = faker.random.alphaNumeric(12);
    const customerData = {
      customerId: `testCust${randomStr}`,
      customerName: `Test Customer ${randomStr}`,
      addressLine1: faker.address.streetAddress(),
      suburbOrCity: faker.address.city(),
      postCode: faker.address.zipCode('####'),
      country: 'AU',
      phone: faker.random.arrayElement(['61481837125', '61402896004', '61401980652', '61421524335', '61422990461']),
      email: faker.internet.email(),
    };
    const createdCustomer = await orgRegService.createCustomer(bankuser, customerData);

    // add the created Customer to this.customers list. 
    if (!this.customers) this.customers = []; 
    this.customers.push(createdCustomer);
  }
  logger.info(`Customers created :${JSON.stringify(this.customers)}`);
});