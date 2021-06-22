import { Then } from 'cucumber';
import {} from "lodash";
import { ViewOimUserPage, viewOimUserPage } from 'src/ViewOimUserPage';
import { expect } from "chai";
import { helper } from "src/Helper";
import { getLogger } from "log4js";
import { randomData } from 'src/RandomData';
import _ = require('lodash');
import { viewCustomerPage } from 'pages/ViewCustomerPage';
import { viewCaasOrgPage } from 'pages/ViewCaasOrgPage';
import { MenuBar } from 'src/MenuBarPage';
const logger = getLogger();
const sortData = require('src/SortData');
const data = require('src/DataReader');
logger.level = 'info';

const UserRegion = {'2': 'NSW, ACT', '3': 'Victoria, Tasmania', '4': 'Queensland', '5': 'SA, NT', '6': 'WA'};

Then(/^BankUser closes User details page$/, async function() {
  logger.info('Close User details page');
  await helper.click(viewOimUserPage.selectors.close);
  
});

Then(/^check the details of the User displayed correctly in view User page$/, async function() {
  await helper.waitForDisplayed(viewOimUserPage.selectors.userIdValue);
  expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.userIcon)).to.equal(true);
  
  if (this.userData) {
    // This is the case that User was generated in the scenario. Check the view details page against the userData that was used to create the user.
    logger.info('Check the header section display in the User details page');
    let n = 1;
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(n)).to.equal(`User Name (ID):${this.userData.firstName} ${this.userData.surName} (${this.userData.userId.toUpperCase()})`);
    // customer is optional
    const customerName = (this.userData.customer && this.userData.customer.customerName && this.userData.customer.customerName !== '') ? `${this.userData.customer.customerName} (${this.userData.customer.customerId})` : '()';
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(n + 1)).to.equal(`Customer Name (ID):${customerName}`);
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(n + 2)).to.equal(`CAAS Org Name (ID):${this.userData.caasOrg.orgName} (${this.userData.caasOrg.orgId})`);
    if (this.userData.managedBy) {
      expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(n + 3)).to.equal('Managed by:ANZ Managed');
    } else {
      expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(n + 3)).to.equal('Managed by:Customer Managed');
    }
    
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(n + 4)).to.equal(`Source System:${this.userData.sourceSystem}`);
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableRightColumn(n)).to.equal(`Status:${this.userData.status}`);
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableRightColumn(n + 1)).to.equal(`Workflow:${this.userData.workflow}`);

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
    if (this.userData.managedBy) {
      expect(await helper.getElementText(viewOimUserPage.selectors.verifiedOn)).to.equal('Not Verified');
    } else {
      expect(await helper.getElementText(viewOimUserPage.selectors.verifiedOn)).to.equal('N/A');
    }
    expect(await helper.getElementText(viewOimUserPage.selectors.passwordGeneratedValue)).to.equal('No');
    if (this.userData.status === 'New') {
      expect(await helper.getElementText(viewOimUserPage.selectors.accountLockedValue)).to.equal('');
      expect(await helper.getElementText(viewOimUserPage.selectors.pwdChangeValue)).to.equal('');
    } else {
      expect(await helper.getElementText(viewOimUserPage.selectors.accountLockedValue)).to.equal('No');
      expect(await helper.getElementText(viewOimUserPage.selectors.pwdChangeValue)).to.equal('Yes');
    }
    expect(await helper.getElementText(viewOimUserPage.selectors.selfServiceLockedValue)).to.equal('No');
    expect(await helper.getElementText(viewOimUserPage.selectors.selfServiceAttemptsValue)).to.equal('3');

    logger.info('Check the field values in details tab, "General Details" section');
    expect(await helper.getElementText(viewOimUserPage.selectors.userIdValue)).to.equal(this.userData.userId.toUpperCase());
    expect(await helper.getElementText(viewOimUserPage.selectors.caasUserIdValue)).to.equal(this.userData.userId.toUpperCase());
    expect(await helper.getElementText(viewOimUserPage.selectors.aliasIdValue)).to.equal(this.userData.aliasId ? this.userData.aliasId : '');
    expect(await helper.getElementText(viewOimUserPage.selectors.firstNameValue)).to.equal(this.userData.firstName);
    expect(await helper.getElementText(viewOimUserPage.selectors.middleNameValue)).to.equal(this.userData.middleName ? this.userData.middleName : '');
    expect(await helper.getElementText(viewOimUserPage.selectors.surNameValue)).to.equal(this.userData.surName);
    expect(await helper.getElementText(viewOimUserPage.selectors.prefFirstNameValue)).to.equal(this.userData.prefFirstName ? this.userData.prefFirstName : this.userData.firstName);
    expect(await helper.getElementText(viewOimUserPage.selectors.dobValue)).to.equal(this.userData.dob);
    expect(await helper.getElementText(viewOimUserPage.selectors.prefLangValue)).to.equal(this.userData.prefLang);
    expect(await helper.getElementText(viewOimUserPage.selectors.kycIdValue)).to.equal(this.userData.kycId ? this.userData.kycId : '');

    logger.info('Check the field values in details tab, "Contact Details" section');
    n = 1;
    if (this.userData.concatenatedAddr && this.userData.concatenatedAddr !== '') {
      let addrVals = [await viewOimUserPage.getNthRowTextInAddressValue(n)];
      if ((await viewOimUserPage.getNthRowTextInAddressValue(n + 1)) !== '') addrVals.push(await viewOimUserPage.getNthRowTextInAddressValue(n + 1));
      addrVals.push(await viewOimUserPage.getNthRowTextInAddressValue(n + 2));
      if ((await viewOimUserPage.getNthRowTextInAddressValue(n + 3)) !== '') addrVals.push(await viewOimUserPage.getNthRowTextInAddressValue(n + 3));
      if ((await viewOimUserPage.getNthRowTextInAddressValue(n + 4)) !== '') addrVals.push(await viewOimUserPage.getNthRowTextInAddressValue(n + 4));
      addrVals.push(await helper.getElementText(viewOimUserPage.selectors.countryValue));
      const userAddress = addrVals.join(', ');
      expect(userAddress).to.equal(this.userData.concatenatedAddr);
    } else {
      expect(await viewOimUserPage.getNthRowTextInAddressValue(n)).to.equal(this.userData.address.addressLine1);
      expect(await viewOimUserPage.getNthRowTextInAddressValue(n + 1)).to.equal(this.userData.address.addressLine2 ? this.userData.address.addressLine2 : '');
      expect(await viewOimUserPage.getNthRowTextInAddressValue(n + 2)).to.equal(this.userData.address.suburbOrCity);
      expect(await viewOimUserPage.getNthRowTextInAddressValue(n + 3)).to.equal(this.userData.address.stateOrProvince ? this.userData.address.stateOrProvince : '');
      expect(await viewOimUserPage.getNthRowTextInAddressValue(n + 4)).to.equal(this.userData.address.postalCode ? this.userData.address.postalCode: '');
      expect(await helper.getElementText(viewOimUserPage.selectors.countryValue)).to.equal(this.userData.address.country);
    }
    expect(await helper.getElementText(viewOimUserPage.selectors.emailValue)).to.equal(this.userData.email ? this.userData.email : '');
    expect(await helper.getElementText(viewOimUserPage.selectors.mobileValue)).to.equal(this.userData.mobile ? `${this.userData.mobile.country} ${this.userData.mobile.number}` : '');
    expect(await helper.getElementText(viewOimUserPage.selectors.otherPhoneValue)).to.equal(this.userData.otherPhone ? `${this.userData.otherPhone.country} ${this.userData.otherPhone.number}` : '');
  } else {
    // This case the user details page was opened from search result grid, and user info was retrieved and saved in this.searchUserResultEntry.
    logger.info('Check the header section display in the User details page');
    let n = 1;
    const userName = 'User Name (ID):' + this.searchUserResultEntry.firstName + ' ' + this.searchUserResultEntry.lastName + ' (' +  this.searchUserResultEntry.userId + ')';
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(n)).to.equal(userName);
    // customer is optional, and from search result grid, no customerName available.
    const customerId = (this.searchUserResultEntry.customerId && this.searchUserResultEntry.customerId !== '') ? `(${this.searchUserResultEntry.customerId})` : '()';
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(n + 1)).to.includes(customerId);
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(n + 2)).to.equal(`CAAS Org Name (ID):${this.searchUserResultEntry.caasOrgName} (${this.searchUserResultEntry.caasOrgId})`);
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(n + 3)).to.equal('Managed by:ANZ Managed');
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(n + 4)).to.equal(`Source System:${this.searchUserResultEntry.sourceSystem}`);
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableRightColumn(n)).to.equal(`Status:${this.searchUserResultEntry.status}`);
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableRightColumn(n + 1)).to.equal(`Workflow:${this.searchUserResultEntry.workflow}`);

    logger.info('Check User details are displayed correctly per the values from search result entry');
    expect(await helper.getElementText(viewOimUserPage.selectors.userIdValue)).to.equal(this.searchUserResultEntry.userId);
    expect(await helper.getElementText(viewOimUserPage.selectors.caasUserIdValue)).to.equal(this.searchUserResultEntry.caasUserId);
    expect(await helper.getElementText(viewOimUserPage.selectors.firstNameValue)).to.equal(this.searchUserResultEntry.firstName);
    expect(await helper.getElementText(viewOimUserPage.selectors.middleNameValue)).to.equal(this.searchUserResultEntry.middleName);
    expect(await helper.getElementText(viewOimUserPage.selectors.surNameValue)).to.equal(this.searchUserResultEntry.lastName);
  }
});

