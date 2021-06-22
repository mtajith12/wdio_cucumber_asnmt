import { Then } from 'cucumber';
import { CreateRole } from 'src/CreateRole';
import * as _ from 'lodash';
import { MenuBar } from 'src/MenuBarPage';
import { helper } from 'src/Helper';
import { cobraloginPage } from 'src/Login';
import { getLogger } from 'log4js';
import { expect } from 'chai';
import * as faker from 'faker';
import { selectors } from 'src/Selectors';
import { cobracustomer } from 'src/CreateCustomerPage';
import { DBConnection } from 'src/DBConnection';
import * as jp from 'jsonpath';
import { createResource } from 'pages/CreateResources';
import { values } from 'lodash';
const data = require('src/DataReader');

const logger = getLogger();

Then(/^Click on Create a Role$/, async () => {
  await helper.click(MenuBar.selectors.role);
  await helper.waitForDisplayed(selectors.Role.actions);
  await helper.click(selectors.Role.actions);
  logger.info('Role Created ');
});

Then(/BankUser creates a role$/, { wrapperOptions: { retry: 6 } }, async function () {
  const roleName = await CreateRole.Role(this.Customer);
  logger.info('2');
  this.roleName = roleName;
  this.queryRole = `select * from CA_OWNER.PRODUCT_ROLE WHERE ROLE_NAME='${this.roleName}'`;
  this.roleData = _.merge(this.data, roleName);
  await MenuBar.signOut();
  await helper.pause(2);
  await helper.openURL(data.getData('urlDomain'));
  const Username = data.getData('cobraApprover');
  const Password = data.getData('passwordApprover');
  await cobraloginPage.enterUserName(Username);
  await cobraloginPage.enterPassword(Password);
  await cobraloginPage.clickSubmit();
  const actionApprove = {
    action: selectors.searchGrid.gridElementRightClick.approveBtn,
    flag: true,
    db: {
      QUERY: this.queryRole,
      version: '1',
    },
  };
  await CreateRole.searchRolesNValidateWorkFlow(this.roleData, 'Approved', actionApprove);
  // await helper.pause(2);
  // const jsoncaowner = await DBConnection.run(actionApprove);
  // this.roleUid = await jp.query(await jsoncaowner, '$..ROLE_ID').toString();
  // console.log(`query - ${this.roleUid}`);
  // expect(await jp.query(await jsoncaowner, '$..ROLE_ID')).to.be.not.equal(null);
});
Then(/Get role id$/, { wrapperOptions: { retry: 20 } }, async function () {
  const jsoncaowner = await DBConnection.run(this.queryRole);
  this.roleUid = await jp.query(await jsoncaowner, '$..ROLE_ID').toString();
  console.log(`query - ${this.queryRole}`);
  console.log(`roleUid - ${this.roleUid}`);
  expect(await jp.query(await jsoncaowner, '$..ROLE_ID')).to.be.not.equal(null);
});

Then(/BankUser submits role$/, async function () {
  const roleData = {
    description: faker.random.alphaNumeric(10),
    roleName: faker.random.alphaNumeric(10),
  };
  this.roleName = await CreateRole.RoleData(this.Customer, roleData, this.roles);
  this.roleData = {
    customerId: this.Customer.customerId,
    roleName: this.roleName,
  };
  console.log(this.roleData);
  this.queryRole = `select * from CA_OWNER.PRODUCT_ROLE WHERE ROLE_NAME='${this.roleName}'`;
});

