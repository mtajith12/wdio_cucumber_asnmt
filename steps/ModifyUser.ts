import { Given, When, Then } from 'cucumber';
import * as _ from 'lodash';
import { viewOimUserPage } from 'src/ViewOimUserPage';
import { expect } from 'chai';
import { helper } from 'src/Helper';
import { getLogger } from 'log4js';
import { randomData } from 'src/RandomData';
const logger = getLogger();
logger.level = 'info';

Given(/^skip step$/, function() {
});

Then(/^check modifiable fields for API created "(New|Enabled|Disabled)" user and "(.*)" bankuser$/, async function (status, role) {
    logger.info('Checking editable fields');
    const userId = await helper.getElementText(viewOimUserPage.selectors.caasUserIdValue);
    let index;
    for (let user of this.users) {
        if (userId === user['userId'].toUpperCase()) {
            index = this.users.indexOf(user);
            break;
        }
    }
    let userData = this.users[index];

    if (role === 'Registration Officer (Pilot)') {
        if (status === 'New') {
            expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.userIdInput)).to.be.true;
            expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.caasOrgIdSearch)).to.be.true;
        }
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.firstNameInput)).to.be.true;
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.middleNameInput)).to.be.true;
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.surNameInput)).to.be.true;
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.prefFirstNameInput)).to.be.true;
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.dobInput)).to.be.true;
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.prefLangSelect)).to.be.true;
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.kycIdInput)).to.be.true;
        if (userData.managedBy) {
            expect(await helper.ifElementEnabled(viewOimUserPage.selectors.modifyUser.managedByYes)).to.be.false;
            expect(await helper.ifElementEnabled(viewOimUserPage.selectors.modifyUser.managedByNo)).to.be.false;
        } else {
            expect(await helper.ifElementEnabled(viewOimUserPage.selectors.modifyUser.managedByYes)).to.be.true;
            expect(await helper.ifElementEnabled(viewOimUserPage.selectors.modifyUser.managedByNo)).to.be.true;
        }
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.customerIdSearch)).to.be.true;


        logger.info('Check the modifiable field values in details tab, "Contact Details" section');
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.address1Input)).to.be.true;
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.address2Input)).to.be.true;
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.suburbInput)).to.be.true;
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.stateInput)).to.be.true;
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.postcodeInput)).to.be.true;
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.countrySelect)).to.be.true;
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.emailInput)).to.be.true;
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.mobCallingCodeSelect)).to.be.true;
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.mobNumberInput)).to.be.true;
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.otherCallingCodeSelect)).to.be.true;
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.otherPhoneInput)).to.be.true;

        if (['Enabled', 'Disabled'].includes(status)) {
            expect(await helper.getElementText(viewOimUserPage.selectors.userIdValue)).to.equal(userData.userId.toUpperCase());
            expect(await helper.getElementText(viewOimUserPage.selectors.caasUserIdValue)).to.equal(userData.userId.toUpperCase());
            expect(await helper.getElementText(viewOimUserPage.selectors.aliasIdValue)).to.equal(userData.aliasId ? userData.aliasId : '');
            expect(await helper.getElementText(viewOimUserPage.selectors.modifyUser.caasOrgIdValue)).to.equal(userData.caasOrg.orgId);
        }

        if (!_.isEmpty(userData.customer)) {
            //expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.customerNameValue)).to.be.true;
            expect(await helper.getElementText(viewOimUserPage.selectors.modifyUser.customerNameValue)).to.equal(userData.customer.customerName);
        }

        expect(await helper.getElementText(viewOimUserPage.selectors.modifyUser.caasOrgNameValue)).to.equal(userData.caasOrg.orgName);
    }
    if (role === 'Implementation Manager') {
        if (status === 'New') expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.caasOrgIdSearch)).to.be.true;
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUser.customerIdSearch)).to.be.true;

        logger.info('Check the field values in details tab, "General Details" section');
        expect(await helper.getElementText(viewOimUserPage.selectors.userIdValue)).to.equal(userData.userId.toUpperCase());
        expect(await helper.getElementText(viewOimUserPage.selectors.caasUserIdValue)).to.equal(userData.userId.toUpperCase());
        expect(await helper.getElementText(viewOimUserPage.selectors.aliasIdValue)).to.equal(userData.aliasId ? userData.aliasId : '');
        expect(await helper.getElementText(viewOimUserPage.selectors.firstNameValue)).to.equal(userData.firstName);
        expect(await helper.getElementText(viewOimUserPage.selectors.middleNameValue)).to.equal(userData.middleName ? userData.middleName : '');
        expect(await helper.getElementText(viewOimUserPage.selectors.surNameValue)).to.equal(userData.surName);
        expect(await helper.getElementText(viewOimUserPage.selectors.prefFirstNameValue)).to.equal(userData.prefFirstName ? userData.prefFirstName : userData.firstName);
        expect(await helper.getElementText(viewOimUserPage.selectors.dobValue)).to.equal('XXXXXXXX');
        expect(await helper.getElementText(viewOimUserPage.selectors.prefLangValue)).to.equal(userData.prefLang);
        expect(await helper.getElementText(viewOimUserPage.selectors.kycIdValue)).to.equal(userData.kycId ? userData.kycId : '');
        expect(await helper.ifElementEnabled(viewOimUserPage.selectors.modifyUser.managedByYes)).to.be.false;
        expect(await helper.ifElementEnabled(viewOimUserPage.selectors.modifyUser.managedByNo)).to.be.false;


        logger.info('Check the field values in details tab, "Contact Details" section');
        let n = 1;
        if (userData.concatenatedAddr && userData.concatenatedAddr !== '') {
            let addrVals = [await viewOimUserPage.getNthRowTextInAddressValue(n)];
            if ((await viewOimUserPage.getNthRowTextInAddressValue(n + 1)) !== '') addrVals.push(await viewOimUserPage.getNthRowTextInAddressValue(n + 1));
            addrVals.push(await viewOimUserPage.getNthRowTextInAddressValue(n + 2));
            if ((await viewOimUserPage.getNthRowTextInAddressValue(n + 3)) !== '') addrVals.push(await viewOimUserPage.getNthRowTextInAddressValue(n + 3));
            if ((await viewOimUserPage.getNthRowTextInAddressValue(n + 4)) !== '') addrVals.push(await viewOimUserPage.getNthRowTextInAddressValue(n + 4));
            addrVals.push(await helper.getElementText(viewOimUserPage.selectors.countryValue));
            const userAddress = addrVals.join(', ');
            expect(userAddress).to.equal(userData.concatenatedAddr);
        } else {
            expect(await viewOimUserPage.getNthRowTextInAddressValue(n)).to.equal(userData.address.addressLine1);
            expect(await viewOimUserPage.getNthRowTextInAddressValue(n + 1)).to.equal(userData.address.addressLine2 ? userData.address.addressLine2 : '');
            expect(await viewOimUserPage.getNthRowTextInAddressValue(n + 2)).to.equal(userData.address.suburbOrCity);
            expect(await viewOimUserPage.getNthRowTextInAddressValue(n + 3)).to.equal(userData.address.stateOrProvince ? userData.address.stateOrProvince : '');
            expect(await viewOimUserPage.getNthRowTextInAddressValue(n + 4)).to.equal(userData.address.postalCode ? userData.address.postalCode : '');
            expect(await helper.getElementText(viewOimUserPage.selectors.countryValue)).to.equal(userData.address.country);
        }
        expect(await helper.getElementText(viewOimUserPage.selectors.emailValue)).to.equal(userData.email ? userData.email : '');
        expect(await helper.getElementText(viewOimUserPage.selectors.mobileValue)).to.equal(userData.mobile ? `${userData.mobile.country} ${userData.mobile.number}` : '');
        expect(await helper.getElementText(viewOimUserPage.selectors.otherPhoneValue)).to.equal(userData.otherPhone ? `${userData.otherPhone.country} ${userData.otherPhone.number}` : '');
    }

    logger.info('Check the field values in details tab, "Account Status" section');
    expect(await helper.getElementText(viewOimUserPage.selectors.userVerifiedLabel)).to.equal('User Verified?');
    expect(await helper.getElementText(viewOimUserPage.selectors.verifiedOnLabel)).to.equal('Verified On');
    expect(await helper.getElementText(viewOimUserPage.selectors.passwordGeneratedLabel)).to.equal('Password Generated?');
    expect(await helper.getElementText(viewOimUserPage.selectors.accountLockedLabel)).to.equal('User account locked?');
    expect(await helper.getElementText(viewOimUserPage.selectors.pwdChangeLabel)).to.equal('Password change required at next login?');
    expect(await helper.getElementText(viewOimUserPage.selectors.selfServiceLockedLabel)).to.equal('Self Service Locked?');
    expect(await helper.getElementText(viewOimUserPage.selectors.selfServiceAttemptsLabel)).to.equal('Number of Self Service Attempts Left');
    expect(await helper.getElementText(viewOimUserPage.selectors.userVerifiedValue)).to.equal('No');
    if (userData.managedBy) {
        expect(await helper.getElementText(viewOimUserPage.selectors.verifiedOn)).to.equal('Not Verified');
    } else {
        expect(await helper.getElementText(viewOimUserPage.selectors.verifiedOn)).to.equal('N/A');
    }
    
    expect(await helper.getElementText(viewOimUserPage.selectors.passwordGeneratedValue)).to.equal('No');
    if (status === 'New') {
        expect(await helper.getElementText(viewOimUserPage.selectors.accountLockedValue)).to.equal('');
        expect(await helper.getElementText(viewOimUserPage.selectors.pwdChangeValue)).to.equal('');
    } else {
        expect(await helper.getElementText(viewOimUserPage.selectors.accountLockedValue)).to.equal('No');
        expect(await helper.getElementText(viewOimUserPage.selectors.pwdChangeValue)).to.equal('Yes');
    }
    expect(await helper.getElementText(viewOimUserPage.selectors.selfServiceLockedValue)).to.equal('No');
    expect(await helper.getElementText(viewOimUserPage.selectors.selfServiceAttemptsValue)).to.equal('3');
});

