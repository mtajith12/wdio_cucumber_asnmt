import { Then } from 'cucumber';
import {} from "lodash";
import { MenuBar } from 'src/MenuBarPage';
import { expect } from "chai";
import { helper } from "src/Helper";
import { getLogger } from "log4js";
import _ = require('lodash');
import { userEntitlementsAssignmentPage } from 'src/UserEntitlementsAssignmentPage';
import { viewOimUserPage } from 'src/ViewOimUserPage';
import { newUserPage } from 'pages/NewUserPage';
import { DBConnection } from 'src/DBConnection';
const logger = getLogger();
logger.level = 'info';

async function getUserDataFromScenario(data1, data2) {
    let userData;
    if (!data1) {
        const userId = await viewOimUserPage.getUserIDInPageHeader();
        if (data2 && data2.length > 0) {
            for (let user of data2) {
                if (user.userId.toUpperCase() === userId) {
                    userData = user;
                    break;
                }
            }
        }
    } else {
        userData = data1;
    }
  return userData;
}

Then(/^BankUser moves from Security Devices page to Assign Entitlements page$/, async function() {
  logger.info('Moving from Security Devices page to User Entitlement page');
  await helper.click(MenuBar.selectors.continue);
});

Then(/^BankUser moves from Assign Entitlements page to User Notifications page$/, async function() {
  logger.info('Moving from Assign Entitlements page to User Notifications page');
  await helper.click(MenuBar.selectors.continue);
  expect(await helper.getElementText(userEntitlementsAssignmentPage.selectors.header)).to.contain('User Notifications')
});

Then(/^BankUser verifies the elements on User Entitlement page$/, async function() {
    logger.info('Checking elements on Assign Entitlements screen');
    expect(await helper.getElementText(userEntitlementsAssignmentPage.selectors.header)).to.equal('Assign Entitlements');
    logger.info('Checked Assign Entitlements header screen');
    expect(await helper.getElementText(userEntitlementsAssignmentPage.selectors.replicatefromExistingUserHeader)).to.equal('Replicate from Existing User');
    logger.info('Checked Replicate from Existing User header');
    expect(await helper.getElementText(userEntitlementsAssignmentPage.selectors.userIDLabel)).to.equal('User ID');
    logger.info('Checked User ID Label');
    expect(await helper.getElementText(userEntitlementsAssignmentPage.selectors.EntitlementsSpan)).to.equal('Entitlements');
    logger.info('Checked Entitlements Label');
    expect(await helper.getElementText(userEntitlementsAssignmentPage.selectors.noEntitlementsSelectedMessage)).to.equal(userEntitlementsAssignmentPage.screenMessages.msg007);
    logger.info('Checked No Entitlements Selected msg');
    expect(await helper.ifElementDisplayed(userEntitlementsAssignmentPage.selectors.addEntitlementButton)).to.equal(true);
    expect(await helper.ifElementDisplayed(userEntitlementsAssignmentPage.selectors.removeEntitlementButton)).to.equal(true);
    expect(await helper.ifElementDisplayed(userEntitlementsAssignmentPage.selectors.searchUserID)).to.equal(true);
    expect(await helper.ifElementDisplayed(userEntitlementsAssignmentPage.selectors.clearUserID)).to.equal(false);
});

Then(/^Bankuser adds "(Cash Management|Loan|Customer Administration|FX Overlay|Clearing Services|Commercial Cards)" Entitlement with data:$/, async function(entitlementType, data) {
    logger.info('Adding Entitlements');
    const entitlementData = data.rowsHash();
    const paymentPurpose = entitlementData.paymentPurpose ? entitlementData.paymentPurpose : 'NA';
    // if "role" to be added is "Customized Role", then we need to add the Custom Role created via API, which is saved in this.rolesapi
    const roleName = (entitlementData['role'] === 'Customized Role') ? this.rolesapi.roleName : entitlementData['role'];
    const entitlement = await userEntitlementsAssignmentPage.addEntitlements(entitlementType, roleName, entitlementData['division'], entitlementData['paymentPurpose'], entitlementData['reportingAccounts']);
    entitlement['roleType'] = (entitlementData['role'] === 'Customized Role') ? 'Custom' : 'System';

    const userData = await getUserDataFromScenario(this.userData, this.users);  
    if (!userData['entitlementsUI']) userData['entitlementsUI'] = [];
    userData['entitlementsUI'].push(entitlement);
});