Then(/^check DoB of the User is (NOT masked|masked) in view User page$/, async function(isMasked) {
  if (isMasked.includes('NOT')) {
    logger.info('Check DoB is displayed and in the format of dd/mm/yyyy');
    expect(randomData.validateDoBFormat(await helper.getElementText(viewOimUserPage.selectors.dobValue))).to.equal(true);
  } else {
    logger.info('Check DoB is masked');
    expect(await helper.getElementText(viewOimUserPage.selectors.dobValue)).to.equal('XXXXXXXX');
  }
});

Then(/^check the "(Approve|Reject|Edit|Enable|Disable|Delete)" option is (NOT displayed|displayed) on the view User page$/, async function(button, isDisplayed) {
  logger.info(`Check ${button} option is ${isDisplayed}`);
  const selector = (button === 'Approve') ? viewOimUserPage.selectors.approve :
                   (button === 'Reject') ? viewOimUserPage.selectors.reject : 
                   (button === 'Edit') ? viewOimUserPage.selectors.edit :
                   (button === 'Enable') ? viewOimUserPage.selectors.enable :
                   (button === 'Disable') ? viewOimUserPage.selectors.disable :
                   viewOimUserPage.selectors.delete;
  if (isDisplayed.includes('NOT')) {
    expect(await helper.ifElementDisplayed(selector)).to.equal(false);
  } else {
    expect(await helper.ifElementDisplayed(selector)).to.equal(true);
  }
  await helper.screenshot(`${button}Is${isDisplayed.replace(' ', '')}OnViewUserPage`);
});

Then(/^check the details of the API created User displayed correctly in view User page$/, async function() {
  logger.info('Check User details are displayed correctly, against the User data used to create the User via API');
  await helper.waitForDisplayed(viewOimUserPage.selectors.userIdValue);
  const userId = await helper.getElementText(viewOimUserPage.selectors.userIdValue);
  let index;
  for (let user of this.users) {
    if (userId === user['userId'].toUpperCase()) {
      index = this.users.indexOf(user);
      break;
    }
  }
  const userData = this.users[index];

  expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(3)).to.equal(`CAAS Org Name (ID):${userData.caasOrg.orgName} (${userData.caasOrg.orgId})`);
  if (userData.managedBy) {
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(4)).to.equal('Managed by:ANZ Managed');
  } else {
    expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(4)).to.equal('Managed by:Customer Managed');
  }
  
  expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableLeftColumn(5)).to.equal(`Source System:${userData.sourceSystem}`);
  expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableRightColumn(1)).to.equal(`Status:${userData.status}`);
  expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableRightColumn(2)).to.equal(`Workflow:${userData.workflow}`);
  expect(await helper.getElementText(viewOimUserPage.selectors.userIdValue)).to.equal(userData.userId.toUpperCase());
  expect(await helper.getElementText(viewOimUserPage.selectors.caasUserIdValue)).to.equal(userData.userId.toUpperCase());
  expect(await helper.getElementText(viewOimUserPage.selectors.firstNameValue)).to.equal(userData.firstName);
  const middleNameVal = await helper.getElementText(viewOimUserPage.selectors.middleNameValue);
  expect(middleNameVal).to.equal(userData.middleName ? userData.middleName : '');
  expect(await helper.getElementText(viewOimUserPage.selectors.surNameValue)).to.equal(userData.surName);

  // save userData to this.userData for later use by steps to check applications and devices
  this.userData = userData;
});

Then(/^check the (View|Modify) User Applications screen elements for (New|Enabled) User$/, async function(mode, status) {
  await helper.waitForDisplayed(viewOimUserPage.selectors.caasUserIdValue);
  const userId = (mode === 'Modify' && status === 'New' ) ? await helper.getElementValue(viewOimUserPage.selectors.modifyUser.userIdInput) : await helper.getElementText(viewOimUserPage.selectors.userIdValue);

  await helper.click(viewOimUserPage.selectors.applicationsTab);
  await helper.waitForDisplayed(viewOimUserPage.selectors.selectedApplicationsGrid);

  const headers = await helper.getNestedElements(viewOimUserPage.selectors.applicationTableColumnHeaders);

  await expect(await headers[0].getText()).to.equal('Application Name');
  await expect(await headers[1].getText()).to.equal('Application Attributes');
  await expect(await headers[2].getText()).to.equal('Status');
  await expect(await headers[3].getText()).to.equal('Last Provisioning Status');
  logger.info('Application table headers OK');

  let applications;
  if (this.userData) {
    applications = this.userData.applications;
  } else {
    // User was created from API
    for (let user of this.users) {
      if (user.userId === userId) {
        applications = user.applications;
        break;
      }
    }
  }
  logger.info(JSON.stringify(applications));

  const apps = await helper.getNestedElements(viewOimUserPage.selectors.applicationsList);
  const appAttributes = await helper.getNestedElements(viewOimUserPage.selectors.appAttributesList);
  const appStatuses = await helper.getNestedElements(viewOimUserPage.selectors.appStatusList);
  const lastProvStatus = await helper.getNestedElements(viewOimUserPage.selectors.appLastProvStatusList);

  const appColumn = [];
  const appAttributesColumn = [];
  const appStatusColumn = [];
  const appLastProvStatusColumn = [];

  for (let i = 0; i < apps.length; i++) {
    appColumn.push(await apps[i].getText());
    appAttributesColumn.push(await appAttributes[i].getText());
    appStatusColumn.push(await appStatuses[i].getText());
    appLastProvStatusColumn.push(await lastProvStatus[i].getText());
  }

  // applications = ["EsandaNet":{"iSeriesUserID":"qmp3bojfjw","userRegion":"Queensland","type":"B","status":"New"}, "GCIS":{"GCISUserID":"tygxb7","status":"New"}, "Institutional Insights":{,"status":"New"}, "Internet Enquiry Access":{"customerRegNo":58999,"status":"New"},"Online Trade":{,"status":"New"}]
  for (let userApp of applications) {
    const name = Object.keys(userApp)[0];
    const attributes = Object.values(userApp)[0];
    logger.info(`Searching for "${name}"`);
    expect(appColumn.indexOf(name)).to.not.equal(-1);
    const appIndex = appColumn.indexOf(name);
    if (name === 'EsandaNet') {
      logger.info('Check EsandaNet application attributes');
      // the attributes can be displayed in sequence of 'User Type:Broker | User Region:ACT | iSeries User ID:TWC4EBJPQJ', or 'User Type:Broker | User Region:NT | iSeries User ID:KPTZP65745'
      expect(appAttributesColumn[appIndex]).to.includes('User Type: Broker');
      expect(appAttributesColumn[appIndex]).to.includes(`iSeries User ID: ${attributes['iSeriesUserID'].toUpperCase()}`);
      expect(appAttributesColumn[appIndex]).to.includes('User Region: ' + UserRegion[attributes['userRegion']]);
    }
    if (name === 'GCIS') {
      logger.info('Check GCIS application attributes');
      expect(appAttributesColumn[appIndex]).to.equal(`GCIS User ID: ${attributes['GCISUserID']}`);
    }
    if (name === 'Internet Enquiry Access') {
      logger.info('Check Internet Enquiry Access application attributes');
      expect(appAttributesColumn[appIndex]).to.equal(`Customer Registration Number: ${attributes['customerRegNo']}`);
    }
    if (name === 'eMatching') {
      logger.info('Check eMatching application attributes');
      expect(appAttributesColumn[appIndex]).to.match(/^eMatching User ID: \d{8}$/);
      // save the eMatching userId into this.userData
      var test = appAttributesColumn[appIndex].match(/^eMatching User ID: (.*)$/);
      attributes['eMatchingUserId'] = test[1];
    }
    expect(appStatusColumn[appIndex]).to.equal(attributes['status']);
    if(attributes['lastProvStatus']) expect(appLastProvStatusColumn[appIndex]).to.equal(attributes['lastProvStatus']);
  }

  logger.info('Check applications are sorted in alphabetic order by Application Name');
  const sorted = [...appColumn].sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });
  expect(_.isEqual(appColumn, sorted)).to.equal(true);
});

