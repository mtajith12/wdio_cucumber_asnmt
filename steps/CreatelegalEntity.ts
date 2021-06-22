import { Then, Before } from 'cucumber';
import * as _ from 'lodash';
import { helper } from 'src/Helper';
import { getLogger } from 'log4js';
import { CreateLegalEntityResource } from 'src/CreateResourceLegalentity';
import { selectors } from 'src/Selectors';
import * as faker from 'faker';
import { cobraloginPage } from 'src/Login';
import { MenuBar } from 'src/MenuBarPage';
import { createResource } from 'src/CreateResources';
import { DBConnection } from 'src/DBConnection';
import { expect } from 'chai';
import * as jp from 'jsonpath';
const data = require('src/DataReader');
let legalEntityArray = [];
let legalentityResourceId = [];

const logger = getLogger();

Then(/^Register an Resource for "([^"]*)" for "([^"]*)" BIN Type for host system "([^"]*)"$/, async function (resource, businessIdType, hostSystem) {
  let hostSystems;
  if (hostSystem.includes(',')) {
    hostSystems = hostSystem.split(',');
  } else {
    hostSystems = hostSystem;
  }

  const legalEntity = {
    businessIdType,
    resouceType: 'LEGAL_ENTITY',
    businessIdNumber: businessIdType === 'ABN' ? faker.random.alphaNumeric(11) : faker.random.alphaNumeric(9),
    hostSystem: hostSystems,
    accountNumbers: this.accountNumberArray,
  };
  this.resourceData = _.merge(this.data, legalEntity);
  logger.info(JSON.stringify(this.resourceData));
  this.queryResource = `select * from CA_OWNER.legal_ENTITY where ORG_BIZ_ID = '${this.resourceData.customerId}'`;

  this.queryProductResource = `select * FROM CA_OWNER.PARTY_RESOURCE_PRODUCT where CA_OWNER.PARTY_RESOURCE_PRODUCT.RESOURCE_ID
  in (select CA_OWNER.LEGAL_ENTITY.RESOURCE_ID FROM CA_OWNER.LEGAL_ENTITY where CA_OWNER.LEGAL_ENTITY.ORG_BIZ_ID = '${this.resourceData.customerId}')`;

  this.queryLegalEntityAccount = `select * FROM CA_OWNER.LEGAL_ENTITY_ACCOUNT where CA_OWNER.LEGAL_ENTITY_ACCOUNT.RESOURCE_ID
  in (select CA_OWNER.LEGAL_ENTITY.RESOURCE_ID FROM CA_OWNER.LEGAL_ENTITY where CA_OWNER.LEGAL_ENTITY.ORG_BIZ_ID = '${this.resourceData.customerId}')`;

  this.legalEntityName = await CreateLegalEntityResource.registerResources(this.resourceData, resource, legalEntity);
  logger.info(this.legalEntityName);
  await helper.screenshot(`Register resource for -${businessIdType}`);
});
Then(/^Search the Legal Entity in searchscreen and "([^"]*)" "([^"]*)" workflow$/, async function (action, userAction) {
  if (action === 'Verify' && userAction === 'new') {
    await CreateLegalEntityResource.searchUsersNValidateWorkFlow(this.resourceData, 'Pending Approval - Register', undefined);
  } else if (action === 'Approve' && userAction === 'new') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionApprove = {
      message: `On approval Resource: ${this.legalEntityName} will be registered.`,
      notificationMessage: `Resource: ${this.legalEntityName} has been registered.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
    };
    logger.info(actionApprove);
    await CreateLegalEntityResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionApprove);
  } else if (action === 'Approve' && userAction === 'modify') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionPendingApproveModified = {
      message: `Approve changes to Resource: ${this.legalEntityName}.`,
      notificationMessage: `Changes to Resource: ${this.legalEntityName} have been approved.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,


    };
    await CreateLegalEntityResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionPendingApproveModified);
  } else if (action === 'Verify' && userAction === 'deregister') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
    const actionDeregister = {
      message: `This will deregister ${this.resourceData.businessIdNumber} from the Customer ${this.resourceData.customerId}`,
      notificationMessage: `Resource ${this.legalEntityName} is now pending approval to be deregistered.`,
      action: selectors.searchGrid.gridElementRightClick.deregisterBtn,

    };
    await CreateLegalEntityResource.searchUsersNValidateWorkFlow(this.resourceData, 'Pending Approval - Deregister', actionDeregister);
  } else if (action === 'Approve' && userAction === 'deregister') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionDeregisterApprove = {
      message: `On approval Resource: ${this.legalEntityName} will be de-registered.`,
      notificationMessage: `Resource: ${this.legalEntityName} has been de-registered.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,

    };
    await CreateLegalEntityResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionDeregisterApprove);
  }
  await helper.screenshot(`Approve-BillingEntity -${action}`);
});

Then(/^Reject the changes and validate the "([^"]*)" notification messages for the Legal Entity$/, async function (action) {
  await CreateLegalEntityResource.searchUsers(this.resourceData);
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.UserPendingModifiedReject).then(async () => {
    if (action === 'modified') {
      await createResource.rejectPendingModifiedApprovalFromGrid();
      const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
      logger.info(registerUserNotificationMessage);
      //  expect(registerUserNotificationMessage).to.be.oneOf([`Changes to Resource: ${this.resourceName} was rejected.`, '']);
      await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn).then(async () => {
        if ((process.env.DB_CHECK).toString() === 'true') {
          logger.info('Executing CA verification');
          const caowner = await DBConnection.run(this.queryResource);
          const jsoncaowner = await caowner;
          // To get existing DB values
          const version = jp.query(await jsoncaowner, '$..VERSION').toString();
          const deleteflag = jp.query(jsoncaowner, '$..DELETE_FLAG').toString();
          expect(jp.query(jsoncaowner, '$..VERSION').toString()).to.equal(version);
          expect(jp.query(jsoncaowner, '$..DELETE_FLAG').toString()).to.equal(deleteflag);
          logger.info('No change in CA');
        }
      });
    }
    if (action === 'deregister') {
      await createResource.rejectPendingModifiedApprovalFromGrid();
      const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
      logger.info(registerUserNotificationMessage);
      //  expect(registerUserNotificationMessage).to.be.oneOf([`De-registration of Resource ${this.resourceName} was rejected.`, '']);
      await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn).then(async () => {
        if ((process.env.DB_CHECK).toString() === 'true') {
          logger.info('Executing CA verification');
          const caowner = await DBConnection.run(this.queryResource);
          const jsoncaowner = await caowner;
          // To get existing DB values
          const version = jp.query(await jsoncaowner, '$..VERSION').toString();
          const deleteflag = jp.query(jsoncaowner, '$..DELETE_FLAG').toString();
          expect(jp.query(jsoncaowner, '$..VERSION').toString()).to.equal(version);
          expect(jp.query(jsoncaowner, '$..DELETE_FLAG').toString()).to.equal(deleteflag);
          logger.info('No change in CA');
        }
      });
    }
    await helper.screenshot(`Reject Resource ${action}`);
  });
});
Then(/^BankUser edits the resource of Legal Entity$/, async () => {
  await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);
  await CreateLegalEntityResource.editCustomerLegalEntityProductEntitlement();
  // await helper.pause(2);
});
Then(/^BankUser edits the resource of Legal Entity by adding host system "([^"]*)"$/, async (hostSystem) => {
  let hostSystems;
  if (hostSystem.includes(',')) {
    hostSystems = hostSystem.split(',');
  } else {
    hostSystems = hostSystem;
  }
  const x = [];
//  await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);
  await CreateLegalEntityResource.selectHostSystem(hostSystems);
  await helper.click(selectors.Resource.submit);
  await createResource.approveResourceFromGrid();
  const message1 = await helper.getElementText(selectors.searchGrid.approvalPopUp.errorMessage);

  logger.info(message1);


  const a = await $$(selectors.Resource.LegalEntityResource.LegalEntityAtrb.clientIdentifier);
  for (let i = 0; i < a.length; i++) {
    x.push(await a[i].getValue());
  }


  const groupped = _.groupBy(x, (n) => n);
  const result = _.uniq(_.flatten(_.filter(groupped, (n) => n.length > 1)));

  await helper.click(`//input[@value="${result[0]}"]/../../div/input`);
  await helper.click(selectors.Resource.LegalEntityResource.LegalEntityAtrb.removeCoreSystem);
  const b = await $$('//button[@id="Close"]/i');
  await b[1].click();
  await b[0].click();
  await helper.click(selectors.Resource.submit);
  await createResource.approveResourceFromGrid();
});
Then(/^BankUser edits the resource of Legal Entity by adding same client identifier host system "([^"]*)"$/, async (hostSystem) => {
  let hostSystems;
  if (hostSystem.includes(',')) {
    hostSystems = hostSystem.split(',');
  } else {
    hostSystems = hostSystem;
  }
  await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);
  await CreateLegalEntityResource.selectHostSystem(hostSystems);
  // await helper.pause(2);
  await helper.click(selectors.Resource.submit);
  const message1 = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.message1);

  logger.info(message1);

  expect(message1).to.be.oneOf(['Error \n This Client Identifier is already registered under the customer', '']);
});
Then(/^BankUser creates a legal entity with host system ([^"]*)$/, { wrapperOptions: { retry: 6 } }, async function (hostSystem) {
  let hostSystems;
  if (hostSystem.includes(',')) {
    hostSystems = hostSystem.split(',');
  } else {
    hostSystems = [hostSystem];
  }
  await helper.openURL(data.getData('urlDomain'));
  const Usernamedefault = data.getData('cobraUserName');
  const PasswordDefault = data.getData('password');
  await cobraloginPage.enterUserName(Usernamedefault);
  await cobraloginPage.enterPassword(PasswordDefault);
  await cobraloginPage.clickSubmit();

  await helper.click(MenuBar.selectors.resource);
  const businessIdType = 'ABN';
  const legalEntity = {
    legalEntityName: faker.name.findName().toString(),
    businessIdType,
    resouceType: 'LEGAL_ENTITY',
    businessIdNumber: businessIdType === 'ABN' ? faker.random.alphaNumeric(11) : faker.random.alphaNumeric(9),
    hostSystem: hostSystems,
    accountNumbers: this.accountNumberArray,

  };
  legalEntityArray.push(`${legalEntity.businessIdNumber}`);
  this.resourceGroupName = legalEntity.businessIdNumber;
  this.resourceData = _.merge(this.data, legalEntity);
  logger.info(JSON.stringify(this.resourceData));
  if ((process.env.DB_CHECK).toString() === 'true') {
    this.queryResource = `select * from CA_OWNER.legal_ENTITY where ORG_BIZ_ID = '${this.resourceData.customerId}' and BUSINESS_ID ='${legalEntity.businessIdNumber}'`;
  }
  this.accountName = await CreateLegalEntityResource.registerResources(this.resourceData, 'Legal Entity', legalEntity);
  logger.info(this.accountName);
  await MenuBar.signOut();
  await helper.pause(2);
  await helper.openURL(data.getData('urlDomain'));
  const Username = data.getData('cobraApprover');
  const Password = data.getData('passwordApprover');
  await cobraloginPage.enterUserName(Username);
  await cobraloginPage.enterPassword(Password);
  await cobraloginPage.clickSubmit();

  const actionApprove = {
    message: `On approval Resource: ${this.accountName} will be registered.`,
    notificationMessage: `Resource: ${this.accountName} has been registered.`,
    action: selectors.searchGrid.gridElementRightClick.approveBtn,
    hostSystem: `${this.resourceData.hostSystem}`,
    flag: true,

    db: {
      QUERY: this.queryResource,
      version: '1',
    },
  };
  logger.info(actionApprove);
  logger.info(legalEntityArray);
  this.legalEntityName = legalEntityArray;
  logger.info(this.legalEntityName);
  await CreateLegalEntityResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionApprove);
  legalentityResourceId.push(await CreateLegalEntityResource.db(actionApprove));
  await MenuBar.signOut();
  this.legalentityResourceId = legalentityResourceId;

  this.accountNumberArray = [];
});
Then(/^Bankuser checks the legal entity$/, () => {
  this.legalEntityName = [];
  legalEntityArray = [];
  legalentityResourceId = [];
  this.legalentityResourceId = [];
});
Before(async () => {
  legalEntityArray = [];
  legalentityResourceId = [];
});