Then(/^Validate the "([^"]*)" message for Role$/, async function (status) {
  if (status === 'register') {
    const NotificationMessage = await helper.getElementTextIfPresent(selectors.Role.searchGrid.approvalPopUp.NotificationMessage);
    logger.info(NotificationMessage);
    expect(NotificationMessage).to.be.oneOf(['Request Submitted Successfully.', '']);
  } else if (status === 'modify') {
    const message1 = await helper.getElementTextIfPresent(selectors.Role.searchGrid.approvalPopUp.message1);
    logger.info(message1);
    expect(message1).to.be.oneOf([`This will submit Role: ${this.roleName} (${this.roleId}) to be modified.`, '']);
    const NotificationMessage = await helper.getElementTextIfPresent(selectors.Role.searchGrid.approvalPopUp.NotificationMessage);
    logger.info(NotificationMessage);
    expect(NotificationMessage).to.be.oneOf([`Role ${this.roleName} (${this.roleId}) is now pending approval to be modified.`, '']);
  } else if (status === 'delete') {
    const NotificationMessage = await helper.getElementTextIfPresent(selectors.Role.searchGrid.approvalPopUp.NotificationMessage);
    logger.info(NotificationMessage);
  }
  await helper.screenshot(`Validate -${status}`);
});

Then(/^BankUser edits the role description$/, async function () {
  logger.info('Editing- description');
  await helper.waitForElementToDisAppear(selectors.Role.searchGrid.approvalPopUp.NotificationMessage, 10000);
  await helper.rightClick(selectors.Role.searchGrid.gridFirstElement, selectors.Role.searchGrid.gridElementRightClick.editBtn);
  const newRoleDesc = (`${'Changed Description' + ' '}${faker.name.findName().toString().replace(/[&/\\#,+()$~%.'":*?<>{}]/g, '')}`);
  await CreateRole.editRoleDescription(newRoleDesc);
  this.newRoleDesc = newRoleDesc;
  // await helper.pause(2);
  await helper.click(selectors.Role.searchGrid.approvalPopUp.confirmButton);
});

