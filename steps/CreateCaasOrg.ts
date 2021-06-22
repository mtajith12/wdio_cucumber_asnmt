import { Given, When, Then } from 'cucumber';
import * as _ from 'lodash';
import * as faker from 'faker';
import { newOnboardingPage } from 'src/NewOnboardingPage';
import { createCaasOrgPage } from 'src/CreateCaasOrgPage';
import { expect } from 'chai';
import { helper } from 'src/Helper';
import { getLogger } from 'log4js';
import { newUserPage } from 'pages/NewUserPage';
import { MenuBar } from 'src/MenuBarPage';
import { duplicateWarningPage } from 'pages/DuplicateWarningPage';
const logger = getLogger();
logger.level = 'info';

const ALLOWED_SPECIAL_CHARS_ORG_NAME = '. ,!@#$%/&*()_-+=?{}[]`:~\'"/|';
const ALLOWED_SPECIAL_CHARS_ORG_ID = '_-.@()&';

async function createCaasOrg(data, randomise, numOfApps) {
  const orgData = await createCaasOrgPage.fillCaasOrgForm(data, randomise);
  if (numOfApps > 0) {
    var appsAvailable = Array.from(createCaasOrgPage.applications);
    for (var i = 0; i < numOfApps; i++) {
      // randomly pick one app from the list of applications and add it to the Org
      const idx = Math.floor(Math.random() * appsAvailable.length);
      var app = appsAvailable[idx];
      await helper.click(createCaasOrgPage.selectors.addApplicationBtn);
      await createCaasOrgPage.addApplication(appsAvailable, app);
      orgData.applications.push(app);
      // remove the selected app from the selectable apps list
      appsAvailable.splice(idx, 1);
    }
  }
  orgData.applications.sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase())
  });

  await helper.click(createCaasOrgPage.selectors.submit);
  return orgData;
}

Then(/^BankUser navigates to "(New CAAS Org|New User)" page$/, async function(name) {
  if (name === 'New CAAS Org') {
    await helper.click(newOnboardingPage.selectors.newCaasOrg);
    await helper.waitForDisplayed(createCaasOrgPage.selectors.orgId);
  } else if (name === 'New User') {
    await helper.click(newOnboardingPage.selectors.newUser);
    await helper.waitForDisplayed(newUserPage.selectors.userIdInput);
  }
  logger.info(`bankuser navigates to "${name}" page`);
});

When(/^BankUser fill in CAAS Org data on the create Org page$/, async function() {
  this.orgData = await createCaasOrgPage.fillCaasOrgForm({}, true);
});

When(/^BankUser fill in Org data with id "(.*)", name "(.*)" and bin "(.*)"$/, async function(orgId, orgName, bin) {
  const orgData = {};
  orgData['orgId'] = faker.random.alphaNumeric(16) + orgId;
  orgData['orgName'] = faker.random.alphaNumeric(16) + orgName;
  orgData['bin'] = faker.random.alphaNumeric(16) + bin;
  this.orgData = await createCaasOrgPage.fillCaasOrgForm(orgData, false);
});


When(/^BankUser fill in exact Org data with id "(.*)", name "(.*)" and bin "(.*)"$/, async function(orgId, orgName, bin) {
  const orgData = {};
  orgData['orgId'] = orgId;
  orgData['orgName'] = orgName;
  orgData['bin'] = bin;
  this.orgData = await createCaasOrgPage.fillCaasOrgForm(orgData, false);
});

When(/^BankUser fill in Org data with id, name and bin longer than allowed max lengths$/, async function() {
  const orgData = {};
  orgData['orgId'] = faker.random.alphaNumeric(createCaasOrgPage.fieldLengths.orgIdMaxLength + 1);
  orgData['orgName'] = faker.random.alphaNumeric(createCaasOrgPage.fieldLengths.orgNameMaxLength + 1);
  orgData['bin'] = faker.random.alphaNumeric(createCaasOrgPage.fieldLengths.binMaxLength + 1);
  this.orgData = await createCaasOrgPage.fillCaasOrgForm(orgData, false);
});