Then(/^Bankuser verifies entitlement with DivisionID as "(.*)", DivisionName as "(.*)", RoleName as "(.*)", RoleFamily as "(.*)" and RoleType as "(.*)"$/, async function(divisionID,divisionName,roleName,roleFamily,roleType) {
    logger.info('Checking entries in Entitlements Grid');
    const count = (await userEntitlementsAssignmentPage.getRolesInDisplayedResults()).length;
    for(var i = 1; i <= count; i++) {
        if(await userEntitlementsAssignmentPage.getRoleNameInEntitlementsGrid(i) === roleName) {
            expect(await userEntitlementsAssignmentPage.getDivisionIdInEntitlementsGrid(i)).to.equal(divisionID);
            expect(await userEntitlementsAssignmentPage.getDivisionNameInEntitlementsGrid(i)).to.equal(divisionName);
            expect(await userEntitlementsAssignmentPage.getRoleFamilyInEntitlementsGrid(i)).to.equal(roleFamily);
            expect(await userEntitlementsAssignmentPage.getRoleTypeInEntitlementsGrid(i)).to.equal(roleType);
            break;
        }
    }
});

Then(/^Bankuser verifies that entitlement with RoleName as "(.*)" does not exist in entitlements grid$/, async function(roleName) {
    // Cobra UI keeps the last entitlement entry in DOM, hiding behind "No entry found" message but isDisplayed() still returning true, even if removal action was done on this entry. 
    logger.info(`checking ${roleName} does not exist in the Entitlements Grid`);
    if ((await helper.ifElementDisplayed(userEntitlementsAssignmentPage.selectors.noEntitlementsSelectedMessage)) && (await helper.getElementText(userEntitlementsAssignmentPage.selectors.noEntitlementsSelectedMessage)) === 'No Record Found.') {
        logger.info('"no record found." message is displayed, so the entitlements grid is now empty');
    } else {
        const roleNames = await userEntitlementsAssignmentPage.getRolesInDisplayedResults();
        expect(roleNames.includes(roleName)).to.equal(false);    
    }
});

Then(/^checks that Authorisation Group section "(is not|is)" displayed$/, async function(aGDisplayed) {
    logger.info(`checking Authorisation Group section ${aGDisplayed} displayed`);
    if(aGDisplayed === 'is not') {
      expect(await helper.ifElementDisplayed(userEntitlementsAssignmentPage.selectors.authorisationGroupTitle)).to.equal(false);
      expect(await helper.ifElementDisplayed(userEntitlementsAssignmentPage.selectors.authorisationGroupLabel)).to.equal(false);
      expect(await helper.ifElementDisplayed(userEntitlementsAssignmentPage.selectors.authorisationGroupSelect)).to.equal(false);
      expect(await helper.ifElementDisplayed(userEntitlementsAssignmentPage.selectors.authorisationGroupMsg)).to.equal(false);
    }
    if(aGDisplayed === 'is') {
       expect(await helper.getElementText(userEntitlementsAssignmentPage.selectors.authorisationGroupTitle)).to.equal('Authorisation Group');
       expect(await helper.getElementText(userEntitlementsAssignmentPage.selectors.authorisationGroupLabel)).to.equal('Authorisation Group');
       expect(await helper.ifElementDisplayed(userEntitlementsAssignmentPage.selectors.authorisationGroupSelect)).to.equal(true);
       expect(await helper.getElementText(userEntitlementsAssignmentPage.selectors.authorisationGroupMsg)).to.equal(userEntitlementsAssignmentPage.screenMessages.aGMessage);
       const selector = userEntitlementsAssignmentPage.selectors.authorisationGroupSelect;
       let optionsAvailable = Array.from(userEntitlementsAssignmentPage.AuthorisationGroupOptionList);
         let defaultValue = '';
         let optionIdx = await helper.getElementAttribute(selector, 'value');
         let option = `${selector} option[value="${optionIdx}"]`;
         expect((await helper.getElementText(option)).trim()).to.equal(defaultValue);
          // checking the available options
          for (let i = 0; i < optionsAvailable.length; i++) {
             let option = `${selector} option[value="${optionsAvailable[i].trim()}"]`;
             expect(await helper.ifElementExists(option)).to.equal(true);
          }
    }
});

