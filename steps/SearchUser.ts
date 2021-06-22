import { Given, When, Then } from 'cucumber';
import _ = require('lodash');
import { searchUserPage } from 'src/SearchUserPage';
import { viewCustomerUserPage } from 'src/ViewCustomerUserPage';
import { expect } from "chai";
import { helper } from "src/Helper";
import { getLogger } from "log4js";
import { randomData } from 'src/RandomData';
import { MenuBar } from 'src/MenuBarPage';
import { searchPage } from 'src/SearchPage';

const logger = getLogger();
const sortData = require('src/SortData');
logger.level = 'info';

function constructSearchCriteriaFromCreatedUser(searchByFields, userData) {
  let criterias = {};
  if (searchByFields.indexOf('CAAS User ID') > -1) criterias['caasUserId'] = userData.userId;
  if (searchByFields.indexOf('User ID') > -1) criterias['userId'] = userData.userId;;
  if (searchByFields.indexOf('CAAS Org ID') > -1) criterias['caasOrgId'] = userData.caasOrg.orgId;
  if (searchByFields.indexOf('CAAS Org Name') > -1) criterias['caasOrgName'] = userData.caasOrg.orgName;
  if (searchByFields.indexOf('First Name') > -1) criterias['firstName'] = userData.firstName;
  if (searchByFields.indexOf('Last Name') > -1) criterias['lastName'] = userData.surName;
  if (searchByFields.indexOf('Status') > -1) criterias['status'] = userData.status;
  if (searchByFields.indexOf('Workflow') > -1) criterias['workflow'] = userData.workflow;
  if (searchByFields.indexOf('Source System') > -1) criterias['sourceSystem'] = userData.sourceSystem;
  return criterias;
}

async function checkResultIncludesAtLeastOneCiteriaVal(criterias, key, column) {
  const rows = (await searchUserPage.getUserIdsInDisplayedResults()).length <= 5 ? (await searchUserPage.getUserIdsInDisplayedResults()).length : 5;
  for (var i = 1; i <=rows ; i++) {
    if (key in criterias) {
      const fieldValueInResultEntry = await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(i, column));
      const criteriaVals = criterias[key].split(',');
      expect(new RegExp(criteriaVals.join('|'), '\i').test(fieldValueInResultEntry)).to.equal(true);
    }
  }
}

function hasLeadingOrTrailingSpaces(text) {
  return !(text.trim() === text);
}

When(/^BankUser navigates to search User page$/, async function() {
  logger.info('Navigate to search User page');
  await helper.click(MenuBar.selectors.users);
  await helper.waitForEnabled(searchUserPage.selectors.searchBtn);
});

/*
 * Single/multiple criteria search.
 * The value of the search criteria is retrieved from this.userData, which was generated in previous steps of creating user via UI.
 * @param searchBy: one or multiple of 'CAAS User ID', 'User ID', 'CAAS Org ID', 'CAAS Org Name', 'First Name', 'Last Name', 'Status', 'Workflow', and 'Source System', separated by ','
 */ 
Then(/^BankUser searches the UI created User by "(.*)"$/, async function(searchBy) {
  let fields = searchBy.split(',');
  for (var i = 0; i < fields.length; i++) {
    fields[i] = fields[i].trim();
  };
  const criterias = constructSearchCriteriaFromCreatedUser(fields, this.userData);
  await searchUserPage.searchUser(criterias);
  // Save the search criteria for later use
  this.searchUserCriteria = criterias;
});

/*
 * Single/multiple criteria search. The values of the search criteria is retrieved from API created user data, this.users[n].
 */
Then(/^BankUser searches Users by "(.*)" with values from the "(\d+)(?:st|nd|rd|th)" API created user$/, async function(searchBy, n) {
  let fields = searchBy.split(',');
  for (var i = 0; i < fields.length; i++) {
    fields[i] = fields[i].trim();
  };
  const criterias = constructSearchCriteriaFromCreatedUser(fields, this.users[n - 1]);
  await searchUserPage.searchUser(criterias);

  this.searchUserCriteria = criterias;
});