Then(/^Check the Legal Entity Name in Audit$/, async function () {
  await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
  await helper.waitForDisplayed(MenuBar.selectors.onboarding);
  await helper.click(MenuBar.selectors.onboarding);
  await CreateLegalEntityResource.searchUsers(this.resourceData);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
  await helper.click(selectors.BankUsers.auditTab);
  await helper.waitForDisplayed('div[id=\'resource-audit-grid\']', 1500);

  await helper.ifElementDisplayedAfterTime('//div[contains(text(),\'Created\')]');
  await helper.doubleClick('//div[contains(text(),\'Created\')]');
  expect(await helper.getElementText('//div[contains(text(),\'Legal Entity Name\')]/following-sibling::div[3]')).to.include('#');
  logger.info('"#" included in LE Name');
  await helper.click('//i[@class=\'fa fa-times\']');
});
Then(/^executing additional CA validations for Legal Entity - "([^"]*)"$/, async function (action, details) {
  if ((process.env.DB_CHECK).toString() === 'true') {
    logger.info('Executing additional DB validations - Legal Entity');
    const partyProductResource = details.hashes();
    const productEntitlement = jp.query(await partyProductResource, '$..productsDB').toString().replace(' ', '').split(',');
    const jsoncaowner1 = await DBConnection.run(this.queryProductResource);
    const jsoncaowner2 = await DBConnection.run(this.queryLegalEntityAccount);
    if (action === 'Create' || action === 'Modify-Reject') {
      logger.info(await jsoncaowner1);
      for (const i in productEntitlement) {
        expect(jp.query(await jsoncaowner1, '$..PRODUCT_ID').toString()).to.include(productEntitlement[i]);
      }
      logger.info('Validated Legal Entity Products');
      logger.info(await jsoncaowner2);
      const accountIds = jp.query(await this.ids, '$..id');
      for (const i in accountIds) {
        expect(jp.query(await jsoncaowner2, '$..ACCOUNT_RESOURCE_ID').toString()).to.include(accountIds[i].toString());
      }
      logger.info('Validated Legal Entity Accounts');
    } else if (action === 'Modify') {
      console.log(await jsoncaowner1);
      for (const i in productEntitlement) {
        expect(jp.query(await jsoncaowner1, '$..PRODUCT_ID').toString()).not.to.include(productEntitlement[i]);
      }
      logger.info('Validated Modified Legal Entity Products');
    }
  }
  // await helper.click(selectors.Resource.closePreview);
});

