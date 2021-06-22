import { Then } from 'cucumber';
import {} from "lodash";
import { viewCaasOrgPage } from 'src/ViewCaasOrgPage';
import { viewOimUserPage } from 'src/ViewOimUserPage';
import { viewCustomerPage } from 'src/ViewCustomerPage';
import { searchCaasOrgPage } from 'src/SearchCaasOrgPage';
import { searchPage } from 'src/SearchPage';
import { expect } from "chai";
import { helper } from "src/Helper";
import { getLogger } from "log4js";
import { randomData } from 'src/RandomData'
const sortData = require('src/SortData');
const logger = getLogger();
logger.level = 'info';

Then(/^BankUser view the Org details(| without applications| with applications)$/, async function(withApps) {
  logger.info('Check header labels and values');
  expect((await helper.getElementText(viewCaasOrgPage.selectors.headerOrgNameLabel)).trim()).to.equal('CAAS Org Name (Business Identifying Number):');
  expect((await helper.getElementText(viewCaasOrgPage.selectors.headerStatusLabel)).trim()).to.equal('Status:');
  expect((await helper.getElementText(viewCaasOrgPage.selectors.headerWorkflowLabel)).trim()).to.equal('Workflow:');
  expect((await helper.getElementText(viewCaasOrgPage.selectors.headerOrgNameValue)).trim()).to.equal(`${this.orgData.orgName} (${this.orgData.bin})`);
  expect((await helper.getElementText(viewCaasOrgPage.selectors.headerStatusValue)).trim()).to.equal('Enabled');
  expect((await helper.getElementText(viewCaasOrgPage.selectors.headerWorkflowValue)).trim()).to.equal('Approved');

  logger.info('Check org details');
  expect((await helper.getElementText(viewCaasOrgPage.selectors.orgIdLabel)).trim()).to.equal('ID');
  expect((await helper.getElementText(viewCaasOrgPage.selectors.orgNameLabel)).trim()).to.equal('Full Name');
  expect((await helper.getElementText(viewCaasOrgPage.selectors.binLabel)).trim()).to.equal('Business Identifying Number');
  expect((await helper.getElementText(viewCaasOrgPage.selectors.orgIdValue))).to.equal(`${this.orgData.orgId}`);
  expect((await helper.getElementText(viewCaasOrgPage.selectors.orgNameValue))).to.equal(`${this.orgData.orgName}`);
  expect((await helper.getElementText(viewCaasOrgPage.selectors.binValue))).to.equal(`${this.orgData.bin}`);

  if (withApps === ' with applications') {
    logger.info('Check applications assigned to Org are displayed correctly in alphabetic order: ');
    const appsSorted = sortData.sortSimpleArrayByAlphabeticOrder(this.orgData.applications);
    logger.info(JSON.stringify(appsSorted));
    expect((await helper.getElementText(viewCaasOrgPage.selectors.appsGridHeaderName)).trim()).to.equal('Application Name');
    await helper.waitForDisplayed(viewCaasOrgPage.getAppsGridCellByRowAndColumn(1, 1));
    for (var i = 0; i < appsSorted.length; i++) {
      // the row and column numbers in css selector start from 1
      const appNameSel = viewCaasOrgPage.getAppsGridCellByRowAndColumn(i + 1, 1);
      expect(await helper.getElementText(appNameSel)).to.equal(appsSorted[i]);

      logger.info('Check "Assigned Date" field set to Today in format of "dd/mm/yyyy"');
      const assignedDateSel = viewCaasOrgPage.getAppsGridCellByRowAndColumn(i + 1, 2);
      expect(await helper.getElementText(assignedDateSel)).to.equal(randomData.getTodayDate());
    }
  } else {
    // without applications
    logger.info('Check "No Record Found" message displayed in the empty grid');
    expect(await helper.getElementText(viewCaasOrgPage.selectors.noResultMsgApps)).to.equal(viewCaasOrgPage.screenMessages.msg007);
  }
  await helper.screenshot(`viewOrgDetails-${this.orgData.orgId}`);
});


Then(/^BankUser closes Org Details page$/, async function() {
  logger.info('Close Org details page');
  await helper.click(viewCaasOrgPage.selectors.close);
});

