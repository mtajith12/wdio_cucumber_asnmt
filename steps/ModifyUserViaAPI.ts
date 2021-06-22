import _ = require('lodash');
import {Given} from 'cucumber';
import {Then} from 'cucumber';
import {userRegService} from 'src/UserRegService';
import {oauthToken} from 'src/OauthTokenViaApi';
import {expect} from "chai";
const dataReader = require('src/DataReader');
import {getLogger} from 'log4js';
const logger = getLogger();

Given(/^"([^"]*)" modifies user details of "(\d+)(?:st|nd|rd|th)" API created user$/, async function (bankuser, i) {
    // This step doesn't actually modify any details yet.
    // It just passes the same user details from the Create User API request body
    // Note that this step can NOT be used in case the user has security devices, apps or entitlements.
    const selectedUser = this.users[i - 1];
    var createReqBody = selectedUser.createUserReqBody;

    const bankuserId = dataReader.getBankUser(bankuser);
    const modifyResponse = await userRegService.modifyCustomerUser(bankuserId, selectedUser.id, createReqBody);

    this.users[i - 1].status = modifyResponse.i18nStatus;
    this.users[i - 1].workflow = modifyResponse.i18nWorkflow;
});

/* 
 * The intended modifications to the applications are passed into the step in format below,
 *    | add     | LM;eMatching            |
 *    | remove  | SDP CTS                 |
 *    | disable | Transactive Global      |
 *    | edit    | Internet Enquiry Access |
 *    | enable  | GCIS                    | 
 */
Given(/^"([^"]*)" modifies user applications of the "(\d+)(?:st|nd|rd|th)" API created user:$/, async function (bankuser, i, data) {
    const user = this.users[i - 1];
    // save app data before modify into scenario context, which will be used later in case modification is rejected.
    user.appsBeforeModify = _.cloneDeep(user.applications);

    const applications = user['applications'];
    const modifyApps = data.rowsHash();

    // generate the "applications" array in the modify request payload:
    // every application entry is to be included in the "applications" array.
    // If the application is to be modified as passed in from step data, generate the application entry with action as "add", "remove", "edit", "disable", "enable",
    // otherwise the application is not to be modified, pass in action as undefined.
    let applicationsModify = [];
    for (let application of applications) {
        const appName = Object.keys(application)[0];
        var action = undefined;
        // check is the app is one of the apps that need to be modified
        for (let i = 0; i < Object.keys(modifyApps).length; i++) {
            const names = Object.values(modifyApps)[i].toString().split(';');
            for (let name of names) {
                if (appName === name) {
                    action = Object.keys(modifyApps)[i];
                    break;
                }
            }
        }

        if (user.status === 'New' && action === 'remove') { 
          // not to include the app entry in the app list
        } else {
            const appToModify = userRegService.generateAppEntryForModifyUserRequest(application, action);
            console.log(`${action ? action : 'No change'} app ${appName}: ${JSON.stringify(appToModify)}`)
            applicationsModify.push(appToModify);
        }
    }

    if (Object.keys(modifyApps).includes('add')) {
        for (let name of modifyApps['add'].split(';')) {
            var appEntryToAdd = {};
            appEntryToAdd[name] = {};
            const appToModify = userRegService.generateAppEntryForModifyUserRequest(appEntryToAdd, 'add');
            console.log(`add app ${name}: ${JSON.stringify(appToModify)}`)
            applicationsModify.push(appToModify);
        }
    }

    // Retrieve the request payload that was used to create the User, from scenario context, so we can re-user the user details part.
    // make sure applications, security devices, and entitlements sections are updated to use the up-to-date data from saved user data in scenario
    var reqBody = JSON.parse(user['createUserReqBody']);
    reqBody['userId'] = user['userId'].toUpperCase();
    reqBody['userCode'] = user['userId'].toUpperCase();
    reqBody['anzManaged'] = user['anzManaged'] ? true : false;
    reqBody['managedBy'] = user['anzManaged'] ? 'ANZ Managed' : 'Customer Managed';
    reqBody['applications'] = applicationsModify;
    reqBody['securityDevices'] = user['securityDevices'];
    reqBody['entitlements'] = user['entitlements'];

    const bankUser = dataReader.getBankUser(bankuser);
    const response = await userRegService.modifyCustomerUser(bankUser, user.id, JSON.stringify(reqBody));

    // Update User data in scenario context with the modified User
    const appsData = userRegService.getAppInfoFromPayload(response);
    if (Object.keys(modifyApps).includes('edit')) {
        const editedAppNames = modifyApps['edit'].split(';');
        for (let editedAppName of editedAppNames) {
            if (['EsandaNet', 'GCIS', 'Internet Enquiry Access'].includes(editedAppName)) {
                for (let app of appsData) 
                    if (Object.keys(app)[0] === editedAppName)
                      Object.values(app)[0]['attrEdited'] = true;
            }
        }
    }
    this.users[i - 1].applications = appsData;
    if (Object.keys(modifyApps).includes('remove')) 
        this.users[i - 1]['removedApps'] = modifyApps['remove'].split(';');
    

    this.users[i - 1].status = response.i18nStatus;
    this.users[i - 1].workflow = response.i18nWorkflow;
    this.users[i - 1].version = response.version;

    console.log(JSON.stringify(this.users));
});

