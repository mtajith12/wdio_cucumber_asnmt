import { Given, When, Then } from 'cucumber';
import * as _ from 'lodash';
import * as faker from 'faker';
import { expect } from 'chai';
import { helper } from 'src/Helper';
import { getLogger } from 'log4js';
import { securityDeviceIssuancePage } from 'src/SecurityDeviceIssuancePage';
import { randomData } from 'src/RandomData'
const logger = getLogger();
logger.level = 'info';

const SPECIAL_CHARS = '. ,!@#$%/&*()_-+=?{}[]`:~\'"/|';

Then(/^BankUser closes Security Device Issuance page(| by clicking on Cancel button)$/, async function(cancel) {
  if (randomData.isNullOrEmpty(cancel)) {
    logger.info('Close Security Device Issuance page');
    await helper.click(securityDeviceIssuancePage.selectors.close);
  } else {
    logger.info('Close Security Device Issuance page by clicking on Cancel button');
    await helper.click(securityDeviceIssuancePage.selectors.cancel);
  }
  await helper.waitForDisplayed(securityDeviceIssuancePage.selectors.confirmDialog.confirmMessage);
  expect(await helper.getElementText(securityDeviceIssuancePage.selectors.confirmDialog.confirmMessage)).to.equal(securityDeviceIssuancePage.screenMessages.cancelIssuanceConfirmMsg);
  await helper.click(securityDeviceIssuancePage.selectors.confirmDialog.confirmButton);
});

Then(/^BankUser enters Token Serial Number "(.*)"(| and clicks on Submit button)$/, async function(serialNumber, proceed) {
  logger.info(`Enter Serial number ${serialNumber}`);
  await helper.inputText(securityDeviceIssuancePage.selectors.serialNumberInput, serialNumber);
  if (proceed === ' and clicks on Submit button') {
    logger.info('Submit token issuance');
    await helper.click(securityDeviceIssuancePage.selectors.submit);
    // save the serial number to scenario data this.securityDeviceIssuanceEntry
    this.securityDeviceIssuanceEntry['serialNumber'] = serialNumber;
  }

  // save Serial Number into security device data in this.userData or this.users 
  if (this.userData) {
    for (let device of this.userData['securityDevices']) {
      if (device['type'] === await helper.getElementText(securityDeviceIssuancePage.selectors.deviceTypeValue)) {
        device['serialNumber'] = serialNumber;
        break;
      }
    }
  }
  if (this.users) {
    for (let user of this.users) {
      if (user.userId.toUpperCase() === await helper.getElementText(securityDeviceIssuancePage.selectors.userIdValue)) {
        for (let device of user['securityDevices']) {
          if (device['type'] === await helper.getElementText(securityDeviceIssuancePage.selectors.deviceTypeValue)) {
            device['serialNumber'] = serialNumber;
            break;
          }
        }
        break;
      }
    }
  }
});

/*
 * For the E2E token issuance tests, SSAS stub is at the downstream. 
 *   SUC0xxxxxx: SSAS stub will return token 270 device type on doDigiPassGetApplicationInfo call, and return Success on Update Token.
 *   SUC6xxxxxx: SSAS stub will return token 276 device type on doDigiPassGetApplicationInfo call, and return Success on Update Token.
 *   FAILxxxxxx: SSAS stub will return 500 error on doDigiPassGetApplicationInfo call.
 *   NOTFOUNDxx: SSAS stub will return 200 with "Not Found" on doDigiPassGetApplicationInfo call.
 */
Then(/^BankUser enters Token Serial Number with "(SUC0|SUC6|FAIL|NOTFOUND)" prefix then proceeds to submit the issuance$/, async function(prefix) {
  const serialNumber = (prefix.includes('SUC')) ? prefix + faker.random.alphaNumeric(6) : (prefix === 'FAIL') ? 'FAIL' + faker.random.alphaNumeric(6) : 'NOTFOUND' + faker.random.alphaNumeric(2);
  logger.info(`Enter Serial number ${serialNumber}`);
  await helper.inputText(securityDeviceIssuancePage.selectors.serialNumberInput, serialNumber);
  
  logger.info('Submit token issuance');
  await helper.click(securityDeviceIssuancePage.selectors.submit);

  logger.info('Confirm submission of issuance');
  await helper.waitForDisplayed(securityDeviceIssuancePage.selectors.confirmDialog.confirmMessage);
  await helper.click(securityDeviceIssuancePage.selectors.confirmDialog.confirmButton);

  // save the serial number to scenario data
  this.securityDeviceIssuanceEntry['serialNumber'] = serialNumber;
  logger.info(`this.securityDeviceIssuanceEntry: ${JSON.stringify(this.securityDeviceIssuanceEntry)}`);
});

