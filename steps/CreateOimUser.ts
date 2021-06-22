import { Then } from 'cucumber';
import _ = require('lodash');
const faker = require('faker');
import { newOnboardingPage } from 'src/NewOnboardingPage';
import { createUserAppsPage } from 'src/CreateUserAppsPage';
import { createCaasOrgPage } from 'src/CreateCaasOrgPage';
import { newUserPage } from 'src/NewUserPage';
import {viewOimUserPage} from 'src/ViewOimUserPage';
import { duplicateWarningPage} from 'src/DuplicateWarningPage';
import { randomData } from 'src/RandomData';
import { expect } from "chai";
import { helper } from "src/Helper";
import { getLogger } from "log4js";
import { createUserSecDevicesPage } from 'src/CreateUserSecDevicesPage';
import { MenuBar } from 'src/MenuBarPage';
import { users } from 'pages/Users';
import { selectors } from 'pages/Selectors';
const sortData = require('src/SortData');
const logger = getLogger();
logger.level = 'info';

const ALLOWED_SPECIAL_CHARS_USER_ID = '_-.@';
const ALLOWED_SPECIAL_CHARS_EMAIL_LOCAL = '!#$%&\'*+-/=?^_`.{|}~';
const ALLOWED_SPECIAL_CHARS_EMAIL_DOMAIN = '.-'; // '.' and '-' cannot be together in the domain name
const ALLOWED_SPECIAL_CHARS_STRING = '. ,!@#$%/&*()_-+=?{}[]`:~\'"/|';
const EUROPEAN_ALPHABETS = 'ñęéżßü';

// https://confluence.service.anz/display/WDCDT/Create+User+Details+Tab+Screen+Elements
const MOST_COMMON_COUNTRIES = ['61 - Australia', '64 - New Zealand', '65 - Singapore', '84 - Viet Nam', '62 - Indonesia', '86 - China', '91 - India'];

//Surname|Preferred First Name|Date of Birth|CAAS Org ID|Address|KYC ID|Email Address|Address Line 1|Address Line 2|Suburb \/ City|State \/ Province|Postal Code|Mobile Number|Other Phone Number
const FIELD_TO_ERRMSG_MAPPING = {
  'User ID': { 'errMsgSelector': newUserPage.selectors.userIdDataErrMsg, 'mandatoryMsg': newUserPage.screenMessages.userIdMandatoryMsg, 'dataValErrMsg': newUserPage.screenMessages.userIdDataValErrMsg },
  'First Name': { 'errMsgSelector': newUserPage.selectors.firstNameDataErrMsg, 'mandatoryMsg': newUserPage.screenMessages.firstNameMandatoryMsg, 'dataValErrMsg': newUserPage.screenMessages.firstNameDataValErrMsg },
  'Middle Name': { 'errMsgSelector': newUserPage.selectors.middleNameDataErrMsg, 'mandatoryMsg': newUserPage.screenMessages.middleNameDataValErrMsg, 'dataValErrMsg': newUserPage.screenMessages.middleNameDataValErrMsg },
  'Surname': { 'errMsgSelector': newUserPage.selectors.surNameDataErrMsg, 'mandatoryMsg': newUserPage.screenMessages.surNameMandatoryMsg, 'dataValErrMsg': newUserPage.screenMessages.surNameDataValErrMsg },
  'Preferred First Name': { 'errMsgSelector': newUserPage.selectors.prefFirstNameDataErrMsg, 'dataValErrMsg': newUserPage.screenMessages.prefFirstNameDataValErrMsg },
  'Date of Birth': { 'errMsgSelector': newUserPage.selectors.dobDataErrMsg, 'mandatoryMsg': newUserPage.screenMessages.dobMandatoryMsg, 'dataValErrMsg': newUserPage.screenMessages.dobDataValErrMsg, 'futureDateErrMsg': newUserPage.screenMessages.msg020 },
  'CAAS Org ID': { 'errMsgSelector': newUserPage.selectors.caasOrgIdDataErrMsg, 'mandatoryMsg': newUserPage.screenMessages.caasOrgIdMandatoryMsg, 'dataValErrMsg': newUserPage.screenMessages },
  'Address': { 'errMsgSelector': newUserPage.selectors.addressDataErrMsg, 'mandatoryMsg': newUserPage.screenMessages.addressMandatoryMsg },
  'KYC ID': { 'errMsgSelector': newUserPage.selectors.kycIdDataErrMsg, 'dataValErrMsg': newUserPage.screenMessages.kycIdDataValErrMsg },
  'Email Address': { 'errMsgSelector': newUserPage.selectors.emailDataErrMsg, 'dataValErrMsg': newUserPage.screenMessages.emailDataValErrMsg },
  'Address Line 1': { 'errMsgSelector': newUserPage.selectors.addressDialog.addrLine1ErrMsg, 'mandatoryMsg': newUserPage.screenMessages.addrLine1MandatoryMsg, 'dataValErrMsg': newUserPage.screenMessages.addrLine1DataValErrMsg },
  'Address Line 2': { 'errMsgSelector': newUserPage.selectors.addressDialog.addrLine2ErrMsg, 'dataValErrMsg': newUserPage.screenMessages.addrLine2DataValErrMsg },
  'Suburb / City': { 'errMsgSelector': newUserPage.selectors.addressDialog.suburbErrMsg, 'mandatoryMsg': newUserPage.screenMessages.suburbMandatoryMsg, 'dataValErrMsg': newUserPage.screenMessages.suburbDatValErrMsg },
  'State / Province': { 'errMsgSelector': newUserPage.selectors.addressDialog.stateErrMsg, 'dataValErrMsg': newUserPage.screenMessages.stateDatValErrMsg },
  'Postal Code': { 'errMsgSelector': newUserPage.selectors.addressDialog.postCodeErrMsg, 'dataValErrMsg': newUserPage.screenMessages.postCodeDatValErrMsg },
  'Mobile Number': { 'errMsgSelector': newUserPage.selectors.mobileNoErrMsg, 'notProvidedAtSameTimeErrMsg': newUserPage.screenMessages.msg015, 'dataValErrMsg': newUserPage.screenMessages.msg017 },
  'Other Phone Number': { 'errMsgSelector': newUserPage.selectors.otherPhoneNoErrMsg, 'notProvidedAtSameTimeErrMsg': newUserPage.screenMessages.msg016, 'dataValErrMsg': newUserPage.screenMessages.otherPhoneDatValErrMsg },
};

function hasLeadingOrTrailingSpaces(text) {
  return !(text.trim() === text);
}

function clone(origin) {
  let originProto = Object.getPrototypeOf(origin);
  return Object.assign(Object.create(originProto), origin);
}

function concatAddress(address) {
  console.log(JSON.stringify(address))
  let addressSequenced = sortData.sortArrayofMapByKeySequence(address, ['addressLine1', 'addressLine2', 'suburbOrCity', 'stateOrProvince', 'postalCode', 'country']);

  const keys = Object.keys(addressSequenced);
  let values = [];
  keys.forEach(function (key) {
    values.push(addressSequenced[key]);
  });
  return values.join(', ');
}

function addLeadingTrailingSpaces(field) {
  return new Array(faker.random.number(10)).join(' ') + field + new Array(faker.random.number(10)).join(' ');
}

async function checkDataFieldValidationErrMsg(field, errType) {
  logger.info(`Check field ${field} ${errType} error message on New User page`);
  const displayedMsg = (await helper.getElementText(FIELD_TO_ERRMSG_MAPPING[field].errMsgSelector)).trim();
  let expectedMsg;
  if (errType === 'mandatory field') {
    expectedMsg = FIELD_TO_ERRMSG_MAPPING[field].mandatoryMsg;
  } else if (errType === 'data validation') {
    expectedMsg = FIELD_TO_ERRMSG_MAPPING[field].dataValErrMsg;
  } else if (errType === 'not provided at the same time') {
    expectedMsg = FIELD_TO_ERRMSG_MAPPING[field].notProvidedAtSameTimeErrMsg;
  } else if (errType === 'future date') {
    expectedMsg = FIELD_TO_ERRMSG_MAPPING[field].futureDateErrMsg;
  }
  expect(displayedMsg).to.equal(expectedMsg);
}

async function checkFieldValueAcceptedOrNotAndErrMsg(field, ifAccepted) {
  if (ifAccepted === 'Accepted') {
    logger.info(`Check field ${field} value is accepted on New User page`);
    expect(await helper.ifElementDisplayed(FIELD_TO_ERRMSG_MAPPING[field].errMsgSelector)).to.equal(false);
  } else {
    logger.info(`Check field ${field} value is NOT accepted on New User page and error message`);
    expect(await helper.getElementText(FIELD_TO_ERRMSG_MAPPING[field].errMsgSelector)).to.equal(FIELD_TO_ERRMSG_MAPPING[field].dataValErrMsg);
  }
}

async function checkOrgEnteredAndDisplayedCorrectly(orgId, orgName) {
  await helper.waitForDisplayed(newUserPage.selectors.caasOrgNameValue);
  await helper.pause(2); // extra wait in case the org was just cleared then re-entered
  logger.info('Check CAAS Org ID input box is diabled and clear CAAS Org ID icon exists');
  expect(await newUserPage.isDisabled(newUserPage.selectors.caasOrgIdInput)).to.equal(true);
  expect(await helper.isElementPresent(newUserPage.selectors.clearCassOrgIcon)).to.equal(true);
  logger.info('Check CAAS Org ID and Name are displayed correctly');
  expect((await helper.getElementAttribute(newUserPage.selectors.caasOrgIdInput, 'value'))).to.equal(orgId);
  expect((await helper.getElementText(newUserPage.selectors.caasOrgNameValue))).to.equal(orgName);
}

async function checkCustomerEnteredAndDisplayedCorrectly(customerId, customerName) {
  await helper.waitForDisplayed(newUserPage.selectors.customerNameValue);
  await helper.pause(2); // extra wait in case the customer was just cleared then re-entered
  logger.info('Check Customer ID and Name are displayed correctly');
  expect((await helper.getElementText(newUserPage.selectors.customerNameLabel))).to.equal('Customer Name');
  expect((await helper.getElementText(newUserPage.selectors.customerNameValue))).to.equal(customerName);
  expect((await helper.getElementValue(newUserPage.selectors.customerIdInput))).to.equal(customerId);
  logger.info('Check Customer ID input box is disabled and clear Customer ID icon exists');
  expect(await newUserPage.isDisabled(newUserPage.selectors.customerIdInput)).to.equal(true);
  expect(await helper.isElementPresent(newUserPage.selectors.clearCustomerIcon)).to.equal(true);
}

async function selectNthRowFromSearchOrgOrCustomerResults(n) {
  await helper.click(newUserPage.getSelectorOfNthItemInSearchResultsGrid(n));
  const isSearchOnOrgs = (await helper.getElementText(newUserPage.selectors.searchDialog.title)).includes('Search CAAS Org');
  const selectedId = await helper.getElementText(newUserPage.getCellSelectorByRowAndColumn(n, 1));
  const selectedName = await helper.getElementText(newUserPage.getCellSelectorByRowAndColumn(n, 2));
  if (isSearchOnOrgs) {
    return { 'orgId': selectedId, 'orgName': selectedName };
  } else {
    return { 'customerId': selectedId, customerName: selectedName };
  }
}

async function checkExtraSpacesTrimmedInSearchCriteriaField(trimmedCriterias, field, fieldSelector) {
  const criteriaVals = trimmedCriterias[field].split(',');
  const fieldVals = await newUserPage.getSearchDialogFieldVals(fieldSelector);
  for (let val of fieldVals) {
    expect(criteriaVals.indexOf(val) > -1).to.equal(true);
  }
}

Then(/^BankUser clicks on "(Search CAAS Org ID|Search Customer ID)" icon(| then clicks on search)$/, async function (name, clickOnSearch) {
  logger.info(`Click on ${name} button`);
  if (name === 'Search CAAS Org ID') {
    await helper.click(newUserPage.selectors.searchCaasOrgIcon);
    await helper.waitForDisplayed(newUserPage.selectors.searchDialog.orgIdInput);
  } else {
    await helper.click(newUserPage.selectors.searchCustomerIcon);
    await helper.waitForDisplayed(newUserPage.selectors.searchDialog.customerIdInput);
  }
  if (clickOnSearch === ' then clicks on search') {
    logger.info('Click on Search button in the dialog');
    await helper.click(newUserPage.selectors.searchDialog.searchBtn);
  }
});

/*
 * Create a new User with or without a Customer, and with Applications, Security Devices, which are passed in from data block in the step.
 * The format to define the applications and security devices needs to follow below,
 *  |applications    | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade                                  |
 *  |securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
 *  |entitlements    | FX Overlay:FX Overlay:All Divisions;Cash Management:CM01_Create (All Initiation Methods) & Reporting:All Divisions:Standard:Selected |
 *  The entitlements data should be items in the format of below, and separated by ";"
 *    - for "Cash Management" roles: <roleFamily>:<roleName>:<Division>:<paymentPurpose>:<reportingAccount>
 *    - for "FX Overlay" roles: <roleFamily>:<roleName>:<Division> or <roleFamily>:<roleName> which will select the 1st division in the dropdown under "All Divisions"
 *    - for "Commercial Cards" roles: <roleFamily>:<roleName>, the 1st devision in the dropdown will be selected
 *    - for "Customer Administration" roles: <roleFamily>:<roleName>:<Division> or <roleFamily>:<roleName> which will select the 1st division in the dropdown under "All Divisions"
 */
Then(/^BankUser creates User with the created Org, (without a Customer|with the created Customer), and with:$/, async function (withCustomer, data) {
  const orgId = this.orgData ? this.orgData.orgId : this.orgs[0].orgId;

  const withCustomerId = !withCustomer.includes('without');
  let customerId;
  if (withCustomerId) {
    // when Customer was created via UI, it's saved in this.Customer, otherwise Customer was created from API and saved in this.customers
    customerId = (!this.customers) ? this.Customer.customerId : this.customers[0].customerId;
  }

  const userData = data.rowsHash();
  const appList = userData.applications ? userData.applications : null;
  const apps = (appList === null || appList.match(/^ *$/) !== null) ? undefined : appList.split(';');

  const deviceList = userData.securityDevices ? userData.securityDevices : null;
  const securityDevices = (deviceList === null || deviceList.match(/^ *$/) !== null) ? undefined : deviceList.split(';');

  const entitlementList = userData.entitlements ? userData.entitlements : null;
  const entitlements = (entitlementList === null || entitlementList.match(/^ *$/) !== null) ? undefined : entitlementList.split(';');

  this.userData = await newUserPage.createUser({}, withCustomerId, customerId, orgId, undefined, apps, securityDevices, entitlements);
  logger.info(`Save the created User to scenario: ${JSON.stringify(this.userData)}`);
});

Then(/^BankUser creates User with the created Org and entitlements, with the created Customer, and with:$/, async function (data) {
  const orgId = this.orgData ? this.orgData.orgId : this.orgs[0].orgId;
  let customerId = this.data.customerId;


  const userData = data.rowsHash();
  const appList = userData.applications ? userData.applications : null;
  const apps = (appList === null || appList.match(/^ *$/) !== null) ? undefined : appList.split(';');

  const deviceList = userData.securityDevices ? userData.securityDevices : null;
  const entitlements = userData.entitlements ? userData.entitlements : null;
  const entitlementsList = (entitlements === null || entitlements.match(/^ *$/) !== null) ? undefined : entitlements.split(';');
  let resourceslists = [];
  for (const i in entitlementsList) {
    resourceslists.push(entitlementsList[i].split(','));
  }

  resourceslists = resourceslists.map((item) => item.map(x => x === 'Custom Role' ? this.roleName : x))
  console.log(resourceslists)
  const securityDevices = (deviceList === null || deviceList.match(/^ *$/) !== null) ? undefined : deviceList.split(';');
  console.log(entitlementsList)
  this.COBRAuserData = await newUserPage.createUser1({}, true, customerId, orgId, undefined, apps, securityDevices, this.accountNumber, this.resourceGroupName, this.legalEntityName, resourceslists, this.Customer, this.userData, this.billentNumber);
  logger.info(`Save the created User to scenario: ${JSON.stringify(this.COBRAuserData)}`);
});


