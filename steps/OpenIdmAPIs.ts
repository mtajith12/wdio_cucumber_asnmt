import { Then } from 'cucumber';
import { openIdm } from 'src/OpenIDM';
import { expect } from "chai";
import { getLogger } from 'log4js';
import { userRegService } from 'api/UserRegService';
const dataReader = require('src/DataReader');
const logger = getLogger();

const UIAppNameMappingToNameInLDS = {
  'EsandaNet': 'EsandaNet',
  'GCIS': 'GCIS',
  'Institutional Insights': 'Institutional Insights', 
  'Internet Enquiry Access': 'carbe', 
  'Online Trade': 'onlinetrade',
  'SDP CTS': 'SDPCTS',
  'eMatching': 'eMatching',
  'LM': 'LM',
  'Transactive Global': 'Transactive Global',
  'GCP': 'GCP'
};

const EsandaNetUserRegionToValue = {
  'NSW, ACT': '2',
  'Victoria, Tasmania': '3',
  'Queensland': '4',
  'SA, NT': '5',
  'WA': '6'
};

// linkType is one of 'userapp-to-lds-anzpermission' and 'userapp-to-${app}'
function getAppLinkFromLinkedView(payload, linkType) {
  if (payload['linkedTo']) {
    const links = payload['linkedTo'];
    for (let link of links) {
      if (link['linkType'] === linkType) {
        return link;
      }
    }
  } else {
    return null;
  }
}

Then(/^check the Security Devices of the (UI created User|API created Users) are in \"Provisioning\/Pending\" status from IDM Linked View$/, async function(userSource) {
  let users = [];
  (userSource === 'UI created User') ? users.push(this.userData) : users = this.users;

  for (let user of users) {
    const userId = user.userId.toUpperCase();
    const userResponse = await openIdm.getUserFromIDM(userId);
    const devices = userResponse['securityDevices'];
    // console.log(JSON.stringify(userResponse))
    expect(devices.length).to.equal(user.securityDevices.length);

    for(let device of devices) {
      const deviceId = device['_refResourceId'];
      logger.info(`Get Security Device Linked View via Forgerock IDM API: ${deviceId}`);
      const linkedView = await openIdm.getSecurityDeviceLinkedView(deviceId);
      logger.info(JSON.stringify(linkedView));

      let mappedToCreateUserData = false;
      for (let userDevice of user.securityDevices) {
        if (linkedView['deviceType'] === userDevice['type']) {
          mappedToCreateUserData = true;
          if (userDevice['type'].includes('Token Digipass')) {
            expect(linkedView['name']).to.equal('Token');
            expect(linkedView['status']).to.equal('Provisioning');
          }
          if (userDevice['type'] === 'ANZ Digital Key') {
            expect(linkedView['name']).to.equal('Soft Token');
            expect(linkedView['status']).to.equal('Pending');
          }
          break;
        }
      }
      expect(mappedToCreateUserData).to.equal(true);
    }
  }
});

Then(/^check IDM Linked View that "(Token Digipass 270|Token Digipass 276 \(China Compliant\))" has been Provisioned$/, async function(deviceType) {
  // info for this Security Device issuance has been saved in this.securityDeviceIssuanceEntry
  const userId = this.securityDeviceIssuanceEntry.userId;
  const serialNumber = this.securityDeviceIssuanceEntry.serialNumber;

  const userDetailsFromIDM = await openIdm.getUserFromIDM(userId);
  const devices = userDetailsFromIDM['securityDevices'];
  logger.info(JSON.stringify(userDetailsFromIDM))

  var deviceTypeFound = false;
  for(let device of devices) {
    const deviceId = device['_refResourceId'];
    logger.info(`Get ${deviceType} Linked View via Forgerock IDM API: ${deviceId}`);
    const linkedView = await openIdm.getSecurityDeviceLinkedView(deviceId);
    logger.info(JSON.stringify(linkedView));

    if (linkedView['deviceType'] === deviceType) {
      deviceTypeFound = true;
      expect(linkedView['status']).to.equal('Pending');
      expect(linkedView['serialNumber']).to.equal(serialNumber);
      expect(linkedView['anzUser']['_refResourceId']).to.equal(userId);
      const linkedTo = linkedView['linkedTo'][0];
      expect(linkedTo['resourceName']).to.equal(`system/SSAS/ssas/${serialNumber}`);
      expect(linkedTo['content']['_id']).to.equal(serialNumber);
      expect(linkedTo['linkType']).to.equal('sd-to-ssas');
      break;
    }
  }
  expect(deviceTypeFound).to.equal(true);
});

Then(/^check the Tokens of the "(\d+)(?:st|nd|rd|th)" API created User are in "(.*)" status in IDM$/, async function(n, status) {
  logger.info(`Check Token Devices are ${status} in IDM`);
  const userId = this.users[n - 1].userId.toUpperCase();
  const response = await openIdm.searchSecurityDevices(userId);
  const devices = response['result'];
  for (let device of devices) {
    const deviceId = device['_id'];
    if (device['name'] === 'Token'){
      logger.info(`Get Device Information from Forgerock IDM API: ${deviceId}`);
      logger.info(`Check that ${device['deviceType']} is Status: ${device['status']}`);
      expect (device['status']).to.equal(status);
    }
  }
});