Then(/^BankUser enters Token Serial Number with a random special character and clicks on Submit button$/, async function() {
  const serialNumber = '123456789' + faker.random.arrayElement(SPECIAL_CHARS);
  logger.info(`Enter Serial Number: ${serialNumber}`);
});

Then(/^BankUser enters the used Serial Number then proceeds to submit the issuance$/, async function() {
  const serialNumber = this.usedSerialNumber['serialNumber'];
  logger.info(`Enter the Serial number that has been assigned to another User: ${serialNumber}`);
  await helper.inputText(securityDeviceIssuancePage.selectors.serialNumberInput, serialNumber);

  logger.info('Submit token issuance');
  await helper.click(securityDeviceIssuancePage.selectors.submit);

  logger.info('Confirm submission of issuance');
  await helper.waitForDisplayed(securityDeviceIssuancePage.selectors.confirmDialog.confirmMessage);
  await helper.click(securityDeviceIssuancePage.selectors.confirmDialog.confirmButton);
});

Then(/^check submit Security Device Issuance confirmation message$/, async function() {
  await helper.waitForDisplayed(securityDeviceIssuancePage.selectors.confirmDialog.confirmMessage);
  const msgLines = await securityDeviceIssuancePage.getIssuanceConfirmMessage();
  console.log(JSON.stringify(this.securityDeviceIssuanceEntry));
  expect(msgLines[0]).to.equal(securityDeviceIssuancePage.screenMessages.submitIssuanceConfirmMsgLine1);
  expect(msgLines[1]).to.equal(securityDeviceIssuancePage.screenMessages.submitIssuanceConfirmMsgLine2.replace('userId', this.securityDeviceIssuanceEntry.userId));
  expect(msgLines[2]).to.equal(securityDeviceIssuancePage.screenMessages.submitIssuanceConfirmMsgLine3.replace('type', this.securityDeviceIssuanceEntry.deviceType === 'Token Digipass 276' ? 'Token Digipass 276 (China Compliant)' : 'Token Digipass 270'));
  expect(msgLines[3]).to.equal(securityDeviceIssuancePage.screenMessages.submitIssuanceConfirmMsgLine4.replace('serialNumber', this.securityDeviceIssuanceEntry.serialNumber));
  expect(msgLines[4]).to.equal(securityDeviceIssuancePage.screenMessages.submitIssuanceConfirmMsgLine5);
  await helper.screenshot('submitSecurityDeviceIssuanceConfirmMsg');
});

Then(/^BankUser (confirms|cancels) submitting Security Device Issuance$/, async function(action) {
  if (action === 'confirms') {
    logger.info('Confirm submission of security device issuance');
    await helper.click(securityDeviceIssuancePage.selectors.confirmDialog.confirmButton);
  }
  else {
    logger.info('Cancel submission of security device issuance');
    await helper.click(securityDeviceIssuancePage.selectors.confirmDialog.cancelButton);
  }
});

Then(/^check entered Serial Number is retained$/, async function() {
  expect((await helper.getElementValue(securityDeviceIssuancePage.selectors.serialNumberInput))).to.equal(this.securityDeviceIssuanceEntry.serialNumber);
});

Then(/^check Security Device Issuance screen display$/, async function() {
  await helper.waitForDisplayed(securityDeviceIssuancePage.selectors.userIdValue);
  logger.info('check the format of Security Device Issuance screen display');
  expect(await helper.isElementPresent(securityDeviceIssuancePage.selectors.cancel));
  expect(await helper.isElementPresent(securityDeviceIssuancePage.selectors.submit));

  const sectionHeaders = await securityDeviceIssuancePage.getDisplayedDataSectionHeadings();
  expect(sectionHeaders.indexOf('User Details') > -1).to.equal(true);
  expect(sectionHeaders.indexOf('Security Device Details') > -1).to.equal(true);

  expect(await helper.getElementText(securityDeviceIssuancePage.selectors.userIdLabel)).to.equal('User ID');
  expect(await helper.getElementText(securityDeviceIssuancePage.selectors.caasUserIdLabel)).to.equal('CAAS User ID');
  expect(await helper.getElementText(securityDeviceIssuancePage.selectors.fullNameLabel)).to.equal('Full Name');
  expect(await helper.getElementText(securityDeviceIssuancePage.selectors.caasOrgIdLabel)).to.equal('CAAS Org ID');
  expect(await helper.getElementText(securityDeviceIssuancePage.selectors.caasOrgNameLabel)).to.equal('CAAS Org Name');
  expect(await helper.getElementText(securityDeviceIssuancePage.selectors.deviceTypeLabel)).to.equal('Device Type');
  expect(await helper.getElementText(securityDeviceIssuancePage.selectors.serialNumberLabel)).to.equal('Serial Number');
  expect(await helper.isElementDisabled(securityDeviceIssuancePage.selectors.serialNumberInput)).to.equal(false);
});