/*
 * Single criteria search. The value of the search criteria is got from the input from the test step.
 */
Then(/^BankUser searches Users by "(User ID|CAAS User ID|First Name|Last Name|CAAS Org ID|CAAS Org Name|Status|Workflow|Source System)" with value "(.*)"$/, {wrapperOptions: {retry: 2}}, async function(searchBy, value) {
  let criterias = {};
  if (searchBy === 'User ID') criterias['userId'] = value;
  if (searchBy === 'CAAS User ID') criterias['caasUserId'] = value;
  if (searchBy === 'First Name') criterias['firstName'] = value;
  if (searchBy === 'Last Name') criterias['lastName'] = value;
  if (searchBy === 'CAAS Org ID') criterias['caasOrgId'] = value;
  if (searchBy === 'CAAS Org Name') criterias['caasOrgName'] = value;
  if (searchBy === 'Status') criterias['status'] = value;
  if (searchBy === 'Workflow') criterias['workflow'] = value;
  if (searchBy === 'Source System') criterias['sourceSystem'] = value;

  await searchUserPage.searchUser(criterias);
  this.searchUserCriteria = criterias;
});

/*
 * Single/Mutliple criterias search. The values of the search criterias are from the inputed data from test scenario. 
 */
Then(/^BankUser enters search User criteria(| with leading \/ trailing spaces)(| and clicks on search button):$/, async function(extraSpaces, click, data) {
  let searchBy = data.rowsHash();

  let criterias = {};
  if ('Customer ID' in searchBy) criterias['customerId'] = searchBy['Customer ID'];
  if ('CAAS User ID' in searchBy) criterias['caasUserId'] = searchBy['CAAS User ID'];
  if ('User ID' in searchBy) criterias['userId'] = searchBy['User ID'];
  if ('CAAS Org ID' in searchBy) criterias['caasOrgId'] = searchBy['CAAS Org ID'];
  if ('CAAS Org Name' in searchBy) criterias['caasOrgName'] = searchBy['CAAS Org Name'];
  if ('First Name' in searchBy) criterias['firstName'] = searchBy['First Name'];
  if ('Last Name' in searchBy) criterias['lastName'] = searchBy['Last Name'];
  if ('Status' in searchBy) criterias['status'] = searchBy['Status'];
  if ('Workflow' in searchBy) criterias['workflow'] = searchBy['Workflow'];
  if ('Source System' in searchBy) criterias['sourceSystem'] = searchBy['Source System'];

  let criteriasWithExtraSpaces = {};
  if (extraSpaces === ' with leading/trailing spaces') {
    criteriasWithExtraSpaces = randomData.addRandomLeadingTrailingSpacesInDataTableValues(criterias);
    await searchUserPage.enterSearchCriteria(criteriasWithExtraSpaces);
  } else {
    await searchUserPage.enterSearchCriteria(criterias);
  }

  if (click === ' and clicks on search button') {
    logger.info('Click on Search button');
    await helper.click(searchUserPage.selectors.searchBtn);
  }
  this.searchUserCriteria = criterias;
});

Then(/^BankUser searches for Users with "(Blank|\*)" criteria$/, async function(searchBy) {
  if (searchBy === '*') {
    await helper.inputText(searchUserPage.selectors.userIdInput, '*');
  }
  await helper.click(searchUserPage.selectors.searchBtn);
});