Then(/^check applications for the "(\d+)(?:st|nd|rd|th)" created user has last provisioning status is "(Enabled Successfully|Disabled Successfully|Modified Successfully)" in cobra for:$/, async function (n, lastProvStatus, data) {
    const id = this.users[n - 1].id;
    const bankuser = dataReader.getBankUser('Default OIM Bankuser');
    const accessToken = await oauthToken.getAccessToken(bankuser);
    const userDetails = await userRegService.getCustomerUserDetailsById(accessToken, id);
    let applications = userDetails.applications;
    const appData = data.rowsHash();

    let apps;
    for (let i = 0; i < Object.keys(appData).length; i++) {
        apps = Object.values(appData)[i].toString().split(';');
    }

    for (let app of applications){
      let lastEvent;
      for (let i = 0; i < apps.length; i++){
        if (app.appId === apps[i]){
          logger.info(`Checking ${app['appId']} has been ${lastProvStatus}`);
          if (lastProvStatus === 'Enabled Successfully'){
            lastEvent = 'ENABLED_SUCCESS';
          } else if (lastProvStatus === 'Disabled Successfully'){
            lastEvent = 'DISABLED_SUCCESS';
          } else {
            lastEvent = 'MODIFIED_SUCCESS';
          }
          expect(app.lastEvent).to.equal(lastEvent);
          expect(app.i18nLastEvent).to.equal(lastProvStatus);
        }
      }
    }
});

Given(/^"([^"]*)" modifies user security devices of the "(\d+)(?:st|nd|rd|th)" API created user:$/, async function (bankuser, i, data) {
  const user = this.users[i - 1];
  // save app data before modify into scenario context, which will be used later in case modification is rejected.
  user.secDevicesBeforeModify = _.cloneDeep(user.securityDevices);

  const securityDevices = user['securityDevices'];
  const modifySecDevices = data.rowsHash();

  let securityDevicesModify = [];
  for (let securityDevice of securityDevices) {
      const deviceName = securityDevice['type'];
      const deviceStatus = securityDevice['status'];
      var action = undefined;
      // check the security device is one of the sec devices that need to be modified
      for (let i = 0; i < Object.keys(modifySecDevices).length; i++) {
          const names = Object.values(modifySecDevices)[i].toString().split(';');
          for (let name of names) {
            //If name is split
            if (name.includes(':')){ 
              const deviceTypeStatus = name.split(':');
              const type = deviceTypeStatus[0].includes('Token Digipass 276') ? 'Token Digipass 276 (China Compliant)' : deviceTypeStatus[0];
              const status = (deviceTypeStatus.length < 2 ) ? '' : deviceTypeStatus[1];
              if (deviceName === type && deviceStatus === status) {
                action = Object.keys(modifySecDevices)[i];
                break;
              }
            }
            else if (deviceName === name) {
              action = Object.keys(modifySecDevices)[i];
              break;
            }
          }
      }

      if (user.status === 'New' && action === 'remove') { 
        // not to include the device entry in the device list
      } else {
        const secDeviceToModify = userRegService.generateSecDeviceEntryForModifyUserRequest(securityDevice, action);
        logger.info(`${action ? action : 'No change'} secDevice ${deviceName}: ${JSON.stringify(secDeviceToModify)}`)
        securityDevicesModify.push(secDeviceToModify);
      }
  }

  if (Object.keys(modifySecDevices).includes('add')) {
    for (let device of modifySecDevices['add'].split(';')) {
        const typeLocation = device.split(':');
        const type = typeLocation[0].includes('Token Digipass 276') ? 'Token Digipass 276 (China Compliant)' : typeLocation[0];
        const location = (typeLocation.length < 2 ) ? '' : typeLocation[1];
        var secDeviceEntryToAdd = {};
        secDeviceEntryToAdd[type] = {};
        secDeviceEntryToAdd[location] = {};
        const secDeviceToModify = userRegService.generateSecDeviceEntryForModifyUserRequest(secDeviceEntryToAdd, 'add');
        console.log(`add secDevice ${type}: ${JSON.stringify(secDeviceToModify)}`);
        securityDevicesModify.push(secDeviceToModify);
    }
  }

  // Retrieve the request payload that was used to create the User, from scenario context, so we can re-user the user details part.
  // make sure applications, security devices, and entitlements sections are updated to use the up-to-date data from saved user data in scenario
  var reqBody = JSON.parse(user['createUserReqBody']);
  reqBody['anzManaged'] = user['anzManaged'] ? true : false;
  reqBody['managedBy'] = user['anzManaged'] ? 'ANZ Managed' : 'Customer Managed';
  reqBody['applications'] = user['applications'];
  reqBody['securityDevices'] = securityDevicesModify;
  reqBody['entitlements'] = user['entitlements'];

  const bankUser = dataReader.getBankUser(bankuser);
  const response = await userRegService.modifyCustomerUser(bankUser, user.id, JSON.stringify(reqBody));

  const secDevicesData = userRegService.getSecDeviceInfoFromPayload(response);
  this.users[i - 1].securityDevices = secDevicesData;

  logger.info(this.users[i-1].securityDevices);

  if (Object.keys(modifySecDevices).includes('enable')){
    this.users[i - 1]['enabledSecDevices'] = modifySecDevices['enable'].split(';');
  }

  if (Object.keys(modifySecDevices).includes('remove')){
    this.users[i - 1]['removedSecDevices'] = modifySecDevices['remove'].split(';');
  }

  this.users[i - 1].status = response.i18nStatus;
  this.users[i - 1].workflow = response.i18nWorkflow;
  this.users[i - 1].version = response.version;
  console.log(JSON.stringify(this.users));
});