Then(/^BankUser clicks on "Edit" button on User Details page$/, async function () {
    await helper.click(viewOimUserPage.selectors.edit);
    // wait for the page go into edit mode and settle
    await helper.waitForElementToAppear(viewOimUserPage.selectors.modifyUser.customerIdSearch, 5);
    await helper.waitForElementToAppear(viewOimUserPage.selectors.modifyUser.caasOrgNameValue, 5);
});

Then(/^BankUser clears Customer ID and selects "(Yes|No)" on confirmation message$/, async function (btn) {
    logger.info('Click on Clear Customer ID button');
    await helper.waitForEnabled(viewOimUserPage.selectors.modifyUser.customerIdClear);
    await helper.click(viewOimUserPage.selectors.modifyUser.customerIdClear);
    await helper.waitForTextInElement(viewOimUserPage.selectors.customerIdClearConfirmationMsg, viewOimUserPage.screenMessages.msg_053, 5);

    if (btn === 'Yes') {
        await helper.waitForEnabled(viewOimUserPage.selectors.yesBtnOnConfirmationPopup);
        await helper.click(viewOimUserPage.selectors.yesBtnOnConfirmationPopup);
        await helper.waitForElementToDisAppear(viewOimUserPage.selectors.modifyUser.customerNameValue, 2);
    } else if (btn === 'No') {
        await helper.click(viewOimUserPage.selectors.noBtnOnConfirmationPopup);
    }
});

