import { Then } from 'cucumber';
import * as _ from 'lodash';
import * as faker from 'faker';
import { helper } from 'src/Helper';
import { expect } from 'chai';
import { createResource } from 'src/CreateResources';
import { MenuBar } from 'src/MenuBarPage';
import { getLogger } from 'log4js';
import { selectors } from 'src/Selectors';
import { DBConnection } from 'src/DBConnection';
import * as jp from 'jsonpath';


import { CreateFxOrganisationResource } from 'src/CreateResourceFxOrganisation';
const logger = getLogger();
let name;
Then(/^Click on regsiter resource$/, async () => {
  await helper.click(MenuBar.selectors.resource);
});
Then(/^Register a Resource for "([^"]*)" for "([^"]*)" Host system and "([^"]*)" country$/, async function (resource, hostSystem, country) {
  const fxorganisation = {
    country,
    hostSystem,
    resouceType: 'FX_ORGANISATION',
    customerStaticServicesId: faker.random.number({ min: 100000000, max: 9999999999 }),
    FxOrganisationResourceName: faker.random.alphaNumeric(10),
    FxOrgProductEntitlement: 'Contract Management',
  };
  this.fxOrgCssId = fxorganisation.customerStaticServicesId;
  logger.info(this.fxOrgCssId);
  this.resourceData = _.merge(this.data, fxorganisation);
  logger.info(JSON.stringify(this.resourceData));
  this.queryResource = `select * from CA_OWNER.FX_ORGANISATION where ORG_BIZ_ID = '${this.resourceData.customerId}'`;
  this.queryProductResource = `select * FROM CA_OWNER.PARTY_RESOURCE_PRODUCT where CA_OWNER.PARTY_RESOURCE_PRODUCT.RESOURCE_ID
  in (select CA_OWNER.FX_ORGANISATION.RESOURCE_ID FROM CA_OWNER.FX_ORGANISATION where CA_OWNER.FX_ORGANISATION.ORG_BIZ_ID = '${this.resourceData.customerId}')`;
  this.resourceName = await CreateFxOrganisationResource.registerResources(this.resourceData, resource, fxorganisation);
  logger.info(this.resourceName);
  await helper.screenshot(`Register resource for -${hostSystem}`);
});
Then(/^Re-register the "([^"]*)" using the same CSS ID for "([^"]*)" and "([^"]*)" country$/, async function (resource, hostSystem, country) {
  const fxorganisation = {
    country,
    hostSystem,
    resouceType: 'FX_ORGANISATION',
    customerStaticServicesId: this.fxOrgCssId,
    FxOrganisationResourceName: faker.random.alphaNumeric(10),
    FxOrgProductEntitlement: 'Contract Management',
  };
  logger.info(this.fxOrgCssId);
  this.resourceData = _.merge(this.data, fxorganisation);
  logger.info(JSON.stringify(this.resourceData));
  this.queryResource = `select * from CA_OWNER.FX_ORGANISATION where ORG_BIZ_ID = '${this.resourceData.customerId}'`;
  this.resourceName = await CreateFxOrganisationResource.registerResources(this.resourceData, resource, fxorganisation);
  logger.info(this.resourceName);
  await helper.screenshot(`Register resource for -${hostSystem}`);
});
Then(/^Validates the "([^"]*)" message for "([^"]*)"$/, async function (status, resource) {
  if (status === 'register') {
    const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

    logger.info(NotificationMessage);
    expect(NotificationMessage).to.be.oneOf(['Request Submitted Successfully.', '']);
  } else if (status === 'modify') {
    if (resource === 'fx organisation - edit Resource Name') {
      const message1 = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.message1);

      logger.info(this.resourceName);
      expect(message1).to.be.oneOf([`This will submit FX Organisation: ${this.resourceName} to be modified.`, '']);
      await createResource.approveResourceFromGrid();
      const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

      logger.info(NotificationMessage);
      expect(NotificationMessage).to.be.oneOf([`Resource ${this.resourceName} is now pending approval to be modified.`, '']);
    } else if (resource === 'fx organisation - edit Product Entitlements') {
      const message1 = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.message1);
      logger.info(this.newresourceName);
      expect(message1).to.be.oneOf([`This will submit FX Organisation: ${this.newresourceName} to be modified.`, '']);
      await createResource.approveResourceFromGrid();
      const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

      logger.info(NotificationMessage);
      expect(NotificationMessage).to.be.oneOf([`Resource ${this.newresourceName} is now pending approval to be modified.`, '']);
    }
    else if (resource === 'fx organisation - Product Entitlements') {
      const message1 = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.message1);
      logger.info(this.resourceName);
      expect(message1).to.be.oneOf([`This will submit FX Organisation: ${this.resourceName} to be modified.`, '']);
      await createResource.approveResourceFromGrid();
      const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

      logger.info(NotificationMessage);
      expect(NotificationMessage).to.be.oneOf([`Resource ${this.resourceName} is now pending approval to be modified.`, '']);
    }
    else if (status === 'deregister') {
      const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

      logger.info(NotificationMessage);
    }
    await helper.screenshot(`Validate -${status}`);
  }
});