Then(/^checks that Authorisation Group section on View User screen "(is not|is)" displayed$/, async function(aGDisplayed) {
    logger.info('checking Authorisation Group section on view user page');
    if(aGDisplayed === 'is not') {
      expect(await helper.ifElementDisplayed(userEntitlementsAssignmentPage.selectors.authorisationGroupTitle)).to.equal(false);
      expect(await helper.ifElementDisplayed(userEntitlementsAssignmentPage.selectors.authorisationGroupLabel)).to.equal(false);
    }
    if(aGDisplayed === 'is') {
       expect(await helper.getElementText(userEntitlementsAssignmentPage.selectors.authorisationGroupTitle)).to.equal('Authorisation Group');
       expect(await helper.getElementText(userEntitlementsAssignmentPage.selectors.authorisationGroupLabel)).to.equal('Authorisation Group');
    }
});

Then(/^Bankuser select "(.*)" in Authorisation Group dropdown$/, async function(value) {
    logger.info('Entering data in authorisation group dropdown');
     await helper.selectByVisibleText(userEntitlementsAssignmentPage.selectors.authorisationGroupSelect, value);
});

Then(/^Bankuser select row "(.*)", click Remove entitlement button, check message and click "(No|Yes)" on confirmation popup$/, async function(rowNumber, action) {
    const roleName = await userEntitlementsAssignmentPage.getRoleNameInEntitlementsGrid(rowNumber);

    logger.info('Removing entitlement');
    await helper.click(userEntitlementsAssignmentPage.getCellSelectorByRowAndColumn(rowNumber,1));
    await helper.waitForTextInAttribute(userEntitlementsAssignmentPage.getCellSelectorByRowAndColumn(rowNumber, 1), 'class', 'active', 5);
    await helper.click(userEntitlementsAssignmentPage.selectors.removeEntitlementButton);
    expect(await helper.ifElementDisplayed(userEntitlementsAssignmentPage.selectors.removeEntitlementMsg1)).to.equal(true);
    expect(await helper.ifElementDisplayed(userEntitlementsAssignmentPage.selectors.removeEntitlementMsg2)).to.equal(true);

    if(action === "Yes") {

        await helper.click(userEntitlementsAssignmentPage.selectors.confirmButton);

        // remove the removed entitlements from user data
        const userData = await getUserDataFromScenario(this.userData, this.users);  
        if (userData['entitlementsUI'] && userData['entitlementsUI'].length > 0) {
            for (var i = 0; i < userData['entitlementsUI'].length; i++) {
                if (userData['entitlementsUI'][i]['roleName'] === roleName) {
                    userData['entitlementsUI'].splice(i, 1);
                    break;
                }
            }
        }
    } else if(action === "No") {
        await helper.click(userEntitlementsAssignmentPage.selectors.cancelButton);
    }
});

Then(/^Bankuser selects first 2 entitlements and remove them$/, async function() {
    logger.info('Removing multiple entitlements');
    await helper.click(userEntitlementsAssignmentPage.getCellSelectorByRowAndColumn(1,1));
    await helper.pressCtrlKeyDown();
    await helper.pause(1);
    await helper.click(userEntitlementsAssignmentPage.getCellSelectorByRowAndColumn(2,1));
    await helper.pause(1);
    await helper.releaseCtrlKey();
    await helper.click(userEntitlementsAssignmentPage.selectors.removeEntitlementButton);
    await helper.click(userEntitlementsAssignmentPage.selectors.confirmButton);
});

Then(/^Bankuser check that No Entitlements Selected message appears on screen$/, async function() {
     expect(await helper.getElementText(userEntitlementsAssignmentPage.selectors.noEntitlementsSelectedMessage)).to.equal('No Record Found.');
     logger.info('Checked No Entitlements Selected msg');
});

Then(/^Bankuser completes the user creation$/, async function() {
    await helper.click(MenuBar.selectors.continue);
    await helper.click(MenuBar.selectors.submit);
    logger.info('User created');
});

