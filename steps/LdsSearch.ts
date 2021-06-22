import { Then } from 'cucumber';
const lds = require('utils/Lds');
const sortData = require('src/SortData');
import { expect } from "chai";
import { getLogger } from "log4js";
import { openIdm } from 'api/OpenIDM';
const logger = getLogger();
logger.level = 'info';

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

// Refer to https://confluence.service.anz/pages/viewpage.action?spaceKey=WDCDT&title=User+Application+Assignment for mapping of User Region to LDS value
const UserRegionMappingToValueInLDS = {
  'NSW, ACT': '2',
  'Victoria, Tasmania': '3',
  'Queensland': '4',
  'SA, NT': '5',
  'WA': '6'
};

async function searchOrgById(orgId) {
  var opts = {
    filter: `(OU=${orgId})`,
    scope: 'one',
    attributes: ['name'],
  };
  return await lds.search('OU=companies,OU=anzsaam,O=ANZ,C=AU', opts);
};

async function searchUserById(userId) {
  var opts = {
    filter: `(&(CN=${userId})(OU=people))`,
    scope: 'sub',
    attributes: ['name'],
  };
  return await lds.search('OU=companies,OU=anzsaam,O=ANZ,C=AU', opts);
};

async function searchUserByOrgIdAndUserId(orgId, userId) {
  var opts = {
    filter: `(uid=${userId})`,
    scope: 'one',
    attributes: ['cn', 'sn', 'givenName', 'mail'],
  };
  return await lds.search(`OU=people,OU=${orgId},OU=companies,OU=anzsaam,O=ANZ,C=AU`, opts);
}

async function searchUserByIdUnderApplication(userId, orgId, appName) {
  var opts = {
    filter: `(CN=${userId.toUpperCase()})`,
    scope: 'one',
    attributes: ['anzpermissiondisabled', 'cn', 'anzp1', 'anzp2', 'anzp3', 'anzapplspecificuid', 'name'],
  };
  return await lds.search(`OU=${appName},OU=${orgId},OU=companies,OU=anzsaam,O=ANZ,C=AU`, opts);
}

async function searchApplicationsUnderOrgApplications(orgId) {
  var opts = {
    scope: 'one',
    attributes: ['cn'],
  };
  return await lds.search(`OU=applications,OU=${orgId},OU=companies,OU=anzsaam,O=ANZ,C=AU`, opts);
};

async function searchApplicationsUnderOrg(orgId) {
  var opts = {
    filter: '(!(|(OU=applications)(OU=people)))',
    scope: 'one',
    attributes: ['ou'],
  };
  return await lds.search(`OU=${orgId},OU=companies,OU=anzsaam,O=ANZ,C=AU`, opts);
};

/*
 * Refer to https://confluence.service.anz/pages/viewpage.action?spaceKey=WDCDT&title=User+Application+Assignment for mapping of the app attributes to LDS field
 */
function checkAppAttributes(appName, appAttributes, ldsEntry) {
  switch (appName) {
    case 'EsandaNet':
      expect(ldsEntry.anzp1).to.equal(appAttributes.type);
      expect(ldsEntry.anzp2).to.equal(appAttributes.userRegion.toString());
      expect(ldsEntry.anzp3).to.equal(appAttributes.iSeriesUserID.toUpperCase());
      break;
    case 'GCIS':
      expect(ldsEntry.anzapplspecificuid).to.equal(appAttributes.GCISUserID);
      break;
    case 'Internet Enquiry Access':
      expect(ldsEntry.anzp1).to.equal(appAttributes.customerRegNo.toString());
      break;
    case 'eMatching':
      // todo: below will be put into use when AAMS-809 is done
      // expect(ldsEntry.anzapplspecificuid).to.match(/^\d{8}$/);
      // expect(ldsEntry.anzapplspecificuid).to.equal(appAttributes['eMatchingUserId']);
      break;
    case 'GCP':
    case 'Institutional Insights':
    case 'LM':
    case 'Online Trade':
    case 'SDP CTS':
    case 'Transactive Global':
      // No Application attributes are required.
      break;
  }
}

async function checkAppsAndAttributesInLDSForUser(userData) {
  const orgId = userData.caasOrg.orgId;
  const userId = userData.userId;
  const apps = userData.applications;
  // this.userData.applications = ["EsandaNet":{"iSeriesUserID":"qmp3bojfjw","userRegion":"Queensland","type":"B"}, "GCIS":{"GCISUserID":"tygxb7"}, "Institutional Insights":{}, "Internet Enquiry Access":{"customerRegNo":58999},"Online Trade":{}]
  for (var i = 0; i < apps.length; i++) {
    const appNameUI = Object.keys(apps[i])[0];
    const appNameLDS = UIAppNameMappingToNameInLDS[appNameUI];
    logger.info(`Search User by Org ID ${orgId}, App name ${appNameLDS}, and user ID ${userId}, result from LDS:`);
    const ldsEntry = await searchUserByIdUnderApplication(userId, orgId, appNameLDS);
    expect(ldsEntry.length).to.equal(1);
    expect(ldsEntry[0].anzpermissiondisabled).to.equal('0');
    expect(ldsEntry[0].name).to.equal(userData.userId.toUpperCase());
    if (['EsandaNet', 'GCIS', 'Internet Enquiry Access', 'eMatching'].indexOf(appNameUI) > -1) {
      const attributes = Object.values(apps[i])[0];
      checkAppAttributes(appNameUI, attributes, ldsEntry[0]);
    }
  }
}

