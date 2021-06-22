import { Given, When, Then } from 'cucumber';
import * as _ from 'lodash';
import { expect } from 'chai';
import { helper } from 'src/Helper';
import { getLogger } from 'log4js';
import { MenuBar } from 'src/MenuBarPage';
import { searchPage } from 'src/SearchPage';
import { searchSecurityDevicePage } from 'src/SearchSecurityDevicePage';
import { randomData } from 'src/RandomData';
const sortData = require('src/SortData');
const logger = getLogger();
logger.level = 'info';

function constructSearchCriteriaFromCreatedUser(searchByFields, userData) {
  let criterias = {};
  if (searchByFields.indexOf('CAAS User ID') > -1) criterias['caasUserId'] = userData.userId;
  if (searchByFields.indexOf('User ID') > -1) criterias['userId'] = userData.userId;;
  if (searchByFields.indexOf('CAAS Org ID') > -1) criterias['caasOrgId'] = userData.caasOrg.orgId;
  if (searchByFields.indexOf('CAAS Org Full Name') > -1) criterias['caasOrgFullName'] = userData.caasOrg.orgName;
  if (searchByFields.indexOf('First Name') > -1) criterias['firstName'] = userData.firstName;
  if (searchByFields.indexOf('Last Name') > -1) criterias['lastName'] = userData.surName;
  return criterias;
}

async function checkResultFieldMeetCriteria(criterias, key, column) {
  const dates = await searchSecurityDevicePage.getDateRequestedInDisplayedResults();
  const rows = dates.length <= 5 ? dates.length : 5;
  for (var i = 1; i <=rows ; i++) {
    if (key in criterias) {
      const fieldValueInResultEntry = await helper.getElementText(searchSecurityDevicePage.getCellSelectorByRowAndColumn(i, column));
      const criteriaVals = criterias[key].split(',');
      expect(new RegExp(criteriaVals.join('|'), '\i').test(fieldValueInResultEntry)).to.equal(true);
    }
  }
}

function hasLeadingOrTrailingSpaces(text) {
  return !(text.trim() === text);
}

Then(/^BankUser navigates to Security Device Issuance search screen$/, async function() {  
  logger.info(`Bankuser navigates to "Security Device Issuance" search screen`);
  await helper.click(MenuBar.selectors.securityDeviceIssuance);
  await helper.waitForDisplayed(searchSecurityDevicePage.selectors.issuanceLocationSelect);
});

Then(/^BankUser enters search Security Device criteria(| with leading\/trailing spaces)(| and click on search button):$/, async function(extraSpaces, click, data) {
  let searchBy = data.rowsHash();

  let criterias = {};
  if ('Last Name' in searchBy) criterias['lastName'] = searchBy['Last Name'];
  if ('First Name' in searchBy) criterias['firstName'] = searchBy['First Name'];
  if ('User ID' in searchBy) criterias['userId'] = searchBy['User ID'];
  if ('CAAS User ID' in searchBy) criterias['caasUserId'] = searchBy['CAAS User ID'];
  if ('CAAS Org ID' in searchBy) criterias['caasOrgId'] = searchBy['CAAS Org ID'];
  if ('CAAS Org Full Name' in searchBy) criterias['caasOrgFullName'] = searchBy['CAAS Org Full Name'];
  if ('Device Type' in searchBy) criterias['deviceType'] = searchBy['Device Type'];
  if ('Issuance Location' in searchBy) criterias['issuanceLocation'] = searchBy['Issuance Location'];

  let criteriasWithExtraSpaces = {};
  if (extraSpaces === ' with leading/trailing spaces') {
    criteriasWithExtraSpaces = randomData.addRandomLeadingTrailingSpacesInDataTableValues(criterias);
    await searchSecurityDevicePage.enterSearchCriteria(criteriasWithExtraSpaces);
  } else {
    await searchSecurityDevicePage.enterSearchCriteria(criterias);
  }

  if (click === ' and click on search button') {
    logger.info('Click on Search button');
    await helper.click(searchSecurityDevicePage.selectors.searchBtn);
  }
  this.searchSecurityDeviceCriteria = criterias;
});

Then(/^BankUser searches Security Device by "(.*)" with values from the "(\d+)(?:st|nd|rd|th)" API created user$/, async function(searchBy, n) {
  let fields = searchBy.split(',');
  for (var i = 0; i < fields.length; i++) {
    fields[i] = fields[i].trim();
  };
  const criterias = constructSearchCriteriaFromCreatedUser(fields, this.users[n - 1]);
  await searchSecurityDevicePage.searchSecurityDevice(criterias);

  this.searchSecurityDeviceCriteria = criterias;
});