Then(/^Bankuser replicates entitlements from existing user$/, async function() {
    await helper.click(userEntitlementsAssignmentPage.selectors.searchUserID);
    await helper.click(userEntitlementsAssignmentPage.selectors.searchButtononSearchUserDialog);
    await userEntitlementsAssignmentPage.clickElement(userEntitlementsAssignmentPage.getCellSelectorFromSearchUserDialogByRowAndColumn(1,1));
    await helper.click(userEntitlementsAssignmentPage.selectors.okButton);
    logger.info('entitlements replicated');
});

Then(/^Bankuser select entitlement to replicate and click Cancel button on Search User Dialog$/, async function() {
    await helper.click(userEntitlementsAssignmentPage.selectors.searchUserID);
    await helper.click(userEntitlementsAssignmentPage.selectors.searchButtononSearchUserDialog);
    await userEntitlementsAssignmentPage.clickElement(userEntitlementsAssignmentPage.getCellSelectorFromSearchUserDialogByRowAndColumn(1,1));
    await helper.click(userEntitlementsAssignmentPage.selectors.cancelBtn);
    logger.info('User selected and then cancel button clicked on Search USer dialog');
});

Then(/^Bankuser verifies that no existing user is available to replicate entitlements$/, async function() {
    await helper.click(userEntitlementsAssignmentPage.selectors.searchUserID);
    await helper.click(userEntitlementsAssignmentPage.selectors.searchButtononSearchUserDialog);
    expect(await helper.getElementText(userEntitlementsAssignmentPage.selectors.noResultsMessageOnUserSearchDialog)).to.equal("No Record Found.");
    logger.info('No existing user is available to replicate entitlements from');
});

Then(/^Bankuser clears userID$/, async function() {
    await helper.click(userEntitlementsAssignmentPage.selectors.clearUserID);
    logger.info('User ID cleared');
});

Then(/^Bankuser removes entitlement with role as "(.*)"$/, async function(role) {
    let numberOfRecords = (await userEntitlementsAssignmentPage.getRolesInDisplayedResults()).length;
    for(var i = 1; i<=numberOfRecords; i++) {
        if(await helper.getElementText(userEntitlementsAssignmentPage.getCellSelectorByRowAndColumn(i,3))=== role) {
            await helper.click(userEntitlementsAssignmentPage.getCellSelectorByRowAndColumn(i,1));
            let n=0;
            while((await helper.getElementAttribute(userEntitlementsAssignmentPage.getCellSelectorByRowAndColumn(i,1), 'class')).search('selected') == -1) {
                 if(n==30) break;
                 await helper.pause(.1);
                 n=n+1;
            }
            logger.info(`Removing entitlement ${role}`);
            await helper.click(userEntitlementsAssignmentPage.selectors.removeEntitlementButton);
            await userEntitlementsAssignmentPage.clickElement(userEntitlementsAssignmentPage.selectors.confirmButton);

            // remove the removed entitlements from user data
            const userData = await getUserDataFromScenario(this.userData, this.users);  
            if (userData['entitlementsUI'] && userData['entitlementsUI'].length > 0) {
                for (var i = 0; i < userData['entitlementsUI'].length; i++) {
                    if (userData['entitlementsUI'][i]['roleName'] === role) {
                        userData['entitlementsUI'].splice(i, 1);
                        break;
                    }
                }           
            }
            break;
        }
    }
});

// modify "system" entitlement role
Then(/^Bankuser modifies entitlement with role as "(.*)" to "(.*)" Entitlement with data:$/, async function(currentRole, newEntitlementType, data) {
    const entitlementData = data.rowsHash();
    await helper.waitForDisplayed(userEntitlementsAssignmentPage.selectors.removeEntitlementButton);
    let numberOfRecords = (await userEntitlementsAssignmentPage.getRolesInDisplayedResults()).length;

    for(var i = 1; i <= numberOfRecords; i++) {
        if((await userEntitlementsAssignmentPage.getRoleNameInEntitlementsGrid(i)) === currentRole) {
            await helper.doubleClick(userEntitlementsAssignmentPage.getCellSelectorByRowAndColumn(i,1));
            await helper.waitForDisplayed(userEntitlementsAssignmentPage.selectors.roleSelectInDialog);
            const selectedDivision = await userEntitlementsAssignmentPage.modifyManagementEntitlements(entitlementData['role'], entitlementData['division'], entitlementData['paymentPurpose'], entitlementData['reportingAccounts']);
            // update the user data with the modififed entitlement
            const userData = await getUserDataFromScenario(this.userData, this.users);          
            if (userData['entitlementsUI'] && userData['entitlementsUI'].length > 0) {
                for (var i = 0; i < userData['entitlementsUI'].length; i++) {
                    if (userData['entitlementsUI'][i]['roleName'] === currentRole) {
                        userData['entitlementsUI'][i] = {"roleName": entitlementData['role'], "divisionId": selectedDivision, "divisionName": selectedDivision, "roleFamily": newEntitlementType, "roleType": "System"}
                        break;
                    }
                }
            }
            break;
        }
     }
});

