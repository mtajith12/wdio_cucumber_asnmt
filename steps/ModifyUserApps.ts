import { Given, When, Then } from 'cucumber';
import * as _ from 'lodash';
const faker = require('faker');
import { viewOimUserPage } from 'src/ViewOimUserPage';
import { expect } from 'chai';
import { helper } from 'src/Helper';
import { getLogger } from 'log4js';
import { searchUserPage } from 'pages/SearchUserPage';
const logger = getLogger();
logger.level = 'info';

const UserRegion = {'2': 'NSW, ACT', '3': 'Victoria, Tasmania', '4': 'Queensland', '5': 'SA, NT', '6': 'WA'};

/*
 * Format attribute text displayed on applications grid into attribute object, in format of,  
 *     e.g., "{'iSeriesUserID': 'abcd1234', 'userRegion': 'WA', 'userType': 'B'}"
 */
function attrTextToAttrs(appName, attrText) {
  if (appName === 'eMatching') {
    return {'eMatchingUserId': attrText.split(':')[1].trim()};
  } else if (appName === 'EsandaNet') {
    const attrs = attrText.split('|');
    // for EsandaNet the display sequence of attributes in the UI text is not fixed
    let iSeriesUserID;
    let region;
    for (let attr of attrs) {
      if (attr.includes('iSeries User ID')) iSeriesUserID = attr.split(':')[1].trim();
      if (attr.includes('User Region')) {
        region = Object.keys(UserRegion).find(key => UserRegion[key] === attr.split(':')[1].trim());
      }
    }
    return {'iSeriesUserID': iSeriesUserID, 'userRegion': region, 'userType': 'B'}
  } else if (appName === 'GCIS') {
    return {'GCISUserID': attrText.split(':')[1].trim()};
  } else if (appName === 'Internet Enquiry Access') {
    return {'customerRegNo': attrText.split(':')[1].trim()};
  } else {
    return {};
  }
}

/*
 * Format attribute object informat of e.g. {'iSeriesUserID': 'abcd1234', 'userRegion': 'WA', 'userType': 'B'}", 
 * into the text that will be displayed in applications grid on UI.
 */
function attrsToAttrText(appEntry) {
  const appName = Object.keys(appEntry)[0];
  const attrs = Object.values(appEntry)[0];
  if (appName === 'eMatching') {
    return `eMatching User ID: ${attrs['eMatchingUserId']}`;
  } else if (appName === 'EsandaNet') {
    return `iSeries User ID: ${attrs['iSeriesUserID']} | User Type: Broker | User Region: ${UserRegion[attrs['userRegion']]}`;
  } else if (appName === 'GCIS') {
    return `GCIS User ID: ${attrs['GCISUserID']}`;
  } else if (appName === 'Internet Enquiry Access') {
  logger.info('Checking Internet Enquiry Access attribute');
    return `Customer Registration Number: ${attrs['customerRegNo']}`;
  } else {
    return '';
  }
}

// select one or multiple apps from the applications grid. appNames are "," seperated. 
// returns the selected apps in a array like [{"GCIS":{"GCISUserID":"t5y8tu","status":"New", "lastProvStatus": ""}}, {"Institutional Insights":{"status":"New", "lastProvStatus": ""}}]
async function selectApps(appNames) {
  const apps = appNames.split(';');
  let selectedAppEntries = [];
  for (let i = 0; i < apps.length; i++) {
    const appName = apps[i];
    let selectedEntry = {};
    const rowNum = await viewOimUserPage.findAppInAppTable(appName); 
    const origAttrsText = await viewOimUserPage.getAppAttributesInGrid(rowNum);
    const origStatus = await viewOimUserPage.getAppStatusInGrid(rowNum);
    const origLastProvStatus = await viewOimUserPage.getAppLastProvStatusInGrid(rowNum);
    selectedEntry[appName] = attrTextToAttrs(appName, origAttrsText);
    selectedEntry[appName]['status'] = origStatus;
    selectedEntry[appName]['lastProvStatus'] = origLastProvStatus;
    selectedAppEntries.push(selectedEntry);
  }

  logger.info(`Select the apps ${appNames} from the grid`);
  const n = await viewOimUserPage.findAppInAppTable(apps[0]);
  await helper.click(viewOimUserPage.getAppNameSelectorInGrid(n));
  await helper.waitForTextInAttribute(viewOimUserPage.getSelectorOfRowInApplicationsGrid(n), 'class', 'active', 2);
  if (apps.length >= 2) {
    await helper.pressCtrlKeyDown();
    await helper.pause(0.5);
    for (let i = 1; i < apps.length; i++) {
      const rowNum = await viewOimUserPage.findAppInAppTable(apps[i]);
      await helper.click(viewOimUserPage.getAppNameSelectorInGrid(rowNum));
      await helper.waitForTextInAttribute(viewOimUserPage.getSelectorOfRowInApplicationsGrid(rowNum), 'class', 'active', 2);
    }
    await helper.releaseCtrlKey();
  }
  return selectedAppEntries;
}

