import { Given, When, Then } from 'cucumber';
import {} from "lodash";
import { searchCaasOrgPage } from 'src/SearchCaasOrgPage';
import { MenuBar } from 'src/MenuBarPage';
import { searchPage } from 'src/SearchPage';
import { viewCaasOrgPage } from 'src/ViewCaasOrgPage';
import { randomData } from 'src/RandomData';
import { expect } from "chai";
import { helper } from "src/Helper";
import { getLogger } from "log4js";
import * as faker from 'faker';
const logger = getLogger();
logger.level = 'info';

When(/^BankUser navigates to search CAAS Orgs page$/, async function() {
    logger.info('Navigate to search CAAS Orgs page');
    await helper.click(MenuBar.selectors.caasOrgs);
    await helper.waitForEnabled(searchCaasOrgPage.selectors.searchBtn);
  });
  
Then(/^BankUser enters search Org criteria(| with leading\/trailing spaces)(| and click on search button):$/, async function(extraSpaces, click, data) {
  let criteria = data.rowsHash();
  if (extraSpaces === ' with leading/trailing spaces') {
    criteria = randomData.addRandomLeadingTrailingSpacesInDataTableValues(criteria);
  }
  
  if ('ID' in criteria) {
    await helper.inputText(searchCaasOrgPage.selectors.caasOrgIdInput, criteria['ID']);
  }
  if ('Full Name' in criteria) {
    await helper.inputText(searchCaasOrgPage.selectors.caasOrgNameInput, criteria['Full Name']);
  }
  if ('Business Identifying Number' in criteria) {
    await helper.inputText(searchCaasOrgPage.selectors.caasOrgBinInput, criteria['Business Identifying Number']);
  }
  if ('Workflow' in criteria) {
    // So far, workflow is 'Approved' always
    await searchCaasOrgPage.setWorkflowToApproved();
  }

  if (click === ' and click on search button') {
    await helper.click(searchCaasOrgPage.selectors.searchBtn);
  }
});

Then(/^BankUser searches for the "(\d+)(?:st|nd|rd|th)" API created CAAS Org$/, async function(n) {
  const orgId = this.orgs[n-1].orgId;
  await searchCaasOrgPage.searchCaasOrgByID(orgId);  
});

Then(/^BankUser search CAAS Org by ID$/, async function() {
  const orgData = this.orgData;
  await searchCaasOrgPage.searchCaasOrgByID(orgData.orgId);

  expect((await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(1, 1))).trim()).to.equal(orgData.orgId);
  expect((await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(1, 2))).trim()).to.equal(orgData.orgName);
  expect((await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(1, 3))).trim()).to.equal(orgData.bin);
  logger.info('Org ID, Name and Bin are displayed correctly and contain no leading or trailing spaces.');
  expect((await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(1, 4))).trim()).to.equal('Enabled');
  expect((await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(1, 5))).trim()).to.equal('Approved');
  logger.info('Org is created with status = Enabled and workflow = Approved.');
});

Then(/^BankUser open the Org details page from search result$/, async function() {
  logger.info('Double click the first item in search result to view');
  await helper.doubleClick(searchCaasOrgPage.selectors.gridelement1);
  await helper.waitForDisplayed(viewCaasOrgPage.selectors.orgIdLabel);
});

Then(/^BankUser opens the "(\d+)(?:st|nd|rd|th)" entry from search Org results$/, async function(n) {
  await helper.waitUntilTextInElement(searchPage.getCellSelectorByRowAndColumn(n, 1), 20);	
  // Save the field values from search result entry for later check in view org details page
  this.orgData = this.orgs[n-1];
  this.searchOrgResultEntry = {	
    id: await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(n, 1)),	
    fullName: await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(n, 2)),	
    bin: await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(n, 3)),	
    status: await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(n, 4)),	
    workflow: await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(n, 5)),	
  };	
  logger.info(`Double click on the ${n} row in the search results`);	
  await helper.doubleClick(searchCaasOrgPage.getSelectorOfNthItemInSearchResultsGrid(n));	
});

Then(/^check the default display on search Orgs page$/, async function() {
  expect((await helper.ifElementDisplayed(searchCaasOrgPage.selectors.searchBar))).to.equal(true);
  logger.info('Search panel is expanded by default');

  logger.info('Checking field labels and default status field pre-populated values in the Search Org page');
  expect((await helper.getElementText(searchCaasOrgPage.selectors.caasOrgIdLabel)).trim()).to.equal('ID');
  expect((await helper.getElementText(searchCaasOrgPage.selectors.caasOrgNameLabel)).trim()).to.equal('Full Name');
  expect((await helper.getElementText(searchCaasOrgPage.selectors.caasOrgBinLabel)).trim()).to.equal('Business Identifying Number');
  expect((await helper.getElementText(searchCaasOrgPage.selectors.statusLabel)).trim()).to.equal('Status');
  expect((await searchCaasOrgPage.getSelectValueByIndex(searchCaasOrgPage.selectors.status, 1)).trim()).to.equal('Enabled');
  expect((await searchCaasOrgPage.getSelectValueByIndex(searchCaasOrgPage.selectors.status, 2)).trim()).to.equal('Deleted');
  expect((await helper.getElementText(searchCaasOrgPage.selectors.workflowLabel)).trim()).to.equal('Workflow');

  logger.info('Check search note message MSG_075');
  expect((await helper.getElementText(searchCaasOrgPage.selectors.searchNoteMessage)).trim()).to.equal(searchCaasOrgPage.screenMessages.msg075);
});