Then(/^BankUser creates User with the created Org and DSS entitlements with Account Groups, with the created Customer, and :$/, async function (data) {
  const orgId = this.orgData ? this.orgData.orgId : this.orgs[0].orgId;
  let customerId = this.data.customerId;
  
  const userData = data.hashes();
  let entitlementDetailList = [];
  await users.setresourcesarray(this.accountsArray, this.legalEntityArray, this.resourceGroupArray);
  const appList = userData.applications ? userData.applications : null;
  const apps = (appList === null || appList.match(/^ *$/) !== null) ? undefined : appList.split(';');

  const deviceList = userData.securityDevices ? userData.securityDevices : null;
  const securityDevices = (deviceList === null || deviceList.match(/^ *$/) !== null) ? undefined : deviceList.split(';');

  for (const act1 of userData) {
    let LegalEntityArray = [];
    let ResourceGroupArray = [];
    let AccountArray = [];
    // these arrays have to be declared inside this loop because we send multiple rows

    let legalEntity = act1.AddLegalEntity.includes(',') ? act1.AddLegalEntity.replace(/ /g, '').split(',') : [act1.AddLegalEntity];
    for (const i in legalEntity) {
      LegalEntityArray.push(_.compact(this.legalEntityArray.map((item) => item.index === legalEntity[i] ? item.businessIdNumber : undefined))[0])
    }
    // console.log(LegalEntityArray)

    let resourceGroup = act1.AddResourceGroup.includes(',') ? act1.AddResourceGroup.replace(/ /g, '').split(',') : [act1.AddResourceGroup];
    for (const i of resourceGroup) {
      ResourceGroupArray.push(_.compact(this.resourceGroupArray.map((item) => item.index === i ? item.resourceGroupName : undefined))[0])
    }
    // console.log(ResourceGroupArray)

    let account = act1.AddAccount.includes('&') ? act1.AddAccount.replace(/ /g, '').split('&') : [act1.AddAccount];
    for (const i in account) {
      let a = account[i].includes(',') ? account[i].split(',') : [account[i]];
      let hostSystem = a.shift();
      // console.log(a)
      // console.log(hostSystem)
      for (const j in a) {
        AccountArray.push(_.compact(this.accountsArray.map(item => item.host === hostSystem && item.hostIndex === a[j] ? item.accountNumber : undefined))[0])
      }
    }
    // console.log(ResourceGroupArray)
    let orderList = act1.Order.includes(',')?act1.Order.split(',') : [act1.Order];

    entitlementDetailList.push({
        entitlement: act1.RoleName ? act1.RoleName : undefined,
        account: AccountArray,
        legalEntity: LegalEntityArray,
        resourceGroup: ResourceGroupArray,
        order:_.compact(orderList)
      })
  }
  // console.log(_.compact(entitlementDetailList));
   this.COBRAuserData = await newUserPage.createUser1({}, true, customerId, orgId, undefined, apps, securityDevices, null, null, null, entitlementDetailList, this.Customer,this.userData,this.billentNumber);
  logger.info(`Save the created User to scenario: ${JSON.stringify(this.COBRAuserData)}`);
});

Then(/^Bankuser verifies the COBRA User details for DSS entitlements with Account Groups$/, async function (data) {
  await helper.pause(4);
  logger.info(`Verifying the Entitlements Added for : COBRA User`);
  const userData = data.hashes();
  const entitlementDetailList = [];

  for (const act1 of userData) {
    const sLegalEntityArray = [];
    const fLegalEntityArray = [];
    const sResourceGroupArray = [];
    const fResourceGroupArray = [];
    const sAccountArray = [];
    const fAccountArray = [];
    
    // these arrays have to be declared inside this loop because we have multiple rows in datatable

    // Accounts
    const fact = act1.Account_Fufil ? (act1.Account_Fufil.includes(',') ? act1.Account_Fufil.replace(/ /g, '').split(',') : [act1.Account_Fufil]) : undefined;
    const sact = act1.Account_Service ? (act1.Account_Service.includes(',') ? act1.Account_Service.replace(/ /g, '').split(',') : [act1.Account_Service]) : undefined;
    for (const i in fact) {
      fAccountArray.push(_.compact(this.accountsArray.map((item) => item.index === fact[i] ? item.accountNumber : undefined))[0]);
    }
    for (const i in sact) {
      sAccountArray.push(_.compact(this.accountsArray.map((item) => item.index === sact[i] ? item.accountNumber : undefined))[0]);
    }
    // Legal Entity
    const fle = act1.LegalEntity_Fulfil ? (act1.LegalEntity_Fulfil.includes(',') ? act1.LegalEntity_Fulfil.replace(/ /g, '').split(',') : [act1.LegalEntity_Fulfil]) : undefined;
    const sle = act1.LegalEntity_Service ? (act1.LegalEntity_Service.includes(',') ? act1.LegalEntity_Service.replace(/ /g, '').split(',') : [act1.LegalEntity_Service]) : undefined;
    for (const i in fle) {
      fLegalEntityArray.push(_.compact(this.legalEntityArray.map((item) => item.index === fle[i] ? item.legalEntityName : undefined))[0]);
    }
    for (const i in sle) {
      sLegalEntityArray.push(_.compact(this.legalEntityArray.map((item) => item.index === sle[i] ? item.legalEntityName : undefined))[0]);
    }

    // Resource Groups
    const frg = act1.ResourceGroup_Fulfil ? (act1.ResourceGroup_Fulfil.includes(',') ? act1.ResourceGroup_Fulfil.replace(/ /g, '').split(',') : [act1.ResourceGroup_Fulfil]) : undefined;
    const srg = act1.ResourceGroup_Service ? (act1.ResourceGroup_Service.includes(',') ? act1.ResourceGroup_Service.replace(/ /g, '').split(',') : [act1.ResourceGroup_Service]) : undefined;
    for (const i in frg) {
      fResourceGroupArray.push(_.compact(this.resourceGroupArray.map((item) => item.index === frg[i] ? item.resourceGroupName : undefined))[0]);
    }
    for (const i in srg) {
      sResourceGroupArray.push(_.compact(this.resourceGroupArray.map((item) => item.index === srg[i] ? item.resourceGroupName : undefined))[0]);
    }

    entitlementDetailList.push({
      entitlement: act1.RoleName.toString(),
      faccount: fAccountArray,
      flegalEntity: fLegalEntityArray,
      fresourceGroup: fResourceGroupArray,
      saccount: sAccountArray,
      slegalEntity: sLegalEntityArray,
      sresourceGroup: sResourceGroupArray,
    });
  }
  console.log(_.compact(entitlementDetailList));

  await helper.pause(2);
  await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']', 15000);
  await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await users.searchManageUsers(this.COBRAuserData);
  
  // await helper.click(selectors.Users.searchBtn);
  await users.selectUsersFromGrid();
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.gridElementRightClickViewBtn);
  // await users.verifyEntitlement(this.Customer, entitlementDetailList[k].entitlement);
  await helper.pause(1);
  await helper.waitForDisplayed('#entitlementsTab');
  await helper.click('#entitlementsTab');
  await helper.screenshot('entitlement Screen');


  for (const i in entitlementDetailList) {
    await helper.doubleClickbasedonText(entitlementDetailList[i].entitlement, selectors.Users.entitlementOptions.selected);
    console.log(`verifying ${entitlementDetailList[i].entitlement}`);

    // Verifies Accounts
    console.log('---Accounts---');

   if (entitlementDetailList[i].faccount.length > 0) {
     await helper.pause(1);
     expect(await helper.ifElementDisplayed('//div[@id=\'p_fulfilResourceAccountsGrid_wrap\']')).to.equal(true);
     for (const j in entitlementDetailList[i].faccount) {
       await helper.pause(2);
       expect(await helper.ifElementDisplayed(`//div[@id=\'p_fulfilResourceAccountsGrid\']//*[@class=\'grid-canvas\']//div[contains(text(),\'${entitlementDetailList[i].faccount[j]}\')]`)).to.equal(true);
     }
     logger.info('Verified - f_account ');
   } if (entitlementDetailList[i].saccount.length > 0) {
     await helper.pause(1);
     expect(await helper.ifElementDisplayed('//div[@id=\'p_serviceResourceAccountsGrid_wrap\']')).to.equal(true);
     for (const j in entitlementDetailList[i].saccount) {
       expect(await helper.ifElementDisplayed(`//div[@id=\'p_serviceResourceAccountsGrid\']//*[@class=\'grid-canvas\']//div[contains(text(),\'${entitlementDetailList[i].saccount[j]}\')]`)).to.equal(true);
     }
     logger.info('Verified - s_account ');
   }
   console.log('---ResourceGroup---');
   // Verifies Resource Group
   if (entitlementDetailList[i].fresourceGroup.length > 0) {
     await helper.pause(1);
     expect(await helper.ifElementDisplayedAfterTime('//div[@id=\'p_fulfilResourceGroupGrid_wrap\']')).to.equal(true);
     for (const j in entitlementDetailList[i].fresourceGroup) {
       await helper.pause(1);
       expect(await helper.ifElementDisplayed(`//div[@id=\'p_fulfilResourceGroupGrid\']//*[@class=\'grid-canvas\']//div[contains(text(),\'${entitlementDetailList[i].fresourceGroup[j]}\')]`)).to.equal(true);
       await helper.doubleClick(`//div[@id=\'p_fulfilResourceGroupGrid\']//*[@class=\'grid-canvas\']//div[contains(text(),\'${entitlementDetailList[i].fresourceGroup[j]}\')]`);
       await helper.pause(2);
       await users.verifyResourceGroup('Fulfilment', entitlementDetailList[i].fresourceGroup[j]);
       await helper.screenshot('ResourceGroups Screen');
       await helper.click('.//button[contains(text(),\'OK\')]');
     }
     logger.info('Verified - f_resourcegroup ');
   } if (entitlementDetailList[i].sresourceGroup.length > 0) {
     expect(await helper.ifElementDisplayed('//div[@id=\'p_serviceResourceGroupGrid_wrap\']')).to.equal(true);
     for (const j in entitlementDetailList[i].sresourceGroup) {
       await helper.pause(1);
       expect(await helper.ifElementDisplayed(`//div[@id=\'p_serviceResourceGroupGrid\']//*[@class=\'grid-canvas\']//div[contains(text(),\'${entitlementDetailList[i].sresourceGroup[j]}\')]`)).to.equal(true);
       await helper.doubleClick(`//div[@id=\'p_serviceResourceGroupGrid\']//*[@class=\'grid-canvas\']//div[contains(text(),\'${entitlementDetailList[i].sresourceGroup[j]}\')]`);
       await helper.pause(1);
       await users.verifyResourceGroup('Services', entitlementDetailList[i].sresourceGroup[j]);
       await helper.screenshot('ResourceGroups Screen');
       await helper.click('.//button[contains(text(),\'OK\')]');
     }
     logger.info('Verified - s_resourcegroup ');
   }
    console.log('---LegalEntity---');
    // Verifies Legal Entity
       if (entitlementDetailList[i].flegalEntity.length > 0) {
         await helper.pause(1);
         expect(await helper.ifElementDisplayed('//div[@id=\'p_fulfilResourceGrid_wrap\']')).to.equal(true);
         for (const j in entitlementDetailList[i].flegalEntity) {
           expect(await helper.ifElementDisplayed(`//div[@id=\'p_fulfilResourceGrid\']//*[@class=\'grid-canvas\']//div[contains(text(),\'${entitlementDetailList[i].flegalEntity[j]}\')]`)).to.equal(true);
         }
         logger.info('Verified - f_legalEntity ');
       } if (entitlementDetailList[i].slegalEntity.length > 0) {
         await helper.pause(1);
         expect(await helper.ifElementDisplayed('//div[@id=\'p_serviceResourceGrid_wrap\']')).to.equal(true);
         for (const j in entitlementDetailList[i].slegalEntity) {
           expect(await helper.ifElementDisplayed(`//div[@id=\'p_serviceResourceGrid\']//*[@class=\'grid-canvas\']//div[contains(text(),\'${entitlementDetailList[i].slegalEntity[j]}\')]`)).to.equal(true);
         }
         logger.info('Verified - s_legalEntity ');
       }
       await helper.pause(1);
       await helper.click('button[class*=\'dialog__control__node_modules\']');
  }
});

Then(/^BankUser verifies User entitlements, with the created Customer, and with:$/, async function (data) {
  const orgId = this.orgData ? this.orgData.orgId : this.orgs[0].orgId;
  let customerId = this.data.customerId;


  const userData = data.rowsHash();
  const appList = userData.applications ? userData.applications : null;
  const apps = (appList === null || appList.match(/^ *$/) !== null) ? undefined : appList.split(';');

  const deviceList = userData.securityDevices ? userData.securityDevices : null;
  const entitlements = userData.entitlements ? userData.entitlements : null;
  const entitlementsList = (entitlements === null || entitlements.match(/^ *$/) !== null) ? undefined : entitlements.split(';');
  const securityDevices = (deviceList === null || deviceList.match(/^ *$/) !== null) ? undefined : deviceList.split(';');

  this.COBRAuserData = await newUserPage.VerifyEntitlementsUser({}, true, customerId, orgId, undefined, apps, securityDevices, entitlementsList);
  logger.info(`Save the created User to scenario: ${JSON.stringify(this.COBRAuserData)}`);
});

Then(/^BankUser creates User with the created Org and language locale "(.*)", and with:$/, async function (locale, data) {
  const data1 = data.rowsHash();
  const appList = data1.applications ? data1.applications : null;
  const apps = (appList === null || appList.match(/^ *$/) !== null) ? undefined : appList.split(';');
  const deviceList = data1.securityDevices ? data1.securityDevices : null;
  const securityDevices = (deviceList === null || deviceList.match(/^ *$/) !== null) ? undefined : deviceList.split(';');

  const orgId = this.orgs[0].orgId;
  const userData = {};
  userData['firstName'] = randomData.generateLastNameWithLocale(locale);
  userData['surName'] = randomData.generateFirstNameWithLocale(locale);
  userData['prefFirstName'] = randomData.generateLastNameWithLocale(locale);
  userData['address'] = randomData.generateAddressWithLocale(locale);
  this.userData = await newUserPage.createUser(userData, false, undefined, orgId, undefined, apps, securityDevices, undefined);
  logger.info(`Save the created User to scenario: ${JSON.stringify(this.userData)}`);
});

Then(/^BankUser creates new User with allowed special characters in user data, and with:$/, async function (data) {
  const data1 = data.rowsHash();
  const appList = data1.applications ? data1.applications : null;
  const apps = (appList === null || appList.match(/^ *$/) !== null) ? undefined : appList.split(';');
  const deviceList = data1.securityDevices ? data1.securityDevices : null;
  const securityDevices = (deviceList === null || deviceList.match(/^ *$/) !== null) ? undefined : deviceList.split(';');

  let userData = {};
  userData['userId'] = faker.random.alphaNumeric(16) + ALLOWED_SPECIAL_CHARS_USER_ID;
  userData['firstName'] = faker.name.firstName() + ALLOWED_SPECIAL_CHARS_STRING + EUROPEAN_ALPHABETS;
  userData['middleName'] = faker.name.firstName() + ALLOWED_SPECIAL_CHARS_STRING + EUROPEAN_ALPHABETS;
  userData['surName'] = faker.name.lastName() + ALLOWED_SPECIAL_CHARS_STRING + EUROPEAN_ALPHABETS;
  userData['prefFirstName'] = faker.name.firstName() + ALLOWED_SPECIAL_CHARS_STRING + EUROPEAN_ALPHABETS;
  userData['dob'] = randomData.generatePassedDate();
  userData['address'] = {
    addressLine1: faker.address.streetAddress() + ALLOWED_SPECIAL_CHARS_STRING + EUROPEAN_ALPHABETS,
    suburb: faker.address.city() + ALLOWED_SPECIAL_CHARS_STRING + EUROPEAN_ALPHABETS,
    country: 'Australia',
  };
  userData['email'] = faker.random.alphaNumeric(8) + ALLOWED_SPECIAL_CHARS_EMAIL_LOCAL + '@' + faker.random.alphaNumeric(6) + '.anz-com';
  userData['mobile'] = {
    country: '61',
    number: faker.random.arrayElement(['481837125', '402896004', '401980652', '421524335', '422990461']),
  };
  this.userData = await newUserPage.createUser(userData, false, undefined, this.orgs[0].orgId, undefined, apps, securityDevices, undefined);
  this.userData.lastName = this.userData.surName
  logger.info(`Save the created User to scenario: ${JSON.stringify(this.userData)}`);
});

Then(/^BankUser fills in User General Details data longer than allowed max lengths$/, async function () {
  let userData = {};
  userData['userId'] = faker.random.alphaNumeric(newUserPage.fieldLengths.userIdMaxLength + 1);
  userData['firstName'] = faker.random.alphaNumeric(newUserPage.fieldLengths.nameFieldMaxLength + 1);
  userData['middleName'] = faker.random.alphaNumeric(newUserPage.fieldLengths.nameFieldMaxLength + 1);
  userData['surName'] = faker.random.alphaNumeric(newUserPage.fieldLengths.nameFieldMaxLength + 1);
  userData['prefFirstName'] = faker.random.alphaNumeric(newUserPage.fieldLengths.nameFieldMaxLength + 1);
  userData['dob'] = randomData.generatePassedDate();
  userData['kycId'] = faker.random.alphaNumeric(newUserPage.fieldLengths.kycIdMaxLength + 1);
  userData['email'] = faker.random.alphaNumeric(20) + '@' + faker.random.alphaNumeric(newUserPage.fieldLengths.emailMaxLength - 20);
  const orgId = (this.orgData) ? this.orgData.orgId : this.orgs[0].orgId;
  await newUserPage.fillInUserDetails(userData, false, undefined, orgId, undefined);
  this.userData = userData;
});