// sample app entry is like {"GCIS":{"GCISUserID":"t5y8tu","status":"New", "lastProvStatus":""}}, or {"Institutional Insights":{"status":"New", "lastProvStatus":""}}
async function checkAppDataInGrid(appEntry) {
  const appName = Object.keys(appEntry)[0];
  logger.info(`Check app "${appName}" attributes and status in the applications grid`);
  const attributesText = attrsToAttrText(appEntry);
  const status = Object.values(appEntry)[0]['status'];
  if (!Object.values(appEntry)[0]['lastProvStatus']) Object.values(appEntry)[0]['lastProvStatus'] = '';
  const lastProvStatus = Object.values(appEntry)[0]['lastProvStatus'];
  const rowNum = await viewOimUserPage.findAppInAppTable(appName);
  // this step takes a long time to go through all 10 apps when running on Jenkins and got Cobra session time-out.
  // adding a click to interact with the browser, to work around the session time-out issue.
  // await helper.click(viewOimUserPage.getSelectorOfRowInApplicationsGrid(rowNum));

  expect(await viewOimUserPage.getAppNameInGrid(rowNum)).to.equal(appName);
  if (appName === 'EsandaNet') {
    // EsandaNet, the display sequence of the attributes is not fixed
    const attrs = attributesText.split('|');
    for (let attr of attrs) {
      expect(await viewOimUserPage.getAppAttributesInGrid(rowNum)).to.includes(attr.trim());
    }
  } else if (appName === 'eMatching') {
    const text = (Object.values(appEntry)[0]['eMatchingUserId'] === '') ? 'eMatching User ID: [system generated]' : attributesText;
    expect(await viewOimUserPage.getAppAttributesInGrid(rowNum)).to.equal(text);
  } else {
    expect(await viewOimUserPage.getAppAttributesInGrid(rowNum)).to.equal(attributesText);
  }
  expect(await viewOimUserPage.getAppStatusInGrid(rowNum)).to.equal(status);
  expect(await viewOimUserPage.getAppLastProvStatusInGrid(rowNum)).to.equal(lastProvStatus);
}

// appNames are "," seperated
Then(/^BankUser selects applications "(.*)" in the applications grid$/, async function(appNames) {
  await selectApps(appNames);
});

Then(/^check Applications tab is displayed in View mode$/, async function () {
  logger.info('Checking "Add", "Remove", "Edit", "Enable" and "Disable" buttons are NOT displayed');
  expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUserApp.addAppBtn)).to.equal(false);
  expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUserApp.removeAppBtn)).to.equal(false);
  expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUserApp.editAppBtn)).to.equal(false);
  expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUserApp.enableAppBtn)).to.equal(false);
  expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUserApp.disableAppBtn)).to.equal(false);
});