Then(/^check View User applications screen when no applications have been assigned$/, async function() {
  await helper.click(viewOimUserPage.selectors.applicationsTab);
  await helper.waitForDisplayed(viewOimUserPage.selectors.selectedApplicationsGrid);
  await expect(await helper.getElementText(viewOimUserPage.selectors.appNoRecordFound)).to.equal(viewOimUserPage.screenMessages.msg007);
});

Then(/^check application provisioning status is "(Enabled Successfully|New)"$/, async function(status) {
  await helper.click(viewOimUserPage.selectors.applicationsTab);
  const apps = await helper.getNestedElements(viewOimUserPage.selectors.applicationsList);
  const appAttributes = await helper.getNestedElements(viewOimUserPage.selectors.appAttributesList);
  const appStatuses = await helper.getNestedElements(viewOimUserPage.selectors.appStatusList);
  const lastProvStatus = await helper.getNestedElements(viewOimUserPage.selectors.appLastProvStatusList);

  for (let i = 0; i < apps.length; i++) {
    if (status === 'Enabled Successfully') {
      expect(await appStatuses[i].getText()).to.equal('Enabled');
      expect(await lastProvStatus[i].getText()).to.equal('Enabled');
      logger.info(`'${await apps[i].getText()} provisioned successfully!`);
    } else {
      expect(await appStatuses[i].getText()).to.equal('New');
      logger.info(`'${await apps[i].getText()} status set to \"New\".`);
    }
  }
});

Then(/^navigates to Verify User page$/, async function() {
  await helper.click(viewOimUserPage.selectors.verify);
});

Then(/^check that (Verify|Edit|Generate Password) button "(is|is not)" present on View CAAS User page$/, async function(button, buttonPresent) {
  const selector = (button === 'Verify') ? viewOimUserPage.selectors.verify : (button === 'Edit' ? viewOimUserPage.selectors.edit : (button === 'Generate Password' ? viewOimUserPage.selectors.generatePasswordBtn : button));
  logger.info(`Verifing the status of  ${button} button`)
  if (buttonPresent === 'is') {
    expect(await helper.ifElementDisplayed(selector)).to.equal(true);
  } else {
    expect(await helper.ifElementDisplayed(selector)).to.equal(false);
  }
});

Then(/^BankUser verifies the elements on Verify User dialog$/, async function() {
   expect(await helper.getElementText(viewOimUserPage.selectors.verifyUserTitle)).to.equal('Verify User');
   logger.info('Checking verificationDetailsHeader');
   expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.verificationDetailsHeader)).to.equal(true);
   expect(await helper.getElementText(viewOimUserPage.selectors.dobLabel)).to.equal('Date of Birth');
   expect(await helper.getElementText(viewOimUserPage.selectors.userVerificationCodeLabel)).to.equal('User Verification Code');
   expect(await helper.getElementText(viewOimUserPage.selectors.userVerificationCodeValue)).to.not.equal('');
   expect(await helper.getElementText(viewOimUserPage.selectors.dobValueVerifyUserDialog)).to.not.equal('');
   logger.info('Checking challengeAndResponseDetailsHeader');
   expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.challengeAndResponseDetailsHeader)).to.equal(true);
   expect(await helper.getElementText(viewOimUserPage.selectors.challengelanguageLabel)).to.equal('Challenge Language');
   expect(await helper.getElementText(viewOimUserPage.selectors.challengeQuestion1Label)).to.equal('Challenge Question 1');
   expect(await helper.getElementText(viewOimUserPage.selectors.challengeResponse1Label)).to.equal('Challenge Response 1');
   expect(await helper.getElementText(viewOimUserPage.selectors.challengeQuestion2Label)).to.equal('Challenge Question 2');
   expect(await helper.getElementText(viewOimUserPage.selectors.challengeResponse2Label)).to.equal('Challenge Response 2');
   expect(await helper.getElementText(viewOimUserPage.selectors.challengeQuestion3Label)).to.equal('Challenge Question 3');
   expect(await helper.getElementText(viewOimUserPage.selectors.challengeResponse3Label)).to.equal('Challenge Response 3');
   expect(await helper.getElementText(viewOimUserPage.selectors.submitBtn)).to.equal('Submit');
   expect(await helper.getElementText(viewOimUserPage.selectors.cancelBtn)).to.equal('Cancel');
   logger.info(`Checking the default value for response 1 text box`);
   expect(await helper.getElementValue(viewOimUserPage.selectors.response1Textbox)).to.equal('');
   logger.info(`Checking the default value for response 2 text box`);
   expect(await helper.getElementValue(viewOimUserPage.selectors.response2Textbox)).to.equal('');
   logger.info(`Checking the default value for response 3 text box`);
   expect(await helper.getElementValue(viewOimUserPage.selectors.response3Textbox)).to.equal('');

});

Then(/^verifies the available and default options in "(Challenge Question1|Challenge Question2|Challenge Question3)" for "(English|Simplified Chinese)" language$/, async function(selectList, language) {
    const selector = (selectList === 'Challenge Question1') ? viewOimUserPage.selectors.challengeQuestion1Dropdown : (selectList === 'Challenge Question2' ? viewOimUserPage.selectors.challengeQuestion2Dropdown : (selectList === 'Challenge Question3') ? viewOimUserPage.selectors.challengeQuestion3Dropdown : selectList);
    let questionsAvailable = Array.from(viewOimUserPage.challengeQuestionsEnglish);
    if (language == 'Simplified Chinese') {
        questionsAvailable = Array.from(viewOimUserPage.challengeQuestionsChinese);
    }
    await helper.selectByVisibleText(viewOimUserPage.selectors.challengeLanguageSelectList, language);
    let defaultValue = '';
    let optionIdx = await helper.getElementAttribute(selector, 'value');
    let option = `${selector} option[value="${optionIdx}"]`;
    logger.info(`Checking the default value`);
    expect((await helper.getElementText(option)).trim()).to.equal(defaultValue);
     // checking the available options
    logger.info(`checking the available options`);
     for (let i = 0; i < questionsAvailable.length; i++) {
        logger.info(`Checking availability of option: ${questionsAvailable[i].trim()}`);
        let option = `${selector} option[value="${questionsAvailable[i].trim()}"]`;
        expect(await helper.ifElementExists(option)).to.equal(true);
     }

});

Then(/^BankUser verifies the selected option in Challenge Language dropdown is "(English|Simplified Chinese)"$/, async function(language) {
    let optionIdx = await helper.getElementAttribute(viewOimUserPage.selectors.challengeLanguageSelectList, 'value');
    let option = `${viewOimUserPage.selectors.challengeLanguageSelectList} option[value="${optionIdx}"]`;
    logger.info(`Checking the value in challenge language`);
    expect((await helper.getElementText(option)).trim()).to.equal(language);
});

Then(/^verifies the available and default options in Challenge Language dropdown$/, async function() {
    const challengeLanguageOptions = Array.from(viewOimUserPage.challengeLanguageOptions);
    // checking the default selection
    let optionIdx = await helper.getElementAttribute(viewOimUserPage.selectors.challengeLanguageSelectList, 'value');
    let option = `${viewOimUserPage.selectors.challengeLanguageSelectList} option[value="${optionIdx}"]`;
    logger.info(`Checking the default value`);
    expect((await helper.getElementText(option)).trim()).to.equal(challengeLanguageOptions[0]);
     // checking the available options
    logger.info(`checking the available options`);
     for (let i = 0; i < challengeLanguageOptions.length; i++) {
        logger.info(`Checking availability of option: ${challengeLanguageOptions[i].trim()}`);
        await helper.selectByIndex(viewOimUserPage.selectors.challengeLanguageSelectList, i);
        let optionIdx = await helper.getElementAttribute(viewOimUserPage.selectors.challengeLanguageSelectList, 'value');
        let option = `${viewOimUserPage.selectors.challengeLanguageSelectList} option[value="${optionIdx}"]`;
        expect((await helper.getElementText(option)).trim()).to.equal(challengeLanguageOptions[i]);
     }
});

Then(/^BankUser selects "(English|Simplified Chinese)" in challenge language$/, async function(language) {
    await helper.waitForTextInElement(viewOimUserPage.selectors.challengeLanguageSelectList, language, 3);
    await helper.selectByVisibleText(viewOimUserPage.selectors.challengeLanguageSelectList, language);
});