Then(/^BankUser opens the "(\d+)(?:st|nd|rd|th)" entry from search User results(| by double clicking| from Context Menu)$/, { wrapperOptions: { retry: 2} }, async function(n, how) {
  await helper.waitUntilTextInElement(searchPage.getCellSelectorByRowAndColumn(n, 3), 20);

  logger.info(`Click on row ${n} in the search results`);
  how === ' by double clicking' ? await searchUserPage.openDetailsOfUserOnNthRow(n, true, false) : how === ' from Context Menu' ? await searchUserPage.openDetailsOfUserOnNthRow(n, false, true) : await searchUserPage.openDetailsOfUserOnNthRow(n, false, false);
  // Save the field values from search result entry for later check in view user details page
  this.searchUserResultEntry = {
    customerId: await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 1)),
    divisionId: await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 2)),
    userId: await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 3)),
    caasUserId: await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 4)),
    lastName: await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 5)),
    firstName: await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 6)),
    middleName: await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 7)),
    status: await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 8)),
    workflow: await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 9)),
    caasOrgId: await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 10)),
    caasOrgName: await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 11)),
    sourceSystem: await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 12))
  };
  // populate/update this.userData for later steps
  if (this.users && this.users.length > 0) {
    if (!this.userData || this.userData.userId.toUpperCase() !== this.searchUserResultEntry.userId) {
      for (let user of this.users) {
        if (user.userId === this.searchUserResultEntry.userId) {
          this.userData = user;
          break;
        }
      }
    }
  } 
});

Then(/^BankUser finds the User in the search results and double clicks on it$/, { wrapperOptions: { retry: 2} }, async function() {
  const userData = this.userData;
  await helper.waitUntilTextInElement(searchPage.getCellSelectorByRowAndColumn(1, 3), 20);
  for (var n = 1; n <= (await searchUserPage.getUserIdsInDisplayedResults()).length; n++) {
    if (await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 3)) === userData.userId.toUpperCase()) {
      await searchUserPage.openDetailsOfUserOnNthRow(n, true, false);
      break;
    }
  }
});

Then(/^check the "(\d+)" User entries are returned and displayed correctly in the search result grid$/, {wrapperOptions: {retry: 2}}, async function(n) {
  await helper.waitUntilTextInElement(searchPage.getCellSelectorByRowAndColumn(1, 3), 20);
  logger.info(`Check number of users returned: ${n}`);
  expect(await searchUserPage.getNumberOfResultEntries()).to.equal(n);
  await helper.screenshot('search-results');

  for (var i = 0; i < n; i++) {
    const userId = await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 3));
    for (var j = 0; j < this.users.length; j++) {
      if (this.users[j].userId === userId) {
        logger.info(`Check row ${i} in the search results`);
        // Todo: customerId and divisionId is not in scope for now.
        expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 4))).to.equal(this.users[j].userId);
        expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 5))).to.equal(this.users[j].surName);
        expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 6))).to.equal(this.users[j].firstName);
        expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 7))).to.equal(this.users[j].middleName ? this.users[j].middleName : '');
        expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 8))).to.equal(this.users[j].status);
        expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 9))).to.equal(this.users[j].workflow);
        expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 10))).to.equal(this.users[j].caasOrg.orgId);
        expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 11))).to.equal(this.users[j].caasOrg.orgName);
        expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 12))).to.equal(this.users[j].sourceSystem);
        expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 13))).to.equal('ANZ Managed');
      }
    }
  }
});

Then(/^check the User entries are returned and displayed match the search criteria value$/, {wrapperOptions: {retry: 2}}, async function() {
  await helper.waitUntilTextInElement(searchPage.getCellSelectorByRowAndColumn(1, 3), 20);

  logger.info('Check user entities are returned');
  const n = await searchUserPage.getNumberOfResultEntries();
  expect(n > 0).to.equal(true);

  for (var i = 1; i <= n; i++) {
    if ('status' in this.searchUserCriteria) {
      expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(i, 8))).to.equal(this.searchUserCriteria['status']);
    }
    if ('workflow' in this.searchUserCriteria) {
      expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(i, 9))).to.equal(this.searchUserCriteria['workflow']);
    }
    if ('sourceSystem' in this.searchUserCriteria) {
      expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(i, 12))).to.equal(this.searchUserCriteria['sourceSystem']);
    }
  }
  await helper.screenshot('search-user-results');
});

