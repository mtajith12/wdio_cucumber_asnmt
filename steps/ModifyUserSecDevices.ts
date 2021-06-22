import {Given, When, Then} from 'cucumber';
import * as _ from 'lodash';
const faker = require('faker');
import {viewOimUserPage} from 'src/ViewOimUserPage';
import {createUserSecDevicesPage} from 'src/CreateUserSecDevicesPage';
import {expect} from 'chai';
import {randomData} from 'src/RandomData';
import {helper} from 'src/Helper';
import { DBConnection } from 'src/DBConnection';
import {getLogger} from 'log4js';
const logger = getLogger();
logger.level = 'info';

Then(/^check "(Add|Enable|Remove)" button is "(Enabled|Disabled)" on Modify User Security Device screen$/, async function (button, status) {
    await helper.waitForDisplayed(viewOimUserPage.selectors.addBtn);
    await helper.pause(1.5);
    logger.info(`Check ${button} button is ${status} on Modify User Security Device screen`);
    const btnSelector = (button === 'Add') ? viewOimUserPage.selectors.addBtn : (button === 'Enable') ? viewOimUserPage.selectors.enableBtn : (button === 'Remove') ? viewOimUserPage.selectors.removeBtn : null;
    expect((await helper.getElementAttribute(btnSelector, 'class')).includes('disabled')).to.equal(status === 'Disabled');
    await helper.pause(1.5);
});

Then(/^click "(Add|Enable|Remove)" button on Modify User Security Device screen$/, async function (button) {
    logger.info(`Clicking ${button} button on Modify User Security Device screen`);
    const btnSelector = (button === 'Add') ? viewOimUserPage.selectors.addBtn : (button === 'Enable') ? viewOimUserPage.selectors.enableBtn : (button === 'Remove') ? viewOimUserPage.selectors.removeBtn : null;

    await helper.click(btnSelector);
})

Then(/^check Add Security Device dialog displays "(Token Digipass 270|Token Digipass 276 \(China Compliant\)|ANZ Digital Key)"$/, async function (deviceType) {
    logger.info(`Check Add Device dialog displays ${deviceType}`);
    expect(await helper.getElementText(createUserSecDevicesPage.selectors.addDeviceDialog.title)).to.equal('Add Security Device');

    expect(await helper.getElementText(createUserSecDevicesPage.selectors.addDeviceDialog.securityDeviceLabel)).to.equal('Security Device');
    expect(await helper.getElementValue(createUserSecDevicesPage.selectors.addDeviceDialog.securityDevicesSelect)).to.equal(deviceType);
    if (deviceType === 'Token Digipass 270') {
        expect(await helper.getElementText(createUserSecDevicesPage.selectors.addDeviceDialog.issueLocationsLabel)).to.equal('Device Issuance Location');
        expect(await helper.getElementValue(createUserSecDevicesPage.selectors.addDeviceDialog.issueLocationsSelect)).to.equal('AUSTRALIA, Melbourne');
    };
    if (deviceType === 'Token Digipass 276 (China Compliant)') {
        expect(await helper.getElementText(createUserSecDevicesPage.selectors.addDeviceDialog.issueLocationsLabel)).to.equal('Device Issuance Location');
        expect(await helper.getElementValue(createUserSecDevicesPage.selectors.addDeviceDialog.issueLocationsSelect)).to.equal('CHINA, Chengdu');
    };
    if (deviceType === 'ANZ Digital Key') {
        expect(await helper.getElementText(createUserSecDevicesPage.selectors.addDeviceDialog.noAttributeText)).to.equal(createUserSecDevicesPage.screenMessages.MSG031);
    };
});

Then(/^check Security Device "(.*)" with status "(.*)" is the "(\d+)(?:st|nd|rd|th)" item in Devices grid$/, async function (device, status, n) {
    logger.info(`Check the displayed of newly added device ${device} in the Selected Devices Grid`);
    const devices = this.userData.securityDevices;
    let location = null;
    for (var i = 0; i < devices.length; i++) {
        if (devices[i].type === device) {
            location = devices[i].location;
            break;
        }
    }
    // Most recently added device is always on the top row
    expect(await viewOimUserPage.getSecurityDeviceNameOnRow(n)).to.equal(device);
    expect(await viewOimUserPage.getSecurityDeviceStatusOnRow(n)).to.equal(status);
    expect(await viewOimUserPage.getSecurityDeviceIssueLocationOnRow(n)).to.equal(randomData.isNullOrEmpty(location) ? '' : location);
});

Then(/^check \"No Record Found\" is displayed on empty security devices grid$/, async function () {
    if (!(await viewOimUserPage.isTabActive(viewOimUserPage.selectors.securityDevicesTab))) {
        await helper.click(viewOimUserPage.selectors.securityDevicesTab);
        await helper.waitForDisplayed(viewOimUserPage.selectors.selectedSecurityDevicesGrid);
    }
    expect(await helper.getElementText(viewOimUserPage.selectors.noDeviceFoundMsg)).to.equal(viewOimUserPage.screenMessages.msg007);
});

Then(/^check remove security device message and click "(Yes|No)"$/, async function (yesNo) {
    const msg_021 = 'Are you sure you wish to remove the selected Security Devices?';
    const selector = viewOimUserPage.selectors.dialog.confirmationMsg1;
    expect(await helper.getElementText(selector)).to.equal(msg_021);
    logger.info(`Click on ${yesNo} button`)
    const btnSelector = (yesNo === 'No') ? viewOimUserPage.selectors.dialog.cancel : viewOimUserPage.selectors.dialog.confirm;
    await helper.click(btnSelector);
});


Then(/^check User Credential is "(.*)" in CA for the "(\d+)(?:st|nd|rd|th)" API created User$/, { wrapperOptions: { retry: 10 } }, async function(userCredential, n) {
    const user_id = this.users[n - 1].userId;
    const query = `select * from CA_OWNER.usr where src_sys_login_id = '${user_id}'`;
    const result = (await DBConnection.run(query))[0];
    logger.info(`query CA DB result: ${JSON.stringify(result)}`);
    expect(result['CREDENTIAL_TYPE']).to.equal((userCredential));
  });

  Then(/^verify the message for another device of the same type is displayed and click OK$/, async function() {
    const msg_080 = 'The selected security device cannot be enabled. The User has another security device of the same type that is enabled.';
    const selector = viewOimUserPage.selectors.notificationMsg;
    logger.info('Checking error message for device of same type attempting to be enabled');
    expect(await helper.getElementText(selector)).to.equal(msg_080);
    logger.info('Click on OK button');
    const btnSelector = viewOimUserPage.selectors.yesBtnOnConfirmationPopup;
    await helper.click(btnSelector);
});