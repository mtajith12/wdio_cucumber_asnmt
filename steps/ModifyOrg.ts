import { Given, When, Then } from 'cucumber';
import * as _ from 'lodash';
import { expect } from 'chai';
import { helper } from 'src/Helper';
import { getLogger, Logger } from 'log4js';
import { randomData } from 'src/RandomData';
import { viewCaasOrgPage } from 'pages/ViewCaasOrgPage';
import { times } from 'lodash';
import * as faker from 'faker';
import { searchCaasOrgPage } from 'pages/SearchCaasOrgPage';
import { MenuBar } from 'pages/MenuBarPage';
const sortData = require('src/SortData');
const logger = getLogger();
logger.level = 'info';

const ALLOWED_SPECIAL_CHARS_ORG_NAME = '. ,!@#$%/&*()_-+=?{}[]`:~\'"/|';

Then(/^BankUser clicks on "(Edit|Delete)" button on Org Details page$/, async function (button) {
    logger.info(`Click on ${button} Button`);
    const selector = (button === 'Edit') ? viewCaasOrgPage.selectors.edit :
        viewCaasOrgPage.selectors.delete;
    await helper.click(selector);
    if (button === 'Edit') {
        await helper.waitForElementToAppear(viewCaasOrgPage.selectors.modifyOrg.orgNameInput, 5);
        await helper.waitForElementToAppear(viewCaasOrgPage.selectors.modifyOrg.orgBinInput, 5);
    }
});

Then(/^check Org Status set to "(Enabled|Deleted)" and Workflow to Approved on View Org details page$/, async function (status) {
    logger.info(`Check org status set to ${status} and workflow to Approved`);
    await helper.waitForTextInElement(viewCaasOrgPage.selectors.headerStatusValue, status, 15);
    expect(await helper.getElementText(viewCaasOrgPage.selectors.headerStatusValue)).to.equal(status);
    expect(await helper.getElementText(viewCaasOrgPage.selectors.headerWorkflowValue)).to.equal("Approved");
});

Then(/^check the \"No Record Found\" message in the applications grid on modify caas org page$/, async function () {
    await helper.waitForDisplayed(viewCaasOrgPage.selectors.selectedApplicationsGrid);
    await expect(await helper.getElementText(viewCaasOrgPage.selectors.noResltsMsg)).to.equal(viewCaasOrgPage.screenMessages.msg007);
});

Then(/^BankUser clicks "(Yes|No)" on delete org confirmation message$/, async function (yesNo) {
    logger.info('Check delete org confirmation message')
    const expectedMsg1 = `This will submit CAAS Org: ${this.searchOrgResultEntry.fullName} (${this.searchOrgResultEntry.id}) to be deleted.`;
    const expectedMsg2 = 'Do you want to proceed?';
    expect((await helper.getElementText(viewCaasOrgPage.selectors.modifyOrg.modifyOrgDialog.confirmationMessageLine1))).to.equal(expectedMsg1);
    expect((await helper.getElementText(viewCaasOrgPage.selectors.modifyOrg.modifyOrgDialog.confirmationMessageLine2))).to.equal(expectedMsg2);
    if (yesNo === 'Yes') {
        await helper.click(viewCaasOrgPage.selectors.modifyOrg.modifyOrgDialog.yesButton);
    } else {
        await helper.click(viewCaasOrgPage.selectors.modifyOrg.modifyOrgDialog.noButton);
    }
});