Then(/^check the details in Security Device Issuance page against the search result entry$/, async function() {
  await helper.waitForDisplayed(securityDeviceIssuancePage.selectors.userIdValue);
  const details = this.securityDeviceIssuanceEntry;
  logger.info('check the displayed details in Security Device Issuance page against the search result entry')
  expect(await helper.getElementText(securityDeviceIssuancePage.selectors.userIdValue)).to.equal(details.userId);
  expect(await helper.getElementText(securityDeviceIssuancePage.selectors.caasUserIdValue)).to.equal(details.userId);
  expect(await helper.getElementText(securityDeviceIssuancePage.selectors.fullNameValue)).to.equal(`${details.firstName} ${details.lastName}`);
  expect(await helper.getElementText(securityDeviceIssuancePage.selectors.caasOrgIdValue)).to.equal(details.caasOrgId);
  expect(await helper.getElementText(securityDeviceIssuancePage.selectors.caasOrgNameValue)).to.equal(details.caasOrgFullName);
  expect(await helper.getElementText(securityDeviceIssuancePage.selectors.deviceTypeValue)).to.equal(details.deviceType);
});

Then(/^check Serial Number (mandatory field|length|data validation) error message is displayed$/, async function(errType) {
  if (errType === 'mandatory field') {
    expect(await helper.getElementText(securityDeviceIssuancePage.selectors.serialNumberDataErrMsg)).to.equal(securityDeviceIssuancePage.screenMessages.serialNumberMandotaryMsg);
  } else if (errType === 'length') {
    expect(await helper.getElementText(securityDeviceIssuancePage.selectors.serialNumberDataErrMsg)).to.equal(securityDeviceIssuancePage.screenMessages.MSG082);
  } else {
    expect(await helper.getElementText(securityDeviceIssuancePage.selectors.serialNumberDataErrMsg)).to.equal(securityDeviceIssuancePage.screenMessages.serialNumberDataValErrMsg);
  }
});

Then(/^check Serial Number field takes 10 digits as a maximum$/, async function() {
  logger.info('Check Serial Number field takes 10 digits as a maximum');
  expect((await helper.getElementValue(securityDeviceIssuancePage.selectors.serialNumberInput)).length).to.equal(securityDeviceIssuancePage.serialNumberLength);
});

Then(/^check entered Serial Number is trimmed of leading \/ trailing spaces$/, async function() {
  logger.info('Check leading/trailing spaces in the entered serial number is trimmed');
  expect(await helper.getElementValue(securityDeviceIssuancePage.selectors.serialNumberInput)).to.equal(this.securityDeviceIssuanceEntry['serialNumber'].trim());
});

Then(/^check token issuance success message is displayed$/, { wrapperOptions: { retry: 1 } }, async function() {
  const successMsg = securityDeviceIssuancePage.screenMessages.MSG045.replace('<Serial Number>', this.securityDeviceIssuanceEntry['serialNumber']).replace('<User ID>', this.securityDeviceIssuanceEntry['userId']);
  logger.info(`Check token issuance success message is displayed: ${successMsg}`);
  await helper.waitForTextInElement(securityDeviceIssuancePage.selectors.successNotification, successMsg, 10);
  this.usedSerialNumber = {
    serialNumber: this.securityDeviceIssuanceEntry['serialNumber'],
    userId: this.securityDeviceIssuanceEntry['userId']
  };
  logger.info(`this.usedSerialNumber: ${JSON.stringify(this.usedSerialNumber)}`);
});

Then(/^check token issuance error message "(MSG042|MSG043|MSG044)" is displayed$/, { wrapperOptions: { retry: 1 } }, async function(msg) {
  let msgText = (msg === 'MSG042') ? securityDeviceIssuancePage.screenMessages.MSG042 : (msg === 'MSG044') ? securityDeviceIssuancePage.screenMessages.MSG043 : securityDeviceIssuancePage.screenMessages.MSG044.replace('<User ID>', this.usedSerialNumber['userId']);
  logger.info(`Check error message is displayed: ${msgText}`);
  await helper.waitForTextInElement(securityDeviceIssuancePage.selectors.errNotification, msgText, 10);
});

Then(/^check token issuance error message with text "(.*)" is displayed$/, { wrapperOptions: { retry: 1 } }, async function(msg) {
  logger.info(`Check error message is displayed: ${msg}`);
  await helper.waitForTextInElement(securityDeviceIssuancePage.selectors.errNotification, msg, 10);
});