Then(/^BankUser searches for Security Devices with "(Blank|\*)" criteria$/, async function(searchBy) {
  if (searchBy === '*') {
    await helper.inputText(searchSecurityDevicePage.selectors.userIdInput, '*');
  }
  await helper.click(searchSecurityDevicePage.selectors.searchBtn);
});

Then(/^BankUser opens the "(\d+)(?:st|nd|rd|th)" entry from search Security Devices results by (clicking on Issue button|right clicking in context menu)$/, { wrapperOptions: { retry: 2 } }, async function(n, action) {
  // wait for "User ID" field to have value
  await helper.waitUntilTextInElement(searchPage.getCellSelectorByRowAndColumn(n, 1), 20);

  const userIdCaasUserId = await helper.getElementText(searchSecurityDevicePage.getCellSelectorByRowAndColumn(n, 1));
  const ids = userIdCaasUserId.match(/(.*) \((.*)\)/);
  const userId = ids ? ids[1] : userIdCaasUserId;
  const caasUserId = ids ? ids[2] : userIdCaasUserId;
  this.securityDeviceIssuanceEntry = {
    userId: userId,
    caasUserId: caasUserId,
    lastName: await helper.getElementText(searchSecurityDevicePage.getCellSelectorByRowAndColumn(n, 2)),
    firstName: await helper.getElementText(searchSecurityDevicePage.getCellSelectorByRowAndColumn(n, 3)),
    caasOrgId: await helper.getElementText(searchSecurityDevicePage.getCellSelectorByRowAndColumn(n, 4)),
    caasOrgFullName: await helper.getElementText(searchSecurityDevicePage.getCellSelectorByRowAndColumn(n, 5)),
    deviceType: await helper.getElementText(searchSecurityDevicePage.getCellSelectorByRowAndColumn(n, 6)),
    issuanceLocation: await helper.getElementText(searchSecurityDevicePage.getCellSelectorByRowAndColumn(n, 7)),
    dateRequested: await helper.getElementText(searchSecurityDevicePage.getCellSelectorByRowAndColumn(n, 8))
  };

  if (action === 'clicking on Issue button') {
    logger.info('Select entry and click on "Issue Security Device" button from menu bar');
    await helper.click(searchPage.getSelectorOfNthItemInSearchResultsGrid(n));
    console.log(await helper.getElementAttribute(searchPage.getSelectorOfNthItemInSearchResultsGrid(n), 'class'))
    await helper.waitForTextInAttribute(searchPage.getSelectorOfNthItemInSearchResultsGrid(n), 'class', 'active', 1);
    await searchSecurityDevicePage.waitForIssueButtonToBeEnabled();
    await helper.click(searchSecurityDevicePage.selectors.issueSecurityDeviceBtn);
  } else {
    logger.info('Right click on "Issue Security Device" option from context menu');
    await helper.rightClick(searchPage.getSelectorOfNthItemInSearchResultsGrid(n), searchSecurityDevicePage.selectors.contextMenu.issueSecurityDeviceOption);
  }
});

Then(/^check the default display on Security Device Issuance search screen$/, async function() {
  logger.info('Search panel is expanded by default');
  expect((await helper.ifElementDisplayed(searchSecurityDevicePage.selectors.searchBar))).to.equal(true);
  
  logger.info('Check the default display on the Search screen');
  expect(await helper.getElementText(searchSecurityDevicePage.selectors.lastNameLabel)).to.equal('Last Name');
  expect(await helper.ifElementDisplayed(searchSecurityDevicePage.selectors.lastNameInput)).to.equal(true);
  expect(await helper.getElementText(searchSecurityDevicePage.selectors.firstNameLabel)).to.equal('First Name');
  expect(await helper.ifElementDisplayed(searchSecurityDevicePage.selectors.firstNameInput)).to.equal(true);
  expect(await helper.getElementText(searchSecurityDevicePage.selectors.userIdLabel)).to.equal('User ID');
  expect(await helper.ifElementDisplayed(searchSecurityDevicePage.selectors.userIdInput)).to.equal(true);
  expect(await helper.getElementText(searchSecurityDevicePage.selectors.caasUserIdLabel)).to.equal('CAAS User ID');
  expect(await helper.ifElementDisplayed(searchSecurityDevicePage.selectors.caasUserIdInput)).to.equal(true);
  expect(await helper.getElementText(searchSecurityDevicePage.selectors.caasOrgIdLabel)).to.equal('CAAS Org ID');
  expect(await helper.ifElementDisplayed(searchSecurityDevicePage.selectors.caasOrgIdInput)).to.equal(true);
  expect(await helper.getElementText(searchSecurityDevicePage.selectors.caasOrgFullNameLabel)).to.equal('CAAS Org Full Name');
  expect(await helper.ifElementDisplayed(searchSecurityDevicePage.selectors.caasOrgFullNameInput)).to.equal(true);
  expect(await helper.getElementText(searchSecurityDevicePage.selectors.deviceTypeLabel)).to.equal('Device Type');
  expect(await helper.ifElementDisplayed(searchSecurityDevicePage.selectors.deviceTypeSelect)).to.equal(true);
  expect(await helper.getElementText(searchSecurityDevicePage.selectors.issuanceLocationLabel)).to.equal('Issuance Location');
  expect(await helper.ifElementDisplayed(searchSecurityDevicePage.selectors.issuanceLocationSelect)).to.equal(true);

  logger.info('Check Search note message is displayed');
  expect(await helper.getElementText(searchSecurityDevicePage.selectors.searchNoteMessage)).to.equal(searchSecurityDevicePage.screenMessages.MSG075);
  await helper.screenshot('securityDeviceIssuanceSearchScreenDefaultDisplay');
});

