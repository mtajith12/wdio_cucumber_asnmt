import { Then } from 'cucumber';
import _ = require('lodash');
import { searchPage } from 'src/SearchPage';
import { pendingApprovalsPage } from 'src/PendingApprovalsPage';
import { MenuBar } from 'src/MenuBarPage';
import { viewOimUserPage } from 'src/ViewOimUserPage';
import { expect } from "chai";
import { helper } from "src/Helper";
import { getLogger } from "log4js";
import { searchUserPage } from 'src/SearchUserPage';
import { userRegService } from 'api/UserRegService';
import { DBConnection } from 'src/DBConnection';
const dataReader = require('src/DataReader');
const logger = getLogger();
logger.level = 'info';

async function getUserInfoFromGrid(n) {
  if ((await helper.getElementText(MenuBar.selectors.bannerTitle)).includes('Manage / Users')) {
    // on Search Users page
    const userName = `${await helper.getElementText(searchPage.getCellSelectorByRowAndColumn(n, 6))} ${await helper.getElementText(searchPage.getCellSelectorByRowAndColumn(n, 5))}`;
    const workflow = `${await helper.getElementText(searchPage.getCellSelectorByRowAndColumn(n,9))}`;
    return {
      'userId': await helper.getElementText(searchPage.getCellSelectorByRowAndColumn(n, 3)),
      'userName': userName,
      'workflow': workflow,
    };
  } else {
    // on Pending Approvals page
    return {
      'userId': await helper.getElementText(searchPage.getCellSelectorByRowAndColumn(n, 3)),
      'userName': await helper.getElementText(searchPage.getCellSelectorByRowAndColumn(n, 4)),
      'workflow': await helper.getElementText(searchPage.getCellSelectorByRowAndColumn(n,8)),
    };
  }
}

function updateUserDataAfterApprovalSuccess(user) {
  if (user.applications && user.applications.length >= 1) {
    if (user.status === 'New') {
      for (let i = 0; i < user.applications.length; i++) {
        Object.values(user.applications[i])[0]['status'] = 'Enabled';
        Object.values(user.applications[i])[0]['lastProvStatus'] = 'Enabled Successfully';
      }
    } else {
      // the apps in userData may be in status of 'New', 'Enabled', 'Disabled' or 'Removed' before getting approved.
      for (let i = 0; i < user.applications.length; i++) {
        const appOrigStatus = Object.values(user.applications[i])[0]['status'];
        if (appOrigStatus === 'New' || appOrigStatus === 'Enabled') {
          // set status of the newly added apps to 'Enabled'
          Object.values(user.applications[i])[0]['status'] = 'Enabled';
          if (appOrigStatus === 'Enabled' && Object.values(user.applications[i])[0]['attrEdited']) {
            // app attributes were edited when app was under "Enabled" status
            Object.values(user.applications[i])[0]['lastProvStatus'] = 'Modified Successfully';
            delete Object.values(user.applications[i])[0]['attrEdited'];
          } else {
            Object.values(user.applications[i])[0]['lastProvStatus'] = 'Enabled Successfully';
          }
        } else if (appOrigStatus === 'Disabled') {
          // set status of the newly added apps to 'Disabled'
          Object.values(user.applications[i])[0]['status'] = 'Disabled';
          Object.values(user.applications[i])[0]['lastProvStatus'] = 'Disabled Successfully';
        } 
      }
      const applications = [];
      for (let i = 0; i < user.applications.length; i++) {
        const status = Object.values(user.applications[i])[0]['status'];
        if (!(status === 'Removed')) {
          applications.push(user.applications[i]);
        } else {
          // save the removed apps into an array, for later usage of checking on applications list.
          if (!user['removedApps']) user['removedApps'] = [];
          user.removedApps.push(Object.keys(user.applications[i])[0]);
        }
      }
      user.applications = applications;
    }
  }
  if (user.securityDevices && user.securityDevices.length >= 1) {
    for (var i = 0; i < user.securityDevices.length; i++) {
      if (user.securityDevices[i].type === 'ANZ Digital Key') {
        user.securityDevices[i]['status'] = 'Pending activation';
        user.securityDevices[i]['description'] = 'Device awaiting activation';
      } else {
        user.securityDevices[i]['status'] = 'Provisioning';
        user.securityDevices[i]['description'] = 'Device awaiting issuance';
      }
    }
  }
  user.status =  'Enabled';
  user.workflow = 'Approved';
}

