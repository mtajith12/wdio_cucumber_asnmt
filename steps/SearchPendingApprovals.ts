import { Given, When, Then } from 'cucumber';
import _ = require('lodash');
const faker = require('faker');
import { pendingApprovalsPage } from 'src/PendingApprovalsPage';
import { MenuBar } from 'src/MenuBarPage';
import { searchPage } from 'src/SearchPage';
import { expect } from "chai";
import { helper } from "src/Helper";
import { getLogger } from "log4js";
const logger = getLogger();
logger.level = 'info';

async function checkResultIncludesAtLeastOneCiteriaVal(criterias, key, column) {
  const rows = (await pendingApprovalsPage.getRecordIdsInDisplayedResults()).length <= 5 ? (await pendingApprovalsPage.getRecordIdsInDisplayedResults()).length : 5;
  for (var i = 1; i <=rows ; i++) {
    if (key in criterias) {
      const fieldValueInResultEntry = await helper.getElementText(pendingApprovalsPage.getCellSelectorByRowAndColumn(i, column));
      const criteriaVals = criterias[key].split(',');
      expect(new RegExp(criteriaVals.join('|'), '\i').test(fieldValueInResultEntry)).to.equal(true);
    }
  }
}

/*
 * Search pending approvals by Record ID. The values of the record ID is retrieved from UI created user data, this.userData.userId.
 */
Then(/^BankUser searches Pending Approval entity by "(Record ID|First Name|Last Name|Full Name)" for the UI created user$/, async function(searchBy) {
  let criterias = {};
  if (searchBy === 'Record ID') criterias['recordId'] = this.userData.userId;
  if (searchBy === 'Full Name') criterias['recordName'] = `${this.userData.firstName} ${this.userData.surName}`;
  if (searchBy === 'First Name') criterias['recordName'] = this.userData.firstName;
  if (searchBy === 'Last Name') criterias['recordName'] = this.userData.surName;
  logger.info(`Search for Pending Approvals by criterias: ${criterias}`);
  await pendingApprovalsPage.enterSearchCriteria(criterias);
  await helper.click(pendingApprovalsPage.selectors.searchBtn);

  // Save the search criterias for checking search results
  this.searchPendingApprovalsCriterias = criterias;
});

/*
 * Single/multiple criteria search. The values of the search criteria is retrieved from API created user data, this.users[n].
 */
Then(/^BankUser searches Pending Approval entities by "(.*)" with values from the "(\d+)(?:st|nd|rd|th)" API created user$/, async function(searchBy, n) {
  let fields = searchBy.split(',');
  for (var i = 0; i < fields.length; i++) {
    fields[i] = fields[i].trim();
  };
  // the user data from API creating users is saved in this.users[]
  const userData = this.users[n - 1];
  let criterias = {};
  if (fields.indexOf('Record ID') > -1) criterias['recordId'] = userData.userId;
  if (fields.indexOf('First Name') > -1) criterias['recordName'] = userData.firstName;
  if (fields.indexOf('Last Name') > -1) criterias['recordName'] = userData.surName;
  if (fields.indexOf('Full Name') > -1) criterias['recordName'] = `${userData.firstName} ${userData.surName}`;
  if (fields.indexOf('Status') > -1) criterias['status'] = userData.status;
  if (fields.indexOf('Workflow') > -1) criterias['workflow'] = userData.workflow;

  await pendingApprovalsPage.enterSearchCriteria(criterias);
  await helper.click(pendingApprovalsPage.selectors.searchBtn);

  // Save the search criterias for checking search results
  this.searchPendingApprovalsCriterias = criterias;
});

/*
 * Search Pending Approval entries by comma separated record IDs. The values of the record IDs are retrieved from API created user data, this.users[n].
 */
Then(/^BankUser searches Pending Approval entities by \"Record ID\" for all the API created users$/, async function() {
  // the user data from API creating users are saved in this.users[]
  let recordIds = [];
  for (var i = 0; i < this.users.length; i++) {
    recordIds.push(this.users[i].userId);
  }
  let criterias = {'recordId': recordIds.join(',')};
  await pendingApprovalsPage.enterSearchCriteria(criterias);
  await helper.click(pendingApprovalsPage.selectors.searchBtn);
});

Then(/^BankUser opens the "(\d+)(?:st|nd|rd|th)" entry from Pending Approvals grid$/, async function(n) {
  // Wait for "Record ID" field to have value
  await helper.waitUntilTextInElement(searchPage.getCellSelectorByRowAndColumn(n, 3), 20);

  logger.info('Click on the ${n} row in the Pending Approvals grid');
  await pendingApprovalsPage.openDetailsOfEntityOnNthRow(n);
});

Then(/^check \"Record ID\" field takes a maximum of "(\d+)" characters$/, async function(maxLength) {
  const valueLongerThanMax = faker.random.alphaNumeric(maxLength + 1);
  await helper.inputText(pendingApprovalsPage.selectors.recordIdInput, valueLongerThanMax);
  logger.info('Check entered value into Record ID is truncated to the allowed max length');
  expect((await helper.getElementValue(pendingApprovalsPage.selectors.recordIdInput))).to.equal(valueLongerThanMax.substring(0, maxLength));
});

Then(/^check loading text on Pending Approvals page$/, async function() {
  expect(await helper.getElementText(pendingApprovalsPage.selectors.searchNoteMessage)).to.equal(pendingApprovalsPage.screenMessages.loadingText);
});

Then(/^check the returned Entities meet the "Contains", "Or" and "And" logic$/, async function() {
  await helper.waitUntilTextInElement(searchPage.getCellSelectorByRowAndColumn(1, 3), 20);

  logger.info('Check every result entry matches at least one of the search criteria values')
  await checkResultIncludesAtLeastOneCiteriaVal(this.searchPendingApprovalsCriterias, 'recordId', 3); 
  await checkResultIncludesAtLeastOneCiteriaVal(this.searchPendingApprovalsCriterias, 'recordName', 4); 
});

Then(/^check the "(\d+)(?:st|nd|rd|th)" API created User is displayed correctly in the Pending Approvals results grid$/, async function(n) {
  logger.info(`Check one entity is returned in the results grid`);
  await helper.waitForTextInElement(pendingApprovalsPage.getCellSelectorByRowAndColumn(n, 3), this.users[n - 1].userId.toUpperCase());
  await helper.screenshot(`pendingApprovalsResults-${this.users[n - 1].userId}`);

  for (var i = 0; i < n; i++) {
    logger.info(`Check User is displayed correctly in the Pending Approvals results grid`);
    expect(await helper.getElementText(pendingApprovalsPage.getCellSelectorByRowAndColumn(n, 4))).to.equal(`${this.users[n - 1].firstName} ${this.users[n - 1].surName}`);
    expect(await helper.getElementText(pendingApprovalsPage.getCellSelectorByRowAndColumn(n, 8))).to.equal(this.users[n - 1].workflow);
  }
});