Then(/^BankUser clicks on \"Add\" application button and checks the display of Add application screen$/, async function() {
  logger.info('Click on "Add application" button');
  await helper.click(viewOimUserPage.selectors.modifyUserApp.addAppBtn);
  await helper.waitForTextInElement(viewOimUserPage.selectors.addOrEditAppDialog.title, 'Add Application');
  await helper.waitForDisplayed(viewOimUserPage.selectors.addOrEditAppDialog.applicationSelect);
  await helper.screenshot('add-app-dialog');
});

Then(/^BankUser adds application "(.*)" for the API created User$/, async function(appName) {
  await helper.click(viewOimUserPage.selectors.modifyUserApp.addAppBtn);
  await helper.waitForDisplayed(viewOimUserPage.selectors.addOrEditAppDialog.applicationSelect);
  
  logger.info(`Adding application to the User: ${appName}`);
  await helper.selectByVisibleText(viewOimUserPage.selectors.addOrEditAppDialog.applicationSelect, appName);

  let addedApp = {};
  switch (appName) {
    case 'EsandaNet':
      const iSeriesUserID = faker.random.alphaNumeric(20).toUpperCase();
      const region = faker.random.number(4) + 2;
      await helper.inputText(viewOimUserPage.selectors.addOrEditAppDialog.userIDInput, iSeriesUserID);
      await helper.selectByAttribute(viewOimUserPage.selectors.addOrEditAppDialog.userRegionSelect, 'value', region);
      addedApp[appName] = {'iSeriesUserID': iSeriesUserID, 'userRegion': region, 'type': 'B', 'status': 'New', 'lastProvStatus': ''};
      break;
    case 'GCIS':
      const GCISUserID = faker.random.alphaNumeric(15);
      await helper.inputText(viewOimUserPage.selectors.addOrEditAppDialog.userIDInput, GCISUserID);
      addedApp[appName] = {'GCISUserID': GCISUserID, 'status': 'New', 'lastProvStatus': ''};
      break;
    case 'Internet Enquiry Access':
      const customerRegNo = faker.random.number({min:100000, max: 999999});
      await helper.inputText(viewOimUserPage.selectors.addOrEditAppDialog.customerRegNoInput, customerRegNo);
      addedApp[appName] = {'customerRegNo': customerRegNo, 'status': 'New', 'lastProvStatus': ''};
      break;
    case 'eMatching':
      addedApp[appName] = {'eMatchingUserId': '', 'status': 'New', 'lastProvStatus': ''};
      break;
    case 'GCP':
    case 'Institutional Insights':
    case 'LM':
    case 'Online Trade':
    case 'SDP CTS':
    case 'Transactive Global':
      addedApp[appName] = {'status': 'New', 'lastProvStatus': ''};
      break;
  };
  await helper.screenshot(`add-${appName}-dialog`);
  await helper.click(viewOimUserPage.selectors.addOrEditAppDialog.okButton);

  logger.info( `Check application ${appName} appears in the applications grid and its status set to "New"`);
  await viewOimUserPage.waitForAppToAppearInGrid(appName);
  expect(await viewOimUserPage.getAppStatusInGrid(await viewOimUserPage.findAppInAppTable(appName))).to.equal('New');
  await helper.screenshot(`${appName}-added`);

  // Save the modified applications info into scenario context
  if (!this.appsAfterModifications) this.appsAfterModifications = JSON.parse(JSON.stringify(this.users[0].applications));
  this.appsAfterModifications.push(addedApp);
});