function updateUserDataAfterRejectSuccess(user) {
  // revert user.applications data back to the original applications data before modifications were submitted, which was saved in user.appsBeforeModify.
  user.applications = _.cloneDeep(user.appsBeforeModify);
  user.appsBeforeModify = [];
  user['version'] = user['version'] + 1;
}

Then(/^BankUser clicks on "(Approve|Reject)" button on the User details page$/, async function(action) {
  await helper.click(viewOimUserPage.selectors.detailsTab);
  // Save the info of the to-be-approved/rejected user to this.usersToApproveOrReject[0], for later use by checking confirmation/success message.
  this.usersToApproveOrReject = [];
  const userName = `${await helper.getElementText(viewOimUserPage.selectors.firstNameValue)} ${await helper.getElementText(viewOimUserPage.selectors.surNameValue)}`;
  const userInfo = {
    'userId': await helper.getElementText(viewOimUserPage.selectors.userIdValue),
    'userName': userName,
  }
  this.usersToApproveOrReject.push(userInfo);
  logger.info(`Click on ${action} button`);
  await helper.waitForDisplayed(viewOimUserPage.selectors.userIdValue);
  await helper.click((action === 'Approve') ? viewOimUserPage.selectors.approve : viewOimUserPage.selectors.reject);
});

Then(/^BankUser (approves|rejects) the "(\d+)(?:st|nd|rd|th)" entry from "(Actions|Context)" menu$/, async function(action, n, menu) {
  // wait for "User ID" to have value
  await helper.waitUntilTextInElement(searchPage.getCellSelectorByRowAndColumn(n, 3), 20);

  // Save the info of the to-be-approved user to this.usersToApproveOrReject[0], for later use by checking confirmation/success message.
  this.usersToApproveOrReject = [];
  this.usersToApproveOrReject.push(await getUserInfoFromGrid(n));
  
  if (menu === 'Actions') {
    logger.info(`${action} entity from Actions menu`);
    await helper.click(searchPage.getSelectorOfNthItemInSearchResultsGrid(n));
    await helper.waitForTextInAttribute(searchPage.getSelectorOfNthItemInSearchResultsGrid(n), 'class', 'active', 2);
    await helper.click(MenuBar.selectors.actionsMenu.menuButton);
    await helper.waitForDisplayed(MenuBar.selectors.actionsMenu.approve);
    await helper.click((action === 'approves') ? MenuBar.selectors.actionsMenu.approve : MenuBar.selectors.actionsMenu.reject);
  } else {
    logger.info(`${action} entity from Context menu`);
    const selector = (action === 'approves') ? searchPage.selectors.contextMenu.approve : searchPage.selectors.contextMenu.reject;
    await helper.rightClick(searchPage.getSelectorOfNthItemInSearchResultsGrid(n), selector);
  }
});