Then(/^selects "(.*)" in challengeQuestion1, "(.*)" in challengeQuestion2 and "(.*)" in challengeQuestion3$/, async function(question1, question2, question3) {
    await helper.pause(1);
    let optionIdx = await helper.getElementValue(viewOimUserPage.selectors.challengeLanguageSelectList);
    logger.info(`optionIdx = ${optionIdx}`)
    let option = await `${viewOimUserPage.selectors.challengeLanguageSelectList} option[value="${optionIdx}"]`;
    let questionsAvailable = Array.from(viewOimUserPage.challengeQuestionsEnglish);
    if((await helper.getElementText(option)).trim() == 'Simplified Chinese') {
        questionsAvailable = Array.from(viewOimUserPage.challengeQuestionsChinese);
    }

    for (let i = 0; i < questionsAvailable.length; i++) {
        let option = `${viewOimUserPage.selectors.challengeQuestion1Dropdown} option[value="${questionsAvailable[i]}"]`;
         await helper.waitForExist(option, 2);
    }
    logger.info(`Selecting options in Question1, question2, question3`);
    var kbas = [];
    if(!randomData.isNullOrEmpty(question1)) {
      if (question1.includes('index')) {
      let indexValue1 = question1.split('index');
      await helper.selectByIndex(viewOimUserPage.selectors.challengeQuestion1Dropdown, indexValue1[1]);
      } else {
      await helper.selectByVisibleText(viewOimUserPage.selectors.challengeQuestion1Dropdown, question1);
      }
      kbas.push({question: await helper.getElementValue(viewOimUserPage.selectors.challengeQuestion1Dropdown), answer: ''});
    }
    if(!randomData.isNullOrEmpty(question2)) {
      if (question2.includes('index')) {
        let indexValue2 = question2.split('index');
        await helper.selectByIndex(viewOimUserPage.selectors.challengeQuestion2Dropdown, indexValue2[1]);
      } else {
       await helper.selectByVisibleText(viewOimUserPage.selectors.challengeQuestion2Dropdown, question2);
      }
      kbas.push({question: await helper.getElementValue(viewOimUserPage.selectors.challengeQuestion2Dropdown), answer: ''});
    }
    if(!randomData.isNullOrEmpty(question3)) {
      if (question3.includes('index')) {
        let indexValue3 = question3.split('index');
        await helper.selectByIndex(viewOimUserPage.selectors.challengeQuestion3Dropdown, indexValue3[1]);
      } else {
       await helper.selectByVisibleText(viewOimUserPage.selectors.challengeQuestion3Dropdown, question3);
      }
      kbas.push({question: await helper.getElementValue(viewOimUserPage.selectors.challengeQuestion3Dropdown), answer: ''});
    }

    // save the KBAs into user data block in scenario context
    if (this.userData) {
      this.userData['KBAs'] = kbas;
    } else if (this.users) {
      for (var user of this.users) {
        const userId = this.searchUserResultEntry.userId;
        if (userId === user.userId.toUpperCase()) {
          user['KBAs'] = kbas;
          break;
        }
      }
    }
 });

Then(/^enters "(.*)" in response1 textbox "(.*)" in response2 textbox and "(.*)" in response3 textbox$/, async function(response1, response2, response3) {
    await helper.inputText(viewOimUserPage.selectors.response1Textbox, response1);
    await helper.inputText(viewOimUserPage.selectors.response2Textbox, response2);
    await helper.inputText(viewOimUserPage.selectors.response3Textbox, response3);

    // save the KBAs into user data block in scenario context, with leading/trailing spaces trimmed from the text
    if (this.userData && this.userData.KBAs) {
      if (this.userData.KBAs[0] && !(randomData.isNullOrEmpty(this.userData.KBAs[0].question))) this.userData.KBAs[0]['answer'] = response1.trim();
      if (this.userData.KBAs[1] && !(randomData.isNullOrEmpty(this.userData.KBAs[1].question))) this.userData.KBAs[1]['answer'] = response2.trim();
      if (this.userData.KBAs[2] && !(randomData.isNullOrEmpty(this.userData.KBAs[2].question))) this.userData.KBAs[2]['answer'] = response3.trim();
    } else if (this.users) {
      for (var user of this.users) {
        const userId = this.searchUserResultEntry.userId;
        if (userId === user.userId.toUpperCase() && user.KBAs) {
          if (user.KBAs[0] && !(randomData.isNullOrEmpty(user.KBAs[0].question))) user.KBAs[0]['answer'] = response1.trim();
          if (user.KBAs[1] && !(randomData.isNullOrEmpty(user.KBAs[1].question))) user.KBAs[1]['answer'] = response2.trim();
          if (user.KBAs[2] && !(randomData.isNullOrEmpty(user.KBAs[2].question))) user.KBAs[2]['answer'] = response3.trim();
          break;
        }
      }
    }
});

Then(/^BankUser clicks "(Submit|Cancel|No|Yes|Edit|Verify|Generate Password|Close|Disable|Enable|Delete)" button$/, async function(button) {
    const selector = (button === 'Submit') ? viewOimUserPage.selectors.submitBtn :
                     (button === 'Cancel') ? viewOimUserPage.selectors.cancelBtn :
                     (button === 'No') ? viewOimUserPage.selectors.noBtnOnConfirmationPopup :
                     (button === 'Yes') ? viewOimUserPage.selectors.yesBtnOnConfirmationPopup :
                     (button === 'Edit') ? viewOimUserPage.selectors.editBtnVerifyUser :
                     (button === 'Verify') ? viewOimUserPage.selectors.verify :
                     (button === 'Generate Password') ? viewOimUserPage.selectors.generatePasswordBtn :
                     (button === 'Close') ? viewOimUserPage.selectors.closeBtn :
                     (button === 'Disable') ? viewOimUserPage.selectors.disable :
                     (button === 'Enable') ? viewOimUserPage.selectors.enable : viewOimUserPage.selectors.delete;
    logger.info(`Clicking ${button} button`);
    expect(await viewOimUserPage.clickButton(selector)).to.equal(true);
});

Then(/^BankUser clicks "(Unblock|Reset|Disable)" security device button$/, async function(button) {
  const selector = (button === 'Unblock') ? viewOimUserPage.selectors.unblockBtn :
                   (button === 'Reset') ? viewOimUserPage.selectors.resetBtn :
                   (button === 'Disable') ? viewOimUserPage.selectors.disableBtn : null;
  logger.info(`Clicking ${button} button`);
  expect(await viewOimUserPage.clickButton(selector)).to.equal(true);
});

Then(/^BankUser clicks "(Ok|Cancel)" button on add security device page$/, async function (button){
  const selector = (button === 'Ok') ? viewOimUserPage.selectors.addDeviceDialog.okButton : viewOimUserPage.selectors.addDeviceDialog.cancelButton;
  logger.info(`Clicking ${button} button`);
  let device;

  if (button === 'Ok'){
    let deviceName = await helper.getElementValue(viewOimUserPage.selectors.addDeviceDialog.securityDevicesSelect);
    let location;
    if (deviceName !== 'ANZ Digital Key'){
    location = await helper.getElementValue(viewOimUserPage.selectors.addDeviceDialog.issueLocationsSelect);
    }
    device = {
      type: deviceName,
      location: location ? location : null
    };
    this.userData.securityDevices.push(device);
  }
  expect(await viewOimUserPage.clickButton(selector)).to.equal(true);
});

Then(/^verifies that error message for "(question1|question2|question3|response1|response2|response3)" is "(.*)"$/, async function(fieldName, errMsg) {
    const selector = (fieldName === 'question1') ? viewOimUserPage.selectors.challengeQuestion1ErrMsg : (fieldName === 'question2' ? viewOimUserPage.selectors.challengeQuestion2ErrMsg : (fieldName === 'response1') ? viewOimUserPage.selectors.challengeResponse1ErrMsg : (fieldName === 'response2') ? viewOimUserPage.selectors.challengeResponse2ErrMsg : (fieldName === 'response3') ? viewOimUserPage.selectors.challengeResponse3ErrMsg : (fieldName === 'question3') ? viewOimUserPage.selectors.challengeQuestion3ErrMsg : fieldName);
    expect(await helper.getElementText(selector)).to.equal(errMsg);
});