Then(/^BankUser creates new User with leading\/trailing spaces in user data, and with:$/, async function (data) {
  const data1 = data.rowsHash();
  const appList = data1.applications ? data1.applications : null;
  const apps = (appList === null || appList.match(/^ *$/) !== null) ? undefined : appList.split(';');
  const deviceList = data1.securityDevices ? data1.securityDevices : null;
  const securityDevices = (deviceList === null || deviceList.match(/^ *$/) !== null) ? undefined : deviceList.split(';');

  let trimmedUserData = {
    userId: 'user' + faker.random.alphaNumeric(18),
    firstName: faker.name.firstName(),
    middleName: faker.name.firstName(),
    surName: faker.name.lastName(),
    prefFirstName: faker.name.firstName(),
    address: {
      addressLine1: faker.address.streetAddress(),
      suburbOrCity: faker.address.city(),
      country: 'Australia',
    },
    email: faker.internet.email(),
  };
  let originUserData = clone(trimmedUserData);
  let userData = {};
  userData['userId'] = addLeadingTrailingSpaces(originUserData.userId);
  userData['firstName'] = addLeadingTrailingSpaces(originUserData.firstName);
  userData['middleName'] = addLeadingTrailingSpaces(originUserData.middleName);
  userData['surName'] = addLeadingTrailingSpaces(originUserData.surName);
  userData['prefFirstName'] = addLeadingTrailingSpaces(originUserData.prefFirstName);
  userData['address'] = {
    addressLine1: addLeadingTrailingSpaces(originUserData.address.addressLine1),
    suburbOrCity: addLeadingTrailingSpaces(originUserData.address.suburbOrCity),
  };
  userData['email'] = addLeadingTrailingSpaces(originUserData.email);

  this.userData = await newUserPage.createUser(userData, false, undefined, this.orgs[0].orgId, undefined, apps, securityDevices, undefined);

  this.userData = _.merge(this.userData, trimmedUserData);
  logger.info(`Save the trimmed User data to scenario: ${JSON.stringify(this.userData)}`);
});

Then(/^BankUser fills in User ID with the same value from the "(\d+)(?:st|nd|rd|th)" API created User then tab away$/, async function (n) {
  const userId = this.users[n - 1].userId;
  await helper.inputText(newUserPage.selectors.userIdInput, userId);
  await helper.enterTabFromKeyboard();
});

Then(/^BankUser fills in User Details using the first name, surname and (org|date of birth) from the "(\d+)(?:st|nd|rd|th)" API created User and "(\d+)(?:st|nd|rd|th)" created Org and click continue$/, async function(dateOrg, n, m){
  const firstName = this.users[n-1].firstName;
  const surName = this.users[n-1].surName;
  const orgId = this.orgs[m-1].orgId;
  const dateOfBirth = (dateOrg === 'date of birth') ? this.users[n-1].dob : randomData.generatePassedDate();

  let userData = {};
  userData['userId'] = 'add-success-modify-success-delete-success-' + faker.random.alphaNumeric(18);
  userData['firstName'] = firstName;
  userData['surName'] = surName;
  userData['dob'] = dateOfBirth;
  await newUserPage.fillInUserDetails(userData, false, undefined, orgId, undefined);
  await helper.click(MenuBar.selectors.continue);
  await helper.pause(5);
  this.userData = userData;
});

Then(/^BankUser fills in User details with "(.*)" and "(\d+)(?:st|nd|rd|th)" api created org$/, async function(userId, n) {
  let userData = {};
  userData['userId'] = userId;
  userData['firstName'] = faker.name.firstName();
  userData['surName'] = faker.name.lastName();
  userData['dob'] = randomData.generatePassedDate();
  userData['email'] =  faker.internet.email();
  const orgId = this.orgs[n-1].orgId;

  await newUserPage.fillInUserDetails(userData, false, undefined, orgId, undefined);
  await helper.click(MenuBar.selectors.continue);
  await helper.pause(5);
  this.userData = userData;

});

Then(/^BankUser selects the "(\d+)(?:st|nd|rd|th)" available address$/, async function (n) {
  logger.info('Select an existing address from the address dropdown');
  await newUserPage.selectNthAddressFromDropdown(n);
  this.userData['concatenatedAddr'] = await helper.getSelectedOptionTextInDropdown(newUserPage.selectors.addressSelect);
});

Then(/^check the selected address is displayed correctly$/, async function () {
  // the address was selected from available address list and saved in this.userData.concatenatedAddr field.
  const selectedAddr = await helper.getSelectedOptionTextInDropdown(newUserPage.selectors.addressSelect);
  logger.info(`Address selected: ${selectedAddr}`);
  expect(selectedAddr).to.equal(this.userData.concatenatedAddr);
});

Then(/^BankUser selects the "(\d+)(?:st|nd|rd|th)" available address and creates User$/, async function (nthAddress) {
  const orgId = this.orgs[0].orgId;
  this.userData = await newUserPage.createUser({}, false, undefined, orgId, nthAddress, undefined, undefined, undefined);
  logger.info(`Save the created User to scenario: ${JSON.stringify(this.userData)}`);
});

Then(/^BankUser fills in randomised user data with the "(\d+)(?:st|nd|rd|th)" API created Org$/, async function (n) {
  const orgId = this.orgs[n - 1].orgId;
  this.userData = await newUserPage.fillInUserDetails({}, false, undefined, orgId, undefined);
});

Then(/^BankUser fills in User details data:$/, async function (userData) {
  const data = userData.rowsHash();
  if (!this.userData) this.userData = {};

  await helper.inputTextIfNotNull(newUserPage.selectors.userIdInput, data.userId);
  this.userData['userId'] = data.userId ? data.userId : '';
  await helper.inputTextIfNotNull(newUserPage.selectors.firstNameInput, data.firstName);
  this.userData['firstName'] = data.firstName ? data.firstName : '';
  await helper.inputTextIfNotNull(newUserPage.selectors.middleNameInput, data.middleName);
  this.userData['middleName'] = data.middleName ? data.middleName : '';
  await helper.inputTextIfNotNull(newUserPage.selectors.surNameInput, data.surName);
  this.userData['surName'] = data.surName ? data.surName : '';
  await helper.inputTextIfNotNull(newUserPage.selectors.prefFirstNameInput, data.prefFirstName);
  this.userData['prefFirstName'] = data.prefFirstName ? data.prefFirstName : data.firstName;
  const dob = (data.dob && data.dob === 'Tomorrow') ? randomData.generateDateOfTomorrow() : (data.dob && data.dob === 'Today' ? randomData.formatDate(new Date()) : (data.dob ? data.dob : ''));
  await helper.inputTextIfNotNull(newUserPage.selectors.dobInput, dob);
  this.userData['dob'] = dob;
  await helper.inputTextIfNotNull(newUserPage.selectors.kycIdInput, data.kycId);
  this.userData['kycId'] = data.kycId ? data.kycId : '';

  // For Org Id, just enter it via the input box, and RETURN.
  await helper.inputTextIfNotNull(newUserPage.selectors.caasOrgIdInput, data.orgId);
  await helper.enterReturnFromKeyboard();
  this.userData['orgId'] = data.orgId ? data.orgId : '';
  // Save the search criterias for later use
  this.searchCriterias = { orgId: this.userData['orgId'] };

  await helper.inputTextIfNotNull(newUserPage.selectors.emailInput, data.email);
  this.userData['email'] = data.email ? data.email : '';

  if (data.mobileCountry) {
    await helper.click(newUserPage.selectors.mobilePrefixSelect);
    await helper.selectByAttribute(newUserPage.selectors.mobilePrefixSelect, 'value', data.mobileCountry);
  }
  await helper.inputTextIfNotNull(newUserPage.selectors.mobileNoInput, data.mobileNumber);
  this.userData['mobile'] = { 'country': data.mobileCountry ? data.mobileCountry : '', 'number': data.mobileNumber ? data.mobileNumber : '' };

  if (data.otherPhoneCountry) {
    await helper.click(newUserPage.selectors.otherPhonePrefixSelect);
    await helper.selectByAttribute(newUserPage.selectors.otherPhonePrefixSelect, 'value', data.otherPhoneCountry);
  }
  await helper.inputTextIfNotNull(newUserPage.selectors.otherPhoneNoInput, data.otherPhoneNumber);
  this.userData['otherPhone'] = { 'country': data.otherPhoneCountry ? data.otherPhoneCountry : '', 'number': data.otherPhoneNumber ? data.otherPhoneNumber : '' };
});

Then(/^BankUser fills in randomised General details data$/, async function () {
  this.userData = {
    userId: 'user' + faker.random.alphaNumeric(18),
    firstName: faker.name.firstName(),
    surName: faker.name.lastName(),
    dob: randomData.generatePassedDate(),
    email: faker.internet.email(),
  };
  await helper.inputText(newUserPage.selectors.userIdInput, this.userData.userId);
  await helper.inputText(newUserPage.selectors.firstNameInput, this.userData.firstName);
  await helper.inputText(newUserPage.selectors.surNameInput, this.userData.surName);
  await helper.inputText(newUserPage.selectors.dobInput, this.userData.dob);
  await helper.inputText(newUserPage.selectors.emailInput, this.userData.email);
});

Then(/^BankUser enters randomised address then clicks on "(Ok|Cancel)" button$/, async function (button) {
  const address = {
    addressLine1: faker.address.streetAddress(),
    addressLine2: faker.address.streetAddress(),
    suburbOrCity: faker.address.city(),
    stateOrProvince: faker.address.state(),
    postalCode: faker.address.zipCode(),
    country: randomData.generateRandomCountryName(),
  };
  await newUserPage.enterAddress(address, button);

  logger.info(`Save address info into User data in scenario: ${JSON.stringify(address)}`);
  if (!this.userData) this.userData = {};
  this.userData.address = address;
});

Then(/^BankUser fills in address data then clicks on "(Ok|Cancel)" button:$/, async function (button, data) {
  const address = data.rowsHash();
  await newUserPage.enterAddress(address, button);
});

Then(/^BankUser fills address fields longer than allowed max lengths and check values truncated$/, async function () {
  const address = {
    addressLine1: faker.random.alphaNumeric(newUserPage.fieldLengths.addressLine1MaxLength + 1),
    addressLine2: faker.random.alphaNumeric(newUserPage.fieldLengths.addressLine2MaxLength + 1),
    suburbOrCity: faker.random.alphaNumeric(newUserPage.fieldLengths.suburbMaxLength + 1),
    stateOrProvince: faker.random.alphaNumeric(newUserPage.fieldLengths.stateMaxLength + 1),
    postalCode: faker.random.alphaNumeric(newUserPage.fieldLengths.postCodeMaxLength + 1),
  };
  await newUserPage.enterAddress(address, '');

  const truncatedAddress = {
    addressLine1: address.addressLine1.substring(0, newUserPage.fieldLengths.addressLine1MaxLength),
    addressLine2: address.addressLine2.substring(0, newUserPage.fieldLengths.addressLine2MaxLength),
    suburbOrCity: address.suburbOrCity.substring(0, newUserPage.fieldLengths.suburbMaxLength),
    stateOrProvince: address.stateOrProvince.substring(0, newUserPage.fieldLengths.stateMaxLength),
    postalCode: address.postalCode.substring(0, newUserPage.fieldLengths.postCodeMaxLength),
    country: 'Australia'
  };
  logger.info('Check the fields have been truncated to the max allowed length');
  expect((await helper.getElementAttribute(newUserPage.selectors.addressDialog.addressLine1, 'value'))).to.equal(truncatedAddress.addressLine1);
  expect((await helper.getElementAttribute(newUserPage.selectors.addressDialog.addressLine2, 'value'))).to.equal(truncatedAddress.addressLine2);
  expect((await helper.getElementAttribute(newUserPage.selectors.addressDialog.suburb, 'value'))).to.equal(truncatedAddress.suburbOrCity);
  expect((await helper.getElementAttribute(newUserPage.selectors.addressDialog.state, 'value'))).to.equal(truncatedAddress.stateOrProvince);
  expect((await helper.getElementAttribute(newUserPage.selectors.addressDialog.postCode, 'value'))).to.equal(truncatedAddress.postalCode);

  logger.info('Click on "Ok" to save the address');
  await helper.click(newUserPage.selectors.addressDialog.okBtn);

  logger.info(`Save address info into User data in scenario: ${JSON.stringify(truncatedAddress)}`);
  this.userData = {};
  this.userData.address = truncatedAddress;
});

Then(/^BankUser enters (Org|Customer) ID "(.*)" and hits ENTER$/, async function (entity, id) {
  logger.info(`Enter ${entity} ID: ${id} and hit Enter`);
  const selector = (entity === 'Org') ? newUserPage.selectors.caasOrgIdInput : newUserPage.selectors.customerIdInput;
  await helper.inputText(selector, id);
  await helper.enterReturnFromKeyboard();
});

Then(/^BankUser enters Org ID from "(\d+)(?:st|nd|rd|th)" API created org on new user page and hits ENTER$/, async function (n){
  const id = this.orgs[n-1].orgId;
  logger.info(`Enter Org ID: ${id} and hit Enter`);
  const selector = newUserPage.selectors.caasOrgIdInput;
  await helper.inputText(selector,id);
  await helper.enterReturnFromKeyboard();
});

Then(/^BankUser enters the ID of the "(\d+)(?:st|nd|rd|th)" API created (Org|Customer) and hits ENTER$/, async function (n, entity) {
  if (!this.userData) this.userData = {};
  if (entity === 'Org') {
    if (!this.userData.caasOrg) this.userData.caasOrg = {};
    const orgId = this.orgs[n - 1].orgId;
    await helper.inputText(newUserPage.selectors.caasOrgIdInput, orgId);
    this.userData.caasOrg['orgId'] = orgId;
    this.userData.caasOrg['orgName'] = this.orgs[n - 1].orgName;
  } else {
    if (!this.userData.customer) this.userData.customer = {};
    const customerId = this.customers[n - 1].customerId;
    logger.info(`Enter Customer ID: ${customerId} and hit ENTER`);
    await helper.inputText(newUserPage.selectors.customerIdInput, customerId);
    this.userData.customer['customerId'] = customerId;
    this.userData.customer['customerName'] = this.customers[n - 1].customerName;
  }
  await helper.enterReturnFromKeyboard();
});

Then(/^BankUser enters the ID of the "(\d+)(?:st|nd|rd|th)" API created (Org|Customer) in Search dialog, then clicks on Search$/, async function (n, entity) {
  if (!this.userData) this.userData = {};
  if (entity === 'Org') {
    if (!this.userData.caasOrg) this.userData.caasOrg = {};
    const orgId = this.orgs[n - 1].orgId;
    await helper.inputText(newUserPage.selectors.searchDialog.orgIdInput, orgId);
    this.userData.caasOrg['orgId'] = orgId;
    this.userData.caasOrg['orgName'] = this.orgs[n - 1].orgName;
  } else {
    if (!this.userData.customer) this.userData.customer = {};
    const customerId = this.customers[n - 1].customerId;
    logger.info(`Enter Customer ID: ${customerId} and hit ENTER`);
    await helper.inputText(newUserPage.selectors.searchDialog.customerIdInput, customerId);
    this.userData.customer['customerId'] = customerId;
    this.userData.customer['customerName'] = this.customers[n - 1].customerName;
  }
  await helper.click(newUserPage.selectors.searchDialog.searchBtn);
});

Then(/^BankUser enters the "(\d+)(?:st|nd|rd|th)" API created (Org|Customer) as search criteria in Search Dialog(|, with leading \/ trailing spaces), then clicks on Search$/, async function (n, entity, extraSpaces) {
  let trimmedCriterias;
  if (entity === 'Org') {
    trimmedCriterias = {
      orgId: this.orgs[n - 1].orgId,
      orgName: this.orgs[n - 1].orgName,
      bin: this.orgs[n - 1].bin
    }
  } else {
    trimmedCriterias = {
      customerId: this.customers[n - 1].customerId,
      customerName: this.customers[n - 1].customerName
    }
  }
  const searchCriterias = (extraSpaces === 'with leading \/ trailing spaces, ') ? randomData.addRandomLeadingTrailingSpacesInDataTableValues(trimmedCriterias) : trimmedCriterias;

  await helper.inputTextIfNotNull(newUserPage.selectors.searchDialog.orgIdInput, searchCriterias['orgId']);
  await helper.inputTextIfNotNull(newUserPage.selectors.searchDialog.orgNameInput, searchCriterias['orgName']);
  await helper.inputTextIfNotNull(newUserPage.selectors.searchDialog.binInput, searchCriterias['bin']);
  await helper.inputTextIfNotNull(newUserPage.selectors.searchDialog.customerIdInput, searchCriterias['customerId']);
  await helper.inputTextIfNotNull(newUserPage.selectors.searchDialog.customerNameInput, searchCriterias['customerName']);
  await helper.inputTextIfNotNull(newUserPage.selectors.searchDialog.jurisdictionsInput, searchCriterias['jurisdictions']);

  await helper.click(newUserPage.selectors.searchDialog.searchBtn);

  this.searchCriterias = searchCriterias;
});