When(/^BankUser fills in Org data with (same|similar) (name|bin) as the "(\d+)(?:st|nd|rd|th)" API created org$/, async function(sameSimilar, nameBin, n){
  const orgData = {};
  const orgName = this.orgs[n-1].orgName;
  const today = new Date();
  const timeStamp = `${today.getFullYear()}${today.getMonth()}${today.getDay()}${today.getHours()}${today.getMinutes()}${today.getSeconds()}`;
  orgData['orgId'] = faker.random.alphaNumeric(16) + timeStamp;

  if (sameSimilar === 'same' && nameBin === 'name'){
    orgData['orgName'] = this.orgs[n-1].orgName;
    orgData['bin'] = faker.random.alphaNumeric(16) + timeStamp;
  } else if (sameSimilar === 'similar' && nameBin === 'name'){
    orgData['orgName'] = orgName.substring(0,orgName.length-1);
    orgData['bin'] = faker.random.alphaNumeric(16) + timeStamp;
  } else if (sameSimilar === 'same' && nameBin === 'bin'){
    orgData['orgName'] = faker.random.alphaNumeric(16) + timeStamp;
    orgData['bin'] = this.orgs[n-1].bin;
  }

  logger.info(orgData);
  this.orgData = await createCaasOrgPage.fillCaasOrgForm(orgData, false);
});

Then(/^BankUser clicks on submit button to create Org$/, async function() {
  logger.info('User clicks on submit button');
  await helper.click(createCaasOrgPage.selectors.submit);
});

Then(/^verify the similar caas org record message$/, async function(){
  logger.info('Verify the similar CAAS ORG record');
  await helper.waitForDisplayed(duplicateWarningPage.selectors.dialog.confirmationMsg1);
  expect (await helper.getElementText(duplicateWarningPage.selectors.dialog.confirmationMsg1)).to.equal(duplicateWarningPage.screenMessages.MSG_037);
});

Then(/^click "(Yes|No)" on the similar caas org dialog$/, async function(yesNo){
  logger.info(`Click on ${yesNo} button in the duplicate user warning page`);
  if (yesNo === 'Yes') {
    await helper.click(duplicateWarningPage.selectors.dialog.confirm);
  } else {
    await helper.click(duplicateWarningPage.selectors.dialog.cancel);
  }
});

Then(/^BankUser cancel creating Org (before|after) entering the org data$/, async function(beforeAfter) {
  logger.info('User clicks on cancel button');
  await helper.click(createCaasOrgPage.selectors.cancel);
  if (beforeAfter === 'after') {
    // check confirmation dialog pops up
    await helper.waitForDisplayed(createCaasOrgPage.selectors.confirmationDialog);
    expect((await helper.getElementText(createCaasOrgPage.selectors.confirmationMsg)).trim()).to.equal(MenuBar.msg_051);
    logger.info(`Confirmation dialog pops up with message: ${MenuBar.msg_051}`);
  } else {
    // this case, cobra will just return to new onboarding page
    await helper.waitForDisplayed(newOnboardingPage.selectors.onBoardingPage);
  }
});

Then(/^BankUser clicks on (cancel|confirm) button in confirmation dialog$/, async function(button) {
  if (button === 'cancel') {
    logger.info('Dismiss confirmation dialog');
    await helper.click(createCaasOrgPage.selectors.cancelButton);
  } else {
    logger.info('Click on confirm button on confirmation dialog');
    await helper.click(createCaasOrgPage.selectors.confirmButton);
  }
});
      
When(/^BankUser onboards new CAAS Org with (.*|all) applications$/, async function(numOfApps) {
  let n;
  if (numOfApps.toLowerCase() === 'all') {
    n = createCaasOrgPage.applications.length;
  } else {
    n = parseInt(numOfApps);
  }
  this.orgData = await createCaasOrg({}, true, n);
  logger.info(`CAAS Org created, orgId: ${this.orgData.orgId}, orgName: ${this.orgData.orgName}, bin: ${this.orgData.bin}`);
});