// https://confluence.service.anz/pages/viewpage.action?spaceKey=WDCDT&title=User+Application+Assignment
// only 'eMatching', 'SDP CTS', 'GCP', and 'LM' are integrated app.
Then(/^check (integrated|non-integrated) application "(.*)" links for the "(\d+)(?:st|nd|rd|th)" API created User$/, async function(isIntegrated, appName, n) {
  const userId = this.users[n - 1].userId;
  const orgId = this.users[n - 1].caasOrg.orgId;
  const appId = `${userId}~${appName.split(' ').join('')}`;
  let application;
  for (let app of this.users[n - 1].applications) {
    if (Object.keys(app)[0] === appName) {
      application = app; 
      break;
    }
  }
  const appNameLDS = UIAppNameMappingToNameInLDS[appName];

  const linkedView = await openIdm.getApplicationLinkedView(appId);
  logger.info(`Get application ${appName} Linked View via Forgerock IDM API, for User ${userId}: \n${JSON.stringify(linkedView)}`);
  
  const linkToLDS = getAppLinkFromLinkedView(linkedView, 'userapp-to-lds-anzpermission');
  logger.info(`Check linked view to LDS, for application ${appName}: ${JSON.stringify(linkToLDS)}`);
  const content = linkToLDS.content;
  expect(content.anzpermissiondisabled).to.equal(Object.values(application)[0]['status'] === 'Enabled' ? '0' : '1');
  expect(content.name).to.equal(userId);
  expect(content.cn).to.equal(userId);
  expect(content.ou[0]).to.equal(appNameLDS);
  expect(content.__NAME__).to.equal(`CN=${userId},OU=${appNameLDS},OU=${orgId},OU=companies,OU=anzsaam,O=ANZ,C=AU`);
  if (appName === 'EsandaNet') {
    expect(content.anzp1).to.equal('B');
    expect(content.anzp2).to.equal(Object.values(application)[0]['userRegion'].toString());
  } else if (appName === 'eMatching') {
    expect(content.anzapplspecificuid).to.equal(Object.values(application)[0]['eMatchingUserId']);
  } else if (appName === 'GCIS') {
    expect(content.anzapplspecificuid).to.equal(Object.values(application)[0]['GCISUserID']);
  } else if (appName === 'Internet Enquiry Access') {
    expect(content.anzp1).to.equal(Object.values(application)[0]['customerRegNo'].toString());
  }

  if (!isIntegrated.includes('non-integrated')) {
    const linkType = (appName === 'SDP CTS') ? 'userapp-to-SDPCTS' : `userapp-to-${appNameLDS.toLowerCase()}`;
    const linkToApp = getAppLinkFromLinkedView(linkedView, linkType);
    logger.info(`Check linked view to Application, for ${appName}: ${JSON.stringify(linkToApp)}`);
    const resourceName = (appName === 'SDP CTS') ? `system/SDP/sdp/User:${userId}` : `system/${appNameLDS}/${appNameLDS.toLowerCase()}/User:${userId}`;
    expect(linkToApp.resourceName).to.equal(resourceName);
    expect(linkToApp.content._id).to.equal(`User:${userId}`);
  }
});

Then(/^check (integrated|non-integrated) application "(.*)" links for the UI created User$/, async function(isIntegrated, appName) {
  const userId = this.userData.userId.toUpperCase();
  const orgId = this.userData.caasOrg.orgId;
  const appId = `${userId}~${appName.split(' ').join('')}`;
  let application;
  for (let app of this.userData.applications) {
    if (Object.keys(app)[0] === appName) {
      application = app; 
      break;
    }
  }
  const appNameLDS = UIAppNameMappingToNameInLDS[appName];

  const linkedView = await openIdm.getApplicationLinkedView(appId);
  logger.info(`Get application ${appName} Linked View via Forgerock IDM API, for User ${userId}: \n${JSON.stringify(linkedView)}`);
  
  const linkToLDS = getAppLinkFromLinkedView(linkedView, 'userapp-to-lds-anzpermission');
  logger.info(`Check linked view to LDS, for application ${appName}: ${JSON.stringify(linkToLDS)}`);
  const content = linkToLDS.content;
  expect(content.anzpermissiondisabled).to.equal(Object.values(application)[0]['status'] === 'Enabled' ? '0' : '1');
  expect(content.name).to.equal(userId);
  expect(content.cn).to.equal(userId);
  expect(content.ou[0]).to.equal(appNameLDS);
  expect(content.__NAME__).to.equal(`CN=${userId},OU=${appNameLDS},OU=${orgId},OU=companies,OU=anzsaam,O=ANZ,C=AU`);
  if (appName === 'EsandaNet') {
    expect(content.anzp1).to.equal('B');
    expect(content.anzp2).to.equal(Object.values(application)[0]['userRegion'].toString());
  } else if (appName === 'eMatching') {
    expect(content.anzapplspecificuid).to.equal(Object.values(application)[0]['eMatchingUserId']);
  } else if (appName === 'GCIS') {
    expect(content.anzapplspecificuid).to.equal(Object.values(application)[0]['GCISUserID']);
  } else if (appName === 'Internet Enquiry Access') {
    expect(content.anzp1).to.equal(Object.values(application)[0]['customerRegNo'].toString());
  }

  if (!isIntegrated.includes('non-integrated')) {
    const linkType = (appName === 'SDP CTS') ? 'userapp-to-SDPCTS' : `userapp-to-${appNameLDS.toLowerCase()}`;
    const linkToApp = getAppLinkFromLinkedView(linkedView, linkType);
    logger.info(`Check linked view to Application, for ${appName}: ${JSON.stringify(linkToApp)}`);
    const resourceName = (appName === 'SDP CTS') ? `system/SDP/sdp/User:${userId}` : `system/${appNameLDS}/${appNameLDS.toLowerCase()}/User:${userId}`;
    expect(linkToApp.resourceName).to.equal(resourceName);
    expect(linkToApp.content._id).to.equal(`User:${userId}`);
  }
});