Then(/^BankUser enters search criteria in Search dialog, then clicks on Search:$/, async function (searchCriterias) {
  const data = searchCriterias.rowsHash();
  let criterias = data;

  // if any of the criteria is "{{randomString}}", takes the randomString from this.rndmStr, which was saved to the scenario previously in the API step to create Org
  for (let value of Object.values(criterias)) {
    if (value === "{{randomString}}") {
      criterias[Object.keys(criterias)[Object.values(criterias).indexOf(value)]] = this.rndmStr;
    }
  }

  await helper.inputTextIfNotNull(newUserPage.selectors.searchDialog.orgIdInput, criterias['orgId']);
  await helper.inputTextIfNotNull(newUserPage.selectors.searchDialog.orgNameInput, criterias['orgName']);
  await helper.inputTextIfNotNull(newUserPage.selectors.searchDialog.binInput, criterias['bin']);
  await helper.inputTextIfNotNull(newUserPage.selectors.searchDialog.customerIdInput, criterias['customerId']);
  await helper.inputTextIfNotNull(newUserPage.selectors.searchDialog.customerNameInput, criterias['customerName']);
  await helper.inputTextIfNotNull(newUserPage.selectors.searchDialog.jurisdictionsInput, criterias['jurisdictions']);

  await helper.click(newUserPage.selectors.searchDialog.searchBtn);

  // Save the trimmed search criterias for later use
  this.searchCriterias = criterias;
});

Then(/^BankUser enters in Org Id from "(\d+)(?:st|nd|rd|th)" API created org in Search dialog, then click on Search$/, async function(n){
  const id = this.orgs[n-1].orgId;
  await helper.inputTextIfNotNull(newUserPage.selectors.searchDialog.orgIdInput, id);
  await helper.click(newUserPage.selectors.searchDialog.searchBtn);
});


Then(/^BankUser selects the "(\d+)(?:st|nd|rd|th)" item in the search results then clicks on "(OK|Cancel)"$/, async function (n, button) {
  logger.info(`Select item No. ${n} in the search result grid`);
  await helper.waitUntilTextInElement(newUserPage.getCellSelectorByRowAndColumn(n, 1), 20);
  const isSearchOnOrgs = (await helper.getElementText(newUserPage.selectors.searchDialog.title)).includes('Search CAAS Org');

  if (button === 'OK') {
    if (!this.userData) this.userData = {};
    const entity = await selectNthRowFromSearchOrgOrCustomerResults(n);
    isSearchOnOrgs ? this.userData['caasOrg'] = entity : this.userData['customer'] = entity;
    await helper.click(newUserPage.selectors.searchDialog.okBtn);
  } else {
    await helper.click(newUserPage.getSelectorOfNthItemInSearchResultsGrid(n));
    await helper.click(newUserPage.selectors.searchDialog.cancelBtn);
    await helper.waitForElementToDisAppear(newUserPage.selectors.searchDialog.title, 2);
  }
});

Then(/^BankUser selects the "(\d+)(?:st|nd|rd|th)" item in the search results by double clicking$/, async function (n) {
  logger.info(`Select item No. ${n} in the search result grid`);
  await helper.waitUntilTextInElement(newUserPage.getCellSelectorByRowAndColumn(n, 1), 20);

  const isSearchOnOrgs = (await helper.getElementText(newUserPage.selectors.searchDialog.title)).includes('Search CAAS Org');
  if (!this.userData) this.userData = {};
  const entity = await selectNthRowFromSearchOrgOrCustomerResults(n);
  isSearchOnOrgs ? this.userData['caasOrg'] = entity : this.userData['customer'] = entity;
  await helper.doubleClick(newUserPage.getSelectorOfNthItemInSearchResultsGrid(n));
});

Then(/^BankUser searches (Org|Customer) with comma separated IDs from the API created entities as search criteria$/, async function (entity) {
  if (entity === 'Org') {
    if (this.orgs.length <= 1) {
      throw ('Not enough Orgs created for comma separated ID search');
    }
    let orgIds = [];
    for (let org of this.orgs) orgIds.push(org.orgId);
    const criteria = orgIds.join(',');
    await helper.inputText(newUserPage.selectors.searchDialog.orgIdInput, criteria);
    await helper.click(newUserPage.selectors.searchDialog.searchBtn);

    this.searchCriterias = { orgId: criteria };
  } else {
    if (this.customers.length <= 1) {
      throw ('Not enough Customers created for comma separated ID search');
    }
    let customerIds = [];
    for (let customer of this.customers) customerIds.push(customer.customerId);
    const criteria = customerIds.join(',');
    await helper.inputText(newUserPage.selectors.searchDialog.customerIdInput, criteria);
    await helper.click(newUserPage.selectors.searchDialog.searchBtn);

    this.searchCriterias = { customerId: criteria };
  }

  logger.info(`Save search criteria to scenario: ${JSON.stringify(this.searchCriterias)}`);
});

Then(/^BankUser dismisses Search dialog$/, async function () {
  await helper.click(newUserPage.selectors.searchDialog.cancelBtn);
  await helper.waitForElementToDisAppear(newUserPage.selectors.searchDialog.title, 2);
});

Then(/^BankUser clears the entered (Org|Customer) ID$/, async function (entity) {
  await helper.waitForDisplayed(newUserPage.selectors.caasOrgNameValue);
  await helper.pause(1); // extra wait for the page to settle
  if (entity === 'Org') {
    await helper.waitForDisplayed(newUserPage.selectors.clearCassOrgIcon);
    await helper.click(newUserPage.selectors.clearCassOrgIcon);
    await helper.waitForElementToDisAppear(newUserPage.selectors.caasOrgNameLabel, 2);
    await helper.waitForElementToDisAppear(newUserPage.selectors.clearCassOrgIcon, 1);
    expect((await helper.getElementAttribute(newUserPage.selectors.caasOrgIdInput, 'value')).trim()).to.equal('');
    expect(await helper.ifDisabledAttributeExist(newUserPage.selectors.caasOrgIdInput)).to.equal(false);
    expect(await helper.isElementPresent(newUserPage.selectors.caasOrgNameValue)).to.equal(false);
  } else {
    await helper.waitForDisplayed(newUserPage.selectors.clearCustomerIcon);
    await helper.click(newUserPage.selectors.clearCustomerIcon);
    await helper.waitForElementToDisAppear(newUserPage.selectors.customerNameLabel, 2);
    await helper.waitForElementToDisAppear(newUserPage.selectors.clearCustomerIcon, 1);
    expect((await helper.getElementAttribute(newUserPage.selectors.customerIdInput, 'value')).trim()).to.equal('');
    expect(await helper.ifDisabledAttributeExist(newUserPage.selectors.customerIdInput)).to.equal(false);
    expect(await helper.isElementPresent(newUserPage.selectors.customerNameValue)).to.equal(false);
  }
});

Then(/^check User has been created successfully$/, { wrapperOptions: { retry: 1 } }, async function () {
  const successMsg = `User ${this.userData.firstName} ${this.userData.surName} (${this.userData.userId}) has been submitted for approval.`;
  await helper.waitForTextInElement(newUserPage.selectors.successNotificationMsg, successMsg, 15);
  await helper.screenshot(`userCreated-${this.userData.userId}`);
  logger.info(successMsg);

  this.userData.status = 'New';
  this.userData.workflow = 'Pending Approval - Create';
  this.userData.sourceSystem = 'COBRA';
  if (this.userData.applications && this.userData.applications.length >= 1) {
    for (var i = 0; i < this.userData.applications.length; i++) {
      Object.values(this.userData.applications[i])[0]['status'] = 'New';
    }
  }
  if (this.userData.securityDevices && this.userData.securityDevices.length >= 1) {
    for (var i = 0; i < this.userData.securityDevices.length; i++) {
      this.userData.securityDevices[i]['status'] = 'New';
    }
  }
  console.log(JSON.stringify(this.userData));
  await helper.waitForDisplayed(newOnboardingPage.selectors.newUser);
});

// https://confluence.service.anz/pages/viewpage.action?spaceKey=WDCDT&title=Create+User+Details+Tab+Screen+Elements
Then(/^check Create User page 1 default display$/, async function () {
  expect((await helper.getElementText(newUserPage.selectors.header)).trim()).to.equal('Create User');

  logger.info('Check "General Details" section default display');
  expect(await (await newUserPage.getDataSectionHeadingByIndex(0)).getText()).to.equal('General Details');
  expect((await helper.getElementText(newUserPage.selectors.userIdLabel)).trim()).to.equal('User ID');
  expect((await helper.getElementText(newUserPage.selectors.firstNameLabel)).trim()).to.equal('First Name');
  expect((await helper.getElementText(newUserPage.selectors.middleNameLabel)).trim()).to.equal('Middle Name');
  expect((await helper.getElementText(newUserPage.selectors.surNameLabel)).trim()).to.equal('Surname');
  expect((await helper.getElementText(newUserPage.selectors.prefFirstNameLabel)).trim()).to.equal('Preferred First Name');
  expect((await helper.getElementText(newUserPage.selectors.dobLabel)).trim()).to.equal('Date of Birth');
  expect((await helper.getElementAttribute(newUserPage.selectors.dobInput, 'placeholder')).trim()).to.equal('DD/MM/YYYY');
  expect((await helper.getElementText(newUserPage.selectors.prefLangLabel)).trim()).to.equal('Preferred Language');
  expect((await helper.getElementAttribute(newUserPage.selectors.prefLangSelect, 'value'))).to.equal('English');
  expect((await helper.getElementText(newUserPage.selectors.kycIdLabel)).trim()).to.equal('KYC ID');
  expect((await helper.getElementText(newUserPage.selectors.managedByLabel)).trim()).to.equal('ANZ Managed');
  expect(await helper.isRadioButtonChecked(newUserPage.selectors.anzManagedYes)).to.equal(true);
  expect(await helper.isRadioButtonChecked(newUserPage.selectors.anzManagedNo)).to.equal(false);
  expect(await helper.ifDisabledAttributeExist(newUserPage.selectors.anzManagedYes)).to.equal(true);
  expect(await helper.ifDisabledAttributeExist(newUserPage.selectors.anzManagedNo)).to.equal(true);
  expect((await helper.getElementText(newUserPage.selectors.customerIdLabel)).trim()).to.equal('Customer ID');
  expect((await helper.getElementText(newUserPage.selectors.caasOrgIdLabel)).trim()).to.equal('CAAS Org ID');

  logger.info('Check "Contact Details" section default display');
  expect(await (await newUserPage.getDataSectionHeadingByIndex(1)).getText()).to.equal('Contact Details');
  expect((await helper.getElementText(newUserPage.selectors.addressLabel)).trim()).to.equal('Address');
  expect((await helper.getElementText(newUserPage.selectors.emailLabel)).trim()).to.equal('Email Address');
  expect((await helper.getElementText(newUserPage.selectors.mobileNoLabel)).trim()).to.equal('Mobile Number');
  expect((await helper.getElementText(newUserPage.selectors.otherPhoneNoLabel)).trim()).to.equal('Other Phone Number');

  await helper.screenshot('newUser-page-1-default-display');
});

Then(/^check Address dropdown is "(Enabled|Disabled)"$/, async function (status) {
  if (status === 'Disabled') {
    expect(await newUserPage.isDisabled(newUserPage.selectors.addressSelect)).to.equal(true);
  } else {
    expect(await newUserPage.isDisabled(newUserPage.selectors.addressSelect)).to.equal(false);
  }
});

Then(/^check "(User ID|First Name|Middle Name|Surname|Preferred First Name|Date of Birth|CAAS Org ID|Address|KYC ID|Email Address|Address Line 1|Address Line 2|Suburb \/ City|State \/ Province|Postal Code|Mobile Number|Other Phone Number)" (data validation|mandatory field|future date|not provided at the same time) error on (Create|Modify) User screen$/, async function (field, errType, screen) {
  await checkDataFieldValidationErrMsg(field, errType);
});

Then(/^check "(User ID|First Name|Middle Name|Surname|Preferred First Name|Date of Birth|KYC ID|Email Address)" (Accepted|Not Accepted) by data validation on Create User screen$/, async function (field, ifAccepted) {
  await checkFieldValueAcceptedOrNotAndErrMsg(field, ifAccepted);
});

Then(/^check the entered User data are retained$/, async function () {
  logger.info('Check the entered User data are retained');
  expect((await helper.getElementValue(newUserPage.selectors.userIdInput))).to.equal(this.userData.userId);
  expect((await helper.getElementValue(newUserPage.selectors.firstNameInput))).to.equal(this.userData.firstName);
  expect((await helper.getElementValue(newUserPage.selectors.middleNameInput))).to.equal(this.userData.middleName);
  expect((await helper.getElementValue(newUserPage.selectors.surNameInput))).to.equal(this.userData.surName);
  expect((await helper.getElementValue(newUserPage.selectors.prefFirstNameInput))).to.equal(this.userData.prefFirstName);
  expect((await helper.getElementValue(newUserPage.selectors.dobInput))).to.equal(this.userData.dob);
  expect((await helper.getElementValue(newUserPage.selectors.prefLangSelect))).to.equal(this.userData.prefLang);
  expect((await helper.getElementValue(newUserPage.selectors.kycIdInput))).to.equal(this.userData.kycId);
  expect((await helper.getElementValue(newUserPage.selectors.caasOrgIdInput))).to.equal(this.userData.caasOrg.orgId);
  const concatAddr = [this.userData.address.addressLine1, this.userData.address.suburbOrCity, this.userData.address.country].join(', ');
  expect(await helper.getSelectedOptionTextInDropdown(newUserPage.selectors.addressSelect)).to.equal(concatAddr);
  expect((await helper.getElementValue(newUserPage.selectors.emailInput))).to.equal(this.userData.email);
  expect((await helper.getSelectedOptionTextInDropdown(newUserPage.selectors.mobilePrefixSelect)).includes('Australia')).to.equal(true);
  expect((await helper.getElementValue(newUserPage.selectors.mobileNoInput))).to.equal(this.userData.mobile.number.toString());
  expect((await helper.getSelectedOptionTextInDropdown(newUserPage.selectors.otherPhonePrefixSelect)).includes('Australia')).to.equal(true);
  expect((await helper.getElementValue(newUserPage.selectors.otherPhoneNoInput))).to.equal(this.userData.otherPhone.number.toString());
});

Then(/^check (Org|Customer) is selected and displayed correctly$/, async function (entity) {
  if (entity === 'Org') {
    await checkOrgEnteredAndDisplayedCorrectly(this.userData.caasOrg.orgId, this.userData.caasOrg.orgName);
  } else {
    await checkCustomerEnteredAndDisplayedCorrectly(this.userData.customer.customerId, this.userData.customer.customerName);
  }
})

Then(/^check the "(\d+)(?:st|nd|rd|th)" API created (Org|Customer) is selected and displayed correctly$/, async function (n, entity) {
  entity.includes('Org') ? await checkOrgEnteredAndDisplayedCorrectly(this.orgs[n - 1].orgId, this.orgs[n - 1].orgName) :
    await checkCustomerEnteredAndDisplayedCorrectly(this.customers[n - 1].customerId, this.customers[n - 1].customerName)
});

Then(/^check CAAS Org is defaulted to the 1st created Org in alphabetic ascending order and displayed correctly$/, async function () {
  const orgs = sortData.sortArrayOfMapByFieldInAlphabeticOrder(this.orgs, 'orgId');
  await checkOrgEnteredAndDisplayedCorrectly(orgs[0].orgId, orgs[0].orgName);
});

Then(/^check CAAS Org is NOT defaulted to any value$/, async function () {
  logger.info('Check CAAS Org ID input box is empty and enabled, and clear CAAS Org ID icon does NOT exists');
  expect(await newUserPage.isDisabled(newUserPage.selectors.caasOrgIdInput)).to.equal(false);
  expect((await helper.getElementAttribute(newUserPage.selectors.caasOrgIdInput, 'value'))).to.equal('');
  expect(await helper.isElementPresent(newUserPage.selectors.clearCassOrgIcon)).to.equal(false);
  expect(await newUserPage.isDisabled(newUserPage.selectors.caasOrgIdInput)).to.equal(false);
});

Then(/^check error message MSG047 is displayed under Search CAAS Org field$/, async function () {
  expect(await helper.getElementText(newUserPage.selectors.caasOrgIdDataErrMsg)).to.equal(newUserPage.screenMessages.msg047);
  await helper.screenshot('orgDoesNotHaveTGAssignedErr');
});

