import { Then } from 'cucumber';
import { createResourceGroup } from 'src/CreateResourceGroup';
import * as _ from 'lodash';
import { MenuBar } from 'src/MenuBarPage';
import { helper } from 'src/Helper';
const data = require('src/DataReader');
import { cobraloginPage } from 'src/Login';
import { expect } from 'chai';
import { selectors } from 'src/Selectors';
import * as jp from 'jsonpath';
import * as faker from 'faker';
import { getLogger } from 'log4js';
import { createResource } from 'src/CreateResources';
import { DBConnection } from 'src/DBConnection';
const logger = getLogger();


Then(/^BankUser creates default resource group$/, { wrapperOptions: { retry: 6 } }, async function () {

  const resourceGroupName = await createResourceGroup.ResourceGroup(this.Customer, this.accountNumberArray);
  this.resourceGroupName = resourceGroupName;
  this.resourceGroupData = _.merge(this.data, resourceGroupName);
  await MenuBar.signOut();
  if ((process.env.DB_CHECK).toString() === 'true') {
    this.queryGroup = `select * from CA_OWNER.RESOURCE_GROUP where GROUP_NAME ='${resourceGroupName}'`;
  }
  await helper.openURL(data.getData('urlDomain'));
  const Username = data.getData('cobraApprover');
  const Password = data.getData('passwordApprover');
  await cobraloginPage.enterUserName(Username);
  await cobraloginPage.enterPassword(Password);
  await cobraloginPage.clickSubmit();
  // await helper.pause(2)
  const actionApprove = {
    action: selectors.searchGrid.gridElementRightClick.approveBtn,
    flag: true,
    db: {
      QUERY: this.queryGroup,
      version: '1',
    },
  };
  await createResourceGroup.searchUsersNValidateWorkFlow(this.resourceGroupData, 'Approved', actionApprove);
});

Then(/^BankUser creates a resource group$/, async function () {
  const resourceGroupName = await createResourceGroup.ResourceGroup(this.Customer, this.accountNumberArray);
  this.resourceGroupName = resourceGroupName;
  this.resourceGroupData = _.merge(this.data, resourceGroupName);
  this.queryGroup = `select * from CA_OWNER.RESOURCE_GROUP where GROUP_NAME ='${resourceGroupName}'`;
  this.queryGroupResource = `select * FROM CA_OWNER.RESOURCE_GROUP_RESOURCE where CA_OWNER.RESOURCE_GROUP_RESOURCE.GROUP_ID
  in (select CA_OWNER.RESOURCE_GROUP.GROUP_ID FROM CA_OWNER.RESOURCE_GROUP where CA_OWNER.RESOURCE_GROUP.GROUP_NAME = '${resourceGroupName}')`;
});
Then(/^Validate the added Accounts in the Resource Group$/, async function () {
  logger.info('Executing validation for Accounts Alias Name and Account details in Resource Group');
  await createResourceGroup.searchUsers(this.customerData);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn).then(async () => {
    const accArray = this.accountNumberArray;
    console.log(accArray);
    for (const i in accArray) {
      const acc = await accArray[i];
      if ((process.env.DB_CHECK).toString() === 'true') {
      const caowner = await DBConnection.run(`select * from CA_OWNER.ACCOUNT where ACCOUNT_NUMBER = '${acc}' and CUSTOMER_NUMBER = '${this.resourceData.customerId}'`);
      const jsoncaowner = await caowner;
      console.log(jp.query(await jsoncaowner, '$..ACCOUNT_NUMBER').toString()); logger.info(`Account number ${acc}`);
      await helper.waitForDisplayed('//div[@id=\'resourceGroupResourceGrid\']', 15000);
      await helper.pause(1)
      expect(await helper.ifElementDisplayed(`.//div[contains(text(),'${jp.query(await jsoncaowner, '$..ACCOUNT_NUMBER').toString()}')]`)).to.equal(true);


      expect(await helper.ifElementDisplayed(`.//div[contains(text(),'${jp.query(jsoncaowner, '$..NICKNAME').toString()}')]`)).to.equal(true);
      logger.info(`Verified Account Alias Name - ${jp.query(jsoncaowner, '$..NICKNAME').toString()} for ${acc}`);

      expect(await helper.ifElementDisplayed(`.//div[contains(text(),'${jp.query(jsoncaowner, '$..ACCOUNTING_SYSTEM_CODE').toString()}')]`)).to.equal(true);
      expect(await helper.ifElementDisplayed(`.//div[contains(text(),'${jp.query(jsoncaowner, '$..CURRENCY_CODE').toString()}')]`)).to.equal(true);
      expect(await helper.ifElementDisplayed(`.//div[contains(text(),'${jp.query(jsoncaowner, '$..COUNTRY_CODE').toString()}')]`)).to.equal(true);
    }
  }
  });
  await helper.screenshot('Validate Account Alias Name');
  logger.info("Resource Group's Account Details- Validated");
  await helper.click(selectors.Resource.closePreview);
});
Then(/^Search the Resource Group in searchscreen and "([^"]*)" "([^"]*)" workflow$/, async function (action, userAction) {
  if (action === 'Verify' && userAction === 'new') {
    await createResourceGroup.searchUsersNValidateWorkFlow(this.resourceData, 'Pending Approval - Register', undefined);
  } else if (action === 'Approve' && userAction === 'new') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionApprove = {
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
    };
    logger.info(actionApprove);
    await createResourceGroup.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionApprove);
  } else if (action === 'Approve' && userAction === 'modify') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionPendingApproveModified = {
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
    };
    await createResourceGroup.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionPendingApproveModified);
  }
  await helper.screenshot(`Approve-resource group -${action}`);
});