Then(/^BankUser clicks on "(Submit|Cancel|Delete)" button for Org Modification and clicks "(Yes|No)" on the confirmation for the "(\d+)(?:st|nd|rd|th)" API created org$/, async function (button, yesNo, n) {
    logger.info(`Click on ${button} Button`)
    //Remove Leading/Trailing
    let orgName = await helper.getElementValue(viewCaasOrgPage.selectors.modifyOrg.orgNameInput);
        orgName = orgName.trim();
    const selector = (button === 'Cancel') ? viewCaasOrgPage.selectors.cancel :
        (button === 'Submit') ? viewCaasOrgPage.selectors.submit :
        viewCaasOrgPage.selectors.delete;
    await helper.click(selector);
    if (button === 'Cancel') {
        const expectedMsg = viewCaasOrgPage.screenMessages.msg051;
    expect((await helper.getElementText(viewCaasOrgPage.selectors.modifyOrg.modifyOrgDialog.confirmationMessageLine1))).to.equal(expectedMsg);
    } else {
        const expectedMsg1 = `This will submit CAAS Org: ${orgName} (${this.searchOrgResultEntry.id}) to be modified.`;
        const expectedMsg2 = 'Do you want to proceed?';
        expect((await helper.getElementText(viewCaasOrgPage.selectors.modifyOrg.modifyOrgDialog.confirmationMessageLine1))).to.equal(expectedMsg1);
        expect((await helper.getElementText(viewCaasOrgPage.selectors.modifyOrg.modifyOrgDialog.confirmationMessageLine2))).to.equal(expectedMsg2);
    }
    if (yesNo === 'Yes') {
    // Update current list of applications that should appear
    let orgApps = this.orgs[n-1].applications;

    // Reset added and removed apps stored in this session
    this.orgs[n-1].addedApps = [];
    this.orgs[n-1].removedApps = [];
    if (this.addedSelectedApps){
        for (let app of this.addedSelectedApps) {
            logger.info(`Add App: ${app}`);
            orgApps.push(app);
        }
        this.orgs[n-1].addedApps = this.addedSelectedApps;
        this.addedSelectedApps = [];
    }

    if (this.removeSelectedApps){
        for (var i = orgApps.length - 1; i >= 0; i--) {
            for (let app of this.removeSelectedApps) {
                if (app == orgApps[i]) { 
                    logger.info(`Remove App: ${app}`);
                    orgApps.splice(i,1);
                }
            }
        }
        this.orgs[n-1].removedApps = this.removeSelectedApps;
        this.removeSelectedApps = [];
    }

    //Sort and store the updated org apps for later
    const sortedApps = sortData.sortSimpleArrayByAlphabeticOrder(orgApps);
    this.orgs[n-1].applications = sortedApps;

    await helper.click(viewCaasOrgPage.selectors.modifyOrg.modifyOrgDialog.yesButton);
    } else {
        await helper.click(viewCaasOrgPage.selectors.modifyOrg.modifyOrgDialog.noButton);
    }
});

Then(/^check Org modification has been submitted successfully notification message$/, async function () {
    logger.info('Check Org Success Notification Message');
    const successMsg = `CAAS Org (${this.searchOrgResultEntry.id}) has been modified and approved.`;
    await helper.waitForTextInElement(viewCaasOrgPage.selectors.successNotificationMsg, 'CAAS Org', 15);
    expect(await helper.getElementText(viewCaasOrgPage.selectors.successNotificationMsg)).to.equal(successMsg);
});

Then(/^check Org deletion has been submitted successfully notification message$/, async function() {
    logger.info('Check Org Deletion Notification Message');
    const successMsg = `CAAS Org (${this.searchOrgResultEntry.id}) has been deleted and approved.`;
    await helper.waitForTextInElement(viewCaasOrgPage.selectors.successNotificationMsg, 'CAAS Org', 15);
    expect(await helper.getElementText(viewCaasOrgPage.selectors.successNotificationMsg)).to.equal(successMsg);
});

Then(/^check Org deletion has been submitted successfully notification from org summary grid$/, async function() {
    logger.info('Check Org Deletion Notification Message');
    const successMsg = `CAAS Org (${this.searchOrgResultEntry.id}) has been deleted and approved.`;
    await helper.waitForTextInElement(searchCaasOrgPage.selectors.successNotificationMsg, 'CAAS Org', 15);
    expect(await helper.getElementText(searchCaasOrgPage.selectors.successNotificationMsg)).to.equal(successMsg);
});

Then(/^BankUser clicks "(Add|Remove)" application button on modify CAAS Org Screen$/, async function(button){
    logger.info(`Click on ${button} application button on modify CAAS Org Screen`);
    const selector = (button === 'Add') ? viewCaasOrgPage.selectors.modifyOrg.addAppsBtn :
        viewCaasOrgPage.selectors.modifyOrg.removeAppsBtn;
    await helper.click(selector);
});