Then(/^check the display of search Security Device results summary grid headers$/, async function() {
  await helper.waitForDisplayed(searchSecurityDevicePage.selectors.gridelement1);
  await searchSecurityDevicePage.fitColumnsToWindow();
  logger.info('Check search results slick header columns');
  expect(await searchSecurityDevicePage.getResultsColumnHeader(1)).to.equal('User ID (CAAS User ID)');
  expect(await searchSecurityDevicePage.getResultsColumnHeader(2)).to.equal('Last Name');
  expect(await searchSecurityDevicePage.getResultsColumnHeader(3)).to.equal('First Name');
  expect(await searchSecurityDevicePage.getResultsColumnHeader(4)).to.equal('CAAS Org ID');
  expect(await searchSecurityDevicePage.getResultsColumnHeader(5)).to.equal('CAAS Org Full Name');
  expect(await searchSecurityDevicePage.getResultsColumnHeader(6)).to.equal('Device Type');
  expect(await searchSecurityDevicePage.getResultsColumnHeader(7)).to.equal('Issuance Location');
  expect(await searchSecurityDevicePage.getResultsColumnHeader(8)).to.equal('Date Requested');
  await helper.screenshot('securityDeviceIssuanceSearchResults');
});

Then(/^check the search Security Device results are sorted by Date Requested in ascending order$/, async function() {
  logger.info('Check search results are sorted in alphabetic order by User ID');
  const dates = await searchSecurityDevicePage.getDateRequestedInDisplayedResults();
  const sorted = sortData.sortDate(dates);
  expect(_.isEqual(dates, sorted)).to.equal(true);
});

Then(/^check the returned Security Device entries meet the search criteria and "Contains\/Or\/And" logic$/, async function() {
  await helper.waitUntilTextInElement(searchPage.getCellSelectorByRowAndColumn(1, 1), 20);

  logger.info('Check every result entry meets search criterias');
  await checkResultFieldMeetCriteria(this.searchSecurityDeviceCriteria, 'userId', 1); 
  await checkResultFieldMeetCriteria(this.searchSecurityDeviceCriteria, 'caasUserId', 1); 
  await checkResultFieldMeetCriteria(this.searchSecurityDeviceCriteria, 'lastName', 2); 
  await checkResultFieldMeetCriteria(this.searchSecurityDeviceCriteria, 'firstName', 3); 
  await checkResultFieldMeetCriteria(this.searchSecurityDeviceCriteria, 'caasOrgId', 4); 
  await checkResultFieldMeetCriteria(this.searchSecurityDeviceCriteria, 'caasOrgFullName', 5); 
  await checkResultFieldMeetCriteria(this.searchSecurityDeviceCriteria, 'deviceType', 6); 
  await checkResultFieldMeetCriteria(this.searchSecurityDeviceCriteria, 'issuanceLocation', 7); 
});

Then(/^check the "(\d+)" Security Device entries are returned$/, {wrapperOptions: {retry: 2}}, async function(n) {
  await helper.waitUntilTextInElement(searchPage.getCellSelectorByRowAndColumn(n, 1), 20);
  // in search pages, even if reset search was done, the dom structure retains the entries from previous search result, until the page is refreshed.
  // there is no other way but to pause for a bit to let the page refresh...
  await helper.pause(2);
  logger.info(`Check number of users returned: ${n}`);
  expect(await searchPage.getNumberOfResultEntries()).to.equal(n);
  await helper.screenshot('searchSecurityDeviceResults');
});