// appNames are ";" seperated
Then(/^BankUser (removes|disables|enables) applications "(.*)" then clicks on "(Yes|No)" for the API created User$/, async function (action, appNames, button) {
  const btnSelector = (action === 'removes') ? viewOimUserPage.selectors.modifyUserApp.removeAppBtn : (action === 'disables') ? viewOimUserPage.selectors.modifyUserApp.disableAppBtn : viewOimUserPage.selectors.modifyUserApp.enableAppBtn;
  const confirmText = (action === 'removes') ? viewOimUserPage.screenMessages.msg010 : (action === 'disables') ? viewOimUserPage.screenMessages.msg040: viewOimUserPage.screenMessages.msg039;
  const statusAfter = (action === 'removes') ? 'Removed' : (action === 'disables') ? 'Disabled' : 'Enabled';

  const apps = appNames.split(';');
  let selectedAppEntries = await selectApps(appNames);

  logger.info(`Click on ${action} button`);
  await helper.click(btnSelector);
  await helper.waitForTextInElement(viewOimUserPage.selectors.dialog.confirmationMsg1, confirmText, 5);
  await helper.screenshot(`${action}-app-confirm-message`);

  if (button === 'Yes') {
    if (!this.appsAfterModifications) this.appsAfterModifications = JSON.parse(JSON.stringify(this.users[0].applications));

    logger.info(`Confirm ${action} the apps: ${appNames}`);
    await helper.click(viewOimUserPage.selectors.dialog.confirm);
    for (let appEntry of selectedAppEntries) { 
      const appName = Object.keys(appEntry)[0];
      const origStatus = Object.values(appEntry)[0]['status'];
      // for remove,disable and enable, status of the application will change, but attributeText and lastProvStatus do not change.
      if (origStatus === 'New' && action === 'removes') {
        logger.info(`Check app entry ${appNames} which was in status of "New" has been removed from grid`);
        expect(await viewOimUserPage.findAppInAppTable(appName)).to.equal(null);
        for (var i = 0; i < this.appsAfterModifications.length; i++) {
          if (appName === Object.keys(this.appsAfterModifications[i])[0]) {
            this.appsAfterModifications.splice(i, 1);
            break;
          }
        }
      } else {
        Object.values(appEntry)[0]['status'] = statusAfter;
        logger.info(`Check app entry ${appNames} has been updated in the grid`);
        await checkAppDataInGrid(appEntry);
      }

      // save the removed/disabled/enabled apps into scenario context
      for (let app of this.appsAfterModifications) {
        if (appName === Object.keys(app)[0]) {
          app = _.merge(app, appEntry);
        }
      }
    }
  } else {
    logger.info(`Cancel ${action} the apps ${appNames}, then check the app remains unchanged on the applications grid`);
    await helper.click(viewOimUserPage.selectors.dialog.cancel);
    for (let i = 0; i < apps.length; i++) {
      const appName = Object.keys(selectedAppEntries[i])[0];
      const rowNum = await viewOimUserPage.findAppInAppTable(appName); 
      const origAttributesText = attrsToAttrText(selectedAppEntries[i]);
      const origStatus = Object.values(selectedAppEntries[i])[0]['status'];
      const origLastProvStatus = Object.values(selectedAppEntries[i])[0]['lastProvStatus'];
      expect(await viewOimUserPage.getAppAttributesInGrid(rowNum)).to.equal(origAttributesText);
      expect(await viewOimUserPage.getAppStatusInGrid(rowNum)).to.equal(origStatus);
      expect(await viewOimUserPage.getAppLastProvStatusInGrid(rowNum)).to.equal(origLastProvStatus);
    }
  }
});

Then(/^check "(Add|Edit|Remove|Enable|Disable)" button is "(Enabled|Disabled)" on Modify User App screen$/, async function(button, status) {
  await helper.waitForDisplayed(viewOimUserPage.selectors.modifyUserApp.addAppBtn);
  logger.info(`Check ${button} App button is ${status} on Modify User Apps screen`);
  const btnSelector = (button === 'Add') ? viewOimUserPage.selectors.modifyUserApp.addAppBtn : (button === 'Edit') ? viewOimUserPage.selectors.modifyUserApp.editAppBtn : (button === 'Remove') ? viewOimUserPage.selectors.modifyUserApp.removeAppBtn : (button === 'Enable') ? viewOimUserPage.selectors.modifyUserApp.enableAppBtn : viewOimUserPage.selectors.modifyUserApp.disableAppBtn;
  expect((await helper.getElementAttribute(btnSelector, 'class')).includes('disabled')).to.equal(status === 'Disabled');
});

