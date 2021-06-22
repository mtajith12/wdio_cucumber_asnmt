import { Then } from 'cucumber';
import { helper } from 'src/Helper';
import { MenuBar } from 'src/MenuBarPage';
import { BankUsers } from 'src/BankUsersPage';
import * as faker from 'faker';
import { getLogger } from 'log4js';
import { selectors } from 'src/Selectors';
import { expect } from 'chai';
import { cobraloginPage } from 'src/Login';
import { CreateRole } from 'src/CreateRole';
import { createResource } from 'src/CreateResources';
import { users } from 'src/Users';
import * as jp from 'jsonpath';
import * as _ from 'lodash';
import { cobracustomer } from 'src/CreateCustomerPage';
import { cobraReportPage } from 'pages/UserReports';
const data = require('src/DataReader');
let entitlementData = [];
const addNewEntitlementData = [];
const logger = getLogger();
Then(/^Click on regsiter bankuser$/, async () => {
  await helper.click(MenuBar.selectors.bankuser);
});
Then(/^Register an bankuser "([^"]*)"$/, async function (bankuser, details) {
  const employeeData = {
    lanId: (bankuser === 'random') ? faker.random.alphaNumeric(8) : bankuser,
    employeeId: '123456',
  };

  const entitlements = details.hashes();
  for (const act of entitlements) {
    entitlementData.push({
      adminFunction: act.adminFunction,
      jurisdriction: act.jurisdriction.split(','),
      restrictedCountries: act.restrictedCountries.split(','),
      productFamily: act.productFamily.split(','),

    });
  }
  this.entitlementData = entitlementData;
  this.queryBankUser = `select * from CA_OWNER.USR where CLASSIFICATION = 'B' and SRC_SYS_LOGIN_ID = '${employeeData.lanId}'`;
  this.employeeData = employeeData;
  this.bankUser = await BankUsers.registerBankUsers(employeeData, entitlementData);
  logger.info(bankuser);
  await helper.screenshot('Register an bankuser');
  this.bankuserDefault = employeeData;
  this.bankuserApprover = employeeData;
  entitlementData = [];
});
Then(/^Search the BankUser in searchscreen and "([^"]*)" "([^"]*)" workflow$/, async function (action, userAction) {
  if (action === 'Verify' && userAction === 'new') {
    await BankUsers.searchUsersNValidateWorkFlow(this.employeeData, 'Pending Approval - Register', undefined);
  } else if (action === 'Approve' && userAction === 'new') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionApprove = {
      message: `On approval Bank User: ${this.bankUser} will be registered.`,
      notificationMessage: `Bank User: ${this.bankUser} has been registered.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
    };
    logger.info(actionApprove);
    await BankUsers.searchUsersNValidateWorkFlow(this.employeeData, 'Approved', actionApprove);
  } else if (action === 'Approve' && userAction === 'modify') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionPendingApproveModified = {
      message: `Approve changes to Bank User: ${this.bankUser}.`,
      notificationMessage: `Changes to Bank User: ${this.bankUser} have been approved.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
    };
    await BankUsers.searchUsersNValidateWorkFlow(this.employeeData, 'Approved', actionPendingApproveModified);
  } else if (action === 'Verify' && userAction === 'deregister') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
    const actionDeregister = {
      message: `This will submit Bank User: ${this.bankUser} to be de-registered.`,
      notificationMessage: `Bank User: ${this.bankUser} is now pending approval to be de-registered.`,
      action: selectors.searchGrid.gridElementRightClick.deregisterBtnBank,
    };
    await BankUsers.searchUsersNValidateWorkFlow(this.employeeData, 'Pending Approval - Deregister', actionDeregister);
  } else if (action === 'Approve' && userAction === 'deregister') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionDeregisterApprove = {
      message: `On approval Bank User: ${this.bankUser} will be de-registered.`,
      notificationMessage: `Bank User: ${this.bankUser} has been de-registered.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
    };
    await BankUsers.searchUsersNValidateWorkFlow(this.employeeData, 'Approved', actionDeregisterApprove);
  }
  await helper.screenshot(`SearchScreen ${action}`);
});
Then(/^Validate against CA for Bankuser "([^"]*)" "([^"]*)" workflow$/, { wrapperOptions: { retry: 20 } }, async function (action, userAction) {
  if (action === 'Approve' && userAction === 'new') {
    const actionApprove = {
      flag: true,
      db: {
        QUERY: this.queryBankUser,
        version: '1',
      },
    };
    logger.info(actionApprove);
    await BankUsers.db(actionApprove);
  } else if (action === 'Approve' && userAction === 'modify') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionPendingApproveModified = {
      flag: true,
      db: {
        QUERY: this.queryBankUser,
        version: '2',
      },
    };
    await BankUsers.db(actionPendingApproveModified);
  } else if (action === 'Approve' && userAction === 'deregister') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionDeregisterApprove = {
      flag: false,
      db: {
        QUERY: this.queryBankUser,
        version: '3',
      },
    };
    await BankUsers.db(actionDeregisterApprove);
  }
});
Then(/^BankUser edits the created bankuser$/, async function (details) {
  const x = details.hashes();
  for (const act of x) {
    addNewEntitlementData.push({
      adminFunction: act.adminFunction,
      jurisdriction: act.jurisdriction.split(','),
      restrictedCountries: act.restrictedCountries.split(','),
      productFamily: act.productFamily.split(','),

    });
  }
  this.entitlementData = addNewEntitlementData;


  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);

  await BankUsers.addData(addNewEntitlementData);
  // await helper.pause(2);
  await helper.screenshot('entitlementData');
});
Then(/^Validate the "([^"]*)" message for bankuser$/, async (status) => {
  if (status === 'register') {
    const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

    logger.info(NotificationMessage);
    expect(NotificationMessage).to.be.oneOf(['Request Submitted Successfully.', '']);
  } else if (status === 'modify') {
    const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

    logger.info(NotificationMessage);
    // expect(NotificationMessage).to.be.oneOf([`Bank User: ${this.bankUser} is now pending approval to be modified.`, '']);

    // Validate on the UI
  } else if (status === 'deregister') {
    const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

    logger.info(NotificationMessage);
  }
});

Then(/^register "([^"]*)"$/, async function (bankuser) {
  this.bankuserDefault = await BankUsers.bankUserRegistration(bankuser);
});
Then(/^validate the elements present in the bankUser screen$/, async () => {
  await helper.waitForDisplayed(MenuBar.selectors.bankuser, 10000);
  await helper.click(MenuBar.selectors.bankuser);
  await helper.waitForDisplayed(selectors.searchGrid.firstName, 15000);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.firstName)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.lastName)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.lanId)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.employeeId)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.country1)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.workflow)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.status)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.searchBtn)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.saveBtn)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.resetBtn)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.statusNew)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.statusEnabled)).to.equal(true);
  await helper.screenshot('validate screen- BankUser');
});
Then(/^Verify "([^"]*)" if "([^"]*)" "([^"]*)" is displayed$/, async function (entity, country, action) {
  if (entity === 'Customer') {
    if (action === 'Country') {
      const labelCountry = `//label[contains(text(),'${country}')]`;
      expect(await helper.ifElementDisplayed(labelCountry)).to.be.not.equal(true);
    }
  } else if (entity === 'Resource') {
    // await helper.pause(2);
    await helper.waitForDisplayed(MenuBar.selectors.resource, 15000);
    await helper.click(MenuBar.selectors.resource);
    await helper.click(selectors.Resource.actions);
    // await helper.pause(2);
    await helper.click(selectors.Resource.newResource);
    await createResource.searchCustomers(this.Customer);

    // Selecting Resource.inputText
    await helper.waitForDisplayed(selectors.Resource.resourceType, 15000);
    // await helper.pause(2);
    await helper.selectByVisibleText(selectors.Resource.resourceType, 'Accounts');
    if (action === 'Country') {
      const labelCountry = `//option[contains(text(),'${country}')]`;
      expect(await helper.ifElementDisplayed(labelCountry)).to.be.not.equal(true);
    }
    // await helper.pause(2);
    await helper.waitForDisplayed(selectors.Customers.cancel);
    await helper.click(selectors.Customers.cancel);
    await helper.waitForDisplayed(selectors.Division.confirmationBtn);
    await helper.click(selectors.Division.confirmationBtn);
    // await helper.pause(2);
  } else if (entity === 'SummaryGrid') {
    await helper.waitForDisplayed(MenuBar.selectors.resource, 15000);
    await helper.click(MenuBar.selectors.resource);
    await helper.inputText(selectors.searchGrid.country, country);
    await helper.click(selectors.searchGrid.hostSystemDiv);
    await helper.click(selectors.searchGrid.searchBtn);
    // Selecting Resource.inputText
    if (action === 'Country') {
      await helper.pause(6);
      await helper.ifElementDisplayed('#confirmButton') ? await helper.click('#confirmButton') : undefined;
      const labelCountry = '//div[@class=\'grid-canvas\']//div[1]//div[6]';
      console.log(await helper.getElementText(labelCountry));
      expect(await helper.getElementText(labelCountry)).to.be.equal('XXXXXXXX');
    }
  }
});
Then(/^BankUser validates the created bankuser with$/, async (details) => {
  await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
  const entitlements = details.hashes();
  for (const act of entitlements) {
    entitlementData.push({
      adminFunction: act.adminFunction,
      jurisdriction: act.jurisdriction.split(','),
      restrictedCountries: act.restrictedCountries.split(','),
      productFamily: act.productFamily.split(','),

    });
  }
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
  await helper.waitForDisplayed(selectors.Users.editEntitlementsTab);
  await helper.click(selectors.Users.editEntitlementsTab);
  for (const i in entitlementData) {
    await helper.screenshot('entitlement Screen');

    await helper.doubleClickbasedonText(entitlementData[i].adminFunction, selectors.Users.entitlementOptions.selected);
    for (const j in entitlementData[i].jurisdriction) {
      const country = `//label[contains(text(),'${entitlementData[i].jurisdriction[j]}')]`;

      await helper.waitForDisplayed('//div[contains(text(),\'Jurisdictions\')]', 15000);
      expect(await helper.ifElementDisplayed(country)).to.be.equal(true);
    }
    await helper.click('[class=\'fa fa-times\']');
    // await helper.pause(4);
  }
});
Then(/^Verify the bankuser "([^"]*)" Permissions$/, async (role) => {
  await helper.waitForDisplayed('#manage', 15000);
  switch (role) {
    default:
    case 'Viewer':
    case 'Helpdesk Officer':
    case 'Payments Maker':
      expect(await helper.ifElementDisplayed('#onBoardCustomer')).to.be.equal(false);
      expect(await helper.ifElementDisplayed('#newDivision')).to.be.equal(false);
      expect(await helper.ifElementDisplayed('#registerResources')).to.be.equal(false);
      expect(await helper.ifElementDisplayed('#registerUser')).to.be.equal(false);
      expect(await helper.ifElementDisplayed('#newAuthPanel')).to.be.equal(false);
      expect(await helper.ifElementDisplayed('#registerBankUsers')).to.be.equal(false);
      expect(await helper.ifElementDisplayed('#newRole')).to.be.equal(false);

      break;
    case 'Helpdesk Team Lead':
      expect(await helper.ifElementDisplayed('#pendingApproval')).to.be.equal(true);
      expect(await helper.ifElementDisplayed('#onboarding')).to.be.equal(false);

      break;
    case 'Implementation Manager':
      expect(await helper.ifElementDisplayed('#onBoardCustomer')).to.be.equal(false);
      expect(await helper.ifElementDisplayed('#newDivision')).to.be.equal(false);
      expect(await helper.ifElementDisplayed('#newResourceGroup')).to.be.equal(true);
      expect(await helper.ifElementDisplayed('#registerResources')).to.be.equal(false);
      expect(await helper.ifElementDisplayed('#newAuthPanel')).to.be.equal(true);
      expect(await helper.ifElementDisplayed('#registerBankUsers')).to.be.equal(false);
      expect(await helper.ifElementDisplayed('#newRole')).to.be.equal(true);

      break;
  }
});
Then(/^Validate jurisdictions and roles added against CA$/, async (details) => {
  const country = details.hashes();
  const rolesvalidation = [];
  for (const act of country) {
    rolesvalidation.push(act.adminFunction);
  }

  const bankuser = 'select  ENTITLEMENT_ID,PRODUCT_ID, COUNTRY_CODE from CA_OWNER.ENTITLEMENT_RESOURCE join CA_OWNER.GEOGRAPHY on CA_OWNER.ENTITLEMENT_RESOURCE.RESOURCE_ID=CA_OWNER.GEOGRAPHY.RESOURCE_ID where CA_OWNER.ENTITLEMENT_RESOURCE.ENTITLEMENT_ID in (select ID from CA_OWNER.ENTITLEMENT where CA_OWNER.ENTITLEMENT.PARTY_ID in (select CA_OWNER.usr.USER_ID from CA_OWNER.usr where CA_OWNER.usr.SRC_SYS_LOGIN_ID = \'0them5ou\'))';
  const roles = 'select  PARTY_ID, ROLE_NAME from CA_OWNER.ENTITLEMENT join CA_OWNER.PRODUCT_ROLE on CA_OWNER.ENTITLEMENT.ROLE_ID=CA_OWNER.PRODUCT_ROLE.ROLE_ID where CA_OWNER.ENTITLEMENT.PARTY_ID in (select CA_OWNER.usr.USER_ID from CA_OWNER.usr where CA_OWNER.usr.SRC_SYS_LOGIN_ID = \'0them5ou\')';
  logger.info(bankuser);
  if ((process.env.DB_CHECK).toString() === 'true') {
    const caOwner = await users.DBvalidations(bankuser);

    const jsoncaowner = await caOwner;
    const countries = Array.from(new Set((jp.query(await jsoncaowner, '$..COUNTRY_CODE').toString()).split(',')));

    const caOwner1 = await users.DBvalidations(roles);

    const jsoncaowne1 = await caOwner1;

    const roles1 = Array.from(new Set((jp.query(await jsoncaowne1, '$..ROLE_NAME').toString()).split(',')));


    // expect(rolesvalidation).to.have.members(roles1);


  // expect(['CN', 'NZ', 'SG', 'HK', 'KH', 'IN', 'ID', 'PH', 'TW', 'TH', 'VN', 'CK', 'FJ', 'KI', 'LA', 'MM', 'PG', 'WS', 'SB', 'TL', 'TO', 'VU', 'GB', 'US', 'AU']).to.have.members(countries);
  }
});
Then(/^BankUser validated the Audit Sceanrios$/, async function (details) {
  const audit = details.hashes();
  const auditvalidations = [];
  const count = [];
  const entitlement = [];
  const jurisdictions = [];
  const restrictedCountrie = [];

  for (const act1 of audit) {
    auditvalidations.push({
      description: `//div[contains(text(),'${act1.Description}')]`,
      action: `//div[contains(text(),'${act1.Action}')]`,

    });
  }
  console.log(auditvalidations);
  await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
  await helper.waitForDisplayed(MenuBar.selectors.onboarding);
  await helper.click(MenuBar.selectors.onboarding);
  await helper.waitForDisplayed(MenuBar.selectors.bankuser);
  await helper.click(MenuBar.selectors.bankuser);
  await helper.waitForDisplayed(selectors.searchGrid.lanId);
  await BankUsers.searchByLanID(this.employeeData);
  await BankUsers.selectBankuserFromGrid();
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
  await helper.click(selectors.BankUsers.auditTab);
  await helper.waitForDisplayed('div[id=\'bankUser-audit-grid\']', 1500);
  // await helper.pause(2);
  for (const i in auditvalidations) {
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].description)).to.be.equal(true);
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].action)).to.be.equal(true);
    if (auditvalidations[i].action.includes('Created') || auditvalidations[i].action.includes('Modified')) {
      const x = await auditvalidations[i].action.includes('Modified');
      await helper.doubleClick(auditvalidations[i].description);

      for (const i in this.entitlementData) {
        count.push(i);
        entitlement.push(this.entitlementData[i].adminFunction);
        jurisdictions.push([this.entitlementData[i].jurisdriction]);

        restrictedCountrie.push([this.entitlementData[i].restrictedCountries]);
      }

      await BankUsers.auditValidations(await x, count, entitlement, jurisdictions, restrictedCountrie);
    }
  }
});