Then(/^check tokens are displayed correctly in search results for the "(\d+)(?:st|nd|rd|th)" API created User$/, async function(n) {
  const userData = this.users[n - 1];
  var tokens = [];
  for (var device of userData['securityDevices']) {
    if (device.type.includes('Token Digitpass')) tokens.push(device);  // devices = [{'type': type, 'location': location, 'status': 'New'}]
  }

  for (let token of tokens) {
    const i = await searchSecurityDevicePage.findTokenEntryInResultsGrid(userData.usrId, token.type);
    logger.info(`Check returned token on row ${i} in the search results against User data`);
    const userIdColumnText = (userData.userId === userData.caasUserId) ? userData.userId : `${userData.userId} (${userData.caasUserId})`.toUpperCase();
    expect(await helper.getElementText(searchPage.getCellSelectorByRowAndColumn(i, 1))).to.equal(userIdColumnText);
    expect(await helper.getElementText(searchPage.getCellSelectorByRowAndColumn(i, 2))).to.equal(userData.surName);
    expect(await helper.getElementText(searchPage.getCellSelectorByRowAndColumn(i, 3))).to.equal(userData.firstName);
    expect(await helper.getElementText(searchPage.getCellSelectorByRowAndColumn(i, 4))).to.equal(userData.caasOrg.orgId);
    expect(await helper.getElementText(searchPage.getCellSelectorByRowAndColumn(i, 5))).to.equal(userData.caasOrg.orgName);
    expect(await helper.getElementText(searchPage.getCellSelectorByRowAndColumn(n, 6))).to.equal(token.type);
    expect(await helper.getElementText(searchPage.getCellSelectorByRowAndColumn(n, 7))).to.equal(token.location);
  }
});

Then(/^check entered search Security Device criterias have been retained and trimmed of leading \/ trailing spaces$/, async function() {
  const trimedCriterias = this.searchSecurityDeviceCriteria;
  logger.info('Check entered search criterias have been trimmed off the leading / trailing spaces');
  if (trimedCriterias.userId) {
    expect(await searchSecurityDevicePage.getFieldValue(searchSecurityDevicePage.selectors.userIdLabel)).to.equal(trimedCriterias.userId);
  }
  if (trimedCriterias.caasUserId) {
    expect(await searchSecurityDevicePage.getFieldValue(searchSecurityDevicePage.selectors.caasUserIdLabel)).to.equal(trimedCriterias.caasUserId);
  }
  if (trimedCriterias.firstName) {
    expect(await searchSecurityDevicePage.getFieldValue(searchSecurityDevicePage.selectors.firstNameLabel)).to.equal(trimedCriterias.firstName);
  }
  if (trimedCriterias.lastName) {
    expect(await searchSecurityDevicePage.getFieldValue(searchSecurityDevicePage.selectors.lastNameLabel)).to.equal(trimedCriterias.lastName);
  }
  if (trimedCriterias.caasOrgId) {
    expect(await searchSecurityDevicePage.getFieldValue(searchSecurityDevicePage.selectors.caasOrgIdLabel)).to.equal(trimedCriterias.caasOrgId);
  }
  if (trimedCriterias.caasOrgFullName) {
    expect(await searchSecurityDevicePage.getFieldValue(searchSecurityDevicePage.selectors.caasOrgFullNameLabel)).to.equal(trimedCriterias.caasOrgFullName);
  }
  await helper.screenshot(`searchCriteriaTrimmed`);
});

Then(/^check the search Security Device results do not contain leading \/ trailing spaces$/, async function() {
  await helper.waitUntilTextInElement(searchPage.getCellSelectorByRowAndColumn(1, 1), 20);
  logger.info('Check the search results contins no leading or trailing spaces');
  const n = await searchSecurityDevicePage.getNumberOfResultEntries();
  for (var i = 1; i <= (n > 10 ? 10 : n); i++) {
    for ( var j = 1; j <= 8; j++) {
      if (!await helper.ifElementDisplayed(searchSecurityDevicePage.getCellSelectorByRowAndColumn(i, j))) await helper.scrollToElement(searchSecurityDevicePage.getCellSelectorByRowAndColumn(i, j))
      expect(hasLeadingOrTrailingSpaces(await helper.getElementText(searchSecurityDevicePage.getCellSelectorByRowAndColumn(i, j)))).to.equal(false);
    }
  }
});