Then(/^BankUser selects "(.*)" application to edit(| by double clicking), and checks the display of Edit screen$/, async function (appName, doubleClick) {
  const rowNum = await viewOimUserPage.findAppInAppTable(appName); 
  const attributes = await viewOimUserPage.getAppAttributesInGrid(rowNum);

  if (doubleClick === ' by double clicking') {
    await helper.doubleClick(viewOimUserPage.getSelectorOfRowInApplicationsGrid(rowNum));
  } else {
    await helper.click(viewOimUserPage.getSelectorOfRowInApplicationsGrid(rowNum));
    await helper.waitForTextInAttribute(viewOimUserPage.getSelectorOfRowInApplicationsGrid(rowNum), 'class', 'active', 2);
    await helper.click(viewOimUserPage.selectors.modifyUserApp.editAppBtn);
  }
  await helper.waitForDisplayed(viewOimUserPage.selectors.addOrEditAppDialog.applicationSelect);
  let optionIdx = await helper.getElementAttribute(viewOimUserPage.selectors.addOrEditAppDialog.applicationSelect, 'value');
  logger.info(`checking App name in the Edit dialog: '${appName}'`);
  expect((await helper.getElementText(`${viewOimUserPage.selectors.addOrEditAppDialog.applicationSelect} option[value="${optionIdx}"]`)).trim()).to.equal(appName);
  await helper.screenshot(`edit-app-${appName}-dialog`);

  if (['GCP', 'Institutional Insights', 'LM', 'Online Trade', 'SDP CTS', 'Transactive Global'].includes(appName)) {
    logger.info('Checking "No application attributes are required" text on Edit screen');
    expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.addOrEditAppDialog.noAttributeMessage)).to.equal(true);
    expect(await helper.getElementText(viewOimUserPage.selectors.addOrEditAppDialog.noAttributeMessage)).to.equal(viewOimUserPage.screenMessages.noAttributeMessage);
  } else if (appName === 'eMatching') {
    logger.info('Checking eMatching attribute');
    const attrs = attributes.split(':');
    expect(await helper.getElementText(viewOimUserPage.selectors.addOrEditAppDialog.userIDLabel)).to.equal('eMatching User ID');
    expect(await helper.getElementText(viewOimUserPage.selectors.addOrEditAppDialog.userIDValue)).to.equal(attrs[1]);
  } else if (appName === 'EsandaNet') {
    logger.info('Checking EsandaNet attributes');
    const attrs = attributes.split('|');
    expect(await helper.getElementText(viewOimUserPage.selectors.addOrEditAppDialog.userIDLabel)).to.equal('iSeries User ID');
    expect(await helper.getElementValue(viewOimUserPage.selectors.addOrEditAppDialog.userIDInput)).to.equal(attrs[0].split(':')[1].trim());
    expect(await helper.getElementText(viewOimUserPage.selectors.addOrEditAppDialog.userRegionLabel)).to.equal('User Region');
    expect(await helper.getElementValue(viewOimUserPage.selectors.addOrEditAppDialog.userRegionSelect)).to.equal(attrs[2].split(':')[1].trim());
    expect(await helper.getElementText(viewOimUserPage.selectors.addOrEditAppDialog.userTypeLabel)).to.equal('User Type');
    expect(await helper.getElementText(viewOimUserPage.selectors.addOrEditAppDialog.userTypeValue)).to.equal('Broker');
  } else if (appName === 'GCIS') {
    logger.info('Checking GCIS attribute');
    const attrs = attributes.split(':');
    expect(await helper.getElementText(viewOimUserPage.selectors.addOrEditAppDialog.userIDLabel)).to.equal('GCIS User ID');
    expect(await helper.getElementValue(viewOimUserPage.selectors.addOrEditAppDialog.userIDInput)).to.equal(attrs[1]);
  } else if (appName === 'Internet Enquiry Access') {
    logger.info('Checking Internet Enquiry Access attribute');
    const attrs = attributes.split(':');
    expect(await helper.getElementText(viewOimUserPage.selectors.addOrEditAppDialog.customerRegNoLabel)).to.equal('Customer Registration Number');
    expect(await helper.getElementValue(viewOimUserPage.selectors.addOrEditAppDialog.customerRegNoInput)).to.equal(attrs[1]);
  }
});