Then(/^BankUser edits the resource of Fx Organisation - "([^"]*)"$/, async function (editAction) {
  if (editAction === 'Resource Name') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
    await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);
    // await helper.pause(2);
    name = faker.name.findName().toString().replace(/[&/\\#,+()$~%.'":*?<>{}]/g, '');
    await CreateFxOrganisationResource.editCustomerFxResourceName(name);
    this.newfxOrgResourceName = name;
    // await helper.pause(3);
  } else if (editAction === 'Product entitlements') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
    await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);
    await CreateFxOrganisationResource.editCustomerProductEntilements();
    // await helper.pause(3);
  } else if (editAction === 'Remove Division') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
    await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);
    await CreateFxOrganisationResource.editRemoveDivision();
    // await helper.pause(2);
  }
});

Then(/^Reject the changes and validate the "([^"]*)" notification messages for Fx Organisation$/, async function (action) {
  await createResource.searchUsers(this.resourceData);

  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.UserPendingModifiedReject).then(async () => {
    if (action === 'modified') {
      await createResource.rejectPendingModifiedApprovalFromGrid();
      const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
      logger.info(registerUserNotificationMessage);
      expect(registerUserNotificationMessage).to.be.oneOf([`Changes to Resource: ${this.newresourceName} was rejected.`, '']);
      await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn).then(async () => {
        if ((process.env.DB_CHECK).toString() === 'true') {
          const caowner = await DBConnection.run(this.queryResource);
          const jsoncaowner = await caowner;
          // To get existing DB Values to verify
          const version = jp.query(await jsoncaowner, '$..VERSION').toString();
          const deleteflag = jp.query(jsoncaowner, '$..DELETE_FLAG').toString();
          logger.info('Executing DB verification');
          expect(jp.query(jsoncaowner, '$..VERSION').toString()).to.equal(version);
          expect(jp.query(jsoncaowner, '$..DELETE_FLAG').toString()).to.equal(deleteflag);
          logger.info('No change to CA');
        }
      });
    } else if (action === 'modified division') {
      await createResource.rejectPendingModifiedApprovalFromGrid();
      const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
      logger.info(registerUserNotificationMessage);
      expect(registerUserNotificationMessage).to.be.oneOf([`Changes to Resource: ${this.resourceName} was rejected.`, '']);
      await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn).then(async () => {
        if ((process.env.DB_CHECK).toString() === 'true') {
          const caowner = await DBConnection.run(this.queryResource);
          const jsoncaowner = await caowner;
          // To get existing DB Values to verify
          const version = jp.query(await jsoncaowner, '$..VERSION').toString();
          const deleteflag = jp.query(jsoncaowner, '$..DELETE_FLAG').toString();
          logger.info('Executing DB verification');
          expect(jp.query(jsoncaowner, '$..VERSION').toString()).to.equal(version);
          expect(jp.query(jsoncaowner, '$..DELETE_FLAG').toString()).to.equal(deleteflag);
          logger.info('No change in CA');
        }
      });
    } else if (action === 'deregister') {
      await createResource.rejectPendingModifiedApprovalFromGrid();
      const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
      logger.info(registerUserNotificationMessage);
      expect(registerUserNotificationMessage).to.be.oneOf([`De-registration of Resource ${this.resourceName} was rejected.`, '']);
      await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn).then(async () => {
        if ((process.env.DB_CHECK).toString() === 'true') {
          const caowner = await DBConnection.run(this.queryResource);
          const jsoncaowner = await caowner;
          // To get existing DB Values to verify
          const version = jp.query(await jsoncaowner, '$..VERSION').toString();
          const deleteflag = jp.query(jsoncaowner, '$..DELETE_FLAG').toString();
          logger.info('Executing DB verification');
          expect(jp.query(jsoncaowner, '$..VERSION').toString()).to.equal(version);
          expect(jp.query(jsoncaowner, '$..DELETE_FLAG').toString()).to.equal(deleteflag);
          logger.info('No change in CA');
        }
      });
    }
    await helper.screenshot(`Reject FX organisation ${action}`);
  });
});
Then(/^Search the FX Organisation in searchscreen and "([^"]*)" "([^"]*)" workflow$/, async function (action, userAction) {
  if (action === 'Verify' && userAction === 'new') {
    await CreateFxOrganisationResource.searchUsersNValidateWorkFlow(this.resourceData, 'Pending Approval - Register', undefined);
  } else if (action === 'Approve' && userAction === 'new') {
    helper.pause(2);
    logger.info(this.resourceName);
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionApprove = {
      message: `On approval Resource: ${this.resourceName} will be registered.`,
      notificationMessage: `Resource: ${this.resourceName} has been registered.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
    };
    logger.info(actionApprove);
    await CreateFxOrganisationResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionApprove);
  } else if (action === 'Approve' && userAction === 'modify1') {
    this.newresourceName = `${name} (${this.resourceData.customerStaticServicesId})`;
    logger.info(this.resourceName);
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionPendingApproveModified = {
      message: `Approve changes to Resource: ${this.newresourceName}.`,
      notificationMessage: `Changes to Resource: ${this.newresourceName} have been approved.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,

    };
    await CreateFxOrganisationResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionPendingApproveModified);
  } else if (action === 'Approve' && userAction === 'modify2') {
    this.newresourceName = `${name} (${this.resourceData.customerStaticServicesId})`;
    logger.info(this.resourceName);
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionPendingApproveModified = {
      message: `Approve changes to Resource: ${this.newresourceName}.`,
      notificationMessage: `Changes to Resource: ${this.newresourceName} have been approved.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: true,
      db: {
        QUERY: this.queryResource,
        version: '3',
        deleteflag: 'N',
      },
    };
    await CreateFxOrganisationResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionPendingApproveModified);
  } else if (action === 'Verify' && userAction === 'deregister') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
    const actionDeregister = {
      message: `This will deregister ${this.resourceData.resourceName} from the Customer ${this.resourceData.customerId}`,
      notificationMessage: `Resource ${this.newresourceName} is now pending approval to be deregistered.`,
      action: selectors.searchGrid.gridElementRightClick.deregisterBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: true,
      db: {
        QUERY: this.queryResource,
        version: '3',
        deleteflag: 'N',
      },
    };
    await CreateFxOrganisationResource.searchUsersNValidateWorkFlow(this.resourceData, 'Pending Approval - Deregister', actionDeregister);
  } else if (action === 'Approve' && userAction === 'deregister') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionDeregisterApprove = {
      message: `On approval Resource: ${this.newresourceName} will be de-registered.`,
      notificationMessage: `Resource: ${this.newresourceName} has been de-registered.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: false,
      db: {
        QUERY: this.queryResource,
        version: '3',
        deleteflag: 'Y',
      },
    };
    await CreateFxOrganisationResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionDeregisterApprove);
  }
  await helper.screenshot(`Approve-FxOrganisation -${action}`);
});