Then(/^check the returned Users meet the "Contains", "Or" and "And" logic$/, async function() {
  // wait for "User ID" to be displayed in the results grid
  await helper.waitUntilTextInElement(searchPage.getCellSelectorByRowAndColumn(1, 3), 20);

  logger.info('Check every result entry matches at least one of the search criteria values')
  await checkResultIncludesAtLeastOneCiteriaVal(this.searchUserCriteria, 'userId', 3); 
  await checkResultIncludesAtLeastOneCiteriaVal(this.searchUserCriteria, 'caasUserId', 4); 
  await checkResultIncludesAtLeastOneCiteriaVal(this.searchUserCriteria, 'lastName', 5); 
  await checkResultIncludesAtLeastOneCiteriaVal(this.searchUserCriteria, 'firstName', 6); 
  await checkResultIncludesAtLeastOneCiteriaVal(this.searchUserCriteria, 'status', 8); 
  await checkResultIncludesAtLeastOneCiteriaVal(this.searchUserCriteria, 'workflow', 9); 
  await checkResultIncludesAtLeastOneCiteriaVal(this.searchUserCriteria, 'caasOrgId', 10); 
  await checkResultIncludesAtLeastOneCiteriaVal(this.searchUserCriteria, 'caasOrgName', 11); 
  await checkResultIncludesAtLeastOneCiteriaVal(this.searchUserCriteria, 'sourceSystem', 12); 
});

Then(/^check \"Source System\" set to "(COBRA|CAAS)" in the "(\d+)(?:st|nd|rd|th)" entry in search results$/, {wrapperOptions: {retry: 2}}, async function(source, n) {
  await helper.waitUntilTextInElement(searchUserPage.getCellSelectorByRowAndColumn(n, 3), 20);
  logger.info(`Check Source System set to: ${source}`);
  expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(n, 12))).to.equal(source);
});

Then(/^check the default display on search User page$/, async function() {
  logger.info('Search panel is expanded by default');
  expect((await helper.ifElementDisplayed(searchUserPage.selectors.searchBar))).to.equal(true);
  
  logger.info('Check the default display on Search User page');
  expect(await helper.getElementText(searchUserPage.selectors.customerIdLabel)).to.equal('Customer ID');
  expect(await helper.ifElementDisplayed(searchUserPage.selectors.customerIdInput)).to.equal(true);
  expect(await helper.getElementText(searchUserPage.selectors.divisionIdLabel)).to.equal('Division ID');
  expect(await helper.ifElementDisplayed(searchUserPage.selectors.divisionIdInput)).to.equal(true);
  expect(await helper.getElementText(searchUserPage.selectors.userIdLabel)).to.equal('User ID');
  expect(await helper.ifElementDisplayed(searchUserPage.selectors.userIdInput)).to.equal(true);
  expect(await helper.getElementText(searchUserPage.selectors.caasUserIdLabel)).to.equal('CAAS User ID');
  expect(await helper.ifElementDisplayed(searchUserPage.selectors.caasUserIdInput)).to.equal(true);
  expect(await helper.getElementText(searchUserPage.selectors.lastNameLabel)).to.equal('Last Name');
  expect(await helper.ifElementDisplayed(searchUserPage.selectors.lastNameInput)).to.equal(true);
  expect(await helper.getElementText(searchUserPage.selectors.firstNameLabel)).to.equal('First Name');
  expect(await helper.ifElementDisplayed(searchUserPage.selectors.firstNameInput)).to.equal(true);
  expect(await helper.getElementText(searchUserPage.selectors.statusLabel)).to.equal('Status');
  expect(await helper.ifElementDisplayed(searchUserPage.selectors.statusSelect)).to.equal(true);
  expect((await searchUserPage.getSelectValueByIndex(searchUserPage.selectors.status, 1)).trim()).to.equal('New');
  expect((await searchUserPage.getSelectValueByIndex(searchUserPage.selectors.status, 2)).trim()).to.equal('Enabled');
  expect((await searchUserPage.getSelectValueByIndex(searchUserPage.selectors.status, 3)).trim()).to.equal('Disabled');
  expect((await helper.getElementText(searchUserPage.selectors.workflowLabel)).trim()).to.equal('Workflow');
  expect(await helper.ifElementDisplayed(searchUserPage.selectors.workflowSelect)).to.equal(true);
  expect(await helper.getElementText(searchUserPage.selectors.caasOrgIdLabel)).to.equal('CAAS Org ID');
  expect(await helper.ifElementDisplayed(searchUserPage.selectors.caasOrgIdInput)).to.equal(true);
  expect(await helper.getElementText(searchUserPage.selectors.caasOrgNameLabel)).to.equal('CAAS Org Name');
  expect(await helper.ifElementDisplayed(searchUserPage.selectors.caasOrgNameInput)).to.equal(true);
  expect(await helper.getElementText(searchUserPage.selectors.sourceSystemLabel)).to.equal('Source System');
  expect(await helper.ifElementDisplayed(searchUserPage.selectors.sourceSystemSelect)).to.equal(true);

  logger.info('Check MSG_075 displayed');
  expect((await helper.getElementText(searchUserPage.selectors.searchNoteMessage)).trim()).to.equal(searchUserPage.screenMessages.msg075);
  await helper.screenshot('Search-User-default-display');
});