Then(/^verifies the value in "(question1|question2|question3|response1|response2|response3)" is "(.*)"$/, async function(fieldName, value) {
    const selector = (fieldName === 'question1') ? viewOimUserPage.selectors.challengeQuestion1Dropdown : (fieldName === 'question2' ? viewOimUserPage.selectors.challengeQuestion2Dropdown : (fieldName === 'response1') ? viewOimUserPage.selectors.response1Textbox : (fieldName === 'response2') ? viewOimUserPage.selectors.response2Textbox : (fieldName === 'response3') ? viewOimUserPage.selectors.response3Textbox : (fieldName === 'question3') ? viewOimUserPage.selectors.challengeQuestion3Dropdown : fieldName);
    expect(await helper.getElementValue(selector)).to.equal(value === null ? '' : value);
});

Then(/^verifies the text in "(question1|question2|question3|response1|response2|response3|userVerification|challengeLanguage|userVerified)" is "(.*)"$/, { wrapperOptions: { retry: 3 } }, async function(fieldName, value) {
    const selector = (fieldName === 'question1') ? viewOimUserPage.selectors.challengeQuestion1DivOnEditScrn : (fieldName === 'question2' ? viewOimUserPage.selectors.challengeQuestion2DivOnEditScrn : (fieldName === 'response1') ? viewOimUserPage.selectors.response1DivOnEditScrn : (fieldName === 'response2') ? viewOimUserPage.selectors.response2DivOnEditScrn : (fieldName === 'response3') ? viewOimUserPage.selectors.response3DivOnEditScrn : (fieldName === 'question3') ? viewOimUserPage.selectors.challengeQuestion3DivOnEditScrn : (fieldName === 'userVerification') ? viewOimUserPage.selectors.userVerificationCodeValue : (fieldName === 'challengeLanguage') ? viewOimUserPage.selectors.challengeLanguageOnEditScrn : (fieldName === 'userVerified') ? viewOimUserPage.selectors.userVerifiedValue : fieldName);
    logger.info(`Checking the text in ${fieldName} is ${value}`);
    if (!randomData.isNullOrEmpty(value)) {
      await helper.waitForTextInElement(selector, value, 5);
      expect(await helper.getElementText(selector)).to.equal(value);
    } else {
      await helper.waitForDisplayed(selector);
      expect(await helper.getElementText(selector)).to.equal('');
    }
});

Then(/^verifies the confirmation message$/, async function() {
  expect(await helper.getElementText(viewOimUserPage.selectors.confirmationMessageVerfiyUserDialog)).to.equal(MenuBar.msg_051);
  expect(await helper.getElementText(viewOimUserPage.selectors.noBtnOnConfirmationPopup)).to.equal('No');
  expect(await helper.getElementText(viewOimUserPage.selectors.yesBtnOnConfirmationPopup)).to.equal('Yes');
});

/*
 * Note that it's observed that sometimes the entered questions do NOT come back and be displayed on UI in the sequence of how they're entered.
 */
Then(/^verifies the (texts|values) of security questions and answers are displayed correctly for the "(\d+)(?:st|nd|rd|th)" API created User$/, async function(textOrValue, n) {
  await helper.waitForTextInElement((textOrValue === 'texts') ? viewOimUserPage.selectors.challengeQuestion1DivOnEditScrn : viewOimUserPage.selectors.challengeQuestion1Dropdown, '?', 10);

  const kbas = this.users[n - 1]['KBAs'];
  const questions = [];
  const answers = [];
  for (var i = 0; i < kbas.length; i++) {
    questions.push(kbas[i]['question']);
    answers.push(kbas[i]['answer']);
  }

  var questionsUI = [];
  questionsUI.push((textOrValue === 'texts') ? (await helper.getElementText(viewOimUserPage.selectors.challengeQuestion1DivOnEditScrn)) : (await helper.getElementValue(viewOimUserPage.selectors.challengeQuestion1Dropdown)));
  questionsUI.push((textOrValue === 'texts') ? (await helper.getElementText(viewOimUserPage.selectors.challengeQuestion2DivOnEditScrn)) : (await helper.getElementValue(viewOimUserPage.selectors.challengeQuestion2Dropdown)));
  questionsUI.push((textOrValue === 'texts') ? (await helper.getElementText(viewOimUserPage.selectors.challengeQuestion3DivOnEditScrn)) : (await helper.getElementValue(viewOimUserPage.selectors.challengeQuestion3Dropdown)));
  var answersUI = [];
  answersUI.push((textOrValue === 'texts') ? (await helper.getElementText(viewOimUserPage.selectors.response1DivOnEditScrn)) : (await helper.getElementValue(viewOimUserPage.selectors.response1Textbox)));
  answersUI.push((textOrValue === 'texts') ? (await helper.getElementText(viewOimUserPage.selectors.response2DivOnEditScrn)) : (await helper.getElementValue(viewOimUserPage.selectors.response2Textbox)));
  answersUI.push((textOrValue === 'texts') ? (await helper.getElementText(viewOimUserPage.selectors.response3DivOnEditScrn)) : (await helper.getElementValue(viewOimUserPage.selectors.response3Textbox)));

  for (var i = 0; i < questions.length; i++) {
    const index = questionsUI.indexOf(questions[i]);
    expect(index > -1).to.equal(true);
    expect(answersUI[index]).to.equal(answers[i]);
  }
});

Then(/^BankUser verifies the success notification$/, async function() {
    let successMsgTxt;
    logger.info('Check Verify User success message');
    successMsgTxt = await helper.getElementText(viewOimUserPage.selectors.successNotification);
    await helper.waitForTextInElement(viewOimUserPage.selectors.successNotification, successMsgTxt, 20);
});