Then(/^BankUser clicks on "(Details & Applications|Users|Customers|Audit)" tab$/, async function(tab) {
  logger.info(`Go to ${tab} tab`);
  await helper.click((tab === 'Details & Applications') ? viewCaasOrgPage.selectors.detailsTab : (tab === 'Users') ? viewCaasOrgPage.selectors.usersTab : (tab === 'Customers') ? viewCaasOrgPage.selectors.customersTab : viewCaasOrgPage.selectors.auditTab);
});

Then(/^BankUser views the Users tab and check all the API created Users displayed correctly except \"Deleted\" Users$/, async function() {
  logger.info('Go to the "Users" tab');
  await helper.click(viewCaasOrgPage.selectors.usersTab);
  await helper.waitForDisplayed(viewCaasOrgPage.selectors.userGrid, 10);

  let usersNotDeleted = [];
  for (var user of this.users) {
    if (user.status !== "Deleted") usersNotDeleted.push(user);
  }
  
  // Sort users array by userId in alphabetic order. 
  const users = sortData.sortArrayOfMapByFieldInAlphabeticOrder(usersNotDeleted, 'userId');
  console.log(JSON.stringify(users))
  await helper.waitForDisplayed(viewCaasOrgPage.selectors.usersGridRow, 10);
  for (var i = 0; i < users.length; i++) {
    const r = await viewCaasOrgPage.findUserEntryInUsersTabByUserId(users[i].userId);
    logger.info(`Check User ${users[i].userId} information displayed in User tab, on row ${r}`);
    expect(await viewCaasOrgPage.getUserIdOnRow(r)).to.equal(users[i].userId.toUpperCase());
    expect(await viewCaasOrgPage.getUserFirstNameOnRow(r)).to.equal(users[i].firstName);
    expect(await viewCaasOrgPage.getUserLastNameOnRow(r)).to.equal(users[i].surName);
    expect(await viewCaasOrgPage.getUserStatusOnRow(r)).to.equal(users[i].status);
    expect(await viewCaasOrgPage.getUserWorkflowOnRow(r)).to.equal(users[i].workflow);
  }

  // // save the sorted users for later use
  // this.sortedUsers = users;
});

Then(/^validate the Audit Scenarios for Org$/, async function (details) {
  logger.info('Validate Org Audit Scenarios');
  const audit = details.hashes();
  const auditvalidations = [];
  const orgData = this.orgData ? this.orgData : this.orgs[0];

  for (const act1 of audit) {
    auditvalidations.push({
      description: `//div[contains(text(),'${act1.Description}')]`,
      action: `//div[contains(text(),'${act1.Action}')]`,

    });
  }
  await helper.waitForDisplayed(viewCaasOrgPage.selectors.auditGrid, 1500);
  for (const i in auditvalidations) {
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].description)).to.be.equal(true);
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].action)).to.be.equal(true);
    if (auditvalidations[i].action.includes('Created') || auditvalidations[i].action.includes('Modified')) {
      await helper.doubleClick(auditvalidations[i].description);
      await helper.waitForDisplayed(`//div[contains(text(), 'Audit Entry Details')]`)
      await viewCaasOrgPage.auditValidation(auditvalidations[i].action, orgData);
      logger.info('Org Details Validated');
    }
    if (auditvalidations[i].action.includes('Deleted')){
      await helper.doubleClick(auditvalidations[i].description);
      await helper.click(`//div[contains(text(), 'Audit Entry Details')]/../div[3] //i[@class="fa fa-times"]`);
      logger.info('Deleted Org Validated');
    }
  }
});

Then(/^BankUser views the Users tab and check \"No Record Found\" is displayed$/, async function() {
  logger.info('Go to the "Users" tab');
  await helper.click(viewCaasOrgPage.selectors.usersTab);
  await helper.waitForDisplayed(viewCaasOrgPage.selectors.noResultMsgUsers);
  logger.info('Check "No Record Found" message displayed in the empty grid');
  expect(await helper.getElementText(viewCaasOrgPage.selectors.noResultMsgUsers)).to.equal(viewCaasOrgPage.screenMessages.msg007);
});