Then(/^checks user details are not modified$/, async function () {

    const userId = await helper.getElementText(viewOimUserPage.selectors.caasUserIdValue);
    let index;
    for (let user of this.users) {
        if (userId === user['userId'].toUpperCase()) {
            index = this.users.indexOf(user);
            break;
        }
    }
    let userData = this.users[index];


    expect(await helper.getElementAttribute(viewOimUserPage.selectors.modifyUser.customerIdValue, 'value')).to.equal(userData.customer.customerId);
    expect(await helper.getElementText(viewOimUserPage.selectors.modifyUser.customerNameValue)).to.equal(userData.customer.customerName);
});

Then(/^checks Modify User screen after clearing Customer ID for "(New|Existing)" user$/, async function (userStatus) {
    const userId = await helper.getElementText(viewOimUserPage.selectors.caasUserIdValue);
    let index;
    for (let user of this.users) {
        if (userId === user['userId'].toUpperCase()) {
            index = this.users.indexOf(user);
            break;
        }
    }
    let userData = this.users[index];

    if (userStatus === 'New') {
        logger.info('Checking Modify User fields are as per AAMS-2250-03');
        await helper.waitForElementToDisAppear(viewOimUserPage.selectors.modifyUser.caasOrgNameValue, 5);
        expect(await helper.ifElementEnabled(viewOimUserPage.selectors.modifyUser.customerIdValue)).to.be.true;
        expect(await helper.waitForExist(viewOimUserPage.selectors.modifyUser.customerNameValue, 2, true));
        expect(await helper.waitForExist(viewOimUserPage.selectors.modifyUser.customerIdClear, 2, true));
        expect(await helper.ifElementEnabled(viewOimUserPage.selectors.modifyUser.caasOrgIdInputValue)).to.be.true;
        expect(await helper.waitForExist(viewOimUserPage.selectors.modifyUser.caasOrgNameValue, 2, true));
        expect(await helper.waitForExist(viewOimUserPage.selectors.modifyUser.caasOrgClear, 2, true));

        logger.info('Checking applications ');
        await helper.click(viewOimUserPage.selectors.applicationsTab);
        await helper.waitForDisplayed(viewOimUserPage.selectors.selectedApplicationsGrid);
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUserApp.noApplicationsMsg)).to.be.true;
        expect(await helper.waitForExist(viewOimUserPage.selectors.entitlementsTab, 2, true));
    }
    else if (userStatus === 'Existing') {
        logger.info('Checking Modify User fields are as per AAMS-2250-04');
        expect(await helper.ifElementEnabled(viewOimUserPage.selectors.modifyUser.customerIdValue)).to.be.true;
        expect(await helper.waitForExist(viewOimUserPage.selectors.modifyUser.customerNameValue, 2, true));
        expect(await helper.waitForExist(viewOimUserPage.selectors.modifyUser.customerIdClear, 2, true));

        expect(await helper.getElementText(viewOimUserPage.selectors.modifyUser.caasOrgIdValue)).to.equal(userData.caasOrg.orgId);
        expect(await helper.getElementText(viewOimUserPage.selectors.modifyUser.caasOrgNameValue)).to.equal(userData.caasOrg.orgName);
        expect(await helper.waitForExist(viewOimUserPage.selectors.entitlementsTab, 2, true));

        await helper.click(viewOimUserPage.selectors.applicationsTab);
        await viewOimUserPage.selectApplicationInGrid('Transactive Global');
        await helper.waitForTextToDisappearInAttribute(viewOimUserPage.selectors.modifyUserApp.removeAppBtn, 'class', 'disabled', 2);
        await helper.click(viewOimUserPage.selectors.modifyUserApp.removeAppBtn);
        expect(await helper.getElementText(viewOimUserPage.selectors.modifyUserApp.removeApplicationsConfirmationMsg)).to.equal(viewOimUserPage.screenMessages.msg010);
        await helper.click(viewOimUserPage.selectors.yesBtnOnConfirmationPopup);

    }
});

