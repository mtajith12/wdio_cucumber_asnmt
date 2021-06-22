import { Then } from 'cucumber';
import { AuthPanelPage } from 'src/AuthPanelPage';
import * as _ from 'lodash';
import { MenuBar } from 'src/MenuBarPage';
import { helper } from 'src/Helper';
import { cobraloginPage } from 'src/Login';
import { expect } from 'chai';
import * as jp from 'jsonpath';
import { selectors } from 'src/Selectors';
import { DBConnection } from 'src/DBConnection';

import * as faker from 'faker';
import { getLogger } from 'log4js';
import { BankUsers } from 'src/BankUsersPage';
const data = require('src/DataReader');

const logger = getLogger();
Then(/^BankUser creates default Auth Panel$/, async function () {
  const authPanelName = await AuthPanelPage.authPanel(this.Customer, this.accountNumberArray);
  this.authPanelName = authPanelName;
  this.authPanelName = _.merge(this.data, authPanelName);
  await MenuBar.signOut();
  this.queryGroup = `select * from CA_OWNER.AUTH_PANEL where PANEL_NAME ='${authPanelName}'`;
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
      QUERY: this.queryGroup,
      version: '1',
    },
  };
  await AuthPanelPage.searchUsersNValidateWorkFlow(this.resourceGroupData, 'Approved', actionApprove);
});

Then(/^BankUser creates a Auth Panel$/, async function () {
  const authPanelName = await AuthPanelPage.authPanel(this.Customer, this.accountNumberArray);
  this.authPanelName = authPanelName;
  this.resourceGroupData = _.merge(this.data, authPanelName);
  this.queryGroup = `select * from CA_OWNER.AUTH_PANEL where PANEL_NAME ='${authPanelName}'`;
  this.queryGroupAccount = `select * from CA_OWNER.AUTH_PANEL_RULE_ACCOUNT where PANEL_ID IN
  (select CA_OWNER.AUTH_PANEL.PANEL_ID from CA_OWNER.AUTH_PANEL where PANEL_NAME ='${authPanelName}')`;
});

Then(/^View the Account in the Auth Panel and verify the Account Name on the View screen$/, async function () {
  logger.info('Executing Account Name Validation for Auth Panel');
  await AuthPanelPage.searchUsers(this.customerData);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn).then(async () => {
    const accArray = this.accountNumberArray;
    console.log(accArray);
    if ((process.env.DB_CHECK).toString() === 'true') {
      for ( const i in accArray ) {
        const acc = await accArray[ i ];
        logger.info ( `${ acc }` );
        const caowner = await DBConnection.run ( `select * from CA_OWNER.ACCOUNT where ACCOUNT_NUMBER = '${ acc }' and CUSTOMER_NUMBER = '${ this.resourceData.customerId }'` );
        const jsoncaowner = await caowner;
        await helper.pause ( 2 );
        expect ( await helper.ifElementDisplayed ( `.//div[contains(text(),'${ jp.query ( await jsoncaowner , '$..ACCOUNT_NUMBER' ).toString () }')]` ) ).to.equal ( true );
        //    expect(await helper.ifElementDisplayed(`.//div[contains(text(),'${jp.query(await jsoncaowner, '$..NICKNAME').toString()}')]`)).to.equal(true);
        logger.info ( `Verified Auth Panel Account Name : ${ jp.query ( await jsoncaowner , '$..NICKNAME' ).toString () } - for ${ acc }` );
        expect ( await helper.ifElementDisplayed ( `.//div[contains(text(),'${ jp.query ( await jsoncaowner , '$..ACCOUNTING_SYSTEM_CODE' ).toString () }')]` ) ).to.equal ( true );
        expect ( await helper.ifElementDisplayed ( `.//div[contains(text(),'${ jp.query ( await jsoncaowner , '$..CURRENCY_CODE' ).toString () }')]` ) ).to.equal ( true );
      }
    }
  });
  await helper.screenshot('Verify Account Name - Auth Panel');
  logger.info('Validated Account Name for Auth Panel');
});