Then(/^BankUser views the Customers tab and check \"No Record Found\" is displayed$/, async function() {
  logger.info('Go to the "Customers" tab');
  await helper.click(viewCaasOrgPage.selectors.customersTab);
  await helper.waitForDisplayed(viewCaasOrgPage.selectors.noResultMsgCustomers);
  logger.info('Check "No Record Found" message displayed in the empty grid');
  expect(await helper.getElementText(viewCaasOrgPage.selectors.noResultMsgCustomers)).to.equal(viewCaasOrgPage.screenMessages.msg007);
});

Then(/^BankUser double clicks on the "(\d+)(?:st|nd|rd|th)" API created User from Users tab$/, async function(n) {
  // the sequence of users in this.users[] may be different from the order of users displayed on Users tab. 
  const userId = this.users[n - 1].userId;
  const rowNumber = await viewCaasOrgPage.findUserEntryInUsersTabByUserId(userId);
  logger.info(`Double clicks on User ${userId} to open User details page`);
  await helper.doubleClick(`${viewCaasOrgPage.selectors.usersGridRow}:nth-child(${rowNumber})`);
  await helper.waitForDisplayed(viewOimUserPage.selectors.userIdValue);
  
  if (this.users && this.users.length > 0) {
    // save user info into this.userData for later usage on view user details page
    this.userData = this.users[n - 1];
    }
});

// This step checks the CAAS Org field value in View Org details page agaist what's been displayed in the search Org result grid.
Then(/^check the details of the Org displayed correctly in view Org details page$/, async function() {
  // the field values displayed in search Org grid is saved in scenario context this.searchOrgResultEntry
  logger.info('Check values in header section');
  expect((await helper.getElementText(viewCaasOrgPage.selectors.headerOrgNameValue)).trim()).to.equal(`${this.searchOrgResultEntry.fullName} (${this.searchOrgResultEntry.bin})`);
  expect((await helper.getElementText(viewCaasOrgPage.selectors.headerStatusValue)).trim()).to.equal(this.searchOrgResultEntry.status);
  expect((await helper.getElementText(viewCaasOrgPage.selectors.headerWorkflowValue)).trim()).to.equal(this.searchOrgResultEntry.workflow);

  logger.info('Check Org ID, name and BIN are displayed correctly');
  expect((await helper.getElementText(viewCaasOrgPage.selectors.orgIdValue))).to.equal(this.searchOrgResultEntry.id);
  expect((await helper.getElementText(viewCaasOrgPage.selectors.orgNameValue))).to.equal(this.searchOrgResultEntry.fullName);
  expect((await helper.getElementText(viewCaasOrgPage.selectors.binValue))).to.equal(this.searchOrgResultEntry.bin);
});

Then(/^check number of active Users under App "(.*)" is (\d|Blank)$/, async function(appName, number) {
  logger.info(`Check number of active users under App ${appName} is ${number}`);
  number = (number === 'Blank') ? 0 : number;
  expect(await viewCaasOrgPage.getNumberOfUsersByAppName(appName)).to.equal(number);
});

Then(/^check the "(\d+)(?:st|nd|rd|th)" API created User in Users tab has status "(.*)" and workflow "(.*)"$/, async function(n, status, workflow) {
  await helper.waitForDisplayed(viewCaasOrgPage.selectors.usersGridRow);
  // the sequence of users in this.users[] may be different from the order of users displayed on Users tab. 
  const userId = this.users[n - 1].userId;
  const rowNumber = await viewCaasOrgPage.findUserEntryInUsersTabByUserId(userId);
  logger.info(`Check User ${userId} status is "${status}" and workflow "${workflow}"`);
  expect(await viewCaasOrgPage.getUserStatusOnRow(rowNumber)).to.equal(status);
  expect(await viewCaasOrgPage.getUserWorkflowOnRow(rowNumber)).to.equal(workflow);
});