Then(/^BankUser edits application "(.*)" for the API created User$/, async function(appName) {
  const rowNum = await viewOimUserPage.findAppInAppTable(appName); 
  const origStatus = await viewOimUserPage.getAppStatusInGrid(rowNum);
  const origLastProvStatus = await viewOimUserPage.getAppLastProvStatusInGrid(rowNum);

  logger.info(`Select the apps ${appName} from the grid and clicks Edit button`);
  await helper.click(viewOimUserPage.getSelectorOfRowInApplicationsGrid(rowNum));
  await helper.pause(0.5);
  await helper.click(viewOimUserPage.selectors.modifyUserApp.editAppBtn);
  await helper.waitForTextInElement(viewOimUserPage.selectors.addOrEditAppDialog.title, 'Edit Application', 5);

  let editedApp = {};
  if (['GCP', 'Institutional Insights', 'LM', 'Online Trade', 'SDP CTS', 'Transactive Global'].includes(appName)) {
    logger.info('No attributes required, simply click on OK');
    editedApp[appName] = {};
  } else if (appName === 'eMatching') {
      const eMatchingUserId = await helper.getElementText(viewOimUserPage.selectors.addOrEditAppDialog.userIDValue);
      editedApp[appName] = eMatchingUserId.includes('system generated') ? {'eMatchingUserId': ''} : {'eMatchingUserId': eMatchingUserId};
    } else if (appName === 'EsandaNet') {
    const iSeriesUserID = faker.random.alphaNumeric(20).toUpperCase();
    const region = faker.random.number(4) + 2;
    logger.info(`Enter new iSeries User ID "${iSeriesUserID}" and User Region "${region}" for EsandaNet`);
    await helper.inputText(viewOimUserPage.selectors.addOrEditAppDialog.userIDInput, iSeriesUserID);
    await helper.selectByAttribute(viewOimUserPage.selectors.addOrEditAppDialog.userRegionSelect, 'value', region);
    editedApp[appName] = {'iSeriesUserID': iSeriesUserID, 'userRegion': region, 'type': 'B', 'attrEdited': true};
  } else if (appName === 'GCIS') {
    const GCISUserID = faker.random.alphaNumeric(15);
    logger.info(`Enter new GCIS User ID "${GCISUserID}" then click on OK`);
    await helper.inputText(viewOimUserPage.selectors.addOrEditAppDialog.userIDInput, GCISUserID);
    editedApp[appName] = {'GCISUserID': GCISUserID, 'attrEdited': true};
  } else if (appName === 'Internet Enquiry Access') {
    const customerRegNo = faker.random.number({min:100000, max: 999999});
    logger.info(`Enter new Customer Register Number "${customerRegNo}" then click on OK`);
    await helper.inputText(viewOimUserPage.selectors.addOrEditAppDialog.customerRegNoInput, customerRegNo);
    editedApp[appName] = {'customerRegNo': customerRegNo, 'attrEdited': true};
  }
  editedApp[appName]['status'] = origStatus;
  editedApp[appName]['lastProvStatus'] = origLastProvStatus;

  await helper.click(viewOimUserPage.selectors.addOrEditAppDialog.okButton);

  logger.info(`Check attributes have been updated in the applications grid for ${appName}`);
  await checkAppDataInGrid(editedApp);

  // save the edited app info into scenario context
  if (!this.appsAfterModifications) this.appsAfterModifications = JSON.parse(JSON.stringify(this.users[0].applications));
  for (let app of this.appsAfterModifications) {
    if (appName === Object.keys(app)[0]) {
      app = _.merge(app, editedApp);
      break;
    }
  }
});

Then(/^BanUser closes Add\/Edit App dialog$/, async function() {
  logger.info('Close Edit Application dialog');
  await helper.click(viewOimUserPage.selectors.addOrEditAppDialog.closeDialogButton);
}); 