Then(/^BankUser (approves|rejects) the "(\d+)(?:st|nd|rd|th)" and "(\d+)(?:st|nd|rd|th)" entries from "(Actions|Context)" menu$/, async function(action, i, j, menu) {
  await helper.waitUntilTextInElement(searchPage.getCellSelectorByRowAndColumn(i, 3), 20);

  // Save the info of the to-be-approved user to this.usersToApproveOrReject[0], for later use by checking confirmation/success message.
  this.usersToApproveOrReject = [];
  this.usersToApproveOrReject.push(await getUserInfoFromGrid(i));
  this.usersToApproveOrReject.push(await getUserInfoFromGrid(j));

  logger.info(`Select item ${i} and ${j} from the search User results grid`);
  await helper.click(searchPage.getSelectorOfNthItemInSearchResultsGrid(i));
  await helper.waitForTextInAttribute(searchPage.getSelectorOfNthItemInSearchResultsGrid(i), 'class', 'active', 5);
  await helper.pressCtrlKeyDown();
  await helper.pause(1.5);
  await helper.click(searchPage.getSelectorOfNthItemInSearchResultsGrid(j));
  await helper.waitForTextInAttribute(searchPage.getSelectorOfNthItemInSearchResultsGrid(j), 'class', 'active', 5);
  await helper.releaseCtrlKey();
  await helper.pause(1.5);
  if (menu === 'Actions') {
    logger.info(`${action} entity from Actions menu`);
    const selector = (action === 'approves') ? MenuBar.selectors.actionsMenu.approve : MenuBar.selectors.actionsMenu.reject;
    await helper.click(MenuBar.selectors.actionsMenu.menuButton);
    await helper.waitForDisplayed(selector);
    await helper.click(selector);
  } else {
    logger.info(`${action} entity from Context menu`);
    const selector = (action === 'approves') ? searchPage.selectors.contextMenu.approve : searchPage.selectors.contextMenu.reject;
    await helper.rightClick(searchPage.getSelectorOfNthItemInSearchResultsGrid(j), selector);
  }
});

Then(/^BankUser (approves|rejects) the combination of all users from the "(Actions|Context)" menu$/, async function(action, menu){
  await helper.waitUntilTextInElement(searchPage.selectors.resultGridRow, 20);
  const count = await searchPage.getNumberOfResultEntries();
  await helper.click(searchPage.getSelectorOfNthItemInSearchResultsGrid(1));

  this.usersToApproveOrReject = [];
  this.usersToApproveOrReject.push(await getUserInfoFromGrid(1));
  if (count >= 2) {
    await helper.pressCtrlKeyDown();
    await helper.pause(1);
    for (let i = 2; i <= count; i++){
      await helper.click(searchPage.getSelectorOfNthItemInSearchResultsGrid(i));
      this.usersToApproveOrReject.push(await getUserInfoFromGrid(i));
      await helper.pause(1);
    } 
    await helper.releaseCtrlKey();
  }

  if (menu === 'Actions') {
    logger.info(`${action} entity from Actions menu`);
    const selector = (action === 'approves') ? MenuBar.selectors.actionsMenu.approve : MenuBar.selectors.actionsMenu.reject;
    await helper.click(MenuBar.selectors.actionsMenu.menuButton);
    await helper.waitForDisplayed(selector);
    await helper.click(selector);
  } else {
    logger.info(`${action} entity from Context menu`);
    const selector = (action === 'approves') ? searchPage.selectors.contextMenu.approve : searchPage.selectors.contextMenu.reject;
    await helper.rightClick(searchPage.getSelectorOfNthItemInSearchResultsGrid(1), selector);
  }
});

/*
 * Reject reason is passed in from feature file as: | rejectReason | User is rejected for testing purpose |
 */
Then(/^BankUser enters Reject reason then clicks on "(Cancel|Ok)" button:$/, async function(button, data) {
  await helper.waitForDisplayed(searchPage.selectors.dialog.rejectReason);
  const reason = data.rowsHash()['rejectReason'];
  logger.info( `Enter reject reason: ${reason}`);
  await helper.inputText(searchPage.selectors.dialog.rejectReason, reason);
  await helper.click((button === 'Cancel') ? searchPage.selectors.dialog.cancelBtn : searchPage.selectors.dialog.okBtn);
});