Then(/^Reject the changes and validate the "([^"]*)" notification messages for Resource Group$/, async function (action) {
  await createResourceGroup.searchUsers('customerData');
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.UserPendingModifiedReject).then(async () => {
    if (action === 'modified') {
      await createResource.rejectPendingModifiedApprovalFromGrid();
      const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
      logger.info(registerUserNotificationMessage);
      //      expect(registerUserNotificationMessage).to.be.oneOf([`Changes to Resource Group: ${this.resourceGroupName} was rejected.`, '']);
      await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn).then(async () => {
        if ((process.env.DB_CHECK).toString() === 'true') {
          const caowner = await DBConnection.run(this.queryGroup);
          const jsoncaowner = await caowner;
          // To get existing DB Values
          const version = jp.query(await jsoncaowner, '$..VERSION').toString();
          const deleteflag = jp.query(jsoncaowner, '$..DELETE_FLAG').toString();
          expect(jp.query(jsoncaowner, '$..VERSION').toString()).to.equal(version);
          expect(jp.query(jsoncaowner, '$..DELETE_FLAG').toString()).to.equal(deleteflag);
          logger.info('Executed CA verification - No changes');
        }
        await helper.click(selectors.Resource.closePreview);
      });
    } else if (action === 'delete') {
      await createResource.rejectPendingModifiedApprovalFromGrid();
      const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
      logger.info(registerUserNotificationMessage);
      //      expect(registerUserNotificationMessage).to.be.oneOf([`Deletion of Resource Group: ${this.resourceGroupName} was rejected.`, '']);
      await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn).then(async () => {
        if ((process.env.DB_CHECK).toString() === 'true') {
          const caowner = await DBConnection.run(this.queryGroup);
          const jsoncaowner = await caowner;
          // To get existing DB Values
          const version = jp.query(await jsoncaowner, '$..VERSION').toString();
          const deleteflag = jp.query(jsoncaowner, '$..DELETE_FLAG').toString();
          expect(jp.query(jsoncaowner, '$..VERSION').toString()).to.equal(version);
          expect(jp.query(jsoncaowner, '$..DELETE_FLAG').toString()).to.equal(deleteflag);
          logger.info('Executed CA verification - No changes');
        }
        await helper.click(selectors.Resource.closePreview);
      });
    }
    await helper.screenshot(`Reject Resource Group ${action}`);
  });
});