Then(/^check application "(.*)" links are not present for the "(\d+)(?:st|nd|rd|th)" API created User$/, async function(appName, n) {
  const userId = this.users[n - 1].userId;
  const appId = `${userId}~${appName.split(' ').join('')}`;
  const response = await openIdm.getApplicationLinkedView(appId);
  logger.info(`Get application ${appName} Linked View via Forgerock IDM API, for User ${userId}: ${JSON.stringify(response)}`);
  expect(response.code).to.equal(404);
});

Then(/^check that all application links have been removed from IDM for the "(\d+)(?:st|nd|rd|th)" API created User$/, async function(n) {
  const userId = this.users[n - 1].userId;
  const removedApps = this.users[n-1]['removedApps'];
  for (let app of removedApps){
    const appId = `${userId}~${app}`;
    const response = await openIdm.getApplicationLinkedView(appId);
    logger.info(`Get Application ${app} Linked View via Forgerock IDM API, for User ${userId}: ${JSON.stringify(response)}`);
    expect(response.code).to.equal(404);
  }
});

Then(/^check that the User has been removed from IDM for the "(\d+)(?:st|nd|rd|th)" API created User$/, async function(n) {
  const userId = this.users[n - 1].userId;
  const response = await openIdm.getUserFromIDM(userId);
  logger.info(`Get User via Forgerock IDM API for User ${userId} : ${JSON.stringify(response)} `);
  expect (response.code).to.equal(404);
});

Then(/^check that the Org has been removed from IDM for the "(\d+)(?:st|nd|rd|th)" API created Org$/, async function(n) {
  const orgId = this.orgs[n - 1].orgId;
  const response = await openIdm.getOrgFromIDM(orgId);
  logger.info(`Get Org via Forgerock IDM API for Org ${orgId} : ${JSON.stringify(response)} `);
  expect (response.code).to.equal(404);
});

Then(/^delete the user's "(\d+)(?:st|nd|rd)" KBA in IDM for the "(\d+)(?:st|nd|rd|th)" API created User$/, async function(n, n2) {
  const userId = this.users[n2 - 1].userId;
  const idmUserDetails = await openIdm.getUserFromIDM(userId);
  
  const response = await openIdm.deleteAnzUserChallengeQa(idmUserDetails.challengeQA[n - 1]._refResourceId);
  logger.info(`Delete challengeQa: ${JSON.stringify(response, null, 2)}`);
});

Then(/^check all applications for the "(\d+)(?:st|nd|rd|th)" created user have application status "(Disabled|Enabled)" in IDM$/, async function(n, status){
  const userId = this.users[n -1].userId;
  let applications = this.users[n - 1].applications;
  for (var i = 0; i < applications.length; i++){
    const appName = Object.keys(applications[i])[0];
    const appId = `${userId}~${appName.split(' ').join('')}`;
    const response = await openIdm.getApplicationLinkedView(appId);
    logger.info(`Check App: ${appName} has been ${status}: ${JSON.stringify(response)}`);
    expect (response['status']).to.equal(status);
  }
});

Then(/^check that "(.*)" for the "(\d+)(?:st|nd|rd|th)" created user is "(Disabled|Enabled|Removed|Provisioning|Pending|ImplicitDisabled)" status from IDM Linked View$/, async function(deviceType, n, status) {
  const userId = this.users[n-1].userId;
  const response = await openIdm.getUserFromIDM(userId);

  const devices = response['securityDevices'];
  for (let device of devices){
    const deviceId = device['_refResourceId'];
    logger.info(`Get Security Device Linked View via Forgerock IDM API: ${deviceId}`);
    const linkedView = await openIdm.getSecurityDeviceLinkedView(deviceId);
    logger.info(JSON.stringify(linkedView));

    if(linkedView['deviceType'] === deviceType){
      logger.info(`Check ${deviceType} is ${status} in IDM`)
      expect(linkedView['status']).to.equal(status);
      expect(linkedView['deviceType']).to.equal(deviceType); 
    }
  }
});