Then(/^check Approve (Single User|Multiple Users) (creation|modification|creation and modification|enablement|deletion|combination) confirmation message, then click on "(No|Yes)" button$/, async function(singleMulti, action, button) {
  logger.info('Check confirmation dialog and message for approving user');
  // check if bankuser is on search screen or user details screen. the confirmation dialog DOM is slightly different 
  var selector;
  if (await helper.ifElementDisplayed(viewOimUserPage.selectors.detailsTab)) {
    selector = viewOimUserPage.selectors.dialog.confirmationMsg1;
    logger.info('On user details screen');
  } else {
    selector = searchPage.selectors.dialog.confirmationMsg;
    logger.info('On search screen');
  }

  var entity = (await helper.getElementText(MenuBar.selectors.bannerTitle)).includes('Pending Approvals') ? 'Customer User' : 'User';
  
  if (singleMulti === 'Single User') {
    // If there is a selected user in the footer, they are on the details page and should display entity 'User' in confirmation message for approval
    entity = (await helper.ifElementDisplayed(viewOimUserPage.selectors.selectedObjectFooter))? 'User' : 'Customer User';
    const msg_061 = `Approve changes to ${entity}: ${this.usersToApproveOrReject[0].userName} (${this.usersToApproveOrReject[0].userId}).`
    if (action.includes('creation')) {
      const msg_038 = `On approval ${entity}: ${this.usersToApproveOrReject[0].userName} (${this.usersToApproveOrReject[0].userId}) will be created.`;
      expect(await helper.getElementText(selector)).to.equal(msg_038);
    } else if (action === 'modification') {
      expect(await helper.getElementText(selector)).to.equal(msg_061);
    } else if (action === 'enablement') {
      const msg_178 = `On approval ${entity}: ${this.usersToApproveOrReject[0].userName} (${this.usersToApproveOrReject[0].userId}) will be enabled.`;
      expect(await helper.getElementText(selector)).to.equal(msg_178);
    } else if (action === 'deletion') {
      const msg_65 = `On approval ${entity}: ${this.usersToApproveOrReject[0].userName} (${this.usersToApproveOrReject[0].userId}) will be deleted.`;
      expect(await helper.getElementText(selector)).to.equal(msg_65);
    }
  } else if (action === 'combination'){
    // Approve Multiple user Combinations
    const multiSelectors = await helper.getNestedElements(selector);
    const multiMsg = [];

    for (let singleSelector of multiSelectors){
      multiMsg.push(await helper.getElementText(singleSelector));
    }
    
    for (let msg of multiMsg){
      for (var i = 0; i < this.usersToApproveOrReject.length; i++){
        switch(this.usersToApproveOrReject[i].workflow){
          case ('Pending Approval - Create'): {
            expect(msg.startsWith(`On Approval ${entity}`));
            expect(msg.endsWith(`will be created.`));
            break;
          }
          case ('Pending Approval - Modified'): {
            expect(msg.startsWith(`Approve changes to ${entity}`));
            expect(msg.endsWith(`will be modified.`));
            break;
          }
          case ('Pending Approval - Enabled'): {
            expect(msg.startsWith(`On Approval ${entity}`));
            expect(msg.endsWith(`will be enabled.`));
            break;
          }
          case ('Pending Approval - Delete'): {
            expect(msg.startsWith(`On Approval ${entity}`));
            expect(msg.endsWith(`will be deleted.`));
            break;
          }
        }
        expect(msg.includes(`${this.usersToApproveOrReject[i].userName} (${this.usersToApproveOrReject[i].userId})`));
      }
    }
  } else {
    // Approve multiple users with same workflow at the same time: MSG_059
    const confirmMsg = await helper.getElementText(selector);
    logger.info(`This is the ${confirmMsg}`);
    if (action === 'creation') {
      expect(confirmMsg.startsWith(`On approval ${entity}`));
      expect(confirmMsg.endsWith('will be created'));
    } else if (action === 'modification') {
      expect(confirmMsg.startsWith(`Approve changes to ${entity}`));
    } else if (action === 'creation and modification') {
      expect(confirmMsg[0].startsWith(`On approval ${entity}`));
      expect(confirmMsg[0].endsWith('will be created'));
      expect(confirmMsg[1].startsWith(`Approve changes to ${entity}`));
    } else if (action === 'enablement') {
      // ..... 
    } else if (action === 'deletion') {
      expect(confirmMsg.startsWith(`On approval ${entity}`));
      expect(confirmMsg.endsWith(` will be deleted.`));
    }
    for (var i = 0; i < this.usersToApproveOrReject.length; i++) {
      expect(confirmMsg.includes(`${this.usersToApproveOrReject[i].userName} (${this.usersToApproveOrReject[i].userId})`));
    }
  }

  logger.info(`Click on ${button} button`);
  const btnSelector = (button === 'No') ? viewOimUserPage.selectors.dialog.cancel : viewOimUserPage.selectors.dialog.confirm;
  await helper.click(btnSelector);
});

