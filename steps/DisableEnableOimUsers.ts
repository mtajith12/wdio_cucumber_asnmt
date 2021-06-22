import { Then } from 'cucumber';
import * as _ from 'lodash';
import { viewOimUserPage } from 'src/ViewOimUserPage';
import { searchPage } from 'src/SearchPage';
import { MenuBar } from 'src/MenuBarPage';
import { DBConnection } from 'src/DBConnection';
import { randomData } from 'src/RandomData'
import { expect } from 'chai';
import { helper } from 'src/Helper';
import { getLogger } from 'log4js';
import { searchUserPage } from 'src/SearchUserPage';
const logger = getLogger();
logger.level = 'info';

Then(/^BankUser clicks on "(Enable|Disable|Delete)" button in User details page for the "(\d+)(?:st|nd|rd|th)" API created User, then clicks "(Yes|No)" on the confirmation$/, async function (button, n, yesNo) {
  logger.info(`Bankuser clicks on ${button} button`);
  const selector = (button === 'Enable') ? viewOimUserPage.selectors.enable :
                   (button === 'Disable') ? viewOimUserPage.selectors.disable :
                   viewOimUserPage.selectors.delete;
  await helper.click(selector);
  const expectedMsg = `This will submit User: ${this.users[n - 1].firstName} ${this.users[n - 1].surName} (${this.users[n - 1].userId}) to be ${button.toLowerCase()}d.`;
  await helper.waitForTextInElement(viewOimUserPage.selectors.modifyUser.modifyUserDialog.confirmationMessageLine1, expectedMsg);
  if (yesNo === 'Yes') {
    await helper.click(viewOimUserPage.selectors.yesBtnOnConfirmationPopup);
  } else {
    await helper.click(viewOimUserPage.selectors.noBtnOnConfirmationPopup);
  }
});

Then(/^BankUser (enables|disbles|deletes) the "(\d+)(?:st|nd|rd|th)" API created User from "(Actions|Context)" menu$/, async function(action, n, menu) {
  const userId = this.users[n - 1].userId;
  const row = await searchUserPage.findUserEntryInResultsGrid(userId);

  if (menu === 'Actions') {
    logger.info(`${action} entity from Actions menu`);
    await helper.click(searchPage.getSelectorOfNthItemInSearchResultsGrid(row));
    await helper.waitForTextInAttribute(searchPage.getSelectorOfNthItemInSearchResultsGrid(row), 'class', 'active', 2);
    await helper.click(MenuBar.selectors.actionsMenu.menuButton);
    await helper.waitForDisplayed(MenuBar.selectors.actionsMenu.enable);
    await helper.click((action === 'enables') ? MenuBar.selectors.actionsMenu.enable : (action === 'disables') ? MenuBar.selectors.actionsMenu.disable : MenuBar.selectors.actionsMenu.delete);
  } else {
    logger.info(`${action} entity from Context menu`);
    const selector = (action === 'enables') ? searchPage.selectors.contextMenu.enable : (action === 'disables') ? searchPage.selectors.contextMenu.disable : searchPage.selectors.contextMenu.delete;
    await helper.rightClick(searchPage.getSelectorOfNthItemInSearchResultsGrid(row), selector);
  }

  const expectedMsg = `This will submit User: ${this.users[n - 1].firstName} ${this.users[n - 1].surName} (${this.users[n - 1].userId}) to be ${action.replace('s', '')}d.`;
  await helper.waitForTextInElement(viewOimUserPage.selectors.modifyUser.modifyUserDialog.confirmationMessageLine1, expectedMsg);
  await helper.click(viewOimUserPage.selectors.yesBtnOnConfirmationPopup);
});

Then(/^check the "(\d+)(?:st|nd|rd|th)" API created User has been disabled successfully$/, async function(n) {
  let successMsg = `User ${this.users[n - 1].firstName} ${this.users[n - 1].surName} (${this.users[n - 1].userId}) has been disabled.`;
  await helper.waitForTextInElement(viewOimUserPage.selectors.successNotificationMsg, successMsg, 15);
  await helper.screenshot(`${this.users[n - 1].userId}-disabled-success-msg`);
  logger.info(successMsg);

  // Upon success, update this.users with the corresponding status on user and his entities
  this.users[n - 1]['status'] = 'Disabled';
  this.users[n - 1]['version'] = this.users[n - 1]['version'] + 1;
  if (this.users[n - 1]['securityDevices']) {
    for (let device of this.users[n - 1]['securityDevices']) {
      device['status'] = 'ImplicitDisabled';
      device['description'] = 'User disabled';
      device['requestedDate'] = randomData.getTodayDate();
    }
  }
  logger.info(`user data after being disabled: ${JSON.stringify(this.users[n - 1])}`);

  // put user data into this.userData for usage by later steps
  this.userData = this.users[n - 1];
});