Then(/^Bankuser Verifies the view rights$/, { wrapperOptions: { retry: 3 } }, async (details) => {
  const viewRight = details.hashes();
  const viewRightvalidation = [];

  for (const act of viewRight) {
    viewRightvalidation.push({
      entity: act.Entity,
      selector: `//span[contains(text(),'${act.Selector}')]`,
      status: act.Status,
      action: act.Action,
    });
  }
  console.log(viewRightvalidation);

  for (const i in viewRightvalidation) {
    logger.info(viewRightvalidation[i].entity);
    if (viewRightvalidation[i].entity === 'System Role Management') {
      if (viewRightvalidation[i].action === 'Verify System roles') {
        await helper.waitForDisplayed(MenuBar.selectors.onboarding);
        await helper.click(MenuBar.selectors.onboarding);
        await helper.click('[id="role"]');
        await helper.scrollToElement(selectors.Role.searchGrid.roleType);
        await helper.inputText(selectors.Role.searchGrid.roleType, 'Syste');
        await helper.click('//span[contains(text(),\'System\')]');
        await helper.waitForDisplayed(selectors.searchGrid.searchBtn);
        await helper.click(selectors.searchGrid.searchBtn);
        if (await helper.ifElementDisplayedAfterTime('#confirmButton')) {
          await helper.click('#confirmButton');
        }
        await helper.pause(1);
        expect(await helper.ifElementDisplayedAfterTime(selectors.searchGrid.gridFirstElement)).to.be.equal(true);
      }
    } else {
      await helper.waitForDisplayed(MenuBar.selectors.onboarding);
      await helper.click(MenuBar.selectors.onboarding);
      if (viewRightvalidation[i].entity === 'user') {
        await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']', 15000);
        await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
      } else {
        await helper.waitForDisplayed(MenuBar.selectors.onboarding);
        await helper.click(MenuBar.selectors.onboarding);
        await helper.click(`[id="${viewRightvalidation[i].entity}"]`);
      }
      await helper.waitForDisplayed(selectors.searchGrid.actionsBtn);
      await helper.click(selectors.searchGrid.actionsBtn);
      if (viewRightvalidation[i].status === 'disable') {
        expect(await helper.ifElementDisplayedAfterTime(viewRightvalidation[i].selector)).to.be.equal(true);
        expect(await helper.isElementDisabled(viewRightvalidation[i].selector)).to.be.equal(true);
      }
    }
  }
});