Then(/^check Customer and CAAS Org info are all cleared$/, async function () {
  await helper.waitForElementToDisAppear(newUserPage.selectors.customerNameValue, 2);
  await helper.waitForElementToDisAppear(newUserPage.selectors.clearCustomerIcon, 1);
  expect((await helper.getElementAttribute(newUserPage.selectors.customerIdInput, 'value')).trim()).to.equal('');
  expect(await helper.ifDisabledAttributeExist(newUserPage.selectors.customerIdInput)).to.equal(false);
  expect(await helper.isElementPresent(newUserPage.selectors.clearCustomerIcon)).to.equal(false);
  expect(await helper.isElementPresent(newUserPage.selectors.customerNameLabel)).to.equal(false);
  expect((await helper.getElementAttribute(newUserPage.selectors.caasOrgIdInput, 'value')).trim()).to.equal('');
  expect(await helper.ifDisabledAttributeExist(newUserPage.selectors.caasOrgIdInput)).to.equal(false);
  expect(await helper.isElementPresent(newUserPage.selectors.caasOrgNameLabel)).to.equal(false);
  expect(await helper.isElementPresent(newUserPage.selectors.clearCassOrgIcon)).to.equal(false);
});

Then(/^check Search (Org|Customer) dialog default display$/, async function (entity) {
  await helper.waitForElementToAppear(newUserPage.selectors.searchDialog.searchBtn, 5);

  logger.info(`check display of Search ${entity} dialog`);
  if (entity === 'Org') {
    expect(await helper.getElementText(newUserPage.selectors.searchDialog.title)).to.equal('Search CAAS Org');
    expect(await helper.getElementText(newUserPage.selectors.searchDialog.orgIdLabel)).to.equal('CAAS Org ID');
    expect(await helper.getElementText(newUserPage.selectors.searchDialog.orgNameLabel)).to.equal('Full Name');
    expect(await helper.getElementText(newUserPage.selectors.searchDialog.binLabel)).to.equal('Business Identifying Number');
  } else {
    expect(await helper.getElementText(newUserPage.selectors.searchDialog.title)).to.equal('Search Customers');
    expect(await helper.getElementText(newUserPage.selectors.searchDialog.customerIdLabel)).to.equal('Customer ID');
    expect(await helper.getElementText(newUserPage.selectors.searchDialog.customerNameLabel)).to.equal('Customer Name');
    expect(await helper.getElementText(newUserPage.selectors.searchDialog.jurisdictionsLabel)).to.equal('Jurisdiction');
  }

  expect(await helper.isElementPresent(newUserPage.selectors.searchDialog.searchBtn));
  expect(await helper.getElementText(newUserPage.selectors.searchDialog.searchNoteMessage)).to.equal(newUserPage.getMsg075(entity));
  expect(await helper.isElementPresent(newUserPage.selectors.searchDialog.okBtn));
  expect(await helper.isElementPresent(newUserPage.selectors.searchDialog.cancelBtn));
});

Then(/^check (Org|Customer) Id search criteria set to "(.*)"$/, async function (entity, id) {
  const selector = (entity === 'Org') ? newUserPage.selectors.searchDialog.orgIdValue : newUserPage.selectors.searchDialog.customerIdValue;
  expect((await helper.getElementText(selector)).trim()).to.equal(id);
});

Then(/^check lookup status to be "(.*)"$/, async function (msg) {
  expect(await helper.getElementText(newUserPage.selectors.lookupStatus)).to.equal(msg);
});

Then(/^check the canceled org selection is discarded$/, async function () {
  const value = await helper.getElementAttribute(newUserPage.selectors.caasOrgIdInput, 'value');
  expect(!value || value.length === 0).to.be.equal(true);
});

Then(/^check the leading \/ trailing spaces have been trimmed in the entered criterias$/, async function () {
  // Search criterias have been saved in scenario context previously when doing the search
  logger.info('Check entered search criterias have been trimmed off the leading / trailing spaces');
  if ('orgId' in this.searchCriterias) {
    await checkExtraSpacesTrimmedInSearchCriteriaField(this.searchCriterias, 'orgId', newUserPage.selectors.searchDialog.orgIdValue);
  }
  if ('orgName' in this.searchCriterias) {
    await checkExtraSpacesTrimmedInSearchCriteriaField(this.searchCriterias, 'orgName', newUserPage.selectors.searchDialog.orgNameValue);
  }
  if ('bin' in this.searchCriterias) {
    await checkExtraSpacesTrimmedInSearchCriteriaField(this.searchCriterias, 'bin', newUserPage.selectors.searchDialog.binValue);
  }
  if ('customerId' in this.searchCriterias) {
    await checkExtraSpacesTrimmedInSearchCriteriaField(this.searchCriterias, 'customerId', newUserPage.selectors.searchDialog.customerIdValue);
  }
  if ('customerName' in this.searchCriterias) {
    await checkExtraSpacesTrimmedInSearchCriteriaField(this.searchCriterias, 'customerName', newUserPage.selectors.searchDialog.customerNameValue);
  }

  await helper.screenshot(`searchCriteriaTrimmed`);
});

Then(/^check no leading \/ trailing spaces in the Search result$/, async function () {
  const numOfRows = (await createUserSecDevicesPage.getNumberOfAddedDevices()) > 5 ? 5 : (await createUserSecDevicesPage.getNumberOfAddedDevices());
  logger.info('Check the search results contins no leading or trailing spaces');
  for (let i = 1; i <= numOfRows; i++) {
    expect(hasLeadingOrTrailingSpaces(await helper.getElementText(newUserPage.getCellSelectorByRowAndColumn(i, 1)))).to.equal(false);
    expect(hasLeadingOrTrailingSpaces(await helper.getElementText(newUserPage.getCellSelectorByRowAndColumn(i, 2)))).to.equal(false);
    expect(hasLeadingOrTrailingSpaces(await helper.getElementText(newUserPage.getCellSelectorByRowAndColumn(i, 3)))).to.equal(false);
  }
});

Then(/^check the Search Org results display$/, async function () {
  logger.info('Check search org results are displayed in alphabetic order by name');
  const rows = await $$(newUserPage.selectors.searchDialog.resultGridRow);
  let orgNames = [];
  for (var i = 0; i < rows.length; i++) {
    orgNames.push(await newUserPage.getCellSelectorByRowAndColumn(i, 2));
  }
  let sortedNames = orgNames.sort();
  expect(_.isEqual(orgNames, sortedNames));

  logger.info('Check the 1st result is selected');
  expect(await helper.getElementAttribute(newUserPage.selectors.searchDialog.resultGridRow, 'active')).to.not.equal(undefined);
  await helper.screenshot(`searchOrgResults`);
});

Then(/^check more than 1 matching records are returned in the search results$/, async function () {
  expect((await newUserPage.getNumberOfRowsInSearchDialog()) > 1).to.equal(true);
});

Then(/^check the Search (Org|Customer) result meets \"and\" and \"contains\" logic on all criterias$/, async function (entity) {
  // Search criterias have been saved in scenario context previously when doing the search
  const criterias = this.searchCriterias;
  const id = await helper.getElementText(newUserPage.getCellSelectorByRowAndColumn(1, 1));
  const name = await helper.getElementText(newUserPage.getCellSelectorByRowAndColumn(1, 2));
  const binOrJurisdictions = await helper.getElementText(newUserPage.getCellSelectorByRowAndColumn(1, 3));

  if (entity === 'Org') {
    if (criterias.orgId !== undefined) {
      expect(id.includes(criterias.orgId)).to.equal(true);
    }
    if (criterias.orgName !== undefined) {
      expect(name.includes(criterias.orgName)).to.equal(true);
    }
    if (criterias.bin !== undefined) {
      expect(binOrJurisdictions.includes(criterias.bin)).to.equal(true);
    }
  } else {
    if (criterias.customerId !== undefined) {
      expect(id.includes(criterias.customerId)).to.equal(true);
    }
    if (criterias.customerName !== undefined) {
      expect(name.includes(criterias.customerName)).to.equal(true);
    }
    if (criterias.jurisdictions !== undefined) {
      expect(binOrJurisdictions.includes(criterias.jurisdictions)).to.equal(true);
    }
  }
});

Then(/^check the Search (Org|Customer) result meets \"or\" logic on entered comma separated IDs$/, async function (entity) {
  const searchedIds = (entity === 'Org') ? this.searchCriterias.orgId.replace(', ', ',').split(",") : this.searchCriterias.customerId.replace(', ', ',').split(",");
  const result1 = await helper.getElementText(newUserPage.getCellSelectorByRowAndColumn(1, 1));
  const result2 = await helper.getElementText(newUserPage.getCellSelectorByRowAndColumn(2, 1));

  expect(searchedIds.indexOf(result1) > -1).to.equal(true);
  expect(searchedIds.indexOf(result2) > -1).to.equal(true);
});

Then(/^check the \"No Record Found\" message in Search dialog$/, async function () {
  expect(await helper.getElementText(newUserPage.selectors.searchDialog.noResultMsg)).to.equal(newUserPage.screenMessages.msg007);
  await helper.screenshot('searchOrg-noRecordFound');
});

Then(/^check the "(\d+)" options in Address dropdown$/, async function (n) {
  await helper.waitForEnabled(newUserPage.selectors.addressSelect);
  if (n < 2) {
    throw ('At least 2 options in the Address dropdown: Blank, and "+ Add New Address"');
  } else {
    const options = await newUserPage.getAvailableDropdownOptions(newUserPage.selectors.addressSelect);
    expect(options[0].trim()).to.equal('');
    expect(options[1].trim()).to.equal('+ Add New Address');
    if (n == 2) {
      expect(options.length).to.equal(2);
    } else {
      expect(options.length > 2 && options.length <= 12).to.equal(true);
      const addrOptions = options.splice(2);
      const addrOptionsSorted = sortData.sortSimpleArrayByAlphabeticOrder(addrOptions);
      // the addresses that have been associated with the Org come from the previously created Users via API
      let userAddresses = [];
      for (let user of this.users) userAddresses.push(concatAddress(user['address']));
      // get rid of duplicates in the address array from this.users
      var uniqueAddresses = userAddresses.filter((x, i) => i === userAddresses.indexOf(x));
      const availAddressesSorted = sortData.sortSimpleArrayByAlphabeticOrder(uniqueAddresses);
      console.log(JSON.stringify(addrOptionsSorted))
      console.log(JSON.stringify(availAddressesSorted))
      expect(JSON.stringify(addrOptionsSorted)).to.equal(JSON.stringify(availAddressesSorted));
    }
  }
});

Then(/^check Address dropdown \"mandatory field\" error messages$/, async function () {
  await newUserPage.openAddressDialog();
  await helper.click(newUserPage.selectors.addressDialog.okBtn);
  expect(await helper.getElementText(newUserPage.selectors.addressDialog.addrLine1ErrMsg)).to.equal(newUserPage.screenMessages.addrLine1MandatoryMsg);
  expect(await helper.getElementText(newUserPage.selectors.addressDialog.suburbErrMsg)).to.equal(newUserPage.screenMessages.suburbMandatoryMsg);
  await helper.click(newUserPage.selectors.addressDialog.cancelBtn);
});

Then(/^check the entered address is displayed as selected option in Address dropdown$/, async function () {
  const concatAddr = concatAddress(this.userData.address);
  expect(await helper.getSelectedOptionTextInDropdown(newUserPage.selectors.addressSelect)).to.equal(concatAddr);
});

Then(/^check the entered address is NOT added to Address dropdown$/, async function () {
  const concatAddr = concatAddress(this.userData.address);
  const options = await newUserPage.getAvailableDropdownOptions(newUserPage.selectors.addressSelect);
  expect(options.indexOf(concatAddr)).to.equal(-1);
});

Then(/^check the entered address is cleared and Address dropdown disabled$/, async function () {
  expect(await helper.getSelectedOptionTextInDropdown(newUserPage.selectors.addressSelect)).to.equal('');
  expect(await newUserPage.isDisabled(newUserPage.selectors.addressSelect)).to.equal(true);
});

Then(/^check mobile country prefix is defaulted to the country of the entered address$/, async function () {
  const countryCode = this.userData.address.country;
  expect((await helper.getSelectedOptionTextInDropdown(newUserPage.selectors.mobilePrefixSelect)).includes(countryCode)).to.equal(true);
});

Then(/^check most commonly used country calling codes list in "(Mobile Number|Other Phone Number)" country dropdown$/, async function (name) {
  const selector = (name === 'Mobile Number') ? newUserPage.selectors.mobilePrefixSelect : newUserPage.selectors.otherPhonePrefixSelect;
  await helper.waitForEnabled(selector);
  await helper.click(selector);
  for (let i = 0; i < MOST_COMMON_COUNTRIES.length; i++) {
    expect(await newUserPage.getTextOfNthOptionInDropdown(selector, i + 2)).to.equal(MOST_COMMON_COUNTRIES[i]);
  }
});

Then(/^check \"Mobile Number\" is trimmed off leading 0s and spaces$/, async function () {
  const trimmedNumber = this.userData.mobile.number.replace(/^0+/, '').replace(/ /g, '');
  expect(await helper.getElementValue(newUserPage.selectors.mobileNoInput)).to.equal(trimmedNumber);
});

Then(/^check \"Other Phone Number\" is trimmed off spaces$/, async function () {
  const trimmedNumber = this.userData.otherPhone.number.replace(/ /g, '');
  expect(await helper.getElementValue(newUserPage.selectors.otherPhoneNoInput)).to.equal(trimmedNumber);
});

Then(/^check User fields has been truncated to the max allowed length$/, async function () {
  expect(await helper.getElementAttribute(newUserPage.selectors.userIdInput, 'value')).to.equal(this.userData.userId.substring(0, newUserPage.fieldLengths.userIdMaxLength));
  expect(await helper.getElementValue(newUserPage.selectors.firstNameInput)).to.equal(this.userData.firstName.substring(0, newUserPage.fieldLengths.nameFieldMaxLength));
  expect(await helper.getElementValue(newUserPage.selectors.middleNameInput)).to.equal(this.userData.middleName.substring(0, newUserPage.fieldLengths.nameFieldMaxLength));
  expect(await helper.getElementValue(newUserPage.selectors.surNameInput)).to.equal(this.userData.surName.substring(0, newUserPage.fieldLengths.nameFieldMaxLength));
  expect(await helper.getElementValue(newUserPage.selectors.prefFirstNameInput)).to.equal(this.userData.prefFirstName.substring(0, newUserPage.fieldLengths.nameFieldMaxLength));
  expect(await helper.getElementValue(newUserPage.selectors.kycIdInput)).to.equal(this.userData.kycId.substring(0, newUserPage.fieldLengths.kycIdMaxLength));
  expect(await helper.getElementValue(newUserPage.selectors.emailInput)).to.equal(this.userData.email.substring(0, newUserPage.fieldLengths.emailMaxLength));
  await helper.screenshot('createUserFieldsTruncatedToMaxLength');
});

Then(/^BankUser fills user data with the created Org (with|without) a Customer, then moves to Add Application page$/, async function (withWithoutCustomer) {
  logger.info(`Fill in user data ${withWithoutCustomer} assigning a Customer to the User, then move to Add Application screen`);
  const withCustomer = (withWithoutCustomer === 'with');
  let customerId = undefined;
  if (withWithoutCustomer === 'with') {
    // The Customer should have been created in previous step by API and saved in this.customers
    customerId = this.customers[0].customerId;
  }
  this.userData = await newUserPage.fillInUserDetails({}, withCustomer, customerId, this.orgs[0].orgId, undefined);
  await helper.click(MenuBar.selectors.continue);
});

Then(/^BankUser fills user data with the created Org, without email and mobile number, then moves to Add Application page$/, async function () {
  let userData = {};
  userData['email'] = '';
  userData['mobile'] = { country: '', number: '' },
    this.userData = await newUserPage.fillInUserDetails(userData, false, undefined, this.orgs[0].orgId, undefined);
  await helper.click(MenuBar.selectors.continue);
});

Then(/^checks the objects on Add Application page$/, async function () {
  expect((await helper.getElementAttribute(createUserAppsPage.selectors.addApplicationButton, 'class')).includes('disabled')).to.equal(false);
  expect((await helper.getElementAttribute(createUserAppsPage.selectors.editApplicationButton, 'class')).includes('disabled')).to.equal(true);
  expect((await helper.getElementAttribute(createUserAppsPage.selectors.removeApplicationButton, 'class')).includes('disabled')).to.equal(true);
  expect((await helper.getElementAttribute(MenuBar.selectors.cancel, 'class')).includes('disabled')).to.equal(false);
  expect((await helper.getElementAttribute(MenuBar.selectors.back, 'class')).includes('disabled')).to.equal(false);
  expect((await helper.getElementAttribute(MenuBar.selectors.continue, 'class')).includes('disabled')).to.equal(false);
  expect((await helper.getElementText(createUserAppsPage.selectors.noResultMsg)).trim()).to.equal('No Applications Selected');
  await helper.screenshot(`OnCreateUserAppPage`);
});