Then(/^check entered search Org criterias have been retained:$/, async function(data) {
  const criteria = data.rowsHash();
  logger.info('Check entered search criterias have been retained and displayed correctly');
  if ('ID' in criteria) {
    expect((await searchCaasOrgPage.getSelectValueByIndex(searchCaasOrgPage.selectors.caasOrgId, 1)).trim()).to.equal(criteria['ID']);
  }
  if ('Full Name' in criteria) {
    expect((await searchCaasOrgPage.getSelectValueByIndex(searchCaasOrgPage.selectors.caasOrgName, 1)).trim()).to.equal(criteria['Full Name']);
  }
  if ('Business Identifying Number' in criteria) {
    expect((await searchCaasOrgPage.getSelectValueByIndex(searchCaasOrgPage.selectors.caasBin, 1)).trim()).to.equal(criteria['Business Identifying Number']);
  }
  if ('Workflow' in criteria) {
    expect((await searchCaasOrgPage.getSelectValueByIndex(searchCaasOrgPage.selectors.workflow, 1)).trim()).to.equal(criteria['Workflow']);
  }
}); 

Then(/^check Status field has its default value set on Search Org page$/, async function() {
  expect((await searchCaasOrgPage.getSelectValueByIndex(searchCaasOrgPage.selectors.status, 1)).trim()).to.equal('Enabled');
  expect((await searchCaasOrgPage.getSelectValueByIndex(searchCaasOrgPage.selectors.status, 2)).trim()).to.equal('Deleted');
  logger.info('"Status" field has its default values set: Enabled, Deleted');
});

Then(/^BankUser search for Org that does not exist in the system$/, async function() {
  logger.info('Search for Org that does not exist');
  // generate random strings as id/name/bin to search, which will result in "no record found"
  const orgId = faker.random.alphaNumeric(20);
  const orgName = faker.random.alphaNumeric(20);
  const bin = faker.random.alphaNumeric(10);
  await helper.inputText(searchCaasOrgPage.selectors.caasOrgIdInput, orgId);
  await helper.inputText(searchCaasOrgPage.selectors.caasOrgNameInput, orgName);
  await  helper.inputText(searchCaasOrgPage.selectors.caasOrgBinInput, bin);
  await helper.click(searchCaasOrgPage.selectors.searchBtn);
});

Then(/^check MSG_007 is displayed in Search Org Results grid$/, async function() {
  logger.info('Check search message MSG_007: No Record Found.');
  expect((await helper.getElementText(searchCaasOrgPage.selectors.noRecordFoundLabel)).trim()).to.equal(searchCaasOrgPage.screenMessages.msg007);
});

Given(/^BankUser search (.*) of org created by API at no. (.*) and verify results$/, async function(criteria, n) {
  if (criteria.search('orgID') !== -1) {
    await helper.inputText(searchCaasOrgPage.selectors.caasOrgIdInput, this.orgs[n-1].orgId);
  }
  if (criteria.search('orgName') !== -1) {
    await helper.inputText(searchCaasOrgPage.selectors.caasOrgNameInput, this.orgs[n-1].orgName);
  }
  if (criteria.search('BIN') !== -1) {
    await helper.inputText(searchCaasOrgPage.selectors.caasOrgBinInput, this.orgs[n-1].businessId);
  }
  logger.info('Searced criteria entered sucessfully');
  await helper.click(searchCaasOrgPage.selectors.searchBtn);
  logger.info('Searced button clicked sucessfully');
  expect(await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(1, 1))).to.equal(this.orgs[n-1].orgId);
  logger.info(`Org ID: ${this.orgs[n-1].orgId} displayed correctly in searched result.`);
  expect(await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(1, 2))).to.equal(this.orgs[n-1].orgName.replace(/\s+/g, " "));
  logger.info(`Org Name: ${this.orgs[n-1].orgName} displayed correctly in searched result.`);
  expect(await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(1, 3))).to.equal(this.orgs[n-1].businessId);
  logger.info(`BusinessId: ${this.orgs[n-1].businessId} displayed correctly in searched result.`);
  expect(await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(1, 4))).to.equal('Enabled');
  logger.info(`For OrgId: ${this.orgs[n-1].OrgId} status is displayed as Enabled in searched result.`);
  expect(await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(1, 5))).to.equal('Approved');
  logger.info(`For OrgId: ${this.orgs[n-1].OrgId} workflow is displayed as Approved in searched result.`);

  // Save the org data to this.orgData for later use in view org details page checks
  this.orgData = this.orgs[n - 1];
});