Then(/^check CAAS Org has (|NOT )been created in LDS(| with the assigned Apps)$/, async function (created, apps) {
  const orgId = this.orgData.orgId;
  logger.info(`Search CAAS Org by Org ID ${orgId}, result from LDS:`);
  const orgResults = await searchOrgById(orgId);
  (created === 'NOT ') ? expect(orgResults.length).to.equal(0) : expect(orgResults.length).to.equal(1);

  if (!(created === 'NOT ') && apps === ' with the assigned Apps') {
    const apps = this.orgData.applications;
    logger.info(`Search for Apps under Org ${orgId}, results from LDS:`);
    const appEntriesUnderOrg = await searchApplicationsUnderOrg(orgId);
    logger.info('Search for Apps under the created Org/Applications, results from LDS:');
    const appEntriesUnderOrgApps = await searchApplicationsUnderOrgApplications(orgId);
    expect(appEntriesUnderOrg.length).to.equal(apps.length);
    expect(appEntriesUnderOrgApps.length).to.equal(apps.length);

    for (var i = 0; i < apps.length; i++) {
      let entryUnderOrgFound = false;
      let entryUnderOrgAppsFound = false;
      for (var j = 0; j < apps.length; j++) {
        if (appEntriesUnderOrg[i]['ou'] === UIAppNameMappingToNameInLDS[apps[j]]) {
          entryUnderOrgFound = true;
          break;
        }
      }
      for (var k = 0; k < apps.length; k++) {
        if (appEntriesUnderOrgApps[i]['cn'] === UIAppNameMappingToNameInLDS[apps[k]]) {
          entryUnderOrgAppsFound = true;
          break;
        }
      }
      expect(entryUnderOrgFound).to.equal(true);
      expect(entryUnderOrgAppsFound).to.equal(true);
    }
  }
});

Then(/^check the UI created User exists in LDS under the "(\d+)(?:st|nd|rd|th)" API created Org$/, async function (n) {
  const orgId = this.orgs[n - 1].orgId;
  const userId = this.userData.userId;
  logger.info(`Search User under Org ID ${orgId} and user ID ${userId}, result from LDS:`);
  const res = await searchUserByOrgIdAndUserId(orgId, userId);
  expect(res.length).to.equal(1);
});

Then(/^check the UI created User is linked under the assigned Applications with correct attribute values$/, async function () {
  await checkAppsAndAttributesInLDSForUser(this.userData);
});

Then(/^check the UI created User does NOT exist in LDS$/, async function () {
  const userId = this.userData.userId;
  logger.info(`Search User by user ID ${userId}, result from LDS:`);
  const res = await searchUserById(userId);
  expect(res.length).to.equal(0);
});

Then(/^check the API created Users exist in LDS under the "(\d+)(?:st|nd|rd|th)" API created Org$/, async function (n) {
  const orgId = this.orgs[n - 1].orgId;
  for (var i = 0; i < this.users.length; i++) {
    logger.info(`Search User under Org ID ${orgId} and user ID ${this.users[i].userId}, result from LDS: `);
    const res = await searchUserByOrgIdAndUserId(orgId, this.users[i].userId);
    expect(res.length).to.equal(1);
  }
});

Then(/^check the API created Users do NOT exist in LDS$/, async function () {
  for (var i = 0; i < this.users.length; i++) {
    logger.info(`Search User by user ID ${this.users[i].userId}, result from LDS:`);
    const res = await searchUserById(this.users[i].userId);
    expect(res.length).to.equal(0);
  }
});

Then(/^check the API created Users are linked under the assigned Applications with correct attribute values$/, async function () {
  for (var i = 0; i < this.users.length; i++) {
    await checkAppsAndAttributesInLDSForUser(this.users[i]);
  }
});

Then(/check anzpwddisabled value is "(.*)" for the "(\d+)(?:st|nd|rd|th)" user$/, async function (anzPwValue, n) {
  const linkedView = await openIdm.getUserLinkedView(this.users[n - 1].userId);
  const linkList = linkedView["linkedTo"];
  logger.info(`${JSON.stringify(linkList)}`);
  for (let link of linkList) {
    if (link["linkType"] === "anzuser-to-lds-anzperson") {
      expect(link.content.anzpwddisabled).to.equal(anzPwValue);
    }
  }
});