Then(/^check \"Transactive Global\" has been assigned on Add Application page by default$/, async function () {
  logger.info('Check TG has been added in the Applications Grid by default');
  expect(await createUserAppsPage.findAppInAppTable('Transactive Global')).to.equal(1);
  expect(await helper.getElementText(createUserAppsPage.getCellSelectorByRowAndColumn(1, 3))).to.equal('New');
  await helper.screenshot(`TGAssignedByDefault`);
});

Then(/^check "(Add|Remove|Edit)" button is "(Enabled|Disabled)" for "(.*)" application$/, async function (button, status, appName) {
  const rowNumberOfApp = await createUserAppsPage.findAppInAppTable(appName);
  await helper.click(createUserAppsPage.getCellSelectorByRowAndColumn(rowNumberOfApp, 1));
  const selector = (button === 'Add') ? createUserAppsPage.selectors.addApplicationButton : (button === 'Remove' ? createUserAppsPage.selectors.removeApplicationButton : createUserAppsPage.selectors.editApplicationButton);
  const isDisabled = status === 'Disabled';
  expect(await helper.isElementDisabled(selector)).to.equal(isDisabled);
});

Then(/^check the previously added applications have been cleared$/, async function () {
  const apps = this.userData.applications;
  for (var i = 0; i < apps.length; i++) {
    const appName = Object.keys(apps)[i];
    expect(await createUserAppsPage.findAppInAppTable(appName)).to.equal(null);
  }
});

Then(/^checks the objects on Add Application dialog$/, async function () {
  await helper.waitForDisplayed(createUserAppsPage.selectors.addApplicationButton);
  await helper.click(createUserAppsPage.selectors.addApplicationButton);
  expect((await helper.getElementAttribute(createUserAppsPage.selectors.cancelButtonInDialog, 'class')).includes('disabled')).to.equal(false);
  expect((await helper.getElementAttribute(createUserAppsPage.selectors.okButtonInDialog, 'class')).includes('disabled')).to.equal(false);
  expect((await helper.getElementText(createUserAppsPage.selectors.addApplicationTitleInDialog)).trim()).to.equal('Add Application');
  expect((await helper.getElementText(createUserAppsPage.selectors.applicationLabelInDialog)).trim()).to.equal('Application Name');
  expect((await helper.getElementText(createUserAppsPage.selectors.applicationAttributeLabelInDialog)).trim()).to.equal('Application Attributes');

  let optionIdx = await helper.getElementAttribute(createUserAppsPage.selectors.applicationSelectInDialog, 'value');
  let option = `${createUserAppsPage.selectors.applicationSelectInDialog} option[value="${optionIdx}"]`;
  expect((await helper.getElementText(option)).trim()).to.equal('eMatching');
  logger.info(`First app selected is eMatching`);
  //eMatching
  expect(await helper.ifElementExists(createUserAppsPage.selectors.userIDAttributeLabeleMatching)).to.equal(true);
  expect(await helper.ifElementExists(createUserAppsPage.selectors.userIDAttributeValueeMatching)).to.equal(true);
  logger.info(`eMatching elements are appearing properly`);
  //EsandaNet
  await helper.selectByVisibleText(createUserAppsPage.selectors.applicationSelectInDialog, "EsandaNet");
  await helper.waitForDisplayed(createUserAppsPage.selectors.iSeriesUserIDAttributeLabelEsandaNet);
  expect(await helper.ifElementExists(createUserAppsPage.selectors.iSeriesUserIDAttributeLabelEsandaNet)).to.equal(true);
  expect(await helper.ifElementExists(createUserAppsPage.selectors.iSeriesUserIDAttributeTextboxEsandaNet)).to.equal(true);
  expect(await helper.ifElementExists(createUserAppsPage.selectors.userRegionAttributeSelectEsandaNet)).to.equal(true);
  expect(await helper.ifElementExists(createUserAppsPage.selectors.userRegionAttributeLabelSelectEsandaNet)).to.equal(true);
  expect(await helper.ifElementExists(createUserAppsPage.selectors.userTypeAttributeValueEsandaNet)).to.equal(true);
  expect(await helper.ifElementExists(createUserAppsPage.selectors.userTypeAttributeLabelEsandaNet)).to.equal(true);
  logger.info(`EsandaNet elements are appearing properly`);
  // Check LM App
  await helper.selectByVisibleText(createUserAppsPage.selectors.applicationSelectInDialog, "LM");
  expect(await helper.getElementText(createUserAppsPage.selectors.noAttributeMessage)).to.equal(createUserAppsPage.screenMessages.MSG038);
  logger.info(`LM elements are appearing properly`);
  // Check GCIS App
  await helper.selectByVisibleText(createUserAppsPage.selectors.applicationSelectInDialog, "GCIS");
  expect(await helper.ifElementExists(createUserAppsPage.selectors.userIDAttributeTextboxGCIS)).to.equal(true);
  expect(await helper.ifElementExists(createUserAppsPage.selectors.userIDAttributeLabelGCIS)).to.equal(true);
  logger.info(`GCIS elements are appearing properly`);
  // Check GCP App
  await helper.selectByVisibleText(createUserAppsPage.selectors.applicationSelectInDialog, "GCP");
  expect(await helper.getElementText(createUserAppsPage.selectors.noAttributeMessage)).to.equal(createUserAppsPage.screenMessages.MSG038);
  logger.info(`GCP elements are appearing properly`);
  // Check Institutional Insights
  await helper.selectByVisibleText(createUserAppsPage.selectors.applicationSelectInDialog, "Institutional Insights");
  expect(await helper.getElementText(createUserAppsPage.selectors.noAttributeMessage)).to.equal(createUserAppsPage.screenMessages.MSG038);
  logger.info(`Institutional Insights elements are appearing properly`);
  // Check Internet Enquiry Access App
  await helper.selectByVisibleText(createUserAppsPage.selectors.applicationSelectInDialog, "Internet Enquiry Access");
  expect(await helper.ifElementExists(createUserAppsPage.selectors.crnAttributeTextboxInternetEnquiryAccess)).to.equal(true);
  expect(await helper.ifElementExists(createUserAppsPage.selectors.crnAttributeLabelInternetEnquiryAccess)).to.equal(true);
  logger.info(`Internet Enquiry Access elements are appearing properly`);
  // Check Online Trade App
  await helper.selectByVisibleText(createUserAppsPage.selectors.applicationSelectInDialog, "Online Trade");
  expect(await helper.getElementText(createUserAppsPage.selectors.noAttributeMessage)).to.equal(createUserAppsPage.screenMessages.MSG038);
  logger.info(`Online Trade elements are appearing properly`);
  // Check SDP CTS App
  await helper.selectByVisibleText(createUserAppsPage.selectors.applicationSelectInDialog, "SDP CTS");
  expect(await helper.getElementText(createUserAppsPage.selectors.noAttributeMessage)).to.equal(createUserAppsPage.screenMessages.MSG038);
  logger.info(`SDP CTS elements are appearing properly`);
  // Check Transactive Global App
  await helper.selectByVisibleText(createUserAppsPage.selectors.applicationSelectInDialog, "Transactive Global");
  expect(await helper.getElementText(createUserAppsPage.selectors.noAttributeMessage)).to.equal(createUserAppsPage.screenMessages.MSG038);
  logger.info(`Transactive Global elements are appearing properly`);
  await helper.screenshot(`OnAddAppDialogBox`);
});

Then(/^checks the add application screen attributes for:$/, async function (data) {
  const appsToCheck = data.raw();
  await helper.waitForDisplayed(createUserAppsPage.selectors.applicationSelectInDialog);

  for (let appToCheck of appsToCheck) {
    let app = appToCheck[0]
    await helper.selectByVisibleText(createUserAppsPage.selectors.applicationSelectInDialog, app);
    await helper.screenshot(`checkAppAttributesFor'${app}'`);
    if (app === 'GCIS') {
      expect(await helper.getElementValue(createUserAppsPage.selectors.userIDAttributeTextboxGCIS)).to.equal("");
      logger.info(`Verified that GCIS userID textbox value is blank initially`);
      await helper.inputText(createUserAppsPage.selectors.userIDAttributeTextboxGCIS, 'test');
      await helper.selectByVisibleText(createUserAppsPage.selectors.applicationSelectInDialog, 'EsandaNet');
      await helper.selectByVisibleText(createUserAppsPage.selectors.applicationSelectInDialog, app);
      expect(await helper.getElementValue(createUserAppsPage.selectors.userIDAttributeTextboxGCIS)).to.equal("");
      logger.info(`Verified that GCIS userID textbox value is cleared`);
    }

    if (app === 'EsandaNet') {
      expect(await helper.getElementValue(createUserAppsPage.selectors.iSeriesUserIDAttributeTextboxEsandaNet)).to.equal("");
      logger.info(`Verified that EsandaNet iSeriesUserID textbox value is blank initially`);
      await helper.inputText(createUserAppsPage.selectors.iSeriesUserIDAttributeTextboxEsandaNet, 'test');
      expect(await helper.getElementValue(createUserAppsPage.selectors.iSeriesUserIDAttributeTextboxEsandaNet)).to.equal('TEST');
      logger.info(`Verified that EsandaNet iSeriesUserID textbox converts text to uppercase`);
      await helper.selectByVisibleText(createUserAppsPage.selectors.applicationSelectInDialog, "GCIS");
      await helper.selectByVisibleText(createUserAppsPage.selectors.applicationSelectInDialog, app);
      expect(await helper.getElementValue(createUserAppsPage.selectors.iSeriesUserIDAttributeTextboxEsandaNet)).to.equal("");
      logger.info(`Verified that EsandaNet iSeriesUserID textbox value is cleared`);


      for (let i = 2; i <= 6; i++) {
        await helper.getElementAttribute(createUserAppsPage.selectors.applicationSelectInDialog, 'value');
        let option = `${createUserAppsPage.selectors.userRegionAttributeSelectEsandaNet} option[value='${[i]}']`;
        expect(await helper.getElementText(option)).to.equal(createUserAppsPage.userRegion[i])
      }
      logger.info(`User Region drop down contains all the required options`);
    }

    if (app === 'Internet Enquiry Access') {
      expect(await helper.getElementValue(createUserAppsPage.selectors.crnAttributeTextboxInternetEnquiryAccess)).to.equal("");
      logger.info(`Verified that IEA CRN textbox is blank initially`);
      await helper.inputText(createUserAppsPage.selectors.crnAttributeTextboxInternetEnquiryAccess, '123');
      await helper.selectByVisibleText(createUserAppsPage.selectors.applicationSelectInDialog, "GCIS");
      await helper.selectByVisibleText(createUserAppsPage.selectors.applicationSelectInDialog, app);
      expect(await helper.getElementValue(createUserAppsPage.selectors.crnAttributeTextboxInternetEnquiryAccess)).to.equal("");
    }

    if (app === 'eMatching') {
      expect(await helper.ifElementExists(createUserAppsPage.selectors.userIDAttributeValueeMatching)).to.equal(true);
      logger.info('Verified eMatching User ID is [system generated]');
    }
  }
});

Then(/^BankUser checks (Add|Remove|Edit|Cancel|Back|Continue|Submit) button on Add App page is (Enabled|Disabled)$/, async function (button, status) {
  logger.info(`Check ${button} button is ${status}`);
  const selector = (button === 'Add') ? createUserAppsPage.selectors.addApplicationButton : (button === 'Remove' ? createUserAppsPage.selectors.removeApplicationButton : (button === 'Edit') ? createUserAppsPage.selectors.editApplicationButton : (button === 'Cancel') ? MenuBar.selectors.cancel : (button === 'Back') ? MenuBar.selectors.back : (button === 'Continue') ? MenuBar.selectors.continue : (button === 'Submit') ? MenuBar.selectors.submit : button);
  await helper.waitForDisplayed(selector);
  logger.info(`Checking the status of ${button}is ${status}`);
  if (status === 'Enabled') {
    expect((await helper.getElementAttribute(selector, 'class')).includes('disabled')).to.equal(false);
  } else {
    expect((await helper.getElementAttribute(selector, 'class')).includes('disabled')).to.equal(true);
  }
  await helper.screenshot(`${button}Is${status}OnCreateUserAppPage`);
});

Then(/^BankUser clicks on (Add|Remove|Edit|Cancel|Back|Continue|CancelAddAppDialog|OKAddAppDialog) button on Add Application page$/, { wrapperOptions: { retry: 2 } }, async function (button) {
  const selector = (button === 'Add') ? createUserAppsPage.selectors.addApplicationButton : (button === 'Remove' ? createUserAppsPage.selectors.removeApplicationButton : (button === 'Edit') ? createUserAppsPage.selectors.editApplicationButton : (button === 'Cancel') ? MenuBar.selectors.cancel : (button === 'Back') ? MenuBar.selectors.back : (button === 'Continue') ? MenuBar.selectors.continue : (button === 'CancelAddAppDialog') ? createUserAppsPage.selectors.cancelButtonInDialog : (button === 'OKAddAppDialog') ? createUserAppsPage.selectors.okButtonInDialog : button);
  logger.info(`clicking ${button} button`);
  await helper.click(selector);
});

Then(/^BankUser selects "(No|Yes)" in the remove application confirmation dialog$/, async function (button) {
  logger.info(`User clicks on ${button} button in the confirmation dialog`);
  if (button === 'No') {
    await helper.click(createUserAppsPage.selectors.cancelButtonOnConfirmationDialog);
  } else {
    await helper.click(createUserAppsPage.selectors.confirmButtonConfirmationDialog);
  }
});

Then(/^BankUser adds (.*) of available applications to user$/, async function (numOfApps) {
  let n;
  if (numOfApps.toLowerCase() === 'all') {
    n = createCaasOrgPage.applications.length;
  } else {
    n = parseInt(numOfApps);
  }
  for (let i = 0; i < n; i++) {
    await createUserAppsPage.addApplicationToUser(null);
  }
});

Then(/^BankUser adds "(.*)" application to user$/, async function (appName) {
  await helper.click(createUserAppsPage.selectors.addApplicationButton);
  await helper.waitForDisplayed(createUserAppsPage.selectors.applicationSelectInDialog);
  await helper.selectByVisibleText(createUserAppsPage.selectors.applicationSelectInDialog, appName);
  await helper.click(createUserAppsPage.selectors.okButtonInDialog);
  logger.info(`application added sucessfully: ${appName}`);

  const application = {};
  application[appName] = {};
  if (!this.userData) this.userData = {};
  if (!this.userData.applications) this.userData['applications'] = [];
  this.userData['applications'].push(application);
});