Then(/^verify the applications on Add applications page on modify Caas Org Screen for the "(\d+)(?:st|nd|rd|th)" API created org$/, async function (n) {
    logger.info('Verify the list of applications in add applications grid');
    await helper.waitForDisplayed(viewCaasOrgPage.selectors.addApplicationsGrid);
    expect(await helper.getElementText(viewCaasOrgPage.selectors.addApplicationsGridName)).to.equal('Application Name');
    //Get the list of applications that should appear in add applications page
    const orgApps = this.orgs[n - 1].applications;
    const applications = viewCaasOrgPage.applications;
    for (var i = applications.length - 1; i >= 0; i--) {
        for (let orgApp of orgApps) {
            if (orgApp == applications[i]) {
                applications.splice(i, 1);
            }
        }
    }
    const appsSorted = sortData.sortSimpleArrayByAlphabeticOrder(applications);
    logger.info(`Check available applications are displayed in correct order.`);
    for (var i = 0; i < appsSorted.length; i++){
        expect(await viewCaasOrgPage.getAddAppOnRow(i + 1)).to.equal(appsSorted[i]);
    }
});

Then(/^BankUser clicks on "(Cancel|Ok)" button on Add applications page$/, async function(button){
   const selector = (button === 'Cancel') ? viewCaasOrgPage.selectors.modifyOrg.modifyOrgDialog.cancelBtn :
                    viewCaasOrgPage.selectors.modifyOrg.modifyOrgDialog.okBtn;
    if (button === 'Ok') {
        logger.info('Apps have been assigned to CAAS Org');
    }
    await helper.click(selector);
});

Then(/^BankUser selects "(.*)" Application in Application grid$/, async function(apps) {
    await helper.waitForDisplayed(viewCaasOrgPage.selectors.addApplicationsGrid);
    await helper.pause(1);
    let appsArray = apps.split(',');
    let selectedApps = [];
    if (appsArray.length >= 1) {
        await helper.pressCtrlKeyDown();
        for (let app of appsArray) {
            logger.info('Selecting application: ' + app);
            let n = await viewCaasOrgPage.findAddApplicationInGrid(app);
            await viewCaasOrgPage.addApplicationsGridByIndex(n);
            selectedApps.push(app);
        }
        await helper.releaseCtrlKey();
    } 
    this.addedSelectedApps = selectedApps;
});  

Then(/^BankUser selects "(.*)" Application in selected Application grid$/, async function(Apps) {
    await helper.waitForDisplayed(viewCaasOrgPage.selectors.selectedApplicationsGrid);
    let appsArray = Apps.split(',');
    let selectedApps = [];
    if (appsArray.length >= 1) {
        await helper.pressCtrlKeyDown();
        for (let app of appsArray) {
            logger.info('Selecting application: ' + app);
            let n = await viewCaasOrgPage.findApplicationInGrid(app);
            await viewCaasOrgPage.selectedApplicationsGridByIndex(n);
            selectedApps.push(app);
        }
        await helper.releaseCtrlKey();
    } 
    this.removeSelectedApps = selectedApps;
}); 


Then(/^verify the selected applications on modify Caas Org Screen for the "(\d+)(?:st|nd|rd|th)" API created org$/, async function (n) {
    await helper.waitForDisplayed(viewCaasOrgPage.selectors.selectedApplicationsGrid);
    const appsSorted = sortData.sortSimpleArrayByAlphabeticOrder(this.orgs[n-1].applications);
    logger.info(`Check available applications are displayed in correct order.`);
    for (var i = 0; i < appsSorted.length; i++) {
        logger.info(`Check ${appsSorted[i]} is on row ${i+1}`);
        expect(await viewCaasOrgPage.getAppNameOnRow(i+1)).to.equal(appsSorted[i]);
    } 
});