Then(/^check Reject Acknowledgement dialog (displayed with empty reason|closed)$/, async function(status) {
  if (status.includes('displayed')) {
    await helper.waitForDisplayed(searchPage.selectors.dialog.title);
    // MSG_126
    expect(await helper.getElementText(searchPage.selectors.dialog.title)).to.equal('Enter A Reason For Rejection');
    expect(await helper.ifElementDisplayed(searchPage.selectors.dialog.rejectReason)).to.equal(true);
    expect(await helper.getElementText(searchPage.selectors.dialog.rejectReason)).to.equal('');
  } else {
    await helper.waitForElementToDisAppear(searchPage.selectors.dialog.rejectReason, 2);
  }
});

Then(/^check the system retain the user on the View User Details screen$/, async function() {
  logger.info('Check the system retain the user on the same screen');
  expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.userIcon)).to.equal(true);
  expect(await helper.getElementText(viewOimUserPage.selectors.userIdValue)).to.equal(this.userData.userId.toUpperCase());
  expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.approve)).to.equal(true);
});

Then(/^check the system retain the users on the grid$/, async function() {
  logger.info('Check the system retain the users on the same screen');
  let userIds = (await helper.getElementText(MenuBar.selectors.bannerTitle)).includes('Manage / Users') ? await searchUserPage.getUserIdsInDisplayedResults() : await pendingApprovalsPage.getRecordIdsInDisplayedResults(); 
  // users to be approved have been saved into this.usersToApproveOrReject[] in scenario context previously
  for (var i = 0; i < this.usersToApproveOrReject.length; i++) {
    expect(userIds.indexOf(this.usersToApproveOrReject[i].userId) > -1);
  }
});

Then(/^check the (Single User|Multiple Users) (creation|modification|enablement|deletion|combination) been (approved|rejected) successfully$/, { wrapperOptions: { retry: 1 } }, async function(singleMulti, operation, action) {
  let successMsg;
  if (singleMulti === 'Single User') {
    // Approve/Reject a single user: MSG_039, MSG_040, MSG_066
    const userInfo = `${this.usersToApproveOrReject[0].userName} (${this.usersToApproveOrReject[0].userId.toUpperCase()})`;
    if (operation === 'creation') {
      successMsg = action.includes('approve') ? `${userInfo} has been created` : `${userInfo} was rejected`;
    } else if (operation === 'modification') {
      successMsg = action.includes('approve') ? `${userInfo} have been approved` : `${userInfo} was rejected`;
    } else if (operation === 'enablement') {
      successMsg = action.includes('approve') ? `${userInfo} has been enabled` : `${userInfo} was rejected`;
    } else if (operation === 'deletion') {
      successMsg = action.includes('approve') ? `${userInfo} has been deleted` : `${userInfo} was rejected`;
    }
    await helper.waitForTextInElement(viewOimUserPage.selectors.successNotificationMsg, successMsg, 15);

    const msg = await helper.getElementText(viewOimUserPage.selectors.successNotificationMsg);
    await helper.screenshot(`${singleMulti}-${operation}-${action}`);
    logger.info(msg);

    // Upon approve/reject success, update this.userData with the corresponding status on user and his entities
    let userData = this.userData ? this.userData : this.users[0];
    (action.includes('approve')) ? updateUserDataAfterApprovalSuccess(userData) : updateUserDataAfterRejectSuccess(userData);
    console.log(`User data after ${action}: \n ${JSON.stringify(userData)}`);
  } else {
    // Approve/reject multiple users: MSG_070, MSG_074
    successMsg = `All selected records have been ${action} successfully.`;
    await helper.waitForTextInElement(viewOimUserPage.selectors.successNotificationMsg, successMsg, 15);
    await helper.screenshot(`user-${action}-multipleUsers`);

    // In the scenarios of approving/rejecting multiple users, the users are created via API and user data saved in this.users.
    // Upon approve/reject success, update this.users with the corresponding status on users and their entities. 
    for (let user of this.users) {
      (action.includes('approve')) ? updateUserDataAfterApprovalSuccess(user) : updateUserDataAfterRejectSuccess(user);
    }
    console.log(`Users data after ${action}: \n ${this.users}`);
  }
});