Then(/^check enabling "(\d+)(?:st|nd|rd|th)" API created User has been submitted successfully$/, async function(n) {
  let successMsg = `${this.users[n - 1].firstName} ${this.users[n - 1].surName} (${this.users[n - 1].userId}) is now pending approval to be enabled.`;
  await helper.waitForTextInElement(viewOimUserPage.selectors.successNotificationMsg, successMsg, 15);
  await helper.screenshot(`enable-${this.users[n - 1].userId}-submitted`);
  logger.info(successMsg);

  // Upon success, update this.users with the corresponding status on user and his entities
  this.users[n - 1]['workflow'] = 'Pending Approval - Enable';
  this.users[n - 1]['version'] = this.users[n - 1]['version'] + 1;
  if (this.users[n - 1]['securityDevices']) {
    for (let device of this.users[n - 1]['securityDevices']) {
      device['status'] = 'Enabled';
      device['description'] = 'Disabled - pending enable';
      device['requestedDate'] = randomData.getTodayDate();
    }
  }
});

Then(/^check deleting "(\d+)(?:st|nd|rd|th)" API created User has been submitted successfully$/, async function(n) {
  let successMsg = `${this.users[n - 1].firstName} ${this.users[n - 1].surName} (${this.users[n - 1].userId}) is now pending approval to be deleted.`;
  await helper.waitForTextInElement(viewOimUserPage.selectors.successNotificationMsg, successMsg, 15);
  await helper.screenshot(`delete-${this.users[n - 1].userId}-submitted`);
  logger.info(successMsg);

  // Upon success, update this.users with the corresponding status on user and his entities
  this.users[n - 1]['workflow'] = 'Pending Approval - Deleted';
  this.users[n - 1]['version'] = this.users[n - 1]['version'] + 1;
  if (this.users[n - 1]['securityDevices']) {
    for (let device of this.users[n - 1]['securityDevices']) {
      device['status'] = 'ImplicitDisabled';
      device['description'] = 'User disabled';
      device['requestedDate'] = randomData.getTodayDate();
    }
  }
  
  // Save data for rejection
  const user = this.users[n-1]
  user.appsBeforeModify = _.cloneDeep(user.applications);

  //Update User Application status entities
  if (this.users[n-1]['applications']){
    for (let application of this.users[n-1]['applications']){
      const appName = Object.keys(application)[0];
      let appEntry = {'appId': appName};
      for (appEntry of this.users[n-1]['applications']){
        Object.values(appEntry)[0]['status'] = 'Removed';
      }
    }
  }
  logger.info(`user data after being deleted: ${JSON.stringify(this.users[n - 1])}`);
  // put user data into this.userData for usage by later steps
  this.userData = this.users[n - 1];
});

Then(/^check User status is "(Enabled|Disabled)" in CA for the "(\d+)(?:st|nd|rd|th)" API created User$/, { wrapperOptions: { retry: 10 } }, async function(status, n) {
  const user_id = this.users[n - 1].userId;
  const query = `select * from CA_OWNER.usr where src_sys_login_id = '${user_id}'`;
  const result = (await DBConnection.run(query))[0];
  logger.info(`query CA DB result: ${JSON.stringify(result)}`);
  expect(result['STATUS']).to.equal((status === 'Enabled') ? 'E' : 'D');
});

Then(/^check User DELETE_FLAG is "(Y|N)" in CA for the "(\d+)(?:st|nd|rd|th)" API created User$/, { wrapperOptions: { retry: 10} }, async function(value, n){
  const user_id = this.users[n-1].userId;
  const query = `select * from CA_OWNER.usr where src_sys_login_id = '${user_id}'`;
  const result = (await DBConnection.run(query))[0];
  logger.info(`query CA DB result: ${JSON.stringify(result)}`);
  expect(result['DELETE_FLAG']).to.equal((value === 'Y') ? 'Y' : 'N');
});

// options is a string splitted by "," with values from "Approve, Reject, Edit, Enable, Disable, Delete"
Then(/^check the "(.*)" options are (NOT displayed|displayed) on User Details page$/, async function(options, isDisplayed) {
  logger.info(`Check ${options} options are ${isDisplayed}`);
  const opts = options.split(',');

  for (let option of opts) {
    option = option.trim();
    
    const selector = (option === 'Approve') ? viewOimUserPage.selectors.approve :
                     (option === 'Reject') ? viewOimUserPage.selectors.reject : 
                     (option === 'Edit') ? viewOimUserPage.selectors.edit :
                     (option === 'Enable') ? viewOimUserPage.selectors.enable :
                     (option === 'Disable') ? viewOimUserPage.selectors.disable :
                     viewOimUserPage.selectors.delete;
    expect(await helper.ifElementDisplayed(selector)).to.equal(!isDisplayed.includes('NOT'));
  }
});