When(/^BankUser modifies the "(\d+)(?:st|nd|rd|th)" org with the (same|similar) (name|bin) as the "(\d+)(?:st|nd|rd|th)" API created org$/, async function(i, sameSimilar, nameBin, n){
    const orgData = {};
    this.orgData = this.orgs[i-1];
    orgData['oldOrgName'] = this.orgData.orgName;
    orgData['oldBin'] = this.orgData.bin;
    const newOrgName = this.orgs[n-1].orgName;
    const newOrgBin = this.orgs[n-1].bin;

    if (sameSimilar === 'same' && nameBin === 'name') {
        await helper.inputText(viewCaasOrgPage.selectors.modifyOrg.orgNameInput, newOrgName);
        orgData['orgName'] = newOrgName;
        orgData['bin'] = this.orgData.bin;
    } else if (sameSimilar === 'similar' && nameBin === 'name') {
        await helper.inputText(viewCaasOrgPage.selectors.modifyOrg.orgNameInput, newOrgName.substring(0, newOrgName.length - 1));
        orgData['orgName'] = newOrgName.substring(0, newOrgName.length - 1);
        orgData['bin'] = this.orgData.bin;
    } else if (sameSimilar === 'same' && nameBin === 'bin') {
        await helper.inputText(viewCaasOrgPage.selectors.modifyOrg.orgBinInput, newOrgBin);
        orgData['orgName'] = this.orgData.orgName;
        orgData['bin'] = newOrgBin;
    }
    this.orgData = orgData;
});

Then(/^verify date and time were updated for new applications in CAAS Org$/, async function() {
    await helper.waitForDisplayed(viewCaasOrgPage.selectors.selectedApplicationsGrid);
    const timeStamp = randomData.getTodayDate();
    const apps = this.addedSelectedApps;
    for (let app of apps) {
        let n = await viewCaasOrgPage.findApplicationInGrid(app);
        expect(await viewCaasOrgPage.getAppDateOnRow(n)).to.equal(timeStamp);
    }
});

Then(/^BankUser modifies CAAS Org Data with leading\/trailing spaces$/, async function() {
    logger.info('Modify org with leading/trailing spaces');
    this.orgData = this.orgData ? this.orgData : this.orgs[0];
    const orgData = {};    
    const orgName = faker.random.alphaNumeric(16);
    const orgBin = faker.random.alphaNumeric(16);
    orgData['orgName'] = new Array(4).join(' ') + orgName + new Array(2).join(' ');
    orgData['bin'] = new Array(2).join(' ') + orgBin + new Array(5).join(' ');
    orgData['oldOrgName'] = this.orgData.orgName;
    orgData['oldBin'] = this.orgData.bin;
    await helper.inputText(viewCaasOrgPage.selectors.modifyOrg.orgNameInput, orgData['orgName']);
    await helper.inputText(viewCaasOrgPage.selectors.modifyOrg.orgBinInput, orgData['bin']);
    orgData['orgName'] = orgData['orgName'].trim();
    orgData['bin'] = orgData['bin'].trim();
    this.orgData = orgData;
});


When(/^BankUser modifies CAAS Org Data with allowed special characters$/, async function() {
    logger.info('Modify org with special characters');
    this.orgData = this.orgData ? this.orgData : this.orgs[0];
    const orgData = {};
    orgData['orgName'] = faker.random.alphaNumeric(16) + ALLOWED_SPECIAL_CHARS_ORG_NAME;
    orgData['bin'] = faker.random.alphaNumeric(16);
    orgData['oldOrgName'] = this.orgData.orgName;
    orgData['oldBin'] = this.orgData.bin;
    await helper.inputText(viewCaasOrgPage.selectors.modifyOrg.orgNameInput, orgData['orgName']);
    await helper.inputText(viewCaasOrgPage.selectors.modifyOrg.orgBinInput, orgData['bin']);
    this.orgData = orgData;
});

Then(/^BankUser modifies Org data with name "(.*)" and bin "(.*)"$/, async function(orgName, bin) {
    logger.info(`Modify Org details with org name: ${orgName} and bin: ${bin}.`);
    await helper.inputText(viewCaasOrgPage.selectors.modifyOrg.orgNameInput, orgName);
    await helper.inputText(viewCaasOrgPage.selectors.modifyOrg.orgBinInput, bin);
});