Then(/^check User Status set to Deleted and Workflow to Approved on View User details page$/, async function() {
  logger.info('Check user status set to Enabled and workflow to Approved');
  expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableRightColumn(1)).to.equal('Status:Deleted');
  expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableRightColumn(2)).to.equal('Workflow:Approved');
});

Then(/^check User Status set to Enabled and Workflow to Approved on View User details page$/, async function() {
  logger.info('Check user status set to Enabled and workflow to Approved');
  expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableRightColumn(1)).to.equal('Status:Enabled');
  expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableRightColumn(2)).to.equal('Workflow:Approved');
});

Then(/^check User.DA Modifiable has been set to (TRUE|FALSE)$/, async function(daModifiable) {
  const bankuser = dataReader.getBankUser('Default OIM Bankuser');
  var userDetails = await userRegService.getCustUserDetailsByLogonId(bankuser, this.userData.userId);
  logger.info('User.DA Modifiable is ' + userDetails[0].daModifiable);
  if (daModifiable === 'TRUE') {
    expect(userDetails[0].daModifiable).to.be.true;
  } else if (daModifiable === 'FALSE'){
    expect(userDetails[0].daModifiable).to.be.false;
  }
});

Then(/^check user details in COBRA Agent database$/, async function() {
  const logonId = this.userData.userId;
  const query = `select * from CA_OWNER.usr where src_sys_login_id = '${logonId}'`
  logger.info('Checking user details in CA database');
  if ((process.env.DB_CHECK).toString() === 'true') {
  var userDetails = await DBConnection.run(query);
  logger.info(userDetails);
  expect(userDetails[0].FIRST_NAME).to.equal(this.userData.firstName);
  expect(userDetails[0].SURNAME).to.equal(this.userData.surName);
  expect(userDetails[0].PREFFERED_FIRST_NAME).to.equal(this.userData.prefFirstName);
  expect(userDetails[0].CUSTOMER_ORGANISATION).to.equal(this.userData.caasOrgName);
  expect(userDetails[0].CUSTOMER_ORGANISATION_ID).to.equal(this.userData.caasOrgCd);
  expect(userDetails[0].USER_SYSTEM).to.equal(this.userData.sourceSystem);
  }
});

Then(/^check the version number is "(\d+)" in CA for the "(\d+)(?:st|nd|rd|th)" API created User$/, { wrapperOptions: { retry: 10 } }, async function(number, n) {
  await helper.pause(2); // give time for CA to be updated
  const user_id = this.users[n - 1].userId;
  const query = `select * from CA_OWNER.usr where src_sys_login_id = '${user_id}'`;
  const result = (await DBConnection.run(query))[0];
  logger.info(`query CA DB result: ${JSON.stringify(result)}`);
  const version = result['VERSION'];
  logger.info(`User "${user_id}" version number in CA is: ${version}`);
  expect(version).to.equal(number);
});

Then(/^check the "(\d+)(?:st|nd|rd|th)" API created User has NOT been published to CA$/, async function(n) {
  await helper.pause(5);
  const user_id = this.users[n - 1].userId;
  const query = `select * from CA_OWNER.usr where src_sys_login_id = '${user_id}'`;
  const result = await DBConnection.run(query);
  logger.info(`User "${user_id}" was NOT published to CA`);
  expect(result.length).to.equal(0);
});


