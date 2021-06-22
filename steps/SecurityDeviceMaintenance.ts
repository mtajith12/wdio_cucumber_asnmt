import { Given, When, Then } from 'cucumber';
import * as _ from 'lodash';
import { viewOimUserPage } from 'src/ViewOimUserPage';
import { expect } from 'chai';
import { helper } from 'src/Helper';
import { getLogger } from 'log4js';
const logger = getLogger();
logger.level = 'info';

Then(/^check "(Unblock|Reset|Disable)" button is (enabled|disabled) on Security Devices tab$/, async function(button, status) {
    let elem;
    await helper.waitForDisplayed(viewOimUserPage.selectors.unblockBtn);
    logger.info(`Check that ${button} is ${status} on Security Devices Tab`)
    switch(button) {
      case 'Unblock':
        elem = viewOimUserPage.selectors.unblockBtn;
        break;
      case 'Reset':
        elem = viewOimUserPage.selectors.resetBtn;
        break;
      case 'Disable':
        elem = viewOimUserPage.selectors.disableBtn
        break;
    }
    
    expect(await helper.isElementDisabled(elem)).to.equal(status === 'disabled');
    await helper.pause(1.5);
  });

  Then(/^BankUser selects "(.*)" with Status "(.*)" and Description "(.*)" in Security Devices grid$/, async function(device, status, description){
    await helper.waitForDisplayed(viewOimUserPage.selectors.selectedSecurityDevicesGrid);

    logger.info('Selecting device: ' + device);
    let n = await viewOimUserPage.findSecurityDeviceInGridWithStatusAndDescription(device, status, description);
    await viewOimUserPage.selectSecurityDeviceInGridByIndex(n);
    //save selected security device into context variable
    this.selectedSecurityDevice = {
      deviceType: await viewOimUserPage.getSecurityDeviceNameOnRow(n),
      serialNumber: await viewOimUserPage.getSecuritySerialNumberOnRow(n),
      deviceStatus: await viewOimUserPage.getSecurityDeviceStatusOnRow(n),
      deviceDescription: await viewOimUserPage.getSecurityDeviceDescriptionOnRow(n),
      requestedDate: await viewOimUserPage.getSecurityDeviceRequestedDateOnRow(n),
      issuanceLocation: await viewOimUserPage.getSecurityDeviceIssueLocationOnRow(n),
    };

    await helper.pause(1);
  }); 

  Then(/^select "(.*)" in Security Devices grid$/, async function(devices){
    await helper.waitForDisplayed(viewOimUserPage.selectors.selectedSecurityDevicesGrid);
    await helper.pause(1);
    let devicesArr = devices.split(',');

    if (devicesArr.length > 1) {
      await helper.pressCtrlKeyDown();
      await helper.pause(1);
      for (let device of devicesArr) {
        logger.info('Selecting devices: ' + device);
        let n = await viewOimUserPage.findSecurityDeviceInGrid(device);
        await viewOimUserPage.selectSecurityDeviceInGridByIndex(n);
        this.selectedSecurityDevice = {
          deviceType: await viewOimUserPage.getSecurityDeviceNameOnRow(n),
          serialNumber: await viewOimUserPage.getSecuritySerialNumberOnRow(n),
          deviceStatus: await viewOimUserPage.getSecurityDeviceStatusOnRow(n),
          deviceDescription: await viewOimUserPage.getSecurityDeviceDescriptionOnRow(n),
          requestedDate: await viewOimUserPage.getSecurityDeviceRequestedDateOnRow(n),
          issuanceLocation: await viewOimUserPage.getSecurityDeviceIssueLocationOnRow(n),
        };
      }
      await helper.releaseCtrlKey();
    } else {
      logger.info('Selecting device: ' + devicesArr[0]);
      let n = await await viewOimUserPage.findSecurityDeviceInGrid(devicesArr[0])
      await viewOimUserPage.selectSecurityDeviceInGridByIndex(n);
      this.selectedSecurityDevice = {
        deviceType: await viewOimUserPage.getSecurityDeviceNameOnRow(n),
        serialNumber: await viewOimUserPage.getSecuritySerialNumberOnRow(n),
        deviceStatus: await viewOimUserPage.getSecurityDeviceStatusOnRow(n),
        deviceDescription: await viewOimUserPage.getSecurityDeviceDescriptionOnRow(n),
        requestedDate: await viewOimUserPage.getSecurityDeviceRequestedDateOnRow(n),
        issuanceLocation: await viewOimUserPage.getSecurityDeviceIssueLocationOnRow(n),
      };
    }
  }); 


  Then(/^check Unblock Token error (message|notification) "(MSG067|MSG068|MSG069)" is displayed$/, { wrapperOptions: { retry: 1 } }, async function(errorType, msg) {

    let selector = errorType === 'message' ? viewOimUserPage.selectors.notificationMsg : viewOimUserPage.selectors.errNotificationMsg
    let msgText = (msg === 'MSG067') ? viewOimUserPage.screenMessages.msg_067 : 
    (msg === 'MSG068') ? viewOimUserPage.screenMessages.msg_068 : 
    (msg === 'MSG069') ? viewOimUserPage.screenMessages.msg_069 : null;
    logger.info(`Check error message is displayed: ${msgText}`);
    await helper.waitForTextInElement(selector, msgText, 10);
  });

  Then(/^check token activation confirmation message is displayed$/, async function() {
    logger.info("Checking token activation confirmation message");

    await helper.waitForDisplayed(viewOimUserPage.selectors.dialog.confirmationMsg1);
    expect(await helper.getElementText(viewOimUserPage.selectors.dialog.confirmationMsg1)).to.equal(viewOimUserPage.screenMessages.msg_070_1
        .replace('<deviceType>', this.selectedSecurityDevice.deviceType)
        .replace('<deviceSerial>', this.selectedSecurityDevice.serialNumber));
    expect(await helper.getElementText(viewOimUserPage.selectors.dialog.confirmationMsg2)).to.equal(viewOimUserPage.screenMessages.msg_070_2);

  });

  Then(/^check Unblock Token screen elements$/, async function() {
    logger.info('Checking Unblock Token screen elements')
    await helper.waitForDisplayed(viewOimUserPage.selectors.unblockTokenDialog.title);
    
    expect(await helper.getElementText(viewOimUserPage.selectors.unblockTokenDialog.title)).to.equal('Unblock Token');
    expect(await helper.getElementText(viewOimUserPage.selectors.unblockTokenDialog.deviceTypeLabel)).to.equal('Device Type');
    expect(await helper.getElementText(viewOimUserPage.selectors.unblockTokenDialog.serialNumberLabel)).to.equal('Serial Number');
    expect(await helper.getElementText(viewOimUserPage.selectors.unblockTokenDialog.unblockCodeLabel)).to.equal('Unblock Code');
    expect(await helper.getElementText(viewOimUserPage.selectors.unblockTokenDialog.activationCodeLabel)).to.equal('Activation Code');
    expect(await helper.getElementText(viewOimUserPage.selectors.unblockTokenDialog.generateActivationCodeBtn)).to.equal('Generate Activation Code');
    expect(await helper.getElementText(viewOimUserPage.selectors.unblockTokenDialog.closeBtn)).to.equal('Close');
    expect(await helper.getElementAttribute(viewOimUserPage.selectors.unblockTokenDialog.unblockCodeInput, 'maxlength')).to.equal('7');

    expect(await helper.getElementText(viewOimUserPage.selectors.unblockTokenDialog.deviceTypeValue)).to.equal(this.selectedSecurityDevice.deviceType);
    expect(await helper.getElementText(viewOimUserPage.selectors.unblockTokenDialog.serialNumberValue)).to.equal(this.selectedSecurityDevice.serialNumber);
    expect(await helper.getElementText(viewOimUserPage.selectors.unblockTokenDialog.activationCodeValue)).to.equal("");

  });

  Then(/^BankUser enters "(.*)" in Unblock Code field( and clicks Generate Activation Code button|)$/, async function(unblockCode, clickButton) {
    await helper.waitForDisplayed(viewOimUserPage.selectors.unblockTokenDialog.unblockCodeInput);

    await helper.inputText(viewOimUserPage.selectors.unblockTokenDialog.unblockCodeInput, unblockCode);

    if (clickButton) {
        await helper.click(viewOimUserPage.selectors.unblockTokenDialog.generateActivationCodeBtn);
    }
  });

  Then(/^verify Activation Code value is generated and displayed$/, async function() {
    logger.info('Checking that activation code is generated and displayed');
    await helper.waitUntilTextInElement(viewOimUserPage.selectors.unblockTokenDialog.activationCodeValue, 5);
    logger.info('Verification code: ' + await helper.getElementText(viewOimUserPage.selectors.unblockTokenDialog.activationCodeValue));
    expect((await helper.getElementText(viewOimUserPage.selectors.unblockTokenDialog.activationCodeValue)).length).to.equal(8);
  });

  Then(/^verify Generate Activation Code button is disabled$/, async function() {
    logger.info('Checking that Generate Activation Code button is disabled after successful attempt');
    await helper.waitForDisplayed(viewOimUserPage.selectors.unblockTokenDialog.generateActivationCodeBtn);
    expect(await helper.ifDisabledAttributeExist(viewOimUserPage.selectors.unblockTokenDialog.generateActivationCodeBtn)).to.be.true;
  })

  Then(/^verify Unblock Token dialog screen is closed$/, async function() {
    logger.info('Checking that Unblock Token dialog screen is closed');
    await helper.waitForElementToDisAppear(viewOimUserPage.selectors.unblockTokenDialog.dialogBox, 1);
  });

  Then(/^verify Unblock Code (mandatory field|incorrect length|invalid) error message$/, async function(validation) {
      switch (validation) {
        case 'mandatory field':
            expect(await helper.getElementText(viewOimUserPage.selectors.unblockTokenDialog.unblockCodeError)).to.equal(viewOimUserPage.screenMessages.msg_002_unblock_Code);
            break;
        case 'incorrect length':
            expect(await helper.getElementText(viewOimUserPage.selectors.unblockTokenDialog.unblockCodeError)).to.equal(viewOimUserPage.screenMessages.msg_073);
            break;
        case 'invalid':
            expect(await helper.getElementText(viewOimUserPage.selectors.errNotificationMsg)).to.equal(viewOimUserPage.screenMessages.msg_074);
            break;
      }
  });

  Then(/^verify that the Unblock Code field does not accept non-numeric characters$/, async function() {
    logger.info('Checking that Unblock Code field does not accept non-numeric characters');
    expect(await helper.getElementValue(viewOimUserPage.selectors.unblockTokenDialog.unblockCodeInput)).to.equal('');
  });

  Then(/^BankUser clicks on (Add|Remove) Security Devices button and (confirms|cancels)$/, async function(button, confirmation) {
    logger.info(`Click on "${button}" button on Security Devices grid`);
    await helper.click((button === 'Add' ? viewOimUserPage.selectors.addBtn: viewOimUserPage.selectors.removeBtn));
    
    await helper.click((confirmation === 'confirms' ? viewOimUserPage.selectors.dialog.confirm : viewOimUserPage.selectors.dialog.cancel));

  });

  Then(/^BankUser clicks on "(.*)" device in Security Devices Grid$/, async function(device){
    logger.info(`Clicking on security device: ${device}`)
    const n = await viewOimUserPage.findSecurityDeviceInGrid(device);
    await helper.click(viewOimUserPage.getSelectorOfNthItemInSecurityDevicesGrid(n));
    await helper.pause(2);
  });

  Then(/check security device (enable|disable) message and click on "(Yes|No)" button$/, async function(enableDisable, button){
    logger.info(`Checking confirmation dialog for ${enableDisable} message`);
    const selector = viewOimUserPage.selectors.dialog.confirmationMsg1;
    const msg_078 = `Are you sure you wish to ${enableDisable} ${this.selectedSecurityDevice.deviceType} (${this.selectedSecurityDevice.serialNumber}) for the User?`;
    expect (await helper.getElementText(selector)).to.equal(msg_078);
    logger.info(`Click on ${button} button`);
    const btnSelector = (button === 'No') ? viewOimUserPage.selectors.dialog.cancel : viewOimUserPage.selectors.dialog.confirm;
    await helper.click(btnSelector);

    await helper.pause(1.5);
  });

  Then(/check device disabled confirmation message and confirm$/, async function(){
    const msg_079 = 'The selected Security Device has been disabled successfully.';
    expect(await helper.getElementText(viewOimUserPage.selectors.notificationMsg)).to.equal(msg_079);
    await helper.click(viewOimUserPage.selectors.dialog.confirm);
  });

  Then(/^BankUser double clicks on "(ANZ Digital Key|Token Digipass 270|Token Digipass 276 \(China Compliant\))" in Security Devices grid$/, async function(device) {
    await helper.pause(2)
    console.log('this.users:' + JSON.stringify(this.users));
    await helper.waitForDisplayed(viewOimUserPage.selectors.selectedSecurityDevicesGrid);
    logger.info('Double clicking on device: ' + device);
    let n = await viewOimUserPage.findSecurityDeviceInGrid(device);
    await viewOimUserPage.doubleClickOnSecurityDeviceInGridByIndex(n);
  });

  Then(/^check "(View Token Function|Reset Token)" dialog is displayed for "(Token Digipass 270|Token Digipass 276 \(China Compliant\))" for the "(\d+)(?:st|nd|rd|th)" API created User$/, async function(dialogTitle, deviceType, n) {
    await helper.waitForTextInElement(viewOimUserPage.selectors.viewTokenFunctionDialog.title, dialogTitle);
    logger.info(`Check device type and serial number displayed correctly in ${dialogTitle} dialog`);
    expect(await helper.getElementText(viewOimUserPage.selectors.viewTokenFunctionDialog.deviceTypeValue)).to.equal(deviceType);
    let serialNumber;
    for (let device of this.users[n - 1].securityDevices) {
      if (device.type === deviceType) {
        serialNumber = device.serialNumber;
        break;
      }
    }
    expect(await helper.getElementText(viewOimUserPage.selectors.viewTokenFunctionDialog.serialNumberValue)).to.equal(serialNumber ? serialNumber : '');
  });

  Then(/^check \"View Token Function\" dialog is NOT pop-ed up$/, async function() {
    try {
      await helper.waitForDisplayed(viewOimUserPage.selectors.viewTokenFunctionDialog.title, 5);
      throw (new Error('View token dialog pops up for ADK!'));
    } catch (e) {
      logger.info('"View Token dialog has NOT pope-ed up');
    }
  });

  Then(/^check \"View Token Function\" dialog is displayed with \"No values to display\" message$/, async function() {
    await helper.waitForDisplayed(viewOimUserPage.selectors.viewTokenFunctionDialog.title);
    logger.info('Check "No values to display" in "View Token Function" dialog');
    await helper.waitForTextInElement(viewOimUserPage.selectors.viewTokenFunctionDialog.title, 'View Token Function', 15);
    expect(await helper.getElementText(viewOimUserPage.selectors.viewTokenFunctionDialog.noRecordMsg)).to.equal(viewOimUserPage.screenMessages.msg076);
  });

  Then(/^check \"Token Function\" table headers$/, async function() {
    logger.info('Check "Token Function" table headers');
    let headers = await viewOimUserPage.getViewTokenFunctionsTableHeaders();
    await expect(headers[0]).to.equal('Token Functions');
    await expect(headers[1]).to.equal('Token Function Locked');
    await expect(headers[2]).to.equal('Number of attempts left');
  });

  Then(/^check \"Token Function\" table content with default values$/, async function() {
    logger.info('Check "Token Function" table content is populated with default values');
    let content = await viewOimUserPage.getViewTokenFunctionsTableContent();
    console.log(JSON.stringify(content))
    for (let row of content) {
      expect(['otp', 'online', 'offline'].indexOf(row.tokenFunctions) > -1).to.equal(true);
      expect(row.tokenFunctionsLocked).to.equal('No');
      expect(row.numberOfAttemptsLeft).to.equal('3');
    }
  });

  Then(/^BankUser closes "(View Token Function|Reset Token)" dialog$/, async function(title) {
    logger.info(`Close "${title}" dialog`);
    await helper.waitForDisplayed(viewOimUserPage.selectors.viewTokenFunctionDialog.closeBtn);
    await helper.click(viewOimUserPage.selectors.viewTokenFunctionDialog.closeBtn);
    await helper.waitForElementToDisAppear(viewOimUserPage.selectors.viewTokenFunctionDialog.title, 2);
  });

  Then(/^check \"Reset Token\" button is (Disabled|Enabled) in the Reset Token dialog$/, async function(status) {
    logger.info('Close "View Token Function" dialog');
    expect(await helper.ifDisabledAttributeExist(viewOimUserPage.selectors.viewTokenFunctionDialog.resetTokenBtn)).to.equal(status === 'Disabled');
  });
  Then(/^check error message when "(\d)(?:st|nd|rd|th)" DA User is promoted with security devices and clicks "(Yes|No)" on the confirmation$/, async function(n, yesNo){
    const userData = this.users[n-1];
    const msg_060 = "Submitting the modifications will make this User 'ANZ Managed' - are you sure you want to continue?";
    const selector = viewOimUserPage.selectors.modifyUser.modifyUserDialog.confirmationMessageLine1;
    await helper.waitForDisplayed(selector);
    expect(await helper.getElementText(selector)).to.equal(msg_060);

    if (yesNo === 'Yes') {
      await helper.click(viewOimUserPage.selectors.yesBtnOnConfirmationPopup);
      const msg_019 = (userData.status === 'New') ? `User ${userData.firstName} ${userData.surName} (${userData.userId.toUpperCase()}) has been submitted for approval.` :
      `User ${userData.firstName} ${userData.surName} (${userData.userId}) is now pending approval to be modified.`;
      await helper.waitForDisplayed(viewOimUserPage.selectors.successNotificationMsg);
      expect(await helper.waitForTextInElement(viewOimUserPage.selectors.successNotificationMsg,msg_019,15));
  } else {
      await helper.click(viewOimUserPage.selectors.noBtnOnConfirmationPopup);
      this.users[0].version--;
    }
  });

  Then(/^check ANZ Managed is "(True|False)"$/, async function (ANZManaged) {
    let n = 1;
    if (ANZManaged === 'True') {
      logger.info(viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(n + 3));
      expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(n + 3)).to.equal('Managed by:ANZ Managed');
    } else {
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(n + 3)).to.equal('Managed by:Customer Managed');
    }
  });