When(/^BankUser onboards new CAAS Org with leading\/trailing spaces in orgData, with a success$/, async function() {
  const orgData = createCaasOrgPage.randomiseOrgData({});
  orgData.orgId = new Array(3).join(' ') + orgData.orgId + new Array(4).join(' ');
  orgData.orgName = new Array(4).join(' ') + orgData.orgName + new Array(2).join(' ');
  orgData.bin = new Array(2).join(' ') + orgData.bin + new Array(5).join(' ');

  logger.info('Create org with data that have leading, trailing and in-the-middle whitespaces in them');
  await createCaasOrgPage.fillCaasOrgForm(orgData, false);
  await helper.click(createCaasOrgPage.selectors.submit);
  await helper.waitForDisplayed(createCaasOrgPage.selectors.successNotificationMsg);

  orgData.orgId = orgData.orgId.toString().trim();
  orgData.orgName = orgData.orgName.toString().trim();
  orgData.bin = orgData.bin.toString().trim();
  const successMsg = `CAAS Org ${orgData.orgName} (${orgData.orgId}) has been created and approved.`;
  expect(await createCaasOrgPage.getCreateOrgSuccessText()).to.equal(successMsg);
  logger.info(successMsg);

  await helper.waitForDisplayed(newOnboardingPage.selectors.newCaasOrg);
  this.orgData = orgData;
});

When(/^BankUser onboards new CAAS Org with allowed special characters in orgData$/, async function() {
  let orgData = {};
  orgData['orgId'] = faker.random.alphaNumeric(16) + ALLOWED_SPECIAL_CHARS_ORG_ID;
  orgData['orgName'] = faker.random.alphaNumeric(16) + ALLOWED_SPECIAL_CHARS_ORG_NAME;
  orgData['bin'] = faker.random.alphaNumeric(16);
  logger.info(`Creating org with allowed special characters: ${JSON.stringify(orgData, null, 2)}`);

  this.orgData = await createCaasOrg(orgData, false, 0);
  // Click the Yes button when warned about similar org
  await helper.click(createCaasOrgPage.selectors.confirmButton);
});

Then(/^BankUser onboards new CAAS Org with same ID$/, async function() {
  let orgData2 = {};
  orgData2['orgId'] = this.orgData.orgId;
  orgData2['orgName'] = faker.random.alphaNumeric(16);
  orgData2['bin'] = faker.random.alphaNumeric(16);

  await createCaasOrgPage.fillCaasOrgForm(orgData2, false);
  await helper.click(createCaasOrgPage.selectors.submit);
});

Then(/^BankUser clicks on (Add|Remove) applications button$/, async function(action) {
  if (action === 'Add') {
    await helper.click(createCaasOrgPage.selectors.addApplicationBtn);
  } else {
    await helper.click(createCaasOrgPage.selectors.removeApplicationBtn);
  }
});

Then(/^BankUser add application "(.*)"$/, async function(appName) {
  await createCaasOrgPage.addApplication(createCaasOrgPage.applications, appName);
});

Then(/^BankUser add all applications from Select Applications dialog$/, async function() {
  await helper.click(createCaasOrgPage.selectors.addApplicationBtn);

  const apps = await createCaasOrgPage.getAppsInSelectAppsGrid();

  for (const elem of apps) {
    // always operate on the first item in the "Select Applications" dialog
    const selector1 = `${createCaasOrgPage.selectors.appsGridItem}:nth-child(1)`
    const name = await helper.getElementText(selector1);
    logger.info(`Add application "${name}" from dialog`);
    await helper.click(selector1);
    await helper.waitForTextInAttribute(selector1, 'class', 'active', 2)
    await helper.click(createCaasOrgPage.selectors.okBtnInDialog);

    logger.info(`Check application "${name}" is now displayed in "Selected Applications" grid.`);
    const selector2 = await createCaasOrgPage.getSelectorOfNthItemInSelectedGrid(createCaasOrgPage.applications.indexOf(name) + 1);
    await helper.waitForTextInElement(selector2, name, 3);

    if (apps.indexOf(elem) < apps.length - 1) {
      await helper.click(createCaasOrgPage.selectors.addApplicationBtn);
    }
  }
});

Then(/^BankUser remove the (\d+)(?:st|nd|rd|th) application$/, async function(n) {
  await createCaasOrgPage.removeApplicationOnNthRow(n);
});

Then(/^BankUser dismiss the notification dialog$/, async function() {
  await helper.click(createCaasOrgPage.selectors.okBtnInNotificationDialog);
  await helper.waitForElementToDisAppear(createCaasOrgPage.selectors.notificationMsg, 2);
})

Then(/^BankUser dismiss the Select Applications dialog$/, async function() {
  await helper.click(createCaasOrgPage.selectors.cancelBtnInDialog);
  await helper.waitForElementToDisAppear(createCaasOrgPage.selectors.cancelBtnInDialog, 2);
})