Then(/^BankUser verifies the time stamp in Verified On with user as "(.*)"$/, async function(username) {
    const verifiedBy = (username === 'Default users') ? data.getData('cobraUserName') : (username === 'Default approvers' ? data.getData('cobraApprover') : (username === 'created bankuserDefault') ? this.bankuserDefault.lanId : (username === 'created bankuserApprover') ? this.bankuserApprover.lanId : (username === 'Default OIM Bankuser') ? data.getData('oimUserName') : (username === 'Helpdesk Officer (Pilot)') ? data.getData('helpdeskOfficerPilot') : (username === 'Registration Officer (Pilot)') ? data.getData('registrationOfficerPilot') : (username === 'Registration Officer') ? data.getData('registrationOfficer') : username);
    let currentTime = new Date().toLocaleString();
    let verifiedOnText= await helper.getElementText(viewOimUserPage.selectors.verifiedOn);
    let verifiedOnParts = verifiedOnText.split("by");
    let verifyUserTimeStamp = verifiedOnParts[0].split("/");
    let verifyUserTimeStampFormatted = verifyUserTimeStamp[1]+'/'+verifyUserTimeStamp[0]+'/'+verifyUserTimeStamp[2];
    currentTime  = currentTime .replace(",", "");

    logger.info(`Verifing by the correct user in Verified On field`);
    expect((verifiedOnParts[1].toLowerCase()).trim()).to.equal((verifiedBy.toLowerCase()).trim());

    logger.info(`Verifing the time stamp. Verifing that user was verified not more than 2 mins before `);
    let dt1 = new Date(verifyUserTimeStampFormatted);
    let dt2 = new Date(currentTime);
    let diff =(dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    expect(diff<2).to.equal(true);
});

Then(/^verifies the error msg for "(.*)" in "(response1|response2|response3)" is "(.*)"$/, async function(charList, fieldName, errMsg) {
    const selector = (fieldName === 'response1') ? viewOimUserPage.selectors.response1Textbox : (fieldName === 'response2' ? viewOimUserPage.selectors.response2Textbox : (fieldName === 'response3') ? viewOimUserPage.selectors.response3Textbox : fieldName);
    const errSelector = (fieldName === 'response1') ? viewOimUserPage.selectors.challengeResponse1ErrMsg : (fieldName === 'response2' ? viewOimUserPage.selectors.challengeResponse2ErrMsg : (fieldName === 'response3') ? viewOimUserPage.selectors.challengeResponse3ErrMsg : fieldName);

    let invalidChar = charList.split(",");
    for(let i =0; i<invalidChar.length; i++) {
           await helper.click(viewOimUserPage.selectors.verify);
           await helper.waitForTextInElement(viewOimUserPage.selectors.challengeLanguageSelectList, 'English', 3);
           await helper.selectByVisibleText(viewOimUserPage.selectors.challengeLanguageSelectList, 'English');
           await helper.selectByIndex(viewOimUserPage.selectors.challengeQuestion1Dropdown, 1);
           await helper.inputText(viewOimUserPage.selectors.response1Textbox, "response1");
           await helper.selectByIndex(viewOimUserPage.selectors.challengeQuestion2Dropdown, 2);
           await helper.inputText(viewOimUserPage.selectors.response2Textbox, "response1");
           await helper.selectByIndex(viewOimUserPage.selectors.challengeQuestion3Dropdown, 3);
           await helper.inputText(viewOimUserPage.selectors.response3Textbox, "response1");
           await helper.inputText(selector, invalidChar[i]);
           await helper.click(viewOimUserPage.selectors.submitBtn);
           logger.info(`Verifing error message for ${invalidChar[i]} in ${fieldName}`);
           expect(await helper.getElementText(errSelector)).to.equal(errMsg);
           await helper.click(viewOimUserPage.selectors.cancelBtn);
           await helper.click(viewOimUserPage.selectors.yesBtnOnConfirmationPopup);
     }
});

Then(/^verifies the mandatory field error msg for "(question1|question2|question3|response1|response2|response3)" is "(.*)"$/, async function(fieldName, errMsg) {
    const selector = (fieldName === 'question1') ? viewOimUserPage.selectors.challengeQuestion1Dropdown : (fieldName === 'question2' ? viewOimUserPage.selectors.challengeQuestion2Dropdown : (fieldName === 'response1') ? viewOimUserPage.selectors.response1Textbox : (fieldName === 'response2') ? viewOimUserPage.selectors.response2Textbox : (fieldName === 'response3') ? viewOimUserPage.selectors.response3Textbox : (fieldName === 'question3') ? viewOimUserPage.selectors.challengeQuestion3Dropdown : fieldName);
    const errSelector = (fieldName === 'question1') ? viewOimUserPage.selectors.challengeQuestion1ErrMsg : (fieldName === 'question2' ? viewOimUserPage.selectors.challengeQuestion2ErrMsg : (fieldName === 'response1') ? viewOimUserPage.selectors.challengeResponse1ErrMsg : (fieldName === 'response2') ? viewOimUserPage.selectors.challengeResponse2ErrMsg : (fieldName === 'response3') ? viewOimUserPage.selectors.challengeResponse3ErrMsg : (fieldName === 'question3') ? viewOimUserPage.selectors.challengeQuestion3ErrMsg : fieldName);

    await helper.click(viewOimUserPage.selectors.verify);

    await helper.waitForTextInElement(viewOimUserPage.selectors.challengeLanguageSelectList, 'English', 3);
    await helper.selectByVisibleText(viewOimUserPage.selectors.challengeLanguageSelectList, 'English');

    await helper.selectByIndex(viewOimUserPage.selectors.challengeQuestion1Dropdown, 1);
    await helper.selectByIndex(viewOimUserPage.selectors.challengeQuestion2Dropdown, 2);
    await helper.selectByIndex(viewOimUserPage.selectors.challengeQuestion3Dropdown, 3);
    if(fieldName == 'question1' || fieldName == 'question2' || fieldName == 'question3') {
         await helper.selectByIndex(selector, 0);
    }

     if(fieldName == 'response1') {
        await helper.inputText(viewOimUserPage.selectors.response2Textbox, "response2");
        await helper.inputText(viewOimUserPage.selectors.response3Textbox, "response3");
     } else if(fieldName == 'response2') {
        await helper.inputText(viewOimUserPage.selectors.response1Textbox, "response1");
        await helper.inputText(viewOimUserPage.selectors.response3Textbox, "response3");
     } else if(fieldName == 'response3') {
        await helper.inputText(viewOimUserPage.selectors.response1Textbox, "response1");
        await helper.inputText(viewOimUserPage.selectors.response2Textbox, "response2");
     } else {
        await helper.inputText(viewOimUserPage.selectors.response1Textbox, "response1");
        await helper.inputText(viewOimUserPage.selectors.response2Textbox, "response2");
        await helper.inputText(viewOimUserPage.selectors.response3Textbox, "response3");
     }
     await helper.click(viewOimUserPage.selectors.submitBtn);
     logger.info(`Verifing mandatory error message for ${fieldName}`);
     expect(await helper.getElementText(errSelector)).to.equal(errMsg);
     await helper.click(viewOimUserPage.selectors.cancelBtn);
     await helper.click(viewOimUserPage.selectors.yesBtnOnConfirmationPopup);
});


Then(/^verifies the error message for same questions in "(question1|question2|question3)" and "(question1|question2|question3)" is "(.*)"$/, async function(fieldName1, fieldName2, errMsg) {
     const selectorFieldName1 = (fieldName1 === 'question1') ? viewOimUserPage.selectors.challengeQuestion1Dropdown : (fieldName1 === 'question2' ? viewOimUserPage.selectors.challengeQuestion2Dropdown : (fieldName1 === 'question3') ? viewOimUserPage.selectors.challengeQuestion3Dropdown : fieldName1);
     const selectorFieldName2 = (fieldName2 === 'question1') ? viewOimUserPage.selectors.challengeQuestion1Dropdown : (fieldName2 === 'question2' ? viewOimUserPage.selectors.challengeQuestion2Dropdown : (fieldName2 === 'question3') ? viewOimUserPage.selectors.challengeQuestion3Dropdown : fieldName2);
     const errSelectorField1 = (fieldName1 === 'question1') ? viewOimUserPage.selectors.challengeQuestion1ErrMsg : (fieldName1 === 'question2' ? viewOimUserPage.selectors.challengeQuestion2ErrMsg : (fieldName1 === 'question3') ? viewOimUserPage.selectors.challengeQuestion3ErrMsg : fieldName1);
     const errSelectorField2 = (fieldName2 === 'question1') ? viewOimUserPage.selectors.challengeQuestion1ErrMsg : (fieldName2 === 'question2' ? viewOimUserPage.selectors.challengeQuestion2ErrMsg : (fieldName2 === 'question3') ? viewOimUserPage.selectors.challengeQuestion3ErrMsg : fieldName2);

     await helper.waitForTextInElement(viewOimUserPage.selectors.challengeLanguageSelectList, 'English', 3);
     await helper.selectByVisibleText(viewOimUserPage.selectors.challengeLanguageSelectList, 'English');

     await helper.selectByIndex(viewOimUserPage.selectors.challengeQuestion1Dropdown, 1);
     await helper.selectByIndex(viewOimUserPage.selectors.challengeQuestion2Dropdown, 2);
     await helper.selectByIndex(viewOimUserPage.selectors.challengeQuestion3Dropdown, 3);
     await helper.selectByIndex(selectorFieldName1, 4);
     await helper.selectByIndex(selectorFieldName2, 4);
     await helper.inputText(viewOimUserPage.selectors.response1Textbox, "response1");
     await helper.inputText(viewOimUserPage.selectors.response2Textbox, "response2");
     await helper.inputText(viewOimUserPage.selectors.response3Textbox, "response3");
     await helper.click(viewOimUserPage.selectors.submitBtn);
     logger.info(`Verifing that ${errMsg} is thrown for${fieldName1}`);
     expect(await helper.getElementText(errSelectorField1)).to.equal(errMsg);
     logger.info(`Verifing that ${errMsg} is thrown for${fieldName2}`);
     expect(await helper.getElementText(errSelectorField2)).to.equal(errMsg);
});

Then(/^check the Security Devices tab default display in View User page$/, async function() {
  await helper.click(viewOimUserPage.selectors.securityDevicesTab);
  await helper.waitForDisplayed(viewOimUserPage.selectors.selectedSecurityDevicesGrid);

  logger.info('Check Security Devices table heading and column headers');
  expect(await helper.getElementText(viewOimUserPage.selectors.securityDevicesTabHeading)).to.equal('Security Devices');
  const headers = await helper.getNestedElements(viewOimUserPage.selectors.devicesTableColumnHeaders);
  expect(headers.length).to.equal(6);
  expect(await headers[0].getText()).to.equal('Security Device');
  expect(await headers[1].getText()).to.equal('Serial Number');
  expect(await headers[2].getText()).to.equal('Status');
  expect(await headers[3].getText()).to.equal('Description');
  expect(await headers[4].getText()).to.equal('Requested Date');
  expect(await headers[5].getText()).to.equal('Issuance Location');

  logger.info('Check Add, Remove, and Enable buttons are not displayed');
  expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.addBtn)).to.equal(false);
  expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.removeBtn)).to.equal(false);
  expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.enableBtn)).to.equal(false);
  logger.info('Check Add, Remove, and Enable buttons are displayed and disabled');
  expect(await helper.getElementText(viewOimUserPage.selectors.unblockBtn)).to.equal('Unblock');
  expect(await helper.getElementText(viewOimUserPage.selectors.resetBtn)).to.equal('Reset');
  expect(await helper.getElementText(viewOimUserPage.selectors.disableBtn)).to.equal('Disable');
  expect(await helper.isElementDisabled(viewOimUserPage.selectors.unblockBtn)).to.equal(true);
  expect(await helper.isElementDisabled(viewOimUserPage.selectors.resetBtn)).to.equal(true);
  expect(await helper.isElementDisabled(viewOimUserPage.selectors.disableBtn)).to.equal(true);
});