Then(/^check the applications in CA for the UI created User$/, { wrapperOptions: { retry: 0 } }, async function() {
  const logonId = this.userData.userId.toUpperCase();
  const applications = this.userData.applications;

  const query1 = `select * from CA_OWNER.usr where src_sys_login_id = '${logonId}'`;
  const userResult = (await DBConnection.run(query1))[0];
  logger.info(`CA result for User: ${JSON.stringify(userResult)}`);
  const user_id = userResult['USER_ID'];
  
  logger.info('Check applications status and atrributes in CA:');
  for (let application of applications) {
    const appName = Object.keys(application)[0];
    const status = Object.values(application)[0]['status'];

    const expectedCAStatus = status === 'Enabled' ? 'Y' : 'N' ;
    const query2 = `select * from CA_OWNER.usr_application where user_id='${user_id}' and application_name='${appName}'`;
    const appResult = (await DBConnection.run(query2))[0];
    logger.info(`CA result for USER_APPLICATION: ${JSON.stringify(appResult)}`);
    expect(appResult['STATUS']).to.equal(expectedCAStatus);

    const query3 = `select * from CA_OWNER.usr_application_attribute where user_id='${user_id}' and application_name='${appName}'`;
    const appAttrResults = await DBConnection.run(query3);
    logger.info(`CA result for USER_APPLICATION_ATTRIBUTE: ${JSON.stringify(appAttrResults)}`);
    if (appName === 'eMatching') {
      expect(appAttrResults.length).to.equal(1);
      expect(appAttrResults[0]['ATTRIBUTE_NAME']).to.equal('userID');
      expect(appAttrResults[0]['ATTRIBUTE_VALUE']).to.equal(Object.values(application)[0]['eMatchingUserId']);
    } else if (appName === 'EsandaNet') {
      expect(appAttrResults.length).to.equal(3);
      for (let result of appAttrResults) {
        expect(['userID', 'userRegion', 'userType'].includes(result['ATTRIBUTE_NAME']));
        if (result['ATTRIBUTE_NAME'] === 'userID') expect(result['ATTRIBUTE_VALUE']).to.equal(Object.values(application)[0]['iSeriesUserID'].toUpperCase());
        if (result['ATTRIBUTE_NAME'] === 'userRegion') expect(result['ATTRIBUTE_VALUE']).to.equal(Object.values(application)[0]['userRegion'].toString());
        if (result['ATTRIBUTE_NAME'] === 'userType') expect(result['ATTRIBUTE_VALUE']).to.equal('Broker');
      }
    } else if (appName === 'GCIS') {
      expect(appAttrResults.length).to.equal(1);
      expect(appAttrResults[0]['ATTRIBUTE_NAME']).to.equal('userID');
      expect(appAttrResults[0]['ATTRIBUTE_VALUE']).to.equal(Object.values(application)[0]['GCISUserID']);
    } else if (appName === 'Internet Enquiry Access') {
      expect(appAttrResults.length).to.equal(1);
      expect(appAttrResults[0]['ATTRIBUTE_NAME']).to.equal('customerRegNo');
      expect(appAttrResults[0]['ATTRIBUTE_VALUE']).to.equal(Object.values(application)[0]['customerRegNo'].toString());
    } else {
      expect(appAttrResults.length).to.equal(0);
    }
  }

  if (this.userData['removedApps']) {
    logger.info('Check Removed applications are removed in CA:');
    for (let removedApp of this.userData['removedApps']) {
      const query2 = `select * from CA_OWNER.usr_application where user_id='${user_id}' and application_name='${removedApp}'`;
      const result = await DBConnection.run(query2);
      logger.info(`CA result for removed USER_APPLICATION: ${JSON.stringify(result)}`);
      expect(result.length).to.equal(0);
    }
  }

});