Then(/^check the display of search Users results summary grid$/, async function() {
  await searchUserPage.fitColumnsToWindow();
  logger.info('Check search results slick header columns');
  expect(await searchUserPage.getResultsColumnHeader(1)).to.equal('Customer ID');
  expect(await searchUserPage.getResultsColumnHeader(2)).to.equal('Division ID');
  expect(await searchUserPage.getResultsColumnHeader(3)).to.equal('User ID');
  expect(await searchUserPage.getResultsColumnHeader(4)).to.equal('CAAS User ID');
  expect(await searchUserPage.getResultsColumnHeader(5)).to.equal('Last Name');
  expect(await searchUserPage.getResultsColumnHeader(6)).to.equal('First Name');
  expect(await searchUserPage.getResultsColumnHeader(7)).to.equal('Middle Name');
  expect(await searchUserPage.getResultsColumnHeader(8)).to.equal('Status');
  expect(await searchUserPage.getResultsColumnHeader(9)).to.equal('Workflow');
  expect(await searchUserPage.getResultsColumnHeader(10)).to.equal('CAAS Org ID');
  expect(await searchUserPage.getResultsColumnHeader(11)).to.equal('CAAS Org Name');
  expect(await searchUserPage.getResultsColumnHeader(12)).to.equal('Source System');
  expect(await searchUserPage.getResultsColumnHeader(13)).to.equal('Managed By');
  await helper.screenshot('search-user-result-grid');
});

Then(/^check the search results are sorted by User ID in alphabetical order$/, async function() {
  logger.info('Check search results are sorted in alphabetic order by User ID');
  const userIds = await searchUserPage.getUserIdsInDisplayedResults();
  const sorted = [...userIds].sort();
  expect(_.isEqual(userIds, sorted)).to.equal(true);
});

Then(/^check entered search User criterias have been retained and trimmed of leading \/ trailing spaces$/, async function() {
  const trimedCriterias = this.searchUserCriteria;
  logger.info('Check entered search criterias have been trimmed off the leading / trailing spaces');
  if (trimedCriterias.userId) {
    expect(await searchUserPage.getFieldValue(searchUserPage.selectors.userIdLabel)).to.equal(trimedCriterias.userId);
  }
  if (trimedCriterias.caasUserId) {
    expect(await searchUserPage.getFieldValue(searchUserPage.selectors.caasUserIdLabel)).to.equal(trimedCriterias.caasUserId);
  }
  if (trimedCriterias.lastName) {
    expect(await searchUserPage.getFieldValue(searchUserPage.selectors.lastNameLabel)).to.equal(trimedCriterias.lastName);
  }
  if (trimedCriterias.firstName) {
    expect(await searchUserPage.getFieldValue(searchUserPage.selectors.firstNameLabel)).to.equal(trimedCriterias.firstName);
  }
  if (trimedCriterias.status) {
    expect(await searchUserPage.getFieldValue(searchUserPage.selectors.statusLabel)).to.equal(trimedCriterias.status);
  }
  if (trimedCriterias.workflow) {
    expect(await searchUserPage.getFieldValue(searchUserPage.selectors.workflowLabel)).to.equal(trimedCriterias.workflow);
  }
  if (trimedCriterias.caasOrgId) {
    expect(await searchUserPage.getFieldValue(searchUserPage.selectors.caasOrgIdLabel)).to.equal(trimedCriterias.caasOrgId);
  }
  if (trimedCriterias.caasOrgName) {
    expect(await searchUserPage.getFieldValue(searchUserPage.selectors.caasOrgNameLabel)).to.equal(trimedCriterias.caasOrgName);
  }
  if (trimedCriterias.sourceSystem) {
    expect(await searchUserPage.getFieldValue(searchUserPage.selectors.sourceSystemLabel)).to.equal(trimedCriterias.sourceSystem);
  }
  await helper.screenshot(`searchCriteriaTrimmed`);
});