Then(/^checks Modify User screen after clearing CAAS Org ID for New user$/, async function () {
    expect(await helper.ifElementEnabled(viewOimUserPage.selectors.modifyUser.caasOrgIdInputValue)).to.be.true;
    expect(await helper.waitForExist(viewOimUserPage.selectors.modifyUser.caasOrgNameValue, 2, true));
    expect(await helper.waitForExist(viewOimUserPage.selectors.modifyUser.caasOrgClear, 2, true));
    logger.info('Checking applications ');
    await helper.click(viewOimUserPage.selectors.applicationsTab);
    await helper.waitForDisplayed(viewOimUserPage.selectors.selectedApplicationsGrid);
    expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.modifyUserApp.noApplicationsMsg)).to.be.true;
    await helper.click(viewOimUserPage.selectors.detailsTab);
});

Then(/^check \"Transactive Global\" has been assigned on Applications tab$/, async function() {
    await helper.click(viewOimUserPage.selectors.applicationsTab);
    logger.info('Check TG has been added in the Applications Grid by default');
    expect(await viewOimUserPage.findAppInAppTable('Transactive Global')).to.equal(1);
    expect(await viewOimUserPage.getAppStatusInGrid(1)).to.equal('New');
    await helper.screenshot(`TGAssignedByDefault`);
  });

Then(/^check \"Transactive Global\" cannot be removed after assigning Customer ID$/, async function() {
    await viewOimUserPage.selectApplicationInGrid('Transactive Global');
    await helper.waitForTextInAttribute(viewOimUserPage.selectors.modifyUserApp.removeAppBtn, 'class', 'disabled', 2);
});

Then (/^BankUser selects a different (Other |)Country Calling Code$/, async function(other) {
    if (other) {
        await viewOimUserPage.selectRandomDropdown(viewOimUserPage.selectors.modifyUser.otherCallingCodeSelect);
        expect(await helper.getElementValue(viewOimUserPage.selectors.modifyUser.otherPhoneInput)).to.be.empty;
    } else {
        await viewOimUserPage.selectRandomDropdown(viewOimUserPage.selectors.modifyUser.mobCallingCodeSelect);
        expect(await helper.getElementValue(viewOimUserPage.selectors.modifyUser.mobNumberInput)).to.be.empty;
    }
});

Then(/^check the entered User data are retained on Modify User screen$/, async function() {
    logger.info('Check the entered User data are retained on Modify User screen');
    if (this.userData.status === 'New') expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.userIdInput))).to.equal(this.userData.userId);
    expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.firstNameInput))).to.equal(this.userData.firstName);
    if (this.userData.middleName) expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.middleNameInput))).to.equal(this.userData.middleName);
    expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.surNameInput))).to.equal(this.userData.surName);
    if (this.userData.prefFirstName) expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.prefFirstNameInput))).to.equal(this.userData.prefFirstName);
    expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.dobInput))).to.equal(this.userData.dob);
    expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.prefLangSelect))).to.equal(this.userData.prefLang);
    if (this.userData.kycId) expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.kycIdInput))).to.equal(this.userData.kycId);
    if (this.userData.customer.customerId) expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.customerIdValue))).to.equal(this.userData.customer.customerId);
    expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.caasOrgIdInputValue))).to.equal(this.userData.caasOrg.orgId);
    expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.address1Input))).to.equal(this.userData.address.addressLine1);
    if (this.userData.address.addressLine2) expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.address2Input))).to.equal(this.userData.address.addressLine2);
    expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.suburbInput))).to.equal(this.userData.address.suburbOrCity);
    if (this.userData.address.stateOrProvince) expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.stateInput))).to.equal(this.userData.address.stateOrProvince);
    if (this.userData.address.postalCode) expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.postcodeInput))).to.equal(this.userData.address.postalCode);
    // TODO: fix this 
    // expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.countrySelect))).to.equal(this.userData.address.country);
    if (this.userData.email) expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.emailInput))).to.equal(this.userData.email);
    if (this.userData.mobile.country) expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.mobCallingCodeSelect))).to.equal(this.userData.mobile.country);
    if (this.userData.mobile.number) expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.mobNumberInput))).to.equal(this.userData.mobile.number.toString());
    if (this.userData.otherPhone.country) expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.otherCallingCodeSelect))).to.equal(this.userData.otherPhone.country);
    if (this.userData.otherPhone.number) expect((await helper.getElementValue(viewOimUserPage.selectors.modifyUser.otherPhoneInput))).to.equal(this.userData.otherPhone.number.toString());
});