Then(/^Search the entity in searchscreen and "([^"]*)" "([^"]*)" workflow$/, async function (action, userAction) {
  if (action === 'Verify' && userAction === 'new') {
    await CreateRole.searchRolesNValidateWorkFlow(this.roleData, 'Pending Approval - Create', undefined);
  } else if (action === 'Approve' && userAction === 'new') {
    helper.pause(2);
    await helper.waitForElementToDisAppear(selectors.Role.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionApprove = {
      message: `On approval Role: ${this.roleName} (${this.roleId}) will be created.`,
      notificationMessage: `Role: ${this.roleName} (${this.roleId}) has been registered.`,
      action: selectors.Role.searchGrid.gridElementRightClick.approveBtn,
    };
    logger.info(actionApprove);
    await CreateRole.searchRolesNValidateWorkFlow(this.roleData, 'Approved', actionApprove);
  } else if (action === 'Approve' && userAction === 'modify') {
    console.log(this.roleName);
    await helper.waitForElementToDisAppear(selectors.Role.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionPendingApproveModified = {
      message: `Approve changes to Role: ${this.roleName} (${this.roleId}).`,
      notificationMessage: `Changes to Role: ${this.roleName} (${this.roleId}) have been approved.`,
      action: selectors.Role.searchGrid.gridElementRightClick.approveBtn,
    };
    await CreateRole.searchRolesNValidateWorkFlow(this.roleData, 'Approved', actionPendingApproveModified);
  } else if (action === 'Approve' && userAction === 'modify1') {
    console.log(this.roleName);
    await helper.waitForElementToDisAppear(selectors.Role.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionPendingApproveModified = {
      message: `Approve changes to Role: ${this.roleName} (${this.roleId}).`,
      notificationMessage: `Changes to Role: ${this.roleName} (${this.roleId}) have been approved.`,
      action: selectors.Role.searchGrid.gridElementRightClick.approveBtn,

    };
    await CreateRole.searchRolesNValidateWorkFlow(this.roleData, 'Approved', actionPendingApproveModified);
  } else if (action === 'Verify' && userAction === 'delete') {
    await helper.waitForElementToDisAppear(selectors.Role.searchGrid.approvalPopUp.NotificationMessage, 10000);
    const actionDelete = {
      message: `This will submit Role: ${this.roleName} (${this.roleId}) to be deleted.`,
      notificationMessage: `Roles: ${this.roleName} (${this.roleId}) are now pending approval to be deleted.`,
      action: selectors.Role.searchGrid.gridElementRightClick.deleteBtn,

    };
    await CreateRole.searchRolesNValidateWorkFlow(this.roleData, 'Pending Approval - Deleted', actionDelete);
  } else if (action === 'Approve' && userAction === 'delete') {
    await helper.waitForElementToDisAppear(selectors.Role.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionDeleteApprove = {
      message: `On approval Role: ${this.roleName} (${this.roleId}) will be deleted.`,
      notificationMessage: `Role: ${this.roleName} (${this.roleId}) has been deleted.`,
      action: selectors.Role.searchGrid.gridElementRightClick.approveBtn,
      flag: false,
      db: {
        QUERY: this.queryRole,
      },
    };
    await CreateRole.searchRolesNValidateWorkFlow(this.roleData, 'Approved', actionDeleteApprove);
  }
  await helper.screenshot(`Approve-role -${action}`);
});

Then(/^Search the Role in searchscreen and verify users$/, async function () {
  await helper.pause(2);
  console.log(`sample data ${this.Customer}`);
  await createResource.searchRoles(this.Customer);
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.gridElementRightClickViewBtn);
  await helper.click(selectors.searchGrid.usersTab);
  // await helper.pause(5);
  const message1 = await helper.getElementTextIfPresent('//*[@id="customer-users-grid"]/div[6]/div/div[1]/div[5]');
  const message2 = await helper.getElementTextIfPresent('//*[@id="customer-users-grid"]/div[6]/div/div[2]/div[5]');
  console.log(`WFS1 ${message1}`);
  console.log(`WFS2 ${message2}`);
  // expect(message1).to.be.oneOf('Approved');
  expect(message1).to.be.oneOf(['Approved', 'Pending Approval - Create']);
  expect(message2).to.be.oneOf(['Approved', 'Pending Approval - Create']);
});

Then(/^BankUser selects below options$/, async function (details) {
  let sample;
  const roles = details.hashes();

  for (const act of roles) {
    sample = await CreateRole.roleData(this.Customer, act.entity, act.role, act.permission);
  }
  await CreateRole.reset();
  this.roles = sample;
});

Then(/^Bankuser verifies roles selected$/, async function (details) {
  let sample;
  const expected = details.hashes();

  for (const act of expected) {
    sample = await CreateRole.roleData(this.Customer, act.entity, act.role, act.permission);
  }
  await CreateRole.reset();
  const expectedroles = _.uniq(sample);
  const customerData = {
    customerId: this.Customer.customerId,
    roleName: this.roleName,
  };
  await CreateRole.searchRoles(customerData);
  await helper.rightClick(selectors.Role.searchGrid.gridFirstElement, selectors.Role.searchGrid.gridElementRightClick.viewBtn);
  for (const i in expectedroles) {
    expect(await helper.checkIfBoxIsChecked(`//input[@name='${expectedroles[i]}']`)).to.equal(true);
  }

  this.roles = [];
  this.expectedroles = [];
});
Then(/^bankuser edits the role$/, async function (details) {
  const expected = details.hashes();
  for (const act of expected) {
    this.expectedroles = await CreateRole.roleData(this.Customer, act.entity, act.role, act.permission);
  }
  const expectedroles = _.uniq(this.expectedroles);
  await CreateRole.searchRoles(this.Customer);
  await helper.rightClick(selectors.Role.searchGrid.gridFirstElement, selectors.Role.searchGrid.gridElementRightClick.editBtn);
  for (const i in expectedroles) {
    await helper.click(`//input[@name='${expectedroles[i]}']`);
  }
  await helper.click(selectors.Customers.submit);
  await helper.click(selectors.Role.searchGrid.approvalPopUp.confirmButton);
});
Then(/^executing additional CA validations for Role$/, async function () {
  if ((process.env.DB_CHECK).toString() === 'true') {
    const jsoncaowner = await DBConnection.run(this.queryRole);
    logger.info(await jsoncaowner);
    expect(jp.query(await jsoncaowner, '$..ROLE_DESCRIPTION').toString()).to.be.equal(this.newRoleDesc);
    logger.info(`Validated Modified Role Description - ${this.newRoleDesc}`);
  }
});
Then(/^Reject the changes and validate the "([^"]*)" notification messages for Role$/, async function (action) {
  await CreateRole.searchRoles(this.customerData);
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.UserPendingModifiedReject).then(async () => {
    // await helper.pause(2);
    if (action === 'modified') {
      await CreateRole.rejectPendingModifiedApprovalFromGrid();
      const roleRejectNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
      logger.info(roleRejectNotificationMessage);
      //      expect(roleRejectNotificationMessage).to.be.oneOf([`Changes to Role: ${this.roleName} (${this.roleId}) was rejected.`, '']);
      await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn).then(async () => {
        if ((process.env.DB_CHECK).toString() === 'true') {
          logger.info('Executing DB verification');
          // To get Existing DB Values
          const caowner = await DBConnection.run(this.queryRole);
          const jsoncaowner = await caowner;
          const version = jp.query(await jsoncaowner, '$..VERSION').toString();
          const deleteflag = jp.query(jsoncaowner, '$..DELETE_FLAG').toString();
          expect(jp.query(jsoncaowner, '$..VERSION').toString()).to.equal(version);
          expect(jp.query(jsoncaowner, '$..DELETE_FLAG').toString()).to.equal(deleteflag);
          logger.info('No change in DB');
        }
      });
    }
    if (action === 'delete') {
      await CreateRole.rejectPendingModifiedApprovalFromGrid();
      const roleRejectNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
      logger.info(roleRejectNotificationMessage);
      // expect(roleRejectNotificationMessage).to.be.oneOf([`Deletion of Role ${this.roleName} (${this.roleId}) was rejected.`, '']);
      await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn).then(async () => {
        if ((process.env.DB_CHECK).toString() === 'true') {
          logger.info('Executing DB verification');
          // To get Existing DB Values
          const caowner = await DBConnection.run(this.queryRole);
          const jsoncaowner = await caowner;
          const version = jp.query(await jsoncaowner, '$..VERSION').toString();
          const deleteflag = jp.query(jsoncaowner, '$..DELETE_FLAG').toString();
          expect(jp.query(jsoncaowner, '$..VERSION').toString()).to.equal(version);
          expect(jp.query(jsoncaowner, '$..DELETE_FLAG').toString()).to.equal(deleteflag);
          logger.info('No change in DB');
        }
      });
    }
    await helper.screenshot(`Reject Role ${action}`);
  });
});
Then(/^validate against CA for Role "([^"]*)" "([^"]*)" workflow$/, { wrapperOptions: { retry: 20 } }, async function (action, userAction) {
  if (action === 'Approve' && userAction === 'new') {
    helper.pause(2);
    await helper.waitForElementToDisAppear(selectors.Role.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionApprove = {
      flag: true,
      db: {
        QUERY: this.queryRole,
        version: '1',
      },
    };
    logger.info(actionApprove);
    await CreateRole.db(actionApprove);
  } else if (action === 'Approve' && userAction === 'modify') {
    const actionPendingApproveModified = {
      flag: true,
      db: {
        QUERY: this.queryRole,
        version: '2',
      },
    };
    await CreateRole.db(actionPendingApproveModified);
  } else if (action === 'Approve' && userAction === 'modify1') {
    const actionPendingApproveModified = {
      flag: true,
      db: {
        QUERY: this.queryRole,
        version: '3',
      },
    };
    await CreateRole.db(actionPendingApproveModified);
  } else if (action === 'Approve' && userAction === 'delete') {
    const actionDeleteApprove = {
      flag: false,
      db: {
        QUERY: this.queryRole,
      },
    };
    await CreateRole.db(actionDeleteApprove);
  }
  await helper.screenshot(`Approve-role -${action}`);
});

Then(/^validate "([^"]*)" status of Role in the Summary Grid$/, async function (status) {
  logger.info('Validation of Roles Summary Grid');
  await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
  await helper.waitForDisplayed(MenuBar.selectors.onboarding);
  await helper.click(MenuBar.selectors.onboarding);
  await helper.click(MenuBar.selectors.role);
  await helper.waitForDisplayed(selectors.searchGrid.resetBtn);
  await helper.click(selectors.searchGrid.resetBtn);
  await helper.inputText(selectors.searchGrid.customerId, this.roleData.customerId);
  await helper.inputText(selectors.searchGrid.roleName, this.roleData.roleName);
  await helper.waitForDisplayed(selectors.searchGrid.searchBtn);
  await helper.click(selectors.searchGrid.searchBtn);
  await CreateRole.selectCustomerFromGrid();
  expect(await helper.ifElementDisplayedAfterTime(`//div[contains(@class,'grid-canvas')]/div[1]//div[contains(text(),\'${this.roleData.customerId}\')]`)).to.be.equal(true);
  expect(await helper.ifElementDisplayedAfterTime(`//div[contains(@class,'grid-canvas')]/div[1]//div[contains(text(),\'${this.roleName}\')]`)).to.be.equal(true);
  expect(await helper.ifElementDisplayedAfterTime(`//div[contains(@class,'grid-canvas')]/div[1]//div[contains(text(),\'${status}\')]`)).to.be.equal(true);
  expect(await helper.ifElementDisplayedAfterTime('//div[contains(@class,\'grid-canvas\')]/div[1]//div[contains(text(),\'Approved\')]')).to.be.equal(true);
  logger.info(` ${status} role present on Summary Grid`);
});