Then(/^check the applications in CA for the "(\d+)(?:st|nd|rd|th)" API created User$/, { wrapperOptions: { retry: 0 } }, async function(n) {
  const logonId = this.users[n - 1].userId;
  const applications = this.users[n - 1].applications;

  const query1 = `select * from CA_OWNER.usr where src_sys_login_id = '${logonId}'`;
  const userResult = (await DBConnection.run(query1))[0];
  logger.info(`CA result for User: ${JSON.stringify(userResult)}`);
  const user_id = userResult['USER_ID'];
  
  logger.info('Check applications status and atrributes in CA:');
  for (let application of applications) {
    const appName = Object.keys(application)[0];
    const status = Object.values(application)[0]['status'];

    const expectedCAStatus = status === 'Enabled' ? 'Y' : 'N' ;
    const query2 = `select * from CA_OWNER.usr_application where user_id='${user_id}' and application_name='${appName}'`;
    const appResult = (await DBConnection.run(query2))[0];
    logger.info(`CA result for USER_APPLICATION: ${JSON.stringify(appResult)}`);
    expect(appResult['STATUS']).to.equal(expectedCAStatus);

    const query3 = `select * from CA_OWNER.usr_application_attribute where user_id='${user_id}' and application_name='${appName}'`;
    const appAttrResults = await DBConnection.run(query3);
    logger.info(`CA result for USER_APPLICATION_ATTRIBUTE: ${JSON.stringify(appAttrResults)}`);
    if (appName === 'eMatching') {
      expect(appAttrResults.length).to.equal(1);
      expect(appAttrResults[0]['ATTRIBUTE_NAME']).to.equal('userID');
      expect(appAttrResults[0]['ATTRIBUTE_VALUE']).to.equal(Object.values(application)[0]['eMatchingUserId']);
    } else if (appName === 'EsandaNet') {
      expect(appAttrResults.length).to.equal(3);
      for (let result of appAttrResults) {
        expect(['userID', 'userRegion', 'userType'].includes(result['ATTRIBUTE_NAME']));
        if (result['ATTRIBUTE_NAME'] === 'userID') expect(result['ATTRIBUTE_VALUE']).to.equal(Object.values(application)[0]['iSeriesUserID']);
        if (result['ATTRIBUTE_NAME'] === 'userRegion') expect(result['ATTRIBUTE_VALUE']).to.equal(Object.values(application)[0]['userRegion'].toString());
        if (result['ATTRIBUTE_NAME'] === 'userType') expect(result['ATTRIBUTE_VALUE']).to.equal('Broker');
      }
    } else if (appName === 'GCIS') {
      expect(appAttrResults.length).to.equal(1);
      expect(appAttrResults[0]['ATTRIBUTE_NAME']).to.equal('userID');
      expect(appAttrResults[0]['ATTRIBUTE_VALUE']).to.equal(Object.values(application)[0]['GCISUserID']);
    } else if (appName === 'Internet Enquiry Access') {
      expect(appAttrResults.length).to.equal(1);
      expect(appAttrResults[0]['ATTRIBUTE_NAME']).to.equal('customerRegNo');
      expect(appAttrResults[0]['ATTRIBUTE_VALUE']).to.equal(Object.values(application)[0]['customerRegNo'].toString());
    } else {
      expect(appAttrResults.length).to.equal(0);
    }
  }

  if (this.users[n - 1]['removedApps']) {
    logger.info('Check Removed applications are removed in CA:');
    for (let removedApp of this.users[n - 1]['removedApps']) {
      const query2 = `select * from CA_OWNER.usr_application where user_id='${user_id}' and application_name='${removedApp}'`;
      const result = await DBConnection.run(query2);
      logger.info(`CA result for removed USER_APPLICATION: ${JSON.stringify(result)}`);
      expect(result.length).to.equal(0);
    }
  }
});

Then(/^check error message for approving existing CAAS OIM user$/, async function () {
  logger.info(`Check that error message appears for existing OIM User`);
  const msg018 = 'User Logon ID already exists in CAAS. Please choose a different User Logon ID.';
  await helper.waitForTextInElement(viewOimUserPage.selectors.errNotificationMsg, 'User Logon', 15);
  expect((await helper.getElementText(viewOimUserPage.selectors.errNotificationMsg)).trim()).to.equal(msg018);
});