Then(/^Corresponding notification message is displayed$/, async () => {
  let errmsg = 'Access Denied - No role assigned. Please ensure you have completed the COBRA Bank Admin access form available on MAX.'
  console.log(selectors.Users.notificationMessage)
  expect(await helper.getElementText(selectors.Users.notificationMessage)).to.be.equal(errmsg)
  expect(await helper.isElementDisabled(selectors.Users.UserApprovalConfirmationYesButton)).to.be.equal(false);
});

Then(/^Verify if the "([^"]*)" and "([^"]*)" under Reports Menu is displayed "([^"]*)" for "([^"]*)"$/, async function (link1, link2, isPresent, report) {

  await helper.pause(2)
  if (link1 != undefined) {
    if (isPresent == 'true') {
      expect(await helper.isElementPresent('//a[@id=\'runReport\']')).to.be.equal(true);
    }
    else {
      expect(await helper.isElementPresent('//a[@id=\'runReport\']')).to.be.equal(false);
    } console.log("Run Report");
  }
  if (link2 != undefined) {
    if (isPresent == 'true') {
      expect(await helper.isElementPresent('//a[@id=\'downloadReports\']')).to.be.equal(true);
    }
    else {
      expect(await helper.isElementPresent('//a[@id=\'downloadReports\']')).to.be.equal(false);
    }
    console.log("Download Report");
  }
  console.log("The Bankuser Reports Menu is as expected : " + isPresent);

  if (isPresent == 'false') {
    await helper.waitForDisplayed(selectors.searchGrid.approvalPopUp.confirmButton);
    await helper.click(selectors.searchGrid.approvalPopUp.confirmButton);
  }
  else {
    await helper.waitForDisplayed('//a[@id=\'runReport\']');
    await helper.click('//a[@id=\'runReport\']');
    let reportTypes = ['Authorisation Matrix Report', 'Bank User Activity Report', 'Customer Division Detail Report', 'Customer Division Detail Report', 'Customer User Details Report']
    let reports = report == 'All' ? reportTypes : (report == 'None' ? [] : report.split(','));

    for (const j in reports) {
      console.log(reports[j])
      await helper.click(selectors.Reports.reportType);
      await helper.ifElementExists(selectors.Reports.reportType);
      await helper.selectByVisibleText(selectors.Reports.reportType, reports[j]);
    }
    console.log("Verified dropdown for all the above report types");

    await helper.waitForDisplayed('//a[@id=\'downloadReports\']');
    await helper.click('//a[@id=\'downloadReports\']')

    expect(await helper.ifElementDisplayedAfterTime('//*[@id=\'noResultsMessage\']')).to.equal(true);
    console.log("Verified download link for the created bankuser");
  }
});