Then(/^check CAAS Org has been created successfully$/, async function() {
  const successMsg = `CAAS Org ${this.orgData.orgName} (${this.orgData.orgId}) has been created and approved.`;
  await helper.waitForTextInElement(createCaasOrgPage.selectors.successNotificationMsg, successMsg, 10)
  logger.info(successMsg);

  await helper.waitForDisplayed(newOnboardingPage.selectors.newCaasOrg);
  await helper.screenshot(`caasOrgCreated-${this.orgData.orgId}`);
});

Then(/^check entered org data are retained$/, async function() {
  expect((await helper.getElementAttribute(createCaasOrgPage.selectors.orgId, 'value'))).to.equal(this.orgData.orgId);
  expect((await helper.getElementAttribute(createCaasOrgPage.selectors.orgName, 'value'))).to.equal(this.orgData.orgName);
  expect((await helper.getElementAttribute(createCaasOrgPage.selectors.bin, 'value'))).to.equal(this.orgData.bin);
  logger.info('The entered org data are retained');
});

Then(/^check Org ID already exists error notification$/, async function() {
  logger.info('Check Caas Org ID already exists error notification');
  await helper.waitForDisplayed(createCaasOrgPage.selectors.errNotificationHeader);
  expect((await helper.getElementText(createCaasOrgPage.selectors.errNotificationHeader)).trim()).to.equal('Error');
  await helper.waitForDisplayed(createCaasOrgPage.selectors.errNotificationMsg);
  logger.info(await helper.getElementText(createCaasOrgPage.selectors.errNotificationMsg));
  expect((await helper.getElementText(createCaasOrgPage.selectors.errNotificationMsg)).trim()).to.equal(createCaasOrgPage.screenMessages.orgIDAlreadyExistsMsg);
  await helper.click(createCaasOrgPage.selectors.closeNotification);
  logger.info('Check Caas Org ID field error message');
  expect((await helper.getElementText(createCaasOrgPage.selectors.orgIdDataErrMsg)).trim()).to.equal(createCaasOrgPage.screenMessages.orgIDAlreadyExistsMsg);

  await helper.screenshot('orgAlreadyExistError');
});

Then(/^check "(orgId|orgName|bin)" (data validation|mandatory field) error on Create Org screen$/, async function(field, type) {
    if (field === 'orgId') {
      const orgIdMsg = (await helper.getElementText(createCaasOrgPage.selectors.orgIdDataErrMsg)).trim();
      if (type === 'data validation') {
        expect(orgIdMsg).to.equal(createCaasOrgPage.screenMessages.orgIdErrMsg);
      } else {
        expect(orgIdMsg).to.equal(createCaasOrgPage.screenMessages.orgIdMandatoryMsg);
      }
    } else if (field === 'orgName') {
      const orgNameMsg = (await helper.getElementText(createCaasOrgPage.selectors.orgNameDataErrMsg)).trim();
      if (type === 'data validation') {
        expect(orgNameMsg).to.equal(createCaasOrgPage.screenMessages.orgNameErrMsg);
      } else {
        expect(orgNameMsg).to.equal(createCaasOrgPage.screenMessages.orgNameMandatoryMsg);
      }
    } else {
      const binMsg = (await helper.getElementText(createCaasOrgPage.selectors.binDataErrMsg)).trim();
      if (type === 'data validation') {
        expect(binMsg).to.equal(createCaasOrgPage.screenMessages.binErrMsg);
      } else {
        expect(binMsg).to.equal(createCaasOrgPage.screenMessages.binMandatoryMsg);
      }
    }
    await helper.screenshot('createOrgDataValidationError');
});

Then(/^check "(orgId|orgName|bin)" field has been truncated to the max allowed length$/, async function(field) {
  if (field === 'orgId') {
    expect((await helper.getElementAttribute(createCaasOrgPage.selectors.orgId, 'value'))).to.equal(this.orgData.orgId.substring(0, createCaasOrgPage.fieldLengths.orgIdMaxLength));
  } else if (field === 'orgName') {
    expect((await helper.getElementAttribute(createCaasOrgPage.selectors.orgName, 'value'))).to.equal(this.orgData.orgName.substring(0, createCaasOrgPage.fieldLengths.orgNameMaxLength));
  } else {
    expect((await helper.getElementAttribute(createCaasOrgPage.selectors.bin, 'value'))).to.equal(this.orgData.bin.substring(0, createCaasOrgPage.fieldLengths.binMaxLength));
  }
  await helper.screenshot('createOrgFieldsTruncatedToMaxLength');
});