Then(/^BankUser checks the data is retained for "(.*)" app and screen elements on Edit Application page and clicks (OK|Cancel)$/, async function (appName, button) {
  const rowNumberOfApp = await createUserAppsPage.findAppInAppTable(appName);
  await helper.click(createUserAppsPage.getCellSelectorByRowAndColumn(rowNumberOfApp, 1));
  await helper.waitForTextInAttribute(createUserAppsPage.getCellSelectorByRowAndColumn(rowNumberOfApp, 1), 'class', 'active', 5);
  await helper.click(createUserAppsPage.selectors.editApplicationButton);

  await helper.waitForDisplayed(createUserAppsPage.selectors.applicationSelectInDialog);

  logger.info(`checking if the application select list is disabled`);
  expect(await helper.ifElementEnabled(createUserAppsPage.selectors.applicationSelectInDialog)).to.equal(false);
  expect(await helper.ifElementEnabled(createUserAppsPage.selectors.okButtonInDialog)).to.equal(true);
  expect(await helper.ifElementEnabled(createUserAppsPage.selectors.cancelButtonInDialog)).to.equal(true);

  let optionIdx = await helper.getElementAttribute(createUserAppsPage.selectors.applicationSelectInDialog, 'value');
  let option = `${createUserAppsPage.selectors.applicationSelectInDialog} option[value="${optionIdx}"]`;
  logger.info(`checking the already selected app is: '${appName}'`);
  expect((await helper.getElementText(option)).trim()).to.equal(appName);
  logger.info((await helper.getElementText(option)).trim());
  if (appName === "EsandaNet") {
    expect(await helper.getElementText(createUserAppsPage.selectors.userIDAttributeLabeleMatching)).to.equal('iSeries User ID');
    expect(await helper.ifElementEnabled(createUserAppsPage.selectors.iSeriesUserIDAttributeTextboxEsandaNet)).to.equal(true);
    expect(await helper.getElementText(createUserAppsPage.selectors.userRegionAttributeLabelSelectEsandaNet)).to.equal('User Region');
    expect(await helper.ifElementEnabled(createUserAppsPage.selectors.userRegionAttributeSelectEsandaNet)).to.equal(true);
    expect(await helper.getElementText(createUserAppsPage.selectors.userTypeAttributeLabelEsandaNet)).to.equal('User Type');
    expect(await helper.ifElementExists(createUserAppsPage.selectors.userTypeAttributeValueEsandaNet)).to.equal(true);
    logger.info(`checking the data in iSeriesUserID is: '${this.iSeriesUserID.toUpperCase()}'`);
    expect(await helper.getElementValue(createUserAppsPage.selectors.iSeriesUserIDAttributeTextboxEsandaNet)).to.equal(this.iSeriesUserID.toUpperCase());
    optionIdx = await helper.getElementAttribute(createUserAppsPage.selectors.userRegionAttributeSelectEsandaNet, 'value');
    option = `${createUserAppsPage.selectors.userRegionAttributeSelectEsandaNet} option[value="${optionIdx}"]`;
    logger.info(`checking the already selected user region is : '${this.userRegion}'`);
    expect((await helper.getElementText(option)).trim()).to.equal(this.userRegion);
    await helper.inputText(createUserAppsPage.selectors.iSeriesUserIDAttributeTextboxEsandaNet, this.iSeriesUserID.toLowerCase());
    expect(await helper.getElementValue(createUserAppsPage.selectors.iSeriesUserIDAttributeTextboxEsandaNet)).to.equal(this.iSeriesUserID.toUpperCase());
  }
  if (appName === "GCIS") {
    expect(await helper.getElementText(createUserAppsPage.selectors.userIDAttributeLabelGCIS)).to.equal('GCIS User ID');
    expect(await helper.ifElementEnabled(createUserAppsPage.selectors.userIDAttributeTextboxGCIS)).to.equal(true);
    logger.info(`checking the data in userID in GCIS: '${this.userID}'`);
    expect(await helper.getElementValue(createUserAppsPage.selectors.userIDAttributeTextboxGCIS)).to.equal(this.userID);
  }
  if (appName === "Internet Enquiry Access") {
    expect(await helper.getElementText(createUserAppsPage.selectors.crnAttributeLabelInternetEnquiryAccess)).to.equal('Customer Registration Number');
    expect(await helper.ifElementEnabled(createUserAppsPage.selectors.crnAttributeLabelInternetEnquiryAccess)).to.equal(true);
    logger.info(`checking the data in CRN in Internet Enquiry Access: '${this.CRN}'`);
    expect(await helper.getElementValue(createUserAppsPage.selectors.crnAttributeTextboxInternetEnquiryAccess)).to.equal(this.CRN);
  }
  if (appName === 'eMatching') {
    expect(await helper.getElementText(createUserAppsPage.selectors.userIDAttributeLabeleMatching)).to.equal('eMatching User ID');
    expect(await helper.ifElementExists(createUserAppsPage.selectors.userIDAttributeValueeMatching)).to.equal(true);
  }

  if (button === 'OK') {
    await helper.click(createUserAppsPage.selectors.okButtonInDialog);
  }
  if (button === 'Cancel') {
    await helper.click(createUserAppsPage.selectors.cancelButtonInDialog);
  }

});

Then(/^BankUser edits "(.*)" app and checks Edit Application screen elements$/, async function (application) {
  const rowNumberOfApp = await createUserAppsPage.findAppInAppTable(application);
  await helper.click(createUserAppsPage.getCellSelectorByRowAndColumn(rowNumberOfApp, 1));
  await helper.waitForTextInAttribute(createUserAppsPage.getCellSelectorByRowAndColumn(rowNumberOfApp, 1), 'class', 'active', 5);
  await helper.click(createUserAppsPage.selectors.editApplicationButton);

  await helper.waitForDisplayed(createUserAppsPage.selectors.applicationSelectInDialog);
  expect(await helper.ifElementEnabled(createUserAppsPage.selectors.applicationSelectInDialog)).to.equal(false);
  expect(await helper.getElementText(createUserAppsPage.selectors.noAttributeMessage)).to.equal(createUserAppsPage.screenMessages.MSG038);
  expect(await helper.ifElementEnabled(createUserAppsPage.selectors.okButtonInDialog)).to.equal(true);
  expect(await helper.ifElementEnabled(createUserAppsPage.selectors.cancelButtonInDialog)).to.equal(true);

  await helper.click(createUserAppsPage.selectors.okButtonInDialog);
});


Then(/^BankUser try to (add|edit) "(EsandaNet|GCIS|Internet Enquiry Access)" app with special chars in "(iSeriesUserID|userID|CRN)" and check "(.*)" error message$/, async function (button, appName, attributeName, errMsg) {
  const buttonSelector = (button === 'add') ? createUserAppsPage.selectors.addApplicationButton : (button === 'edit' ? createUserAppsPage.selectors.editApplicationButton : button);
  const attributeSelector = (attributeName === 'iSeriesUserID') ? createUserAppsPage.selectors.iSeriesUserIDAttributeTextboxEsandaNet : (attributeName === 'userID' ? createUserAppsPage.selectors.userIDAttributeTextboxGCIS : (attributeName === 'CRN') ? createUserAppsPage.selectors.crnAttributeTextboxInternetEnquiryAccess : attributeName);
  const countOfSpecialChars = createUserAppsPage.specialCharList.length;

  if (button == 'edit') {
    const rowNumberOfApp = await createUserAppsPage.findAppInAppTable(appName);
    await helper.click(createUserAppsPage.getCellSelectorByRowAndColumn(rowNumberOfApp, 1));
    await helper.waitForTextInAttribute(createUserAppsPage.getCellSelectorByRowAndColumn(rowNumberOfApp, 1), 'class', 'active', 5);
  }
  await helper.click(buttonSelector);
  await helper.waitForDisplayed(createUserAppsPage.selectors.applicationSelectInDialog);
  for (let i = 0; i < countOfSpecialChars; i++) {
    if (!(appName == 'GCIS' && (createUserAppsPage.specialCharList[i] == '-' || createUserAppsPage.specialCharList[i] == '.'))) {
      await helper.selectByVisibleText(createUserAppsPage.selectors.applicationSelectInDialog, appName);
      let attributeValue = 'Test' + createUserAppsPage.specialCharList[i];
      await helper.inputText(attributeSelector, attributeValue);
      if (appName == "EsandaNet")
        await helper.selectByVisibleText(createUserAppsPage.selectors.userRegionAttributeSelectEsandaNet, "NSW, ACT");
      logger.info(`Entered value: ${attributeValue}`);
      await helper.click(createUserAppsPage.selectors.okButtonInDialog);
      await helper.waitForDisplayed(createUserAppsPage.selectors.mandatoryFieldErrMsg);
      expect(await helper.getElementText(createUserAppsPage.selectors.mandatoryFieldErrMsg)).to.equal(errMsg);
      if (button === 'add') {
        await helper.selectByVisibleText(createUserAppsPage.selectors.applicationSelectInDialog, "LM");
        await helper.waitForElementToDisAppear(createUserAppsPage.selectors.mandatoryFieldErrMsg, 5);
      }
    }
  }
  await helper.click(createUserAppsPage.selectors.cancelButtonInDialog);
});


Then(/^checks the values in "(iSeriesUserID|userID|CRN)" is "(.*)"$/, async function (attributeName, expectedValueRetained) {
  const attributeSelector = (attributeName === 'iSeriesUserID') ? createUserAppsPage.selectors.iSeriesUserIDAttributeTextboxEsandaNet : (attributeName === 'userID' ? createUserAppsPage.selectors.userIDAttributeTextboxGCIS : (attributeName === 'CRN') ? createUserAppsPage.selectors.crnAttributeTextboxInternetEnquiryAccess : attributeName);
  const actualValueRetained = await helper.getElementValue(attributeSelector);
  logger.info(`Valaue retained in '${attributeName}' is '${actualValueRetained}'`);
  expect(actualValueRetained).to.equal(expectedValueRetained);
  await helper.screenshot(`truncated'${attributeName}`);
});

Then(/^checks "(.*)" application appears in the app table with its attributes$/, async function (appName) {
  await helper.waitForDisplayed(createUserAppsPage.selectors.selectedApplicationsGrid);
  const rowNumberOfApp = await createUserAppsPage.findAppInAppTable(appName);
  let appAttribute = '';
  if (appName == 'EsandaNet') {
    //appAttribute = 'User Type:Broker' + ' | ' + 'User Region:' + this.userRegion + ' | ' + 'iSeries User ID:' + (this.iSeriesUserID).toUpperCase();
    appAttribute = `iSeries User ID: ${(this.iSeriesUserID).toUpperCase()} | User Region: ${this.userRegion} | User Type: Broker`;
  } else if (appName == 'GCIS') {
    appAttribute = 'GCIS User ID: ' + this.userID;
  } else if (appName == 'Internet Enquiry Access') {
    appAttribute = 'Customer Registration Number: ' + this.CRN;
  } else if (appName == 'eMatching') {
    appAttribute = 'eMatching User ID: [system generated]';
  }
  if (rowNumberOfApp === null) {
    logger.info(`Application not found in the Application table`);
    expect(false).to.equal(true);
  } else {
    logger.info(`In the expect below verifying attribute for '${appName}' are ${await helper.getElementText(createUserAppsPage.getCellSelectorByRowAndColumn(rowNumberOfApp, 2))}`);
    expect((await helper.getElementText(createUserAppsPage.getCellSelectorByRowAndColumn(rowNumberOfApp, 2)))).to.equal(appAttribute);
    logger.info(`In the expect below verifying  status for '${appName}' is ${await helper.getElementText(createUserAppsPage.getCellSelectorByRowAndColumn(rowNumberOfApp, 3))}`);
    expect((await helper.getElementText(createUserAppsPage.getCellSelectorByRowAndColumn(rowNumberOfApp, 3)))).to.equal('New');
  }
  logger.info(`Attribute verified for '${appName}' are ${await helper.getElementText(createUserAppsPage.getCellSelectorByRowAndColumn(rowNumberOfApp, 2))}`);
  await helper.screenshot('checkApplicationAttributes');
});

Then(/^checks "(.*)" application (is|is not) available in the application select list$/, async function (appName, appExistence) {
  await helper.click(createUserAppsPage.selectors.addApplicationButton);
  await helper.waitForDisplayed(createUserAppsPage.selectors.applicationSelectInDialog);
  const actualAppExistence = await createUserAppsPage.findInAddAppSelectList(appName);
  logger.info(`Checking that'${appName}' ${appExistence} available in list`);
  if (appExistence == 'is not')
    expect(actualAppExistence).to.equal(false);
  else
    expect(actualAppExistence).to.equal(true);
  logger.info(`Checked that'${appName}' ${appExistence} available in list`);
});

Then(/^BankUser initiates and (accepts|rejects) the removal of (.*) application$/, async function (button, appName) {
  const selector = (button === 'accepts') ? createUserAppsPage.selectors.confirmButtonConfirmationDialog : (button === 'rejects' ? createUserAppsPage.selectors.cancelButtonOnConfirmationDialog : button);
  const rowNumberOfApp = await createUserAppsPage.findAppInAppTable(appName);
  if (rowNumberOfApp === null) {
    logger.info(`Application can be removed as it does not exist in the table. It has not been added`);
  } else {
    await helper.click(createUserAppsPage.getCellSelectorByRowAndColumn(rowNumberOfApp, 1));
    await helper.waitForTextInAttribute(createUserAppsPage.getCellSelectorByRowAndColumn(rowNumberOfApp, 1), 'class', 'active', 5);
    await helper.click(createUserAppsPage.selectors.removeApplicationButton);
    await helper.waitForDisplayed(selector, 5);
    await helper.click(selector);
  }
});

Then(/^BankUser checks "(.*)" error message is displayed$/, async function (errMsg) {
  await helper.waitForDisplayed(createUserAppsPage.selectors.mandatoryFieldErrMsg);
  expect(await helper.getElementText(createUserAppsPage.selectors.mandatoryFieldErrMsg)).to.equal(errMsg);
  logger.info(`Error message ${errMsg} displayed successfully`);
  await helper.screenshot('appAttributeErrorMessage');
});

Then(/^checks "(.*)" application (is|is not) available in the application table$/, async function (appName, appExistence) {
  const actualAppExistence = await createUserAppsPage.findAppInAppTable(appName);
  logger.info(`Checking if application ${appName} is present is the table`);
  if (appExistence == 'is not')
    expect(actualAppExistence).to.equal(null);
  else
    expect(actualAppExistence).to.not.equal(null)
  logger.info(`Application ${appName} ${appExistence} present in the application table`);
  await helper.screenshot(`${appName}-${appExistence}-inApplicationTable`);
});

Then(/^BankUser checks the sorting of apps in list is in alphabetical order$/, async function () {
  logger.info(`clicking Add application button`);
  await helper.click(createUserAppsPage.selectors.addApplicationButton);
  await helper.waitForDisplayed(createUserAppsPage.selectors.applicationSelectInDialog);
  let appCount = await createUserAppsPage.getAppCountInAddAppSelectList();
  for (let i = 0; i < (appCount - 1); i++) {
    await helper.selectByIndex(createUserAppsPage.selectors.applicationSelectInDialog, i);
    let optionIdx = await helper.getElementAttribute(createUserAppsPage.selectors.applicationSelectInDialog, 'value');
    let option = `${createUserAppsPage.selectors.applicationSelectInDialog} option[value="${optionIdx}"]`;
    let app1 = (await helper.getElementText(option)).trim();
    await helper.selectByIndex(createUserAppsPage.selectors.applicationSelectInDialog, i + 1);
    optionIdx = await helper.getElementAttribute(createUserAppsPage.selectors.applicationSelectInDialog, 'value');
    option = `${createUserAppsPage.selectors.applicationSelectInDialog} option[value="${optionIdx}"]`;
    let app2 = (await helper.getElementText(option)).trim();
    if (app1.toLowerCase() > app2.toLowerCase()) {
      logger.info(`Application select list in not sorted in alphabetical order. ${app2} comes before ${app1} in the list`);
      expect(true).to.equal(false);
    }
    await helper.click(createUserAppsPage.selectors.applicationSelectInDialog);
    await helper.screenshot('applicationListSorted');
    logger.info(`Application sorted in alphabetical order in select app list`);
  }
});

Then(/^checks the applications in the table are sorted alphabetically in (Create|Modify) User mode$/, async function (mode) {
  let appCount = (mode === 'Create') ? await createUserAppsPage.getAppCountInApplicationTable() : await viewOimUserPage.getAppCountInApplicationsTable();
  for (let i = 1; i < appCount; i++) {
    let app1 = (await helper.getElementText(createUserAppsPage.getCellSelectorByRowAndColumn(i, 1))).trim();
    let app2 = (await helper.getElementText(createUserAppsPage.getCellSelectorByRowAndColumn(i + 1, 1))).trim();
    if (app1.toLowerCase() > app2.toLowerCase()) {
      logger.info(`Application table is not sorted in alphabetical order. ${app2} comes before ${app1} in the table`);
      expect(true).to.equal(false);
    }
  }
  logger.info(`Application sorted in alphabetical order in application table`);
  await helper.screenshot('appTableSortedAlphabetically');
});

Then(/^BankUser selects (.*) and (.*) applications$/, async function (appName1, appName2) {
  let app1Address = await createUserAppsPage.findAppInAppTable(appName1);
  let app2Address = await createUserAppsPage.findAppInAppTable(appName2);
  await helper.pressCtrlKeyDown();
  await helper.click(createUserAppsPage.getCellSelectorByRowAndColumn(app1Address, 1));
  await helper.waitForTextInAttribute(createUserAppsPage.getCellSelectorByRowAndColumn(app1Address, 1), 'class', 'active', 5);
  await helper.click(createUserAppsPage.getCellSelectorByRowAndColumn(app2Address, 1));
  await helper.waitForTextInAttribute(createUserAppsPage.getCellSelectorByRowAndColumn(app2Address, 1), 'class', 'active', 5);
  await helper.releaseCtrlKey();
});

Then(/^BankUser double click on (.*) application and checks the display of Edit screen$/, async function (appName) {
  await helper.doubleClick(createUserAppsPage.getCellSelectorByRowAndColumn(await createUserAppsPage.findAppInAppTable(appName), 1));
  await helper.waitForDisplayed(createUserAppsPage.selectors.applicationSelectInDialog);
  let optionIdx = await helper.getElementAttribute(createUserAppsPage.selectors.applicationSelectInDialog, 'value');
  let option = `${createUserAppsPage.selectors.applicationSelectInDialog} option[value="${optionIdx}"]`;
  logger.info(`checking the already selected app is: '${appName}'`);
  expect((await helper.getElementText(option)).trim()).to.equal(appName);

});

Then(/^checks the application select list is disabled$/, async function () {
  await helper.waitForDisplayed(createUserAppsPage.selectors.applicationSelectInDialog);
  logger.info(`checking if the application select list is disabled`);
  expect(await helper.ifElementEnabled(createUserAppsPage.selectors.applicationSelectInDialog)).to.equal(false);
  await helper.click(createUserAppsPage.selectors.cancelButtonInDialog);
});