Then(/^BankUser modifies Org data with blank mandatory fields$/, async function(){
    logger.info('Clear mandatory fields on Modify Org page');
    await helper.clearInput(viewCaasOrgPage.selectors.modifyOrg.orgNameInput);
    await helper.clearInput(viewCaasOrgPage.selectors.modifyOrg.orgBinInput);
});

Then(/^BankUser modifies Org data with maximum field lengths$/, async function(){
    const orgData = {};
    this.orgData = this.orgData ? this.orgData : this.orgs[0];
    orgData['oldOrgName'] = this.orgData.orgName;
    orgData['oldBin'] = this.orgData.bin;
    orgData['orgName'] = faker.random.alphaNumeric(viewCaasOrgPage.fieldLengths.orgNameMaxLength + 1);
    orgData['bin'] = faker.random.alphaNumeric(viewCaasOrgPage.fieldLengths.binMaxLength + 1);
    await helper.inputText(viewCaasOrgPage.selectors.modifyOrg.orgNameInput, orgData['orgName']);
    await helper.inputText(viewCaasOrgPage.selectors.modifyOrg.orgBinInput, orgData['bin']);
    this.orgData = orgData;

});

Then(/^check "(orgName|bin)" field has been truncated to the max allowed length on modify org page$/, async function(field) {
     if (field === 'orgName') {
      expect((await helper.getElementAttribute(viewCaasOrgPage.selectors.modifyOrg.orgNameInput, 'value'))).to.equal(this.orgData.orgName.substring(0, viewCaasOrgPage.fieldLengths.orgNameMaxLength));
    } else {
      expect((await helper.getElementAttribute(viewCaasOrgPage.selectors.modifyOrg.orgBinInput, 'value'))).to.equal(this.orgData.bin.substring(0, viewCaasOrgPage.fieldLengths.binMaxLength));
    }
  });

Then(/^verify the updated org name and bin on org details page$/, async function(){
    logger.info('Verify Org details are updated');
    //Added pause to allow header name to update
    await helper.pause(2);
    expect((await helper.getElementText(viewCaasOrgPage.selectors.headerOrgNameValue)).trim()).to.equal(`${this.orgData['orgName']} (${this.orgData['bin']})`);
});

Then(/^BankUser checks no application selected to be assigned notification message$/, async function(){
    logger.info('Check there is no application being assigned message');
    expect((await helper.getElementText(viewCaasOrgPage.selectors.modifyOrg.modifyOrgDialog.notificationMessage))).to.equal(viewCaasOrgPage.screenMessages.msg009);
});

Then(/^BankUser checks no application selected to be removed notification message$/, async function () {
    logger.info('Check no application selected notification message')
    const expectedMsg036 = `No Applications are selected. Please select at least one to proceed.`;
    expect((await helper.getElementText(viewCaasOrgPage.selectors.modifyOrg.modifyOrgDialog.notificationMessage))).to.equal(expectedMsg036);
});

Then(/^BankUser checks remove application notification message$/, async function () {
    logger.info('Check remove application selected notification message');
    const expectedMsg010 = `Are you sure you wish to remove the selected Applications?`;
    expect((await helper.getElementText(viewCaasOrgPage.selectors.modifyOrg.modifyOrgDialog.confirmationMessageLine1))).to.equal(expectedMsg010);
});

Then(/^BankUser checks remove application with active users notification message$/, async function () {
    logger.info('Check remove application with active users selected notification message');
    const expectedMsg012 = `The selected Application has one or more active users and cannot be removed.`;
    expect((await helper.getElementText(viewCaasOrgPage.selectors.modifyOrg.modifyOrgDialog.notificationMessage))).to.equal(expectedMsg012);
});

Then(/^BankUser checks delete notification message when org has applications or users$/, async function() {
    logger.info('Check delete org with users or applications notification message');
    const msg_035 = `Only CAAS Org's that have no associated Users and no Applications assigned to them can be deleted.`;
    expect((await helper.getElementText(viewCaasOrgPage.selectors.modifyOrg.modifyOrgDialog.notificationMessage))).to.equal(msg_035);
});