Then(/^check the search User results do not contain leading \/ trailing spaces$/, async function() {
  await searchUserPage.fitColumnsToWindow();
  logger.info('Check the search results contins no leading or trailing spaces');
  const rows = (await searchUserPage.getUserIdsInDisplayedResults()).length <= 5 ? (await searchUserPage.getUserIdsInDisplayedResults()).length : 5;
  for (var i = 1; i <= rows; i++) {
    for ( var j = 1; j <= 13; j++) {
      if (!await helper.ifElementDisplayed(searchUserPage.getCellSelectorByRowAndColumn(i, j))) 
        // await helper.scrollToElement(searchUserPage.getCellSelectorByRowAndColumn(i, j))
      expect(hasLeadingOrTrailingSpaces(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(i, j)))).to.equal(false);
    }
  }
});

Then(/^check \"View Customer User\" page is opened to view user details$/, async function() {
  logger.info('Check view Customer User page is opened');
  await helper.waitForDisplayed(viewCustomerUserPage.selectors.userIcon);
  expect((await viewCustomerUserPage.getHeaderTextOnNthRow(1)).startsWith('User Name(ID)')).to.equal(true);
  expect((await viewCustomerUserPage.getHeaderTextOnNthRow(2)).startsWith('Customer Name (ID)')).to.equal(true);
});

Then(/^check the search User results is "(Found|Not Found)"$/, async function(result) {
  if (result === 'Not Found') {
    logger.info('Check "No Record Found" in search results');
    expect(await helper.getElementText(searchUserPage.selectors.noRecordFoundLabel)).to.equal(searchUserPage.screenMessages.msg007);
  } else {
    logger.info('Check the User is returned');
    expect(await searchUserPage.getNumberOfResultEntries()).to.equal(1);
    expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(1, 1))).to.equal(this.userData.customer.customerId);
    expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(1, 4))).to.equal(this.userData.userId.toUpperCase());
    expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(1, 10))).to.equal(this.userData.caasOrg.orgId);
    expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(1, 12))).to.equal(this.userData.sourceSystem);
  }
});


Then(/^check the "(\d+)" "(Deleted|Disabled)" User statuses and workflow are updated in the User Summary Grid$/, {wrapperOptions: {retry: 2}}, async function(n, status) {
  await helper.waitUntilTextInElement(searchPage.getCellSelectorByRowAndColumn(1, 3), 20);
  logger.info(`Check number of users returned: ${n}`);
  expect(await searchUserPage.getNumberOfResultEntries()).to.equal(n);
  const sortedUsers = sortData.sortArrayOfMapByFieldInAlphabeticOrder(this.users, 'userId');

  for(var i = 1; i <= n; i++){
    logger.info(`Check row ${i} in the search results`);
    expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(i, 4))).to.equal(sortedUsers[i - 1].userId);;
    expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(i, 8))).to.equal(`${status}`);
    expect(await helper.getElementText(searchUserPage.getCellSelectorByRowAndColumn(i, 9))).to.equal('Approved');
  }
});