Then(/^check the devices in the Selected Security Devices grid in View User page$/, async function() {
  await helper.click(viewOimUserPage.selectors.securityDevicesTab);
  await helper.waitForDisplayed(viewOimUserPage.selectors.selectedSecurityDevicesGrid);

  const devices = this.userData.securityDevices;

  // devices = [{'type': type, 'location': location, 'status': 'New', 'description': '', 'requestedDate': '08/10/2020'}]
  logger.info('Check Security Devices details displayed in the grid');
  for (var i = 0; i < devices.length; i++) {
    const n = await viewOimUserPage.findSecurityDeviceInGrid(devices[i].type);
    expect(await viewOimUserPage.getSecurityDeviceIssueLocationOnRow(n)).to.equal(devices[i]['location'] ? devices[i]['location'] : '');
    const status = (devices[i]['status'] === 'implicitDisabled') ? 'Disabled' : devices[i]['status'];
    expect((await viewOimUserPage.getSecurityDeviceStatusOnRow(n)).toUpperCase()).to.equal(status.toUpperCase());
    if (devices[i]['description']) expect(await viewOimUserPage.getSecurityDeviceDescriptionOnRow(n)).to.equal(devices[i]['description']);
    expect(await viewOimUserPage.getSecurityDeviceRequestedDateOnRow(n)).to.equal(devices[i]['requestedDate'] ? devices[i]['requestedDate'] : randomData.getTodayDate());
  }
});


Then(/^check the \"No Record Found\" message in Selected Security Devices grid$/, async function() {
  await helper.click(viewOimUserPage.selectors.securityDevicesTab);
  await helper.waitForDisplayed(viewOimUserPage.selectors.selectedSecurityDevicesGrid);
  await expect(await helper.getElementText(viewOimUserPage.selectors.noDeviceFoundMsg)).to.equal(viewOimUserPage.screenMessages.msg007);
});

Then(/^check Generate Password confirmation message$/, async function() {
  logger.info("Checking Generate Password confirmation message");
  await helper.waitForDisplayed(viewOimUserPage.selectors.dialog.confirmationMsg1);
  expect(await helper.getElementText(viewOimUserPage.selectors.generatePasswordDialog.messageTitle)).to.equal('WARNING');
  expect(await helper.getElementText(viewOimUserPage.selectors.generatePasswordDialog.confirmationMsg)).to.equal(viewOimUserPage.screenMessages.msg_048);
});

Then(/^check Generate Password screen elements$/, async function() {
  logger.info("Checking Generate Password screen");
  await helper.waitForElementToDisAppear(viewOimUserPage.selectors.loadingOverlay, 5);
  expect(await helper.getElementText(viewOimUserPage.selectors.generatePasswordWindowTitle)).to.equal('Generate Password');
  expect(await helper.getElementText(viewOimUserPage.selectors.passwordLabel)).to.equal('Password');
  expect(await helper.getElementText(viewOimUserPage.selectors.passwordValue)).to.not.equal('');
  expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.closeBtn)).to.equal(true);
  expect(await helper.getElementText(viewOimUserPage.selectors.closeBtn)).to.equal('Close');
});

Then(/^check user Account Status values after generating password$/, async function() {
  logger.info("Checking account status attributes");
  expect(await helper.getElementText(viewOimUserPage.selectors.passwordGeneratedValue)).to.equal('Yes');
  expect(await helper.getElementText(viewOimUserPage.selectors.accountLockedValue)).to.equal('No');
  expect(await helper.getElementText(viewOimUserPage.selectors.pwdChangeValue)).to.equal('Yes');
  expect(await helper.getElementText(viewOimUserPage.selectors.selfServiceLockedValue)).to.equal('No');
  expect(await helper.getElementText(viewOimUserPage.selectors.selfServiceAttemptsValue)).to.equal('3');
});

Then(/^check user Account Status values after selecting No on Generate Password confirmation$/, async function() {
  logger.info("Checking account status attributes");
  expect(await helper.getElementText(viewOimUserPage.selectors.passwordGeneratedValue)).to.equal('No');
  expect(await helper.getElementText(viewOimUserPage.selectors.accountLockedValue)).to.equal('No');
  expect(await helper.getElementText(viewOimUserPage.selectors.pwdChangeValue)).to.equal('Yes');
  expect(await helper.getElementText(viewOimUserPage.selectors.selfServiceLockedValue)).to.equal('No');
  expect(await helper.getElementText(viewOimUserPage.selectors.selfServiceAttemptsValue)).to.equal('3');
});

Then(/^check Generate Password message when user identity is not verified$/, async function() {
  logger.info("Checking message for unverified user");
  expect(await helper.getElementText(viewOimUserPage.selectors.generatePasswordUnverifiedUserText)).to.equal(viewOimUserPage.screenMessages.msg_050);
});

Then(/^BankUser checks the value in Verified On field for non ANZ Managed user is "(.*)"$/, async function(value) {
    logger.info("Checking the value of Verified On field for Non-Anz managed user");
   expect(await helper.getElementText(viewOimUserPage.selectors.verifiedOn)).to.equal(value);
});

Then(/^BankUser clicks Customer Name link to view Customer page$/, async function() {
  logger.info("Clicking customer link");
  let customer = await helper.getElementText(viewOimUserPage.selectors.customerLink)
  await helper.click(viewOimUserPage.selectors.customerLink);
  expect(await helper.waitForDisplayed(viewCustomerPage.selectors.customerIcon));
  expect(await helper.getElementText(viewCustomerPage.selectors.customerName) + ' ' +
    await helper.getElementText(viewCustomerPage.selectors.customerId)).to.equal(customer);
});

Then(/^BankUser clicks CAAS Org Name link to view CAAS Org page$/, async function() {
  logger.info("Clicking CAAS Org link");
  let caasOrg = await helper.getElementText(viewOimUserPage.selectors.caasOrgLink);
  let caasOrgName = caasOrg.match(/^(.+) \((.+?)\)$/)[1];
  let caasOrgId = caasOrg.match(/^(.+) \((.+?)\)$/)[2];
  await helper.click(viewOimUserPage.selectors.caasOrgLink);
  expect(await helper.getElementText(viewCaasOrgPage.selectors.orgIdValue)).to.equal(caasOrgId);
  expect(await helper.getElementText(viewCaasOrgPage.selectors.orgNameValue)).to.equal(caasOrgName);
});

Then(/^check Serial Number is displayed correctly in Security Devices tab on User Details page$/, async function() {
  // serial number should have been saved in this.securityDeviceIssuanceEntry['serialNumber'] in previous steps
  const serialNumber = this.securityDeviceIssuanceEntry['serialNumber'];

  await helper.waitForDisplayed(viewOimUserPage.selectors.securityDevicesTab);
  if (!(await viewOimUserPage.isTabActive(viewOimUserPage.selectors.securityDevicesTab))) {
    logger.info('Click on Security Devices tab');
    await helper.click(viewOimUserPage.selectors.securityDevicesTab);
  }
  await helper.waitForDisplayed(viewOimUserPage.selectors.selectedSecurityDevicesGrid);

  logger.info(`Check Serial Number ${serialNumber} is displayed`);
  const n = await viewOimUserPage.findSecurityDeviceInGrid(this.securityDeviceIssuanceEntry['deviceType']);
  expect(await viewOimUserPage.getSecuritySerialNumberOnRow(n)).to.equal(serialNumber);
});

Then(/^check "(ANZ Digital Key|Token Digipass 270|Token Digipass 276 \(China Compliant\))" is displayed correctly in Security Devices tab with Status "(.*)" and Description "(.*)"$/, async function(deviceType, status, description) {
  //console.log(JSON.stringify(this.users));
  await helper.waitForDisplayed(viewOimUserPage.selectors.securityDevicesTab);
  if (!(await viewOimUserPage.isTabActive(viewOimUserPage.selectors.securityDevicesTab))) {
    await helper.click(viewOimUserPage.selectors.securityDevicesTab);
  }
  await helper.waitForDisplayed(viewOimUserPage.selectors.selectedSecurityDevicesGrid);
  const n = await viewOimUserPage.findSecurityDeviceInGrid(deviceType);
  logger.info(`Check security device status is: ${status}`);
  expect(await viewOimUserPage.getSecurityDeviceStatusOnRow(n)).to.equal(status);
  logger.info(`Check security device description is: ${description}`);
  expect(await viewOimUserPage.getSecurityDeviceDescriptionOnRow(n)).to.equal(description);
  logger.info('check security device last requested date is Today');
  expect(await viewOimUserPage.getSecurityDeviceRequestedDateOnRow(n)).to.equal(randomData.getTodayDate());
});