Then(/^BankUser updates all user details with new values$/, async function() {
    await helper.waitForTextInAttribute(viewOimUserPage.selectors.modifyUser.firstNameInput, 'value', this.userData.firstName);
    // wait for input boxes to be editable
    await helper.pause(1);
    let userStatus = {};
    userStatus['status'] = this.userData.status;
    userStatus['workflow'] = this.userData.workflow;
    userStatus['caasOrg'] = {orgId: this.userData.caasOrg.orgId, orgName: this.userData.caasOrg.orgName};
    // save original details to array
    //this.originalUserData = this.userData;
    this.originalUserData = _.cloneDeep(this.userData);
    if (this.userData.status === 'New') {
        var newUserData = await viewOimUserPage.fillInUserDetails(userStatus, true);
        _.merge(this.userData, newUserData);
    } else {
        userStatus['userId'] = this.userData.userId;
        var newUserData = await viewOimUserPage.fillInUserDetails(userStatus, false);
        _.merge(this.userData, newUserData);
    }    
})

Then(/^BankUser clicks on "Submit" button for User Modification for the "(\d+)(?:st|nd|rd|th)" API created User, then clicks "(Yes|No)" on the confirmation$/, async function (n, yesNo) {
    logger.info(`Bankuser clicks on Submit button`);
    await helper.click(viewOimUserPage.selectors.modifyUser.submitBtn);
    const expectedMsg = `This will submit User: ${this.users[n - 1].firstName} ${this.users[n - 1].surName} (${this.users[n - 1].userId}) to be modified.`;
    expect(await helper.getElementText(viewOimUserPage.selectors.modifyUser.modifyUserDialog.confirmationMessageLine1)).to.equal(expectedMsg);

    if (yesNo === 'Yes') {
        await helper.click(viewOimUserPage.selectors.yesBtnOnConfirmationPopup);
        this.users[n - 1].version++;
    } else {
        await helper.click(viewOimUserPage.selectors.noBtnOnConfirmationPopup);
    }
  });

Then(/^BankUser clicks on "Submit" button for User Modification for UI created user and clicks "(Yes|No)" on the confirmation$/, async function (yesNo) {
    logger.info(`Bankuser clicks on Submit button`);
    await helper.click(viewOimUserPage.selectors.modifyUser.submitBtn);
    // In case of "New" user and User ID gets modified the message contains userId as what's being entered, while in other cases User ID wasn't or cannot be
    // modified,the userId is in upper case. 
    const expectedMsg = `This will submit User: ${this.userData.firstName} ${this.userData.surName} (${this.userData.userId}) to be modified.`;
    logger.info(this.userData.firstName)
    logger.info(this.userData.surName)
    logger.info(this.userData.userId)
    expect((await helper.getElementText(viewOimUserPage.selectors.modifyUser.modifyUserDialog.confirmationMessageLine1)).toUpperCase()).to.equal(expectedMsg.toUpperCase());
    if (yesNo === 'Yes') {
        await helper.click(viewOimUserPage.selectors.yesBtnOnConfirmationPopup);
    } else {
        await helper.click(viewOimUserPage.selectors.noBtnOnConfirmationPopup);
    }
  });

Then(/^BankUser clicks on "Cancel" button for User Modification and clicks "(Yes|No)" on the confirmation$/, async function (yesNo){
    logger.info(`Bankuser clicks on Cancel button`);
    await helper.click(viewOimUserPage.selectors.modifyUser.cancelBtn);
    const expectedMsg = viewOimUserPage.screenMessages.msg_051;
    expect((await helper.getElementText(viewOimUserPage.selectors.modifyUser.modifyUserDialog.confirmationMessageLine1))).to.equal(expectedMsg);
    if (yesNo === 'Yes') {
        await helper.click(viewOimUserPage.selectors.yesBtnOnConfirmationPopup);
    } else {
        await helper.click(viewOimUserPage.selectors.noBtnOnConfirmationPopup);
    }
});

Then(/^check User modification has been submitted successfully for "(New|Existing)" user$/, async function(status) {
    const successMsg = (status === 'New' ? `User ${this.userData.firstName} ${this.userData.surName} (${this.userData.userId.toUpperCase()}) has been submitted for approval.` :
    `User ${this.userData.firstName} ${this.userData.surName} (${this.userData.userId.toUpperCase()}) is now pending approval to be modified.`);

    await helper.waitForTextInElement(viewOimUserPage.selectors.successNotificationMsg, 'User', 15);
    expect(await helper.getElementText(viewOimUserPage.selectors.successNotificationMsg)).to.includes(successMsg);
    logger.info(successMsg);

    if (status === 'New') {
        this.userData.status = 'New';
        this.userData.workflow = 'Pending Approval - Create';
    } else {
        this.userData.status = 'Enabled';
        this.userData.workflow = 'Pending Approval - Modified';
        let index;
        for (let user of this.users) {
          if (this.userData.userId === user['userId'].toUpperCase()) {
            index = this.users.indexOf(user);
            break;
          }
        }
        this.users[index].status = 'Enabled';
        this.users[index].workflow = 'Pending Approval - Modified';
    }
    this.userData.sourceSystem = 'COBRA';
    this.userData.version = this.userData.version + 1;

    // in case this user was created from API, make sure this.users data got updated correctly as well
    if (this.users && this.users.length > 1) {
        for (let user of this.users) {
            if (user.userId.toUpperCase() === this.userData.userId.toUpperCase()) {
                user = _.cloneDeep(this.userData);
                break;
            }
        }
    }
});

