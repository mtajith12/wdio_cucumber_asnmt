import _ = require('lodash');
import { Given } from 'cucumber';
import { userRegService } from 'src/UserRegService';
import { randomData } from 'src/RandomData';
import * as faker from 'faker';
const dataReader = require('src/DataReader');
import { getLogger } from 'log4js';
const logger = getLogger();

Given(/^"([^"]*)" issues "(Token Digipass 270|Token Digipass 276 \(China Compliant\))" for "(\d+)(?:st|nd|rd|th)" created user$/, async function(user, deviceType, n) {
    const bankuser = dataReader.getBankUser(user);
    const userData = (this.users && this.users.length >= n) ? this.users[n - 1] : this.userData;
    let deviceId;
    for (let device of userData.securityDevices) {
        logger.info(device);
        if (device.type === deviceType && device.status === 'PROVISIONING' && device.description === 'DEVICE_AWAITING_ISSUANCE') {
            deviceId = device.id;
            break;
        }
    }

    let tokenSerial = deviceType === 'Token Digipass 270' ? 'SUC0' + faker.random.alphaNumeric(6) : 'SUC6' + faker.random.alphaNumeric(6);

    let updatedUserDetails = await userRegService.issueToken(bankuser, userData.id, deviceId, tokenSerial, deviceType, userData.version);
    // update stored userData with approved token details
    userData.securityDevices = updatedUserDetails.securityDevices;
    userData.version = updatedUserDetails.version;
});

Given(/^"([^"]*)" activates "(Token Digipass 270|Token Digipass 276 \(China Compliant\))" for "(\d+)(?:st|nd|rd|th)" created user$/, async function(user, deviceType, n) {
    const bankuser = dataReader.getBankUser(user);
    const userData = (this.users && this.users.length >= n) ? this.users[n - 1] : this.userData;
    let deviceId;
    for (let device of userData.securityDevices) {
        logger.info(device);
        if (device.type === deviceType && device.status === 'PENDING' && device.description === 'DEVICE_AWAITING_ACTIVATION') {
            deviceId = device.id;
            break;
        }
    }

    let response = await userRegService.activateToken(bankuser, userData.id, deviceId, userData.version);
    // update stored userData with activated token details
    userData.securityDevices = response.securityDevices;
    userData.version = response.version;
});

Given(/^"([^"]*)" disables "(Token Digipass 270|Token Digipass 276 \(China Compliant\))" for "(\d+)(?:st|nd|rd|th)" created user$/, async function(user, deviceType, n) {
    const bankuser = dataReader.getBankUser(user);
    const userData = (this.users && this.users.length >= n) ? this.users[n - 1] : this.userData;
    let deviceId;
    for (let device of userData.securityDevices) {
        logger.info(device);
        if (device.type === deviceType && device.status === 'ENABLED' && device.description === 'DEVICE_ACTIVE') {
            deviceId = device.id;
            break;
        }
    }
    let response = await userRegService.disableToken(bankuser, userData.id, deviceId, userData.version);
    // update stored userData with disabled token details
    userData.securityDevices = response.securityDevices;
    userData.version = response.version;
    this.users[n - 1].securityDevices = userData.securityDevices;

});