Then(/^BankUser views Customers tab and checks screen tab elements are correct$/, async function() {
  logger.info('check Customers screen tab elements')
  expect((await helper.getElementText(viewCaasOrgPage.selectors.customersTabCustomersID)).trim()).to.equal('Customer ID');
  expect((await helper.getElementText(viewCaasOrgPage.selectors.customersTabCustomerName)).trim()).to.equal('Customer Name');
  expect((await helper.getElementText(viewCaasOrgPage.selectors.customersTabJurisdiction)).trim()).to.equal('Jurisdiction');
  expect((await helper.getElementText(viewCaasOrgPage.selectors.customersTabStatus)).trim()).to.equal('Status');
  expect((await helper.getElementText(viewCaasOrgPage.selectors.customersTabWorkflow)).trim()).to.equal('Workflow');
});


//This Displays Customers in an Org
Then(/^BankUser view the Org Customers tab and verify the Customers$/, async function(){
  logger.info('Go to "Customers" tab');
  await helper.click(viewCaasOrgPage.selectors.customersTab)
  await helper.waitForDisplayed(viewCaasOrgPage.selectors.customersGrid);
  // customers created via API in previous steps are saved in this.customers[]. Sort this.customers[] by customerId in alphabetic order. 
    const customers = sortData.sortArrayOfMapByFieldInAlphabeticOrder(this.customers, 'customerId');
    console.log(JSON.stringify(customers))
    for (var i = 0; i < customers.length; i++) {
      logger.info(`Check Customer ${customers[i].customerId} information displayed in Customer tab.`);
      expect(await viewCaasOrgPage.getCustomerIdOnRow(i + 1)).to.equal(customers[i].customerId);
      expect(await viewCaasOrgPage.getCustomerNameOnRow(i + 1)).to.equal(customers[i].customerName);
      expect(await viewCaasOrgPage.getCustomerJurisdictionOnRow(i + 1 )).to.equal(customers[i].jurisdictions.join(","));
      expect(await viewCaasOrgPage.getCustomerStatusOnRow(i + 1)).to.equal(customers[i].status);
      expect(await viewCaasOrgPage.getCustomerWorkflowOnRow(i + 1)).to.equal(customers[i].workflow);
    }
  
    // save the sorted customers for later use
    this.sortedCustomers = customers;
});

Then(/^BankUser double clicks on the "(\d+)(?:st|nd|rd|th)" API created Customer from Customers tab$/, async function(n) {
  // the sequence of customers in this.customers[] may be different from the order of customers displayed on Customers tab. 
  const customerId = this.customers[n - 1].customerId;
  const rowNumber = await viewCaasOrgPage.findCustomerEntryInCustomersTabByCustomerId(customerId);
  logger.info(`Double clicks on Customer ${customerId} to open Customer details page`);
  await helper.doubleClick(`${viewCaasOrgPage.selectors.customersGridRow}:nth-child(${rowNumber})`);
  await helper.waitForDisplayed(viewCustomerPage.selectors.customerId);

});

Then(/^BankUser closes Customer Org details page$/, async function() {
  logger.info('Close Customer Org details page');
  await helper.click(viewCaasOrgPage.selectors.close);
});

Then(/^check the "(Edit|Delete|Submit|Cancel)" option is (NOT displayed|displayed) on the view CAAS Org Screen$/, async function(button, isDisplayed) {
  logger.info(`Check ${button} option is ${isDisplayed}`);
  await helper.pause(2);
  const selector = (button === 'Edit') ? viewCaasOrgPage.selectors.edit :
                   (button === 'Submit') ? viewCaasOrgPage.selectors.submit :
                   (button === 'Cancel') ? viewCaasOrgPage.selectors.cancel :
                   viewCaasOrgPage.selectors.delete;
  if (isDisplayed.includes('NOT')) {
    expect(await helper.ifElementDisplayed(selector)).to.equal(false);
  } else {
    expect(await helper.ifElementDisplayed(selector)).to.equal(true);
  }
  await helper.screenshot(`${button}Is${isDisplayed.replace(' ', '')}OnViewCaasOrgPage`);
});

Then(/^check the "(Add|Remove)" applications button is "(Enabled|Disabled)" on modify CAAS Org Screen$/, async function(button, isEnabled){
  logger.info(`Check ${button} is ${isEnabled}`);
  const selector = (button === 'Add') ? viewCaasOrgPage.selectors.modifyOrg.addAppsBtn :
                   viewCaasOrgPage.selectors.modifyOrg.removeAppsBtn;
  if (isEnabled === 'Enabled'){
    
  }
});