Then(/^Bankuser checks all Applications removed notification$/, async function () {
    logger.info('Check all Applications removed notification message');
    const expectedMsg034 = `You have removed all Applications from this CAAS Org. Please consider deleting this CAAS Org if it is no longer required.`;
    expect((await helper.getElementText(viewCaasOrgPage.selectors.modifyOrg.modifyOrgDialog.notificationMessage))).to.equal(expectedMsg034);
});

Then(/^BankUser clicks "(Ok|Yes|No)" on the confirmation dialog on modify CAAS Org Screen$/, async function (button) {
    const selector = (button === 'No') ? viewCaasOrgPage.selectors.modifyOrg.modifyOrgDialog.noButton :
        viewCaasOrgPage.selectors.modifyOrg.modifyOrgDialog.yesButton;
    logger.info(`Clicking ${button} button`);
    await helper.click(selector);
});

Then(/^check "(orgName|bin)" (data validation|mandatory field) error on modify Org screen$/, async function(field, type) {
    logger.info(`Check ${field} ${type} error on modify org screen`)
     if (field === 'orgName') {
      const orgNameMsg = (await helper.getElementText(viewCaasOrgPage.selectors.orgNameDataErrMsg)).trim();
      if (type === 'data validation') {
        expect(orgNameMsg).to.equal(viewCaasOrgPage.screenMessages.orgNameErrMsg);
      } else {
        expect(orgNameMsg).to.equal(viewCaasOrgPage.screenMessages.orgNameMandatoryMsg);
      }
    } else {
      const binMsg = (await helper.getElementText(viewCaasOrgPage.selectors.binDataErrMsg)).trim();
      if (type === 'data validation') {
        expect(binMsg).to.equal(viewCaasOrgPage.screenMessages.binErrMsg);
      } else {
        expect(binMsg).to.equal(viewCaasOrgPage.screenMessages.binMandatoryMsg);
      }
    }
});

Then(/^BankUser clicks on Submit button for Org Modification with blank fields and click Yes on confirmation$/, async function (){
    await helper.click(viewCaasOrgPage.selectors.submit);  
    await helper.click(viewCaasOrgPage.selectors.modifyOrg.modifyOrgDialog.yesButton);
});


Then(/^BankUser (deletes|edits) the "(\d+)(?:st|nd|rd|th)" entry from "(Actions|Context)" menu$/, async function(action, n, menu){
    await helper.waitUntilTextInElement(searchCaasOrgPage.getCellSelectorByRowAndColumn(n, 3), 20);
    await helper.click(searchCaasOrgPage.getSelectorOfNthItemInSearchResultsGrid(n));
    await helper.waitForTextInAttribute(searchCaasOrgPage.getSelectorOfNthItemInSearchResultsGrid(n), 'class', 'active', 5);

    //Save data for later
    this.searchOrgResultEntry = {	
        id: await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(n, 1)),	
        fullName: await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(n, 2)),	
        bin: await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(n, 3)),	
        status: await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(n, 4)),	
        workflow: await helper.getElementText(searchCaasOrgPage.getCellSelectorByRowAndColumn(n, 5)),	
    };	

    if (menu === 'Actions') {
        logger.info(`${action} entity from Actions menu`);
        const selector = (action === 'deletes') ? MenuBar.selectors.actionsMenu.delete : MenuBar.selectors.actionsMenu.edit;
        await helper.click(MenuBar.selectors.actionsMenu.menuButton);
        await helper.waitForDisplayed(selector);
        await helper.click(selector);
      } else {
        logger.info(`${action} entity from Context menu`);
        const selector = (action === 'deletes') ? searchCaasOrgPage.selectors.contextMenu.delete : searchCaasOrgPage.selectors.contextMenu.edit;
        await helper.rightClick(searchCaasOrgPage.getSelectorOfNthItemInSearchResultsGrid(n), selector);
      }
});