Then(/^BankUser validates the Audit Scenarios for Role$/, async function (details) {
  logger.info('Audit Role');
  const audit = details.hashes();
  const auditvalidations = [];
  for (const act1 of audit) {
    auditvalidations.push({
      description: `//div[contains(text(),'${act1.Description}')]`,
      action: `//div[contains(text(),'${act1.Action}')]`,
    });
  }
  console.log(auditvalidations);
  await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
  await helper.click(MenuBar.selectors.onboarding);
  await helper.waitForDisplayed(MenuBar.selectors.role);
  await helper.click(MenuBar.selectors.role);
  logger.info(this.roleData);
  await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
  await helper.waitForDisplayed(MenuBar.selectors.onboarding);
  await helper.click(MenuBar.selectors.onboarding);
  await helper.click(MenuBar.selectors.role);
  await helper.click('#resetBtn');
  await CreateRole.searchByCustomerID(this.roleData);
  await CreateRole.selectCustomerFromGrid();
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
  await helper.click(selectors.Users.auditTab);
  await helper.waitForDisplayed('div[id=\'role-audit-grid\']', 1500);
  for (const i in auditvalidations) {
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].description)).to.be.equal(true);
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].action)).to.be.equal(true);
    if (auditvalidations[i].action.includes('Created') || auditvalidations[i].action.includes('Modified')) {
      const x = await auditvalidations[i].action.includes('Created');
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      await CreateRole.auditValidation(await x, this.roleData, this.newRoleDesc);
    } else if (auditvalidations[i].action.includes('Approved')) {
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      await helper.screenshot('Audit-Role-Approved');
      logger.info('Validated Audit-Approved Role');
      await helper.click('//i[@class=\'fa fa-times\']');
    } else if (auditvalidations[i].action.includes('Deleted')) {
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      await helper.screenshot('Audit-Role-Deleted');
      logger.info('Validated Audit-Deleted Role');
      await helper.click('//i[@class=\'fa fa-times\']');
    }
  }
  await helper.click(selectors.Role.closePreview);
  // hx6zt8a
});