Then(/^BankUser validates the Audit Scenarios for Legal Entity$/, async function (details) {
  // await helper.pause(2);
  const audit = details.hashes();
  const auditvalidations = [];
  const count = [];
  for (const act1 of audit) {
    auditvalidations.push({
      description: `//div[contains(text(),'${act1.Description}')]`,
      action: `//div[contains(text(),'${act1.Action}')]`,
    });
  }
  // console.log(auditvalidations);
  await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
  await helper.waitForDisplayed(MenuBar.selectors.onboarding);
  await helper.click(MenuBar.selectors.onboarding);
  await helper.waitForDisplayed(MenuBar.selectors.resource);
  await helper.click(MenuBar.selectors.resource);
  logger.info(this.resourceData);
  await CreateLegalEntityResource.searchUsers(this.resourceData);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
  // await helper.pause(2);
  await helper.click(selectors.Users.auditTab);
  await helper.waitForDisplayed('div[id=\'resource-audit-grid\']', 1500);
  for (const i in auditvalidations) {
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].description)).to.be.equal(true);
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].action)).to.be.equal(true);
    if (auditvalidations[i].action.includes('Created') || auditvalidations[i].action.includes('Modified')) {
      const x = await auditvalidations[i].action.includes('Created');
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      await CreateLegalEntityResource.auditValidation(await x, this.resourceData, this.divisionapi);
    } else if (auditvalidations[i].action.includes('Approved')) {
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      logger.info('Validated Approved LegalEntity');
      await helper.screenshot('Audit-LegalEntity-Approved');
      // await helper.pause(2);
      await helper.click('//i[@class=\'fa fa-times\']');
    }
  }
  await helper.click(selectors.Resource.closePreview);
});