Then(/^BankUser search without any search criteria and verify top (.*) results for existance$/, async function(n) {
  await helper.click(searchCaasOrgPage.selectors.searchBtn);
  await searchPage.dismissPaginationMsgIfPopedUp();
  await helper.waitForExist(searchCaasOrgPage.getCellSelectorByRowAndColumn(1,1), 3);
  logger.info(await helper.ifElementExists(searchCaasOrgPage.getCellSelectorByRowAndColumn(1, 1)));
  for (let i =1; i<=n; i++) {
    expect(await helper.ifElementExists(searchCaasOrgPage.getCellSelectorByRowAndColumn(n, 1))).to.equal(true);
  }  
});

Then(/^BankUser search with partial text in (ID|Name|BIN) and verify results and verify top (.*) results for partial text$/, async function(field, n) {
  let col;
  if (field == 'ID') {
    await helper.inputText(searchCaasOrgPage.selectors.caasOrgIdInput, this.rndmStr);
    col = 1;
  }
  if (field == 'Name') {
    await helper.inputText(searchCaasOrgPage.selectors.caasOrgNameInput, this.rndmStr);
    col = 2;
  }
  if (field == 'BIN') {
    await  helper.inputText(searchCaasOrgPage.selectors.caasOrgBinInput, this.rndmStr);
    col = 3;
  }
  await helper.click(searchCaasOrgPage.selectors.searchBtn);
  await helper.waitForExist(searchCaasOrgPage.getCellSelectorByRowAndColumn(1,1), 3);
  for (let i =1; i<=n; i++) {
    expect(await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(n, 1))).to.contain(this.rndmStr);
    expect(await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(n, 2))).to.contain(this.rndmStr);
    expect(await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(n, 3))).to.contain(this.rndmStr);
    logger.info(`OrgID, orgName and BIN of row ${n} contain random text: ${this.rndmStr}`);
  }
  expect(await helper.ifElementExists(searchCaasOrgPage.getCellSelectorByRowAndColumn(n+1, 1))).to.equal(false);
});

Then(/^BankUser Search orgs with comma separated values in (.*) and verify results$/, async function(field) {
  let col;
  let searchValue1;
  let searchValue2;
  if (field == 'ID') {
    searchValue1 = this.orgs[0].orgId;
    searchValue2 = this.orgs[1].orgId;
    logger.info(`OrgIDs searched are :${searchValue1},${searchValue2}`);
    await helper.inputText(searchCaasOrgPage.selectors.caasOrgIdInput, `${searchValue1},${searchValue2}`);
    col = 1;
  }
  if (field == 'Name') {
    searchValue1 = this.orgs[0].orgName;
    searchValue2 = this.orgs[1].orgName;
    logger.info(`OrgNames searched are :${searchValue1},${searchValue2}`);
    await helper.inputText(searchCaasOrgPage.selectors.caasOrgNameInput, `${searchValue1},${searchValue2}`);
    col = 2;
  }
  if (field == 'BIN') {
    searchValue1 = this.orgs[0].businessId;
    searchValue2 = this.orgs[1].businessId;
    logger.info(`Business Ids searched are :${searchValue1},${searchValue2}`);
    await helper.inputText(searchCaasOrgPage.selectors.caasOrgBinInput, `${searchValue1},${searchValue2}`);
    col = 3;
  }
  await helper.click(searchCaasOrgPage.selectors.searchBtn);
  await helper.waitForExist(searchCaasOrgPage.getCellSelectorByRowAndColumn(1,1), 3);
  if (await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(1, col)) === searchValue1) {
    expect(await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(2, col))).to.equal(searchValue2);
  } else {
    expect(await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(1, col))).to.equal(searchValue2);
    expect(await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(2, col))).to.equal(searchValue1);
  }
  expect(await helper.ifElementExists(searchCaasOrgPage.getCellSelectorByRowAndColumn(3, 1))).to.equal(false);
  logger.info(`Comma seprated ${field}s appeared correctly in results`);
});

Then(/^check the created Org is returned in Search Org results grid$/, async function() {
  const orgData = this.orgs[0];
  await helper.waitForDisplayed(searchCaasOrgPage.selectors.resultGridRow);
  logger.info(`Check the create Org with orgID ${orgData.orgId} is returned in results grid`);
  expect(await searchCaasOrgPage.getCellSelectorByRowAndColumn(1, 1)).to.equal(orgData.orgId);
});