Then(/^BankUser edits the resource group$/, async function () {
  await createResourceGroup.searchUsers('customerData');
  await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);
  const newResourceGroupDesc = faker.name.findName().toString().replace(/[&/\\#,+()$~%.'":*?<>{}]/g, '');
  await createResourceGroup.editresourceGroupDesc(newResourceGroupDesc);
  this.newResourceGroupDesc = newResourceGroupDesc;

  // await helper.pause(3);

  await createResourceGroup.approveUserFromGrid();
});
Then(/^validate the elements present in the Resource Group screen$/, async () => {
  await helper.waitForDisplayed(MenuBar.selectors.resourceGroup, 10000);
  await helper.click(MenuBar.selectors.resourceGroup);
  await helper.waitForDisplayed(selectors.Users.customerId);

  expect(await helper.ifElementDisplayed(selectors.searchGrid.customerId)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.customerName)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.resourceGroupName)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.resourceGroupDesc)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.status)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.resourceType)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.workflow)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.searchBtn)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.saveBtn)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.resetBtn)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.statusNew)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.statusEnabled)).to.equal(true);
  await helper.screenshot('validate screen- Resource Group');
});


Then(/^executing additional CA validations for Resource Group - "([^"]*)"$/, async function (action) {
  if ((process.env.DB_CHECK).toString() === 'true') {
    logger.info('Executing additional DB validations - Resource Group');
    const jsoncaowner = await DBConnection.run(this.queryGroup);
    const jsoncaowner1 = await DBConnection.run(this.queryGroupResource);

    if (action == 'Create') {
      logger.info(await jsoncaowner1);
      const accountResourceIds = await this.accountResourceId;
      logger.info(jp.query(await jsoncaowner1, '$..RESOURCE_ID').toString());
      for (let i in accountResourceIds) {
        logger.info(await accountResourceIds[i]);
        expect(jp.query(await jsoncaowner1, '$..RESOURCE_ID').toString()).to.include(accountResourceIds[i].toString());
      }
      logger.info('Validated ResourceGroup Accounts');
    }
    else if (action == 'Modify') {
      expect(jp.query(await jsoncaowner, '$..GROUP_DESC').toString()).to.be.equal(this.newResourceGroupDesc);
      logger.info(`Validated Modified ResourceGroup Description - ${this.newResourceGroupDesc}`);
    }
  }
});

Then(/^BankUser validates the Audit Scenarios for Resource Group$/, async function (details) {
  logger.info('Audit Resource group');
  // await helper.pause(2);
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
  await helper.waitForDisplayed(MenuBar.selectors.resourceGroup);
  await helper.click(MenuBar.selectors.resourceGroup);
  const resourcegroupdetails = [this.accountNumberArray, this.newResourceGroupDesc];
  logger.info(resourcegroupdetails);
  await createResourceGroup.searchUsers(this.resourceGroupData);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
  // await helper.pause(2);
  await helper.click(selectors.Users.auditTab);
  await helper.waitForDisplayed('div[id=\'resourceGroup-audit-grid\']', 1500);
  for (const i in auditvalidations) {
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].description)).to.be.equal(true);
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].action)).to.be.equal(true);
    if (auditvalidations[i].action.includes('Created') || auditvalidations[i].action.includes('Modified')) {
      const x = await auditvalidations[i].action.includes('Created');
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      await createResourceGroup.auditValidation(await x, resourcegroupdetails);
    }
    else if (auditvalidations[i].action.includes('Approved')) {
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      await helper.screenshot('Audit-ResourceGroup-Approved');
      logger.info('Validated Audit-Approved ResourceGroup');
      await helper.click('//i[@class=\'fa fa-times\']');
    }
  }
  await helper.click(selectors.Resource.closePreview);
});