Then(/^BankUser enters Customer created from UI and hits ENTER$/, async function() {
    const id = this.data.customerId;
    logger.info(`Enter Customer ID Ayahoo: ${id} and hit Enter`);
    const selector = newUserPage.selectors.customerIdInput;
     await helper.inputText(selector, id);
     await helper.enterReturnFromKeyboard();
});

Then(/^BankUser clicks on "Add Entitlement" button and checks Add Entitlement dialog is displayed$/, async function() {
    logger.info('Click on "Add Entitlements" button');
    await helper.click(userEntitlementsAssignmentPage.selectors.addEntitlementButton);
    await helper.waitForDisplayed(userEntitlementsAssignmentPage.selectors.roleSelectInDialog);
});

Then(/^Bankuser clicks on "Remove Entitlement" button without selecting an entitlement row and checks error message$/, async function() {
    logger.info('Click on "Remove Entitlements" button');
    await helper.click(userEntitlementsAssignmentPage.selectors.removeEntitlementButton);
    await helper.waitForTextInElement(userEntitlementsAssignmentPage.selectors.notificationMsg, userEntitlementsAssignmentPage.screenMessages.msg_193);
    logger.info('Dismiss the error message dialog');
    await helper.click(userEntitlementsAssignmentPage.selectors.confirmButton);
});

Then(/^BankUser cancels adding entitlement then clicks on "(Yes|No)" in the confirmation dialog$/, async function(yesNo) {
    logger.info('Cancel adding entitlement and check confirmation message');
    await helper.click(userEntitlementsAssignmentPage.selectors.cancelBtn);
    await helper.waitForTextInElement(userEntitlementsAssignmentPage.selectors.confirmationMsgCancelConfirmationDialog, MenuBar.msg_051);
    await helper.click(yesNo === 'Yes' ? userEntitlementsAssignmentPage.selectors.confirmButton : userEntitlementsAssignmentPage.selectors.cancelButton);
});

Then(/^check the User entitlements in CA for the "(\d+)(?:st|nd|rd|th)" API created User$/, async function (n) {
    const user_id =this.users[n - 1].userId;
    const query = `Select * from table ( CA_OWNER.CUSTUSERENT.getent('${user_id}', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'N'))`;
    const results = await DBConnection.run(query);
    console.log(JSON.stringify(results));
    expect(results.length > 0);
  });

Then(/^Bankuser modifies User's Customized "(.*)" Entitlement role with data:$/, async function(roleFamily, data) {
  const modifyData = data.rowsHash();
  const userData = await getUserDataFromScenario(this.userData, this.users);
  let currentRoleName;
  var i;       
  for (i = 0; i < userData.entitlementsUI.length; i++) {
    if (userData.entitlementsUI[i].roleType === 'Custom') {
      currentRoleName = userData.entitlementsUI[i].roleName;
      break;
    }
  }

  await helper.doubleClick(userEntitlementsAssignmentPage.getRoleSelectorByRoleName(currentRoleName));
  await helper.waitForDisplayed(userEntitlementsAssignmentPage.selectors.roleSelectInDialog);
  const newRole = modifyData['role'] ? modifyData['role'] : currentRoleName;
  const divisionId = await userEntitlementsAssignmentPage.addEntitlementsAttributes(newRole, modifyData['division'], modifyData['paymentPurpose'], modifyData['reportingAccounts']);
  console.log(`division after modify: ${divisionId}`)
  const roleType = (modifyData['role'] && modifyData['role'] !== 'Customized Role') ? 'System' : 'Custom';

  userData.entitlementsUI[i] = {"roleName": newRole, "divisionId": divisionId, "divisionName": divisionId, "roleFamily": roleFamily, "roleType": roleType};
});