Then(/^BankUser clears data in fields:$/, async function(fields) {
    const userFields = fields.raw();
    logger.info(userFields);

    for (let userField of userFields) {
        let field = userField[0];

        switch (field) {
            case 'userId':
                await helper.clearInput(viewOimUserPage.selectors.modifyUser.userIdInput);
                break;
            case 'firstName':
                await helper.clearInput(viewOimUserPage.selectors.modifyUser.firstNameInput);
                break;
            case 'middleName':
                await helper.clearInput(viewOimUserPage.selectors.modifyUser.middleNameInput);
                break;
            case 'surname':
                await helper.clearInput(viewOimUserPage.selectors.modifyUser.surNameInput);
                break;
            case 'prefFirstName':
                await helper.clearInput(viewOimUserPage.selectors.modifyUser.prefFirstNameInput);
                break;
            case 'dob':
                await helper.clearInput(viewOimUserPage.selectors.modifyUser.dobInput);
                break;
            case 'kycId':
                await helper.clearInput(viewOimUserPage.selectors.modifyUser.kycIdInput);
                break;
            case 'address1':
                await helper.clearInput(viewOimUserPage.selectors.modifyUser.address1Input);
                break;
            case 'address2':
                await helper.clearInput(viewOimUserPage.selectors.modifyUser.address2Input);
                break;
            case 'suburbOrCity':
                await helper.clearInput(viewOimUserPage.selectors.modifyUser.suburbInput);
                break;
            case 'postcode':
                await helper.clearInput(viewOimUserPage.selectors.modifyUser.postcodeInput);
                break;
            case 'email':
                await helper.clearInput(viewOimUserPage.selectors.modifyUser.emailInput);
                break;
            case 'mobileCountry':
                await helper.selectByIndex(viewOimUserPage.selectors.modifyUser.mobCallingCodeSelect, 0);
                break;
            case 'mobileNumber':
                await helper.clearInput(viewOimUserPage.selectors.modifyUser.mobNumberInput);
                break;
            case 'otherPhoneCountry':
                await helper.selectByIndex(viewOimUserPage.selectors.modifyUser.otherCallingCodeSelect, 0);
                break;
            case 'otherPhoneNumber':
                await helper.clearInput(viewOimUserPage.selectors.modifyUser.otherPhoneInput);
                break;
            
        }
    }
});

Then(/^BankUser modifies User details data:$/, async function (userData) {
    const data = userData.rowsHash();
  
    await helper.inputTextIfNotNull(viewOimUserPage.selectors.modifyUser.userIdInput, data.userId);
    if (data.userId) this.userData['userId'] = data.userId;
    
    await helper.inputTextIfNotNull(viewOimUserPage.selectors.modifyUser.firstNameInput, data.firstName);
    if (data.firstName) this.userData['firstName'] = data.firstName;
    
    await helper.inputTextIfNotNull(viewOimUserPage.selectors.modifyUser.middleNameInput, data.middleName);
    if (data.middleName) this.userData['middleName'] = data.middleName;
    
    await helper.inputTextIfNotNull(viewOimUserPage.selectors.modifyUser.surNameInput, data.surName);
    if (data.surName) this.userData['surName'] = data.surName;
    
    await helper.inputTextIfNotNull(viewOimUserPage.selectors.modifyUser.prefFirstNameInput, data.prefFirstName);
    if (data.prefFirstName) this.userData['prefFirstName'] = data.prefFirstName;
    
    const dob = (data.dob && data.dob === 'Tomorrow') ? randomData.generateDateOfTomorrow() : (data.dob && data.dob === 'Today' ? randomData.formatDate(new Date()) : (data.dob ? data.dob : ''));
    await helper.inputTextIfNotNull(viewOimUserPage.selectors.modifyUser.dobInput, dob);
    if (data.dob) this.userData['dob'] = dob;
    
    await helper.inputTextIfNotNull(viewOimUserPage.selectors.modifyUser.kycIdInput, data.kycId);
    if (data.kycId) this.userData['kycId'] = data.kycId;
  
    await helper.inputTextIfNotNull(viewOimUserPage.selectors.modifyUser.emailInput, data.email);
    if (data.email) this.userData['email'] = data.email;
  
    if (data.mobileCountry) {
      await helper.selectByAttribute(viewOimUserPage.selectors.modifyUser.mobCallingCodeSelect, 'value', data.mobileCountry);
      this.userData.mobile.country = data.mobileCountry;
    }
    await helper.inputTextIfNotNull(viewOimUserPage.selectors.modifyUser.mobNumberInput, data.mobileNumber);
    if (data.mobileNumber) this.userData.mobile.number = data.mobileNumber;
  
    if (data.otherPhoneCountry) {
      await helper.selectByAttribute(viewOimUserPage.selectors.modifyUser.otherCallingCodeSelect, 'value', data.otherPhoneCountry);
      this.userData.otherPhone.country = data.otherPhoneCountry;
    }
    await helper.inputTextIfNotNull(viewOimUserPage.selectors.modifyUser.otherPhoneInput, data.otherPhoneNumber);
    if (data.otherPhoneNumber) this.userData.otherPhone.number = data.otherPhoneNumber;
  });