Then(/^check \"No Record Found\" is displayed on empty applications grid$/, async function() {
  if (!(await viewOimUserPage.isTabActive(viewOimUserPage.selectors.applicationsTab))) {
    await helper.click(viewOimUserPage.selectors.applicationsTab);
    await helper.waitForDisplayed(viewOimUserPage.selectors.selectedApplicationsGrid);
  } 
  expect(await helper.getElementText(viewOimUserPage.selectors.appNoRecordFound)).to.equal(viewOimUserPage.screenMessages.msg007);
});

Then(/^check modified applications data are retained on modify applications screen$/, async function() {
  logger.info('Check the applications info in the applications grid after modifications')
  if (this.appsAfterModifications && this.appsAfterModifications.length > 0) {
    logger.info(`Modified applications data: ${JSON.stringify(this.appsAfterModifications)}`);
    for (let app of this.appsAfterModifications) await checkAppDataInGrid(app);
  }
});

Then(/^check changes to applications are discarded for the API created User$/, async function() {
  logger.info('Check modifications to apps are discarded by checking UI app entries against original applications data before modifications');
  // check the applications data against applications array in this.userData or this.users[0]
  let applications = this.users[0].applications;
  await helper.waitForDisplayed(viewOimUserPage.selectors.applicationsTab);
  if (! await viewOimUserPage.isTabActive(viewOimUserPage.selectors.applicationsTab)) {
    await helper.click(viewOimUserPage.selectors.applicationsTab);
  }
  logger.info(JSON.stringify(applications))
  for (let app of applications) 
    await checkAppDataInGrid(app);
})

Then(/^BankUser submits changes to User for the API created User$/, async function () {
  logger.info(`Bankuser clicks on Submit button`);
  await helper.click(viewOimUserPage.selectors.modifyUser.submitBtn);
  const expectedMsg = `This will submit User: ${this.users[0].firstName} ${this.users[0].surName} (${this.users[0].userId}) to be modified.`;
  await helper.waitForTextInElement(viewOimUserPage.selectors.modifyUser.modifyUserDialog.confirmationMessageLine1, expectedMsg);
  await helper.click(viewOimUserPage.selectors.yesBtnOnConfirmationPopup);

  const userData = this.users[0];
  const successMsg = (userData.status === 'New') ? `User ${userData.firstName} ${userData.surName} (${userData.userId.toUpperCase()}) has been submitted for approval.` :
  `User ${userData.firstName} ${userData.surName} (${userData.userId}) is now pending approval to be modified.`;

  await helper.waitForTextInElement(viewOimUserPage.selectors.successNotificationMsg, 'User', 15);
  expect(await helper.getElementText(viewOimUserPage.selectors.successNotificationMsg)).to.includes(successMsg);
  await helper.screenshot('submit-modified-apps');
  logger.info(successMsg);

  // Upon success submission of the User App modifications, update user workflow, version number, and application data.
  userData.workflow = (userData.status === 'New') ? 'Pending Approval - Create' : 'Pending Approval - Modified';
  userData.version = userData.version + 1;
  if (!userData['appsBeforeModify'] || (userData['appsBeforeModify'] && userData['appsBeforeModify'].length === 0)) {
    userData['appsBeforeModify'] = _.cloneDeep(userData.applications);
  }
  if (this.appsAfterModifications) userData.applications = this.appsAfterModifications;
  
  logger.info(JSON.stringify(this.users[0]));
});