Then(/^Search the FX Organisation in searchscreen and "([^"]*)" "([^"]*)" workflow and validate against CA$/, async function (action, userAction) {
  if (action === 'Verify' && userAction === 'new') {
    await CreateFxOrganisationResource.searchUsersNValidateWorkFlow(this.resourceData, 'Pending Approval - Register', undefined);
  } else if (action === 'Approve' && userAction === 'new') {
    helper.pause(2);
    logger.info(this.resourceName);
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionApprove = {
      message: `On approval Resource: ${this.resourceName} will be registered.`,
      notificationMessage: `Resource: ${this.resourceName} has been registered.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: true,
      db: {
        QUERY: this.queryResource,
        version: '1,1',
        deleteflag: 'N,N',
      },
    };
    logger.info(actionApprove);
    await CreateFxOrganisationResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionApprove);
    await CreateFxOrganisationResource.db(actionApprove,this.resourceData);
  }
  else if (action === 'Approve' && userAction === 'modified division') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionPendingApproveModified = {
      message: `Approve changes to Resource: ${this.resourceName}.`,
      notificationMessage: `Changes to Resource: ${this.resourceName} have been approved.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: true,
      flagdiv: true,
      db: {
        QUERY: this.queryResource,
        version: '2,1',
        deleteflag: 'N,Y',
      },
    };
    logger.info(actionPendingApproveModified);
    await CreateFxOrganisationResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionPendingApproveModified);
    await CreateFxOrganisationResource.db(actionPendingApproveModified,this.resourceData);
  }
  else if (action === 'Approve' && userAction === 'modified entitlements') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionPendingApproveModified = {
      message: `Approve changes to Resource: ${this.resourceName}.`,
      notificationMessage: `Changes to Resource: ${this.resourceName} have been approved.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: true,
      flagdiv: true,
      db: {
        QUERY: this.queryResource,
        version: '2,2',
        deleteflag: 'N,N',
      },
    };
    logger.info(actionPendingApproveModified);
    await CreateFxOrganisationResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionPendingApproveModified);
    await CreateFxOrganisationResource.db(actionPendingApproveModified,this.resourceData);
  }
  else if (action === 'Verify' && userAction === 'deregister') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
    const actionDeregister = {
      message: `This will deregister ${this.resourceName} from the Customer ${this.resourceData.customerId}`,
      notificationMessage: `Resource ${this.resourceName} is now pending approval to be deregistered.`,
      action: selectors.searchGrid.gridElementRightClick.deregisterBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: true,
      db: {
        QUERY: this.queryResource,
        version: '2,1',
        deleteflag: 'N,Y',
      },
    };
    logger.info(actionDeregister);
    await CreateFxOrganisationResource.searchUsersNValidateWorkFlow(this.resourceData, 'Pending Approval - Deregister', actionDeregister);
    await CreateFxOrganisationResource.db(actionDeregister,this.resourceData);
  }
  await helper.screenshot(`Approve-FxOrganisation -${action}`);
});

Then(/^executing additional CA validations for FX Organisation - "([^"]*)"$/, { wrapperOptions: { retry: 2 } }, async function (action, details) {
  if ((process.env.DB_CHECK).toString() === 'true') {
    logger.info('Executing additional CA validation - Fx Organisation ');
    const partyProductResource = details.hashes();
    const jsoncaowner = await DBConnection.run(this.queryResource);
    const jsoncaowner1 = await DBConnection.run(this.queryProductResource);
    const productEntitlement = jp.query(await partyProductResource, '$..productsDB');
    if (action == 'Create') {
      logger.info(await jsoncaowner1);
      expect(jp.query(await jsoncaowner1, '$..PRODUCT_ID').toString()).to.be.equal(productEntitlement.toString());
      logger.info('Validated FX Organisation Product');
    }
    else if (action == 'Modify1') {
      expect(jp.query(await jsoncaowner, '$..FX_ORG_NAME').toString()).to.be.equal(this.newfxOrgResourceName);
      logger.info(`Validated Modified FX Organisation Name - ${this.newfxOrgResourceName}`);
    }
    else if (action == 'Modify2') {
      logger.info(await jsoncaowner1);
      expect(jp.query(await jsoncaowner1, '$..PRODUCT_ID').toString()).not.to.include(productEntitlement.toString());
      logger.info('Validated FX Organisation Product');
    }
  }
});

Then(/^BankUser validates the Audit Scenarios for FX Organisation$/, async function (details) {
  const audit = details.hashes();
  const auditvalidations = [];
  const count = [];
  const divisionids = [];
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
  await helper.waitForDisplayed(MenuBar.selectors.resource);
  await helper.click(MenuBar.selectors.resource);
  await createResource.searchUsers(this.resourceData);
  logger.info(JSON.parse(JSON.stringify(this.resourceData)));
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
  // await helper.pause(2);
  const div = (JSON.parse(JSON.stringify(this.divisionapi)));
  for (let i in div) {
    divisionids.push(div[i].divisionId)
  }
  await helper.click(selectors.Users.auditTab);
  await helper.waitForDisplayed('div[id=\'resource-audit-grid\']', 1500);
  for (const i in auditvalidations) {
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].description)).to.be.equal(true);
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].action)).to.be.equal(true);
    if (auditvalidations[i].action.includes('Created') || auditvalidations[i].action.includes('Modified')) {
      const x = await auditvalidations[i].action.includes('Created');
      await helper.doubleClick(auditvalidations[i].description);
      await CreateFxOrganisationResource.auditValidation(await x, this.resourceData, divisionids);
    }
    else if (auditvalidations[i].action.includes('Approved')) {
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      await helper.screenshot('Audit-FxOrganisation-Approved');
      logger.info('Validated Audit-Approved FxOrganisation');
      await helper.click('//i[@class=\'fa fa-times\']');
    }
  }
  await helper.click(selectors.Resource.closePreview);
});