Then(/^check Entitlements tab is (not |)displayed$/, async function(notDisplayed) {
    if (notDisplayed) {
        expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.entitlementsTab)).to.be.false;
    } else {
        expect(await helper.ifElementDisplayedAfterTime(viewOimUserPage.selectors.entitlementsTab)).to.be.true;
        expect(await helper.getElementText(viewOimUserPage.selectors.entitlementsTab)).to.equal('Entitlements');
    }
});

Then(/^check Entitlements grid does not contain pre-populated Entitlements$/, async function() {
    await helper.click(viewOimUserPage.selectors.entitlementsTab);
    expect(await helper.getElementText(viewOimUserPage.selectors.noEntitlementsSelected)).to.equal('No Record Found.');
});

Then(/^check error message MSG022 is displayed in Security Devices tab$/, async function() {
    expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.selectedSecurityDevicesGrid)).to.be.true;
    expect(await helper.getElementText(viewOimUserPage.selectors.modifyUser.adkContactDetailError)).to.equal(viewOimUserPage.screenMessages.msg022);
});

Then(/^check record modified\/pending approval message is displayed$/, async function() {
    expect(await helper.getElementText(viewOimUserPage.selectors.noticeMessage)).to.equal(viewOimUserPage.screenMessages.msg_157);
});

Then(/^check View Change Summary link is displayed$/, async function() {
    expect(await helper.getElementText(viewOimUserPage.selectors.viewChangeSummaryLink)).to.equal('View Change Summary');
});

Then(/^BankUser promotes user to ANZ Managed$/, async function() {
    await helper.click(viewOimUserPage.selectors.modifyUser.managedByYes);
    this.userData.managedBy = true;
});