Then(/^Search the Auth Panel in searchscreen and "([^"]*)" "([^"]*)" workflow$/, async function (action, userAction) {
  if (action === 'Verify' && userAction === 'new') {
    await AuthPanelPage.searchUsersNValidateWorkFlow(this.resourceData, 'Pending Approval - Register', undefined);
  } if (action === 'Approve' && userAction === 'new') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionApprove = {
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
      flag: true,
      db: {
        QUERY: this.queryGroup,
        version: '1',
      },
    };
    logger.info(actionApprove);
    await AuthPanelPage.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionApprove);
  } else if (action === 'Approve' && userAction === 'modify') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionPendingApproveModified = {
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
      flag: true,
      db: {
        QUERY: this.queryGroup,
        version: '2',
      },
    };
    await AuthPanelPage.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionPendingApproveModified);
  }
  await helper.screenshot(`SearchScreen ${action}`);
});
Then(/^Validate against CA for Auth Panel "([^"]*)" "([^"]*)" workflow$/, { wrapperOptions: { retry: 20 } }, async function (action, userAction) {
  if (action === 'Approve' && userAction === 'new') {
    const actionApprove = {
      flag: true,
      db: {
        QUERY: this.queryGroup,
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
        QUERY: this.queryGroup,
        version: '2',
      },
    };
    await BankUsers.db(actionPendingApproveModified);
  }
});

Then(/^BankUser edits the auth panel$/, async function () {
  await AuthPanelPage.searchUsers('customerData');
  await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);
  const newauthpaneldesc = faker.name.findName().toString().replace(/[&/\\#,+()$~%.'":*?<>{}]/g, '');
  this.newauthpaneldesc = newauthpaneldesc;
  await AuthPanelPage.editAuthPanelDesc(newauthpaneldesc);
  await AuthPanelPage.approveUserFromGrid();
  if ((process.env.DB_CHECK).toString() === 'true') {
    const panelId = jp.query(await (
      await DBConnection.run(this.queryGroup)
    ), '$..PANEL_ID').toString();
    this.panelName = `${this.authPanelName} (${panelId})`;
    logger.info(this.panelName);
    const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
    logger.info(registerUserNotificationMessage);
    expect(registerUserNotificationMessage).to.be.oneOf([`Changes to Panel: ${this.panelName} have been saved.`, '']);
  }
});

Then(/^Reject the changes and validate the "([^"]*)" notification messages for Auth Panel$/, async function (action) {
  await AuthPanelPage.searchUsers('customerData');
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.UserPendingModifiedReject).then(async () => {
    if (action === 'modified') {
      await AuthPanelPage.rejectPendingModifiedApprovalFromGrid();
      const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
      logger.info(registerUserNotificationMessage);
//       expect(registerUserNotificationMessage).to.be.oneOf([`Changes to Panel: ${this.panelName} was rejected.`, '']);
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
      await AuthPanelPage.rejectPendingModifiedApprovalFromGrid();
      const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
      logger.info(registerUserNotificationMessage);
      expect(registerUserNotificationMessage).to.be.oneOf([`Deletion of Panel: ${this.panelName} was rejected.`, '']);
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

Then(/^validate the elements present in the Auth Panel screen$/, async () => {
  await helper.waitForDisplayed(MenuBar.selectors.authPanel, 10000);
  await helper.click(MenuBar.selectors.authPanel);
  await helper.waitForDisplayed(selectors.AuthPanel.customerId);

  expect(await helper.ifElementDisplayed(selectors.AuthPanel.customerId)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.AuthPanel.customerName)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.AuthPanel.authPanel_Name)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.AuthPanel.status)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.AuthPanel.workflow)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.AuthPanel.searchBtn)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.AuthPanel.saveBtn)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.AuthPanel.resetBtn)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.AuthPanel.statusNew)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.AuthPanel.statusEnabled)).to.equal(true);
  await helper.screenshot('validate screen- Auth Panel');
});
Then(/^Validate the "([^"]*)" message for authPanel$/, async function (status) {
  if (status === 'register') {
    const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

    logger.info(NotificationMessage);
		 expect(NotificationMessage).to.be.oneOf(['Request Submitted Successfully.', '']);
  } else if (status === 'modify') {
    const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

    logger.info(NotificationMessage);
		 expect(NotificationMessage).to.be.oneOf([`Changes to Panel: ${this.authPanelName} has been saved.`, '']);

    // Validate on the UI
  } else if (status === 'deregister') {
    const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

    logger.info(NotificationMessage);
  }
});

Then(/^executing additional CA validations for Auth Panel - "([^"]*)"$/, async function (action) {
  if ((process.env.DB_CHECK).toString() === 'true') {
    logger.info('Executing additional CA validations - Auth Panel');
    const jsoncaowner = await DBConnection.run(this.queryGroup);
    if (action == 'Create') {
      const jsoncaowner1 = await DBConnection.run(this.queryGroupAccount);
      logger.info(await jsoncaowner1);
      const jsoncaowner2 = await DBConnection.run(this.queryResource);
      const accountId = jp.query(await jsoncaowner2, '$..ACCOUNT_ID').toString();
      expect(jp.query(await jsoncaowner1, '$..ACCOUNT_ID').toString()).to.be.equal(accountId);
      logger.info('Validated Auth Panel Account');
    } else if (action == 'Modify') {
      expect(jp.query(await jsoncaowner, '$..DESCRIPTION').toString()).to.be.equal(this.newauthpaneldesc);
      logger.info(`Validated Modified Auth Panel Description - ${this.newauthpaneldesc}`);
    }
  }
});

Then(/^BankUser validates the Audit Scenarios for Auth Panel$/, async function (details) {
  logger.info('Audit Auth panel');
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
  await helper.waitForDisplayed(MenuBar.selectors.authPanel);
  await helper.click(MenuBar.selectors.authPanel);
  const authpaneldetail = [this.resourceGroupData, this.newauthpaneldesc];
  logger.info(authpaneldetail);
  await AuthPanelPage.searchUsers(this.resourceGroupData);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
  // await helper.pause(2);
  await helper.click(selectors.Users.auditTab);
  await helper.waitForDisplayed('div[id=\'authPanel-audit-grid\']', 1500);
  logger.info(this.accountNumberArray);
  for (const i in auditvalidations) {
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].description)).to.be.equal(true);
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].action)).to.be.equal(true);
    if (auditvalidations[i].action.includes('Created') || auditvalidations[i].action.includes('Modified')) {
      const x = await auditvalidations[i].action.includes('Created');
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      await AuthPanelPage.auditValidation(await x, authpaneldetail);
    } else if (auditvalidations[i].action.includes('Approved')) {
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      await helper.screenshot('Audit-AuthPanel-Approved');
      logger.info('Validated Audit-Approved Auth Panel');
      await helper.click('//i[@class=\'fa fa-times\']');
    }
  }
  await helper.click(selectors.Resource.closePreview);
});