Then(/^check Applications grid displayed - No applications assigned$/, async function() {
  expect(await helper.getElementText(createCaasOrgPage.selectors.applicationsGridHeading)).to.equal('Applications');
  logger.info('Check "No Record Found" message displayed in the empty grid');
  expect(await helper.getElementText(createCaasOrgPage.selectors.noResultMsg)).to.equal(createCaasOrgPage.screenMessages.msg007);
  await helper.screenshot('noAppAssignedInGrid');
});

Then(/^check (Add|Remove) button is (Enabled|Disabled)$/, async function(button, status) {
  logger.info(`Check ${button} button is ${status}`);
  const selector = (button === 'Add') ? createCaasOrgPage.selectors.addApplicationBtn : createCaasOrgPage.selectors.removeApplicationBtn;
  if (status === 'Enabled') {
    expect(await helper.ifElementEnabled(selector)).to.equal(true);
  } else {
    expect((await helper.getElementAttribute(selector, 'class')).includes('disabled')).to.equal(true);
  }
  await helper.screenshot(`${button}Is${status}OnCreateOrgPage`);
});

Then(/^check "(.*)" is displayed on the (\d+)(?:st|nd|rd|th) row in the (Selected|Select) Applications grid$/, async function(appName, n, gridName) {
  logger.info(`Check ${appName} is displayed on No.${n} row in the ${gridName} applications grid`);
  if (gridName === 'Selected') {
    expect(await helper.getElementText(await createCaasOrgPage.getSelectorOfNthItemInSelectedGrid(n))).to.equal(appName);
  } else {
    expect(await helper.getElementText(await createCaasOrgPage.getSelectorOfNthItemInSelectGrid(n))).to.equal(appName);
  }
  await helper.screenshot(`${appName}DisplayedIn${gridName}Grid`);
});

Then(/^check "(.*)" is NOT displayed in Select Applications dialog$/, async function(appName) {
    const apps = await createCaasOrgPage.getAppsInSelectAppsGrid();
    logger.info(`Check ${appName} is not listed in the Select Applications dialog`);
    await apps.forEach(async (elem) => {
      expect((await elem.getText()) === appName).to.equal(false);
    });
  });
  
Then(/^check all applications are displayed in (Selected|Select) Applications grid in alphabetic order$/, async function(gridName) {
  const gridHeader = (gridName === 'Selected') ? createCaasOrgPage.selectors.selectedAppsGridHeader : createCaasOrgPage.selectors.selectAppsDialogHeader;
  const gridHeaderTxt = (gridName === 'Selected') ? 'Application Name' : 'Select Applications';
  logger.info(`Check ${gridName} grid header: ${gridHeaderTxt}`);
  expect(await helper.getElementText(gridHeader)).to.equal(gridHeaderTxt);

  logger.info('Check number of applications displayed in the grid');
  const apps = (gridName === 'Selected') ? (await createCaasOrgPage.getAppsInSelectedAppsGrid()) : (await createCaasOrgPage.getAppsInSelectAppsGrid());
  expect(apps.length).to.equal(createCaasOrgPage.applications.length);

  logger.info('Check applications are displayed in expected alphabetic order and text');
  await apps.forEach(async (elem) => {
      const idx = apps.indexOf(elem);
      expect(await elem.getText()).to.equal(createCaasOrgPage.applications[idx]);
  })
  await helper.screenshot(`appsDisplayedIn${gridName}Grid`);
});

Then(/^check notification message (.*) is displayed$/, async function(msg) {
  let msgText;
  if (msg === 'MSG036') {
    msgText = createCaasOrgPage.screenMessages.msg036;
  }
  expect((await helper.getElementText(createCaasOrgPage.selectors.notificationMsg)).trim()).to.equal(msgText);
  await helper.screenshot(`${msg}InCreateOrgPage`);
});

Then(/^check error message for existing CAAS Org in OIM$/, async function (){
  const msg003 = 'Org ID already exists in CAAS. Please choose a different Org ID.';
  logger.info(`Check that error message appears for existing OIM Org`);
  await helper.waitForTextInElement(createCaasOrgPage.selectors.errNotificationMsg,'Org ID', 15);
  expect((await helper.getElementText(createCaasOrgPage.selectors.errNotificationMsg)).trim()).to.equal(msg003);
});