Then(/^check "(ANZ Digital Key|Token Digipass 270|Token Digipass 276 \(China Compliant\))" is displayed correctly in Security Devices tab with Status New$/, async function(deviceType) {
  await helper.waitForDisplayed(viewOimUserPage.selectors.securityDevicesTab);
  if (!(await viewOimUserPage.isTabActive(viewOimUserPage.selectors.securityDevicesTab))) {
    await helper.click(viewOimUserPage.selectors.securityDevicesTab);
  }
  await helper.waitForDisplayed(viewOimUserPage.selectors.selectedSecurityDevicesGrid);
  const n = await viewOimUserPage.findSecurityDeviceInGrid(deviceType);
  logger.info(`Check security device status is: New`);
  expect(await viewOimUserPage.getSecurityDeviceStatusOnRow(n)).to.equal("New");
});

Then(/^Bankuser clicks (Applications|Security Devices|Entitlements|Notifications|Audit) tab$/, async function(tabName) {
    const tabSelector = (tabName === 'Applications') ? viewOimUserPage.selectors.applicationsTab : (tabName === 'Security Devices') ? viewOimUserPage.selectors.securityDevicesTab : (tabName === 'Entitlements') ? viewOimUserPage.selectors.entitlementsTab : (tabName === 'Notifications') ? viewOimUserPage.selectors.notificationsTab : viewOimUserPage.selectors.auditTab;
    await helper.click(tabSelector);
    logger.info(`User navigated to ${tabName} tab`);
});

Then(/^Bankuser verifies that Entitlements tab does not exist$/, async function() {
      expect(await helper.ifElementDisplayed(viewOimUserPage.selectors.entitlementsTab)).to.equal(false);
    logger.info('User verifies that Entitlements tab is not existing');
});

Then(/^Bankuser checks the value in Authorisation Group is "(.*)"$/, async function(value) {
    logger.info('Checking data in authorisation group');
    expect(await helper.getElementText(viewOimUserPage.selectors.authGroupValue)).to.equal(value);
    logger.info(`valus in auh group is ${(await helper.getElementText(viewOimUserPage.selectors.authGroupValue))}`);
});

Then(/^check User status is "(.*)" and workflow is "(.*)" in view User page$/, async function(status, workflow) {
  if (await helper.isElementPresent(viewOimUserPage.selectors.successNotificationMsg)) 
    await helper.waitForElementToDisAppear(viewOimUserPage.selectors.successNotificationMsg, 5);

  await helper.waitForDisplayed(viewOimUserPage.selectors.userIdValueInHeader, 15);
  logger.info(`Check user status ${status} and workflow ${workflow} are displayed on User details page`);
  expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableRightColumn(1)).to.equal(`Status:${status}`);
  expect(await viewOimUserPage.getNthRowTextInHeaderDetailsTableRightColumn(2)).to.equal(`Workflow:${workflow}`);
});

Then(/^check Entitlements tab of User Details page in (View|Edit) mode$/, async function(mode) {
  if (!(await viewOimUserPage.isTabActive(viewOimUserPage.selectors.entitlementsTab))) {
    await helper.click(viewOimUserPage.selectors.entitlementsTab);
  }
  const userId = await viewOimUserPage.getUserIDInPageHeader();
  let userData = null;
  if (this.userData && this.userData.userId.toUpperCase() === userId) {
    userData = this.userData;
  } else if (this.users && this.users.length > 1) {
    for (let user of this.users) {
      if (user.userId.toUpperCase() === userId) {
        userData = user;
        break;
      }
    }
  }
  await helper.waitForDisplayed(viewOimUserPage.selectors.entitlementsGrid);

  logger.info('Checking Entitlement Grid headers');
  const headers = await helper.getNestedElements(viewOimUserPage.selectors.entitlementsGridHeaders);
  await expect(await headers[0].getText()).to.equal('Division ID');
  await expect(await headers[1].getText()).to.equal('Division Name');
  await expect(await headers[2].getText()).to.equal('Role Name');
  await expect(await headers[3].getText()).to.equal('Role Family');
  await expect(await headers[4].getText()).to.equal('Role Type');

  logger.info('Check User\'s Entitlements');
  let authGroupVisible = false;
  console.log(JSON.stringify(userData['entitlementsUI']))
  for (let entitlement of userData['entitlementsUI']) {
    const roleName = entitlement['roleName'];
    const roleFamily = entitlement['roleFamily'];
    const row = await viewOimUserPage.findEntitlementInGrid(roleName);
    expect(await viewOimUserPage.getDivisionIdInEntitlementsGrid(row)).to.equal(entitlement['divisionId']);
    expect(await viewOimUserPage.getDivisionNameInEntitlementsGrid(row)).to.equal(entitlement['divisionName']);
    expect(await viewOimUserPage.getRoleFamilyInEntitlementsGrid(row)).to.equal(entitlement['roleFamily']);
    expect(await viewOimUserPage.getRoleTypeInEntitlementsGrid(row)).to.equal(entitlement['roleType']);
    if (roleFamily === 'Cash Management') authGroupVisible = true;
  }

  logger.info('Check "Add/Remove Entitlement buttons');
  const buttonVisible = (mode === 'Edit');
  expect(await helper.isElementPresent(viewOimUserPage.selectors.addEntitlement)).to.equal(buttonVisible);
  expect(await helper.isElementPresent(viewOimUserPage.selectors.removeEntitlement)).to.equal(buttonVisible);

  logger.info('Check "Authorisation Group"');
  // auth group is a bit slower in rendering, allow time for it to be rendered on the page
  if (mode === 'Edit') {
    try {
      await helper.waitForDisplayed(viewOimUserPage.selectors.authGroupSelect, 2);
    } catch (e) {
      // auth group is not rendered. do nothing
    }
    expect(await helper.isElementPresent(viewOimUserPage.selectors.authGroupSelect)).to.equal(authGroupVisible);
  } else {
    try {
      await helper.waitForDisplayed(viewOimUserPage.selectors.authGroupValue, 2);
    } catch (e) {
      // auth group is not rendered. do nothing
    }
    expect(await helper.isElementPresent(viewOimUserPage.selectors.authGroupValue)).to.equal(authGroupVisible);
  }
});

Then(/^check the User Security Devices Tab elements in "(View|Modify)" Mode$/, async function(mode) {
  if (!(await viewOimUserPage.isTabActive(viewOimUserPage.selectors.securityDevicesTab))) {
    await helper.click(viewOimUserPage.selectors.securityDevicesTab);
  }
  const userId = await viewOimUserPage.getUserIDInPageHeader();
  let userData;

  if (this.userData && this.userData.userId.toUpperCase() === userId) {
    userData = this.userData;
  } else if (this.users && this.users.length > 1) {
    for (let user of this.users) {
      if (user.userId.toUpperCase() === userId) {
        userData = user;
        break;
      }
    }
  }

  const headers = await helper.getNestedElements(viewOimUserPage.selectors.devicesTableColumnHeaders);
  await expect(await headers[0].getText()).to.equal('Security Device');
  await expect(await headers[1].getText()).to.equal('Serial Number');
  await expect(await headers[2].getText()).to.equal('Status');
  await expect(await headers[3].getText()).to.equal('Description');
  await expect(await headers[4].getText()).to.equal('Requested Date');
  await expect(await headers[5].getText()).to.equal('Issuance Location');
  logger.info('Security Devices table headers OK');

  logger.info('Check Security Device buttons');
  const buttonVisible = (mode === 'Modify');
  if (buttonVisible){
    expect(await helper.isElementPresent(viewOimUserPage.selectors.addBtn)).to.equal(buttonVisible);
    expect(await helper.isElementPresent(viewOimUserPage.selectors.enableBtn)).to.equal(buttonVisible);
    expect(await helper.isElementPresent(viewOimUserPage.selectors.removeBtn)).to.equal(buttonVisible);
  } else {
    expect(await helper.isElementPresent(viewOimUserPage.selectors.unblockBtn)).to.equal(true);
    expect(await helper.isElementPresent(viewOimUserPage.selectors.resetBtn)).to.equal(true);
    expect(await helper.isElementPresent(viewOimUserPage.selectors.disableBtn)).to.equal(true);
  }
});

Then(/^Check that edit button is "(Enabled|Disabled)" on Verify User page$/, async function(status) {
  await helper.waitForDisplayed(viewOimUserPage.selectors.editBtnVerifyUser);
  logger.info(`Check edit button is disabled`);
  const btnSelector =  viewOimUserPage.selectors.editBtnVerifyUser;
  expect (await helper.ifDisabledAttributeExist(btnSelector));
});