Then(/^check rejected user modification has been reverted$/, async function() {
    await helper.waitForDisplayed(viewOimUserPage.selectors.userIdValue);
    expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.userIcon)).to.equal(true);
  
    // This is the case that User was generated in the scenario. Check the view details page against the userData that was used to create the user.
    logger.info('Check the header section display in the User details page');
    let n = 1;
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(n)).to.equal(`User Name (ID):${this.originalUserData.firstName} ${this.originalUserData.surName} (${this.originalUserData.userId.toUpperCase()})`);
    // customer is optional
    const customerName = (this.originalUserData.customer && this.originalUserData.customer.customerName && this.originalUserData.customer.customerName !== '') ? `${this.originalUserData.customer.customerName} (${this.originalUserData.customer.customerId})` : '()';
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(n + 1)).to.equal(`Customer Name (ID):${customerName}`);
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(n + 2)).to.equal(`CAAS Org Name (ID):${this.originalUserData.caasOrg.orgName} (${this.originalUserData.caasOrg.orgId})`);
    if (this.originalUserData.managedBy) {
      expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(n + 3)).to.equal('Managed by:ANZ Managed');
    } else {
      expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(n + 3)).to.equal('Managed by:Customer Managed');
    }
    
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(n + 4)).to.equal(`Source System:${this.originalUserData.sourceSystem}`);
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableRightColumn(n)).to.equal(`Status:${this.originalUserData.status}`);
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableRightColumn(n + 1)).to.equal(`Workflow:${this.originalUserData.workflow}`);

    logger.info('Check "General Details", "Contact Details" and "Account Status" sections are displayed');
    const sectionHeaders = await viewOimUserPage.getDisplayedDataSectionHeadings();
    expect(sectionHeaders.indexOf('General Details') > -1).to.equal(true);
    expect(sectionHeaders.indexOf('Contact Details') > -1).to.equal(true);
    expect(sectionHeaders.indexOf('Account Status') > -1).to.equal(true);

    logger.info('Check the field values in details tab, "Account Status" section');
    expect(await helper.getElementText(viewOimUserPage.selectors.userVerifiedLabel)).to.equal('User Verified?');
    expect(await helper.getElementText(viewOimUserPage.selectors.verifiedOnLabel)).to.equal('Verified On');
    expect(await helper.getElementText(viewOimUserPage.selectors.passwordGeneratedLabel)).to.equal('Password Generated?');
    expect(await helper.getElementText(viewOimUserPage.selectors.accountLockedLabel)).to.equal('User account locked?');
    expect(await helper.getElementText(viewOimUserPage.selectors.pwdChangeLabel)).to.equal('Password change required at next login?');
    expect(await helper.getElementText(viewOimUserPage.selectors.selfServiceLockedLabel)).to.equal('Self Service Locked?');
    expect(await helper.getElementText(viewOimUserPage.selectors.selfServiceAttemptsLabel)).to.equal('Number of Self Service Attempts Left');
    expect(await helper.getElementText(viewOimUserPage.selectors.userVerifiedValue)).to.equal('No');
    if (this.originalUserData.managedBy) {
      expect(await helper.getElementText(viewOimUserPage.selectors.verifiedOn)).to.equal('Not Verified');
    } else {
      expect(await helper.getElementText(viewOimUserPage.selectors.verifiedOn)).to.equal('N/A');
    }
    expect(await helper.getElementText(viewOimUserPage.selectors.passwordGeneratedValue)).to.equal('No');
    expect(await helper.getElementText(viewOimUserPage.selectors.accountLockedValue)).to.equal('No');
    expect(await helper.getElementText(viewOimUserPage.selectors.pwdChangeValue)).to.equal('Yes');
    expect(await helper.getElementText(viewOimUserPage.selectors.selfServiceLockedValue)).to.equal('No');
    expect(await helper.getElementText(viewOimUserPage.selectors.selfServiceAttemptsValue)).to.equal('3');

    logger.info('Check the field values in details tab, "General Details" section');
    expect(await helper.getElementText(viewOimUserPage.selectors.userIdValue)).to.equal(this.originalUserData.userId.toUpperCase());
    expect(await helper.getElementText(viewOimUserPage.selectors.caasUserIdValue)).to.equal(this.originalUserData.userId.toUpperCase());
    expect(await helper.getElementText(viewOimUserPage.selectors.aliasIdValue)).to.equal(this.originalUserData.aliasId ? this.originalUserData.aliasId : '');
    expect(await helper.getElementText(viewOimUserPage.selectors.firstNameValue)).to.equal(this.originalUserData.firstName);
    expect(await helper.getElementText(viewOimUserPage.selectors.middleNameValue)).to.equal(this.originalUserData.middleName ? this.originalUserData.middleName : '');
    expect(await helper.getElementText(viewOimUserPage.selectors.surNameValue)).to.equal(this.originalUserData.surName);
    expect(await helper.getElementText(viewOimUserPage.selectors.prefFirstNameValue)).to.equal(this.originalUserData.prefFirstName ? this.originalUserData.prefFirstName : this.originalUserData.firstName);
    expect(await helper.getElementText(viewOimUserPage.selectors.dobValue)).to.equal(this.originalUserData.dob);
    expect(await helper.getElementText(viewOimUserPage.selectors.prefLangValue)).to.equal(this.originalUserData.prefLang);
    expect(await helper.getElementText(viewOimUserPage.selectors.kycIdValue)).to.equal(this.originalUserData.kycId ? this.originalUserData.kycId : '');

    logger.info('Check the field values in details tab, "Contact Details" section');
    n = 1;
    if (this.originalUserData.concatenatedAddr && this.originalUserData.concatenatedAddr !== '') {
      let addrVals = [await viewOimUserPage.getNthRowTextInAddressValue(n)];
      if ((await viewOimUserPage.getNthRowTextInAddressValue(n + 1)) !== '') addrVals.push(await viewOimUserPage.getNthRowTextInAddressValue(n + 1));
      addrVals.push(await viewOimUserPage.getNthRowTextInAddressValue(n + 2));
      if ((await viewOimUserPage.getNthRowTextInAddressValue(n + 3)) !== '') addrVals.push(await viewOimUserPage.getNthRowTextInAddressValue(n + 3));
      if ((await viewOimUserPage.getNthRowTextInAddressValue(n + 4)) !== '') addrVals.push(await viewOimUserPage.getNthRowTextInAddressValue(n + 4));
      addrVals.push(await helper.getElementText(viewOimUserPage.selectors.countryValue));
      const userAddress = addrVals.join(', ');
      expect(userAddress).to.equal(this.originalUserData.concatenatedAddr);
    } else {
      expect(await viewOimUserPage.getNthRowTextInAddressValue(n)).to.equal(this.originalUserData.address.addressLine1);
      expect(await viewOimUserPage.getNthRowTextInAddressValue(n + 1)).to.equal(this.originalUserData.address.addressLine2 ? this.originalUserData.address.addressLine2 : '');
      expect(await viewOimUserPage.getNthRowTextInAddressValue(n + 2)).to.equal(this.originalUserData.address.suburbOrCity);
      expect(await viewOimUserPage.getNthRowTextInAddressValue(n + 3)).to.equal(this.originalUserData.address.stateOrProvince ? this.originalUserData.address.stateOrProvince : '');
      expect(await viewOimUserPage.getNthRowTextInAddressValue(n + 4)).to.equal(this.originalUserData.address.postalCode ? this.originalUserData.address.postalCode: '');
      expect(await helper.getElementText(viewOimUserPage.selectors.countryValue)).to.equal(this.originalUserData.address.country);
    }
    expect(await helper.getElementText(viewOimUserPage.selectors.emailValue)).to.equal(this.originalUserData.email ? this.originalUserData.email : '');
    expect(await helper.getElementText(viewOimUserPage.selectors.mobileValue)).to.equal(this.originalUserData.mobile ? `${this.originalUserData.mobile.country} ${this.originalUserData.mobile.number}` : '');
    expect(await helper.getElementText(viewOimUserPage.selectors.otherPhoneValue)).to.equal(this.originalUserData.otherPhone ? `${this.originalUserData.otherPhone.country} ${this.originalUserData.otherPhone.number}` : '');
});