Then(/^BankUser enters "(iSeriesUserID|userID|CRN)" as "(.*)" and "(.*)" as "(.*)" to (add|edit) "(EsandaNet|GCIS|Internet Enquiry Access)"(.*)$/, async function (attriName1, attriVal1, attriName2, attriVal2, button, appName, action) {
  const selector = (button === 'add') ? createUserAppsPage.selectors.addApplicationButton : (button === 'edit' ? createUserAppsPage.selectors.editApplicationButton : button);
  if (appName == 'EsandaNet') {
    this.iSeriesUserID = attriVal1;
    this.userRegion = attriVal2;
  } else if (appName == 'GCIS') {
    this.userID = attriVal1;
  } else if (appName == 'Internet Enquiry Access') {
    this.CRN = attriVal1;
  }
  await helper.waitForDisplayed(selector);
  if (button == 'edit') {
    const rowNumberOfApp = await createUserAppsPage.findAppInAppTable(appName);
    await helper.click(createUserAppsPage.getCellSelectorByRowAndColumn(rowNumberOfApp, 1));
    await helper.waitForTextInAttribute(createUserAppsPage.getCellSelectorByRowAndColumn(rowNumberOfApp, 1), 'class', 'active', 5);
  }
  await helper.click(selector);
  await helper.waitForDisplayed(createUserAppsPage.selectors.applicationSelectInDialog);
  logger.info(`app to be selected: '${appName}'`);
  await helper.selectByVisibleText(createUserAppsPage.selectors.applicationSelectInDialog, appName);
  const appAttributes = await createUserAppsPage.enterAttributesForSelectedApp(appName, attriVal1, attriVal2);
  await helper.screenshot(`enterUserAppAttributesFor'${appName}'`);
  if (!randomData.isNullOrEmpty(action) && action.includes('OK')) {
    await helper.click(createUserAppsPage.selectors.okButtonInDialog);
  }

  const application = {};
  application[appName] = appAttributes;
  if (!this.userData) this.userData = {};
  if (!this.userData.applications) this.userData['applications'] = [];
  this.userData['applications'].push(application);
});

Then(/^check \"Logon ID already exists\" error message$/, async function () {
  logger.info('Check "Logon ID already exists" error message');
  await helper.waitForDisplayed
  expect(await helper.getElementText(newUserPage.selectors.userIdDataErrMsg)).to.equal(newUserPage.screenMessages.msg014);
});

Then(/^BankUser selects the "(\d+)(?:st|nd|rd|th)" item in the applications table$/, async function (n) {
  await helper.click(createUserAppsPage.getCellSelectorByRowAndColumn(n, 1));
  await helper.waitForTextInAttribute(createUserAppsPage.getCellSelectorByRowAndColumn(n, 1), 'class', 'active', 5);
});

Then(/^BankUser moves from Applications page to Security Devices page$/, async function () {
  logger.info('Click on Continue button');
  await helper.click(MenuBar.selectors.continue);
  await helper.waitForTextInElement(createUserSecDevicesPage.selectors.header, 'Assign Security Devices');
});

Then(/^check Add Security Devices page default display$/, async function () {
  logger.info('Check Add Security Devices screen default display');
  expect(await helper.getElementText(createUserSecDevicesPage.selectors.header)).to.equal('Assign Security Devices');
  expect(await helper.isElementPresent(MenuBar.selectors.cancel)).to.equal(true);
  expect(await helper.isElementPresent(MenuBar.selectors.back)).to.equal(true);
  expect(await helper.isElementPresent(MenuBar.selectors.continue)).to.equal(true);
  expect(await helper.getElementText(createUserSecDevicesPage.selectors.dataHeading)).to.equal('Security Devices');
  expect(await helper.getElementText(createUserSecDevicesPage.selectors.noResultsMessage)).to.equal(createUserSecDevicesPage.screenMessages.MSG032);
});

Then(/^BankUser clicks on (Add|Remove) Security Devices button$/, async function (button) {
  logger.info(`Click on "${button}" button on Security Devices grid`);
  await helper.click((button === 'Add' ? createUserSecDevicesPage.selectors.addButton : createUserSecDevicesPage.selectors.removeButton));
});

Then(/^check Add Security Device dialog default display$/, async function () {
  logger.info('Check Add Device dialog default display');
  expect(await helper.getElementText(createUserSecDevicesPage.selectors.addDeviceDialog.title)).to.equal('Add Security Device');
  expect(await helper.getElementText(createUserSecDevicesPage.selectors.addDeviceDialog.securityDeviceLabel)).to.equal('Security Device');
  expect(await helper.getElementValue(createUserSecDevicesPage.selectors.addDeviceDialog.securityDevicesSelect)).to.equal('ANZ Digital Key');
});

Then(/^check Issuance Location options and default values for all device types$/, async function () {
  for (var i = 0; i < createUserSecDevicesPage.securityDeviceTypes.length; i++) {
    const deviceType = createUserSecDevicesPage.securityDeviceTypes[i];
    await helper.selectByVisibleText(createUserSecDevicesPage.selectors.addDeviceDialog.securityDevicesSelect, deviceType);
    if (deviceType !== 'ANZ Digital Key') {
      logger.info(`Check default value of Issuance Locations for Device Type ${deviceType}`);
      expect(await helper.getElementValue(createUserSecDevicesPage.selectors.addDeviceDialog.issueLocationsSelect)).to.equal(createUserSecDevicesPage.deviceTypeToDefaultIssueLocationMapping[deviceType]);
      logger.info(`Check all Issuance Locations options in the dropdown for Device Type ${deviceType}`);
      await helper.click(createUserSecDevicesPage.selectors.addDeviceDialog.issueLocationsSelect);
      const locations = await createUserSecDevicesPage.getAllOptionsUnderSelect(createUserSecDevicesPage.selectors.addDeviceDialog.issueLocationsSelect);
      const sorted = [...locations].sort();
      expect(_.isEqual(sorted, createUserSecDevicesPage.issueLocations)).to.equal(true);
    } else {
      logger.info('Check the Add Device dialog for ANZ Digital Key');
      expect(await helper.getElementText(createUserSecDevicesPage.selectors.addDeviceDialog.noAttributeText)).to.equal(createUserSecDevicesPage.screenMessages.MSG031);
    }
  }
});

Then(/^BankUser clicks on "(Cancel|Ok)" button in the Add Security Device dialog$/, async function (button) {
  const numDevicesOriginal = await createUserSecDevicesPage.getNumberOfAddedDevices();
  logger.info(`Click on ${button} button in the Add Security Device dialog`);
  if (button === 'Cancel') {
    await helper.click(createUserSecDevicesPage.selectors.addDeviceDialog.cancelButton);
    await helper.waitForElementToDisAppear(createUserSecDevicesPage.selectors.addDeviceDialog.title, 1);
    logger.info('Check device has NOT been added to the Selected Devices grid');
    expect(await createUserSecDevicesPage.getNumberOfAddedDevices()).to.equal(numDevicesOriginal);
  } else {
    await helper.click(createUserSecDevicesPage.selectors.addDeviceDialog.okButton);
    await helper.waitForElementToDisAppear(createUserSecDevicesPage.selectors.addDeviceDialog.title, 1);
    logger.info('Check one more device has been added to the Selected Devices grid');
    expect(await createUserSecDevicesPage.getNumberOfAddedDevices()).to.equal(numDevicesOriginal + 1);
  }
});

Then(/^BankUser adds Security Device "(.*)" with Location "(.*)"$/, async function (type, location) {
  const device = await createUserSecDevicesPage.addDevice(type, location);
  // save the security device info into this.UserData
  this.userData.securityDevices.push(device);
});

Then(/^BankUser selects Security Device "(.*)" in the grid$/, async function (device) {
  logger.info(`Select Security Devices ${device} from the grid`);
  const rowNum = await createUserSecDevicesPage.findSecurityDeviceInGrid(device);
  await createUserSecDevicesPage.selectRowInDevicesGrid(rowNum);
});

Then(/^BankUser attempts removing Security Device "(.*)" and (cancels|confirms) it$/, async function (device, action) {
  await createUserSecDevicesPage.removeDevice(device, action);
  if (action === 'cancels') {
    // remove this removed security device from userData
    for (var i = 0; i < this.userData.securityDevices.length; i++) {
      if (this.userData.securityDevices[i].deviceType === device) {
        this.userData.securityDevices.splice(i, 1);
      }
    }
  }
});


Then(/^check that "(.*)" is the "(\d+)(?:st|nd|rd|th)" device in Security Devices dropdown$/, async function(device, n){
    logger.info(`Check if ${device} is in correct order`);
    const options = await createUserSecDevicesPage.getAllOptionsUnderSelect(createUserSecDevicesPage.selectors.addDeviceDialog.securityDevicesSelect);
    expect(options[n-1]).to.equal(device);
});

Then(/^check Selected Devices Grid header columns$/, async function() {

  logger.info('Check the headers in the Selected Devices grid');
  await helper.waitForTextInElement(createUserSecDevicesPage.selectors.gridColumnHeader, 'Security Device', 5);
  expect(await createUserSecDevicesPage.getNumberOfSelectedDevicesGridColumns()).to.equal(3);
  expect(await createUserSecDevicesPage.getHeaderColumnText(0)).to.equal('Security Device');
  expect(await createUserSecDevicesPage.getHeaderColumnText(1)).to.equal('Status');
  expect(await createUserSecDevicesPage.getHeaderColumnText(2)).to.equal('Issuance Location');
});

Then(/^check new Security Device "(.*)" has been added in Selected Devices grid correctly$/, async function (device) {
  logger.info(`Check the diaplayed of newly added device ${device} in the Selected Devices Grid`);
  const devices = this.userData.securityDevices;
  let location = null;
  for (var i = 0; i < devices.length; i++) {
    if (devices[i].type === device) {
      location = devices[i].location;
      break;
    }
  }
  // Most recently added device is always on the top row
  expect(await createUserSecDevicesPage.getDeviceTypeOnRow(1)).to.equal(device);
  expect(await createUserSecDevicesPage.getStatusOnRow(1)).to.equal('New');
  expect(await createUserSecDevicesPage.getLocationOnRow(1)).to.equal(randomData.isNullOrEmpty(location) ? '' : location);
});

Then(/^check all entered Security Devices are retained on the grid$/, async function () {
  const devices = this.userData.securityDevices;
  const numOfRows = await createUserSecDevicesPage.getNumberOfAddedDevices();
  for (var i = 0; i < devices.length; i++) {
    let deviceRetainedOnGrid = false;
    for (var j = 0; j < numOfRows; j++) {
      if (await createUserSecDevicesPage.getDeviceTypeOnRow(j + 1) === devices[i].type) {
        deviceRetainedOnGrid = true;
        break;
      }
    }
    expect(deviceRetainedOnGrid).to.equal(true);
  }
});

Then(/^check Security Device (.*) has been removed from Security Devices grid$/, async function (device) {
  const rowNumber = await createUserSecDevicesPage.findSecurityDeviceInGrid(device);
  expect(rowNumber).to.equal(undefined);
});

Then(/^check "(Add|Remove)" Security Device option is "(Enabled|Disabled)"$/, async function (option, status) {
  await helper.waitForDisplayed(createUserSecDevicesPage.selectors.addButton);
  logger.info(`Check ${option} Security Device option is ${status} on Assign Security Devices page`);
  const btnSelector = (option === 'Add') ? createUserSecDevicesPage.selectors.addButton : createUserSecDevicesPage.selectors.removeButton;
  await helper.pause(1); // give time for the buttons to be properly loaded/formatted
  expect((await helper.getElementAttribute(btnSelector, 'class')).includes('disabled')).to.equal(status === 'Disabled');
});

Then(/^check "(.*)" is(| NOT) an available option in Security Devices dropdown$/, async function (device, ifPresent) {
  logger.info(`Check if Device ${device} is${ifPresent} present as an option on the Devices dropdown`);
  const options = await createUserSecDevicesPage.getAllOptionsUnderSelect(createUserSecDevicesPage.selectors.addDeviceDialog.securityDevicesSelect);
  expect(options.indexOf(device) > -1).to.equal(!(ifPresent === ' NOT'));
});

Then(/^check \"No Security Devices Selected\" message is displayed in the Security Device grid$/, async function () {
  logger.info('Check "No Security Devices Selected" message');
  expect(await helper.getElementText(createUserSecDevicesPage.selectors.noResultsMessage)).to.equal(createUserSecDevicesPage.screenMessages.MSG032);
});

Then(/^check BankUser is directed to "(Assign Applications|Assign Security Devices|User Notifications|Assign Entitlements)" page$/, async function (pageHeading) {
  logger.info(`Check bankuser is now directed to ${pageHeading} page`);
  await helper.waitForTextInElement('h1', pageHeading, 5);
});

Then(/^check \"User's Email Address and Mobile Number must be provided for ANZ Digital Key to be assigned.\" message is displayed$/, async function () {
  logger.info('Check error message MSG022 is displayed on Assign Security Devices page');
  expect(await helper.getElementText(createUserSecDevicesPage.selectors.errorMsg)).to.equal(createUserSecDevicesPage.screenMessages.MSG022);
});

Then(/^verify that duplicate warning message "(.*)" and confirmation message is displayed on the screen$/, async function(msg) {
  logger.info('Check warning message is displayed on screen');
  await helper.waitForDisplayed(duplicateWarningPage.selectors.warningNotification);
  if (msg === 'MSG_086'){
    expect(await helper.getElementText(duplicateWarningPage.selectors.warningNotification)).to.equal(duplicateWarningPage.screenMessages.MSG_086);
  } else {
    expect(await helper.getElementText(duplicateWarningPage.selectors.warningNotification)).to.equal(duplicateWarningPage.screenMessages.MSG_087);
  }
  logger.info('Check confirmation message');
  expect(await helper.getElementText(duplicateWarningPage.selectors.confirmationMsg)).to.equal(duplicateWarningPage.screenMessages.msg_confirmation);
});

Then(/^check elements on create user duplicate warning page$/, async function (){
  await helper.waitForDisplayed(duplicateWarningPage.selectors.duplicateUsersGrid);
  logger.info('Check the headers in the Duplicate Users Warning grid');
  expect(await duplicateWarningPage.getNumberOfDuplicateUsersGridColumns()).to.equal(7);
  expect(await duplicateWarningPage.getHeaderColumnText(0)).to.equal('User ID');
  expect(await duplicateWarningPage.getHeaderColumnText(1)).to.equal('First Name');
  expect(await duplicateWarningPage.getHeaderColumnText(2)).to.equal('Last Name');
  expect(await duplicateWarningPage.getHeaderColumnText(3)).to.equal('CAAS Org ID');
  expect(await duplicateWarningPage.getHeaderColumnText(4)).to.equal('CAAS Org Name');
  expect(await duplicateWarningPage.getHeaderColumnText(5)).to.equal('Status');
  expect(await duplicateWarningPage.getHeaderColumnText(6)).to.equal('Managed By');
  const users = this.users;
  console.log(JSON.stringify(users));
  for (var i = 0; i < users.length; i++) {
    logger.info(`Check User ${users[i].userId} information is displayed in grid.`);
    expect(await duplicateWarningPage.getUserIdOnRow(i+1)).to.equal(users[i].userId);
    expect(await duplicateWarningPage.getFirstNameOnRow(i+1)).to.equal(users[i].firstName);
    expect(await duplicateWarningPage.getLastNameOnRow(i+1)).to.equal(users[i].surName);
    expect(await duplicateWarningPage.getCaasOrgIdOnRow(i+1)).to.equal(users[i].caasOrgCd);
    expect(await duplicateWarningPage.getCaasOrgNameOnRow(i+1)).to.equal(users[i].caasOrgName);
    expect(await duplicateWarningPage.getUserStatusOnRow(i+1)).to.equal(users[i].status);
    expect(await duplicateWarningPage.getManagedByOnRow(i+1)).to.equal('ANZ Managed');
  }
});

Then(/^click "(Yes|No)" on duplicate warning page$/, async function (yesNo){
  logger.info(`Click on ${yesNo} button in the duplicate user warning page`);
  if (yesNo === 'Yes') {
    await helper.click(duplicateWarningPage.selectors.yesButton);
  } else {
    await helper.click(duplicateWarningPage.selectors.noButton);
  }
});

Then(/^check error message for existing CAAS OIM user$/, async function () {
  logger.info(`Check that error message appears for approving existing OIM User`);
  const msg018 = 'User Logon ID already exists in CAAS. Please choose a different User Logon ID.';
  await helper.waitForTextInElement(newUserPage.selectors.errNotificationMsg, 'User Logon', 15);
  expect((await helper.getElementText(newUserPage.selectors.errNotificationMsg)).trim()).to.equal(msg018);
});