Then(/^check Removed applications are no longer displayed on the applications list$/, async function() {
  if (!(await viewOimUserPage.isTabActive(viewOimUserPage.selectors.detailsTab))) {
    await helper.click(viewOimUserPage.selectors.detailsTab);
  }
  await helper.waitForDisplayed(viewOimUserPage.selectors.caasUserIdValue);
  const userId = await helper.getElementText(viewOimUserPage.selectors.userIdValue);

  if (!(await viewOimUserPage.isTabActive(viewOimUserPage.selectors.applicationsTab))) {
    await helper.click(viewOimUserPage.selectors.applicationsTab);
  }
  await helper.waitForDisplayed(viewOimUserPage.selectors.selectedApplicationsGrid);

  let userData;
  if (this.userData) {
    userData = this.userData;
  } else {
    for (let user of this.users) {
      if (user.userId === userId) {
        userData = user;
        break;
      }
    }
  }
  if (userData['removedApps'] && userData['removedApps'].length !== 0) {
    for (let app of userData['removedApps']) {
      logger.info(`check app ${app} is NOT present on the applications grid`);
      const count = await viewOimUserPage.getAppCountInApplicationsTable();
      let appNamesUI = [];
      for (let i = 1; i <= count; i++) {
        appNamesUI.push(await viewOimUserPage.getAppNameInGrid(i));
      }
      expect(appNamesUI.indexOf(app)).to.equal(-1);
    }
  }
});

Then(/^check the User application grid is empty$/, async function(){
  await helper.click(viewOimUserPage.selectors.applicationsTab);
  await helper.waitForDisplayed(viewOimUserPage.selectors.selectedApplicationsGrid);
  logger.info('Check "No Record Found" in Applications Grid');
  expect(await helper.getElementText(viewOimUserPage.selectors.appNoRecordFound)).to.equal(viewOimUserPage.screenMessages.msg007);

});

Then(/^check the application status in applications grid$/, async function() {
  await helper.click(viewOimUserPage.selectors.applicationsTab);
  await helper.waitForDisplayed(viewOimUserPage.selectors.selectedApplicationsGrid);

  const headers = await helper.getNestedElements(viewOimUserPage.selectors.applicationTableColumnHeaders);
  await expect(await headers[0].getText()).to.equal('Application Name');
  await expect(await headers[1].getText()).to.equal('Application Attributes');
  await expect(await headers[2].getText()).to.equal('Status');
  await expect(await headers[3].getText()).to.equal('Last Provisioning Status');
  logger.info('Application table headers OK');

  let applications;
  if (this.userData) {
    applications = this.userData.applications;
  }
  logger.info(JSON.stringify(applications));

  for (var i = 0; i < applications.length; i++) {
    const appName = Object.keys(applications[i])[0];
    const rowNum = await viewOimUserPage.findAppInAppTable(appName); 
    const attributesText = attrsToAttrText(applications[i]);
    const status = Object.values(applications[i])[0]['status'];
    const lastProvStatus = Object.values(applications[i])[0]['lastProvStatus'];

    logger.info(`Check Application ${appName} information is displayed correctly in Applications tab`);
    expect(await viewOimUserPage.getAppNameInGrid(rowNum)).to.equal(appName);
    expect(await viewOimUserPage.getAppStatusInGrid(rowNum)).to.equal(status);
    expect(await viewOimUserPage.getAppLastProvStatusInGrid(rowNum)).to.equal(lastProvStatus);

    if (appName === 'EsandaNet') {
      // EsandaNet, the display sequence of the attributes is not fixed
      const attrs = attributesText.split('|');
      for (let attr of attrs) {
        expect(await viewOimUserPage.getAppAttributesInGrid(rowNum)).to.includes(attr.trim());
      }
    } else if (appName === 'eMatching') {
      const text = (Object.values(applications[i])[0]['eMatchingUserId'] === '') ? 'eMatching User ID:[system generated]' : attributesText;
      expect(await viewOimUserPage.getAppAttributesInGrid(rowNum)).to.equal(text);
    } else {
      expect(await viewOimUserPage.getAppAttributesInGrid(rowNum)).to.equal(attributesText);
    }
  }

});


Then(/^check MSG085 error message is displayed$/, async function() {
  await helper.waitForDisplayed(viewOimUserPage.selectors.errNotificationMsg);
  expect(await helper.getElementText(viewOimUserPage.selectors.errNotificationMsg)).to.equal(viewOimUserPage.screenMessages.msg_085);
});
